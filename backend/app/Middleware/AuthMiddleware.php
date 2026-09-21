<?php
/**
 * AuthMiddleware
 * Guards routes requiring a valid JWT.
 * Usage: $user = AuthMiddleware::handle();
 *        $admin = AuthMiddleware::requireRole('admin');
 * Compatible with PHP 8.0+
 */
namespace Middleware;

use Helpers\JWT;
use Helpers\Response;

class AuthMiddleware
{
    public static function handle(): array
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        // Some servers put it here instead
        if (empty($authHeader) && function_exists('getallheaders')) {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (strpos($authHeader, 'Bearer ') !== 0) {
            Response::error('Unauthorised — no token provided', 401);
        }

        $token   = substr($authHeader, 7);
        $secret  = $_ENV['JWT_SECRET'] ?? '';
        $payload = JWT::decode($token, $secret);

        if (!$payload) {
            Response::error('Unauthorised — invalid or expired token', 401);
        }

        return $payload;
    }

    public static function requireRole(string $role): array
    {
        $payload = self::handle();
        if (($payload['role'] ?? '') !== $role) {
            Response::error('Forbidden — insufficient permissions', 403);
        }
        return $payload;
    }
}
