<?php
/**
 * JWT Helper — minimal HS256 encode/decode.
 * No external library needed. Compatible with PHP 8.0+.
 */
namespace Helpers;

class JWT
{
    public static function encode(array $payload, string $secret): string
    {
        $header    = self::b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $body      = self::b64url(json_encode($payload));
        $signature = self::b64url(hash_hmac('sha256', "{$header}.{$body}", $secret, true));
        return "{$header}.{$body}.{$signature}";
    }

    public static function decode(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($h, $p, $s) = $parts;

        $expected = self::b64url(hash_hmac('sha256', "{$h}.{$p}", $secret, true));
        if (!hash_equals($expected, $s)) {
            return null;
        }

        $payload = json_decode(base64_decode(strtr($p, '-_', '+/')), true);

        if (!is_array($payload)) {
            return null;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token expired
        }

        return $payload;
    }

    private static function b64url(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
