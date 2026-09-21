-- Seeder 001: Admin user + sample menu
-- Password for admin: Admin@1234 (bcrypt hash below)

INSERT IGNORE INTO users (name, email, password, phone, role, is_active) VALUES
('K2 Admin', 'admin@k2fastfoods.pk', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03001234567', 'admin', 1),
('Test Customer', 'customer@k2fastfoods.pk', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03009876543', 'customer', 1);

INSERT IGNORE INTO categories (name, slug, sort_order) VALUES
('Burgers',  'burgers',  1),
('Wraps',    'wraps',    2),
('Pizza',    'pizza',    3),
('Sides',    'sides',    4),
('Drinks',   'drinks',   5);

INSERT IGNORE INTO menu_items (category_id, name, description, price, is_available, sort_order) VALUES
(1, 'Zinger Burger',    'Crispy chicken fillet, lettuce, mayo on a sesame bun',     350.00, 1, 1),
(1, 'Double Smash',     'Two smashed beef patties, cheese, pickles, special sauce', 490.00, 1, 2),
(1, 'Classic Beef',     'Juicy beef patty with fresh vegetables and ketchup',       320.00, 1, 3),
(2, 'Crispy Wrap',      'Chicken strips, coleslaw, garlic sauce in a soft tortilla', 280.00, 1, 1),
(2, 'Shawarma Roll',    'Marinated chicken, garlic yoghurt, pickled vegetables',    320.00, 1, 2),
(3, 'Pepperoni Pizza',  'Classic tomato base, mozzarella, pepperoni — 9 inch',     650.00, 1, 1),
(3, 'BBQ Chicken Pizza','BBQ sauce, grilled chicken, red onions, cheddar — 9 inch', 680.00, 1, 2),
(4, 'Loaded Fries',     'Crispy fries topped with cheese sauce and jalapeños',     180.00, 1, 1),
(4, 'Coleslaw',         'Creamy house-made coleslaw',                               80.00, 1, 2),
(5, 'Pepsi 500ml',      'Ice-cold Pepsi',                                           80.00, 1, 1),
(5, '7Up 500ml',        'Ice-cold 7Up',                                             80.00, 1, 2);
