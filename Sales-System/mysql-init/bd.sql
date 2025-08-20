-- ======================================
-- Desactivar validación de claves foráneas
-- ======================================
SET FOREIGN_KEY_CHECKS=0;

-- ============================
-- Crear Tablas
-- ============================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'empleado') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    user_id INT,
    customer_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    sale_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE product_changes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    change_type ENUM('stock_modificated', 'price_edited', 'created', 'deleted') NOT NULL,
    old_value DECIMAL(10,2),
    new_value DECIMAL(10,2),
    changed_by INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    invoice_pdf TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- ============================
-- Insertar Datos
-- ============================

-- Users
INSERT INTO users (username, password, role) VALUES
('admin', 'admin', 'admin'),
('empleado', 'empleado', 'empleado');

-- Customers
INSERT INTO customers (name, email, phone, address) VALUES
('Juan Pérez', 'juan@example.com', '0999999991', 'Av. Amazonas 123'),
('María Gómez', 'maria@example.com', '0988888882', 'Calle Los Pinos 456'),
('Luis Torres', 'luis@example.com', '0977777773', 'Av. Colón 789'),
('Ana Ríos', 'ana@example.com', '0966666664', 'Calle Sucre 321'),
('Carlos Vega', 'carlos@example.com', '0955555555', 'Av. República 654');

-- Products
INSERT INTO products (name, price, stock) VALUES
('Laptop Lenovo IdeaPad 5', 799.99, 10),
('Mouse Logitech G203', 29.99, 50),
('Teclado mecánico Redragon', 59.99, 30),
('Monitor LG 24" FullHD', 149.99, 15),
('Disco SSD Kingston 480GB', 65.00, 40);

-- Sales
INSERT INTO sales (total_amount, user_id, customer_id) VALUES
(859.97, 2, 1),
(29.99, 3, 2),
(209.98, 3, 3),
(59.99, 5, 4),
(65.00, 5, 5);

-- Sale Items
INSERT INTO sale_items (product_id, sale_id, quantity, price) VALUES
(1, 1, 1, 799.99),
(2, 1, 2, 29.99),
(2, 2, 1, 29.99),
(4, 3, 1, 149.99),
(3, 3, 1, 59.99),
(3, 4, 1, 59.99),
(5, 5, 1, 65.00);

-- Product Changes
INSERT INTO product_changes (product_id, change_type, old_value, new_value, changed_by) VALUES
(1, 'precio_editado', 850.00, 799.99, 1),
(2, 'stock_modificado', 60, 50, 2),
(3, 'precio_editado', 65.00, 59.99, 1),
(4, 'stock_modificado', 20, 15, 3),
(5, 'stock_modificado', 50, 40, 3);

-- Invoices
INSERT INTO invoices (sale_id, invoice_pdf) VALUES
(1, 'factura1.pdf'),
(2, 'factura2.pdf'),
(3, 'factura3.pdf'),
(4, 'factura4.pdf'),
(5, 'factura5.pdf');

-- ======================================
-- Reactivar validación de claves foráneas
-- ======================================
SET FOREIGN_KEY_CHECKS=1;
