import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Database,
  FileText,
  ImageIcon,
  Video,
  HardDrive,
  Clock,
  Download,
  MoreVertical,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import DatasetDetail from "@/components/DatasetDetail";
import DatasetUpload from "@/components/DatasetUpload";

export default function UserDatasets() {
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  if (isUploading) {
    return <DatasetUpload onBack={() => setIsUploading(false)} onSubmit={(data) => { setIsUploading(false); console.log("Dataset submtited: ", data); }} />;
  }

  if (selectedDataset) {
    return <DatasetDetail dataset={selectedDataset} onBack={() => setSelectedDataset(null)} />;
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Banner */}
      <div className="w-full h-40 mb-8 rounded-[16px] overflow-hidden relative group shrink-0 shadow-sm bg-gradient-to-r from-[#fa541c] to-[#ff8c3a] flex items-center px-10 justify-between">
         <div className="text-white relative z-10">
            <h1 className="text-2xl font-bold mb-2">公共数据集广场</h1>
            <p className="text-[14px] text-white/80 max-w-2xl mb-4">这里汇聚了用户上传的公开数据集，您可以将数据集添加到项目中进行处理、微调与分析。</p>
            <div className="flex gap-4">
              <Button variant="outline" className="h-9 px-4 rounded-[6px] text-white border-white/30 bg-white/10 hover:bg-white hover:text-[#fa541c]">
                了解更多
              </Button>
            </div>
         </div>
         <Button onClick={() => setIsUploading(true)} className="bg-white hover:bg-[#fff2e8] text-[#fa541c] font-bold h-11 px-6 rounded-full shadow-lg relative z-10">
            <Plus className="w-5 h-5 mr-2" /> 新建数据集
         </Button>
         
         <Database className="absolute right-32 -bottom-10 w-48 h-48 text-white/10 transform rotate-12" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5">数据类型</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "表格数据", "文本语料", "图像样本", "视频音频"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors",
                  i === 0 ? "bg-[#fa541c] text-white" : "bg-white border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center bg-white rounded-full p-1 border border-neutral-border">
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium bg-[#f5f6f8] text-neutral-title">
            最新
          </button>
          <button className="px-6 py-1.5 rounded-full text-[14px] font-medium text-neutral-body hover:text-neutral-title">
            最热
          </button>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-caption" />
          <Input 
            placeholder="输入数据集名称搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {datasets.map((dataset, i) => {
                const Icon = dataset.icon;
                return (
                  <div key={i} onClick={() => setSelectedDataset(dataset)} className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col p-5 cursor-pointer">
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
                      <Button onClick={(e) => { e.stopPropagation(); setSelectedDataset(dataset); }} className="flex-1 h-9 text-[13px] rounded-[6px] bg-[#fa541c] hover:bg-[#ff7a45] text-white">
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
            <div className="flex items-center justify-end p-4 gap-4 mt-8">
              <span className="text-[13px] text-neutral-500">共 235 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">2</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">3</Button>
                <span className="px-1 text-neutral-caption text-[13px]">...</span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px]">&gt;</Button>
              </div>
              <div className="relative bg-white rounded-[6px]">
                <select className="appearance-none text-[13px] border border-neutral-200 hover:border-[#fa541c]/60 focus:border-[#fa541c] rounded-[6px] pl-3 pr-8 py-1 focus:outline-none text-neutral-600 bg-white cursor-pointer h-7 transition-colors min-w-[95px] shadow-sm">
                  <option className="bg-white">10 条/页</option>
                  <option className="bg-white">20 条/页</option>
                  <option className="bg-white">50 条/页</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}
