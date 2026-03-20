import { Input } from "@/components/ui/input";
import { MonitorPlay, Terminal, Server, Database } from "lucide-react";

export default function UserExperiments() {
  const tags = ["全部", "基础实验", "综合实验", "进阶实验", "创新实验"];

  const experiments = [
    {
      title: "Linux 基础命令操作实验",
      image: "https://picsum.photos/seed/linux/400/225",
      tags: ["基础实验"],
      icon: Terminal,
      time: "2小时",
      difficulty: "初级"
    },
    {
      title: "Docker 容器化部署实战",
      image: "https://picsum.photos/seed/docker/400/225",
      tags: ["综合实验"],
      icon: Server,
      time: "3小时",
      difficulty: "中级"
    },
    {
      title: "MySQL 数据库高可用集群搭建",
      image: "https://picsum.photos/seed/mysql/400/225",
      tags: ["进阶实验"],
      icon: Database,
      time: "4小时",
      difficulty: "高级"
    },
    {
      title: "Kubernetes 核心组件解析",
      image: "https://picsum.photos/seed/k8s/400/225",
      tags: ["进阶实验"],
      icon: Server,
      time: "5小时",
      difficulty: "高级"
    },
    {
      title: "Python 数据分析基础",
      image: "https://picsum.photos/seed/python/400/225",
      tags: ["基础实验"],
      icon: Terminal,
      time: "2小时",
      difficulty: "初级"
    },
    {
      title: "大模型微调实战 (LoRA)",
      image: "https://picsum.photos/seed/llm/400/225",
      tags: ["创新实验"],
      icon: MonitorPlay,
      time: "6小时",
      difficulty: "高级"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-[8px] p-6 shadow-sm border border-neutral-border">
        <div className="space-y-6">
          {/* Experiment Name */}
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-neutral-title whitespace-nowrap w-[70px]">实验名称:</span>
            <div className="w-[300px]">
              <Input placeholder="请输入实验名称" className="h-8" />
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-start gap-4">
            <span className="text-[14px] text-neutral-title whitespace-nowrap w-[70px] mt-1.5">实验标签:</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <button
                  key={i}
                  className={`px-4 py-1.5 text-[13px] rounded-[4px] border transition-colors ${
                    i === 0 
                      ? "bg-[#fa541c] text-white border-[#fa541c]" 
                      : "bg-white text-neutral-body border-neutral-border hover:text-[#fa541c] hover:border-[#fa541c]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experiment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiments.map((exp, i) => (
          <div key={i} className="bg-white rounded-[8px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-bg">
              <img 
                src={exp.image} 
                alt={exp.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {/* Top Left Tags */}
              {exp.tags.length > 0 && (
                <div className="absolute top-0 left-0 flex flex-col gap-1">
                  {exp.tags.map((tag, j) => (
                    <div 
                      key={j} 
                      className="bg-[#fa541c] text-white text-[12px] px-3 py-1 rounded-br-[8px] font-medium"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-[16px] font-medium text-neutral-title mb-4 line-clamp-2 min-h-[48px]">
                {exp.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between text-neutral-caption text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MonitorPlay className="w-4 h-4" />
                    {exp.time}
                  </span>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[12px] ${
                    exp.difficulty === '初级' ? 'bg-green-50 text-green-600' :
                    exp.difficulty === '中级' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {exp.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
