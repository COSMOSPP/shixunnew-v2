import React, { useState } from "react";
import { ChevronRight, Star, Book, FolderKanban, Database, HeartOff, MonitorPlay, FileText, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserCenterFavorites() {
  const [activeTab, setActiveTab] = useState("practices");
  const navigate = useNavigate();

  const tabs = [
    { id: "practices", label: "收藏的最佳实践", icon: Sparkles },
    { id: "courses", label: "收藏的课程", icon: Book },
    { id: "projects", label: "收藏的项目", icon: FolderKanban },
    { id: "datasets", label: "收藏的数据集", icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-40 bg-neutral-bg flex items-center justify-center relative">
                  <MonitorPlay className="w-12 h-12 text-neutral-caption group-hover:text-primary/50 transition-colors" />
                  <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-primary" title="取消收藏">
                    <Star className="w-4 h-4 fill-primary" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-neutral-title line-clamp-1 mb-2">Python核心编程与实战 (第{i}卷)</h3>
                  <p className="text-xs text-neutral-body mb-3">包含Python高级特性、网络编程、多线程等核心知识。</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-neutral-caption">32课时 · 2500+人学习</span>
                    <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/5 px-2">继续学习</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="flex flex-row p-0 overflow-hidden hover:shadow-md transition-shadow group border-neutral-border">
                <div className="w-32 bg-indigo-50 flex items-center justify-center border-r border-neutral-border shrink-0">
                  <FolderKanban className="w-10 h-10 text-indigo-300" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-neutral-title mb-1 text-[15px]">电商用户行为分析项目</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 text-primary hover:bg-primary/10" title="取消收藏">
                        <Star className="w-4 h-4 fill-primary" />
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-body line-clamp-2 mt-1">使用Pandas和Scikit-learn对电商用户行为进行分析，预测用户购买意向，构建推荐模型。</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[10px] rounded-[4px]">数据分析</span>
                      <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[10px] rounded-[4px]">中级</span>
                    </div>
                    <span className="text-xs text-neutral-caption">更新于 3天前</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case "datasets":
        return (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border border-neutral-border rounded-[8px] hover:border-primary/30 transition-colors group bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[8px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-title mb-1">全球城市气象历史数据集 (1990-2023)</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-caption">
                      <span>格式: CSV</span>
                      <span>大小: 1.2GB</span>
                      <span>下载量: 5.4k</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="h-8">查看详情</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-caption hover:text-semantic-error hover:bg-semantic-error/10" title="取消收藏">
                    <HeartOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      case "practices":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="flex flex-row p-0 overflow-hidden hover:shadow-md transition-shadow group border-neutral-border">
                <div className="w-32 bg-orange-50 flex items-center justify-center border-r border-neutral-border shrink-0">
                  <Sparkles className="w-10 h-10 text-orange-400" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-neutral-title mb-1 text-[15px]">{i === 1 ? "项目汇报 PPT 生成" : "十年经验简历生成"}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 text-primary hover:bg-primary/10" title="取消收藏">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-body line-clamp-2 mt-1">
                      {i === 1 
                        ? "基于大模型快速生成项目汇报PPT大纲与内容，适合各类课程期末汇报、项目结题展示等场景，大幅提升文档编写效率。" 
                        : "通过深度对话挖掘你的核心竞争力，生成对标资深工程师、架构师级别的专业简历，助你脱颖而出。"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[10px] rounded-[4px]">内容创作</span>
                      <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[10px] rounded-[4px]">初阶</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => navigate('/practices', { state: { practiceId: i, showDetail: true } })} variant="outline" size="sm" className="h-7 text-xs">进入详情</Button>
                      <Button onClick={() => navigate('/practices', { state: { practiceId: i, showDetail: true } })} variant="default" size="sm" className="h-7 text-xs bg-[#fa541c] hover:bg-[#ff7a45] text-white">一键应用</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">我的收藏</span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-border shadow-sm p-6 min-h-[600px]">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-neutral-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-[15px] font-medium transition-colors relative flex items-center gap-2",
                activeTab === tab.id 
                  ? "text-primary" 
                  : "text-neutral-body hover:text-neutral-title"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
