import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MonitorPlay, FolderKanban, Database, Plus, Play, Download, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyLearning() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">我的学习</span>
      </div>

      {/* 课程进度学习卡片 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-title flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-primary" />
            课程进度学习卡片
          </h2>
          <Button variant="ghost" className="text-sm text-neutral-caption hover:text-primary">
            进入全部课程 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <Card className="border-neutral-border shadow-sm hover:border-primary/30 transition-colors">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-32 bg-neutral-bg rounded-lg flex items-center justify-center shrink-0 object-cover overflow-hidden relative">
              <MonitorPlay className="w-12 h-12 text-neutral-caption" />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center group-hover:bg-black/20 transition-all cursor-pointer">
                <Play className="w-10 h-10 text-white opacity-80" />
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h3 className="text-lg font-bold text-neutral-title">Python高级数据处理与可视化</h3>
                <p className="text-sm text-neutral-body mt-1">正在学习：第4章 复杂数据清洗与异常处理 - 小节 4.2</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-caption">课程总进度</span>
                  <span className="text-primary font-medium">65%</span>
                </div>
                <div className="w-full h-2 bg-neutral-bg rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: '65%' }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="bg-primary hover:bg-primary-hover text-white flex-1 md:flex-none">继续学习</Button>
                <Button variant="outline" className="flex-1 md:flex-none">查看课程详情</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 我的工作台 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-lg font-bold text-neutral-title flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-500" />
            我的工作台
          </h2>
          <Button variant="ghost" className="text-sm text-neutral-caption hover:text-indigo-500">
            进入个人工作台 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 项目列表 */}
          <Card className="border-neutral-border shadow-sm flex flex-col h-[500px]">
            <CardHeader className="pb-3 border-b border-neutral-border flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-base font-bold text-neutral-title">项目 (2)</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
                  <input type="text" placeholder="搜索项目" className="h-8 pl-9 pr-3 text-sm border border-neutral-border rounded-md bg-neutral-bg" />
                </div>
                <Button size="sm" variant="outline" className="h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50"><Plus className="w-4 h-4 mr-1" /> 新建项目</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-neutral-border rounded-lg hover:border-indigo-300 transition-colors bg-white">
                  <div className="w-20 h-20 bg-indigo-50 rounded-md border border-indigo-100 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-8 h-8 text-indigo-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-neutral-title truncate text-[15px]">电商用户行为预测</h4>
                      </div>
                      <p className="text-xs text-neutral-body line-clamp-2">默认描述：使用深度学习模型预测用户购买转化率的实战开发项目。</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-neutral-bg text-neutral-body text-[10px] rounded-[4px]">分类模型</span>
                        <span className="text-[10px] text-neutral-caption ml-2">2小时前更新</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600 hover:bg-indigo-50 px-2 border border-indigo-100">开始开发</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 数据集列表 */}
          <Card className="border-neutral-border shadow-sm flex flex-col h-[500px]">
            <CardHeader className="pb-3 border-b border-neutral-border flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-base font-bold text-neutral-title">数据集 (3)</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
                  <input type="text" placeholder="搜索数据集" className="h-8 pl-9 pr-3 text-sm border border-neutral-border rounded-md bg-neutral-bg" />
                </div>
                <Button size="sm" variant="outline" className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"><Plus className="w-4 h-4 mr-1" /> 新建数据集</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border border-neutral-border rounded-lg hover:border-blue-300 transition-colors bg-white">
                  <div className="w-20 h-20 bg-blue-50 rounded-md border border-blue-100 flex items-center justify-center shrink-0">
                    <Database className="w-8 h-8 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-neutral-title truncate text-[15px] mb-1">淘宝用户行为日志 2025</h4>
                      <p className="text-xs text-neutral-body line-clamp-2">包含数百万用户浏览、加购、购买数据的结构化特征表。</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-caption">更新于昨天</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-neutral-caption hover:text-blue-600 hover:bg-blue-50" title="下载">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-neutral-caption hover:text-blue-600 hover:bg-blue-50 px-2 border border-neutral-border">添加到项目</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
