<?php
/**
 * User Model
 * Plain data object representing a user record.
 * No database logic here — that belongs in UserRepository.
 * Compatible with PHP 8.0+
 */
namespace Models;

class User
{
    public ?int    $id;
    public string  $name;
    public string  $email;
    public string  $phone;
    public string  $role;
    public bool    $isActive;
    public ?string $createdAt;

    public function __construct(
        ?int    $id,
        string  $name,
        string  $email,
        string  $phone,
        string  $role,
        bool    $isActive,
        ?string $createdAt = null
    ) {
        $this->id        = $id;
        $this->name      = $name;
        $this->email     = $email;
        $this->phone     = $phone;
        $this->role      = $role;
        $this->isActive  = $isActive;
        $this->createdAt = $createdAt;
    }

    /** Return safe public representation (no password). */
    public function toArray(): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'role'       => $this->role,
            'is_active'  => $this->isActive,
            'created_at' => $this->createdAt,
        ];
    }
}
