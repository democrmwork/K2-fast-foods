<?php
/**
 * Application Configuration
 * Central config values used across the app.
 */

return [
    'name'    => $_ENV['APP_NAME']  ?? 'K2FastFoods',
    'env'     => $_ENV['APP_ENV']   ?? 'production',
    'debug'   => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'url'     => $_ENV['APP_URL']   ?? 'http://localhost',
    'jwt'     => [
        'secret' => $_ENV['JWT_SECRET'] ?? '',
        'expiry' => (int) ($_ENV['JWT_EXPIRY'] ?? 86400),
    ],
    'cors'    => [
        'allowed_origins' => explode(',', $_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'),
    ],
];
