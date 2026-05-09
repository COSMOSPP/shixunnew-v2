import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart2, BookOpen, Users, 
  Download, Plus, Search, FileText, CheckCircle, 
  Clock, MoreVertical, Settings, BarChart, Copy,
  ChevronDown, ChevronUp, PlusCircle, Paperclip, MonitorPlay, Code, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COURSE_SYLLABUS = [
  {
    chapter: "第一课",
    title: "人工智能训练师三级考试内容指导",
    lessons: [
      { section: "课时1:", title: "职业简介", type: "doc" },
      { section: "课时2:", title: "认定方案", type: "doc" },
      { section: "课时3:", title: "认定要素细目表", type: "doc" },
      { section: "课时4:", title: "实操平台演示", type: "video" },
      { section: "课时5:", title: "代码复习讲义", type: "doc" },
      { section: "课时6:", title: "第一课随堂作业", type: "assignment" }
    ]
  },
  {
    chapter: "第二课",
    title: "培训与指导",
    lessons: [
      { section: "课时1:", title: "智能音箱产品的数据分析与优化[3.1.1]", type: "experiment" },
      { section: "课时2:", title: "智能照明系统的数据分析与优化[3.1.2]", type: "split_doc" },
      { section: "课时3:", title: "智能健康手环的数据分析与优化[3.1.3]", type: "experiment" },
      { section: "课时4:", title: "智能健康监测系统的数据分析与优化[3.1.4]", type: "experiment" },
      { section: "课时5:", title: "智能家居环境控制系统的数据分析与优化[3.1.5]", type: "experiment" }
    ]
  }
];

