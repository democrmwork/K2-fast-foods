<?php
/**
 * AuthController
 * Handles HTTP request/response for auth endpoints.
 * Compatible with PHP 8.0+ / XAMPP Windows.
 */
namespace Controllers;

use Helpers\Response;
use Helpers\Validator;
use Middleware\AuthMiddleware;
use Services\AuthService;
use Exceptions\AppException;

class AuthController
{
    private AuthService $authService;
    private Validator   $validator;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->validator   = new Validator();
    }

    /** POST /api/v1/auth/register */
    public function register(): void
    {
        $data = $this->getJsonBody();

        if (!$this->validator->validate($data, [
            'name'     => 'required|min:2|max:100',
            'email'    => 'required|email',
            'password' => 'required|min:8|max:255',
            'phone'    => 'required|min:10|max:20',
        ])) {
            Response::validationError($this->validator->errors());
        }

        try {
            $result = $this->authService->register($data);
            Response::success($result, 'Account created successfully', 201);
        } catch (AppException $e) {
            Response::error($e->getMessage(), $e->getStatusCode());
        }
    }

    /** POST /api/v1/auth/login */
    public function login(): void
    {
        $data = $this->getJsonBody();

        if (!$this->validator->validate($data, [
            'email'    => 'required|email',
            'password' => 'required',
        ])) {
            Response::validationError($this->validator->errors());
        }

        try {
            $result = $this->authService->login($data);
            Response::success($result, 'Login successful');
        } catch (AppException $e) {
            Response::error($e->getMessage(), $e->getStatusCode());
        }
    }

    /** GET /api/v1/auth/profile */
    public function profile(): void
    {
        $jwtPayload = AuthMiddleware::handle();
        try {
            $user = $this->authService->profile((int) $jwtPayload['sub']);
            Response::success($user, 'Profile retrieved');
        } catch (AppException $e) {
            Response::error($e->getMessage(), $e->getStatusCode());
        }
    }

    /** POST /api/v1/auth/logout */
    public function logout(): void
    {
        AuthMiddleware::handle();
        Response::success(null, 'Logged out successfully');
    }

    private function getJsonBody(): array
    {
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }
}
