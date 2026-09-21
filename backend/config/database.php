<?php
/**
 * Database Configuration
 * Returns a PDO connection using credentials from $_ENV.
 * Compatible with PHP 8.0+ / XAMPP Windows.
 */

function getDbConnection(): PDO
{
    $host     = $_ENV['DB_HOST']     ?? '127.0.0.1';
    $port     = $_ENV['DB_PORT']     ?? '3306';
    $dbname   = $_ENV['DB_DATABASE'] ?? 'k2_fast_foods';
    $username = $_ENV['DB_USERNAME'] ?? 'root';
    $password = $_ENV['DB_PASSWORD'] ?? '';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed. Check your .env DB credentials.',
            'detail'  => $e->getMessage(),
        ]);
        exit;
    }
}
