import React, { useState } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, CheckCircle2, FileText, Code, CheckSquare, List, Activity, Settings, Eye, Play, Users, Download, ChevronDown, Copy, Folder, Info, Clock } from 'lucide-react';
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


          <div className="flex-1 w-full">
            {/* Breadcrumb & Actions */}
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center text-[13px] text-neutral-caption">
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
          <div className="bg-white rounded-[12px] shadow-sm p-1 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {[
                { id: 'detail', label: '使用', icon: List },
                { id: 'source', label: '源码', icon: Code },
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
            <div className="flex items-center gap-1 text-neutral-500 cursor-pointer hover:text-neutral-900 transition-colors pr-4">
              <span className="text-[14px] text-neutral-400">版本：</span>
              <span className="text-[14px] text-neutral-500 mr-1">v0.1.1</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* Project Details Section */}
          {activeTab === 'detail' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-[16px] shadow-sm p-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-neutral-title">API</h2>
                  <span className="text-[13px] text-neutral-caption">(4278 次被调用)</span>
                  <Info className="w-4 h-4 text-neutral-caption cursor-pointer" />
                </div>
                
                <div className="flex items-center bg-[#fafafa] rounded-md mb-12">
                  <div className="flex-1 px-4 py-3 text-[14px] text-neutral-500 font-mono overflow-x-auto">
                    https://mo.zju.edu.cn/pyapi/apps/run/5f7856b9878cb398519d2063
                  </div>
                  <button className="p-3 bg-neutral-200/50 hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 rounded-r-md transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-2">
                  <h2 className="text-xl font-bold text-neutral-title">API 参数</h2>
                  <div className="flex items-center gap-1 text-[#fa541c] text-[14px] cursor-pointer hover:text-[#e84a15]">
                    收起 <ChevronDown className="w-4 h-4 rotate-180" />
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div>
                    <span className="font-bold text-neutral-title">输入</span>
                  </div>
                  <div className="border border-neutral-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-[#fafafa] text-neutral-500">
                        <tr>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-1/5 text-center">参数</th>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-1/5 text-center">类型</th>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-1/5 text-center">范围</th>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-1/5 text-center">默认值</th>
                          <th className="px-6 py-4 font-medium border-b border-neutral-100 w-1/5 text-center">说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-6 py-4 border-r border-neutral-100 text-[#52c41a] text-center">request</td>
                          <td className="px-6 py-4 border-r border-neutral-100 text-[#eb2f96] font-mono text-center">str</td>
                          <td className="px-6 py-4 border-r border-neutral-100 text-center text-neutral-caption">-</td>
                          <td className="px-6 py-4 border-r border-neutral-100 text-center text-neutral-caption">-</td>
                          <td className="px-6 py-4 text-neutral-title text-center">对模型说话</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div>
                    <span className="font-bold text-neutral-title">输出</span>
                  </div>
                  <div className="border border-neutral-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-[#fafafa] text-neutral-500">
                        <tr>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-[20%] text-center">参数</th>
                          <th className="px-6 py-4 font-medium border-b border-r border-neutral-100 w-[20%] text-center">类型</th>
                          <th className="px-6 py-4 font-medium border-b border-neutral-100 w-[60%] text-center">说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-6 py-4 border-r border-neutral-100 text-neutral-title text-center">response</td>
                          <td className="px-6 py-4 border-r border-neutral-100 text-[#eb2f96] font-mono text-center">str</td>
                          <td className="px-6 py-4 text-neutral-500 text-center">模型的回答</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[16px] shadow-sm flex overflow-hidden min-h-[400px]">
                <div className="w-16 bg-white border-r border-neutral-100 py-6 flex flex-col items-center gap-4 shrink-0">
                  <div className="w-10 h-10 rounded-md bg-[#8ce196] text-white flex items-center justify-center shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-md bg-neutral-200 text-white flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <div className="w-10 h-10 rounded-md bg-neutral-200 text-white flex items-center justify-center font-bold text-[10px]">
                    curl
                  </div>
                  <div className="w-10 h-10 rounded-md bg-neutral-200 text-white flex items-center justify-center">
                    <Code className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 p-10">
                  <h2 className="text-xl font-bold text-neutral-title mb-10">在线使用</h2>
                  <div className="flex gap-16">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div>
                        <span className="font-bold text-neutral-title">输入</span>
                      </div>
                      <div className="mb-3">
                        <span className="text-[#fa541c] mr-1">*</span>
                        <span className="text-[14px] text-neutral-title font-medium">request</span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="对模型说话" 
                        className="w-full bg-[#fafafa] border border-neutral-100 rounded-md px-4 py-3 text-[14px] outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] mb-8 transition-all"
                      />
                      <div className="flex justify-end">
                        <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-8 h-10">提交</Button>
                      </div>
                    </div>
                    
                    <div className="w-px bg-neutral-100"></div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div>
                        <span className="font-bold text-neutral-title">输出</span>
                      </div>
                      <div className="flex items-center gap-1 mb-4 text-[14px] text-neutral-title">
                        response: <Info className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <div className="text-[14px] text-neutral-400 mt-6">
                        提交你的输入来获取输出
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Source Code Section */}
          {activeTab === 'source' && (
            <div className="bg-white rounded-[16px] shadow-sm flex overflow-hidden border border-neutral-border h-[700px] animate-in fade-in duration-300">
              <div className="w-64 border-r border-neutral-border flex flex-col bg-white shrink-0">
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> .vscode
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> results
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <Folder className="w-4 h-4 text-[#faad14] fill-current opacity-80" /> src
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> .gitignore
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-purple-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">M</div> _overview.md
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> _readme.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-pink-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">Y</div> app_spec.yml
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> coding_here.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> handler.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> LICENSE
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-[#fa541c] text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">J</div> Main.ipynb
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> preproduction.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-neutral-300 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">T</div> project_requirements.txt
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-[#f5f6f8] rounded cursor-pointer text-[14px] text-neutral-title font-medium border-l-2 border-[#fa541c] -ml-2 pl-3">
                      <div className="w-4 h-4 bg-purple-400 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">M</div> readme.md
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> showEmbedding.py
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[14px] text-neutral-700">
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-[3px] flex items-center justify-center font-bold text-[10px]">P</div> showLSTM.py
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 flex flex-col bg-white overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-24 bg-[#fff2e8] rounded-full flex items-center justify-end pr-1 cursor-pointer z-10 border border-[#ffd8bf] shadow-sm">
                  <ChevronLeft className="w-4 h-4 text-[#fa541c]" />
                </div>
                <div className="h-12 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0">
                  <div className="text-[14px] text-[#fa541c]">master <span className="text-neutral-caption mx-1">/</span> <span className="text-[#fa541c]">readme.md</span></div>
                  <div className="text-[13px] text-[#fa541c] cursor-pointer hover:underline">分享链接</div>
                </div>
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold text-neutral-title mb-10">SOL模拟器</h1>
                    <h2 className="text-2xl font-bold text-neutral-title mb-6">简介</h2>
                    <p className="text-[16px] text-neutral-title leading-loose mb-12">
                      本项目是基于GloVe（求取Embedding）和LSTM（训练生成器）制作的SOL对话模拟器，模拟SOL在群里的对话方式。<br/>
                      如果有机会的话，后续会制作成QQ插件。
                    </p>
                    <h2 className="text-2xl font-bold text-neutral-title mb-8">来自网络的语料库</h2>
                    <p className="text-[15px] text-neutral-title leading-loose mb-6">
                      https://github.com/codemayq/chinese_chatbot_corpus
                    </p>
                    <div className="border border-neutral-100 rounded overflow-hidden">
                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-white border-b border-neutral-100">
                          <tr>
                            <th className="px-4 py-4 font-bold text-neutral-title border-r border-neutral-100 w-32 text-center">名称</th>
                            <th className="px-4 py-4 font-bold text-neutral-title border-r border-neutral-100 w-24 text-center">数量</th>
                            <th className="px-4 py-4 font-bold text-neutral-title text-center">SOL的奇妙手工打分</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">chatterbot</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">560</td>
                            <td className="px-4 py-4">8（翻译有问题，但是内容都是对上的）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">douban</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">3.520M</td>
                            <td className="px-4 py-4">2（牛头不对马嘴）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">ptt</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">0.4M</td>
                            <td className="px-4 py-4">8（八卦太多了，好吧毕竟是八卦语料库，不过好像没怎么参与训练？）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">qingyun</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">0.1M</td>
                            <td className="px-4 py-4">5（部分内容无关）</td>
                          </tr>
                          <tr className="border-b border-neutral-100 hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">subtitle</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">2.74M</td>
                            <td className="px-4 py-4">8（语言通顺性还行，不过不是对话）</td>
                          </tr>
                          <tr className="hover:bg-neutral-50/50">
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">tieba</td>
                            <td className="px-4 py-4 border-r border-neutral-100 text-center">2.32M</td>
                            <td className="px-4 py-4">6（语言通顺性还行，但是足球实在太多了）</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Project Metadata */}
        <div className="w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full aspect-[4/3] object-cover rounded-[8px] mb-6" 
              referrerPolicy="no-referrer"
            />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-[#fa541c] font-medium text-[18px]">
                <div className="w-[3px] h-4 bg-[#fa541c] rounded-full"></div>
                项目
              </div>
              <div className="flex items-center text-[15px] text-neutral-500">
                <Star className="w-4 h-4 mr-1.5" /> 4 
                <span className="w-1 h-1 bg-neutral-300 rounded-full mx-2.5"></span>
                <Clock className="w-4 h-4 mr-1.5" /> 2022/12/01
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#fa541c] overflow-hidden flex items-center justify-center shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SOL&backgroundColor=fa541c" alt="SOL" className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7c3aed] rounded flex items-center justify-center text-white text-[10px] border-[2px] border-white">
                    🤖
                  </div>
                </div>
                <span className="text-[17px] text-neutral-600 font-medium">SOL</span>
              </div>
              
              <button className="w-12 h-12 rounded-full bg-[#fff2e8] flex items-center justify-center text-[#fa541c] hover:bg-[#ffd8bf] transition-colors">
                <Download className="w-6 h-6" />
              </button>
            </div>

            <button className="w-full h-12 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[6px] font-bold text-[18px] transition-colors shadow-sm">
              Fork
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
