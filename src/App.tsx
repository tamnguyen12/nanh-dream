import React, { useState } from 'react';
import { Heart, Gift, List, Link as LinkIcon, AlignLeft, Send, Sparkles, DollarSign } from 'lucide-react';

type Priority = 'Ước thôi' | 'Thích nha' | 'Muốn lắm' | 'Cần rồi' | 'PHẢI CÓ';

interface GiftItem {
  id: string;
  name: string;
  price: string;
  priority: Priority;
  link: string;
  note: string;
}

const PRIORITIES: { label: Priority; emoji: string }[] = [
  { label: 'Ước thôi', emoji: '💭' },
  { label: 'Thích nha', emoji: '🌷' },
  { label: 'Muốn lắm', emoji: '🥺' },
  { label: 'Cần rồi', emoji: '💘' },
  { label: 'PHẢI CÓ', emoji: '🔥' },
];

export default function App() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<Priority>('Muốn lắm');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    // Format with commas
    return new Intl.NumberFormat('vi-VN').format(parseInt(digits));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(formatPrice(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Vui lòng nhập tên món quà nha!');
      return;
    }

    setIsSubmitting(true);

    const newGift: GiftItem = {
      id: Date.now().toString(),
      name,
      price,
      priority,
      link,
      note,
    };

    try {
      const response = await fetch('https://formspree.io/f/maqpozen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'Tên quà tặng': name,
          'Giá ước tính': price ? `${price} VNĐ` : 'Không có',
          'Độ ưu tiên': priority,
          'Link sản phẩm': link || 'Không có',
          'Ghi chú': note || 'Không có',
        }),
      });

      if (response.ok) {
        setGifts([newGift, ...gifts]);
        
        // Reset form for the next item
        setName('');
        setPrice('');
        setLink('');
        setNote('');
        
        alert('Đã gửi điều ước thành công! 💖');
      } else {
        alert('Có lỗi xảy ra khi gửi. Vui lòng thử lại nha! 😢');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi gửi. Vui lòng thử lại nha! 😢');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#e64a79] selection:text-white pb-20">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-10 pb-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🌹</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#ff8fa3] font-serif italic">Danh sách ước mơ của nanh bếu</h1>
            <p className="text-sm text-gray-400">Mọi điều em muốn, anh sẽ nhớ 💌</p>
          </div>
        </div>
        <div className="bg-[#2a151a] border border-[#4a2530] text-[#ff8fa3] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
          <Heart size={16} fill="currentColor" />
          {gifts.length} điều ước trong giỏ quà
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex bg-[#141414] rounded-2xl p-1 mb-8 border border-[#222]">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'add' 
                ? 'bg-gradient-to-r from-[#e64a79] to-[#ff7597] text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Sparkles size={18} />
            Thêm món quà yêu thích của em ✨
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'list' 
                ? 'bg-gradient-to-r from-[#e64a79] to-[#ff7597] text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <List size={18} />
            Bảng quà của anh 💝
          </button>
        </div>

        {activeTab === 'add' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Thêm một món quà em thích vào đây nhoaaa ♥</h2>
              <p className="text-gray-400 text-sm">Em hãy thêm những món quà mình thích nhé, rồi 1 món quà may mắn sẽ là bất ngờ sau này ♥</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8 shadow-2xl">
              
              {/* Tên quà tặng */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  <Heart size={14} className="text-[#e64a79]" /> Tên quà tặng
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Vòng tay bạc khắc tên..."
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e64a79] focus:ring-1 focus:ring-[#e64a79] transition-all"
                  required
                />
              </div>

              {/* Giá ước tính */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  <DollarSign size={14} className="text-[#e64a79]" /> Giá ước tính (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="500,000"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e64a79] focus:ring-1 focus:ring-[#e64a79] transition-all pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e64a79] font-bold">đ</span>
                </div>
              </div>

              {/* Độ ưu tiên */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Độ ưu tiên
                </label>
                <div className="flex flex-wrap gap-3">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setPriority(p.label)}
                      className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-sm transition-all border ${
                        priority === p.label
                          ? 'bg-[#2a151a] border-[#e64a79] text-white'
                          : 'bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#555]'
                      }`}
                    >
                      <span>{p.emoji}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link sản phẩm */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  <LinkIcon size={14} className="text-[#e64a79]" /> Link sản phẩm (Tuỳ chọn)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://shopee.vn/..."
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e64a79] focus:ring-1 focus:ring-[#e64a79] transition-all"
                />
              </div>

              {/* Ghi chú thêm */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  <AlignLeft size={14} className="text-[#e64a79]" /> Ghi chú thêm (Tuỳ chọn)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Màu hồng nhé anh, size M..."
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e64a79] focus:ring-1 focus:ring-[#e64a79] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#e64a79] to-[#ff7597] hover:from-[#d43d68] hover:to-[#ff5c85] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#e64a79]/20 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} />
                {isSubmitting ? 'Đang gửi điều ước...' : 'Thêm vào danh sách ước mơ ✨'}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bảng quà của anh 🎁</h2>
                <p className="text-gray-400 text-sm">Danh sách những món quà em đã thêm. Cố gắng mua hết nhé! 💸</p>
              </div>
            </div>

            {gifts.length === 0 ? (
              <div className="bg-[#141414] border border-[#222] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                  <Gift size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Chưa có món quà nào</h3>
                <p className="text-gray-500 text-sm max-w-xs">Em chưa thêm món quà nào vào danh sách. Hãy quay lại tab thêm quà để bắt đầu nhé!</p>
                <button 
                  onClick={() => setActiveTab('add')}
                  className="mt-6 px-6 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-full text-sm font-medium transition-all text-[#ff8fa3]"
                >
                  Thêm quà ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div key={gift.id} className="bg-[#141414] border border-[#222] rounded-2xl p-5 hover:border-[#444] transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e64a79]/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{PRIORITIES.find(p => p.label === gift.priority)?.emoji}</span>
                        <span className="text-xs font-bold px-2 py-1 bg-[#1a1a1a] text-[#ff8fa3] rounded-md border border-[#333]">
                          {gift.priority}
                        </span>
                      </div>
                      {gift.price && (
                        <span className="text-sm font-bold text-[#e64a79] bg-[#e64a79]/10 px-3 py-1 rounded-full">
                          {gift.price} đ
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 group-hover:text-[#ff8fa3] transition-colors">{gift.name}</h3>
                    
                    {gift.note && (
                      <div className="bg-[#1a1a1a] p-3 rounded-xl text-sm text-gray-300 mb-4 border border-[#222]">
                        <span className="text-gray-500 text-xs block mb-1">Ghi chú:</span>
                        {gift.note}
                      </div>
                    )}
                    
                    {gift.link && (
                      <a 
                        href={gift.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#ff8fa3] hover:text-[#ff5c85] transition-colors"
                      >
                        <LinkIcon size={14} />
                        Xem sản phẩm
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
