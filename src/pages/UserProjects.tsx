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
  Monitor,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserProjects() {
  const [activeCategory, setActiveCategory] = useState("全部项目");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["AI实战", "数据分析", "Web开发"]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    {
      name: "AI实战",
      children: ["图像分类", "目标检测", "NLP应用"]
    },
    {
      name: "数据分析",
      children: ["数据清洗", "可视化", "机器学习"]
    },
    {
      name: "Web开发",
      children: ["前端开发", "后端开发"]
    }
  ];

  const projects = [
    {
      title: "图像分类项目",
      desc: "基于CNN的图像分类实战，涵盖数据预处理、模型构建与训练。",
      image: "https://picsum.photos/seed/proj1/400/225",
      participants: "1,234",
      rating: 4.8,
      difficulty: "中级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "文本情感分析项目",
      desc: "NLP实战：使用深度学习模型对海量文本进行情感倾向分析。",
      image: "https://picsum.photos/seed/proj2/400/225",
      participants: "987",
      rating: 4.7,
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "电商数据可视化大屏",
      desc: "使用 ECharts 和 React 构建实时动态的电商销售数据大屏。",
      image: "https://picsum.photos/seed/proj3/400/225",
      participants: "2,156",
      rating: 4.9,
      difficulty: "初级",
      tags: ["数据分析", "可视化"],
      status: "start"
    },
    {
      title: "目标检测系统开发",
      desc: "基于 YOLOv8 的实时目标检测系统，支持自定义数据集训练。",
      image: "https://picsum.photos/seed/proj4/400/225",
      participants: "856",
      rating: 4.6,
      difficulty: "高级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "用户行为数据清洗",
      desc: "使用 Pandas 处理千万级用户行为日志，提取有效特征。",
      image: "https://picsum.photos/seed/proj5/400/225",
      participants: "1,432",
      rating: 4.8,
      difficulty: "中级",
      tags: ["数据分析", "数据清洗"],
      status: "start"
    },
    {
      title: "全栈博客系统开发",
      desc: "从零开始构建基于 Next.js 和 Node.js 的全栈博客平台。",
      image: "https://picsum.photos/seed/proj6/400/225",
      participants: "3,210",
      rating: 4.9,
      difficulty: "中级",
      tags: ["Web开发", "全栈"],
      status: "start"
    },
    {
      title: "智能问答机器人",
      desc: "结合大语言模型API，开发具备上下文记忆的智能客服机器人。",
      image: "https://picsum.photos/seed/proj7/400/225",
      participants: "1,890",
      rating: 4.8,
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "房价预测机器学习模型",
      desc: "使用 Scikit-Learn 构建回归模型，预测城市二手房价格走势。",
      image: "https://picsum.photos/seed/proj8/400/225",
      participants: "2,450",
      rating: 4.7,
      difficulty: "初级",
      tags: ["数据分析", "机器学习"],
      status: "continue"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] text-neutral-body mb-4">
        <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-title font-medium">项目</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-caption" />
          <Input 
            placeholder="搜索项目..." 
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
                类型 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                难度 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                状态 <ChevronDown className="w-4 h-4" />
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
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">最多参与</button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">最高评分</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar */}
        <div className="w-[240px] bg-white rounded-[8px] border border-neutral-border shadow-sm flex-shrink-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-border bg-neutral-bg/50">
            <h3 className="text-[15px] font-bold text-neutral-title">项目分类</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button 
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-[6px] text-[14px] transition-colors",
                activeCategory === "全部项目" ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-title hover:bg-neutral-bg"
              )}
              onClick={() => setActiveCategory("全部项目")}
            >
              全部项目
            </button>
            
            {categories.map((category) => (
              <div key={category.name} className="space-y-1">
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[6px] text-[14px] font-medium text-neutral-title hover:bg-neutral-bg transition-colors"
                  onClick={() => toggleCategory(category.name)}
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform", expandedCategories.includes(category.name) ? "" : "-rotate-90")} />
                  {category.name}
                </button>
                
                {expandedCategories.includes(category.name) && (
                  <div className="pl-8 pr-2 space-y-1 pb-1">
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
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project, i) => (
                <div key={i} className="bg-white rounded-[8px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col">
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-bg">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-neutral-title mb-2 line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[13px] text-neutral-body line-clamp-2 mb-4 flex-1">
                      {project.desc}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-[12px] text-neutral-body mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-caption" />
                        <span>{project.participants}参与</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#faad14] fill-[#faad14]" />
                        <span className="text-[#faad14] font-medium">{project.rating}评分</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-neutral-caption" />
                        <span>{project.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Tag className="w-3.5 h-3.5 text-neutral-caption flex-shrink-0" />
                        <span className="truncate">
                          {project.tags.map(t => `[${t}]`).join(" ")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-neutral-border">
                      <Button 
                        variant={project.status === "continue" ? "outline" : "default"}
                        className={cn(
                          "w-full h-9 text-[13px] rounded-[6px]",
                          project.status === "continue" 
                            ? "border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] hover:text-[#fa541c]" 
                            : "bg-[#fa541c] hover:bg-[#ff7a45] text-white"
                        )}
                      >
                        {project.status === "continue" ? "继续项目" : "开始项目"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
                  15
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                <div className="flex items-center gap-2">
                  <span>每页</span>
                  <button className="flex items-center gap-1 px-2 py-1 border border-neutral-border rounded-[4px] hover:border-[#fa541c] transition-colors">
                    12 <ChevronDown className="w-3 h-3" />
                  </button>
                  <span>个</span>
                </div>
                <span>共 234 个项目</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
