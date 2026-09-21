<?php
/**
 * AdminController
 * Purpose:        Handle HTTP requests for admin, menu, order and customer endpoints.
 * Responsibility: Parse input → call service/repository → return JSON.
 * Dependencies:   AuthMiddleware, UserRepository, Response.
 */
namespace Controllers;

use Helpers\Response;
use Helpers\Validator;
use Middleware\AuthMiddleware;
use Repositories\UserRepository;

class AdminController
{
    private UserRepository $userRepo;
    private Validator $validator;

    public function __construct()
    {
        $this->userRepo  = new UserRepository();
        $this->validator = new Validator();
    }

    // ── Admin Dashboard ────────────────────────────────────────────────────
    public function dashboard(): void
    {
        AuthMiddleware::requireRole('admin');
        $db = getDbConnection();

        $todayOrders  = $db->query("SELECT COUNT(*) FROM orders WHERE DATE(placed_at) = CURDATE()")->fetchColumn();
        $todayRevenue = $db->query("SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE DATE(placed_at) = CURDATE() AND status != 'cancelled'")->fetchColumn();
        $pending      = $db->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
        $riders       = $db->query("SELECT COUNT(*) FROM riders WHERE is_active = 1")->fetchColumn();

        Response::success([
            'today_orders'  => (int) $todayOrders,
            'today_revenue' => (float) $todayRevenue,
            'pending_orders'=> (int) $pending,
            'active_riders' => (int) $riders,
        ]);
    }

    // ── Admin – Orders ─────────────────────────────────────────────────────
    public function listOrders(): void
    {
        AuthMiddleware::requireRole('admin');
        $db      = getDbConnection();
        $status  = $_GET['status']   ?? null;
        $page    = max(1, (int) ($_GET['page']     ?? 1));
        $perPage = min(50, (int) ($_GET['per_page'] ?? 20));
        $offset  = ($page - 1) * $perPage;

        $where = $status ? "WHERE o.status = " . $db->quote($status) : '';
        $total = $db->query("SELECT COUNT(*) FROM orders o {$where}")->fetchColumn();

        $stmt = $db->prepare("
            SELECT o.*, u.name AS user_name, u.phone AS user_phone
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            {$where}
            ORDER BY o.placed_at DESC
            LIMIT {$perPage} OFFSET {$offset}
        ");
        $stmt->execute();
        $orders = array_map(function ($o) {
            $o['user'] = ['name' => $o['user_name'], 'phone' => $o['user_phone']];
            unset($o['user_name'], $o['user_phone']);
            return $o;
        }, $stmt->fetchAll());

        Response::success([
            'data' => $orders,
            'meta' => ['total' => (int) $total, 'per_page' => $perPage, 'current_page' => $page],
        ]);
    }

    public function updateOrderStatus(int $orderId): void
    {
        AuthMiddleware::requireRole('admin');
        $data   = $this->jsonBody();
        $status = $data['status'] ?? '';
        $valid  = ['accepted','preparing','out_for_delivery','delivered','cancelled'];

        if (!in_array($status, $valid)) {
            Response::error('Invalid status value', 422);
        }

        $db   = getDbConnection();
        $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $orderId]);

