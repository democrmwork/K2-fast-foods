<?php
/**
 * K2 Fast Foods API — Entry Point
 * CORS handled 100% in PHP. No mod_headers needed.
 * Compatible with PHP 8.0+ / XAMPP Windows.
 */

ob_start();

// ── CORS headers — very first thing ───────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=UTF-8');

// Kill OPTIONS preflight immediately
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    echo '{"success":true,"message":"preflight ok"}';
    exit;
}

// ── Bootstrap ──────────────────────────────────────────────────────────────
define('BASE_PATH', dirname(__DIR__));

// Load .env
$envFile = BASE_PATH . DIRECTORY_SEPARATOR . '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($lines)) {
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
                continue;
            }
            $parts = explode('=', $line, 2);
            if (count($parts) === 2) {
                $_ENV[trim($parts[0])] = trim($parts[1]);
            }
        }
    }
}

// ── Catch all errors and return JSON (never HTML) ─────────────────────────
set_error_handler(function($severity, $message, $file, $line) {
    ob_end_clean();
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $message, 'file' => basename($file), 'line' => $line]);
    exit;
});

set_exception_handler(function($e) {
    ob_end_clean();
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage(), 'file' => basename($e->getFile()), 'line' => $e->getLine()]);
    exit;
});

// ── Autoloader ────────────────────────────────────────────────────────────
spl_autoload_register(function (string $class) {
    $file = BASE_PATH . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR
          . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// ── Load database config ──────────────────────────────────────────────────
require_once BASE_PATH . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

// ── Dispatch ──────────────────────────────────────────────────────────────
ob_end_clean();
require_once BASE_PATH . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'api.php';
