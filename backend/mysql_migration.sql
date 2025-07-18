-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    walletAddress VARCHAR(255),
    phone VARCHAR(20),
    dateOfBirth DATE,
    role ENUM('user','admin') DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    emailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LOANS TABLE
CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower INT NOT NULL,
    loanType VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    interestRate DECIMAL(5,2),
    term INT,
    termUnit VARCHAR(20) DEFAULT 'months',
    purpose VARCHAR(255),
    status ENUM('pending','approved','active','completed','rejected') DEFAULT 'pending',
    approvalDate DATETIME,
    disbursementDate DATETIME,
    dueDate DATETIME,
    completedDate DATETIME,
    monthlyPayment DECIMAL(15,2),
    totalAmount DECIMAL(15,2),
    remainingBalance DECIMAL(15,2),
    role VARCHAR(20) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (borrower) REFERENCES users(id)
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loanId INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    transactionHash VARCHAR(255),
    status ENUM('pending','confirmed','failed') DEFAULT 'confirmed',
    FOREIGN KEY (loanId) REFERENCES loans(id)
);








-- INSERT STATEMENTS FOR USERS TABLE
INSERT INTO users (
    email, 
    password, 
    firstName, 
    lastName, 
    walletAddress, 
    phone, 
    dateOfBirth, 
    role, 
    isActive, 
    emailVerified
) VALUES 
(
    'john.smith@example.com', 
    '$2b$10$rOFLzZZzZeHOBwYEGPPXO.B8YgXeRfCzFHIp7YJhOzTnKQvHKDFmK', -- hashed password: 'password123'
    'John', 
    'Smith', 
    '0x742d35Cc6634C0532925a3b8D23654C6f69B3dD9', 
    '+1234567890', 
    '1990-05-15', 
    'user', 
    TRUE, 
    TRUE
),
(
    'sarah.johnson@example.com', 
    '$2b$10$rOFLzZZzZeHOBwYEGPPXO.B8YgXeRfCzFHIp7YJhOzTnKQvHKDFmK', -- hashed password: 'password123'
    'Sarah', 
    'Johnson', 
    '0x8ba1f109551bD432803012645Hac136c0d2c9b9d', 
    '+1234567891', 
    '1985-11-22', 
    'user', 
    TRUE, 
    TRUE
),
(
    'admin@example.com', 
    '$2b$10$rOFLzZZzZeHOBwYEGPPXO.B8YgXeRfCzFHIp7YJhOzTnKQvHKDFmK', -- hashed password: 'password123'
    'Admin', 
    'User', 
    '0x1234567890123456789012345678901234567890', 
    '+1234567892', 
    '1980-01-01', 
    'admin', 
    TRUE, 
    TRUE
);

-- INSERT STATEMENTS FOR LOANS TABLE
INSERT INTO loans (
    borrower, 
    loanType, 
    amount, 
    currency, 
    interestRate, 
    term, 
    termUnit, 
    purpose, 
    status, 
    approvalDate, 
    disbursementDate, 
    dueDate, 
    monthlyPayment, 
    totalAmount, 
    remainingBalance, 
    role
) VALUES 
(
    1, -- John Smith's user ID
    'Personal Loan', 
    25000.00, 
    'USD', 
    8.50, 
    24, 
    'months', 
    'Home renovation', 
    'active', 
    '2024-06-15 10:30:00', 
    '2024-06-20 14:00:00', 
    '2026-06-20 14:00:00', 
    1156.25, 
    27750.00, 
    20000.00, 
    'user'
),
(
    2, -- Sarah Johnson's user ID
    'Business Loan', 
    50000.00, 
    'USD', 
    12.00, 
    36, 
    'months', 
    'Business expansion', 
    'approved', 
    '2024-07-10 09:15:00', 
    NULL, 
    '2027-07-10 09:15:00', 
    1663.26, 
    59877.36, 
    50000.00, 
    'user'
),
(
    1, -- John Smith's second loan
    'Auto Loan', 
    15000.00, 
    'USD', 
    6.75, 
    60, 
    'months', 
    'Vehicle purchase', 
    'pending', 
    NULL, 
    NULL, 
    NULL, 
    295.24, 
    17714.40, 
    15000.00, 
    'user'
);

-- INSERT STATEMENTS FOR PAYMENTS TABLE
INSERT INTO payments (
    loanId, 
    amount, 
    paymentDate, 
    transactionHash, 
    status
) VALUES 
(
    1, -- Payment for John Smith's personal loan
    1156.25, 
    '2024-07-20 12:00:00', 
    '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 
    'confirmed'
),
(
    1, -- Second payment for John Smith's personal loan
    1156.25, 
    '2024-08-20 12:00:00', 
    '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567', 
    'confirmed'
),
(
    1, -- Third payment for John Smith's personal loan
    1156.25, 
    '2024-09-20 12:00:00', 
    '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678', 
    'pending'
);

-- OPTIONAL: Update remaining balance after payments
UPDATE loans 
SET remainingBalance = remainingBalance - (
    SELECT COALESCE(SUM(amount), 0) 
    FROM payments 
    WHERE loanId = loans.id AND status = 'confirmed'
) 
WHERE id IN (1, 2, 3);