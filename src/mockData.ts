import {
  WindProject,
  WindTurbine,
  Investor,
  CashflowWaterfall,
  StellarTx,
  FireblocksVault,
  Order,
  Trade,
  RiskAlert,
  PocKPI
} from './types';

export const initialProject: WindProject = {
  id: 'WIND-BINH-THUAN-01',
  name: 'Cụm Turbine Điện Gió Bình Thuận (50MW)',
  spvName: 'SPV Năng Lượng Xanh Bình Thuận JSC',
  location: 'Tuy Phong, Bình Thuận, Việt Nam',
  totalCapacityMW: 50,
  turbineCount: 16,
  ppaContractor: 'Tập đoàn Điện lực Việt Nam (EVN)',
  totalValuationVND: 200000000000, // 200 Tỷ VND
  totalSupplyTokens: 2000000,     // 2 Triệu Tokens
  tokenPriceVND: 100000,          // 100,000 VND / Token
  targetYieldPct: 8.5,            // Lãi suất kỳ vọng tối thiểu 8.5%/năm
  bankEscrowPartner: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
  blockchainNetwork: 'Stellar Public Network (Soroban Smart Contracts)',
  custodyProvider: 'Fireblocks Enterprise Vault (MPC Security)'
};

export const initialTurbines: WindTurbine[] = Array.from({ length: 16 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  const baseCapacity = 3.125; // 50MW / 16 turbines = 3.125 MW each
  const windSpeed = +(8 + Math.random() * 4).toFixed(1);
  const efficiency = +(90 + Math.random() * 8).toFixed(1);
  const currentPower = +(baseCapacity * (efficiency / 100)).toFixed(2);
  return {
    id: `TURBINE-${num}`,
    name: `Turbine Gió TB-${num}`,
    capacityMW: baseCapacity,
    currentPowerMW: currentPower,
    status: 'optimal' as const,
    windSpeedMs: windSpeed,
    efficiencyPct: efficiency,
    rotorSpeedRpm: +(14 + Math.random() * 3).toFixed(1),
    temperatureC: +(32 + Math.random() * 5).toFixed(1),
    totalGenerationMWh: +(1250 + Math.random() * 200).toFixed(1),
    lastOracleSync: new Date().toISOString()
  };
});

export const initialInvestors: Investor[] = [
  {
    id: 'INV-001',
    name: 'Nhà đầu tư Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    taxCode: '0312456789',
    eKYCStatus: 'verified' as const,
    investorType: 'individual' as const,
    tokenBalance: 20000, // 20,000 tokens (1% sở hữu = 2 Tỷ VND)
    fiatBalanceVND: 150000000,
    stellarAddress: 'GDX7...4K9L_INV_A',
    fireblocksVaultId: 'FB-VAULT-INV-001',
    totalDividendsReceivedVND: 100000000
  },
  {
    id: 'INV-002',
    name: 'Quỹ Đầu tư Xanh ESG Vietnam Fund',
    email: 'contact@esgfund.vn',
    taxCode: '0109888999',
    eKYCStatus: 'verified' as const,
    investorType: 'esg_fund' as const,
    tokenBalance: 500000, // 25% sở hữu = 50 Tỷ VND
    fiatBalanceVND: 2500000000,
    stellarAddress: 'GA89...99MM_ESG_FUND',
    fireblocksVaultId: 'FB-VAULT-ESG-002',
    totalDividendsReceivedVND: 2500000000
  },
  {
    id: 'INV-003',
    name: 'Công ty Cổ phần Năng lượng Tái tạo Bình Minh',
    email: 'info@binhminhre.com',
    taxCode: '0400123987',
    eKYCStatus: 'verified' as const,
    investorType: 'institutional' as const,
    tokenBalance: 300000, // 15% sở hữu = 30 Tỷ VND
    fiatBalanceVND: 1200000000,
    stellarAddress: 'GB33...11KK_BINH_MINH',
    fireblocksVaultId: 'FB-VAULT-INST-003',
    totalDividendsReceivedVND: 1500000000
  },
  {
    id: 'INV-004',
    name: 'Nhà đầu tư Trần Thị B',
    email: 'tranthib@gmail.com',
    taxCode: '0899112233',
    eKYCStatus: 'pending' as const,
    investorType: 'individual' as const,
    tokenBalance: 0,
    fiatBalanceVND: 500000000,
    stellarAddress: 'GCP9...77ZZ_INV_B',
    fireblocksVaultId: 'FB-VAULT-INV-004',
    totalDividendsReceivedVND: 0
  }
];

