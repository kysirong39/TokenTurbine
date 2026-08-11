import React from 'react';
import { Wind, ShieldCheck, Database, Cpu, Bot, DollarSign, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal: () => void;
  onSimulateEvnPayment: () => void;
  isSimulatingEvn: boolean;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiModal,
  onSimulateEvnPayment,
  isSimulatingEvn,
  activeAlertCount
}) => {
  const tabs = [
    { id: 'overview', label: '1. Tổng quan Dự án', icon: Wind },
    { id: 'issuance', label: '2. Phát hành & Lưu ký', icon: ShieldCheck },
    { id: 'waterfall', label: '3. BIDV Banking & Waterfall', icon: Database },
    { id: 'market', label: '4. Sàn thứ cấp ATS', icon: Activity },
    { id: 'investor', label: '5. Nhà đầu tư & eKYC', icon: DollarSign },
    { id: 'risk', label: '6. Quản trị rủi ro & Default', icon: Cpu },
    { id: 'kpi', label: '7. Kiểm chứng KPI PoC', icon: ShieldCheck },
  ];

  return (
    <header className="bg-white/5 backdrop-blur-xl text-white border-b border-white/10 sticky top-0 z-40 shadow-2xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <Wind className="w-6 h-6 text-slate-950 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                BIDV PoC RWA
              </span>
              <span className="text-slate-400 text-xs font-medium">Mô hình Regulated Tokenized Wind Asset</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight mt-0.5">
              Nền Tảng Token Hóa Turbine Điện Gió 50MW
            </h1>
          </div>
        </div>

        {/* Integration Badges */}
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Stellar Soroban:</span>
            <span className="text-emerald-400 font-mono font-bold">Testnet Active</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium">Fireblocks Vault:</span>
            <span className="text-cyan-400 font-mono font-bold">MPC 3/3</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 font-medium">Core Banking BIDV:</span>
            <span className="text-blue-400 font-mono font-bold">Live API</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateEvnPayment}
            disabled={isSimulatingEvn}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-slate-950" />
            <span>{isSimulatingEvn ? 'Đang xử lý Waterfall...' : 'Giả lập EVN Trả Tiền Điện (10 Tỷ)'}</span>
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs px-3.5 py-2.5 rounded-2xl transition-all border border-white/10 backdrop-blur-md shadow-md cursor-pointer"
          >
            <Bot className="w-4 h-4 text-indigo-300" />
            <span className="hidden sm:inline">Trợ lý AI Studio</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1.5 py-2.5" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-emerald-400 border border-white/20 shadow-lg shadow-black/20 backdrop-blur-xl'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'risk' && activeAlertCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    {activeAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
