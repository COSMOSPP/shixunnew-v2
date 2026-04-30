import React, { useState } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, CheckCircle2, FileText, Code, CheckSquare, List, Activity, Settings, Eye, Play, Users, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ProjectData {
  title: string;
  desc: string;
  image: string;
  participants: string;
  rating: number;
  favorites?: number;
  difficulty: string;
  tags: string[];
  status: string;
}

interface ProjectDetailProps {
  project: ProjectData;
  onBack: () => void;
  onStart: () => void;
}

export default function ProjectDetail({ project, onBack, onStart }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('detail');

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f5f5] flex flex-col font-sans -mx-6 -mt-6 -mb-6">
      {/* Header Section */}
      <div className="relative pt-6 pb-8 px-8 md:px-14">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={project.image} 
            alt="Project Banner" 
            className="w-full h-full object-cover opacity-20 filter blur-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e8]/95 to-[#ffd8bf]/90"></div>
          
          {/* Decorative background elements moved inside the overflow-hidden container */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none z-0"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Cover image */}
          <div className="w-full md:w-[320px] aspect-video rounded-[12px] overflow-hidden shadow-lg border-[3px] border-white/80 shrink-0 relative group bg-white/40 flex items-center justify-center">
             <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
               referrerPolicy="no-referrer"
             />
             <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-md border border-white/20">
               v1.0.0
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="flex-1 w-full">
            {/* Breadcrumb & Actions */}
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center text-[13px] text-neutral-caption bg-white/40 px-3 py-1 rounded-full border border-white/50 backdrop-blur-sm">
                <button onClick={onBack} className="hover:text-[#fa541c] flex items-center gap-1 font-medium transition-colors">
                  <ChevronLeft className="w-4 h-4" /> 返回
                </button>
                <span className="mx-2">/</span>
                <span className="hover:text-[#fa541c] cursor-pointer transition-colors">全部项目</span>
                <span className="mx-2">/</span>
                <span className="text-neutral-title font-bold">{project.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-neutral-50 text-[13px] font-medium text-neutral-title transition-all shadow-sm border border-neutral-200/50">
                  <Bookmark className="w-4 h-4 text-[#fa541c]" /> 收藏
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white hover:bg-neutral-50 text-[13px] font-medium text-neutral-title transition-all shadow-sm border border-neutral-200/50">
                  <Share2 className="w-4 h-4" /> 分享
                </button>
              </div>
            </div>

            {/* Title & Meta */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">{project.title}</h1>
              
              {/* Tags & Version */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[12px] font-bold px-2.5 py-0.5 bg-white text-neutral-title rounded-md shadow-sm border border-neutral-200">
                  官方认证
                </span>
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-[12px] font-medium px-2.5 py-0.5 bg-[#fa541c]/10 text-[#fa541c] border border-[#fa541c]/20 rounded-md">
                    {tag}
                  </span>
                ))}
                <span className="text-[12px] font-medium px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md">
                  {project.difficulty}
                </span>
              </div>

              <p className="text-[14px] text-neutral-700 mb-4 leading-relaxed max-w-3xl bg-white/40 p-3 rounded-[8px] border border-white/50 backdrop-blur-sm">
                {project.desc}
              </p>

              {/* Favorites & Enrollment & Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-[10px] shadow-sm border border-neutral-200/50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-neutral-500" />
                    <span className="text-[13px] text-neutral-600 font-medium"><span className="text-[#fa541c] font-bold">{project.favorites || (project.rating > 10 ? project.rating : Math.floor(project.rating * 100))}</span> 人收藏</span>
                  </div>
                  <div className="w-px h-5 bg-neutral-200"></div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span className="text-[13px] text-neutral-600 font-medium"><span className="text-[#fa541c] font-bold">{project.participants}</span> 人已参与</span>
                  </div>
                </div>

                <Button 
                  onClick={onStart}
                  className="bg-gradient-to-r from-[#fa541c] to-[#ff8c3a] hover:from-[#e84a15] hover:to-[#ff7a22] text-white shadow-lg shadow-[#fa541c]/30 border-0 flex items-center gap-2 rounded-[10px] px-8 h-11 transition-all hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span className="font-bold text-[15px] tracking-wide">立刻使用此项目</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-8 flex gap-6 items-start">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-[12px] shadow-sm p-1 flex items-center gap-2">
            {[
              { id: 'detail', label: '项目详情卡片', icon: List },
              { id: 'source', label: '项目源码区', icon: Code },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-[8px] text-[15px] font-medium transition-all flex items-center gap-2",
                  activeTab === tab.id ? "text-[#fa541c] bg-[#fff2e8]" : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Details Section */}
          {activeTab === 'detail' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[16px] shadow-sm p-8">
                <h2 className="text-lg font-bold text-neutral-title mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#fa541c]" /> 项目卡片 (业务描述)
                </h2>
                <p className="text-[14px] text-neutral-body leading-relaxed mb-6">
                  本项目模拟了企业级真实的开发流程。您需要从给定的原始样本中进行数据清洗与分析，选取适当的算法模型，执行训练并对比不同超参数下的性能，最后部署微调模型以验证泛化能力。
                </p>
                <div className="bg-[#fafafa] rounded-[12px] p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  {[
                    "理解项目业务逻辑与痛点",
                    "数据采集与全流程清洗",
                    "搭建与训练算法核心模型",
                    "部署与接口 API 封装测试"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[14px] text-neutral-title">
                      <div className="w-6 h-6 rounded-full bg-[#fff2e8] flex items-center justify-center text-[#fa541c] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[16px] shadow-sm p-8">
                 <h2 className="text-lg font-bold text-neutral-title mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#fa541c]" /> 项目推进路线说明
                 </h2>
                 <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                   {[
                      { step: "步骤 1", title: "环境准备与导入", desc: "分配在线资源沙盒，加载所需的 Python 库及业务预备数据集。" },
                      { step: "步骤 2", title: "特征工程与清洗", desc: "处理异常值、填补缺失值并实现数据的归一化流转。" },
                      { step: "步骤 3", title: "模型构建探索", desc: "基于清洗完毕的数据建立基础模型配置，调整网络参数结构。" },
                      { step: "步骤 4", title: "推演与应用", desc: "将最佳预测模型导出，连接测试端验证其实际推演有效性。" }
                   ].map((phase, i) => (
                     <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-[#fa541c] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <span className="text-[12px] font-bold">{i+1}</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-4 rounded-[12px] bg-white border border-neutral-border shadow-sm hover:border-[#fa541c] transition-colors">
                           <div className="mb-1">
                              <span className="font-bold text-neutral-title text-[15px]">{phase.title}</span>
                              <span className="text-[12px] text-[#fa541c] ml-2 block sm:inline">{phase.step}</span>
                           </div>
                           <div className="text-[13px] text-neutral-caption leading-relaxed">{phase.desc}</div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {/* Source Code Section */}
          {activeTab === 'source' && (
            <div className="bg-white rounded-[16px] shadow-sm p-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-neutral-title flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#fa541c]" /> 源代码展示页
                </h2>
                <Button variant="outline" size="sm" className="hidden sm:flex transition-colors hover:text-[#fa541c] hover:border-[#fa541c]">
                   <Download className="w-4 h-4 mr-2" /> 下载源码 ZIP
                </Button>
              </div>
              
              <div className="border border-neutral-border rounded-[8px] overflow-hidden">
                 <div className="bg-[#f5f6f8] px-4 py-3 flex items-center gap-2 border-b border-neutral-border text-[13px] font-bold text-neutral-title">
                   <FileText className="w-4 h-4 text-neutral-caption" />
                   项目文件结构总览
                 </div>
                 <div className="p-2 space-y-1">
                   {[
                     { name: "main.ipynb", type: "notebook", size: "12 KB" },
                     { name: "utils.py", type: "code", size: "4.2 KB" },
                     { name: "config.json", type: "data", size: "1.1 KB" },
                     { name: "README.md", type: "doc", size: "5.6 KB" },
                   ].map((file, i) => (
                     <div key={i} className="flex items-center justify-between hover:bg-neutral-50 p-2 rounded cursor-pointer group transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white border border-neutral-border flex items-center justify-center text-neutral-caption group-hover:text-[#fa541c] transition-colors">
                             {file.type === 'notebook' && <code className="text-[10px] font-bold">.ipynb</code>}
                             {file.type === 'code' && <code className="text-[10px] font-bold">.py</code>}
                             {file.type === 'data' && <code className="text-[10px] font-bold">.json</code>}
                             {file.type === 'doc' && <code className="text-[10px] font-bold">.md</code>}
                          </div>
                          <span className="text-[14px] text-neutral-title font-medium group-hover:text-[#fa541c] transition-colors">{file.name}</span>
                       </div>
                       <div className="flex items-center gap-4 text-[13px] text-neutral-caption">
                         <span className="hidden sm:block">{file.size}</span>
                         <Button size="icon" variant="ghost" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-neutral-body hover:text-[#fa541c]" />
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Project Metadata */}
        <div className="w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#fff2e8] to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-[15px] font-bold text-neutral-title mb-4 border-b border-neutral-border pb-2">所需环境架构</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-[13px]">
                   <span className="text-neutral-caption">推荐镜像构建</span>
                   <span className="font-bold text-neutral-title">JupyterLab: Base</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-[13px]">
                   <span className="text-neutral-caption">内存占用评估</span>
                   <span className="font-bold text-neutral-title">~ 8 GB</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                   <div className="w-[50%] h-full bg-blue-400"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-[13px]">
                   <span className="text-neutral-caption">GPU算力需求</span>
                   <span className="font-bold text-neutral-title text-[#fa541c]">建议启用</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                   <div className="w-[80%] h-full bg-[#fa541c]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[16px] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-neutral-title mb-4">前置知识储备</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-neutral-50 text-[12px] text-neutral-body rounded-full border border-neutral-border">Python 基础</span>
              <span className="px-3 py-1 bg-neutral-50 text-[12px] text-neutral-body rounded-full border border-neutral-border">Pandas 进阶</span>
              <span className="px-3 py-1 bg-neutral-50 text-[12px] text-neutral-body rounded-full border border-neutral-border">基础代数 & 矩阵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
