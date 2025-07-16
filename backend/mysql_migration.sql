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
