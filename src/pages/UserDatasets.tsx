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
  Database,
  FileText,
  ImageIcon,
  Video,
  MoreVertical,
  HardDrive,
  Clock,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserDatasets() {
  const [activeCategory, setActiveCategory] = useState("全部数据集");

  const categories = [
    { name: "表格数据", icon: Database },
    { name: "文本语料", icon: FileText },
    { name: "图像样本", icon: ImageIcon },
    { name: "视频音频", icon: Video }
  ];

  const datasets = [
    {
      title: "电商用户行为分析数据",
      desc: "包含超过10万条电商平台用户的浏览、点击、购买等行为日志数据，适用于推荐系统训练。",
      type: "表格",
      size: "1.2 GB",
      items: "125,000",
      updated: "2026-03-15",
      icon: Database,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "医疗影像识别样本库",
      desc: "高质量的X光和MRI影像数据集，已由专业医生标注，用于训练医疗影像辅助诊断模型。",
      type: "图像",
      size: "4.5 GB",
      items: "8,400",
      updated: "2026-03-12",
      icon: ImageIcon,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "智能客服对话语料",
      desc: "真实场景下的客服对话记录，经过脱敏处理，包含意图分类和情感倾向标注。",
      type: "文本",
      size: "850 MB",
      items: "45,000",
      updated: "2026-03-10",
      icon: FileText,
      color: "text-purple-500 bg-purple-50"
    },
    {
      title: "自动驾驶路况视频集",
      desc: "涵盖多种天气和光照条件下的城市道路行驶视频，包含车辆、行人、交通标志的边界框标注。",
      type: "视频",
      size: "12.8 GB",
      items: "320",
      updated: "2026-03-08",
      icon: Video,
      color: "text-orange-500 bg-orange-50"
    },
    {
      title: "金融风控特征数据",
      desc: "包含用户信用评分、交易历史、设备指纹等多维特征，用于构建反欺诈和信用评估模型。",
      type: "表格",
      size: "2.1 GB",
      items: "28,000",
      updated: "2026-03-05",
      icon: Database,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "商品评论情感分析集",
      desc: "来自各大电商平台的商品评价文本，带有正向、负向、中性情感标签。",
      type: "文本",
      size: "420 MB",
      items: "15,000",
      updated: "2026-03-01",
      icon: FileText,
      color: "text-purple-500 bg-purple-50"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] text-neutral-body mb-4">
        <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-body">数据中心</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-title font-medium">数据集</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-caption" />
          <Input 
            placeholder="搜索数据集..." 
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
                数据格式 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                应用场景 <ChevronDown className="w-4 h-4" />
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
              最新更新 <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">数据量</button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">文件大小</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar */}
        <div className="w-[240px] bg-white rounded-[8px] border border-neutral-border shadow-sm flex-shrink-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-border bg-neutral-bg/50">
            <h3 className="text-[15px] font-bold text-neutral-title">数据类型</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button 
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-[6px] text-[14px] transition-colors",
                activeCategory === "全部数据集" ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-title hover:bg-neutral-bg"
              )}
              onClick={() => setActiveCategory("全部数据集")}
            >
              全部数据集
            </button>
            
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button 
                  key={category.name}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-[6px] text-[14px] transition-colors",
                    activeCategory === category.name ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-title hover:bg-neutral-bg"
                  )}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <Icon className={cn("w-4 h-4", activeCategory === category.name ? "text-[#fa541c]" : "text-neutral-caption")} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset, i) => {
                const Icon = dataset.icon;
                return (
                  <div key={i} className="bg-white rounded-[8px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0", dataset.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-bold text-neutral-title mb-1 truncate group-hover:text-[#fa541c] transition-colors">
                            {dataset.title}
                          </h3>
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-neutral-bg text-neutral-body text-[12px]">
                            {dataset.type}
                          </span>
                        </div>
                      </div>
                      <button className="text-neutral-caption hover:text-neutral-title p-1 rounded-[4px] hover:bg-neutral-bg opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-[13px] text-neutral-caption line-clamp-2 mb-4 flex-1">
                      {dataset.desc}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-[13px] text-neutral-body mt-auto pt-4 border-t border-neutral-border/50 mb-4">
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-neutral-caption" />
                        <span>{dataset.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-neutral-caption" />
                        <span>{dataset.items} 条</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Clock className="w-4 h-4 text-neutral-caption" />
                        <span>更新于 {dataset.updated}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button className="flex-1 h-9 text-[13px] rounded-[6px] bg-[#fa541c] hover:bg-[#ff7a45] text-white">
                        查看详情
                      </Button>
                      <Button variant="outline" className="w-9 h-9 p-0 rounded-[6px] border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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
                <span className="w-8 h-8 flex items-center justify-center text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-neutral-border text-neutral-body hover:border-[#fa541c] hover:text-[#fa541c] transition-colors text-[14px]">
                  12
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
                <span>共 235 个数据集</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
