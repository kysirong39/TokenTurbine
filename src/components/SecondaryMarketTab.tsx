import React, { useState } from 'react';
import { Activity, ShieldCheck, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Investor, Order, Trade } from '../types';

interface SecondaryMarketTabProps {
  investors: Investor[];
  orders: Order[];
  trades: Trade[];
  onPlaceOrder: (data: { investorId: string; type: 'buy' | 'sell'; amountTokens: number; priceVND: number }) => void;
}

export const SecondaryMarketTab: React.FC<SecondaryMarketTabProps> = ({
  investors,
  orders,
  trades,
  onPlaceOrder
}) => {
  const [selectedInvestorId, setSelectedInvestorId] = useState(investors[0]?.id || '');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amountTokens, setAmountTokens] = useState(1000);
  const [priceVND, setPriceVND] = useState(100500); // 100.5k VND

  const activeInvestor = investors.find(i => i.id === selectedInvestorId);
  const isKycVerified = activeInvestor?.eKYCStatus === 'verified';

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestorId) return;
    onPlaceOrder({
      investorId: selectedInvestorId,
      type: orderType,
      amountTokens: Number(amountTokens),
      priceVND: Number(priceVND)
    });
  };

  const sellOrders = orders.filter(o => o.type === 'sell' && o.status === 'open');
  const buyOrders = orders.filter(o => o.type === 'buy' && o.status === 'open');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Sàn Giao Dịch Thứ Cấp Security Token (ATS Secondary Market)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Nền tảng chuyển nhượng Token WIND-RWA giữa các nhà đầu tư đủ điều kiện. Smart Contract ERC-3643 tự động kiểm soát điều kiện eKYC/AML trước khi phê duyệt giao dịch.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-slate-400">Tuân thủ Chuẩn ERC-3643:</p>
            <p className="font-bold text-emerald-400">Whitelist Compliance Engine Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Placement Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Đặt Lệnh Giao Dịch Security Token</h3>

          {/* Investor Selector */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Chọn Nhà Đầu Tư Thực Hiện:</label>
            <select
              value={selectedInvestorId}
              onChange={(e) => setSelectedInvestorId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {investors.map((inv) => (
                <option key={inv.id} value={inv.id} className="bg-slate-900 text-slate-100">
                  {inv.name} ({inv.eKYCStatus === 'verified' ? 'eKYC Đã duyệt' : 'Chưa eKYC'})
                </option>
              ))}
            </select>
          </div>

          {/* eKYC Status Alert Badge */}
          {activeInvestor && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 backdrop-blur-md ${
              isKycVerified ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {isKycVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Đã eKYC hợp lệ - Đủ điều kiện giao dịch Tokenized RWA</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Cảnh báo tuân thủ: Tài khoản chưa eKYC! Lệnh giao dịch sẽ bị Smart Contract chặn.</span>
                </>
              )}
            </div>
          )}

          {/* Active Investor Balances */}
          {activeInvestor && (
            <div className="grid grid-cols-2 gap-2 p-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
              <div>
                <p className="text-slate-400">Số dư Token:</p>
                <p className="font-bold text-emerald-400 font-mono mt-0.5">
                  {activeInvestor.tokenBalance.toLocaleString('vi-VN')} WIND
                </p>
              </div>
              <div>
                <p className="text-slate-400">Ví Fiat VND:</p>
                <p className="font-bold text-slate-100 font-mono mt-0.5">
                  {activeInvestor.fiatBalanceVND.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-3 pt-2">
            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setOrderType('buy')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  orderType === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                MUA TOKEN
              </button>
              <button
                type="button"
                onClick={() => setOrderType('sell')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  orderType === 'sell' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BÁN TOKEN
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Số lượng Token WIND:</label>
              <input
                type="number"
                min="100"
                step="100"
                value={amountTokens}
                onChange={(e) => setAmountTokens(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Giá đặt giao dịch (VNĐ/Token):</label>
              <input
                type="number"
                min="50000"
                step="500"
                value={priceVND}
                onChange={(e) => setPriceVND(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 text-xs flex justify-between items-center">
              <span className="text-slate-400">Tổng giá trị thanh toán:</span>
              <span className="font-bold text-amber-400 font-mono">
                {(amountTokens * priceVND).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-lg cursor-pointer ${
                orderType === 'buy'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              Gửi Lệnh Lên Smart Contract
            </button>
          </form>
        </div>

        {/* Live Order Book & Match Engine */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-100">Sổ Lệnh Trực Tuyến (Live Orderbook)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sell Orders (Asks) */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-xs mb-3">
                <ArrowDownRight className="w-4 h-4" />
                <span>Lệnh Bán (Asks)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {sellOrders.length === 0 ? (
                  <p className="text-slate-500 text-[11px] py-4 text-center">Chưa có lệnh bán mở</p>
                ) : (
                  sellOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-300">
                      <div>
                        <p className="font-bold text-rose-400">{o.priceVND.toLocaleString('vi-VN')} VNĐ</p>
                        <p className="text-[10px] text-slate-400 font-sans">{o.investorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-200">{o.amountTokens.toLocaleString('vi-VN')} WIND</p>
                        <p className="text-[10px] text-slate-400">{(o.totalValueVND/1000000).toFixed(1)}M VNĐ</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Buy Orders (Bids) */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs mb-3">
                <ArrowUpRight className="w-4 h-4" />
                <span>Lệnh Mua (Bids)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {buyOrders.length === 0 ? (
                  <p className="text-slate-500 text-[11px] py-4 text-center">Chưa có lệnh mua mở</p>
                ) : (
                  buyOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-300">
                      <div>
                        <p className="font-bold text-emerald-400">{o.priceVND.toLocaleString('vi-VN')} VNĐ</p>
                        <p className="text-[10px] text-slate-400 font-sans">{o.investorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-200">{o.amountTokens.toLocaleString('vi-VN')} WIND</p>
                        <p className="text-[10px] text-slate-400">{(o.totalValueVND/1000000).toFixed(1)}M VNĐ</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Executed Trades History */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-3">Lịch Sử Khớp Lệnh Chuyển Nhượng Gần Đây</h4>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-200 border-b border-white/10 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-3.5">Bên Mua</th>
                    <th className="py-3 px-3.5">Bên Bán</th>
                    <th className="py-3 px-3.5">Số Lượng</th>
                    <th className="py-3 px-3.5">Đơn Giá (VNĐ)</th>
                    <th className="py-3 px-3.5">Tổng Giá Trị</th>
                    <th className="py-3 px-3.5">Stellar Tx Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {trades.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3.5 font-sans font-medium text-emerald-400">{t.buyerName}</td>
                      <td className="py-3 px-3.5 font-sans font-medium text-slate-300">{t.sellerName}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-100">{t.amountTokens.toLocaleString('vi-VN')} WIND</td>
                      <td className="py-3 px-3.5 text-teal-300">{t.priceVND.toLocaleString('vi-VN')}</td>
                      <td className="py-3 px-3.5 font-bold text-slate-100">{t.totalValueVND.toLocaleString('vi-VN')} VNĐ</td>
                      <td className="py-3 px-3.5 text-slate-400 text-[10px]">{t.txHash.slice(0, 12)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
