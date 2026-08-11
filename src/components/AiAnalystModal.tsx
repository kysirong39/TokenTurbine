import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, RefreshCw, FileText, Lightbulb } from 'lucide-react';

interface AiAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAnalystModal: React.FC<AiAnalystModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Xin chào! Tôi là **Trợ lý AI Studio - Chuyên gia Phân tích Đổi mới Sáng tạo FinTech & RWA (BIDV)**.\n\nTôi có thể hỗ trợ bạn phân tích cấu trúc tài chính, cơ chế phân phối dòng tiền Waterfall 8.5%/năm, giải pháp lưu ký Fireblocks MPC, hay các kịch bản quản trị rủi ro cho PoC Turbine Điện Gió này. Bạn cần tìm hiểu thông tin gì?'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.error) {
          setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ Cảnh báo: ${data.error}` }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
        }
      } else {
        // Intelligent client-side fallback responses for GitHub Pages / Static Hosting
        let responseText = '';
        const lowerText = text.toLowerCase();

        if (lowerText.includes('waterfall') || lowerText.includes('thác') || lowerText.includes('8.5%')) {
          responseText = `**Mô hình Waterfall Phân bổ Dòng tiền 8.5%/năm (BIDV Business Case):**\n\n1. **Tiếp nhận Doanh thu EVN:** Tiền mua điện 50MW từ EVN được chuyển thẳng vào Tài khoản Phong tỏa (Escrow) tại BIDV.\n2. **Khấu trừ Chi phí Vận hành (O&M):** Thanh toán các khoản bảo trì, bảo dưỡng định kỳ 16 Turbine.\n3. **Dự phòng Nợ vay Ngân hàng:** Trích lập quỹ trả nợ ngân hàng gốc/lãi theo hợp đồng vay tín dụng xanh.\n4. **Kích hoạt Smart Contract:** BIDV Core Banking gửi tín hiệu Oracle trigger Smart Contract tự động tính toán & phân bổ cổ tức cổ phần (5,000 VND/WIND) về ví của 100% Nhà đầu tư đã xác minh eKYC T+0.`;
        } else if (lowerText.includes('erc-3643') || lowerText.includes('trái phiếu') || lowerText.includes('ưu điểm') || lowerText.includes('so sánh')) {
          responseText = `**Ưu điểm nổi bật của Tokenized RWA (Stellar ERC-3643) so với TPDN truyền thống:**\n\n• **Tính Thanh Khoản Cao:** Chia nhỏ mệnh giá từ 100,000 VNĐ/token, giao dịch thứ cấp 24/7 trên Sàn ATS.\n• **Tuân thủ Pháp lý Tự động:** ONCHAINID Registry bảo đảm 100% giao dịch chỉ diễn ra giữa các ví đạt eKYC/AML và giới hạn nhà đầu tư (<100 người).\n• **Tiết kiệm Chi phí Vận hành:** Giảm 68% chi phí trung gian lưu ký, đại lý thanh toán nhờ Smart Contract & Fireblocks MPC.\n• **Minh bạch Tuyệt đối:** Sổ cái Stellar Public Blockchain lưu vết toàn bộ lịch sử trả cổ tức & giao dịch.`;
        } else if (lowerText.includes('vỡ nợ') || lowerText.includes('default') || lowerText.includes('bảo vệ')) {
          responseText = `**Cơ chế Quản trị Rủi ro & Xử lý Default (Vỡ Nợ SPV):**\n\n• **Tài khoản Escrow BIDV:** Ngân hàng kiểm soát dòng tiền doanh thu EVN độc lập với SPV, đảm bảo SPV không thể tự ý tẩu tán tài sản.\n• **Smart Contract Liquidation Trigger:** Khi SPV vi phạm nghĩa vụ trả lãi quá 30 ngày, hợp đồng thông minh lập tức đóng băng quyền biểu quyết của SPV.\n• **Thành lập Hội đồng Thanh lý:** BIDV phối hợp với Đại diện Nhà đầu tư đấu giá bán lại quyền khai thác Cụm 16 Turbine 50MW để hoàn tiền ưu tiên cho nhà đầu tư nắm giữ WIND Token.`;
        } else if (lowerText.includes('kpi') || lowerText.includes('tiết kiệm') || lowerText.includes('hiệu quả')) {
          responseText = `**Đánh giá Hiệu quả Vận hành từ 4 Nhóm KPI của PoC:**\n\n• **Thời gian phát hành:** Rút ngắn xuống **4.2 phút** (Mục tiêu < 15 phút).\n• **Tốc độ giao dịch:** Xác nhận blockchain trong **2.8 giây** (Mục tiêu < 5s).\n• **Chi phí phân phối Waterfall:** Chỉ chiếm **0.012%** doanh thu (Mục tiêu < 0.05%).\n• **Thời gian tiền về ví:** Xử lý tự động T+0 trong **1.5 phút** (thay vì 5-10 ngày làm việc thủ công).`;
        } else {
          responseText = `**Phân tích Chuyên sâu từ Trợ lý AI Studio (Innovation Analyst):**\n\nCảm ơn câu hỏi của bạn về dự án Token hóa Cụm Nhà máy Điện gió 50MW Bình Thuận:\n\n• **Cấu trúc SPV:** Định giá 200 tỷ VNĐ, phát hành 2,000,000 WIND Token (100,000 VNĐ/token).\n• **An toàn Lưu ký:** Khóa bảo mật MPC 3/3 đàm phán giữa SPV - Ngân hàng BIDV - Đơn vị Kiểm toán PwC.\n• **Cơ chế Waterfall:** Phân phối cổ tức tự động khi nhận tiền mua điện từ EVN.\n\n*Ghi chú: Nếu bạn muốn kết nối trực tiếp với LLM Server linh hoạt, hãy chạy ứng dụng với Node server (\`npm run dev\` hoặc \`npm run start\`).*`;
        }

        setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Hệ thống đang chạy ở chế độ Static Preview Mode.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Giải thích mô hình Waterfall phân phối dòng tiền 8.5%/năm theo Business Case BIDV',
    'So sánh ưu điểm của Tokenized RWA trên Stellar so với Trái phiếu doanh nghiệp truyền thống',
    'Cơ chế Xử lý Default (Vỡ nợ) bảo vệ nhà đầu tư như thế nào khi SPV chậm thanh toán?',
    'Đánh giá hiệu quả kinh tế & tiết kiệm chi phí vận hành từ 4 nhóm KPI của PoC'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                Trợ Lý Chuyên Gia RWA & Innovation Analyst (BIDV)
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Tư vấn chuyên sâu về Token hóa Cụm Turbine Điện Gió 50MW</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none shadow-lg shadow-emerald-500/20'
                  : 'bg-black/30 backdrop-blur-md text-slate-200 border border-white/10 rounded-bl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-indigo-400 text-xs py-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Gemini AI đang phân tích dữ liệu Business Case BIDV...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Prompts */}
        <div className="px-4 py-2 bg-black/20 border-t border-white/10 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-[11px] bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-black/30 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Hỏi về cơ chế Waterfall, tiêu chuẩn ERC-3643, hoặc quản trị vỡ nợ..."
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
