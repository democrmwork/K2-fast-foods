<?php
/**
 * Validator Helper
 * Rule-based field validation. Compatible with PHP 8.0+.
 */
namespace Helpers;

class Validator
{
    private array $errors = [];

    public function validate(array $data, array $rules): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $ruleSet) {
            $ruleList = explode('|', $ruleSet);
            $value    = isset($data[$field]) ? $data[$field] : null;

            foreach ($ruleList as $rule) {
                if ($rule === 'required') {
                    if ($value === null || $value === '') {
                        $this->errors[$field][] = "{$field} is required";
                    }
                } elseif (strpos($rule, 'min:') === 0) {
                    $min = (int) substr($rule, 4);
                    if ($value !== null && strlen((string) $value) < $min) {
                        $this->errors[$field][] = "{$field} must be at least {$min} characters";
                    }
                } elseif (strpos($rule, 'max:') === 0) {
                    $max = (int) substr($rule, 4);
                    if ($value !== null && strlen((string) $value) > $max) {
                        $this->errors[$field][] = "{$field} must not exceed {$max} characters";
                    }
                } elseif ($rule === 'email') {
                    if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $this->errors[$field][] = "{$field} must be a valid email address";
                    }
                }
            }
        }

        return empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }
}
