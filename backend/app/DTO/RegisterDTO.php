<?php
/**
 * RegisterDTO — Data Transfer Object for registration input.
 * Compatible with PHP 8.0+
 */
namespace DTO;

class RegisterDTO
{
    public string  $name;
    public string  $email;
    public string  $password;
    public ?string $phone;

    public function __construct(string $name, string $email, string $password, ?string $phone = null)
    {
        $this->name     = $name;
        $this->email    = $email;
        $this->password = $password;
        $this->phone    = $phone;
    }
}
