// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title BlockLend Micro-Lending Smart Contract
 * @dev Automated micro-lending platform with AI-powered risk assessment
 */
contract LendingContract is ReentrancyGuard, Ownable, Pausable {
    
    struct LoanApplication {
        address applicant;
        uint256 amount;
        uint256 interestRate;
        uint256 duration; // in months
        uint256 monthlyPayment;
        uint256 aiScore;
        string purpose;
        bool approved;
        bool active;
        uint256 submittedAt;
        uint256 approvedAt;
    }
    
    struct Loan {
        uint256 applicationId;
        address borrower;
        uint256 principal;
        uint256 remainingBalance;
        uint256 interestRate;
        uint256 monthlyPayment;
        uint256 nextPaymentDue;
        uint256 paymentsRemaining;
        bool active;
        uint256 createdAt;
    }
    
    struct Payment {
        uint256 loanId;
        uint256 amount;
        uint256 principal;
        uint256 interest;
        uint256 timestamp;
        address payer;
    }
    
    // State variables
    mapping(uint256 => LoanApplication) public applications;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Payment[]) public loanPayments;
    mapping(address => uint256[]) public userApplications;
    mapping(address => uint256[]) public userLoans;
    
    uint256 public nextApplicationId = 1;
    uint256 public nextLoanId = 1;
    uint256 public totalLoansIssued;
    uint256 public totalValueLocked;
    uint256 public platformFeeRate = 100; // 1% (in basis points)
    
    // AI Assessment thresholds
    uint256 public constant MIN_AI_SCORE = 60;
    uint256 public constant MAX_LOAN_AMOUNT = 50000 * 10**18; // 50,000 tokens
    uint256 public constant MIN_LOAN_AMOUNT = 100 * 10**18; // 100 tokens
    
    // Events
    event ApplicationSubmitted(uint256 indexed applicationId, address indexed applicant, uint256 amount);
    event ApplicationApproved(uint256 indexed applicationId, address indexed applicant);
    event ApplicationRejected(uint256 indexed applicationId, address indexed applicant, string reason);
    event LoanIssued(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanCompleted(uint256 indexed loanId, address indexed borrower);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    
    // Modifiers
    modifier validApplication(uint256 _applicationId) {
        require(_applicationId < nextApplicationId, "Invalid application ID");
        require(applications[_applicationId].applicant != address(0), "Application does not exist");
        _;
    }
    
    modifier validLoan(uint256 _loanId) {
        require(_loanId < nextLoanId, "Invalid loan ID");
        require(loans[_loanId].borrower != address(0), "Loan does not exist");
        _;
    }
    
    modifier onlyBorrower(uint256 _loanId) {
        require(loans[_loanId].borrower == msg.sender, "Only borrower can perform this action");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Submit a loan application
     * @param _amount Loan amount requested
     * @param _duration Loan duration in months
     * @param _purpose Purpose of the loan
     * @param _aiScore AI-generated risk score (0-100)
     */
    function submitApplication(
        uint256 _amount,
        uint256 _duration,
        string memory _purpose,
        uint256 _aiScore
    ) external whenNotPaused nonReentrant {
        require(_amount >= MIN_LOAN_AMOUNT && _amount <= MAX_LOAN_AMOUNT, "Invalid loan amount");
        require(_duration >= 6 && _duration <= 36, "Invalid loan duration");
        require(_aiScore <= 100, "Invalid AI score");
        require(bytes(_purpose).length > 0, "Purpose cannot be empty");
        
        uint256 applicationId = nextApplicationId++;
        
        // Calculate interest rate based on AI score (higher score = lower rate)
        uint256 interestRate = calculateInterestRate(_aiScore);
        
        // Calculate monthly payment
        uint256 monthlyPayment = calculateMonthlyPayment(_amount, interestRate, _duration);
        
        applications[applicationId] = LoanApplication({
            applicant: msg.sender,
            amount: _amount,
            interestRate: interestRate,
            duration: _duration,
            monthlyPayment: monthlyPayment,
            aiScore: _aiScore,
            purpose: _purpose,
            approved: false,
            active: false,
            submittedAt: block.timestamp,
            approvedAt: 0
        });
        
        userApplications[msg.sender].push(applicationId);
        
        emit ApplicationSubmitted(applicationId, msg.sender, _amount);
        
        // Auto-approve if AI score meets threshold
        if (_aiScore >= MIN_AI_SCORE) {
            _approveApplication(applicationId);
        }
    }
    
    /**
     * @dev Approve a loan application (admin function)
     * @param _applicationId Application ID to approve
     */
    function approveApplication(uint256 _applicationId) external onlyOwner validApplication(_applicationId) {
        _approveApplication(_applicationId);
    }
    
    /**
     * @dev Internal function to approve application
     */
    function _approveApplication(uint256 _applicationId) internal {
        LoanApplication storage app = applications[_applicationId];
        require(!app.approved, "Application already processed");
        
        app.approved = true;
        app.approvedAt = block.timestamp;
        
        emit ApplicationApproved(_applicationId, app.applicant);
        
        // Automatically issue the loan
        _issueLoan(_applicationId);
    }
    
    /**
     * @dev Reject a loan application (admin function)
     * @param _applicationId Application ID to reject
     * @param _reason Reason for rejection
     */
    function rejectApplication(uint256 _applicationId, string memory _reason) 
        external onlyOwner validApplication(_applicationId) {
        LoanApplication storage app = applications[_applicationId];
        require(!app.approved, "Application already approved");
        
        // Mark as processed but not approved
        app.active = false;
        
        emit ApplicationRejected(_applicationId, app.applicant, _reason);
    }
    
    /**
     * @dev Issue a loan after approval
     */
    function _issueLoan(uint256 _applicationId) internal {
        LoanApplication storage app = applications[_applicationId];
        require(app.approved, "Application not approved");
        require(!app.active, "Loan already issued");
        
        uint256 loanId = nextLoanId++;
        
        loans[loanId] = Loan({
            applicationId: _applicationId,
            borrower: app.applicant,
            principal: app.amount,
            remainingBalance: app.amount,
            interestRate: app.interestRate,
            monthlyPayment: app.monthlyPayment,
            nextPaymentDue: block.timestamp + 30 days,
            paymentsRemaining: app.duration,
            active: true,
            createdAt: block.timestamp
        });
        
        app.active = true;
        userLoans[app.applicant].push(loanId);
        totalLoansIssued++;
        totalValueLocked += app.amount;
        
        emit LoanIssued(loanId, app.applicant, app.amount);
        
        // Transfer funds to borrower (in real implementation, this would transfer actual tokens)
        // For demo purposes, we'll emit an event
    }
    
    /**
     * @dev Make a loan payment
     * @param _loanId Loan ID to make payment for
     */
    function makePayment(uint256 _loanId) external payable validLoan(_loanId) onlyBorrower(_loanId) nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan is not active");
        require(msg.value >= loan.monthlyPayment, "Insufficient payment amount");
        
        // Calculate interest and principal portions
        uint256 interestPayment = (loan.remainingBalance * loan.interestRate) / (100 * 12);
        uint256 principalPayment = loan.monthlyPayment - interestPayment;
        
        // Update loan balance
        loan.remainingBalance -= principalPayment;
        loan.paymentsRemaining--;
        loan.nextPaymentDue = block.timestamp + 30 days;
        
        // Record payment
        loanPayments[_loanId].push(Payment({
            loanId: _loanId,
            amount: loan.monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            timestamp: block.timestamp,
            payer: msg.sender
        }));
        
        emit PaymentMade(_loanId, msg.sender, loan.monthlyPayment);
        
        // Check if loan is completed
        if (loan.paymentsRemaining == 0 || loan.remainingBalance == 0) {
            loan.active = false;
            totalValueLocked -= loan.remainingBalance;
            emit LoanCompleted(_loanId, msg.sender);
        }
        
        // Refund excess payment
        if (msg.value > loan.monthlyPayment) {
            payable(msg.sender).transfer(msg.value - loan.monthlyPayment);
        }
    }
    
    /**
     * @dev Calculate interest rate based on AI score
     * @param _aiScore AI risk score (0-100)
     * @return Interest rate in basis points
     */
    function calculateInterestRate(uint256 _aiScore) public pure returns (uint256) {
        if (_aiScore >= 90) return 500; // 5%
        if (_aiScore >= 80) return 750; // 7.5%
        if (_aiScore >= 70) return 1000; // 10%
        if (_aiScore >= 60) return 1250; // 12.5%
        return 1500; // 15% (high risk)
    }
    
    /**
     * @dev Calculate monthly payment amount
     * @param _principal Loan principal amount
     * @param _annualRate Annual interest rate in basis points
     * @param _months Loan duration in months
     * @return Monthly payment amount
     */
    function calculateMonthlyPayment(uint256 _principal, uint256 _annualRate, uint256 _months) 
        public pure returns (uint256) {
        uint256 monthlyRate = _annualRate / 12 / 100; // Convert to monthly decimal rate
        if (monthlyRate == 0) return _principal / _months;
        
        uint256 numerator = _principal * monthlyRate * (1 + monthlyRate) ** _months;
        uint256 denominator = (1 + monthlyRate) ** _months - 1;
        
        return numerator / denominator;
    }
    
    /**
     * @dev Get user's applications
     * @param _user User address
     * @return Array of application IDs
     */
    function getUserApplications(address _user) external view returns (uint256[] memory) {
        return userApplications[_user];
    }
    
    /**
     * @dev Get user's loans
     * @param _user User address
     * @return Array of loan IDs
     */
    function getUserLoans(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }
    
    /**
     * @dev Get loan payment history
     * @param _loanId Loan ID
     * @return Array of payments
     */
    function getLoanPayments(uint256 _loanId) external view returns (Payment[] memory) {
        return loanPayments[_loanId];
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance (admin function)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Update platform fee rate
     * @param _newRate New fee rate in basis points
     */
    function updatePlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = _newRate;
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalApplications,
        uint256 totalActiveLoans,
        uint256 totalValueLockedAmount,
        uint256 totalLoansIssuedCount
    ) {
        return (
            nextApplicationId - 1,
            totalLoansIssued,
            totalValueLocked,
            totalLoansIssued
        );
    }
}