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
      });
      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ Cảnh báo: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Lỗi kết nối tới AI Studio Copilot Service.' }]);
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
