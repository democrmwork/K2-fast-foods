<?php
/**
 * Response Helper
 * Sends standardised JSON API responses.
 * Compatible with PHP 8.0+ (no 'never' return type).
 */
namespace Helpers;

class Response
{
    public static function success($data = null, string $message = 'OK', int $code = 200): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function error(string $message, int $code = 400, $errors = null): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function validationError(array $errors): void
    {
        self::error('Validation failed', 422, $errors);
    }
}
