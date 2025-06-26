import { ethers } from 'ethers';

// Contract ABI (simplified for demo)
export const LENDING_CONTRACT_ABI = [
  "function submitApplication(uint256 _amount, uint256 _duration, string memory _purpose, uint256 _aiScore) external",
  "function makePayment(uint256 _loanId) external payable",
  "function getUserApplications(address _user) external view returns (uint256[])",
  "function getUserLoans(address _user) external view returns (uint256[])",
  "function applications(uint256) external view returns (address, uint256, uint256, uint256, uint256, uint256, string, bool, bool, uint256, uint256)",
  "function loans(uint256) external view returns (uint256, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, uint256)",
  "function getPlatformStats() external view returns (uint256, uint256, uint256, uint256)",
  "event ApplicationSubmitted(uint256 indexed applicationId, address indexed applicant, uint256 amount)",
  "event LoanIssued(uint256 indexed loanId, address indexed borrower, uint256 amount)",
  "event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount)"
];

// Contract address (would be deployed contract address)
export const LENDING_CONTRACT_ADDRESS = "0x742d35cc6bf3b4c4a4b8d4e4f5a6b7c8d9e0f1a2";

export class ContractService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor(provider?: ethers.BrowserProvider, signer?: ethers.JsonRpcSigner) {
    if (provider && signer) {
      this.provider = provider;
      this.signer = signer;
      this.contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signer);
    }
  }

  async submitLoanApplication(
    amount: string,
    duration: number,
    purpose: string,
    aiScore: number
  ): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    return await this.contract.submitApplication(amountWei, duration, purpose, aiScore);
  }

  async makePayment(loanId: number, paymentAmount: string): Promise<ethers.TransactionResponse> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(paymentAmount);
    return await this.contract.makePayment(loanId, { value: amountWei });
  }

  async getUserApplications(userAddress: string): Promise<number[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getUserApplications(userAddress);
  }

  async getUserLoans(userAddress: string): Promise<number[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getUserLoans(userAddress);
  }

  async getApplicationDetails(applicationId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.applications(applicationId);
  }

  async getLoanDetails(loanId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.loans(loanId);
  }

  async getPlatformStats() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getPlatformStats();
  }

  // Utility functions
  static calculateAIScore(formData: any): number {
    let score = 0;
    
    // Income scoring
    const income = parseFloat(formData.monthlyIncome || '0');
    if (income > 5000) score += 30;
    else if (income > 3000) score += 20;
    else if (income > 1000) score += 10;
    
    // Loan amount vs income ratio
    const loanAmount = parseFloat(formData.loanAmount || '0');
    const ratio = loanAmount / (income * 12);
    if (ratio < 0.3) score += 25;
    else if (ratio < 0.5) score += 15;
    else if (ratio < 0.7) score += 5;
    
    // Employment status
    if (formData.employmentStatus === 'full-time') score += 20;
    else if (formData.employmentStatus === 'part-time') score += 10;
    else if (formData.employmentStatus === 'self-employed') score += 15;
    
    // Credit score
    const creditScore = parseFloat(formData.creditScore || '0');
    if (creditScore > 700) score += 25;
    else if (creditScore > 600) score += 15;
    else if (creditScore > 500) score += 5;
    
    return Math.min(score, 100);
  }

  static calculateInterestRate(aiScore: number): number {
    if (aiScore >= 90) return 5.0;
    if (aiScore >= 80) return 7.5;
    if (aiScore >= 70) return 10.0;
    if (aiScore >= 60) return 12.5;
    return 15.0;
  }

  static calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    
    return numerator / denominator;
  }
}

export default ContractService;