import React from 'react';
import { DollarSign, ShieldCheck, UserCheck, AlertTriangle, Key, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { Investor } from '../types';

interface InvestorPortfolioTabProps {
  investors: Investor[];
  onToggleEkyc: (investorId: string, currentStatus: string) => void;
  totalSupplyTokens: number;
}

export const InvestorPortfolioTab: React.FC<InvestorPortfolioTabProps> = ({
  investors,
  onToggleEkyc,
  totalSupplyTokens
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Quản Lý Danh Mục Nhà Đầu Tư & Xác Minh Danh Tính (eKYC Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sổ ghi nhận quyền sở hữu số hóa tự động. Mỗi nhà đầu tư sở hữu token đại diện trực tiếp cho quyền lợi kinh tế nhận dòng tiền phân bổ theo nguyên tắc Waterfall.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-slate-400">Tiêu chuẩn An toàn Pháp lý:</p>
            <p className="font-bold text-emerald-400">ERC-3643 Whitelisted Holders</p>
          </div>
        </div>
      </div>

      {/* Featured Investor Spotlight: Investor A (20,000 Tokens = 1% Ownership) */}
      <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Trường hợp điển hình trong Hồ sơ PoC
                </span>
                <span className="text-slate-400 text-xs">Mã định danh: INV-001</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">Nhà Đầu Tư Nguyễn Văn A</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Trạng thái eKYC:</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full">
              VERIFIED & WHITELISTED
            </span>
          </div>
        </div>

        {/* Investment Math Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400">Số Lượng Token Nắm Giữ</p>
            <h4 className="text-xl font-bold text-emerald-400 mt-1">20.000 WIND</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Mệnh giá 100k = <span className="text-slate-200 font-semibold">2 Tỷ VNĐ</span></p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400">Tỷ Lệ Sở Hữu Tài Sản Cụm Turbine</p>
            <h4 className="text-xl font-bold text-teal-300 mt-1">1.00 %</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">20.000 / 2.000.000 Tokens</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400">Dòng Tiền Đã Tự Động Phân Phối</p>
            <h4 className="text-xl font-bold text-slate-100 mt-1">100.000.000 VNĐ</h4>
            <p className="text-[11px] text-emerald-400 mt-0.5">10 Tỷ đợt Waterfall × 1% tỷ lệ</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400">Số Dư Tài Khoản Fiat BIDV</p>
            <h4 className="text-xl font-bold text-amber-400 mt-1">150.000.000 VNĐ</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Sẵn sàng giao dịch thứ cấp</p>
          </div>
        </div>
      </div>

      {/* Full Investor Directory Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-100 mb-4">Danh Sách Tất Cả Nhà Đầu Tư Đã Đăng Ký Hệ Thống</h3>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tên Nhà Đầu Tư</th>
                <th className="py-3.5 px-4">Phân Loại</th>
                <th className="py-3.5 px-4">Trạng Thái eKYC</th>
                <th className="py-3.5 px-4">Token Nắm Giữ</th>
                <th className="py-3.5 px-4">Tỷ Lệ Sở Hữu</th>
                <th className="py-3.5 px-4">Số Dư Ví Fiat (VNĐ)</th>
                <th className="py-3.5 px-4">Tổng Cổ Tức Đã Nhận</th>
                <th className="py-3.5 px-4">Thao Tác Admin eKYC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {investors.map((inv) => {
                const ownershipPct = ((inv.tokenBalance / totalSupplyTokens) * 100).toFixed(2);
                return (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-200">{inv.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{inv.email} - MST: {inv.taxCode}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {inv.investorType === 'individual' ? 'Cá nhân' : inv.investorType === 'esg_fund' ? 'Quỹ ESG' : 'Doanh nghiệp'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.eKYCStatus === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {inv.eKYCStatus === 'verified' ? 'Đã duyệt eKYC' : 'Chờ eKYC'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {inv.tokenBalance.toLocaleString('vi-VN')} WIND
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-300">{ownershipPct}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {inv.fiatBalanceVND.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {inv.totalDividendsReceivedVND.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleEkyc(inv.id, inv.eKYCStatus)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                          inv.eKYCStatus === 'verified'
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                        }`}
                      >
                        {inv.eKYCStatus === 'verified' ? 'Hủy Duyệt eKYC' : 'Phê Duyệt eKYC'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
