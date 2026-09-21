<?php
/**
 * API Routes — v1
 * Compatible with PHP 8.0+ on XAMPP Windows.
 * Works whether hosted at root (localhost) or subfolder (localhost/k2fastfoods/...)
 */

use Controllers\AuthController;
use Controllers\AdminController;
use Helpers\Response;

// Get URI and strip query string
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Strip everything up to and including /api/v1
// Works for: /api/v1/... AND /k2fastfoods/backend/public/api/v1/...
$route = preg_replace('#^.*/api/v1#', '', $uri);
$route = rtrim($route, '/');
if ($route === '') {
    $route = '/';
}

$auth  = new AuthController();
$admin = new AdminController();

// ── Auth ──────────────────────────────────────────────────────────────────
if ($route === '/auth/register' && $method === 'POST') {
    $auth->register();

} elseif ($route === '/auth/login' && $method === 'POST') {
    $auth->login();

} elseif ($route === '/auth/profile' && $method === 'GET') {
    $auth->profile();

} elseif ($route === '/auth/logout' && $method === 'POST') {
    $auth->logout();

// ── Admin – Dashboard ─────────────────────────────────────────────────────
} elseif ($route === '/admin/dashboard' && $method === 'GET') {
    $admin->dashboard();

// ── Admin – Orders ────────────────────────────────────────────────────────
} elseif ($route === '/admin/orders' && $method === 'GET') {
    $admin->listOrders();

} elseif (preg_match('#^/admin/orders/(\d+)/status$#', $route, $m) && $method === 'PUT') {
    $admin->updateOrderStatus((int) $m[1]);

// ── Admin – Menu ──────────────────────────────────────────────────────────
} elseif ($route === '/admin/menu' && $method === 'POST') {
    $admin->createMenuItem();

} elseif (preg_match('#^/admin/menu/(\d+)$#', $route, $m) && $method === 'PUT') {
    $admin->updateMenuItem((int) $m[1]);

} elseif (preg_match('#^/admin/menu/(\d+)$#', $route, $m) && $method === 'DELETE') {
    $admin->deleteMenuItem((int) $m[1]);

// ── Admin – Users ─────────────────────────────────────────────────────────
} elseif ($route === '/admin/users' && $method === 'GET') {
    $admin->listUsers();

} elseif (preg_match('#^/admin/users/(\d+)$#', $route, $m) && $method === 'PUT') {
    $admin->updateUser((int) $m[1]);

// ── Public – Menu ─────────────────────────────────────────────────────────
} elseif ($route === '/menu' && $method === 'GET') {
    $admin->publicMenu();

} elseif (preg_match('#^/menu/(\d+)$#', $route, $m) && $method === 'GET') {
    $admin->publicMenuItem((int) $m[1]);

// ── Customer – Orders ─────────────────────────────────────────────────────
} elseif ($route === '/orders' && $method === 'POST') {
    $admin->placeOrder();

} elseif ($route === '/orders' && $method === 'GET') {
    $admin->myOrders();

} elseif (preg_match('#^/orders/(\d+)/track$#', $route, $m) && $method === 'GET') {
    $admin->trackOrder((int) $m[1]);

// ── Health check ──────────────────────────────────────────────────────────
} elseif ($route === '/health' && $method === 'GET') {
    Response::success([
        'status' => 'ok',
        'app'    => 'K2 Fast Foods API v1',
        'php'    => PHP_VERSION,
        'route'  => $route,
    ]);

// ── 404 ───────────────────────────────────────────────────────────────────
} else {
    Response::error('Route [' . $method . '] ' . $route . ' not found', 404);
}
