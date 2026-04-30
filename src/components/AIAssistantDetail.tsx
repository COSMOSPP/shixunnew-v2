import React, { useState } from 'react';
import { ChevronLeft, Star, Share2, Send, Paperclip, MoreHorizontal, MessageSquare, Clock, ThumbsUp, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AssistantData {
  id: number;
  title: string;
  type: string;
  description: string;
  isRecommended: boolean;
  usageCount: string;
  icon: any;
  iconBg: string;
  iconColor: string;
}

interface AIAssistantDetailProps {
  assistant: AssistantData;
  onBack: () => void;
}

export default function AIAssistantDetail({ assistant, onBack }: AIAssistantDetailProps) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `你好！我是**${assistant.title}**。我可以帮助你${assistant.description.slice(0, -1)}。请问有什么我可以帮你的？` }
  ]);
  const [input, setInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const Icon = assistant.icon;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: '这是一个模拟的自动回复。在真实环境中，这里将接入大模型的生成结果。' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-white w-full absolute top-0 left-0 z-10">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-border shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-50 text-neutral-caption hover:text-[#fa541c] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center", assistant.iconBg, assistant.iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-neutral-title flex items-center gap-2">
                {assistant.title}
                <span className="text-[12px] font-medium px-2 py-0.5 bg-neutral-100 text-neutral-caption rounded-md border border-neutral-border">
                  {assistant.type}
                </span>
              </h2>
              <p className="text-[12px] text-neutral-caption">{assistant.usageCount} 次使用</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-50 text-[13px] text-neutral-body transition-colors border border-transparent hover:border-neutral-border"
          >
            <Star className={cn("w-4 h-4", isFavorite ? "text-[#faad14] fill-[#faad14]" : "")} /> 
            {isFavorite ? '已收藏' : '收藏助手'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-50 text-[13px] text-neutral-body transition-colors border border-transparent hover:border-neutral-border">
            <Share2 className="w-4 h-4" /> 分享
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-50 text-neutral-caption transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-[#f5f6f8]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Messages */}
          <div className="w-full max-w-4xl flex-1 overflow-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-100 text-blue-600" : assistant.iconBg + " " + assistant.iconColor)}>
                  {msg.role === 'user' ? <div className="text-[12px] font-bold">ME</div> : <Icon className="w-4 h-4" />}
                </div>
                <div className={cn("max-w-[80%] rounded-[12px] p-4 text-[14px] leading-relaxed shadow-sm", msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white border border-neutral-border text-neutral-title")}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="w-full max-w-4xl p-6 pt-0">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                <button onClick={() => setInput('请帮我生成一份教学教案')} className="px-4 py-2 bg-white border border-neutral-border rounded-full text-[13px] text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" /> 请帮我生成一份教学教案
                </button>
                <button onClick={() => setInput('分析一下当前的数据趋势')} className="px-4 py-2 bg-white border border-neutral-border rounded-full text-[13px] text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" /> 分析一下当前的数据趋势
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-[16px] shadow-lg border border-neutral-border p-3 focus-within:border-[#fa541c]/50 focus-within:ring-4 focus-within:ring-[#fa541c]/10 transition-all">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`与 ${assistant.title} 对话... (Shift + Enter 换行)`}
                className="w-full h-[60px] resize-none outline-none text-[14px] text-neutral-title placeholder:text-neutral-caption bg-transparent"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-caption hover:bg-neutral-50 hover:text-neutral-title transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-[#fa541c] hover:bg-[#e64a19] text-white rounded-full h-8 px-4 flex items-center gap-1.5 text-[13px]"
                >
                  <Send className="w-3.5 h-3.5" /> 发送
                </Button>
              </div>
            </div>
            <div className="text-center mt-3 text-[12px] text-neutral-caption">
              AI 生成内容仅供参考，请注意甄别信息准确性。
            </div>
          </div>
        </div>

        {/* Right Sidebar - Assistant Info */}
        <div className="w-72 bg-white border-l border-neutral-border hidden xl:flex flex-col">
          <div className="p-6 border-b border-neutral-border">
            <h3 className="font-bold text-neutral-title mb-2">助手详情</h3>
            <p className="text-[13px] text-neutral-body leading-relaxed">{assistant.description}</p>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-neutral-title mb-4">使用历史</h3>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex gap-3 cursor-pointer group">
                   <div className="mt-1">
                     <MessageSquare className="w-4 h-4 text-neutral-caption group-hover:text-[#fa541c] transition-colors" />
                   </div>
                   <div>
                     <div className="text-[13px] text-neutral-title font-medium group-hover:text-[#fa541c] transition-colors line-clamp-1">
                       上一次关于{assistant.type}的对话历史...
                     </div>
                     <div className="text-[12px] text-neutral-caption mt-1 flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {i} 天前
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
