import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Users,
  Star,
  Monitor,
  Tag,
  Plus,
  Github,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectIDE from "@/components/ProjectIDE";
import ProjectDetail from "@/components/ProjectDetail";

export default function UserProjects() {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    { title: "2026 AI 创新挑战赛", desc: "丰厚奖金池，等你来战！", color: "from-blue-600 to-indigo-800" },
    { title: "大模型前沿探索营", desc: "掌握最新 LLM 核心技术", color: "from-[#fa541c] to-[#d4380d]" },
    { title: "计算机视觉实战课", desc: "从入门到精通 CV", color: "from-emerald-600 to-teal-800" }
  ];

  useEffect(() => {
    if (isEditingProject) return;
    const interval = setInterval(() => {
       setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isEditingProject]);

  const projects = [
    {
      title: "图像分类项目",
      desc: "基于CNN的图像分类实战，涵盖数据预处理、模型构建与训练。",
      image: "https://picsum.photos/seed/proj1/400/225",
      participants: "1,234",
      favorites: 342,
      innovator: "李明",
      type: "平台项目",
      difficulty: "中级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "文本情感分析项目",
      desc: "NLP实战：使用深度学习模型对海量文本进行情感倾向分析。",
      image: "https://picsum.photos/seed/proj2/400/225",
      participants: "987",
      favorites: 156,
      innovator: "张华",
      type: "租户项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "电商数据可视化大屏",
      desc: "使用 ECharts 和 React 构建实时动态的电商销售数据大屏。",
      image: "https://picsum.photos/seed/proj3/400/225",
      participants: "2,156",
      favorites: 521,
      innovator: "王强",
      type: "个人项目",
      difficulty: "初级",
      tags: ["数据分析", "可视化"],
      status: "start"
    },
    {
      title: "目标检测系统开发",
      desc: "基于 YOLOv8 的实时目标检测系统，支持自定义数据集训练。",
      image: "https://picsum.photos/seed/proj4/400/225",
      participants: "856",
      favorites: 189,
      innovator: "赵雪",
      type: "平台项目",
      difficulty: "高级",
      tags: ["AI", "CV"],
      status: "continue"
    },
    {
      title: "用户行为数据清洗",
      desc: "使用 Pandas 处理千万级用户行为日志，提取有效特征。",
      image: "https://picsum.photos/seed/proj5/400/225",
      participants: "1,432",
      favorites: 275,
      innovator: "刘磊",
      type: "租户项目",
      difficulty: "中级",
      tags: ["数据分析", "数据清洗"],
      status: "start"
    },
    {
      title: "全栈博客系统开发",
      desc: "从零开始构建基于 Next.js 和 Node.js 的全栈博客平台。",
      image: "https://picsum.photos/seed/proj6/400/225",
      participants: "3,210",
      favorites: 890,
      innovator: "陈芳",
      type: "个人项目",
      difficulty: "中级",
      tags: ["Web开发", "全栈"],
      status: "start"
    },
    {
      title: "智能问答机器人",
      desc: "结合大语言模型API，开发具备上下文记忆的智能客服机器人。",
      image: "https://picsum.photos/seed/proj7/400/225",
      participants: "1,890",
      favorites: 432,
      innovator: "孙杰",
      type: "平台项目",
      difficulty: "中高级",
      tags: ["AI", "NLP"],
      status: "start"
    },
    {
      title: "房价预测机器学习模型",
      desc: "使用 Scikit-Learn 构建回归模型，预测城市二手房价格走势。",
      image: "https://picsum.photos/seed/proj8/400/225",
      participants: "2,450",
      favorites: 610,
      innovator: "周伟",
      type: "租户项目",
      difficulty: "初级",
      tags: ["数据分析", "机器学习"],
      status: "continue"
    }
  ];

  if (isEditingProject) {
    return <ProjectIDE onBack={() => setIsEditingProject(false)} />;
  }

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
        onStart={() => {
          setSelectedProject(null);
          setIsEditingProject(true);
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Banner Carousel */}
      <div className="w-full h-40 mb-8 rounded-[12px] overflow-hidden relative group shrink-0 shadow-sm">
        {banners.map((banner, i) => (
          <div 
            key={i} 
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r flex flex-col justify-center px-12",
              banner.color,
              currentBanner === i ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <h2 className="text-[28px] font-bold text-white mb-2">{banner.title}</h2>
            <p className="text-white/80 text-[15px]">{banner.desc}</p>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
             <div 
               key={i} 
               onClick={() => setCurrentBanner(i)}
               className={cn("w-2 h-2 rounded-full cursor-pointer transition-all", currentBanner === i ? "w-6 bg-white" : "bg-white/50")}
             ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">全部项目</h1>
        </div>
        <Button 
          className="bg-[#fa541c] hover:bg-[#d4380d] text-white flex items-center gap-2 shadow-sm h-10 px-6 rounded-full"
          onClick={() => { setShowNewProjectModal(true); setShowGithubInput(false); setGithubUrl(""); }}
        >
          <Plus className="w-4 h-4" /> 新建项目
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">项目标签</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "AI实战", "数据分析", "Web开发", "图像分类", "目标检测", "NLP应用", "数据清洗", "可视化", "机器学习", "前端开发", "后端开发"].map((tag, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  i === 0 ? "bg-[#fa541c] text-white border-transparent" : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">项目类型</span>
          <div className="flex flex-wrap gap-2">
            {["全部", "平台项目", "租户项目", "个人项目"].map((type, i) => (
              <button 
                key={i}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  i === 0 ? "bg-[#fa541c] text-white border-transparent" : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {type}
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
            placeholder="输入项目名称或描述搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
                >
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
                    <h3 className="text-[16px] font-bold text-neutral-title mb-2 line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-[13px] text-neutral-caption mb-3 line-clamp-1">
                      {project.desc}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-[12px] text-neutral-body mb-4 flex items-center gap-3">
                       <span className="px-2 py-0.5 border border-neutral-border bg-[#f5f6f8]/50 text-neutral-caption rounded-[4px]">{project.type}</span>
                       <span className="text-neutral-caption">创新者: <span className="font-medium text-neutral-body">{project.innovator}</span></span>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-neutral-border flex items-center justify-between text-[12px] text-neutral-caption">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{project.participants} 参与</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#faad14] fill-[#faad14]" />
                        <span className="text-[#faad14] font-medium">{project.favorites} 收藏</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More / Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-caption hover:text-[#fa541c] hover:border-[#fa541c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#fa541c] text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">5</button>
                <span className="px-2 text-neutral-caption">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c] transition-colors">20</button>
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
                <span>共 234 个项目</span>
              </div>
            </div>
        </div>
      {showNewProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="w-[480px] bg-white rounded-[16px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border bg-[#fafafa]">
                <h3 className="text-[16px] font-bold text-neutral-title flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#fa541c]" /> 创建新项目
                </h3>
                <button onClick={() => setShowNewProjectModal(false)} className="text-neutral-caption hover:text-neutral-title transition-colors">
                  <X className="w-5 h-5"/>
                </button>
             </div>
             <div className="p-6">
                <p className="text-[14px] text-neutral-body mb-6 leading-relaxed">
                  您可以选择从头开始建立一个全新的空项目环境，或者引入您在 GitHub 上已有的项目代码库。
                </p>
                
                {showGithubInput && (
                   <div className="mb-6 animate-in slide-in-from-top-2">
                     <label className="text-[13px] font-bold text-neutral-title block mb-2">源仓库地址 <span className="text-red-500">*</span></label>
                     <Input 
                       autoFocus
                       value={githubUrl}
                       onChange={e => setGithubUrl(e.target.value)}
                       placeholder="例如: https://github.com/username/repository" 
                       className="w-full text-sm h-11 border-neutral-border focus-visible:ring-[#fa541c] shadow-sm rounded-lg" 
                     />
                   </div>
                )}

                <div className="flex gap-4 pt-2">
                   <Button 
                     variant="outline" 
                     className={cn("flex-1 h-11 flex items-center gap-2 border-neutral-300 text-neutral-title hover:bg-neutral-50 rounded-lg transition-all", showGithubInput ? "border-[#fa541c] text-[#fa541c] bg-[#fa541c]/5 hover:bg-[#fa541c]/10" : "")}
                     onClick={() => {
                        if (showGithubInput && githubUrl) {
                           setIsEditingProject(true);
                           setShowNewProjectModal(false);
                        } else {
                           setShowGithubInput(true);
                        }
                     }}
                   >
                     <Github className="w-4 h-4" /> {showGithubInput ? "确认导入" : "引入 GitHub 项目"}
                   </Button>
                   <Button 
                     className="flex-1 h-11 flex items-center gap-2 bg-[#fa541c] hover:bg-[#d4380d] text-white shadow-md rounded-lg transition-all"
                     onClick={() => {
                        setIsEditingProject(true);
                        setShowNewProjectModal(false);
                     }}
                   >
                     新建空项目
                   </Button>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