export default function TeacherCourseManage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('editor');

  const tabs = [
    { id: 'editor', label: '课程章节', icon: BookOpen },
    { id: 'assignments', label: '作业考试', icon: FileText },
    { id: 'members', label: '成员管理', icon: Users },
    { id: 'analytics', label: '学情数据', icon: BarChart2 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f5f7fa] -mt-6 -mx-6 md:-mx-8 overflow-hidden">
      {/* Top Header */}
      <div className="h-14 bg-white flex items-center px-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative z-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-neutral-title font-medium hover:text-[#fa541c] transition-colors">
          <ArrowLeft className="w-4 h-4" /> 人工智能基础与实践
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar Menu */}
        <div className="w-[100px] bg-white border-r border-neutral-border/60 flex flex-col py-4 flex-shrink-0 z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-4 w-full transition-colors relative",
                activeTab === tab.id 
                  ? "text-[#fa541c]" 
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-title"
              )}
            >
              {activeTab === tab.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fa541c]"></div>
              )}
              <tab.icon className="w-6 h-6 mb-2" strokeWidth={1.5} />
              <span className="text-[13px] font-medium tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          
          {/* Hero Header Area */}
          <div className="bg-gradient-to-r from-[#fff2e8] via-[#fff7f2] to-blue-50/50 h-[300px] w-full pt-10 px-6 lg:px-10">
            <div className="flex items-center gap-10 w-full">
              {/* Course Cover Card */}
              <div className="w-[360px] h-[200px] bg-gradient-to-br from-[#40a9ff] to-[#096dd9] rounded-xl shadow-lg relative overflow-hidden flex flex-col items-center justify-center group">
                 {/* This makes the cover match the image reference (blue card), but we can make it orange if preferred. 
                     The prompt says "主题色为橙色" (Theme color is orange), so let's make the card orange. */}
                 <div className="absolute inset-0 bg-gradient-to-br from-[#fa541c] to-[#ff7a45]"></div>
                 
                 <div className="absolute top-0 right-0 bg-[#52c41a] text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-20">
                   教学实训
                 </div>
                 
                 {/* decorative hexes background */}
                 <div className="absolute right-[-30px] bottom-[-30px] opacity-20 z-10 group-hover:scale-110 transition-transform duration-700">
                   <svg width="150" height="150" viewBox="0 0 100 100">
                     <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="1.5"/>
                     <polygon points="50 20 75 35 75 65 50 80 25 65 25 35" fill="none" stroke="white" strokeWidth="1"/>
                   </svg>
                 </div>
                 <div className="absolute left-[-20px] top-[-20px] opacity-10 z-10">
                   <svg width="100" height="100" viewBox="0 0 100 100">
                     <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="2"/>
                   </svg>
                 </div>
                 
                 <h2 className="text-3xl font-bold text-white tracking-widest relative z-20 drop-shadow-md">人工智能基础与实践</h2>
              </div>
              
              {/* Course Info */}
              <div>
                <h1 className="text-3xl font-bold text-neutral-title mb-4">人工智能基础与实践</h1>
                <div className="flex items-center gap-3 text-[13px] text-neutral-500 mb-6 font-medium">
                  <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-white/40 shadow-sm text-neutral-600">
                    <BookOpen className="w-3.5 h-3.5 text-[#fa541c]"/> 4 章节 | 18 课节
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-white/40 shadow-sm text-neutral-600">
                    课程编号: AI20261014 <Copy className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-[#fa541c] transition-colors"/>
                  </span>
                </div>
                <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-8 h-10 rounded-lg shadow-sm shadow-orange-500/20 font-medium">
                  去编辑
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Main Content Card */}
          <div className="w-full -mt-8 relative z-20 pb-16 px-6 lg:px-10">
            <div className="bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border border-neutral-border/50 min-h-[500px]">
              
              {/* 1. 课程章节 (Course Chapters - like the screenshot) */}
              {activeTab === 'editor' && (
                <div className="animate-in fade-in duration-500">
                  {/* Top Inner Tabs */}
                  <div className="flex items-center justify-between border-b border-neutral-border px-8 pt-4">
                     <div className="flex gap-8">
                       <button className="pb-4 text-[15px] font-bold text-[#fa541c] border-b-2 border-[#fa541c] relative bottom-[-1px]">课程目录</button>
                       <button className="pb-4 text-[15px] font-medium text-neutral-500 hover:text-neutral-title transition-colors border-b-2 border-transparent relative bottom-[-1px]">课程作业</button>
                     </div>
                     <div className="flex items-center gap-4 pb-3">
                       <Button variant="outline" size="sm" className="h-8 text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8] rounded flex items-center gap-1.5">
                         <PlusCircle className="w-3.5 h-3.5" /> 新建章
                       </Button>
                       <button className="text-sm text-[#fa541c] flex items-center gap-1 hover:opacity-80">
                         展开 <ChevronDown className="w-4 h-4" />
                       </button>
                     </div>
                  </div>

                  {/* Chapter List Area */}
                  <div className="p-8 space-y-6">
                    {COURSE_SYLLABUS.map((chapter, i) => (
                      <div key={i} className="rounded-lg bg-neutral-50 border border-neutral-100 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 bg-neutral-100/50">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-neutral-title">{chapter.chapter} {chapter.title}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-400">
                            <PlusCircle className="w-5 h-5 cursor-pointer hover:text-[#fa541c] transition-colors" />
                            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" />
                            <ChevronDown className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" />
                          </div>
                        </div>
                        <div className="bg-white">
                          {chapter.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50 group border-l-2 border-l-transparent hover:border-l-[#fa541c] transition-colors">
                              <div className="flex items-center gap-6">
                                <span className="text-[14px] text-neutral-body w-12">{lesson.section}</span>
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-6 h-6 rounded flex items-center justify-center",
                                    lesson.type === 'video' ? "bg-orange-100 text-[#fa541c]" : 
                                    lesson.type === 'experiment' ? "bg-blue-100 text-blue-500" :
                                    lesson.type === 'assignment' ? "bg-green-100 text-green-500" :
                                    "bg-purple-100 text-purple-500"
                                  )}>
                                    {lesson.type === 'video' ? <MonitorPlay className="w-3.5 h-3.5" /> : 
                                     lesson.type === 'experiment' ? <Code className="w-3.5 h-3.5" /> :
                                     lesson.type === 'assignment' ? <CheckSquare className="w-3.5 h-3.5" /> :
                                     <FileText className="w-3.5 h-3.5" />
                                    }
                                  </div>
                                  <span className="text-sm font-medium text-neutral-title group-hover:text-[#fa541c] transition-colors">{lesson.title}</span>
                                </div>
                              </div>
                              <MoreVertical className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. 作业考试 (Assignments) */}
              {activeTab === 'assignments' && (
                <div className="p-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-8 border-b border-neutral-border pb-4">
                    <h2 className="text-xl font-bold text-neutral-title">作业考试管理</h2>
                    <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded shadow-sm">
                      <Plus className="w-4 h-4 mr-1.5" /> 发布新任务
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-lg border border-neutral-200 hover:border-[#fa541c]/40 hover:shadow-sm transition-all bg-neutral-50/30">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mt-0.5 shadow-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-neutral-title text-base">模块 {i} 综合测验</h4>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-500">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 截止: 2026-05-20</span>
                              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> 已交: 45/50</span>
                              <span className="flex items-center gap-1"><BarChart className="w-3.5 h-3.5 text-blue-500" /> 均分: 88.5</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                          <Button variant="outline" size="sm" className="text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8]">批阅记录</Button>
                          <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 成员管理 (Members) */}
              {activeTab === 'members' && (
                <div className="p-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-neutral-title">班级成员</h2>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-neutral-300 text-neutral-600 h-9">
                        批量导入
                      </Button>
                      <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 shadow-sm">
                        <Plus className="w-4 h-4 mr-1.5" /> 邀请学生
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center mb-6 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="text" placeholder="搜索姓名或学号..." className="pl-9 pr-4 py-2 w-[300px] text-sm border border-neutral-300 rounded focus:outline-none focus:border-[#fa541c] transition-colors" />
                  </div>

                  <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-neutral-50 text-xs text-neutral-500 border-b border-neutral-200 font-medium">
                          <th className="py-3 px-6">姓名</th>
                          <th className="py-3 px-6">手机号/邮箱</th>
                          <th className="py-3 px-6">学习进度</th>
                          <th className="py-3 px-6">最近活跃</th>
                          <th className="py-3 px-6 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['李明', '王华', '张伟'].map((name, i) => (
                          <tr key={i} className="border-b border-neutral-100 hover:bg-[#fff2e8]/20 transition-colors">
                            <td className="py-3 px-6 font-medium text-sm text-neutral-title">{name}</td>
                            <td className="py-3 px-6 text-sm text-neutral-500">138****{1000+i}</td>
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#fa541c] rounded-full" style={{ width: `${60 + i * 8}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-neutral-500">{60 + i * 8}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-sm text-neutral-400">2小时前</td>
                            <td className="py-3 px-6 text-right">
                              <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-red-500 px-2 h-7">移除</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. 学情数据 (Analytics) */}
              {activeTab === 'analytics' && (
                <div className="p-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-8 border-b border-neutral-border pb-4">
                    <h2 className="text-xl font-bold text-neutral-title">学习情况全景</h2>
                    <Button variant="outline" className="border-neutral-300 text-neutral-600 h-9">
                      <Download className="w-4 h-4 mr-1.5" /> 导出报告
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    {['总体学习进度', '视频完播率', '作业提交率', '考试及格率'].map((stat, i) => (
                      <div key={i} className="p-5 rounded-lg border border-neutral-200 bg-white shadow-sm flex flex-col justify-between">
                        <div className="text-sm text-neutral-500 font-medium mb-3">{stat}</div>
                        <div className="text-3xl font-bold text-neutral-title">{Math.floor(Math.random() * 40 + 60)}<span className="text-lg text-neutral-400 ml-1">%</span></div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-72 rounded-lg border border-neutral-200 bg-white p-6 flex flex-col shadow-sm">
                      <h3 className="font-bold text-neutral-title mb-6">活跃度趋势</h3>
                      <div className="flex-1 flex items-end gap-2 px-4">
                        {[40, 50, 30, 70, 80, 60, 90, 85].map((h, i) => (
                          <div key={i} className="flex-1 bg-orange-100 rounded-t hover:bg-orange-200 transition-colors relative group" style={{ height: `${h}%` }}>
                            <div className="w-full bg-[#fa541c] rounded-t absolute top-0 left-0" style={{ height: '4px' }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-72 rounded-lg border border-neutral-200 bg-white p-6 flex flex-col shadow-sm">
                      <h3 className="font-bold text-neutral-title mb-6">任务完成分布</h3>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full border-[20px] border-[#fa541c] border-r-orange-300 border-b-orange-200 border-l-orange-100"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Add MonitorPlay import at the top
