<?php
/**
 * AppException — Base custom exception.
 * Carries HTTP status code alongside message for consistent error handling.
 */
namespace Exceptions;

class AppException extends \RuntimeException
{
    public function __construct(string $message, private int $statusCode = 500)
    {
        parent::__construct($message, $statusCode);
    }
    public function getStatusCode(): int { return $this->statusCode; }
}
