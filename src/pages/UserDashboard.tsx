import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  User, 
  Star, 
  Users, 
  ChevronLeft,
  Filter,
  X,
  Code,
  Brain,
  BarChart,
  GraduationCap,
  Check,
  Map,
  Rocket,
  Target,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
  Menu,
  FileText,
  Bot,
  Send,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import CourseDetail from "@/components/CourseDetail";

export default function UserCourses() {
  const location = useLocation();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showLearningPathModal, setShowLearningPathModal] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(location.state?.showDetail || false);
  const [selectedRole, setSelectedRole] = useState("在校学生");
  
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: '你好！我是ai助手，请告诉我你的当前岗位、技能水平及期望转型的方向。', isCourseCard: false }
  ]);

  const handleSendMsg = (text: string) => {
    if(!text) return;
    const newHistory = [...chatHistory, {role: 'user', text, isCourseCard: false}];
    setChatHistory(newHistory);
    setChatInput("");
    setTimeout(() => {
       const isCombo = text.includes("组合");
       const replyText = isCombo 
          ? "根据目前了解到的您的画像，LLM自动为您剔除了基础冗余的内容。为您推荐以下精简课程组合："
          : "太棒了！这是非常明智的选择。根据您的需求，我们已为您生成专属的【学习计划】！请查收您的专属路线：";
       setChatHistory([...newHistory, { role: 'assistant', text: replyText, isCourseCard: true, isCombo } as any]);
    }, 800);
  };
  const [selectedFamiliarity, setSelectedFamiliarity] = useState("会python，不了解AI");
  const [selectedDirection, setSelectedDirection] = useState("还没想好，先看看");
  
  const [selectedTag, setSelectedTag] = useState("全部");
  const [selectedDifficulty, setSelectedDifficulty] = useState("全部");
  const [selectedPrice, setSelectedPrice] = useState("全部");

  const tagsList = ["全部", "机器学习", "算法", "人工智能", "神经网络", "深度学习", "CV", "NLP", "Prompt", "大语言模型", "模型微调", "RAG", "知识科普", "数据处理", "模型训练", "Deepseek", "LLM", "Agent", "向量数据库", "实战解读", "MCP"];
  const difficultiesList = ["全部", "入门", "进阶", "高级"];
  const pricesList = ["全部", "免费", "付费"];

  const courses = [
    {
      title: "《人工智能训练师三级实操培训&专题三》",
      image: "https://picsum.photos/seed/aicoding/400/225",
      description: "这是一门面向实战的 AI Coding 方法课...",
      tags: ["#人工智能", "#AI实践"],
      chapters: 12,
      students: 11,
      videos: 3,
      docs: 6,
      experiments: 4
    },
    {
      title: "LangChain教程",
      image: "https://picsum.photos/seed/langchain/400/225",
      description: "LangChain是一个框架，它将大型语言...",
      tags: ["#人工智能"],
      chapters: 10,
      students: 0,
      videos: 5,
      docs: 3,
      experiments: 2
    },
    {
      title: "大模型面试题-模型量化",
      image: "https://picsum.photos/seed/quant/400/225",
      description: "本系列将针对一些常见大模型量化方案...",
      tags: ["#AI & 大模型"],
      chapters: 12,
      students: 0,
      videos: 4,
      docs: 8,
      experiments: 0
    },
    {
      title: "Hello-Agents",
      image: "https://picsum.photos/seed/agents/400/225",
      description: "Hello-Agents 是 Datawhale 社区的系...",
      tags: ["#人工智能", "#LLM", "#Agent"],
      chapters: 17,
      students: 3,
      videos: 8,
      docs: 5,
      experiments: 4
    },
    {
      title: "《动手学大模型》系列编程实践教程",
      image: "https://picsum.photos/seed/llmprac/400/225",
      description: "该课程《动手学大模型》系列编程实践...",
      tags: ["#AI实践"],
      chapters: 11,
      students: 0,
      videos: 6,
      docs: 3,
      experiments: 2
    },
    {
      title: "CS 146S: 现代软件开发者",
      image: "https://picsum.photos/seed/cs146s/400/225",
      description: "近几年来，大型语言模型为软件开发引...",
      tags: ["#人工智能"],
      chapters: 7,
      students: 13,
      videos: 4,
      docs: 2,
      experiments: 1
    },
    {
      title: "Scratch 图形化编程逻辑养成",
      image: "https://picsum.photos/seed/scratch/400/225",
      description: "本课程专为编程初学者设计，旨在通过...",
      tags: ["#编程语言", "#Scratch"],
      chapters: 5,
      students: 10,
      videos: 3,
      docs: 2,
      experiments: 0
    },
    {
      title: "LLM 极速优化手册：小资源玩转大模型",
      image: "https://picsum.photos/seed/llmopt/400/225",
      description: "谁说玩大模型必须 A100？本手册打破...",
      tags: ["#人工智能", "#模型微调", "#模型训练"],
      chapters: 12,
      students: 3,
      videos: 5,
      docs: 4,
      experiments: 3
    }
  ];

  return (
    <>
      {showCourseDetail ? (
        <CourseDetail onBack={() => setShowCourseDetail(false)} onShowLearningPath={() => setShowOnboardingModal(true)} />
      ) : (
        <div className="flex flex-col bg-[#f5f6f8] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-title">全部课程</h1>
        </div>
        <a
          href="http://192.168.1.206:3000/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] hover:opacity-90 text-white px-4 py-2 rounded-[8px] font-bold text-[14px] shadow-sm transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" /> AI互动课程
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">课程标签</span>
          <div className="flex flex-wrap gap-2">
            {tagsList.map((tag) => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  selectedTag === tag 
                    ? "bg-[#fa541c] text-white border-transparent" 
                    : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-[14px] text-neutral-body font-medium whitespace-nowrap mt-1.5 w-16">课程难度</span>
          <div className="flex flex-wrap gap-2">
            {difficultiesList.map((diff) => (
              <button 
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors border",
                  selectedDifficulty === diff 
                    ? "bg-[#fa541c] text-white border-transparent" 
                    : "bg-white border-neutral-border text-neutral-body hover:text-[#fa541c] hover:border-[#fa541c]"
                )}
              >
                {diff}
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
            placeholder="输入课程名称或描述搜索" 
            className="pl-9 h-10 text-[14px] rounded-full border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
      </div>

      {/* Main Content Area */}
        <div className="flex-1 pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-[12px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer"
                  onClick={() => setShowCourseDetail(true)}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-bg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[16px] font-bold text-neutral-title mb-2 line-clamp-1 group-hover:text-[#fa541c] transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-[13px] text-neutral-caption mb-3 line-clamp-1">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {course.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f5f6f8] text-neutral-body text-[12px] rounded-[4px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-neutral-border flex flex-col gap-2 text-[12px] text-neutral-caption">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Menu className="w-3.5 h-3.5" />
                          <span>{course.chapters} 章节</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{course.students}人在学</span>
                        </div>
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
                <span>共 456 门课程</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col mx-4">
            {/* Header */}
            <div className="relative bg-[#fff2e8] px-8 py-6 text-center rounded-t-[16px] border-b border-[#ffd8bf]">
              <button 
                onClick={() => setShowOnboardingModal(false)}
                className="absolute right-4 top-4 text-neutral-caption hover:text-neutral-title transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-neutral-title mb-2 flex items-center justify-center gap-2">
                <span className="text-3xl">👋</span> Hi~ user_GURV5Y
              </h2>
              <p className="text-neutral-body">请完善您的信息，我们将为您开启专属AI学习路径</p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-10">
              {/* Section 1 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-title">(1/3) 你目前从事什么职业/角色？</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { id: "开发工程师", icon: Code },
                    { id: "算法工程师", icon: Brain },
                    { id: "数据分析师", icon: BarChart },
                    { id: "在校学生", icon: GraduationCap },
                    { id: "其他", icon: User },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                          "flex flex-col items-center gap-4 p-6 rounded-[12px] border-2 transition-all",
                          isSelected 
                            ? "border-[#fa541c] bg-[#fff2e8]" 
                            : "border-neutral-border bg-neutral-bg hover:border-[#ffbb96] hover:bg-[#fff2e8]/50"
                        )}
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                          isSelected ? "bg-[#fa541c] text-white" : "bg-white text-neutral-caption shadow-sm"
                        )}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className={cn(
                          "font-medium",
                          isSelected ? "text-[#fa541c]" : "text-neutral-title"
                        )}>{role.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-title">(2/3) 你目前对AI的熟悉程度是？</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "完全不熟悉，不会Python",
                    "会python，不了解AI",
                    "了解AI，缺少基础",
                    "有AI基础，不太精通"
                  ].map((level) => {
                    const isSelected = selectedFamiliarity === level;
                    return (
                      <button
                        key={level}
                        onClick={() => setSelectedFamiliarity(level)}
                        className={cn(
                          "px-5 py-2.5 rounded-[8px] border text-[14px] transition-all relative overflow-hidden",
                          isSelected
                            ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c] font-medium"
                            : "border-neutral-border bg-white text-neutral-body hover:border-[#ffbb96] hover:text-[#fa541c]"
                        )}
                      >
                        {level}
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 w-5 h-5">
                            <svg viewBox="0 0 20 20" className="w-full h-full text-[#fa541c] fill-current">
                              <polygon points="0,20 20,20 20,0" />
                            </svg>
                            <Check className="absolute bottom-[2px] right-[1px] w-3 h-3 text-white" strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-title">(3/3) 你正在从事或未来希望从事的方向是？</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "数据分析师",
                    "机器学习工程师",
                    "计算机视觉工程师",
                    "自然语言处理工程师",
                    "推荐算法工程师",
                    "还没想好，先看看"
                  ].map((direction) => {
                    const isSelected = selectedDirection === direction;
                    return (
                      <button
                        key={direction}
                        onClick={() => setSelectedDirection(direction)}
                        className={cn(
                          "px-5 py-2.5 rounded-[8px] border text-[14px] transition-all relative overflow-hidden",
                          isSelected
                            ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c] font-medium"
                            : "border-neutral-border bg-white text-neutral-body hover:border-[#ffbb96] hover:text-[#fa541c]"
                        )}
                      >
                        {direction}
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 w-5 h-5">
                            <svg viewBox="0 0 20 20" className="w-full h-full text-[#fa541c] fill-current">
                              <polygon points="0,20 20,20 20,0" />
                            </svg>
                            <Check className="absolute bottom-[2px] right-[1px] w-3 h-3 text-white" strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-0 flex justify-center">
              <Button 
                className="w-full max-w-md h-12 text-[16px] rounded-[8px] bg-[#fa541c] hover:bg-[#ff7a45] text-white shadow-lg shadow-[#fa541c]/20"
                onClick={() => {
                  setShowOnboardingModal(false);
                  setShowLearningPathModal(true);
                }}
              >
                保存并继续
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Modal */}
      {showLearningPathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[24px] w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col mx-4 relative">
            {/* Header */}
            <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-neutral-border bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-title">AI 学习路径</h2>
                  <p className="text-[13px] text-neutral-caption mt-0.5">为您量身定制的进阶之路</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLearningPathModal(false)}
                className="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-caption hover:text-neutral-title hover:bg-neutral-border transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Path Container - Vertical Layout */}
            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-6 md:p-10 custom-scrollbar relative">
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fa541c 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="max-w-2xl mx-auto relative">
                {[
                  { id: 1, title: "Python 基础", desc: "掌握基本语法与数据结构", status: "completed", icon: Code, courses: 3, duration: "12小时" },
                  { id: 2, title: "数据分析工具", desc: "Pandas, NumPy 实战", status: "completed", icon: BarChart, courses: 2, duration: "8小时" },
                  { id: 3, title: "机器学习经典算法", desc: "回归、分类、聚类", status: "current", icon: Brain, courses: 4, duration: "16小时" },
                  { id: 4, title: "深度学习框架", desc: "PyTorch / TensorFlow", status: "locked", icon: Target, courses: 3, duration: "14小时" },
                  { id: 5, title: "自然语言处理", desc: "Transformer & LLM", status: "locked", icon: Rocket, courses: 5, duration: "20小时" },
                  { id: 6, title: "计算机视觉", desc: "图像分类与目标检测", status: "locked", icon: Map, courses: 3, duration: "15小时" },
                  { id: 7, title: "AI 项目实战", desc: "综合应用与部署", status: "locked", icon: GraduationCap, courses: 2, duration: "10小时" },
                ].map((node, index, nodes) => {
                  const isCompleted = node.status === "completed";
                  const isCurrent = node.status === "current";
                  const isLocked = node.status === "locked";
                  const Icon = node.icon;

                  return (
                    <div key={node.id} className="flex gap-6 relative group mb-8 last:mb-0">
                      {/* Vertical Line */}
                      {index !== nodes.length - 1 && (
                        <div className={cn(
                          "absolute left-[22px] top-[48px] bottom-[-32px] w-1 rounded-full transition-colors duration-300",
                          isCompleted ? "bg-[#fa541c]" : "bg-neutral-border"
                        )}></div>
                      )}

                      {/* Node Circle */}
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className={cn(
                          "w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all duration-500",
                          isCompleted ? "bg-[#fa541c] border-white shadow-md text-white" :
                          isCurrent ? "bg-white border-[#fa541c] shadow-[0_0_0_4px_rgba(250,84,28,0.2)] text-[#fa541c]" :
                          "bg-white border-neutral-border text-neutral-caption"
                        )}>
                          {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : 
                           isCurrent ? <Play className="w-5 h-5 ml-0.5" fill="currentColor" /> : 
                           <span className="font-bold text-base">{node.id}</span>}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div 
                        className={cn(
                          "flex-1 rounded-[16px] border-2 p-5 transition-all duration-300",
                          isCompleted ? "bg-white border-[#ffbb96] hover:border-[#fa541c] hover:shadow-md cursor-pointer" :
                          isCurrent ? "bg-[#fff2e8] border-[#fa541c] shadow-md cursor-pointer" :
                          "bg-white border-neutral-border opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                        )}
                        onClick={() => {
                          if (!isLocked) {
                            setShowLearningPathModal(false);
                            setShowCourseDetail(true);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              isCompleted ? "bg-[#fff2e8] text-[#fa541c]" :
                              isCurrent ? "bg-[#fa541c] text-white" :
                              "bg-neutral-bg text-neutral-caption"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className={cn("font-bold text-[16px]", isLocked ? "text-neutral-body" : "text-neutral-title")}>
                                {node.title}
                              </h3>
                              <p className="text-[13px] text-neutral-caption mt-0.5">{node.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && <span className="text-[12px] text-semantic-success flex items-center gap-1 bg-semantic-success/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> 已完成</span>}
                            {isCurrent && <span className="text-[12px] font-bold text-white bg-[#fa541c] px-2 py-1 rounded-full shadow-sm animate-pulse">进行中</span>}
                            {isLocked && <Lock className="w-4 h-4 text-neutral-caption" />}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-border/50">
                          <div className="flex items-center gap-4 text-[13px] text-neutral-body">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {node.duration}</span>
                            <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {node.courses} 门课程</span>
                          </div>
                          {!isLocked && (
                            <button className={cn(
                              "text-[13px] font-medium flex items-center gap-1 transition-colors px-4 py-1.5 rounded-full",
                              isCurrent ? "bg-[#fa541c] text-white hover:bg-[#e84a15]" : "bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffd8bf]"
                            )}>
                              {isCompleted ? "复习课程" : "继续学习"} <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-neutral-border bg-white flex items-center justify-between z-10">
              <div className="text-[14px] text-neutral-body">
                当前进度：<span className="font-bold text-[#fa541c]">2/7</span> 阶段
              </div>
              <Button className="bg-[#fa541c] hover:bg-[#ff7a45] text-white rounded-full px-8">
                我的ai学习路径
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Recommendation Assistant Floating UI */}
      {!isAssistantOpen && (
        <button 
          onClick={() => setIsAssistantOpen(true)}
          className="fixed right-8 bottom-8 w-[56px] h-[56px] bg-gradient-to-r from-[#fa541c] to-[#ff7a45] rounded-full shadow-[0_8px_30px_rgb(250,84,28,0.3)] flex items-center justify-center text-white hover:-translate-y-1 hover:scale-105 transition-all duration-300 z-[100]"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      <div className={cn(
        "fixed right-8 bottom-8 w-[380px] h-[600px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-border flex flex-col overflow-hidden z-[100] transition-all duration-400 transform origin-bottom-right",
        isAssistantOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"
      )}>
        {/* Chat Header */}
        <div className="h-[60px] bg-gradient-to-r from-[#fa541c] to-[#ff7a45] flex items-center justify-between px-5 shrink-0 z-10 relative shadow-sm">
          <div className="flex items-center gap-2 text-white font-bold text-[16px]">
            <Bot className="w-5 h-5" /> ai助手
          </div>
          <button onClick={() => setIsAssistantOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-lg">
            <Minimize2 className="w-[18px] h-[18px]" />
          </button>
        </div>
        
        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#f9f9fc] flex flex-col gap-6 custom-scrollbar">
          {chatHistory.map((msg, i) => (
             <div key={i} className={cn("flex flex-col gap-1.5 max-w-[90%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                {msg.role === 'assistant' && <div className="text-[12px] font-bold text-neutral-400 ml-1 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5"/> ai助手</div>}
                
                {msg.isCourseCard ? (
                   // Course Recommendation Card
                   <div className="bg-white border border-neutral-border shadow-sm rounded-[16px] p-5 flex flex-col gap-4 w-[300px]">
                      <div className="font-bold text-[15px] text-neutral-title pb-3 border-b border-neutral-border/60">为你精心定制的ai学习路径</div>
                      <div className="flex flex-col relative before:content-[''] before:absolute before:left-[17px] before:top-[20px] before:bottom-[20px] before:w-[2px] before:bg-gradient-to-b before:from-[#ffbb96] before:to-[#fff2e8] before:z-0">
                         {[
                           { name: "Python 基础进阶", type: "理论课程", duration: "12小时" },
                           { name: "LangChain框架实战", type: "工具集使用课程", duration: "8小时" },
                           { name: "React+大模型应用", type: "前端UI课程", duration: "16小时" },
                         ].map((c, idx) => (
                           <div key={idx} className="flex gap-4 relative cursor-pointer group mb-5 last:mb-0" onClick={() => {
                              setShowCourseDetail(true);
                           }}>
                             <div className="w-9 h-9 rounded-full bg-[#fff2e8] text-[#fa541c] flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm z-10 group-hover:bg-[#fa541c] group-hover:text-white transition-all">
                                <span className="font-bold text-[14px]">{idx + 1}</span>
                             </div>
                             <div className="flex flex-col bg-neutral-bg/60 px-3.5 py-2.5 rounded-xl group-hover:bg-[#fff2e8]/80 flex-1 border border-transparent group-hover:border-[#ffbb96] transition-colors shadow-sm">
                               <span className="font-bold text-[14px] text-neutral-title group-hover:text-[#fa541c] transition-colors">{c.name}</span>
                               <span className="text-[12px] text-neutral-caption mt-1 font-medium">{c.type} • {c.duration}</span>
                             </div>
                           </div>
                         ))}
                      </div>
                      {msg.isCombo ? (
                        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-neutral-border/60">
                          <span className="text-[13px] text-neutral-title font-bold mb-1">是否需要基于推荐课件进行学习？</span>
                          <button 
                            onClick={() => {
                               (window as any).__RECOMMENDED_MODE = true;
                               const hist = [...chatHistory];
                               hist.push({role: 'user', text: '确定基于推荐课件进行学习', isCourseCard: false} as any);
                               hist.push({role: 'assistant', text: '已为您开启专属推荐环境！请直接点击上方课节路线图的任意一节进入学习环境，环境内的目录结构已为您自动精简为推荐课件组合。', isCourseCard: false} as any);
                               setChatHistory(hist);
                            }}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] text-white font-bold text-[13px] rounded-xl shadow-sm hover:shadow-md transition-all"
                          >
                             <CheckCircle2 className="w-4 h-4" /> 确定开启推荐环境
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-100 text-neutral-body font-bold text-[13px] rounded-xl hover:bg-neutral-200 transition-all"
                          >
                             暂不需要
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowLearningPathModal(true)}
                          className="flex items-center justify-center gap-2 w-full py-3 mt-3 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] text-white font-bold text-[14px] rounded-xl shadow-[0_4px_14px_rgba(250,84,28,0.3)] hover:shadow-[0_6px_20px_rgba(250,84,28,0.4)] hover:-translate-y-0.5 transition-all"
                        >
                           <CheckCircle2 className="w-4 h-4" /> 进入我的ai学习路径
                        </button>
                      )}
                   </div>
                ) : (
                   <div className={cn(
                     "px-4 py-3 rounded-[18px] text-[14px] leading-[1.6] shadow-sm font-medium", 
                     msg.role === 'user' ? "bg-gradient-to-b from-[#fa541c] to-[#f0480e] text-white rounded-tr-sm" : "bg-white border border-neutral-border text-neutral-700 rounded-tl-sm"
                   )}>
                      {msg.text}
                   </div>
                )}
             </div>
          ))}
        </div>
        
        {/* Quick Questions & Input Area */}
        <div className="bg-white border-t border-neutral-border shrink-0 pb-6 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="px-4 pb-4 pt-3 flex">
            <div className="relative flex-1">
              <input 
                className="w-full bg-neutral-50 rounded-xl px-4 py-3.5 text-[14px] outline-none border border-neutral-200 focus:border-[#fa541c]/50 focus:bg-white transition-all pr-[52px] text-neutral-800 placeholder:text-neutral-400 font-medium"
                placeholder="输入你的需求或点击上方快捷提问..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if(e.key === 'Enter') handleSendMsg(chatInput);
                }}
              />
              <button 
                className="absolute right-1.5 top-1.5 bottom-1.5 w-10 rounded-[10px] bg-gradient-to-b from-[#fa541c] to-[#e8480d] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                onClick={() => handleSendMsg(chatInput)}
              >
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
