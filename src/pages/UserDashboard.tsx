import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserCourses() {
  const [activeCategory, setActiveCategory] = useState("全部课程");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["AI", "云计算", "安全", "开发"]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    {
      name: "AI",
      children: ["机器学习", "深度学习", "NLP"]
    },
    {
      name: "云计算",
      children: ["Docker", "K8s"]
    },
    {
      name: "安全",
      children: ["网络安全", "数据安全"]
    },
    {
      name: "开发",
      children: ["Python", "Java", "Web"]
    }
  ];

  const courses = [
    {
      title: "Python 入门教程",
      image: "https://picsum.photos/seed/python1/400/225",
      teacher: "张老师",
      rating: 4.8,
      students: "1,234",
      tag: "AI",
      progress: 80,
      status: "continue"
    },
    {
      title: "机器学习实战课程",
      image: "https://picsum.photos/seed/ml1/400/225",
      teacher: "李老师",
      rating: 4.9,
      students: "2,345",
      tag: "机器学习",
      progress: 60,
      status: "continue"
    },
    {
      title: "深度学习进阶课程",
      image: "https://picsum.photos/seed/dl1/400/225",
      teacher: "王老师",
      rating: 4.7,
      students: "987",
      tag: "深度学习",
      progress: 85,
      status: "start"
    },
    {
      title: "自然语言处理课程",
      image: "https://picsum.photos/seed/nlp1/400/225",
      teacher: "赵老师",
      rating: 4.8,
      students: "1,567",
      tag: "NLP",
      progress: 20,
      status: "start"
    },
    {
      title: "Docker 容器化实战",
      image: "https://picsum.photos/seed/docker1/400/225",
      teacher: "陈老师",
      rating: 4.6,
      students: "890",
      tag: "Docker",
      progress: 0,
      status: "start"
    },
    {
      title: "Kubernetes 集群管理",
      image: "https://picsum.photos/seed/k8s1/400/225",
      teacher: "刘老师",
      rating: 4.9,
      students: "1,120",
      tag: "K8s",
      progress: 0,
      status: "start"
    },
    {
      title: "企业级网络安全防护",
      image: "https://picsum.photos/seed/sec1/400/225",
      teacher: "孙老师",
      rating: 4.7,
      students: "654",
      tag: "网络安全",
      progress: 0,
      status: "start"
    },
    {
      title: "数据安全与隐私保护",
      image: "https://picsum.photos/seed/data1/400/225",
      teacher: "周老师",
      rating: 4.8,
      students: "876",
      tag: "数据安全",
      progress: 0,
      status: "start"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] text-neutral-body mb-4">
        <Link to="/user" className="hover:text-[#fa541c] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-title font-medium">课程</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-caption" />
          <Input 
            placeholder="搜索课程..." 
            className="pl-10 h-10 text-[14px] rounded-[6px] border-neutral-border bg-white focus-visible:ring-[#fa541c]" 
          />
        </div>
        <Button className="h-10 px-6 bg-[#fa541c] hover:bg-[#ff7a45] text-white rounded-[6px] text-[14px]">
          搜索
        </Button>
        <div className="h-6 w-[1px] bg-neutral-border mx-2"></div>
        <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
          历史记录 <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-medium text-neutral-title flex items-center gap-1">
              <Filter className="w-4 h-4" /> 筛选:
            </span>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                专业方向 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                难度 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                状态 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">
                时间 <ChevronDown className="w-4 h-4" />
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
              综合 <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">最新</button>
            <span className="text-neutral-border">|</span>
            <button className="text-[14px] text-neutral-body hover:text-[#fa541c] transition-colors">最多学习</button>
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
            <h3 className="text-[15px] font-bold text-neutral-title">分类导航</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button 
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-[6px] text-[14px] transition-colors",
                activeCategory === "全部课程" ? "bg-[#fff2e8] text-[#fa541c] font-medium" : "text-neutral-title hover:bg-neutral-bg"
              )}
              onClick={() => setActiveCategory("全部课程")}
            >
              全部课程
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

        {/* Course Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <div key={i} className="bg-white rounded-[8px] overflow-hidden border border-neutral-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col">
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-bg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-[4px]">
                      {course.tag}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-neutral-title mb-3 line-clamp-2 group-hover:text-[#fa541c] transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[13px] text-neutral-body mb-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-neutral-caption" />
                        <span>{course.teacher}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#faad14] fill-[#faad14]" />
                          <span className="text-[#faad14] font-medium">{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-neutral-caption" />
                          <span>{course.students}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-neutral-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-neutral-caption">学习进度</span>
                        <span className="text-[12px] font-medium text-[#fa541c]">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-bg rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-[#fa541c] rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      
                      <Button 
                        className={cn(
                          "w-full h-9 text-[13px] rounded-[6px]",
                          course.status === "continue" 
                            ? "bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6] border border-[#ffbb96]" 
                            : "bg-[#fa541c] text-white hover:bg-[#ff7a45]"
                        )}
                      >
                        {course.status === "continue" ? "继续学习" : "开始学习"}
                      </Button>
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
      </div>
    </div>
  );
}
