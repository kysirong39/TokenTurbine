import React from 'react';
import { AlertTriangle, ShieldAlert, Cpu, Lock, CheckCircle2, RefreshCw, Layers, Siren, DollarSign } from 'lucide-react';
import { RiskAlert } from '../types';

interface RiskAndDefaultTabProps {
  riskAlerts: RiskAlert[];
  onTriggerDefault: () => void;
  onSimulateWeather: (scenario: 'base' | 'downside' | 'stress' | 'random') => void;
}

export const RiskAndDefaultTab: React.FC<RiskAndDefaultTabProps> = ({
  riskAlerts,
  onTriggerDefault,
  onSimulateWeather
}) => {
  const scenarios = [
    { name: 'Base Case (Kịch bản chuẩn)', outputPct: '100%', pricePct: '100%', cashflowPct: '100%', desc: 'Đầy đủ doanh thu, trả lợi tức 8.5%/năm đúng cam kết' },
    { name: 'Downside Case (Thấp hơn kỳ vọng)', outputPct: '85%', pricePct: '100%', cashflowPct: '~81%', desc: 'Sản lượng giảm nhẹ, Smart contract chuyển sang Enhanced Monitoring' },
    { name: 'Stress Case (Kịch bản căng thẳng)', outputPct: '70%', pricePct: '100%', cashflowPct: '~60%', desc: 'Tín hiệu cảnh báo rủi ro cao, ưu tiên trích lập dự phòng trả nợ' },
  ];

  const smartContractSecurityMeasures = [
    { title: 'Independent Smart Contract Audit', desc: 'Kiểm toán mã nguồn độc lập bởi CertiK / Halborn trước khi phát hành' },
    { title: 'Fireblocks Multi-Signature (3/3)', desc: 'Yêu cầu 3/3 chữ ký MPC từ SPV, BIDV và Đơn vị Kiểm toán' },
    { title: 'Role-Based Access Control (RBAC)', desc: 'Phân quyền chặt chẽ giữa Issuer, Custodian và Oracle Agent' },
    { title: 'Emergency Pause & Timelock', desc: 'Khóa tạm thời Smart Contract khi phát hiện bất thường và có độ trễ phê duyệt' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Cơ Chế Quản Trị Rủi Ro & Xử Lý Sự Kiện Default (Vỡ Nợ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            PoC chứng minh không chỉ "token hóa được" mà còn bảo vệ quyền lợi nhà đầu tư qua các điều kiện lập trình trực tiếp vào Smart Contract.
          </p>
        </div>

        <button
          onClick={onTriggerDefault}
          className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
        >
          <Siren className="w-4 h-4 animate-bounce" />
          <span>Kích Hoạt Thử Nghiệm Sự Kiện Default (Vỡ Nợ SPV)</span>
        </button>
      </div>

      {/* Scenario Stress Testing Matrix Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-100 mb-2">
          Bảng Kịch Bản Rủi Ro Doanh Thu Turbine (Công Bố Trước Khi Phát Hành)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Nhà đầu tư đánh giá trước mức độ rủi ro tương ứng với các kịch bản thời tiết/vận hành
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md mb-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase">
              <tr>
                <th className="py-3.5 px-4">Kịch Bản (Scenario)</th>
                <th className="py-3.5 px-4">Sản Lượng Điện</th>
                <th className="py-3.5 px-4">Giá Điện PPA</th>
                <th className="py-3.5 px-4">Dòng Tiền Thực Nhận (Cash Flow)</th>
                <th className="py-3.5 px-4">Hành Động Hệ Thống & Tác Động</th>
                <th className="py-3.5 px-4">Thử Nghiệm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {scenarios.map((sc, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">{sc.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{sc.outputPct}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{sc.pricePct}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{sc.cashflowPct}</td>
                  <td className="py-3.5 px-4 text-slate-400">{sc.desc}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSimulateWeather(idx === 0 ? 'base' : idx === 1 ? 'downside' : 'stress')}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-slate-100 font-semibold px-3 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer"
                    >
                      Kích hoạt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Default Mechanism & Assets Liquidation Council */}
      <div className="bg-white/5 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Cơ Chế Xử Lý Default (Vỡ Nợ SPV) & Bảo Vệ Tài Sản</h3>
            <p className="text-xs text-slate-400">
              Nếu SPV vi phạm nghĩa vụ phân phối dòng tiền, Smart Contract tự động đóng băng tài sản & chuyển giao quyền điều hành cho Hội đồng Xử lý Tài sản.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Bước 1: Trigger Event</span>
            <p className="font-bold text-slate-200 mt-1">Vi Phạm Thanh Toán</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Hệ thống phát hiện SPV chậm trả cổ tức quá hạn định</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Bước 2: Lock Smart Contract</span>
            <p className="font-bold text-slate-200 mt-1">Khóa Khẩn Cấp Tài Sản</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Fireblocks Vault chuyển sang chế độ Frozen, cấm rút vốn SPV</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Bước 3: Council Formation</span>
            <p className="font-bold text-slate-200 mt-1">Thành Lập Hội Đồng</p>
            <p className="text-[11px] text-slate-400 mt-0.5">BIDV đại diện nhà đầu tư tiếp quản & đấu giá khai thác turbine</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Bước 4: Investor Recovery</span>
            <p className="font-bold text-slate-200 mt-1">Hoàn Trả Tiền Nhà Đầu Tư</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Giá trị tài sản thanh lý được phân phối trực tiếp về ví nhà đầu tư</p>
          </div>
        </div>
      </div>

      {/* Active System Risk Logs */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-100 mb-4">Nhật Ký Cảnh Báo Rủi Ro Hệ Thống (Live Monitoring Logs)</h3>

        <div className="space-y-3">
          {riskAlerts.map((ra) => (
            <div key={ra.id} className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    ra.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {ra.severity}
                  </span>
                  <h4 className="font-bold text-xs text-slate-200">{ra.title}</h4>
                </div>
                <p className="text-xs text-slate-400">{ra.description}</p>
                <p className="text-[11px] text-teal-400 font-medium">Phương án xử lý: {ra.mitigationPlan}</p>
              </div>

              <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                {new Date(ra.triggeredAt).toLocaleTimeString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
