-- Migration 001: Create users table
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)                              NOT NULL,
    email      VARCHAR(150)                              NOT NULL UNIQUE,
    password   VARCHAR(255)                              NOT NULL,
    phone      VARCHAR(20)                               NOT NULL,
    role       ENUM('customer','admin','rider')          NOT NULL DEFAULT 'customer',
    is_active  TINYINT(1)                                NOT NULL DEFAULT 1,
    created_at TIMESTAMP                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email    (email),
    INDEX idx_role     (role),
    INDEX idx_is_active(is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
