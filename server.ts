import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  WindTurbine,
  Investor,
  CashflowWaterfall,
  StellarTx,
  FireblocksVault,
  Order,
  Trade,
  RiskAlert,
  PocKPI
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for PoC Demo
const projectData = {
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

// 16 Turbines Initial State
let turbines: WindTurbine[] = Array.from({ length: 16 }, (_, i) => {
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

// Investors State (Matching PDF Example: Investor A with 20,000 tokens)
let investors: Investor[] = [
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
    totalDividendsReceivedVND: 100000000 // 100 Triệu từ đợt phân phối trước
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

// Cashflow Waterfall History
let cashflowEvents: CashflowWaterfall[] = [
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

// Stellar Ledger Transactions
let stellarTxs: StellarTx[] = [
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

// Fireblocks Vaults
let fireblocksVaults: FireblocksVault[] = [
  {
    id: 'FB-VAULT-001',
    name: 'SPV Master Issuance Vault',
    vaultType: 'SPV_MASTER_ISSUANCE' as const,
    assetCode: 'WIND-RWA',
    balanceTokens: 1180000, // Remaining unallocated/treasury tokens
    fiatEscrowVND: 0,
    mpcKeyShares: 3,
    status: 'ACTIVE' as const
  },
  {
    id: 'FB-VAULT-002',
    name: 'BIDV Custody & Escrow Vault',
    vaultType: 'BIDV_CUSTODY_ESCROW' as const,
    assetCode: 'WIND-RWA / VND',
    balanceTokens: 820000, // Custodied tokens for active investors
    fiatEscrowVND: 12500000000,
    mpcKeyShares: 3,
    status: 'ACTIVE' as const
  }
];

// Secondary Market Orders
let orders: Order[] = [
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

let trades: Trade[] = [
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

// Risk Alerts
let riskAlerts: RiskAlert[] = [
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

// PoC KPIs (Matching 4 groups in BIDV PDF Document)
let pocKpis: PocKPI[] = [
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

// API ROUTES
app.get('/api/project', (req, res) => {
  res.json({
    project: projectData,
    turbinesCount: turbines.length,
    totalPowerNowMW: +turbines.reduce((acc, t) => acc + t.currentPowerMW, 0).toFixed(2),
    activeAlerts: riskAlerts.filter(r => r.active).length
  });
});

app.get('/api/turbines', (req, res) => {
  res.json(turbines);
});

app.post('/api/turbines/simulate-weather', (req, res) => {
  const { scenario } = req.body; // 'base' | 'downside' | 'stress' | 'random'
  turbines = turbines.map(t => {
    let factor = 1.0;
    if (scenario === 'downside') factor = 0.85; // 85% output as per document
    if (scenario === 'stress') factor = 0.70;   // 70% output as per document
    if (scenario === 'random') factor = 0.8 + Math.random() * 0.3;

    const baseCapacity = 3.125;
    const efficiency = +(Math.min(98, Math.max(40, 92 * factor + (Math.random() * 4 - 2)))).toFixed(1);
    const power = +(baseCapacity * (efficiency / 100)).toFixed(2);
    const wind = +(8 * factor + Math.random() * 2).toFixed(1);

    return {
      ...t,
      windSpeedMs: wind,
      efficiencyPct: efficiency,
      currentPowerMW: power,
      status: efficiency < 75 ? 'warning' : efficiency < 50 ? 'critical' : 'optimal',
      lastOracleSync: new Date().toISOString()
    };
  });

  res.json({ message: `Đã cập nhật giả lập kịch bản: ${scenario || 'thời tiết thực'}`, turbines });
});

app.get('/api/investors', (req, res) => {
  res.json(investors);
});

app.post('/api/investors/ekyc', (req, res) => {
  const { investorId, action } = req.body;
  const target = investors.find(i => i.id === investorId);
  if (target) {
    target.eKYCStatus = action === 'approve' ? 'verified' : 'unverified';
    res.json({ message: `Đã cập nhật eKYC cho ${target.name}`, investor: target });
  } else {
    res.status(404).json({ error: 'Investor not found' });
  }
});

app.get('/api/cashflow', (req, res) => {
  res.json({
    cashflowEvents,
    projectValuationVND: projectData.totalValuationVND,
    totalSupplyTokens: projectData.totalSupplyTokens,
    targetYieldPct: projectData.targetYieldPct
  });
});

// TRIGGER EVN PAYMENT & AUTOMATED WATERFALL EXECUTION!
app.post('/api/cashflow/simulate-evn-payment', (req, res) => {
  const { revenueVND = 10000000000, operatingCostVND = 2000000000 } = req.body;

  const netDistributable = Math.max(0, revenueVND - operatingCostVND);
  const distributionPerToken = Math.floor(netDistributable / projectData.totalSupplyTokens);
  const now = new Date();
  const periodStr = `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const bidvRef = `BIDV-FT${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(10000 + Math.random()*89999)}`;
  const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

  const newEvent = {
    id: `CASH-${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${Date.now().toString().slice(-4)}`,
    period: periodStr,
    powerGeneratedMWh: 13850 + Math.floor(Math.random() * 1000),
    evnElectricityRevenueVND: revenueVND,
    operatingCostsVND: operatingCostVND,
    bankDebtReserveVND: 0,
    netDistributableCashflowVND: netDistributable,
    distributionPerTokenVND: distributionPerToken,
    status: 'waterfall_executed' as const,
    bidvRefCode: bidvRef,
    stellarTxHash: txHash,
    timestamp: now.toISOString()
  };

  cashflowEvents.unshift(newEvent);

  // Update investors' fiat balance & received dividends!
  investors = investors.map(inv => {
    if (inv.eKYCStatus === 'verified' && inv.tokenBalance > 0) {
      const payout = inv.tokenBalance * distributionPerToken;
      return {
        ...inv,
        fiatBalanceVND: inv.fiatBalanceVND + payout,
        totalDividendsReceivedVND: inv.totalDividendsReceivedVND + payout
      };
    }
    return inv;
  });

  // Log on Stellar Tx Ledger
  stellarTxs.unshift({
    id: `TX-${Date.now().toString().slice(-4)}`,
    hash: txHash,
    ledger: 5000000 + Math.floor(Math.random() * 50000),
    type: 'WATERFALL_DISTRIBUTION',
    from: 'G_BIDV_ESCROW_SMART_CONTRACT',
    to: 'ALL_VERIFIED_HOLDERS',
    amount: `${netDistributable.toLocaleString('vi-VN')} VND (${distributionPerToken.toLocaleString('vi-VN')} VND/Token)`,
    assetCode: 'VND-STABLE',
    status: 'SUCCESS',
    timestamp: now.toISOString()
  });

  res.json({
    message: 'Tự động phân bổ dòng tiền Waterfall thành công!',
    event: newEvent,
    summary: {
      totalRevenue: revenueVND,
      netDistributed: netDistributable,
      payoutPerToken: distributionPerToken,
      bidvRefCode: bidvRef,
      txHash
    }
  });
});

app.get('/api/stellar/ledger', (req, res) => {
  res.json({
    network: projectData.blockchainNetwork,
    contractAddress: 'CC73K8X9W2M4V11PL09Q87AZX_WIND_RWA_ERC3643',
    transactions: stellarTxs
  });
});

app.get('/api/fireblocks/vaults', (req, res) => {
  res.json({
    provider: projectData.custodyProvider,
    vaults: fireblocksVaults
  });
});

app.get('/api/market/orders', (req, res) => {
  res.json({ orders, trades });
});

app.post('/api/market/trade', (req, res) => {
  const { investorId, type, amountTokens, priceVND } = req.body;
  const investor = investors.find(i => i.id === investorId);

  if (!investor) {
    return res.status(404).json({ error: 'Không tìm thấy nhà đầu tư' });
  }

  // eKYC Compliance Check
  if (investor.eKYCStatus !== 'verified') {
    return res.status(400).json({
      error: 'Vi phạm chính sách tuân thủ ERC-3643: Tài khoản chưa hoàn tất eKYC/AML!'
    });
  }

  if (type === 'sell' && investor.tokenBalance < amountTokens) {
    return res.status(400).json({ error: 'Số dư Token WIND không đủ để tạo lệnh bán!' });
  }

  const totalVal = amountTokens * priceVND;
  if (type === 'buy' && investor.fiatBalanceVND < totalVal) {
    return res.status(400).json({ error: 'Số dư Fiat VND không đủ để tạo lệnh mua!' });
  }

  const newOrder: Order = {
    id: `ORD-${Date.now().toString().slice(-4)}`,
    investorId: investor.id,
    investorName: investor.name,
    type: type as 'buy' | 'sell',
    amountTokens: +amountTokens,
    priceVND: +priceVND,
    totalValueVND: totalVal,
    status: 'open',
    kycCompliant: true,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);

  // Check matching orders
  const oppositeType = type === 'buy' ? 'sell' : 'buy';
  const matchIndex = orders.findIndex(o => o.type === oppositeType && o.status === 'open' && (type === 'buy' ? o.priceVND <= priceVND : o.priceVND >= priceVND));

  if (matchIndex !== -1) {
    const matchOrder = orders[matchIndex];
    matchOrder.status = 'filled';
    newOrder.status = 'filled';

    const seller = type === 'sell' ? investor : investors.find(i => i.id === matchOrder.investorId);
    const buyer = type === 'buy' ? investor : investors.find(i => i.id === matchOrder.investorId);

    const tradeTokens = Math.min(newOrder.amountTokens, matchOrder.amountTokens);
    const tradePrice = matchOrder.priceVND;
    const tradeValue = tradeTokens * tradePrice;

    if (seller && buyer) {
      seller.tokenBalance -= tradeTokens;
      seller.fiatBalanceVND += tradeValue;

      buyer.tokenBalance += tradeTokens;
      buyer.fiatBalanceVND -= tradeValue;
    }

    const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    trades.unshift({
      id: `TRD-${Date.now().toString().slice(-4)}`,
      buyOrderId: type === 'buy' ? newOrder.id : matchOrder.id,
      sellOrderId: type === 'sell' ? newOrder.id : matchOrder.id,
      buyerName: buyer?.name || 'Khách hàng',
      sellerName: seller?.name || 'Khách hàng',
      amountTokens: tradeTokens,
      priceVND: tradePrice,
      totalValueVND: tradeValue,
      txHash,
      timestamp: new Date().toISOString()
    });

    stellarTxs.unshift({
      id: `TX-${Date.now().toString().slice(-4)}`,
      hash: txHash,
      ledger: 5012090,
      type: 'SECONDARY_TRANSFER',
      from: seller?.stellarAddress || 'SELLER',
      to: buyer?.stellarAddress || 'BUYER',
      amount: `${tradeTokens} WIND @ ${tradePrice.toLocaleString()} VND`,
      assetCode: 'WIND-RWA',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });

    return res.json({ message: 'Giao dịch khớp lệnh thành công trên Sàn thứ cấp!', order: newOrder, matched: true });
  }

  res.json({ message: 'Lệnh giao dịch đã tạo thành công và đưa vào Sổ lệnh!', order: newOrder, matched: false });
});

app.get('/api/kpis', (req, res) => {
  res.json(pocKpis);
});

app.get('/api/risks', (req, res) => {
  res.json(riskAlerts);
});

// SIMULATE SPV DEFAULT EVENT AND LIQUIDATION
app.post('/api/risk/trigger-default', (req, res) => {
  const defaultAlert = {
    id: `DEFAULT-${Date.now()}`,
    type: 'SPV_DEFAULT_RISK' as const,
    severity: 'critical' as const,
    title: 'Sự kiện Default (Vỡ nợ) do SPV vi phạm nghĩa vụ thanh toán',
    description: 'SPV không thực hiện thanh toán dòng tiền lợi tức đúng hạn. Kích hoạt quy trình xử lý tài sản & thành lập Hội đồng Thanh lý Tài sản.',
    mitigationPlan: 'Triển khai Smart Contract Liquidation, đấu giá quyền khai thác 16 Turbine 50MW và thu hồi tiền hoàn trả nhà đầu tư theo tỷ lệ sở hữu.',
    triggeredAt: new Date().toISOString(),
    active: true
  };

  riskAlerts.unshift(defaultAlert);

  stellarTxs.unshift({
    id: `TX-DEFAULT-${Date.now().toString().slice(-4)}`,
    hash: '0xDEF489021A8829C1109B03912',
    ledger: 5090001,
    type: 'DEFAULT_LIQUIDATION',
    from: 'G_BIDV_TRUSTEE_SMART_CONTRACT',
    to: 'SPV_DEFAULT_COMMITTEE',
    amount: 'ALL_200B_VND_ASSETS_FROZEN',
    assetCode: 'WIND-RWA',
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  });

  res.json({
    message: 'Đã kích hoạt cơ chế xử lý Sự kiện Default (Vỡ nợ) thành công!',
    alert: defaultAlert
  });
});

// GEMINI AI INNOVATION ANALYST ENDPOINT
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng thiết lập chìa khóa API trong cấu hình môi trường.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    const systemInstruction = `
Bạn là Chuyên gia Phân tích Cấp cao về Xu hướng Công nghệ và Đổi mới Sáng tạo (Innovation Analyst) thuộc BIDV / Ngân hàng Tài chính.
Nhiệm vụ của bạn là hỗ trợ tư vấn, giải thích và phân tích bài toán Token hóa Turbine Điện Gió (PoC Wind Turbine Tokenization) theo Business Case BIDV.

Thông tin dự án PoC:
- Dự án: Cụm 16 Turbine Điện Gió Bình Thuận (Công suất thiết kế 50MW, tối đa 95%).
- Hợp đồng mua bán điện (PPA): Ký trực tiếp với EVN.
- Định giá tài sản: 200 Tỷ VNĐ.
- Số lượng phát hành: 2.000.000 Token WIND.
- Mệnh giá phát hành: 100.000 VNĐ / Token.
- Lợi tức mục tiêu: 8.5%/năm (nguyên tắc Waterfall phân phối lợi nhuận tự động qua Smart Contract).
- Tích hợp:
  + Stellar Blockchain (Soroban Smart Contract, tiêu chuẩn ERC-3643 tuân thủ eKYC).
  + Fireblocks Enterprise Vault (Quản lý khóa MPC, lưu ký Token).
  + BIDV Core Banking & Escrow Account (Xác nhận tiền EVN gửi về, tự động trigger Smart Contract Waterfall).
  + Sàn thứ cấp ATS (Giao dịch chuyển nhượng giữa các nhà đầu tư đủ điều kiện).
  + Quản trị rủi ro & Cơ chế Default (Hội đồng thanh lý tài sản khi SPV vỡ nợ).

Phong cách trả lời:
- Chuyên nghiệp, khách quan, sắc sảo, có định hướng tài chính - công nghệ (Fintech/RWA).
- Luôn tóm tắt ngắn gọn bằng Markdown, sử dụng bullet points rõ ràng.
- Đưa ra định hướng ứng dụng tại Việt Nam khi phù hợp.
`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nCâu hỏi từ người dùng: ${prompt}` }] }
      ]
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi gọi Gemini AI Studio' });
  }
});

// START EXPRESS & VITE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Wind Turbine Tokenization PoC running on http://localhost:${PORT}`);
  });
}

startServer();
