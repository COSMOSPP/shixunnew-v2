import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Filter,
  Users,
  Star,
  MessageSquare,
  Code,
  BarChart,
  Palette,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserAISkills() {
  const [activeCategory, setActiveCategory] = useState("全部Skills");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["对话", "代码", "数据分析", "创意设计", "学习"]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    {
      name: "对话",
      icon: MessageSquare,
      children: ["写作助手", "翻译助手", "问答助手"]
    },
    {
      name: "代码",
      icon: Code,
      children: ["代码生成", "代码优化", "Bug调试"]
    },
    {
      name: "数据分析",
      icon: BarChart,
      children: ["数据分析", "可视化"]
    },
    {
      name: "创意设计",
      icon: Palette,
      children: ["文案创作", "图像生成"]
    },
    {
      name: "学习",
      icon: BookOpen,
      children: ["答疑解惑", "学习计划"]
    }
  ];

  const skills = [
    {
      title: "写作助手",
      desc: "AI驱动的智能写作，帮助您快速生成高质量文章、报告和邮件。",
      icon: MessageSquare,
      color: "text-blue-500 bg-blue-50",
      uses: "12K",
      rating: 4.9,
      tag: "对话类"
    },
    {
      title: "代码助手",
      desc: "代码生成与优化，支持多种编程语言，提升开发效率。",
      icon: Code,
      color: "text-gray-700 bg-gray-100",
      uses: "8K",
      rating: 4.8,
      tag: "代码类"
    },
    {
      title: "数据分析助手",
      desc: "自动分析数据并生成可视化图表，让数据洞察更简单。",
      icon: BarChart,
      color: "text-emerald-500 bg-emerald-50",
      uses: "5K",
      rating: 4.7,
      tag: "分析类"
    },
    {
      title: "图像识别助手",
      desc: "智能图像识别与分类，快速提取图片中的关键信息。",
      icon: Palette,
      color: "text-amber-500 bg-amber-50",
      uses: "15K",
      rating: 4.9,
      tag: "图像类"
    },
    {
      title: "翻译助手",
      desc: "支持多语言互译，提供准确、流畅的翻译结果。",
      icon: MessageSquare,
      color: "text-indigo-500 bg-indigo-50",
      uses: "20K",
      rating: 4.8,
      tag: "对话类"
    },
    {
      title: "Bug调试专家",
      desc: "智能分析错误日志，快速定位并提供修复建议。",
      icon: Code,
      color: "text-red-500 bg-red-50",
      uses: "6K",
      rating: 4.9,
      tag: "代码类"
    },
    {
      title: "文案创作大师",
      desc: "一键生成吸引人的营销文案、社交媒体帖子和广告语。",
      icon: Palette,
      color: "text-pink-500 bg-pink-50",
      uses: "9K",
      rating: 4.6,
      tag: "创意类"
    },
    {
      title: "个性化学习计划",
      desc: "根据您的学习目标和进度，量身定制高效的学习路径。",
      icon: BookOpen,
      color: "text-purple-500 bg-purple-50",
      uses: "3K",
      rating: 4.8,
      tag: "学习类"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] text-neutral-body mb-4">
        <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-body">AI能力中心</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-title font-medium">Skills库</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-caption" />
          <Input 
            placeholder="搜索Skills..." 
            className="pl-10 h-10 text-[14px] rounded-[6px] border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
        <Button className="h-10 px-6 bg-[#fa541c] hover:bg-[#ff7a45] text-white rounded-[6px] text-[14px]">
          搜索
        </Button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="mb-6 bg-white p-4 rounded-[8px] border border-neutral-border shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-medium text-neutral-title flex items-center gap-1">
              <Filter className="w-4 h-4" /> 筛选:
            </span>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                功能分类 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                标签 <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button className="text-[14px] text-neutral-caption hover:text-[#fa541c] transition-colors">
            清除筛选
          </button>
        </div>
        <div className="h-[1px] w-full bg-neutral-border"></div>
        <div className="flex items-center gap-6">
          <span className="text-[14px] font-medium text-neutral-title">排序:</span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-[14px] text-[#fa541c] font-medium">
              热门 <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">最新</button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">评分</button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">使用量</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar */}
        <div className="w-[240px] bg-white rounded-[8px] border border-neutral-border shadow-sm flex-shrink-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-border bg-neutral-bg/50">
            <h3 className="text-[15px] font-bold text-neutral-title">功能分类</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button 
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-[6px] text-[14px] transition-colors",
                activeCategory === "全部Skills" ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-title hover:bg-neutral-bg"
              )}
              onClick={() => setActiveCategory("全部Skills")}
            >
              全部Skills
            </button>
            
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="space-y-1">
                  <button 
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[6px] text-[14px] font-medium text-neutral-title hover:bg-neutral-bg transition-colors"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <ChevronDown className={cn("w-4 h-4 transition-transform", expandedCategories.includes(category.name) ? "" : "-rotate-90")} />
                    <Icon className="w-4 h-4 text-neutral-caption" />
                    {category.name}
                  </button>
                  
                  {expandedCategories.includes(category.name) && (
                    <div className="pl-10 pr-2 space-y-1 pb-1">
                      {category.children.map((child) => (
                        <button 
                          key={child}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-[6px] text-[13px] transition-colors",
                            activeCategory === child ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                          )}
                          onClick={() => setActiveCategory(child)}
                        >
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div key={i} className="bg-white rounded-[8px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0", skill.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-bold text-neutral-title mb-1 truncate group-hover:text-[#fa541c] transition-colors">
                          {skill.title}
                        </h3>
                        <p className="text-[13px] text-neutral-caption line-clamp-2">
                          {skill.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[13px] text-neutral-body mt-auto pt-4 border-t border-neutral-border/50 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-[#faad14] fill-[#faad14]" />
                        <span className="font-medium text-neutral-title">{skill.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-neutral-caption" />
                        <span>{skill.uses}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-neutral-caption" />
                        <span>{skill.tag}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full h-9 text-[13px] rounded-[6px] bg-[#fa541c] hover:bg-[#ff7a45] text-white">
                      立即使用
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between border-t border-neutral-border pt-6 pb-2">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-caption hover:border-[#fa541c] hover:text-[#fa541c] transition-colors disabled:opacity-50 disabled:hover:border-neutral-border disabled:hover:text-neutral-caption" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-[#fa541c] text-white font-medium text-[14px]">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  4
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  5
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  20
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    20 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>个</span>
                </div>
                <span>共 156 个Skills</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
