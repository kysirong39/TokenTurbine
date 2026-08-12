import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectOverviewTab } from './components/ProjectOverviewTab';
import { IssuanceAndCustodyTab } from './components/IssuanceAndCustodyTab';
import { CoreBankingWaterfallTab } from './components/CoreBankingWaterfallTab';
import { SecondaryMarketTab } from './components/SecondaryMarketTab';
import { InvestorPortfolioTab } from './components/InvestorPortfolioTab';
import { RiskAndDefaultTab } from './components/RiskAndDefaultTab';
import { KpiVerificationTab } from './components/KpiVerificationTab';
import { AiAnalystModal } from './components/AiAnalystModal';

import { WindProject, WindTurbine, Investor, CashflowWaterfall, StellarTx, FireblocksVault, Order, Trade, RiskAlert, PocKPI } from './types';
import {
  initialProject,
  initialTurbines,
  initialInvestors,
  initialCashflowEvents,
  initialStellarTxs,
  initialVaults,
  initialOrders,
  initialTrades,
  initialRiskAlerts,
  initialKpis
} from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSimulatingEvn, setIsSimulatingEvn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core App State
  const [project, setProject] = useState<WindProject>(initialProject);
  const [turbines, setTurbines] = useState<WindTurbine[]>(initialTurbines);
  const [investors, setInvestors] = useState<Investor[]>(initialInvestors);
  const [cashflowEvents, setCashflowEvents] = useState<CashflowWaterfall[]>(initialCashflowEvents);
  const [stellarTxs, setStellarTxs] = useState<StellarTx[]>(initialStellarTxs);
  const [vaults, setVaults] = useState<FireblocksVault[]>(initialVaults);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(initialRiskAlerts);
  const [kpis, setKpis] = useState<PocKPI[]>(initialKpis);

  // Fetch initial state from Express backend (with fallback to client mock data)
  const refreshAllData = async () => {
    try {
      const [projRes, turRes, invRes, cashRes, stelRes, fbRes, mktRes, kpiRes, riskRes] = await Promise.all([
        fetch('/api/project').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/turbines').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/investors').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/cashflow').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/stellar/ledger').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/fireblocks/vaults').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/market/orders').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/kpis').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/risks').then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (projRes?.project) setProject(projRes.project);
      if (Array.isArray(turRes)) setTurbines(turRes);
      if (Array.isArray(invRes)) setInvestors(invRes);
      if (cashRes?.cashflowEvents) setCashflowEvents(cashRes.cashflowEvents);
      if (stelRes?.transactions) setStellarTxs(stelRes.transactions);
      if (fbRes?.vaults) setVaults(fbRes.vaults);
      if (mktRes?.orders) setOrders(mktRes.orders);
      if (mktRes?.trades) setTrades(mktRes.trades);
      if (Array.isArray(kpiRes)) setKpis(kpiRes);
      if (Array.isArray(riskRes)) setRiskAlerts(riskRes);
    } catch (err) {
      console.warn('Backend API unavailable, using client-side fallback state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Handler: Trigger EVN Revenue Payment & Automated Waterfall Execution
  const handleSimulateEvnPayment = async () => {
    setIsSimulatingEvn(true);
    try {
      const res = await fetch('/api/cashflow/simulate-evn-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revenueVND: 12500000000, operatingCostVND: 2500000000 })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.event) {
          setCashflowEvents(prev => [data.event, ...prev]);
          await refreshAllData();
          setActiveTab('waterfall');
        }
      } else {
        // Fallback for static GitHub Pages execution
        const revenueVND = 12500000000;
        const operatingCostVND = 2500000000;
        const netDistributable = revenueVND - operatingCostVND;
        const distributionPerToken = Math.floor(netDistributable / project.totalSupplyTokens);
        const now = new Date();
        const periodStr = `Tháng ${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        const bidvRef = `BIDV-FT${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(10000 + Math.random()*89999)}`;
        const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');

        const newEvent: CashflowWaterfall = {
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

        setCashflowEvents(prev => [newEvent, ...prev]);

        setInvestors(prev => prev.map(inv => {
          if (inv.eKYCStatus === 'verified' && inv.tokenBalance > 0) {
            const payout = inv.tokenBalance * distributionPerToken;
            return {
              ...inv,
              fiatBalanceVND: inv.fiatBalanceVND + payout,
              totalDividendsReceivedVND: inv.totalDividendsReceivedVND + payout
            };
          }
          return inv;
        }));

        setStellarTxs(prev => [{
          id: `TX-${Date.now().toString().slice(-4)}`,
          hash: txHash,
          ledger: 5000000 + Math.floor(Math.random() * 50000),
          type: 'WATERFALL_DISTRIBUTION' as const,
          from: 'G_BIDV_ESCROW_SMART_CONTRACT',
          to: 'ALL_VERIFIED_HOLDERS',
          amount: `${netDistributable.toLocaleString('vi-VN')} VND (${distributionPerToken.toLocaleString('vi-VN')} VND/Token)`,
          assetCode: 'VND-STABLE',
          status: 'SUCCESS' as const,
          timestamp: now.toISOString()
        }, ...prev]);

        setActiveTab('waterfall');
      }
    } catch (err) {
      console.error('Failed to execute EVN payment:', err);
    } finally {
      setIsSimulatingEvn(false);
    }
  };

  // Handler: Simulate IoT Weather Scenario
  const handleSimulateWeather = async (scenario: 'base' | 'downside' | 'stress' | 'random') => {
    try {
      const res = await fetch('/api/turbines/simulate-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.turbines) {
          setTurbines(data.turbines);
        }
      } else {
        // Fallback for static client execution
        setTurbines(prev => prev.map(t => {
          let factor = 1.0;
          if (scenario === 'downside') factor = 0.85;
          if (scenario === 'stress') factor = 0.70;
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
        }));
      }
    } catch (err) {
      console.error('Weather simulation error:', err);
    }
  };

  // Handler: Admin eKYC Toggle
  const handleToggleEkyc = async (investorId: string, currentStatus: string) => {
    const action = currentStatus === 'verified' ? 'revoke' : 'approve';
    try {
      const res = await fetch('/api/investors/ekyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, action })
      }).catch(() => null);

      if (res && res.ok) {
        await refreshAllData();
      } else {
        setInvestors(prev => prev.map(inv => {
          if (inv.id === investorId) {
            return {
              ...inv,
              eKYCStatus: action === 'approve' ? 'verified' as const : 'unverified' as const
            };
          }
          return inv;
        }));
      }
    } catch (err) {
      console.error('eKYC toggle error:', err);
    }
  };

  // Handler: Place Secondary Market Trade
  const handlePlaceOrder = async (orderData: { investorId: string; type: 'buy' | 'sell'; amountTokens: number; priceVND: number }) => {
    try {
      const res = await fetch('/api/market/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.error) {
          alert(data.error);
        } else {
          await refreshAllData();
        }
      } else {
        // Fallback for static client execution
        const investor = investors.find(i => i.id === orderData.investorId);
        if (!investor) return alert('Không tìm thấy nhà đầu tư');
        if (investor.eKYCStatus !== 'verified') {
          return alert('Vi phạm chính sách tuân thủ ERC-3643: Tài khoản chưa hoàn tất eKYC/AML!');
        }

        const totalVal = orderData.amountTokens * orderData.priceVND;
        if (orderData.type === 'sell' && investor.tokenBalance < orderData.amountTokens) {
          return alert('Số dư Token WIND không đủ để tạo lệnh bán!');
        }
        if (orderData.type === 'buy' && investor.fiatBalanceVND < totalVal) {
          return alert('Số dư Fiat VND không đủ để tạo lệnh mua!');
        }

        const newOrder: Order = {
          id: `ORD-${Date.now().toString().slice(-4)}`,
          investorId: investor.id,
          investorName: investor.name,
          type: orderData.type,
          amountTokens: +orderData.amountTokens,
          priceVND: +orderData.priceVND,
          totalValueVND: totalVal,
          status: 'open',
          kycCompliant: true,
          createdAt: new Date().toISOString()
        };

        setOrders(prev => [newOrder, ...prev]);
        alert('Lệnh giao dịch đã tạo thành công và đưa vào Sổ lệnh!');
      }
    } catch (err) {
      console.error('Trade order error:', err);
    }
  };

  // Handler: Trigger Default Event
  const handleTriggerDefault = async () => {
    if (!confirm('Bạn có chắc chắn muốn thử nghiệm Kích hoạt Sự kiện Default (Vỡ Nợ SPV) không?')) return;
    try {
      const res = await fetch('/api/risk/trigger-default', { method: 'POST' }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data.alert) {
          setRiskAlerts(prev => [data.alert, ...prev]);
          await refreshAllData();
          setActiveTab('risk');
        }
      } else {
        const defaultAlert: RiskAlert = {
          id: `DEFAULT-${Date.now()}`,
          type: 'SPV_DEFAULT_RISK' as const,
          severity: 'critical' as const,
          title: 'Sự kiện Default (Vỡ nợ) do SPV vi phạm nghĩa vụ thanh toán',
          description: 'SPV không thực hiện thanh toán dòng tiền lợi tức đúng hạn. Kích hoạt quy trình xử lý tài sản & thành lập Hội đồng Thanh lý Tài sản.',
          mitigationPlan: 'Triển khai Smart Contract Liquidation, đấu giá quyền khai thác 16 Turbine 50MW và thu hồi tiền hoàn trả nhà đầu tư theo tỷ lệ sở hữu.',
          triggeredAt: new Date().toISOString(),
          active: true
        };

        setRiskAlerts(prev => [defaultAlert, ...prev]);
        setStellarTxs(prev => [{
          id: `TX-DEFAULT-${Date.now().toString().slice(-4)}`,
          hash: '0xDEF489021A8829C1109B03912',
          ledger: 5090001,
          type: 'DEFAULT_LIQUIDATION' as const,
          from: 'G_BIDV_TRUSTEE_SMART_CONTRACT',
          to: 'SPV_DEFAULT_COMMITTEE',
          amount: 'ALL_200B_VND_ASSETS_FROZEN',
          assetCode: 'WIND-RWA',
          status: 'SUCCESS' as const,
          timestamp: new Date().toISOString()
        }, ...prev]);

        setActiveTab('risk');
      }
    } catch (err) {
      console.error('Default trigger error:', err);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4 relative z-10" />
        <p className="text-sm font-semibold relative z-10">Đang khởi tạo Hệ thống PoC Tokenize Turbine Điện Gió BIDV...</p>
      </div>
    );
  }

  const activeAlertCount = riskAlerts.filter(r => r.active).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/3 w-[700px] h-[400px] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Header & Navigation */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onSimulateEvnPayment={handleSimulateEvnPayment}
          isSimulatingEvn={isSimulatingEvn}
          activeAlertCount={activeAlertCount}
        />
      </div>

      {/* Main Tab Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={project}
            turbines={turbines}
            onSimulateWeather={handleSimulateWeather}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'issuance' && (
          <IssuanceAndCustodyTab
            vaults={vaults}
            stellarTxs={stellarTxs}
            blockchainNetwork={project.blockchainNetwork}
            custodyProvider={project.custodyProvider}
          />
        )}

        {activeTab === 'waterfall' && (
          <CoreBankingWaterfallTab
            cashflowEvents={cashflowEvents}
            onSimulateEvnPayment={handleSimulateEvnPayment}
            isSimulatingEvn={isSimulatingEvn}
            totalValuationVND={project.totalValuationVND}
            totalSupplyTokens={project.totalSupplyTokens}
          />
        )}

        {activeTab === 'market' && (
          <SecondaryMarketTab
            investors={investors}
            orders={orders}
            trades={trades}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'investor' && (
          <InvestorPortfolioTab
            investors={investors}
            onToggleEkyc={handleToggleEkyc}
            totalSupplyTokens={project.totalSupplyTokens}
          />
        )}

        {activeTab === 'risk' && (
          <RiskAndDefaultTab
            riskAlerts={riskAlerts}
            onTriggerDefault={handleTriggerDefault}
            onSimulateWeather={handleSimulateWeather}
          />
        )}

        {activeTab === 'kpi' && (
          <KpiVerificationTab kpis={kpis} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-6 text-center text-xs text-slate-400 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PoC Tokenize Turbine Điện Gió - R&D BIDV</p>
          <p className="font-mono text-slate-300">
            Regulated RWA Framework | Stellar Soroban Smart Contract & Fireblocks Custody
          </p>
        </div>
      </footer>

      {/* AI Innovation Analyst Chat Modal */}
      <AiAnalystModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
