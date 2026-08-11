import React, { useState } from 'react';
import { Wind, ShieldCheck, Zap, Layers, RefreshCw, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { WindProject, WindTurbine } from '../types';

interface ProjectOverviewTabProps {
  project: WindProject;
  turbines: WindTurbine[];
  onSimulateWeather: (scenario: 'base' | 'downside' | 'stress' | 'random') => void;
  isLoading: boolean;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  turbines,
  onSimulateWeather,
  isLoading
}) => {
  const [activeScenario, setActiveScenario] = useState<'base' | 'downside' | 'stress'>('base');

  const totalCurrentMW = turbines.reduce((acc, t) => acc + t.currentPowerMW, 0);
  const avgEfficiency = (turbines.reduce((acc, t) => acc + t.efficiencyPct, 0) / turbines.length).toFixed(1);
  const avgWindSpeed = (turbines.reduce((acc, t) => acc + t.windSpeedMs, 0) / turbines.length).toFixed(1);

  const handleScenarioChange = (s: 'base' | 'downside' | 'stress') => {
    setActiveScenario(s);
    onSimulateWeather(s);
  };

  const stakeholders = [
    { role: 'Chủ dự án', entity: 'Công ty Cổ phần Năng lượng Tái tạo Bình Thuận', action: 'Cung cấp turbine / tài sản cơ sở' },
    { role: 'SPV (Special Purpose Vehicle)', entity: 'SPV Năng Lượng Xanh Bình Thuận JSC', action: 'Bên Nắm giữ / quản lý tài sản & dòng tiền' },
    { role: 'Đối tác phát hành TSMH', entity: 'BIDV Banking Consortium', action: 'Phát hành & bảo chứng cấu trúc token' },
    { role: 'Ngân hàng đại lý (BIDV)', entity: 'BIDV Core Banking System', action: 'Quản lý tài khoản Escrow & dòng tiền Fiat' },
    { role: 'Custodian (Lưu ký)', entity: 'Fireblocks Enterprise Vault', action: 'Lưu ký an toàn tài sản digital / token' },
    { role: 'Nền tảng Blockchain', entity: 'Stellar Public Network (Soroban)', action: 'Cung cấp hạ tầng Blockchain minh bạch' },
    { role: 'Smart Contract Dev', entity: 'Hệ thống Smart Contract ERC-3643', action: 'Xây dựng điều kiện tuân thủ & Waterfall' },
    { role: 'Oracle Provider', entity: 'IoT Sensor Gateway API', action: 'Đưa dữ liệu sản lượng turbine vật lý lên blockchain' },
    { role: 'O&M Provider', entity: 'Vestas & EVN O&M Services', action: 'Vận hành & bảo trì turbine điện gió' },
    { role: 'Kiểm toán độc lập', entity: 'PwC / EY Vietnam', action: 'Kiểm toán định kỳ tài sản & sổ cái dòng tiền' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Wind className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-xs font-medium text-slate-400">Định Giá Tài Sản Issuance</p>
          <h3 className="text-xl font-bold text-slate-100 mt-1">200 Tỷ VNĐ</h3>
          <p className="text-xs text-emerald-400 mt-1 font-medium">100% Tài sản Cụm Turbine 50MW</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <p className="text-xs font-medium text-slate-400">Tổng Số Lượng Token</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">2.000.000 Token</h3>
          <p className="text-xs text-slate-400 mt-1">Mệnh giá: <span className="text-slate-200 font-semibold">100.000 VNĐ / Token</span></p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <p className="text-xs font-medium text-slate-400">Lợi Tức Mục Tiêu Phân Phối</p>
          <h3 className="text-xl font-bold text-teal-300 mt-1">8.5% / Năm</h3>
          <p className="text-xs text-teal-400 mt-1">Tự động trả theo nguyên tắc Waterfall</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <p className="text-xs font-medium text-slate-400">Công Suất Phát Điện Hiện Tại</p>
          <h3 className="text-xl font-bold text-amber-400 mt-1">{totalCurrentMW.toFixed(2)} / 50.0 MW</h3>
          <p className="text-xs text-slate-400 mt-1">16 Turbine - Tốc độ gió TB: <span className="text-slate-200 font-semibold">{avgWindSpeed} m/s</span></p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <p className="text-xs font-medium text-slate-400">Hợp Đồng Mua Bán Điện (PPA)</p>
          <h3 className="text-lg font-bold text-blue-400 mt-1">EVN (Tập đoàn Điện lực)</h3>
          <p className="text-xs text-slate-400 mt-1">BIDV xác thực dòng tiền về Escrow</p>
        </div>
      </div>

      {/* Turbine Status Grid & Live IoT Simulator */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-100">Bản Đồ Cụm 16 Turbine Điện Gió (IoT Oracle Live)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dữ liệu cảm biến IoT thời gian thực được kết nối trực tiếp với Oracle Smart Contract
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex items-center bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-slate-400 px-2 font-medium">Giả lập kịch bản:</span>
            <button
              onClick={() => handleScenarioChange('base')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeScenario === 'base'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Base Case (100%)
            </button>
            <button
              onClick={() => handleScenarioChange('downside')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeScenario === 'downside'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Downside (85%)
            </button>
            <button
              onClick={() => handleScenarioChange('stress')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeScenario === 'stress'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stress Case (70%)
            </button>
          </div>
        </div>

        {/* Efficiency summary bar */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Hiệu suất trung bình cụm:</span>
            <span className={`font-bold text-sm ${+avgEfficiency >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {avgEfficiency}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Tổng công suất phát ra:</span>
            <span className="font-bold text-sm text-amber-400">{totalCurrentMW.toFixed(2)} MW</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Xác nhận Oracle Blockchain:</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>
        </div>

        {/* 16 Turbines Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {turbines.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all relative overflow-hidden ${
                t.status === 'optimal'
                  ? 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10'
                  : t.status === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-slate-200">{t.name.replace('Turbine Gió ', '')}</span>
                <span className={`w-2 h-2 rounded-full ${
                  t.status === 'optimal' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`} />
              </div>

              <div className="flex justify-center my-2">
                <Wind className={`w-7 h-7 text-emerald-400 transition-all ${
                  t.status === 'optimal' ? 'animate-spin-slow' : 'opacity-60'
                }`} />
              </div>

              <div className="space-y-1 text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>Công suất:</span>
                  <span className="font-bold text-slate-200">{t.currentPowerMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>Gió:</span>
                  <span className="text-slate-300">{t.windSpeedMs} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Hiệu suất:</span>
                  <span className={t.efficiencyPct < 80 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {t.efficiencyPct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholders & Ecosystem Architecture Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <Building className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-100">
            Mô Hình Thể Thiết & Các Bên Tham Gia Mô Hình Regulated RWA (BIDV)
          </h2>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Quy trình phát hành Token Turbine Điện Gió tuân thủ mô hình pháp lý SPV kết hợp lưu ký ngân hàng BIDV & bảo mật Fireblocks
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Các bên tham gia</th>
                <th className="py-3.5 px-4">Đơn vị chịu trách nhiệm</th>
                <th className="py-3.5 px-4">Vai trò & Nhiệm vụ chính</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {stakeholders.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{s.role}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{s.entity}</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
