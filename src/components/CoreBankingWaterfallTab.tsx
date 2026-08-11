import React, { useState } from 'react';
import { Database, ArrowRight, DollarSign, CheckCircle2, ShieldAlert, Cpu, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { CashflowWaterfall } from '../types';

interface CoreBankingWaterfallTabProps {
  cashflowEvents: CashflowWaterfall[];
  onSimulateEvnPayment: () => void;
  isSimulatingEvn: boolean;
  totalValuationVND: number;
  totalSupplyTokens: number;
}

export const CoreBankingWaterfallTab: React.FC<CoreBankingWaterfallTabProps> = ({
  cashflowEvents,
  onSimulateEvnPayment,
  isSimulatingEvn,
  totalValuationVND,
  totalSupplyTokens
}) => {
  const [customRevenue, setCustomRevenue] = useState(12500000000); // 12.5 Billion VND
  const [customOpCost, setCustomOpCost] = useState(2500000000);   // 2.5 Billion VND

  const netDistributable = Math.max(0, customRevenue - customOpCost);
  const payoutPerToken = Math.floor(netDistributable / totalSupplyTokens);

  const waterfallSteps = [
    { step: 1, title: 'Turbine Phát Điện', desc: 'Sản lượng điện từ 16 Turbine 50MW ghi nhận qua cảm biến IoT Sensor' },
    { step: 2, title: 'EVN Thanh Toán', desc: 'EVN chuyển doanh thu mua bán điện PPA vào Tài khoản Escrow SPV tại BIDV' },
    { step: 3, title: 'BIDV Xác Nhận', desc: 'Ngân hàng BIDV xác nhận tiền ghi có qua Core Banking API & cấp mã GD' },
    { step: 4, title: 'Oracle Push Onchain', desc: 'Hệ thống tích hợp đẩy dữ liệu doanh thu xác thực lên Stellar Smart Contract' },
    { step: 5, title: 'Xác Định Waterfall', desc: 'Smart Contract tự động trừ Chi phí Vận hành (O&M) & tính Lợi tức Phân phối' },
    { step: 6, title: 'Phân Bổ Tự Động', desc: 'Tiền chuyển về ví/tài khoản nhà đầu tư theo tỷ lệ Token: Balance × Dividend/Token' },
  ];

  return (
    <div className="space-y-6">
      {/* Waterfall Flow Visualizer Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-100">
                Quy Trình Phân Phối Dòng Tiền Tự Động (Smart Contract Waterfall Engine)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Doanh thu từ hợp đồng bán điện PPA với EVN được Ngân hàng BIDV xác nhận trực tiếp, kết nối Oracle đẩy dữ liệu lên Smart Contract phân chia cổ tức minh bạch cho nhà đầu tư.
            </p>
          </div>

          <button
            onClick={onSimulateEvnPayment}
            disabled={isSimulatingEvn}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isSimulatingEvn ? 'Đang thực thi Waterfall...' : 'Chạy Giả Lập Waterfall (Tháng Mới)'}</span>
          </button>
        </div>

        {/* 6 Steps Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {waterfallSteps.map((s, idx) => (
            <div key={s.step} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    {s.step}
                  </span>
                  {idx < 5 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-500 absolute -right-2.5 top-1/2 -translate-y-1/2 z-10" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">{s.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Calculator & Formula Example */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Cashflow Calculator */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl lg:col-span-1 space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Tính Toán Waterfall Mẫu</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Doanh thu bán điện EVN (VNĐ):</label>
              <input
                type="number"
                step="100000000"
                value={customRevenue}
                onChange={(e) => setCustomRevenue(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">{(customRevenue / 1000000000).toFixed(2)} Tỷ VNĐ</p>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Chi phí vận hành & bảo trì (O&M):</label>
              <input
                type="number"
                step="50000000"
                value={customOpCost}
                onChange={(e) => setCustomOpCost(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">{(customOpCost / 1000000000).toFixed(2)} Tỷ VNĐ</p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Dòng tiền thuần phân phối:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {netDistributable.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Số lượng Token phát hành:</span>
                <span className="font-mono text-slate-200">2.000.000 Token</span>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex justify-between items-center text-emerald-300 font-bold">
                <span>Mức chia mỗi Token:</span>
                <span className="text-base font-mono">{payoutPerToken.toLocaleString('vi-VN')} VNĐ / Token</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Case Formula Example Box (as in PDF Page 3) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-slate-100">
                Ví Dụ Minh Họa Phân Phối Dòng Tiền Theo Tài Liệu PoC BIDV
              </h3>
            </div>

            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-xs font-mono space-y-2 text-slate-300">
              <p><span className="text-slate-400">● Tổng số token phát hành:</span> 2.000.000 Token</p>
              <p><span className="text-slate-400">● Nhà đầu tư A sở hữu:</span> 20.000 Token (Tỷ lệ sở hữu 1%)</p>
              <p><span className="text-slate-400">● Tổng dòng tiền phân phối đợt này:</span> 10.000.000.000 VNĐ (10 Tỷ)</p>
              <p><span className="text-slate-400">● Tỷ lệ sở hữu của Nhà đầu tư A:</span> 20.000 / 2.000.000 = 1%</p>
              <p className="text-emerald-400 font-bold">
                ● Khoản tiền A nhận về tài khoản BIDV: 10 Tỷ × 1% = 100.000.000 VNĐ (100 Triệu VNĐ)
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 text-teal-300 font-sans italic">
                Công thức Smart Contract thực thi tự động:
                <div className="font-mono not-italic font-bold text-sm text-slate-100 mt-1">
                  Investor Distribution = Token balance × Distribution per Token
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
            <span>Ngân hàng đại lý xác nhận: <strong className="text-slate-200">BIDV Escrow Account #10928812</strong></span>
            <span className="text-emerald-400 font-semibold">Tự động 100% không qua xử lý thủ công</span>
          </div>
        </div>
      </div>

      {/* Waterfall History Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-100 mb-4">Lịch Sử Các Đợt Phân Phối Waterfall Dòng Tiền (Audit Log)</h3>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kỳ Phân Phối</th>
                <th className="py-3.5 px-4">Sản Lượng (MWh)</th>
                <th className="py-3.5 px-4">Doanh Thu EVN</th>
                <th className="py-3.5 px-4">Chi Phí O&M</th>
                <th className="py-3.5 px-4">Dòng Tiền Phân Phối</th>
                <th className="py-3.5 px-4">Đơn Giá / Token</th>
                <th className="py-3.5 px-4">Mã GD BIDV API</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {cashflowEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">{ev.period}</td>
                  <td className="py-3.5 px-4 font-mono">{ev.powerGeneratedMWh.toLocaleString('vi-VN')} MWh</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                    {ev.evnElectricityRevenueVND.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {ev.operatingCostsVND.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {ev.netDistributableCashflowVND.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-300">
                    {ev.distributionPerTokenVND.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{ev.bidvRefCode}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      EXECUTED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
