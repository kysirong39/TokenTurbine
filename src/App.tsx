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

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSimulatingEvn, setIsSimulatingEvn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core App State
  const [project, setProject] = useState<WindProject | null>(null);
  const [turbines, setTurbines] = useState<WindTurbine[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [cashflowEvents, setCashflowEvents] = useState<CashflowWaterfall[]>([]);
  const [stellarTxs, setStellarTxs] = useState<StellarTx[]>([]);
  const [vaults, setVaults] = useState<FireblocksVault[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [kpis, setKpis] = useState<PocKPI[]>([]);

  // Fetch initial state from Express backend
  const refreshAllData = async () => {
    try {
      const [projRes, turRes, invRes, cashRes, stelRes, fbRes, mktRes, kpiRes, riskRes] = await Promise.all([
        fetch('/api/project').then(r => r.json()),
        fetch('/api/turbines').then(r => r.json()),
        fetch('/api/investors').then(r => r.json()),
        fetch('/api/cashflow').then(r => r.json()),
        fetch('/api/stellar/ledger').then(r => r.json()),
        fetch('/api/fireblocks/vaults').then(r => r.json()),
        fetch('/api/market/orders').then(r => r.json()),
        fetch('/api/kpis').then(r => r.json()),
        fetch('/api/risks').then(r => r.json()),
      ]);

      if (projRes.project) setProject(projRes.project);
      if (Array.isArray(turRes)) setTurbines(turRes);
      if (Array.isArray(invRes)) setInvestors(invRes);
      if (cashRes.cashflowEvents) setCashflowEvents(cashRes.cashflowEvents);
      if (stelRes.transactions) setStellarTxs(stelRes.transactions);
      if (fbRes.vaults) setVaults(fbRes.vaults);
      if (mktRes.orders) setOrders(mktRes.orders);
      if (mktRes.trades) setTrades(mktRes.trades);
      if (Array.isArray(kpiRes)) setKpis(kpiRes);
      if (Array.isArray(riskRes)) setRiskAlerts(riskRes);
    } catch (err) {
      console.error('Failed to load initial backend state:', err);
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
      });
      const data = await res.json();
      if (data.event) {
        setCashflowEvents(prev => [data.event, ...prev]);
        await refreshAllData();
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
      });
      const data = await res.json();
      if (data.turbines) {
        setTurbines(data.turbines);
      }
    } catch (err) {
      console.error('Weather simulation error:', err);
    }
  };

  // Handler: Admin eKYC Toggle
  const handleToggleEkyc = async (investorId: string, currentStatus: string) => {
    const action = currentStatus === 'verified' ? 'revoke' : 'approve';
    try {
      await fetch('/api/investors/ekyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, action })
      });
      await refreshAllData();
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
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        await refreshAllData();
      }
    } catch (err) {
      console.error('Trade order error:', err);
    }
  };

  // Handler: Trigger Default Event
  const handleTriggerDefault = async () => {
    if (!confirm('Bạn có chắc chắn muốn thử nghiệm Kích hoạt Sự kiện Default (Vỡ Nợ SPV) không?')) return;
    try {
      const res = await fetch('/api/risk/trigger-default', { method: 'POST' });
      const data = await res.json();
      if (data.alert) {
        setRiskAlerts(prev => [data.alert, ...prev]);
        await refreshAllData();
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
          <p>© 2026 PoC Tokenize Turbine Điện Gió - BIDV Banking Consortium & Partners</p>
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
