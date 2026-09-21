<?php
/**
 * AuthService
 * Business logic for authentication flows.
 * Compatible with PHP 8.0+.
 */
namespace Services;

use Helpers\JWT;
use Repositories\UserRepository;
use Exceptions\AppException;

class AuthService
{
    private UserRepository $userRepo;
    private string $jwtSecret;
    private int    $jwtExpiry;

    public function __construct()
    {
        $this->userRepo  = new UserRepository();
        $this->jwtSecret = isset($_ENV['JWT_SECRET']) ? $_ENV['JWT_SECRET'] : '';
        $this->jwtExpiry = (int) (isset($_ENV['JWT_EXPIRY']) ? $_ENV['JWT_EXPIRY'] : 86400);
    }

    public function register(array $data): array
    {
        if ($this->userRepo->findByEmail($data['email'])) {
            throw new AppException('An account with this email already exists', 409);
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);

        $userId = $this->userRepo->create([
            'name'     => htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8'),
            'email'    => strtolower(trim($data['email'])),
            'password' => $hashedPassword,
            'phone'    => $data['phone'],
            'role'     => 'customer',
        ]);

        $user = $this->userRepo->findById($userId);
        return [
            'user'  => $this->sanitiseUser($user),
            'token' => $this->generateToken($user),
        ];
    }

    public function login(array $data): array
    {
        $user = $this->userRepo->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            throw new AppException('Invalid email or password', 401);
        }

        if (!$user['is_active']) {
            throw new AppException('Your account has been deactivated. Please contact support.', 403);
        }

        return [
            'user'  => $this->sanitiseUser($user),
            'token' => $this->generateToken($user),
        ];
    }

    public function profile(int $userId): array
    {
        $user = $this->userRepo->findById($userId);
        if (!$user) {
            throw new AppException('User not found', 404);
        }
        return $this->sanitiseUser($user);
    }

    private function generateToken(array $user): string
    {
        return JWT::encode([
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
            'iat'   => time(),
            'exp'   => time() + $this->jwtExpiry,
        ], $this->jwtSecret);
    }

    private function sanitiseUser(array $user): array
    {
        unset($user['password']);
        return $user;
    }
}
