import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, Zap, Cpu, Lock, FileText } from 'lucide-react';
import { PocKPI } from '../types';

interface KpiVerificationTabProps {
  kpis: PocKPI[];
}

export const KpiVerificationTab: React.FC<KpiVerificationTabProps> = ({ kpis }) => {
  const categories = [
    { id: 'technology', label: 'a. Nhóm Công Nghệ (Technology)', desc: 'Thời gian phát hành, xử lý giao dịch, độ trễ Oracle & tính khả dụng hệ thống' },
    { id: 'efficiency', label: 'b. Nhóm Hiệu Quả (Efficiency)', desc: 'Tối ưu chi phí phát hành, quản lý & vận hành dòng tiền so với truyền thống' },
    { id: 'operation', label: 'c. Nhóm Vận Hành (Operations)', desc: 'Tự động hóa 100% dòng tiền Waterfall, giảm bớt khâu xử lý thủ công' },
    { id: 'investor_protection', label: 'd. Nhóm Bảo Vệ Nhà Đầu Tư (Investor Protection)', desc: 'Tính minh bạch onchain, tuân thủ eKYC/AML & xử lý vỡ nợ' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Bảng Đánh Giá KPI Kiểm Chứng PoC Tokenize Turbine Điện Gió (BIDV)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Đánh giá toàn diện PoC theo 4 nhóm chỉ số KPI đã được thiết lập trong Hồ sơ Business Case của Ngân hàng BIDV.
          </p>
        </div>

        <div className="bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md p-3.5 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Kết quả Thử nghiệm PoC: 100% KPI Đạt Chuẩn</span>
        </div>
      </div>

      {/* KPI Groups Breakdown */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const groupKpis = kpis.filter(k => k.category === cat.id);
          return (
            <div key={cat.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">{cat.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{cat.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupKpis.map((kpi) => (
                  <div key={kpi.id} className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-200">{kpi.metricName}</span>
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2 p-3 bg-white/5 rounded-xl text-xs font-mono">
                        <div>
                          <p className="text-[10px] text-slate-400">Mục tiêu (Target):</p>
                          <p className="font-semibold text-slate-300 mt-0.5">{kpi.target}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Thực tế PoC (Actual):</p>
                          <p className="font-bold text-emerald-400 mt-0.5">{kpi.actual}</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">{kpi.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
