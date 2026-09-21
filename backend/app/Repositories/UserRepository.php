<?php
/**
 * UserRepository
 * Purpose:        All database operations for the users table.
 * Responsibility: CRUD — no business logic.
 * Dependencies:   PDO connection via getDbConnection().
 */
namespace Repositories;

use Models\User;
use PDO;

class UserRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = getDbConnection();
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (name, email, password, phone, role, is_active, created_at)
             VALUES (:name, :email, :password, :phone, :role, 1, NOW())'
        );
        $stmt->execute([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'phone'    => $data['phone'],
            'role'     => $data['role'] ?? 'customer',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updatePassword(int $id, string $hashedPassword): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET password = ? WHERE id = ?');
        return $stmt->execute([$hashedPassword, $id]);
    }

    public function all(int $page = 1, int $perPage = 20): array
    {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare('SELECT id,name,email,phone,role,is_active,created_at FROM users LIMIT ? OFFSET ?');
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }
}
