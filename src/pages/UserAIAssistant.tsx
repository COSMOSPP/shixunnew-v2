import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { 
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LayoutTemplate, 
  FileQuestion, 
  BookOpenCheck, 
  Lightbulb, 
  Presentation, 
  BookText, 
  ClipboardCheck, 
  Image as ImageIcon, 
  Video, 
  MessageSquareMore, 
  Network, 
  MonitorPlay,
  Flame,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import AIAssistantDetail from "@/components/AIAssistantDetail";

const assistants = [
  {
    id: 1,
    title: "AI 可视化助手",
    type: "培训辅助",
    description: "支持输入教学主题，一键生成教学知识并转化为可视化精美网页，还推荐相关学习资料。",
    isRecommended: true,
    usageCount: "12.4k",
    icon: LayoutTemplate,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "AI 出题助手",
    type: "学习工具",
    description: "根据输入主题、难度、题型、知识点、题目数量，自动生成题目。",
    isRecommended: true,
    usageCount: "8.9k",
    icon: FileQuestion,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    id: 3,
    title: "AI 生成教案",
    type: "培训辅助",
    description: "支持根据主题方向、特定需求、参考标准等，一站式生成单元教案及作业。",
    isRecommended: true,
    usageCount: "15.2k",
    icon: BookOpenCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    id: 4,
    title: "解题助手",
    type: "学习工具",
    description: "支持题目截图、文字输入解题等等。",
    isRecommended: false,
    usageCount: "5.6k",
    icon: Lightbulb,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    id: 5,
    title: "课堂教学设计生成",
    type: "内容生成",
    description: "根据输入主题课程内容，自动生成课堂教学设计方案大纲。",
    isRecommended: false,
    usageCount: "3.2k",
    icon: Presentation,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    id: 6,
    title: "论文速读",
    type: "数据分析",
    description: "智能总结论文研究背景、核心方法、主要结论和应用价值等。",
    isRecommended: false,
    usageCount: "7.1k",
    icon: BookText,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    id: 7,
    title: "作业批改",
    type: "培训辅助",
    description: "根据输入的作业、试卷，智能生成批改结果、打分、以及评语，为教师提升评阅效率。",
    isRecommended: true,
    usageCount: "11.8k",
    icon: ClipboardCheck,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    id: 8,
    title: "图片生成",
    type: "内容生成",
    description: "根据文案生成不同风格图片。",
    isRecommended: false,
    usageCount: "22.5k",
    icon: ImageIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    id: 9,
    title: "视频生成",
    type: "内容生成",
    description: "根据文本描述的内容快速生成视频，支持根据用户需求调整风格和时长。",
    isRecommended: true,
    usageCount: "18.3k",
    icon: Video,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: 10,
    title: "多模态聊天助手",
    type: "学习工具",
    description: "支持文生文、文生图、文生视频、文档解析的多模态 AI 助手。",
    isRecommended: false,
    usageCount: "9.4k",
    icon: MessageSquareMore,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
  },
  {
    id: 11,
    title: "AI 知识图谱",
    type: "数据分析",
    description: "AI 辅助绘制知识图谱，图谱化数据。",
    isRecommended: false,
    usageCount: "4.8k",
    icon: Network,
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-500",
  },
  {
    id: 12,
    title: "PPT 制作助手",
    type: "内容生成",
    description: "PPT 生成工具，一句话生成完整 PPT 内容。",
    isRecommended: true,
    usageCount: "25.6k",
    icon: MonitorPlay,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  }
];

export default function UserAIAssistant() {
  const navigate = useNavigate();
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeSort, setActiveSort] = useState("最新");
  const [activeTab, setActiveTab] = useState("全部助手");

  if (selectedAssistant) {
    return <AIAssistantDetail assistant={selectedAssistant} onBack={() => setSelectedAssistant(null)} />;
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative h-full">
      {/* Header Tabs */}
      <div className="bg-white border-b border-neutral-border px-8 pt-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-neutral-title mr-4">智能助手</h1>
            {["全部助手", "使用历史", "收藏常用"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-2 text-[15px] font-medium transition-colors border-b-2",
                  activeTab === tab ? "border-[#fa541c] text-[#fa541c]" : "border-transparent text-neutral-body hover:text-neutral-title"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={() => navigate('/user/ai/assistant/studio')}
            className="flex items-center gap-2 px-6 py-2 bg-[#fa541c] text-white rounded-full text-[14px] font-bold hover:bg-[#e64a19] transition-colors shadow-sm"
          >
            <span className="text-[16px] leading-none mb-[2px]">+</span> 创建新助手
          </button>
        </div>
      </div>

      <div className="px-8 flex-1 flex flex-col">
        {/* Filters */}
        {activeTab === "全部助手" && (
          <div className="flex flex-col gap-4 mb-6 bg-white p-4 rounded-[12px] border border-neutral-border shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap min-w-[60px]">助手类型</span>
              <div className="flex flex-wrap gap-2">
                {["全部", "培训辅助", "学习工具", "内容生成", "数据分析"].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setActiveCategory(tag)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                      activeCategory === tag ? "bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96]" : "bg-[#f5f6f8] border border-transparent text-neutral-body hover:text-[#fa541c] hover:border-[#ffbb96]"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-[8px] p-1 border border-neutral-border shadow-sm">
            {["最新", "最热", "推荐"].map((sort) => (
              <button 
                key={sort}
                onClick={() => setActiveSort(sort)}
                className={cn(
                  "px-5 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors",
                  activeSort === sort ? "bg-[#f5f6f8] text-neutral-title" : "text-neutral-body hover:text-neutral-title"
                )}
              >
                {sort}
              </button>
            ))}
          </div>
          
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
            <Input 
              placeholder="输入助手名称搜索" 
              className="pl-9 h-10 text-[14px] rounded-[8px] border-neutral-border bg-white focus-visible:ring-[#fa541c] shadow-sm" 
            />
          </div>
        </div>

        <div className="flex-1 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {assistants.map((assistant) => {
                const Icon = assistant.icon;
                return (
                  <div 
                    key={assistant.id} 
                    onClick={() => setSelectedAssistant(assistant)}
                    className="bg-white rounded-[16px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-[#fa541c]/30 group flex flex-col cursor-pointer p-6 relative"
                  >
                    {assistant.isRecommended && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#fa541c] to-[#ff8c3a] text-white text-[11px] font-bold px-3 py-1 rounded-bl-[12px] flex items-center gap-1 shadow-sm">
                        <ThumbsUp className="w-3 h-3" /> 推荐
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", assistant.iconBg, assistant.iconColor)}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-neutral-title group-hover:text-[#fa541c] transition-colors line-clamp-1 mb-1">
                          {assistant.title}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 bg-neutral-100 text-neutral-caption rounded border border-neutral-200">
                          {assistant.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-[13px] text-neutral-body leading-relaxed flex-1 line-clamp-3 mb-4">
                      {assistant.description}
                    </p>
                    
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] text-neutral-caption">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span><span className="font-medium text-neutral-title">{assistant.usageCount}</span> 次使用</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-[#fff2e8] transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-caption group-hover:text-[#fa541c]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-caption hover:text-[#fa541c] hover:border-[#fa541c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#fa541c] text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">3</button>
                <span className="px-2 text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">5</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    20 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>条</span>
                </div>
                <span>共 45 个助手</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
