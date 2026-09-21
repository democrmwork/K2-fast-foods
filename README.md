<<<<<<< HEAD
# K2 Fast Foods 🍔

> **Bold flavours. Fast delivery.**
> Full-stack food ordering web application with online menu, order placement, live delivery tracking, and admin panel.

---

## Brand Identity
| Property   | Value                                     |
|------------|-------------------------------------------|
| Brand Name | K2 Fast Foods                             |
| Tagline    | Bold flavours. Fast delivery.             |
| Primary    | #D0021B (K2 Red)                          |
| Accent     | #F5A700 (K2 Gold)                         |
| Dark       | #111111 (Midnight Black)                  |
| Fonts      | Bebas Neue (display) + Poppins (body)     |

---

## Tech Stack
| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | PHP 8+, REST API, MVC, JWT Auth, MySQL          |
| Frontend | React 18, React Router v6, Axios, Context API   |
| Database | MySQL 8 with migrations and seed data           |
| Server   | Apache/Nginx with .htaccess rewrite             |

---

## Project Structure
```
k2-fast-foods/
├── backend/
│   ├── app/
│   │   ├── Controllers/     # AuthController, AdminController
│   │   ├── Services/        # AuthService (business logic)
│   │   ├── Repositories/    # UserRepository (DB queries)
│   │   ├── Models/          # User model
│   │   ├── Middleware/      # AuthMiddleware (JWT guard)
│   │   ├── Helpers/         # Response, Validator, JWT
│   │   └── Exceptions/      # AppException
│   ├── config/              # database.php, app.php
│   ├── database/
│   │   ├── migrations/      # 001_users, 002_menu, 003_orders
│   │   └── seeders/         # 001_seed_admin_and_menu
│   ├── routes/              # api.php
│   ├── public/              # index.php (entry point), .htaccess
│   └── .env                 # Environment config
│
└── frontend/
    ├── public/              # index.html
    └── src/
        ├── pages/
        │   ├── auth/        # LoginPage, RegisterPage
        │   ├── customer/    # HomePage, MenuPage, CartPage, OrdersPage, TrackPage
        │   └── admin/       # AdminDashboard, AdminOrders, AdminMenu, AdminUsers
        ├── layouts/         # CustomerLayout, AdminLayout
        ├── services/        # api.js, authService, menuService, orderService
        ├── store/           # AuthContext (global auth state)
        ├── routes/          # AppRoutes (with auth guards)
        ├── hooks/           # useAuth
        └── styles/          # global.css (K2 brand theme)
```

---

## Installation

### Requirements
- PHP 8.0+
- MySQL 8.0+
- Node.js 18+ and npm
- Apache or Nginx

### 1. Clone / Extract
```bash
cd /var/www/html   # or your web root
# Copy the k2-fast-foods folder here
```

### 2. Database Setup
```bash
mysql -u root -p -e "CREATE DATABASE k2_fast_foods CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations in order
mysql -u root -p k2_fast_foods < backend/database/migrations/001_create_users_table.sql
mysql -u root -p k2_fast_foods < backend/database/migrations/002_create_menu_tables.sql
mysql -u root -p k2_fast_foods < backend/database/migrations/003_create_order_tables.sql

# Seed demo data (admin user + sample menu)
mysql -u root -p k2_fast_foods < backend/database/seeders/001_seed_admin_and_menu.sql
```

### 3. Backend Configuration
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET
```

### 4. Apache Virtual Host (backend)
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/k2-fast-foods/backend/public
    ServerName api.k2fastfoods.local

    <Directory /var/www/html/k2-fast-foods/backend/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```
Enable: `sudo a2enmod rewrite && sudo systemctl restart apache2`

### 5. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env    # Set REACT_APP_API_URL to your backend URL

# Development
npm start               # Runs on http://localhost:3000

# Production build
npm run build           # Outputs to frontend/build/
```

---

## Default Login Credentials (after seeding)

| Role     | Email                         | Password   |
|----------|-------------------------------|------------|
| Admin    | admin@k2fastfoods.pk          | Admin@1234 |
| Customer | customer@k2fastfoods.pk       | Admin@1234 |

> ⚠️ Change passwords immediately after first login in production.

---

## API Endpoints

### Auth
| Method | Endpoint              | Auth     | Description          |
|--------|-----------------------|----------|----------------------|
| POST   | /api/v1/auth/register | Public   | Create account       |
| POST   | /api/v1/auth/login    | Public   | Login, returns JWT   |
| GET    | /api/v1/auth/profile  | Required | Get current user     |
| POST   | /api/v1/auth/logout   | Required | Logout               |

### Menu (Public)
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/v1/menu      | All categories + items   |
| GET    | /api/v1/menu/{id} | Single item              |

### Orders (Customer)
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| POST   | /api/v1/orders             | Place order       |
| GET    | /api/v1/orders             | My orders         |
| GET    | /api/v1/orders/{id}/track  | Track order       |

### Admin
| Method | Endpoint                          | Description           |
|--------|-----------------------------------|-----------------------|
| GET    | /api/v1/admin/dashboard           | KPI stats             |
| GET    | /api/v1/admin/orders              | All orders (filtered) |
| PUT    | /api/v1/admin/orders/{id}/status  | Update order status   |
| POST   | /api/v1/admin/menu                | Add menu item         |
| PUT    | /api/v1/admin/menu/{id}           | Update menu item      |
| DELETE | /api/v1/admin/menu/{id}           | Delete menu item      |
| GET    | /api/v1/admin/users               | All users             |
| PUT    | /api/v1/admin/users/{id}          | Activate/deactivate   |

---

## Security Checklist
- [x] Passwords hashed with bcrypt (cost 12)
- [x] JWT HS256 with expiry (24h default)
- [x] Role-based access control (customer / admin / rider)
- [x] SQL injection protection via PDO prepared statements
- [x] XSS protection via htmlspecialchars on user input
- [x] CORS restricted to allowed origins
- [x] .env blocked via .htaccess
- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS in production
- [ ] Set APP_DEBUG=false in production

---

## Deployment (Production)
1. Set `APP_ENV=production`, `APP_DEBUG=false` in `.env`
2. Change `JWT_SECRET` to a strong random string (min 64 chars)
3. Run `npm run build` and serve `frontend/build/` as static files
4. Configure HTTPS with Let's Encrypt
5. Set up MySQL regular backups: `mysqldump k2_fast_foods > backup_$(date +%F).sql`

---

## Phase Completion Status
- [x] Phase 1 — Foundation (Auth, DB, Brand)
- [x] Phase 2 — Menu + Ordering
- [x] Phase 3 — Delivery Tracking
- [x] Phase 4 — Admin Panel
- [ ] Phase 5 — QA & Production Deploy

=======
# K2-fast-foods
K2 Fast Food 
>>>>>>> 2f20186827a8b21bf736b7ad6ac15323ad6df550
