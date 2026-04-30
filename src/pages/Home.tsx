import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Bell, 
  Target,
  Flame,
  ArrowRight,
  Megaphone,
  TrendingUp,
  Users,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scenarios = ["人工智能", "安全运维", "私有云", "公有云"];
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const slides = [
    {
      title: "欢迎使用智云实训 2.0",
      subtitle: "新一代泛 AI 工具与智云实训平台",
      image: "https://picsum.photos/seed/banner1/1920/800"
    },
    {
      title: "掌握前沿 AI 技术",
      subtitle: "从理论基础到工程落地，全面提升 AI 核心竞争力",
      image: "https://picsum.photos/seed/banner2/1920/800"
    },
    {
      title: "企业级项目实战",
      subtitle: "真实业务场景驱动，沉浸式积累一线实战经验",
      image: "https://picsum.photos/seed/banner3/1920/800"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const quickAccess = [
      { title: "我的课程", desc: "继续您的学习旅程", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", href: "/user/courses" },
      { title: "我的项目", desc: "管理您的实战沙箱", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50", href: "/login" },
      { title: "最近访问", desc: "快速回到上次进度", icon: Star, color: "text-amber-500", bg: "bg-amber-50", href: "/login" },
      { title: "推荐内容", desc: "发现更多优质资源", icon: Flame, color: "text-rose-500", bg: "bg-rose-50", href: "/login" }
    ];
  
    const courses = [
      { title: "Python 核心编程", intro: "零基础掌握 Python，开启编程之路", image: "https://picsum.photos/seed/c1/600/400", tags: ["基础", "编程"] },
      { title: "机器学习实战", intro: "深入浅出核心算法与应用场景", image: "https://picsum.photos/seed/c2/600/400", tags: ["AI", "算法"] },
      { title: "深度学习进阶", intro: "神经网络模型原理与 PyTorch 实践", image: "https://picsum.photos/seed/c3/600/400", tags: ["进阶", "模型"] },
      { title: "自然语言处理 (NLP)", intro: "探索文本分析与大语言模型技术", image: "https://picsum.photos/seed/c4/600/400", tags: ["NLP", "前沿"] },
      { title: "计算机视觉 (CV)", intro: "图像处理、目标检测与识别技术", image: "https://picsum.photos/seed/c5/600/400", tags: ["CV", "实战"] }
    ];
  
    const practices = [
      { title: "DeepSeek R1 本地私有化部署指南", rating: 4.9, views: "12.5k", image: "https://picsum.photos/seed/p1/600/400" },
      { title: "基于 Dify 搭建企业级智能知识库", rating: 4.8, views: "8.2k", image: "https://picsum.photos/seed/p2/600/400" },
      { title: "大模型微调 (LoRA) 性能优化技巧", rating: 4.7, views: "6.4k", image: "https://picsum.photos/seed/p3/600/400" },
      { title: "AI Agent 智能体开发从入门到精通", rating: 4.9, views: "15.1k", image: "https://picsum.photos/seed/p4/600/400" }
    ];
  
    const announcements = [
      { date: "2025-03-18", title: "平台系统架构升级与维护通知", icon: Bell, isNew: true },
      { date: "2025-03-15", title: "AI 能力中心全新上线，支持异构算力调度", icon: Megaphone, isNew: true },
      { date: "2025-03-10", title: "新增 50 门前沿 AI 与云原生实战课程", icon: Bell, isNew: false }
    ];
  
    return (
      <div className="flex flex-col min-h-full bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {/* Hero Section - Light Luxury Style */}
        <div className="relative w-full h-[500px] lg:h-[650px] overflow-hidden bg-white">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Elegant Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-5xl">
                <div className="overflow-hidden mb-4">
                  <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium tracking-wide animate-fade-in-up">
                    全新版本发布
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.15] animate-fade-in-up animation-delay-100">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-slate-600 font-light max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>
                <div className="mt-10 flex items-center gap-4 animate-fade-in-up animation-delay-300">
                  <Link to="/user/ai/assistant" className="h-14 px-8 inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-base font-medium hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    开始学习 <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/login" className="h-14 px-8 inline-flex items-center justify-center rounded-full bg-white text-slate-900 text-base font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                    了解更多
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Elegant Controls */}
          <div className="absolute bottom-12 right-6 md:right-16 lg:right-24 z-20 flex items-center gap-8">
            {/* Indicators */}
            <div className="hidden md:flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === currentSlide ? "w-12 bg-slate-900" : "w-4 bg-slate-900/20 hover:bg-slate-900/40"
                  )}
                />
              ))}
            </div>
            {/* Arrows */}
            <div className="flex gap-3">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all duration-300">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
  
        {/* Quick Access - Floating Cards */}
        <div className="relative z-20 -mt-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickAccess.map((item, i) => (
              <Link 
                key={i} 
                to={item.href}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-white transition-all duration-500 group flex items-center gap-5 hover:-translate-y-1.5"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", item.bg)}>
                  <item.icon className={cn("w-7 h-7", item.color)} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
  
        {/* Main Content Area */}
        <div className="w-full px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto py-24 space-y-32">
          
          {/* Course Browsing */}
          <section id="featured-courses" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">精选课程</h3>
                <p className="text-slate-500 text-lg font-light">系统化学习路径，从理论基础到核心技术</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
                 {scenarios.map(scenario => (
                   <button
                     key={scenario}
                     onClick={() => setActiveScenario(scenario)}
                     className={cn(
                       "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap",
                       activeScenario === scenario 
                         ? "bg-white text-blue-600 shadow-sm" 
                         : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                     )}
                   >
                     {scenario}
                   </button>
                 ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {courses.map((course, i) => (
                <Link to="/user/courses" state={{ showDetail: true }} key={i} className="group block bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <PlayCircle className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {course.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-xs font-medium text-slate-700 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {course.intro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
  
          {/* Best Practices */}
          <section id="best-practices" className="scroll-mt-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">最佳实践</h3>
                <p className="text-slate-500 text-lg font-light">真实业务场景驱动，沉浸式积累一线实战经验</p>
              </div>
              <Link to="/user/practices" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group">
                查看更多实践 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {practices.map((practice, i) => (
                <Link to="/user/practices" state={{ showDetail: true, practiceId: i + 1 }} key={i} className="group block bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img 
                      src={practice.image} 
                      alt={practice.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-900">{practice.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug h-[56px]">
                      {practice.title}
                    </h4>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span>{practice.views} 人已学习</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
  
          {/* Bottom Section: Announcements & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Announcements */}
            <section className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">平台公告</h3>
                <Link to="/user/center/messages" className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  全部
                </Link>
              </div>
              <div className="space-y-6">
                {announcements.map((announcement, i) => (
                  <Link to="/user/center/messages" key={i} className="group flex gap-4 items-start">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors", announcement.isNew ? "bg-rose-50 text-rose-500 group-hover:bg-rose-100" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100")}>
                    <announcement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                      {announcement.title}
                    </h4>
                    <span className="text-sm text-slate-400 font-mono">{announcement.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Platform Data */}
          <section className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">平台运行数据</h3>
              <p className="text-slate-400 mb-12 font-light">持续为您提供稳定、高效的实训环境</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/10">
                <div className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">1,234</div>
                  <div className="text-sm font-medium text-slate-400 tracking-wider">精品课程</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">5,678</div>
                  <div className="text-sm font-medium text-slate-400 tracking-wider">实战项目</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">98k+</div>
                  <div className="text-sm font-medium text-slate-400 tracking-wider">注册用户</div>
                </div>
                <div className="text-center px-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div className="text-4xl md:text-5xl font-light text-emerald-400 tracking-tight">1,234</div>
                  </div>
                  <div className="text-sm font-medium text-slate-400 tracking-wider">当前在线</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
