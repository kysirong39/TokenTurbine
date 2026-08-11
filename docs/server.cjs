var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var projectData = {
  id: "WIND-BINH-THUAN-01",
  name: "C\u1EE5m Turbine \u0110i\u1EC7n Gi\xF3 B\xECnh Thu\u1EADn (50MW)",
  spvName: "SPV N\u0103ng L\u01B0\u1EE3ng Xanh B\xECnh Thu\u1EADn JSC",
  location: "Tuy Phong, B\xECnh Thu\u1EADn, Vi\u1EC7t Nam",
  totalCapacityMW: 50,
  turbineCount: 16,
  ppaContractor: "T\u1EADp \u0111o\xE0n \u0110i\u1EC7n l\u1EF1c Vi\u1EC7t Nam (EVN)",
  totalValuationVND: 2e11,
  // 200 Tỷ VND
  totalSupplyTokens: 2e6,
  // 2 Triệu Tokens
  tokenPriceVND: 1e5,
  // 100,000 VND / Token
  targetYieldPct: 8.5,
  // Lãi suất kỳ vọng tối thiểu 8.5%/năm
  bankEscrowPartner: "Ng\xE2n h\xE0ng TMCP \u0110\u1EA7u t\u01B0 v\xE0 Ph\xE1t tri\u1EC3n Vi\u1EC7t Nam (BIDV)",
  blockchainNetwork: "Stellar Public Network (Soroban Smart Contracts)",
  custodyProvider: "Fireblocks Enterprise Vault (MPC Security)"
};
var turbines = Array.from({ length: 16 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, "0");
  const baseCapacity = 3.125;
  const windSpeed = +(8 + Math.random() * 4).toFixed(1);
  const efficiency = +(90 + Math.random() * 8).toFixed(1);
  const currentPower = +(baseCapacity * (efficiency / 100)).toFixed(2);
  return {
    id: `TURBINE-${num}`,
    name: `Turbine Gi\xF3 TB-${num}`,
    capacityMW: baseCapacity,
    currentPowerMW: currentPower,
    status: "optimal",
    windSpeedMs: windSpeed,
    efficiencyPct: efficiency,
    rotorSpeedRpm: +(14 + Math.random() * 3).toFixed(1),
    temperatureC: +(32 + Math.random() * 5).toFixed(1),
    totalGenerationMWh: +(1250 + Math.random() * 200).toFixed(1),
    lastOracleSync: (/* @__PURE__ */ new Date()).toISOString()
  };
});
var investors = [
  {
    id: "INV-001",
    name: "Nh\xE0 \u0111\u1EA7u t\u01B0 Nguy\u1EC5n V\u0103n A",
    email: "nguyenvana@gmail.com",
    taxCode: "0312456789",
    eKYCStatus: "verified",
    investorType: "individual",
    tokenBalance: 2e4,
    // 20,000 tokens (1% sở hữu = 2 Tỷ VND)
    fiatBalanceVND: 15e7,
    stellarAddress: "GDX7...4K9L_INV_A",
    fireblocksVaultId: "FB-VAULT-INV-001",
    totalDividendsReceivedVND: 1e8
    // 100 Triệu từ đợt phân phối trước
  },
  {
    id: "INV-002",
    name: "Qu\u1EF9 \u0110\u1EA7u t\u01B0 Xanh ESG Vietnam Fund",
    email: "contact@esgfund.vn",
    taxCode: "0109888999",
    eKYCStatus: "verified",
    investorType: "esg_fund",
    tokenBalance: 5e5,
    // 25% sở hữu = 50 Tỷ VND
    fiatBalanceVND: 25e8,
    stellarAddress: "GA89...99MM_ESG_FUND",
    fireblocksVaultId: "FB-VAULT-ESG-002",
    totalDividendsReceivedVND: 25e8
  },
  {
    id: "INV-003",
    name: "C\xF4ng ty C\u1ED5 ph\u1EA7n N\u0103ng l\u01B0\u1EE3ng T\xE1i t\u1EA1o B\xECnh Minh",
    email: "info@binhminhre.com",
    taxCode: "0400123987",
    eKYCStatus: "verified",
    investorType: "institutional",
    tokenBalance: 3e5,
    // 15% sở hữu = 30 Tỷ VND
    fiatBalanceVND: 12e8,
    stellarAddress: "GB33...11KK_BINH_MINH",
    fireblocksVaultId: "FB-VAULT-INST-003",
    totalDividendsReceivedVND: 15e8
  },
  {
    id: "INV-004",
    name: "Nh\xE0 \u0111\u1EA7u t\u01B0 Tr\u1EA7n Th\u1ECB B",
    email: "tranthib@gmail.com",
    taxCode: "0899112233",
    eKYCStatus: "pending",
    investorType: "individual",
    tokenBalance: 0,
    fiatBalanceVND: 5e8,
    stellarAddress: "GCP9...77ZZ_INV_B",
    fireblocksVaultId: "FB-VAULT-INV-004",
    totalDividendsReceivedVND: 0
  }
];
var cashflowEvents = [
  {
    id: "CASH-2026-07",
    period: "Th\xE1ng 07/2026",
    powerGeneratedMWh: 14200,
    evnElectricityRevenueVND: 125e8,
    // 12.5 Tỷ VND
    operatingCostsVND: 25e8,
    // 2.5 Tỷ VND
    bankDebtReserveVND: 0,
    netDistributableCashflowVND: 1e10,
    // 10 Tỷ VND
    distributionPerTokenVND: 5e3,
    // 10 Tỷ / 2M tokens = 5,000 VND/token
    status: "waterfall_executed",
    bidvRefCode: "BIDV-FT20260731-98712",
    stellarTxHash: "0x8f1e948c27a908231c5188f28a9c148f98231a49c2b0e914",
    timestamp: "2026-07-31T17:00:00Z"
  }
];
var stellarTxs = [
  {
    id: "TX-1001",
    hash: "0xa719c8d20e9812a39108c32104f29184",
    ledger: 4891204,
    type: "TOKEN_MINT",
    from: "G_SPV_ISSUER_MASTER",
    to: "G_BIDV_CUSTODY_VAULT",
    amount: "2,000,000 WIND",
    assetCode: "WIND-RWA",
    status: "SUCCESS",
    timestamp: "2026-06-01T08:30:00Z"
  },
  {
    id: "TX-1002",
    hash: "0x8f1e948c27a908231c5188f28a9c148f98231a49c2b0e914",
    ledger: 4988210,
    type: "WATERFALL_DISTRIBUTION",
    from: "G_BIDV_ESCROW_SMART_CONTRACT",
    to: "ALL_VERIFIED_HOLDERS",
    amount: "10,000,000,000 VND (5,000 VND/WIND)",
    assetCode: "VND-STABLE",
    status: "SUCCESS",
    timestamp: "2026-07-31T17:05:00Z"
  }
];
var fireblocksVaults = [
  {
    id: "FB-VAULT-001",
    name: "SPV Master Issuance Vault",
    vaultType: "SPV_MASTER_ISSUANCE",
    assetCode: "WIND-RWA",
    balanceTokens: 118e4,
    // Remaining unallocated/treasury tokens
    fiatEscrowVND: 0,
    mpcKeyShares: 3,
    status: "ACTIVE"
  },
  {
    id: "FB-VAULT-002",
    name: "BIDV Custody & Escrow Vault",
    vaultType: "BIDV_CUSTODY_ESCROW",
    assetCode: "WIND-RWA / VND",
    balanceTokens: 82e4,
    // Custodied tokens for active investors
    fiatEscrowVND: 125e8,
    mpcKeyShares: 3,
    status: "ACTIVE"
  }
];
var orders = [
  {
    id: "ORD-001",
    investorId: "INV-001",
    investorName: "Nh\xE0 \u0111\u1EA7u t\u01B0 Nguy\u1EC5n V\u0103n A",
    type: "sell",
    amountTokens: 2e3,
    priceVND: 102e3,
    totalValueVND: 204e6,
    status: "open",
    kycCompliant: true,
    createdAt: "2026-08-08T09:15:00Z"
  },
  {
    id: "ORD-002",
    investorId: "INV-003",
    investorName: "C\xF4ng ty C\u1ED5 ph\u1EA7n N\u0103ng l\u01B0\u1EE3ng T\xE1i t\u1EA1o B\xECnh Minh",
    type: "buy",
    amountTokens: 5e3,
    priceVND: 101500,
    totalValueVND: 5075e5,
    status: "open",
    kycCompliant: true,
    createdAt: "2026-08-09T14:20:00Z"
  }
];
var trades = [
  {
    id: "TRD-501",
    buyOrderId: "ORD-HIST-01",
    sellOrderId: "ORD-HIST-02",
    buyerName: "Qu\u1EF9 \u0110\u1EA7u t\u01B0 Xanh ESG Vietnam Fund",
    sellerName: "Nh\xE0 \u0111\u1EA7u t\u01B0 L\xEA V\u0103n C",
    amountTokens: 1e4,
    priceVND: 101e3,
    totalValueVND: 101e7,
    txHash: "0x3c2a11b899d421e780a1c99021",
    timestamp: "2026-08-05T11:45:00Z"
  }
];
var riskAlerts = [
  {
    id: "RISK-01",
    turbineId: "TURBINE-07",
    type: "TURBINE_UNDERPERFORMANCE",
    severity: "low",
    title: "C\u1EA3nh b\xE1o hi\u1EC7u su\u1EA5t Turbine 07",
    description: "T\u1ED1c \u0111\u1ED9 gi\xF3 duy tr\xEC 6.2 m/s, c\xF4ng su\u1EA5t ph\xE1t 2.1 MW (~67% thi\u1EBFt k\u1EBF). \u0110\xE3 g\u1EEDi t\xEDn hi\u1EC7u sang h\u1EC7 th\u1ED1ng O&M.",
    mitigationPlan: "Trigger enhanced monitoring & O&M inspection ticket #48102",
    triggeredAt: "2026-08-09T18:00:00Z",
    active: true
  }
];
var pocKpis = [
  {
    id: "KPI-TECH-01",
    category: "technology",
    metricName: "Token Issuance Time (Th\u1EDDi gian ph\xE1t h\xE0nh)",
    target: "< 15 ph\xFAt",
    actual: "4.2 ph\xFAt",
    status: "passed",
    description: "T\xEDnh t\u1EEB l\xFAc SPV k\xFD ph\xEA duy\u1EC7t MPC tr\xEAn Fireblocks \u0111\u1EBFn khi Smart contract kh\u1EDFi t\u1EA1o tr\xEAn Stellar"
  },
  {
    id: "KPI-TECH-02",
    category: "technology",
    metricName: "Transaction Processing Time (T\u1ED1c \u0111\u1ED9 giao d\u1ECBch)",
    target: "< 5 gi\xE2y",
    actual: "2.8 gi\xE2y",
    status: "passed",
    description: "X\xE1c nh\u1EADn kh\u1ED1i tr\xEAn Stellar Public Blockchain & c\u1EA5p nh\u1EADt s\u1ED5 c\xE1i"
  },
  {
    id: "KPI-TECH-03",
    category: "technology",
    metricName: "Oracle Latency (\u0110\u1ED9 tr\u1EC5 truy\u1EC1n d\u1EEF li\u1EC7u IoT)",
    target: "< 1 ph\xFAt",
    actual: "12 gi\xE2y",
    status: "passed",
    description: "T\u1EEB c\u1EA3m bi\u1EBFn turbine qua MQTT Gateway t\u1EDBi BIDV API & Smart Contract"
  },
  {
    id: "KPI-EFF-01",
    category: "efficiency",
    metricName: "Chi ph\xED ph\xE1t h\xE0nh & qu\u1EA3n l\xFD",
    target: "Gi\u1EA3m 60% so v\u1EDBi TPDN truy\u1EC1n th\u1ED1ng",
    actual: "Gi\u1EA3m 68%",
    status: "passed",
    description: "Ti\u1EBFt ki\u1EC7m chi ph\xED trung gian nh\u1EDD t\u1EF1 \u0111\u1ED9ng h\xF3a Smart Contract & Custody Fireblocks"
  },
  {
    id: "KPI-EFF-02",
    category: "efficiency",
    metricName: "Chi ph\xED ph\xE2n ph\u1ED1i d\xF2ng ti\u1EC1n Waterfall",
    target: "< 0.05% t\u1ED5ng doanh thu",
    actual: "0.012%",
    status: "passed",
    description: "Chi ph\xED gas & banking API routing t\u1EF1 \u0111\u1ED9ng"
  },
  {
    id: "KPI-OP-01",
    category: "operation",
    metricName: "Th\u1EDDi gian ph\xE2n b\u1ED5 l\u1EE3i t\u1EE9c t\u1EDBi nh\xE0 \u0111\u1EA7u t\u01B0",
    target: "T\u1EF1 \u0111\u1ED9ng trong T+0 (v\xE0i ph\xFAt)",
    actual: "1.5 ph\xFAt",
    status: "passed",
    description: "Thay v\xEC 5-10 ng\xE0y l\xE0m vi\u1EC7c x\u1EED l\xFD th\u1EE7 c\xF4ng t\u1EA1i ng\xE2n h\xE0ng"
  },
  {
    id: "KPI-OP-02",
    category: "operation",
    metricName: "S\u1ED1 b\u01B0\u1EDBc x\u1EED l\xFD th\u1EE7 c\xF4ng (Manual Steps)",
    target: "0 b\u01B0\u1EDBc (T\u1EF1 \u0111\u1ED9ng 100%)",
    actual: "0 b\u01B0\u1EDBc",
    status: "passed",
    description: "T\u1EEB l\xFAc EVN chuy\u1EC3n ti\u1EC1n \u0111\u1EBFn l\xFAc ti\u1EC1n v\u1EC1 t\xE0i kho\u1EA3n nh\xE0 \u0111\u1EA7u t\u01B0"
  },
  {
    id: "KPI-PROT-01",
    category: "investor_protection",
    metricName: "T\xEDnh minh b\u1EA1ch & Kh\u1EA3 n\u0103ng truy xu\u1EA5t",
    target: "100% Onchain audit",
    actual: "100% Minh b\u1EA1ch",
    status: "passed",
    description: "S\u1ED5 c\xE1i Stellar c\xF4ng khai + m\xE3 \u0111\u1ECBnh danh t\xE0i s\u1EA3n x\xE1c th\u1EF1c b\u1EDFi BIDV"
  },
  {
    id: "KPI-PROT-02",
    category: "investor_protection",
    metricName: "H\u1EA1n ch\u1EBF chuy\u1EC3n nh\u01B0\u1EE3ng sai \u0111\u1ED1i t\u01B0\u1EE3ng (ERC-3643)",
    target: "100% tu\xE2n th\u1EE7 eKYC",
    actual: "100% Tu\xE2n th\u1EE7",
    status: "passed",
    description: "Ch\u1EC9 v\xED \u0111\xE3 qua x\xE1c minh eKYC/AML m\u1EDBi c\xF3 th\u1EC3 th\u1EF1c hi\u1EC7n giao d\u1ECBch chuy\u1EC3n nh\u01B0\u1EE3ng"
  }
];
app.get("/api/project", (req, res) => {
  res.json({
    project: projectData,
    turbinesCount: turbines.length,
    totalPowerNowMW: +turbines.reduce((acc, t) => acc + t.currentPowerMW, 0).toFixed(2),
    activeAlerts: riskAlerts.filter((r) => r.active).length
  });
});
app.get("/api/turbines", (req, res) => {
  res.json(turbines);
});
app.post("/api/turbines/simulate-weather", (req, res) => {
  const { scenario } = req.body;
  turbines = turbines.map((t) => {
    let factor = 1;
    if (scenario === "downside") factor = 0.85;
    if (scenario === "stress") factor = 0.7;
    if (scenario === "random") factor = 0.8 + Math.random() * 0.3;
    const baseCapacity = 3.125;
    const efficiency = +Math.min(98, Math.max(40, 92 * factor + (Math.random() * 4 - 2))).toFixed(1);
    const power = +(baseCapacity * (efficiency / 100)).toFixed(2);
    const wind = +(8 * factor + Math.random() * 2).toFixed(1);
    return {
      ...t,
      windSpeedMs: wind,
      efficiencyPct: efficiency,
      currentPowerMW: power,
      status: efficiency < 75 ? "warning" : efficiency < 50 ? "critical" : "optimal",
      lastOracleSync: (/* @__PURE__ */ new Date()).toISOString()
    };
  });
  res.json({ message: `\u0110\xE3 c\u1EADp nh\u1EADt gi\u1EA3 l\u1EADp k\u1ECBch b\u1EA3n: ${scenario || "th\u1EDDi ti\u1EBFt th\u1EF1c"}`, turbines });
});
app.get("/api/investors", (req, res) => {
  res.json(investors);
});
app.post("/api/investors/ekyc", (req, res) => {
  const { investorId, action } = req.body;
  const target = investors.find((i) => i.id === investorId);
  if (target) {
    target.eKYCStatus = action === "approve" ? "verified" : "unverified";
    res.json({ message: `\u0110\xE3 c\u1EADp nh\u1EADt eKYC cho ${target.name}`, investor: target });
  } else {
    res.status(404).json({ error: "Investor not found" });
  }
});
app.get("/api/cashflow", (req, res) => {
  res.json({
    cashflowEvents,
    projectValuationVND: projectData.totalValuationVND,
    totalSupplyTokens: projectData.totalSupplyTokens,
    targetYieldPct: projectData.targetYieldPct
  });
});
app.post("/api/cashflow/simulate-evn-payment", (req, res) => {
  const { revenueVND = 1e10, operatingCostVND = 2e9 } = req.body;
  const netDistributable = Math.max(0, revenueVND - operatingCostVND);
  const distributionPerToken = Math.floor(netDistributable / projectData.totalSupplyTokens);
  const now = /* @__PURE__ */ new Date();
  const periodStr = `Th\xE1ng ${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
  const bidvRef = `BIDV-FT${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(1e4 + Math.random() * 89999)}`;
  const txHash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const newEvent = {
    id: `CASH-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${Date.now().toString().slice(-4)}`,
    period: periodStr,
    powerGeneratedMWh: 13850 + Math.floor(Math.random() * 1e3),
    evnElectricityRevenueVND: revenueVND,
    operatingCostsVND: operatingCostVND,
    bankDebtReserveVND: 0,
    netDistributableCashflowVND: netDistributable,
    distributionPerTokenVND: distributionPerToken,
    status: "waterfall_executed",
    bidvRefCode: bidvRef,
    stellarTxHash: txHash,
    timestamp: now.toISOString()
  };
  cashflowEvents.unshift(newEvent);
  investors = investors.map((inv) => {
    if (inv.eKYCStatus === "verified" && inv.tokenBalance > 0) {
      const payout = inv.tokenBalance * distributionPerToken;
      return {
        ...inv,
        fiatBalanceVND: inv.fiatBalanceVND + payout,
        totalDividendsReceivedVND: inv.totalDividendsReceivedVND + payout
      };
    }
    return inv;
  });
  stellarTxs.unshift({
    id: `TX-${Date.now().toString().slice(-4)}`,
    hash: txHash,
    ledger: 5e6 + Math.floor(Math.random() * 5e4),
    type: "WATERFALL_DISTRIBUTION",
    from: "G_BIDV_ESCROW_SMART_CONTRACT",
    to: "ALL_VERIFIED_HOLDERS",
    amount: `${netDistributable.toLocaleString("vi-VN")} VND (${distributionPerToken.toLocaleString("vi-VN")} VND/Token)`,
    assetCode: "VND-STABLE",
    status: "SUCCESS",
    timestamp: now.toISOString()
  });
  res.json({
    message: "T\u1EF1 \u0111\u1ED9ng ph\xE2n b\u1ED5 d\xF2ng ti\u1EC1n Waterfall th\xE0nh c\xF4ng!",
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
app.get("/api/stellar/ledger", (req, res) => {
  res.json({
    network: projectData.blockchainNetwork,
    contractAddress: "CC73K8X9W2M4V11PL09Q87AZX_WIND_RWA_ERC3643",
    transactions: stellarTxs
  });
});
app.get("/api/fireblocks/vaults", (req, res) => {
  res.json({
    provider: projectData.custodyProvider,
    vaults: fireblocksVaults
  });
});
app.get("/api/market/orders", (req, res) => {
  res.json({ orders, trades });
});
app.post("/api/market/trade", (req, res) => {
  const { investorId, type, amountTokens, priceVND } = req.body;
  const investor = investors.find((i) => i.id === investorId);
  if (!investor) {
    return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y nh\xE0 \u0111\u1EA7u t\u01B0" });
  }
  if (investor.eKYCStatus !== "verified") {
    return res.status(400).json({
      error: "Vi ph\u1EA1m ch\xEDnh s\xE1ch tu\xE2n th\u1EE7 ERC-3643: T\xE0i kho\u1EA3n ch\u01B0a ho\xE0n t\u1EA5t eKYC/AML!"
    });
  }
  if (type === "sell" && investor.tokenBalance < amountTokens) {
    return res.status(400).json({ error: "S\u1ED1 d\u01B0 Token WIND kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 t\u1EA1o l\u1EC7nh b\xE1n!" });
  }
  const totalVal = amountTokens * priceVND;
  if (type === "buy" && investor.fiatBalanceVND < totalVal) {
    return res.status(400).json({ error: "S\u1ED1 d\u01B0 Fiat VND kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 t\u1EA1o l\u1EC7nh mua!" });
  }
  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-4)}`,
    investorId: investor.id,
    investorName: investor.name,
    type,
    amountTokens: +amountTokens,
    priceVND: +priceVND,
    totalValueVND: totalVal,
    status: "open",
    kycCompliant: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  orders.unshift(newOrder);
  const oppositeType = type === "buy" ? "sell" : "buy";
  const matchIndex = orders.findIndex((o) => o.type === oppositeType && o.status === "open" && (type === "buy" ? o.priceVND <= priceVND : o.priceVND >= priceVND));
  if (matchIndex !== -1) {
    const matchOrder = orders[matchIndex];
    matchOrder.status = "filled";
    newOrder.status = "filled";
    const seller = type === "sell" ? investor : investors.find((i) => i.id === matchOrder.investorId);
    const buyer = type === "buy" ? investor : investors.find((i) => i.id === matchOrder.investorId);
    const tradeTokens = Math.min(newOrder.amountTokens, matchOrder.amountTokens);
    const tradePrice = matchOrder.priceVND;
    const tradeValue = tradeTokens * tradePrice;
    if (seller && buyer) {
      seller.tokenBalance -= tradeTokens;
      seller.fiatBalanceVND += tradeValue;
      buyer.tokenBalance += tradeTokens;
      buyer.fiatBalanceVND -= tradeValue;
    }
    const txHash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    trades.unshift({
      id: `TRD-${Date.now().toString().slice(-4)}`,
      buyOrderId: type === "buy" ? newOrder.id : matchOrder.id,
      sellOrderId: type === "sell" ? newOrder.id : matchOrder.id,
      buyerName: buyer?.name || "Kh\xE1ch h\xE0ng",
      sellerName: seller?.name || "Kh\xE1ch h\xE0ng",
      amountTokens: tradeTokens,
      priceVND: tradePrice,
      totalValueVND: tradeValue,
      txHash,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    stellarTxs.unshift({
      id: `TX-${Date.now().toString().slice(-4)}`,
      hash: txHash,
      ledger: 5012090,
      type: "SECONDARY_TRANSFER",
      from: seller?.stellarAddress || "SELLER",
      to: buyer?.stellarAddress || "BUYER",
      amount: `${tradeTokens} WIND @ ${tradePrice.toLocaleString()} VND`,
      assetCode: "WIND-RWA",
      status: "SUCCESS",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return res.json({ message: "Giao d\u1ECBch kh\u1EDBp l\u1EC7nh th\xE0nh c\xF4ng tr\xEAn S\xE0n th\u1EE9 c\u1EA5p!", order: newOrder, matched: true });
  }
  res.json({ message: "L\u1EC7nh giao d\u1ECBch \u0111\xE3 t\u1EA1o th\xE0nh c\xF4ng v\xE0 \u0111\u01B0a v\xE0o S\u1ED5 l\u1EC7nh!", order: newOrder, matched: false });
});
app.get("/api/kpis", (req, res) => {
  res.json(pocKpis);
});
app.get("/api/risks", (req, res) => {
  res.json(riskAlerts);
});
app.post("/api/risk/trigger-default", (req, res) => {
  const defaultAlert = {
    id: `DEFAULT-${Date.now()}`,
    type: "SPV_DEFAULT_RISK",
    severity: "critical",
    title: "S\u1EF1 ki\u1EC7n Default (V\u1EE1 n\u1EE3) do SPV vi ph\u1EA1m ngh\u0129a v\u1EE5 thanh to\xE1n",
    description: "SPV kh\xF4ng th\u1EF1c hi\u1EC7n thanh to\xE1n d\xF2ng ti\u1EC1n l\u1EE3i t\u1EE9c \u0111\xFAng h\u1EA1n. K\xEDch ho\u1EA1t quy tr\xECnh x\u1EED l\xFD t\xE0i s\u1EA3n & th\xE0nh l\u1EADp H\u1ED9i \u0111\u1ED3ng Thanh l\xFD T\xE0i s\u1EA3n.",
    mitigationPlan: "Tri\u1EC3n khai Smart Contract Liquidation, \u0111\u1EA5u gi\xE1 quy\u1EC1n khai th\xE1c 16 Turbine 50MW v\xE0 thu h\u1ED3i ti\u1EC1n ho\xE0n tr\u1EA3 nh\xE0 \u0111\u1EA7u t\u01B0 theo t\u1EF7 l\u1EC7 s\u1EDF h\u1EEFu.",
    triggeredAt: (/* @__PURE__ */ new Date()).toISOString(),
    active: true
  };
  riskAlerts.unshift(defaultAlert);
  stellarTxs.unshift({
    id: `TX-DEFAULT-${Date.now().toString().slice(-4)}`,
    hash: "0xDEF489021A8829C1109B03912",
    ledger: 5090001,
    type: "DEFAULT_LIQUIDATION",
    from: "G_BIDV_TRUSTEE_SMART_CONTRACT",
    to: "SPV_DEFAULT_COMMITTEE",
    amount: "ALL_200B_VND_ASSETS_FROZEN",
    assetCode: "WIND-RWA",
    status: "SUCCESS",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.json({
    message: "\u0110\xE3 k\xEDch ho\u1EA1t c\u01A1 ch\u1EBF x\u1EED l\xFD S\u1EF1 ki\u1EC7n Default (V\u1EE1 n\u1EE3) th\xE0nh c\xF4ng!",
    alert: defaultAlert
  });
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Ch\u01B0a c\u1EA5u h\xECnh GEMINI_API_KEY. Vui l\xF2ng thi\u1EBFt l\u1EADp ch\xECa kh\xF3a API trong c\u1EA5u h\xECnh m\xF4i tr\u01B0\u1EDDng."
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    const systemInstruction = `
B\u1EA1n l\xE0 Chuy\xEAn gia Ph\xE2n t\xEDch C\u1EA5p cao v\u1EC1 Xu h\u01B0\u1EDBng C\xF4ng ngh\u1EC7 v\xE0 \u0110\u1ED5i m\u1EDBi S\xE1ng t\u1EA1o (Innovation Analyst) thu\u1ED9c BIDV / Ng\xE2n h\xE0ng T\xE0i ch\xEDnh.
Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 h\u1ED7 tr\u1EE3 t\u01B0 v\u1EA5n, gi\u1EA3i th\xEDch v\xE0 ph\xE2n t\xEDch b\xE0i to\xE1n Token h\xF3a Turbine \u0110i\u1EC7n Gi\xF3 (PoC Wind Turbine Tokenization) theo Business Case BIDV.

Th\xF4ng tin d\u1EF1 \xE1n PoC:
- D\u1EF1 \xE1n: C\u1EE5m 16 Turbine \u0110i\u1EC7n Gi\xF3 B\xECnh Thu\u1EADn (C\xF4ng su\u1EA5t thi\u1EBFt k\u1EBF 50MW, t\u1ED1i \u0111a 95%).
- H\u1EE3p \u0111\u1ED3ng mua b\xE1n \u0111i\u1EC7n (PPA): K\xFD tr\u1EF1c ti\u1EBFp v\u1EDBi EVN.
- \u0110\u1ECBnh gi\xE1 t\xE0i s\u1EA3n: 200 T\u1EF7 VN\u0110.
- S\u1ED1 l\u01B0\u1EE3ng ph\xE1t h\xE0nh: 2.000.000 Token WIND.
- M\u1EC7nh gi\xE1 ph\xE1t h\xE0nh: 100.000 VN\u0110 / Token.
- L\u1EE3i t\u1EE9c m\u1EE5c ti\xEAu: 8.5%/n\u0103m (nguy\xEAn t\u1EAFc Waterfall ph\xE2n ph\u1ED1i l\u1EE3i nhu\u1EADn t\u1EF1 \u0111\u1ED9ng qua Smart Contract).
- T\xEDch h\u1EE3p:
  + Stellar Blockchain (Soroban Smart Contract, ti\xEAu chu\u1EA9n ERC-3643 tu\xE2n th\u1EE7 eKYC).
  + Fireblocks Enterprise Vault (Qu\u1EA3n l\xFD kh\xF3a MPC, l\u01B0u k\xFD Token).
  + BIDV Core Banking & Escrow Account (X\xE1c nh\u1EADn ti\u1EC1n EVN g\u1EEDi v\u1EC1, t\u1EF1 \u0111\u1ED9ng trigger Smart Contract Waterfall).
  + S\xE0n th\u1EE9 c\u1EA5p ATS (Giao d\u1ECBch chuy\u1EC3n nh\u01B0\u1EE3ng gi\u1EEFa c\xE1c nh\xE0 \u0111\u1EA7u t\u01B0 \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n).
  + Qu\u1EA3n tr\u1ECB r\u1EE7i ro & C\u01A1 ch\u1EBF Default (H\u1ED9i \u0111\u1ED3ng thanh l\xFD t\xE0i s\u1EA3n khi SPV v\u1EE1 n\u1EE3).

Phong c\xE1ch tr\u1EA3 l\u1EDDi:
- Chuy\xEAn nghi\u1EC7p, kh\xE1ch quan, s\u1EAFc s\u1EA3o, c\xF3 \u0111\u1ECBnh h\u01B0\u1EDBng t\xE0i ch\xEDnh - c\xF4ng ngh\u1EC7 (Fintech/RWA).
- Lu\xF4n t\xF3m t\u1EAFt ng\u1EAFn g\u1ECDn b\u1EB1ng Markdown, s\u1EED d\u1EE5ng bullet points r\xF5 r\xE0ng.
- \u0110\u01B0a ra \u0111\u1ECBnh h\u01B0\u1EDBng \u1EE9ng d\u1EE5ng t\u1EA1i Vi\u1EC7t Nam khi ph\xF9 h\u1EE3p.
`;
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}

C\xE2u h\u1ECFi t\u1EEB ng\u01B0\u1EDDi d\xF9ng: ${prompt}` }] }
      ]
    });
    res.json({ text: response.text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message || "L\u1ED7i khi g\u1ECDi Gemini AI Studio" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Wind Turbine Tokenization PoC running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