        if ($stmt->rowCount() === 0) Response::error('Order not found', 404);
        Response::success(['id' => $orderId, 'status' => $status], 'Order status updated');
    }

    // ── Admin – Menu ───────────────────────────────────────────────────────
    public function createMenuItem(): void
    {
        AuthMiddleware::requireRole('admin');
        $data = $this->jsonBody();

        if (!$this->validator->validate($data, ['name' => 'required|max:150', 'price' => 'required', 'category_id' => 'required'])) {
            Response::validationError($this->validator->errors());
        }

        $db   = getDbConnection();
        $stmt = $db->prepare("INSERT INTO menu_items (category_id,name,description,price,image_url,is_available,sort_order) VALUES (?,?,?,?,?,?,0)");
        $stmt->execute([$data['category_id'], $data['name'], $data['description'] ?? null, $data['price'], $data['image_url'] ?? null, (int) ($data['is_available'] ?? 1)]);

        Response::success(['id' => (int) $db->lastInsertId()], 'Menu item created', 201);
    }

    public function updateMenuItem(int $id): void
    {
        AuthMiddleware::requireRole('admin');
        $data = $this->jsonBody();
        $db   = getDbConnection();

        $fields = []; $params = [];
        foreach (['name','description','price','image_url','is_available','category_id','sort_order'] as $f) {
            if (array_key_exists($f, $data)) { $fields[] = "{$f} = ?"; $params[] = $data[$f]; }
        }
        if (empty($fields)) Response::error('No fields to update', 422);

        $params[] = $id;
        $db->prepare("UPDATE menu_items SET " . implode(',', $fields) . " WHERE id = ?")->execute($params);
        Response::success(['id' => $id], 'Menu item updated');
    }

    public function deleteMenuItem(int $id): void
    {
        AuthMiddleware::requireRole('admin');
        $db   = getDbConnection();
        $stmt = $db->prepare("DELETE FROM menu_items WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) Response::error('Item not found', 404);
        Response::success(null, 'Menu item deleted');
    }

    // ── Admin – Users ──────────────────────────────────────────────────────
    public function listUsers(): void
    {
        AuthMiddleware::requireRole('admin');
        $users = $this->userRepo->all();
        Response::success($users);
    }

    public function updateUser(int $id): void
    {
        AuthMiddleware::requireRole('admin');
        $data = $this->jsonBody();
        $db   = getDbConnection();

        if (isset($data['is_active'])) {
            $db->prepare("UPDATE users SET is_active = ? WHERE id = ? AND role != 'admin'")->execute([(int) $data['is_active'], $id]);
        }
        Response::success(['id' => $id], 'User updated');
    }

    // ── Public – Menu ──────────────────────────────────────────────────────
    public function publicMenu(): void
    {
        $db   = getDbConnection();
        $cats = $db->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order")->fetchAll();

        foreach ($cats as &$cat) {
            $stmt = $db->prepare("SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order");
            $stmt->execute([$cat['id']]);
            $cat['items'] = $stmt->fetchAll();
        }
        Response::success(['categories' => $cats]);
    }

    public function publicMenuItem(int $id): void
    {
        $db   = getDbConnection();
        $stmt = $db->prepare("SELECT * FROM menu_items WHERE id = ? AND is_available = 1");
        $stmt->execute([$id]);
        $item = $stmt->fetch();
        if (!$item) Response::error('Item not found', 404);
        Response::success($item);
    }

    // ── Customer – Orders ──────────────────────────────────────────────────
    public function placeOrder(): void
    {
        $user = AuthMiddleware::handle();
        $data = $this->jsonBody();

        if (!$this->validator->validate($data, ['delivery_address' => 'required'])) {
            Response::validationError($this->validator->errors());
        }
        if (empty($data['items'])) Response::error('Cart is empty', 422);

        $db = getDbConnection();
        $db->beginTransaction();
        try {
            $total = 0;
            foreach ($data['items'] as $item) {
                $row = $db->prepare("SELECT price FROM menu_items WHERE id = ? AND is_available = 1");
                $row->execute([$item['menu_item_id']]);
                $price = $row->fetchColumn();
                if ($price === false) throw new \RuntimeException("Item {$item['menu_item_id']} unavailable");
                $total += $price * $item['qty'];
            }

            $stmt = $db->prepare("INSERT INTO orders (user_id,status,total_amount,delivery_address,special_notes,estimated_time,placed_at) VALUES (?,?,?,?,?,30,NOW())");
            $stmt->execute([$user['sub'], 'pending', $total, $data['delivery_address'], $data['notes'] ?? null]);
            $orderId = (int) $db->lastInsertId();

            foreach ($data['items'] as $item) {
                $price = $db->prepare("SELECT price FROM menu_items WHERE id = ?");
                $price->execute([$item['menu_item_id']]);
                $db->prepare("INSERT INTO order_items (order_id,menu_item_id,quantity,unit_price) VALUES (?,?,?,?)")
                   ->execute([$orderId, $item['menu_item_id'], $item['qty'], $price->fetchColumn()]);
            }

            $db->commit();
            Response::success(['order_id' => $orderId, 'status' => 'pending', 'estimated_minutes' => 30], 'Order placed', 201);
        } catch (\Exception $e) {
            $db->rollBack();
            Response::error('Failed to place order: ' . $e->getMessage(), 500);
        }
    }

    public function myOrders(): void
    {
        $user = AuthMiddleware::handle();
        $db   = getDbConnection();
        $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY placed_at DESC");
        $stmt->execute([$user['sub']]);
        Response::success($stmt->fetchAll());
    }

    public function trackOrder(int $orderId): void
    {
        $user = AuthMiddleware::handle();
        $db   = getDbConnection();

        $stmt = $db->prepare("SELECT o.*, d.rider_lat, d.rider_lng, d.status AS delivery_status, u.name AS rider_name FROM orders o LEFT JOIN deliveries d ON d.order_id = o.id LEFT JOIN riders r ON r.id = d.rider_id LEFT JOIN users u ON u.id = r.user_id WHERE o.id = ? AND o.user_id = ?");
        $stmt->execute([$orderId, $user['sub']]);
        $order = $stmt->fetch();

        if (!$order) Response::error('Order not found', 404);

        Response::success([
            'status'        => $order['status'],
            'eta_minutes'   => $order['estimated_time'],
            'rider'         => $order['rider_name'] ? ['name' => $order['rider_name'], 'lat' => $order['rider_lat'], 'lng' => $order['rider_lng']] : null,
        ]);
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private function jsonBody(): array
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }
}