export const initialCashflowEvents: CashflowWaterfall[] = [
  {
    id: 'CASH-2026-07',
    period: 'Tháng 07/2026',
    powerGeneratedMWh: 14200,
    evnElectricityRevenueVND: 12500000000, // 12.5 Tỷ VND
    operatingCostsVND: 2500000000,          // 2.5 Tỷ VND
    bankDebtReserveVND: 0,
    netDistributableCashflowVND: 10000000000, // 10 Tỷ VND
    distributionPerTokenVND: 5000,           // 10 Tỷ / 2M tokens = 5,000 VND/token
    status: 'waterfall_executed' as const,
    bidvRefCode: 'BIDV-FT20260731-98712',
    stellarTxHash: '0x8f1e948c27a908231c5188f28a9c148f98231a49c2b0e914',
    timestamp: '2026-07-31T17:00:00Z'
  }
];

export const initialStellarTxs: StellarTx[] = [
  {
    id: 'TX-1001',
    hash: '0xa719c8d20e9812a39108c32104f29184',
    ledger: 4891204,
    type: 'TOKEN_MINT' as const,
    from: 'G_SPV_ISSUER_MASTER',
    to: 'G_BIDV_CUSTODY_VAULT',
    amount: '2,000,000 WIND',
    assetCode: 'WIND-RWA',
    status: 'SUCCESS' as const,
    timestamp: '2026-06-01T08:30:00Z'
  },
  {
    id: 'TX-1002',
    hash: '0x8f1e948c27a908231c5188f28a9c148f98231a49c2b0e914',
    ledger: 4988210,
    type: 'WATERFALL_DISTRIBUTION' as const,
    from: 'G_BIDV_ESCROW_SMART_CONTRACT',
    to: 'ALL_VERIFIED_HOLDERS',
    amount: '10,000,000,000 VND (5,000 VND/WIND)',
    assetCode: 'VND-STABLE',
    status: 'SUCCESS' as const,
    timestamp: '2026-07-31T17:05:00Z'
  }
];

export const initialVaults: FireblocksVault[] = [
  {
    id: 'FB-VAULT-001',
    name: 'SPV Master Issuance Vault',
    vaultType: 'SPV_MASTER_ISSUANCE' as const,
    assetCode: 'WIND-RWA',
    balanceTokens: 1180000,
    fiatEscrowVND: 0,
    mpcKeyShares: 3,
    status: 'ACTIVE' as const
  },
  {
    id: 'FB-VAULT-002',
    name: 'BIDV Custody & Escrow Vault',
    vaultType: 'BIDV_CUSTODY_ESCROW' as const,
    assetCode: 'WIND-RWA / VND',
    balanceTokens: 820000,
    fiatEscrowVND: 12500000000,
    mpcKeyShares: 3,
    status: 'ACTIVE' as const
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    investorId: 'INV-001',
    investorName: 'Nhà đầu tư Nguyễn Văn A',
    type: 'sell' as const,
    amountTokens: 2000,
    priceVND: 102000,
    totalValueVND: 204000000,
    status: 'open' as const,
    kycCompliant: true,
    createdAt: '2026-08-08T09:15:00Z'
  },
  {
    id: 'ORD-002',
    investorId: 'INV-003',
    investorName: 'Công ty Cổ phần Năng lượng Tái tạo Bình Minh',
    type: 'buy' as const,
    amountTokens: 5000,
    priceVND: 101500,
    totalValueVND: 507500000,
    status: 'open' as const,
    kycCompliant: true,
    createdAt: '2026-08-09T14:20:00Z'
  }
];

export const initialTrades: Trade[] = [
  {
    id: 'TRD-501',
    buyOrderId: 'ORD-HIST-01',
    sellOrderId: 'ORD-HIST-02',
    buyerName: 'Quỹ Đầu tư Xanh ESG Vietnam Fund',
    sellerName: 'Nhà đầu tư Lê Văn C',
    amountTokens: 10000,
    priceVND: 101000,
    totalValueVND: 1010000000,
    txHash: '0x3c2a11b899d421e780a1c99021',
    timestamp: '2026-08-05T11:45:00Z'
  }
];

