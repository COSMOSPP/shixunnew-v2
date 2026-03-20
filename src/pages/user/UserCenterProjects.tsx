import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, FolderKanban, Star, Plus, Users, PlayCircle, Settings, Share2, GitFork, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserCenterProjects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-neutral-title font-medium">我的项目</span>
      </div>

      {/* 我的项目 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-6">
            <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-500" />
              我的项目
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-body">筛选：</span>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="ongoing">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-body">排序：</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">最新</SelectItem>
                    <SelectItem value="oldest">最早</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary-hover text-white">
            <Plus className="w-4 h-4 mr-2" />
            创建新项目
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-border">
            {/* 项目 1 */}
            <div className="p-6 hover:bg-neutral-bg/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-title">图像分类项目</h3>
                <span className="px-2.5 py-1 bg-semantic-warning/10 text-semantic-warning text-xs font-medium rounded-[4px]">进行中</span>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 w-48">
                  <span className="text-sm text-neutral-body">进度：</span>
                  <div className="h-2 flex-1 bg-neutral-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-title">80%</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-caption">
                  <span>创建：2025-03-01</span>
                  <span>更新：2025-03-18</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                  <PlayCircle className="w-4 h-4 mr-2" /> 继续项目
                </Button>
                <Button variant="outline" size="sm">查看详情</Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" /> 设置
                </Button>
              </div>
            </div>

            {/* 项目 2 */}
            <div className="p-6 hover:bg-neutral-bg/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-title">NLP情感分析项目</h3>
                <span className="px-2.5 py-1 bg-semantic-success/10 text-semantic-success text-xs font-medium rounded-[4px] flex items-center gap-1">
                  已完成 <span className="text-[10px]">✓</span>
                </span>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 w-48">
                  <span className="text-sm text-neutral-body">进度：</span>
                  <div className="h-2 flex-1 bg-neutral-border rounded-full overflow-hidden">
                    <div className="h-full bg-semantic-success" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-title">100%</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-caption">
                  <span>完成于 2025-03-10</span>
                  <span className="text-neutral-title font-medium">评分：85分</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">查看详情</Button>
                <Button variant="outline" size="sm">
                  <GitFork className="w-4 h-4 mr-2" /> Fork
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" /> 分享
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 我的最佳实践 */}
      <Card className="border-neutral-border shadow-sm">
        <CardHeader className="pb-2 border-b border-neutral-border flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-neutral-title flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            我的最佳实践
          </CardTitle>
          <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
            <Plus className="w-4 h-4 mr-2" />
            发布新实践
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-border">
            {/* 实践 1 */}
            <div className="p-6 hover:bg-neutral-bg/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-title">Python数据清洗最佳实践</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-neutral-title">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-body">
                    <Users className="w-4 h-4 text-blue-500" /> 1.2K
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-4 text-sm text-neutral-caption">
                <span>发布：2025-02-15</span>
                <span>使用：1,234次</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">查看详情</Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> 编辑
                </Button>
                <Button variant="outline" size="sm" className="text-semantic-error border-semantic-error/20 hover:bg-semantic-error/10 hover:text-semantic-error">
                  <Trash2 className="w-4 h-4 mr-2" /> 删除
                </Button>
              </div>
            </div>

            {/* 实践 2 */}
            <div className="p-6 hover:bg-neutral-bg/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-title">图像增强最佳实践</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-neutral-title">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.7
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-body">
                    <Users className="w-4 h-4 text-blue-500" /> 856
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-4 text-sm text-neutral-caption">
                <span>发布：2025-03-01</span>
                <span>使用：856次</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">查看详情</Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> 编辑
                </Button>
                <Button variant="outline" size="sm" className="text-semantic-error border-semantic-error/20 hover:bg-semantic-error/10 hover:text-semantic-error">
                  <Trash2 className="w-4 h-4 mr-2" /> 删除
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
