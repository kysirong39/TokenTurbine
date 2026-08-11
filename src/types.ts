export interface WindTurbine {
  id: string;
  name: string;
  capacityMW: number;
  currentPowerMW: number;
  status: 'optimal' | 'warning' | 'critical' | 'maintenance';
  windSpeedMs: number;
  efficiencyPct: number;
  rotorSpeedRpm: number;
  temperatureC: number;
  totalGenerationMWh: number;
  lastOracleSync: string;
}

export interface WindProject {
  id: string;
  name: string;
  spvName: string;
  location: string;
  totalCapacityMW: number;
  turbineCount: number;
  ppaContractor: string; // EVN
  totalValuationVND: number; // 200,000,000,000 VND
  totalSupplyTokens: number; // 2,000,000 tokens
  tokenPriceVND: number; // 100,000 VND
  targetYieldPct: number; // 8.5%/year
  bankEscrowPartner: string; // BIDV
  blockchainNetwork: string; // Stellar Public / Soroban
  custodyProvider: string; // Fireblocks
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  taxCode: string;
  eKYCStatus: 'verified' | 'pending' | 'unverified';
  investorType: 'individual' | 'institutional' | 'esg_fund';
  tokenBalance: number;
  fiatBalanceVND: number;
  stellarAddress: string;
  fireblocksVaultId: string;
  totalDividendsReceivedVND: number;
}

export interface CashflowWaterfall {
  id: string;
  period: string; // e.g., "Tháng 08/2026"
  powerGeneratedMWh: number;
  evnElectricityRevenueVND: number;
  operatingCostsVND: number;
  bankDebtReserveVND: number;
  netDistributableCashflowVND: number;
  distributionPerTokenVND: number;
  status: 'pending_evn_payment' | 'bidv_confirmed' | 'oracle_synced' | 'waterfall_executed';
  bidvRefCode: string;
  stellarTxHash: string;
  timestamp: string;
}

export interface Order {
  id: string;
  investorId: string;
  investorName: string;
  type: 'buy' | 'sell';
  amountTokens: number;
  priceVND: number;
  totalValueVND: number;
  status: 'open' | 'filled' | 'cancelled';
  kycCompliant: boolean;
  createdAt: string;
}

export interface Trade {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  buyerName: string;
  sellerName: string;
  amountTokens: number;
  priceVND: number;
  totalValueVND: number;
  txHash: string;
  timestamp: string;
}

export interface StellarTx {
  id: string;
  hash: string;
  ledger: number;
  type: 'TOKEN_MINT' | 'WATERFALL_DISTRIBUTION' | 'SECONDARY_TRANSFER' | 'COMPLIANCE_CLAWBACK' | 'DEFAULT_LIQUIDATION';
  from: string;
  to: string;
  amount: string;
  assetCode: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
}

export interface FireblocksVault {
  id: string;
  name: string;
  vaultType: 'SPV_MASTER_ISSUANCE' | 'BIDV_CUSTODY_ESCROW' | 'INVESTOR_VAULT';
  assetCode: string;
  balanceTokens: number;
  fiatEscrowVND: number;
  mpcKeyShares: number; // e.g. 3 of 3
  status: 'ACTIVE' | 'LOCKED' | 'PENDING_APPROVAL';
}

export interface RiskAlert {
  id: string;
  turbineId?: string;
  type: 'TURBINE_UNDERPERFORMANCE' | 'REVENUE_DROPDOWN' | 'ORACLE_LATENCY' | 'SPV_DEFAULT_RISK';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  mitigationPlan: string;
  triggeredAt: string;
  active: boolean;
}

export interface PocKPI {
  id: string;
  category: 'technology' | 'efficiency' | 'operation' | 'investor_protection';
  metricName: string;
  target: string;
  actual: string;
  status: 'passed' | 'warning' | 'in_progress';
  description: string;
}