export const initialRiskAlerts: RiskAlert[] = [
  {
    id: 'RISK-01',
    turbineId: 'TURBINE-07',
    type: 'TURBINE_UNDERPERFORMANCE' as const,
    severity: 'low' as const,
    title: 'Cảnh báo hiệu suất Turbine 07',
    description: 'Tốc độ gió duy trì 6.2 m/s, công suất phát 2.1 MW (~67% thiết kế). Đã gửi tín hiệu sang hệ thống O&M.',
    mitigationPlan: 'Trigger enhanced monitoring & O&M inspection ticket #48102',
    triggeredAt: '2026-08-09T18:00:00Z',
    active: true
  }
];

export const initialKpis: PocKPI[] = [
  {
    id: 'KPI-TECH-01',
    category: 'technology' as const,
    metricName: 'Token Issuance Time (Thời gian phát hành)',
    target: '< 15 phút',
    actual: '4.2 phút',
    status: 'passed' as const,
    description: 'Tính từ lúc SPV ký phê duyệt MPC trên Fireblocks đến khi Smart contract khởi tạo trên Stellar'
  },
  {
    id: 'KPI-TECH-02',
    category: 'technology' as const,
    metricName: 'Transaction Processing Time (Tốc độ giao dịch)',
    target: '< 5 giây',
    actual: '2.8 giây',
    status: 'passed' as const,
    description: 'Xác nhận khối trên Stellar Public Blockchain & cấp nhật sổ cái'
  },
  {
    id: 'KPI-TECH-03',
    category: 'technology' as const,
    metricName: 'Oracle Latency (Độ trễ truyền dữ liệu IoT)',
    target: '< 1 phút',
    actual: '12 giây',
    status: 'passed' as const,
    description: 'Từ cảm biến turbine qua MQTT Gateway tới BIDV API & Smart Contract'
  },
  {
    id: 'KPI-EFF-01',
    category: 'efficiency' as const,
    metricName: 'Chi phí phát hành & quản lý',
    target: 'Giảm 60% so với TPDN truyền thống',
    actual: 'Giảm 68%',
    status: 'passed' as const,
    description: 'Tiết kiệm chi phí trung gian nhờ tự động hóa Smart Contract & Custody Fireblocks'
  },
  {
    id: 'KPI-EFF-02',
    category: 'efficiency' as const,
    metricName: 'Chi phí phân phối dòng tiền Waterfall',
    target: '< 0.05% tổng doanh thu',
    actual: '0.012%',
    status: 'passed' as const,
    description: 'Chi phí gas & banking API routing tự động'
  },
  {
    id: 'KPI-OP-01',
    category: 'operation' as const,
    metricName: 'Thời gian phân bổ lợi tức tới nhà đầu tư',
    target: 'Tự động trong T+0 (vài phút)',
    actual: '1.5 phút',
    status: 'passed' as const,
    description: 'Thay vì 5-10 ngày làm việc xử lý thủ công tại ngân hàng'
  },
  {
    id: 'KPI-OP-02',
    category: 'operation' as const,
    metricName: 'Số bước xử lý thủ công (Manual Steps)',
    target: '0 bước (Tự động 100%)',
    actual: '0 bước',
    status: 'passed' as const,
    description: 'Từ lúc EVN chuyển tiền đến lúc tiền về tài khoản nhà đầu tư'
  },
  {
    id: 'KPI-PROT-01',
    category: 'investor_protection' as const,
    metricName: 'Tính minh bạch & Khả năng truy xuất',
    target: '100% Onchain audit',
    actual: '100% Minh bạch',
    status: 'passed' as const,
    description: 'Sổ cái Stellar công khai + mã định danh tài sản xác thực bởi BIDV'
  },
  {
    id: 'KPI-PROT-02',
    category: 'investor_protection' as const,
    metricName: 'Hạn chế chuyển nhượng sai đối tượng (ERC-3643)',
    target: '100% tuân thủ eKYC',
    actual: '100% Tuân thủ',
    status: 'passed' as const,
    description: 'Chỉ ví đã qua xác minh eKYC/AML mới có thể thực hiện giao dịch chuyển nhượng'
  }
];
