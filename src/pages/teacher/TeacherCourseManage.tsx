import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart2, BookOpen, Users, 
  Download, Plus, Search, FileText, CheckCircle, 
  Clock, MoreVertical, Settings, BarChart, Copy,
  ChevronDown, ChevronUp, PlusCircle, Paperclip, MonitorPlay, Code, CheckSquare, Calendar, TrendingUp, PieChart, Edit, Award, ChevronRight, X, Trash2, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CourseDetail from '@/components/CourseDetail';
import TeacherPPTEditor from '@/components/TeacherPPTEditor';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as BarChartRecharts, Bar } from 'recharts';

const COURSE_SYLLABUS = [
  {
    chapter: "第一课",
    title: "人工智能训练师三级考试内容指导",
    lessons: [
      { section: "课时1:", title: "职业简介", type: "doc" },
      { section: "课时2:", title: "认定方案", type: "doc" },
      { section: "课时3:", title: "认定要素细目表", type: "doc" },
      { section: "课时4:", title: "实操平台演示", type: "doc" },
      { section: "课时5:", title: "代码复习讲义", type: "doc" }
    ]
  },
  {
    chapter: "第二课",
    title: "培训与指导",
    lessons: [
      { section: "课时1:", title: "线性回归实训：预测考试分数", type: "experiment" },
      { section: "课时2:", title: "智能照明系统的数据分析与优化[3.1.2]", type: "split_doc" },
      { section: "课时3:", title: "智能健康手环的数据分析与优化[3.1.3]", type: "experiment" },
      { section: "课时4:", title: "智能健康监测系统的数据分析与优化[3.1.4]", type: "experiment" },
      { section: "课时5:", title: "智能家居环境控制系统的数据分析与优化[3.1.5]", type: "experiment" }
    ]
  }
];

const activityData = [
  { day: '周一', active: 420 },
  { day: '周二', active: 580 },
  { day: '周三', active: 510 },
  { day: '周四', active: 680 },
  { day: '周五', active: 850 },
  { day: '周六', active: 1020 },
  { day: '周日', active: 940 },
];

const scoreData = [
  { range: '<60', count: 12 },
  { range: '60-70', count: 35 },
  { range: '70-80', count: 85 },
  { range: '80-90', count: 120 },
  { range: '90-100', count: 48 },
];

export default function TeacherCourseManage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('editor');
  const [editorSubTab, setEditorSubTab] = useState<'directory' | 'assignments'>('directory');
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{title: string, type: string} | null>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showSelectPaperModal, setShowSelectPaperModal] = useState(false);
  const [selectedPaperName, setSelectedPaperName] = useState("");
  const [expandedPaper, setExpandedPaper] = useState<string | null>("人工智能通讯课-期末考试");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showScoringRulesModal, setShowScoringRulesModal] = useState(false);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [addMenuOpenIndex, setAddMenuOpenIndex] = useState<number | null>(null);
  const [showTeachingMaterialModal, setShowTeachingMaterialModal] = useState(false);
  const [showExperimentMaterialModal, setShowExperimentMaterialModal] = useState(false);
  const [showInteractiveMaterialModal, setShowInteractiveMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedExperimentIndex, setSelectedExperimentIndex] = useState<number | null>(null);
  const [isSearchingExperiment, setIsSearchingExperiment] = useState(false);
  const [chapterMenuOpenIndex, setChapterMenuOpenIndex] = useState<number | null>(null);
  const [showEditChapterModal, setShowEditChapterModal] = useState(false);
  const [showDeleteChapterModal, setShowDeleteChapterModal] = useState(false);
  const [lessonMenuOpenIndex, setLessonMenuOpenIndex] = useState<string | null>(null);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedEditLesson, setSelectedEditLesson] = useState<{ chapterIndex: number, lessonIndex: number, title: string, section: string } | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(true);

  const tabs = [
    { id: 'editor', label: '课程章节', icon: BookOpen },
    { id: 'assignments', label: '作业配置', icon: FileText },
    { id: 'members', label: '成员管理', icon: Users },
    { id: 'analytics', label: '学情数据', icon: BarChart2 },
  ];

  if (showCourseDetail) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#f5f6f8] -mt-6 -mx-6 md:-mx-8 overflow-hidden">
        <TeacherPPTEditor courseSyllabus={COURSE_SYLLABUS} initialLesson={selectedLesson} onClose={() => setShowCourseDetail(false)} />
      </div>
    );
  }

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
          {activeTab === 'editor' && (
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
                </div>
              </div>
            </div>
          )}

          {/* Tab Main Content Card */}
          <div className={cn("w-full relative z-20 pb-8 px-4", activeTab === 'editor' ? "-mt-8" : "pt-4")}>
            <div className={cn("bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border border-neutral-border/50 min-h-[500px]", activeTab === 'editor' ? "rounded-t-[24px]" : "rounded-[24px]")}>
              
              {/* 1. 课程章节 (Course Chapters - like the screenshot) */}
              {activeTab === 'editor' && (
                <div className="animate-in fade-in duration-500">
                  {/* Top Inner Tabs */}
                  <div className="flex items-center justify-between border-b border-neutral-border px-8 pt-4">
                     <div className="flex gap-8">
                       <button onClick={() => setEditorSubTab('directory')} className={cn("pb-4 text-[15px] relative bottom-[-1px]", editorSubTab === 'directory' ? "font-bold text-[#fa541c] border-b-2 border-[#fa541c]" : "font-medium text-neutral-500 hover:text-neutral-title transition-colors border-b-2 border-transparent")}>课程目录</button>
                       <button onClick={() => setEditorSubTab('assignments')} className={cn("pb-4 text-[15px] relative bottom-[-1px]", editorSubTab === 'assignments' ? "font-bold text-[#fa541c] border-b-2 border-[#fa541c]" : "font-medium text-neutral-500 hover:text-neutral-title transition-colors border-b-2 border-transparent")}>课程作业</button>
                     </div>
                     <div className="flex items-center gap-4 pb-3">
                       <Button variant="outline" size="sm" onClick={() => setShowCreateLessonModal(true)} className="h-8 text-[#fa541c] border-[#fa541c] bg-transparent hover:bg-[#fa541c] hover:text-white rounded flex items-center gap-1.5 transition-colors">
                         <PlusCircle className="w-3.5 h-3.5" /> 新建课节
                       </Button>
                        <button 
                          onClick={() => {
                            const nextState = !allExpanded;
                            setAllExpanded(nextState);
                            const nextCollapsed: Record<number, boolean> = {};
                            COURSE_SYLLABUS.forEach((_, idx) => {
                              nextCollapsed[idx] = !nextState;
                            });
                            setCollapsedChapters(nextCollapsed);
                          }}
                          className="text-sm text-[#fa541c] flex items-center gap-1 hover:opacity-80 font-bold transition-opacity"
                        >
                          {allExpanded ? '收起' : '展开'}
                          {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>

                  {/* Chapter List Area */}
                  <div className={cn("p-6 space-y-4", editorSubTab === 'directory' ? "block" : "hidden")}>
                    {COURSE_SYLLABUS.map((chapter, i) => {
                      const isCollapsed = collapsedChapters[i];
                      return (
                        <div key={i} className="rounded-lg bg-neutral-50 border border-neutral-100 overflow-hidden">
                          <div 
                            onClick={() => setCollapsedChapters(prev => ({ ...prev, [i]: !prev[i] }))}
                            className="flex items-center justify-between px-6 py-4 bg-neutral-100/50 cursor-pointer select-none hover:bg-neutral-100/70 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-bold text-neutral-title">{chapter.chapter} {chapter.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <PlusCircle 
                                  className="w-5 h-5 cursor-pointer hover:text-[#fa541c] transition-colors" 
                                  onClick={() => setAddMenuOpenIndex(addMenuOpenIndex === i ? null : i)}
                                />
                                {addMenuOpenIndex === i && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setAddMenuOpenIndex(null)}></div>
                                    <div className="absolute right-0 top-8 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up">
                                      {[
                                        { title: '教学课件', desc: '支持图文、PPT 文档、视频等', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', action: () => {setShowTeachingMaterialModal(true); setAddMenuOpenIndex(null);} },
                                        { title: '实验课件', desc: '通过 notebook 制作实训课件', icon: Code, color: 'text-orange-500', bg: 'bg-orange-50', action: () => {setShowExperimentMaterialModal(true); setAddMenuOpenIndex(null);} },
                                        { title: '互动学习课件', desc: '知识点分段讲解视频融合实操', icon: MonitorPlay, color: 'text-blue-500', bg: 'bg-blue-50', action: () => {setShowInteractiveMaterialModal(true); setAddMenuOpenIndex(null);} }
                                      ].map((item, idx) => (
                                        <div key={idx} onClick={item.action} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors group">
                                          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", item.bg, item.color)}>
                                            <item.icon className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <div className="text-[14px] font-bold text-neutral-800 mb-0.5 group-hover:text-[#fa541c] transition-colors text-left">{item.title}</div>
                                            <div className="text-[11px] text-neutral-400 text-left">{item.desc}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical 
                                  className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setChapterMenuOpenIndex(chapterMenuOpenIndex === i ? null : i);
                                  }}
                                />
                                {chapterMenuOpenIndex === i && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setChapterMenuOpenIndex(null); }}></div>
                                    <div className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up flex flex-col gap-1">
                                      <div 
                                        className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-lg text-center transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowEditChapterModal(true);
                                          setChapterMenuOpenIndex(null);
                                        }}
                                      >编辑</div>
                                      <div 
                                        className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-lg text-center transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowDeleteChapterModal(true);
                                          setChapterMenuOpenIndex(null);
                                        }}
                                      >删除</div>
                                    </div>
                                  </>
                                )}
                              </div>
                              {isCollapsed ? <ChevronDown className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" /> : <ChevronUp className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" />}
                            </div>
                          </div>
                          {!isCollapsed && (
                            <div className="bg-white">
                              {chapter.lessons.map((lesson, idx) => (
                                <div key={idx} onClick={() => {
                                  setSelectedLesson({ title: lesson.title, type: lesson.type });
                                  setShowCourseDetail(true);
                                }} className="cursor-pointer flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50 group border-l-2 border-l-transparent hover:border-l-[#fa541c] transition-colors">
                                  <div className="flex items-center gap-6">
                                    <span className="text-[14px] text-neutral-body w-12">{lesson.section}</span>
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-6 h-6 rounded flex items-center justify-center",
                                        lesson.type === 'split_doc' ? "bg-blue-50 text-blue-500" : 
                                        lesson.type === 'experiment' ? "bg-orange-50 text-[#fa541c]" :
                                        lesson.type === 'assignment' ? "bg-rose-50 text-rose-500" :
                                        "bg-emerald-50 text-emerald-500"
                                      )}>
                                        {lesson.type === 'split_doc' ? <MonitorPlay className="w-3.5 h-3.5" /> : 
                                         lesson.type === 'experiment' ? <Code className="w-3.5 h-3.5" /> :
                                         lesson.type === 'assignment' ? <CheckSquare className="w-3.5 h-3.5" /> :
                                         <FileText className="w-3.5 h-3.5" />
                                        }
                                      </div>
                                      <span className="text-sm font-medium text-neutral-title group-hover:text-[#fa541c] transition-colors">{lesson.title}</span>
                                    </div>
                                  </div>
                                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical 
                                      className={cn(
                                        "w-4 h-4 cursor-pointer transition-all", 
                                        lessonMenuOpenIndex === `${i}-${idx}` 
                                          ? "text-[#fa541c] opacity-100 scale-110" 
                                          : "text-neutral-300 group-hover:text-neutral-500 opacity-0 group-hover:opacity-100"
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLessonMenuOpenIndex(lessonMenuOpenIndex === `${i}-${idx}` ? null : `${i}-${idx}`);
                                      }}
                                    />
                                    {lessonMenuOpenIndex === `${i}-${idx}` && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setLessonMenuOpenIndex(null); }}></div>
                                        <div className="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up flex flex-col gap-1">
                                          <div 
                                            className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-lg text-center transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedEditLesson({ chapterIndex: i, lessonIndex: idx, title: lesson.title, section: lesson.section });
                                              setShowEditLessonModal(true);
                                              setLessonMenuOpenIndex(null);
                                            }}
                                          >编辑</div>
                                          <div 
                                            className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-lg text-center transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedEditLesson({ chapterIndex: i, lessonIndex: idx, title: lesson.title, section: lesson.section });
                                              setShowDeleteLessonModal(true);
                                              setLessonMenuOpenIndex(null);
                                            }}
                                          >删除</div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Assignment List Area */}
                  <div className={cn("p-6 space-y-6", editorSubTab === 'assignments' ? "block" : "hidden")}>
                    {/* Assignment 1 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 bg-neutral-100/50 border-b border-neutral-100">
                        <h3 className="text-[16px] font-bold text-neutral-800">1. 人工智能通讯作业</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-6">
                          <FileText className="w-5 h-5 text-[#fa541c] mt-0.5" />
                          <h4 className="text-[15px] font-bold text-neutral-900">客观题</h4>
                        </div>
                        
                        <div className="pl-8 space-y-6">
                          <div>
                            <h5 className="text-[14px] font-bold text-neutral-800 mb-2">1. 客观题 18 道，共 100 分</h5>
                            <p className="text-[12px] text-neutral-400">客观题包括单选题、多选题、判断题、填空题、简答题、思考题、编程题</p>
                          </div>
                          
                          <div>
                            <h5 className="text-[14px] font-bold text-neutral-800 mb-2">2. 答题限时: 90 分钟</h5>
                            <p className="text-[12px] text-neutral-400">客观题需在 90 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</p>
                          </div>
                          
                          <Button onClick={() => navigate(`/teacher/course/${id}/assignment-preview`)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-sm shadow-orange-500/20 px-6 h-9 font-bold mt-2">
                            预览作业
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Assignment 2 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-5 bg-neutral-100/50">
                        <h3 className="text-[15px] font-bold text-neutral-700">2. 搭建 AI 聊天助手智能体作业</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                    </div>
                    
                    {/* Assignment 3 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-5 bg-neutral-100/50">
                        <h3 className="text-[15px] font-bold text-neutral-700">3. 实验报告 (理工类): 基于人工神经网络算法的图像分类实践</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 作业配置 (Assignments) */}
              {activeTab === 'assignments' && (
                <div className="p-6 lg:p-8 animate-in fade-in duration-500 bg-neutral-50/30 rounded-b-[24px]">
                  {!showGrading ? (
                    <>
                      <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-5">
                        <div>
                          <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-[#fa541c]" /> 作业任务配置与批阅
                          </h2>
                          <p className="text-[13px] text-neutral-500 mt-1">管理课程测验与作业，设置规则并进行在线批阅打分。</p>
                        </div>
                        <Button onClick={() => setShowCreateTaskModal(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-10 px-6 shadow-md shadow-orange-500/20 font-bold transition-all">
                          <Plus className="w-4 h-4 mr-2" /> 创建作业任务
                        </Button>
                      </div>

                      {/* 统计概览 Cards */}
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        {[
                          { label: '平均提交率', value: '85.2%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                          { label: '全局平均分', value: '88.5', icon: BarChart, color: 'text-blue-500', bg: 'bg-blue-50' },
                          { label: '待批改总数', value: '27', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                          { label: '延期申请', value: '3', icon: Paperclip, color: 'text-purple-500', bg: 'bg-purple-50' },
                        ].map((stat, i) => (
                          <div key={i} className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition-all">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                              <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-[12px] text-neutral-500 font-bold mb-0.5">{stat.label}</div>
                              <div className="text-xl font-black text-neutral-900 leading-tight">{stat.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Task List */}
                      <div className="space-y-5">
                        {[
                          { title: '模块 1 综合测验：Python 基础', deadline: '2026-05-20', submitCount: 45, totalCount: 50, avgScore: 88.5, toGrade: 12, rejected: 2 },
                          { title: '模块 2 实战作业：爬虫数据分析', deadline: '2026-06-05', submitCount: 15, totalCount: 50, avgScore: '-', toGrade: 15, rejected: 0 },
                        ].map((task, i) => (
                          <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-orange-200 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-[16px] font-bold text-neutral-900 group-hover:text-[#fa541c] transition-colors">{task.title}</h3>
                                      <span className="px-2 py-0.5 bg-orange-50 text-[#fa541c] text-[11px] font-bold rounded border border-orange-100">满分: 100</span>
                                      <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 text-[11px] font-bold rounded border border-neutral-200">限交 2 次</span>
                                  </div>
                                  <div className="flex items-center gap-5 text-[13px] text-neutral-500">
                                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 截止: {task.deadline}</span>
                                      <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> 提交率: {task.submitCount}/{task.totalCount} ({Math.round(task.submitCount/task.totalCount*100)}%)</span>
                                      <span className="flex items-center gap-1.5"><BarChart className="w-4 h-4 text-blue-500" /> 平均分: {task.avgScore}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button onClick={() => setShowScoringRulesModal(true)} variant="outline" className="text-neutral-600 border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 h-8 text-[13px] px-3">
                                      <Settings className="w-3.5 h-3.5 mr-1.5"/> 评分规则
                                  </Button>
                                  <Button onClick={() => setShowEditTaskModal(true)} variant="outline" className="text-neutral-600 border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 h-8 text-[13px] px-3">
                                      <Edit className="w-3.5 h-3.5 mr-1.5"/> 编辑
                                  </Button>
                                </div>
                            </div>
                            
                            <div className="bg-neutral-50/80 rounded-xl p-5 border border-neutral-100 flex items-center justify-between">
                                <div className="flex gap-8">
                                  <div className="flex flex-col">
                                    <span className="text-[12px] text-neutral-500 mb-1 font-medium">待批改</span>
                                    <span className="text-[20px] font-black text-[#fa541c]">{task.toGrade}</span>
                                  </div>
                                  <div className="w-px h-10 bg-neutral-200"></div>
                                  <div className="flex flex-col">
                                    <span className="text-[12px] text-neutral-500 mb-1 font-medium">已打回重做</span>
                                    <span className="text-[20px] font-black text-red-500">{task.rejected}</span>
                                  </div>
                                  <div className="w-px h-10 bg-neutral-200"></div>
                                  <div className="flex flex-col">
                                    <span className="text-[12px] text-neutral-500 mb-1 font-medium">已批改完成</span>
                                    <span className="text-[20px] font-black text-emerald-600">{task.submitCount - task.toGrade - task.rejected}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {task.toGrade > 0 && (
                                    <Button onClick={() => setShowGrading(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-sm shadow-orange-500/20 text-[13px] h-9 px-6 font-bold">
                                        进入批阅模式 <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                  )}
                                  {task.toGrade === 0 && (
                                    <Button variant="outline" onClick={() => setShowGrading(true)} className="border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 text-[13px] h-9 px-6 font-bold">
                                        查看批阅记录
                                    </Button>
                                  )}
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* 批阅模式 (Grading Dashboard) */
                    <div className="flex flex-col h-full animation-slide-up">
                      <div className="flex items-center justify-between mb-6 pb-5 border-b border-neutral-100">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setShowGrading(false)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-[#fa541c] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <div>
                            <h2 className="text-[18px] font-black text-neutral-900 tracking-tight">模块 1 综合测验：Python 基础</h2>
                            <p className="text-[12px] text-neutral-500 font-medium">共 50 人 · 已交 45 人 · 待批改 12 人</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="border-orange-200 text-[#fa541c] bg-orange-50 h-9 font-bold text-[13px]">
                            处理延期申请 (3)
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-1 gap-6 min-h-[600px]">
                        {/* Left: Student List */}
                        <div className="w-[280px] bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col overflow-hidden shrink-0">
                          <div className="flex items-center p-2 border-b border-neutral-100 bg-neutral-50 text-[13px] font-bold text-neutral-500">
                            <button className="flex-1 py-1.5 text-center bg-white rounded shadow-sm text-[#fa541c]">待批改(12)</button>
                            <button className="flex-1 py-1.5 text-center hover:text-neutral-700 transition-colors">已批改(31)</button>
                            <button className="flex-1 py-1.5 text-center hover:text-neutral-700 transition-colors">已打回(2)</button>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {['刘晓明', '张伟', '陈静', '王芳'].map((name, i) => (
                              <div key={i} className={cn("p-3 rounded-xl cursor-pointer transition-colors border", i === 0 ? "bg-orange-50/50 border-[#fa541c]/30" : "border-transparent hover:bg-neutral-50")}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className={cn("text-[14px] font-bold", i === 0 ? "text-[#fa541c]" : "text-neutral-800")}>{name}</span>
                                  <span className="text-[11px] text-neutral-400">10分钟前提交</span>
                                </div>
                                <div className="text-[12px] text-neutral-500">学号: 2026{1000+i}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Grading Area */}
                        <div className="flex-1 flex flex-col gap-6">
                          {/* Submission Content */}
                          <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 overflow-y-auto custom-scrollbar relative">
                            <div className="absolute top-4 right-4 flex gap-2">
                              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[12px] font-bold border border-blue-100 flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5" /> 代码查重率: 5% (安全)
                              </span>
                            </div>
                            <h3 className="text-[16px] font-bold text-neutral-900 mb-4 pb-4 border-b border-neutral-100">学生解答与附件</h3>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                <h4 className="text-[13px] font-bold text-neutral-700 mb-2">代码文件</h4>
                                <div className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg max-w-sm">
                                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Code className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-neutral-800 hover:text-[#fa541c] cursor-pointer">spider_main.py</div>
                                    <div className="text-[12px] text-neutral-400">2.4 KB</div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl relative group">
                                <h4 className="text-[13px] font-bold text-neutral-700 mb-2">在线解答</h4>
                                <div className="bg-white p-4 border border-neutral-200 rounded-lg text-[14px] text-neutral-700 font-mono leading-relaxed">
                                  # 核心解析代码实现<br/>
                                  def parse_page(html):<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;soup = BeautifulSoup(html, 'lxml')<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;items = soup.find_all('div', class_='item')<br/>
                                  <span className="bg-orange-100 border-b-2 border-[#fa541c] cursor-pointer" title="点击添加批注">&nbsp;&nbsp;&nbsp;&nbsp;# 老师批注：这里没有考虑反爬虫策略，建议加入随机 User-Agent</span><br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;...
                                </div>
                                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="outline" size="sm" className="h-8 text-[12px] bg-white shadow-sm"><Edit className="w-3.5 h-3.5 mr-1" /> 添加在线批注</Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Scoring & Action Area */}
                          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 shrink-0">
                            <div className="flex gap-8">
                              <div className="flex-1 space-y-4">
                                <div>
                                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1.5 mb-2">
                                    <Edit className="w-4 h-4 text-[#fa541c]" /> 教师评语
                                  </label>
                                  <textarea 
                                    className="w-full h-20 p-3 text-[14px] rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none" 
                                    placeholder="请输入评语，指导学生..."
                                    defaultValue="代码结构很清晰，基本逻辑正确。但在解析页面时没有考虑常见的反爬机制，建议在实际项目中加入请求头伪装。继续努力！"
                                  ></textarea>
                                </div>
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer" defaultChecked />
                                    <span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900 flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> 标记为优秀作业</span>
                                  </label>
                                </div>
                              </div>

                              <div className="w-[300px] flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                  <span className="text-[14px] font-bold text-neutral-800">最终评分 (满分 100)</span>
                                  <input type="number" className="w-20 text-center text-[24px] font-black text-[#fa541c] bg-white border border-neutral-200 rounded-lg py-1 focus:outline-none focus:border-[#fa541c]" defaultValue={92} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 font-bold h-10">打回重做</Button>
                                  <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 shadow-md shadow-orange-500/20">提交评分并继续</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. 成员管理 (Members) */}
              {activeTab === 'members' && (
                <div className="p-6 animate-in fade-in duration-500">
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
                <div className="p-6 lg:p-8 animate-in fade-in duration-500 bg-neutral-50/30 rounded-b-[24px]">
                  <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-[#fa541c]" /> 整体学情全景报告
                      </h2>
                      <p className="text-[13px] text-neutral-500 mt-1">实时统计所有选课学生的学习进度与考核数据，数据每 15 分钟刷新一次。</p>
                    </div>
                    <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-10 px-6 shadow-md shadow-orange-500/20 font-bold transition-all">
                      <Download className="w-4 h-4 mr-2" /> 导出详细数据报告
                    </Button>
                  </div>
                  
                  {/* Top Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: '视频完播率', value: '86.5', unit: '%', desc: '高于全校平均 12%', icon: MonitorPlay, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { label: '作业平均提交率', value: '92.0', unit: '%', desc: '本周新增提交 45 份', icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: '考试及格率', value: '88.3', unit: '%', desc: '期中测试统计', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
                      { label: '周活跃学生', value: '1,245', unit: '人', desc: '占总人数 78%', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map((stat, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-[13px] text-neutral-500 font-bold mb-1">{stat.label}</div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-3xl font-black text-neutral-900 tracking-tight">{stat.value}</span>
                          <span className="text-[14px] font-bold text-neutral-400">{stat.unit}</span>
                        </div>
                        <div className="text-[11px] font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded inline-block">{stat.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Trend */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 text-[15px] flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-[#fa541c]" /> 学生活跃度趋势 (近7天)
                        </h3>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#fa541c" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#fa541c" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} />
                              <CartesianGrid vertical={false} stroke="#f0f0f0" />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                              <Area type="monotone" dataKey="active" stroke="#fa541c" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Score Distribution */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 text-[15px] flex items-center gap-2">
                           <BarChart className="w-4 h-4 text-blue-500" /> 考试成绩分布
                        </h3>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChartRecharts data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={36}>
                              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} />
                              <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
                              <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                              <Bar dataKey="count" fill="#40a9ff" radius={[6, 6, 0, 0]} />
                            </BarChartRecharts>
                         </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Progress */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
                    <h3 className="font-bold text-neutral-900 text-[16px] flex items-center gap-2 mb-8 border-b border-neutral-100 pb-4">
                       <BookOpen className="w-5 h-5 text-emerald-500" /> 各章节学习进度全景
                    </h3>
                    <div className="space-y-6">
                       {[
                         { title: '第一课：人工智能训练师三级考试内容指导', progress: 95, studentCount: 1200 },
                         { title: '第二课：培训与指导', progress: 82, studentCount: 1150 },
                         { title: '第三课：数据标注核心技术与实战', progress: 68, studentCount: 980 },
                         { title: '第四课：模型部署与性能优化', progress: 45, studentCount: 850 },
                       ].map((chap, i) => (
                         <div key={i}>
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               <span className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-500 flex items-center justify-center text-[12px] font-bold">{i+1}</span>
                               <span className="text-[14px] font-bold text-neutral-800">{chap.title}</span>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className="text-[12px] text-neutral-400 font-medium">{chap.studentCount} 人已学</span>
                               <span className="text-[14px] font-black text-neutral-900 min-w-[36px] text-right">{chap.progress}%</span>
                             </div>
                           </div>
                           <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                             <div 
                               className={cn("h-full rounded-full transition-all duration-1000", chap.progress > 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : chap.progress > 50 ? "bg-gradient-to-r from-orange-400 to-[#fa541c]" : "bg-gradient-to-r from-neutral-300 to-neutral-400")}
                               style={{ width: `${chap.progress}%` }}
                             />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>

                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* 新建作业 Modal (Figure 1 Design) */}
      {(showCreateTaskModal || showEditTaskModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animation-fade-in pr-0">
          <div className="bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] w-full max-w-[600px] h-full flex flex-col animation-slide-left">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-neutral-900">新建作业</h2>
              <button onClick={() => { setShowCreateTaskModal(false); setShowEditTaskModal(false); }} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* 基础信息 */}
              <div className="space-y-6">
                <h3 className="text-[15px] font-bold text-neutral-900">基础信息</h3>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 选择试卷：</label>
                  <div className="text-[14px] flex items-center gap-3">
                    <span className={selectedPaperName ? "text-neutral-900 font-medium" : "text-neutral-400"}>
                      {selectedPaperName || "未选择"}
                    </span>
                    <span 
                      onClick={() => setShowSelectPaperModal(true)} 
                      className="text-[#fa541c] hover:text-[#e84a15] cursor-pointer font-medium"
                    >
                      {selectedPaperName ? "重新选择" : "请选择"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 作业名称：</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" placeholder="请输入" defaultValue={selectedPaperName} />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 发布时间：</label>
                  <div className="relative">
                    <input type="datetime-local" className="w-full border border-neutral-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-600" defaultValue="2026-05-21T14:29" />
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 截止时间：</label>
                  <div className="relative">
                    <input type="datetime-local" className="w-full border border-neutral-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* 分配人员 */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[15px] font-bold text-neutral-900">分配人员</h3>
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[14px] text-neutral-700 text-right mt-1"><span className="text-[#fa541c]">*</span> 分配至：</label>
                  <div className="space-y-4 text-[14px] text-neutral-700">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="assign" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" defaultChecked />
                      <span>全部学生</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="assign" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" />
                        <span>部分学生</span>
                      </label>
                      <span className="text-neutral-400">未选择</span>
                      <span className="text-[#fa541c] cursor-pointer hover:text-[#e84a15]">添加</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 通知提醒 */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[15px] font-bold text-neutral-900">通知提醒</h3>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right">站内通知：</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 bg-[#fa541c] rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                    <span className="text-[14px] text-neutral-600">推送相关学生和教师</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-white shrink-0 flex justify-end gap-3">
              <Button onClick={() => { setShowCreateTaskModal(false); setShowEditTaskModal(false); }} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-6">取消</Button>
              <Button onClick={() => { setShowCreateTaskModal(false); setShowEditTaskModal(false); }} className={cn("text-white font-bold h-9 px-6", selectedPaperName ? "bg-[#fa541c] hover:bg-[#e84a15]" : "bg-neutral-200 cursor-not-allowed")}>发布作业</Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择试卷 Modal (Figure 2 Design) */}
      {showSelectPaperModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-neutral-900">选择试卷</h2>
              <button onClick={() => setShowSelectPaperModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 pb-0 flex justify-end">
               <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-sm font-bold h-9 px-5">
                 <Plus className="w-4 h-4 mr-1.5" /> 新建试卷
               </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-[13px] text-neutral-900 font-bold bg-white">
                    <th className="py-3 px-2 w-12 text-center"></th>
                    <th className="py-3 px-2 w-[220px]">
                      <div className="flex items-center gap-1">试卷名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" /></div>
                    </th>
                    <th className="py-3 px-2">试卷描述</th>
                    <th className="py-3 px-2">题目数量</th>
                    <th className="py-3 px-2 w-[220px] relative">
                      <div className="flex items-center justify-between w-full p-1 -m-1 rounded cursor-pointer hover:bg-neutral-50 transition-colors" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                        <span>包含题型</span>
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      </div>
                      {showFilterDropdown && (
                        <>
                          <div className="fixed inset-0 z-[65]" onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(false); }}></div>
                          <div className="absolute left-0 top-10 z-[70] w-[200px] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg overflow-hidden animation-slide-up" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-neutral-100">
                              <div className="font-bold text-[13px] mb-3 text-neutral-800">搜索包含题型</div>
                              <div className="space-y-2.5">
                                {['选择全部', '单选题', '多选题', '判断题', '填空题', '简答题', '思考题', '实训题', '编程题'].map((t) => (
                                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-3.5 h-3.5 text-[#fa541c] focus:ring-[#fa541c] rounded border-neutral-300 cursor-pointer" />
                                    <span className="text-[13px] text-neutral-600 group-hover:text-neutral-900 transition-colors">{t}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="flex text-[13px]">
                              <button className="flex-1 py-2.5 text-neutral-500 hover:text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-colors">重置</button>
                              <button className="flex-1 py-2.5 text-[#fa541c] font-bold hover:bg-orange-50 transition-colors" onClick={() => setShowFilterDropdown(false)}>确认</button>
                            </div>
                          </div>
                        </>
                      )}
                    </th>
                    <th className="py-3 px-2 w-[120px]">
                       <div className="flex items-center gap-1">创建人 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '人工智能通讯课-期末考试', desc: '', count: 40, types: '单选题、填空题、多选题、简答题、判断题', creator: 'Momode l' },
                    { name: '实验报告（理工类）：基于人工神经网...', desc: '该试卷用于「Mo 体验课程」理工类作业使...', count: 1, types: '实训题', creator: '孙昕' },
                    { name: '搭建 AI 聊天助手智能体作业', desc: '该试卷用于「Mo 体验课程」作业使用', count: 1, types: '实训题', creator: '孙昕' },
                    { name: '人工智能通讯作业', desc: '用于「Mo 体验课程」的作业试卷', count: 18, types: '单选题、填空题、多选题、简答题、编程题、思考题、判断题', creator: '孙昕' },
                    { name: 'Python基础编程', desc: 'Python基础编程', count: 7, types: '编程题', creator: 'Momode l' },
                    { name: '生成式AI与大模型', desc: '面向课程生成式AI与大模型的试题', count: 30, types: '单选题、填空题、简答题、思考题、判断题', creator: 'Momode l' },
                    { name: '人工智能通讯课', desc: '面向人工智能通讯课的试题', count: 31, types: '单选题、填空题、简答题、编程题、思考题、判断题', creator: 'Momode l' }
                  ].map((paper, i) => {
                    const isExpanded = expandedPaper === paper.name;
                    return (
                    <React.Fragment key={i}>
                      <tr 
                        className={cn("border-b border-neutral-100 hover:bg-orange-50/50 cursor-pointer transition-colors", isExpanded ? "bg-orange-50/20" : "")}
                        onClick={() => setSelectedPaperName(paper.name)}
                      >
                        <td className="py-4 px-2 text-center relative">
                           <div className="flex items-center gap-3">
                             <div 
                               className="w-4 h-4 border border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded text-neutral-400 flex items-center justify-center text-[10px] bg-neutral-50 transition-colors"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setExpandedPaper(isExpanded ? null : paper.name);
                               }}
                             >
                               {isExpanded ? '-' : '+'}
                             </div>
                             <input type="radio" name="paperSelect" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" checked={selectedPaperName === paper.name} readOnly />
                           </div>
                        </td>
                        <td className="py-4 px-2 text-[14px] text-neutral-700 font-medium">{paper.name}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500 max-w-[200px] truncate">{paper.desc}</td>
                        <td className="py-4 px-2 text-[14px] text-neutral-700">{paper.count}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500 max-w-[200px] truncate">{paper.types}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500">{paper.creator}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-neutral-100 bg-neutral-50/30">
                          <td colSpan={6} className="py-6 px-12">
                            <div className="flex items-center gap-2 text-neutral-900 font-bold mb-5">
                               <FileText className="w-5 h-5 text-[#fa541c]" /> 客观题
                            </div>
                            <div className="space-y-5 pl-7">
                               <div>
                                  <div className="font-bold text-[14px] text-neutral-900 mb-2">1. 客观题 {paper.count} 道，共 100 分</div>
                                  <div className="text-[12px] text-neutral-500">{paper.types.includes('单选') ? `客观题包括${paper.types}` : `题型包括${paper.types}`}</div>
                               </div>
                               <div>
                                  <div className="font-bold text-[14px] text-neutral-900 mb-2">2. 答题限时: 3600 分钟</div>
                                  <div className="text-[12px] text-neutral-500">客观题需在 3600 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</div>
                               </div>
                               <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-sm shadow-orange-500/20 font-bold h-8 px-5 mt-2">
                                  预览客观题
                               </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-end gap-3 shrink-0">
               <Button onClick={() => setShowSelectPaperModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 h-9 px-6">取消</Button>
               <Button onClick={() => setShowSelectPaperModal(false)} className={cn("text-white h-9 px-6", selectedPaperName ? "bg-[#fa541c] hover:bg-[#e84a15]" : "bg-neutral-200 cursor-not-allowed")}>确定</Button>
            </div>
          </div>
        </div>
      )}

      {/* 评分规则 Modal */}
      {showScoringRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#fa541c]" /> 配置评分维度
              </h2>
              <button onClick={() => setShowScoringRulesModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
               <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-start gap-2 mb-2">
                 <div className="text-orange-600 mt-0.5"><Award className="w-4 h-4" /></div>
                 <p className="text-[12px] text-orange-800 leading-relaxed">设置多个评分维度，方便批阅时打分。各个维度的分值总和应等于该任务的满分（100分）。</p>
               </div>

               <div className="space-y-3">
                 {[
                   { name: '代码功能完整性', desc: '实现所有要求的功能，能正常运行', score: 40 },
                   { name: '代码规范与风格', desc: '遵守 PEP8，变量命名清晰', score: 30 },
                   { name: '算法效率优化', desc: '时间与空间复杂度达标', score: 30 },
                 ].map((rule, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xl bg-white group hover:border-[#fa541c] transition-colors relative">
                     <div className="flex-1">
                       <input type="text" className="font-bold text-[14px] text-neutral-900 bg-transparent outline-none w-full mb-1" defaultValue={rule.name} />
                       <input type="text" className="text-[12px] text-neutral-500 bg-transparent outline-none w-full" defaultValue={rule.desc} />
                     </div>
                     <div className="flex items-center gap-1 border border-neutral-200 rounded px-2 py-1 bg-neutral-50">
                       <input type="number" className="w-10 text-center font-bold text-[#fa541c] bg-transparent outline-none" defaultValue={rule.score} />
                       <span className="text-[12px] text-neutral-500 font-bold">分</span>
                     </div>
                     <button className="absolute -right-3 -top-3 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 ))}
               </div>

               <Button variant="outline" className="w-full border-dashed border-neutral-300 text-neutral-600 hover:text-[#fa541c] hover:border-orange-300 bg-neutral-50 hover:bg-orange-50 h-10">
                 <Plus className="w-4 h-4 mr-2" /> 新增评分维度
               </Button>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-white shrink-0 flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-neutral-600">当前总分：<span className="text-[#fa541c] text-[16px]">100</span> 分</span>
              <div className="flex gap-3">
                <Button onClick={() => setShowScoringRulesModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button onClick={() => setShowScoringRulesModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存规则</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建课节 Modal */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#fa541c]" /> 新建课节
              </h2>
              <button onClick={() => setShowCreateLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 课节名称
                </label>
                <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" placeholder="请输入课节名称" autoFocus />
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setShowCreateLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowCreateLessonModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">添加</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新建教学课件 Modal */}
      {showTeachingMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 新建教学课件
              </h2>
              <button onClick={() => setShowTeachingMaterialModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" placeholder="请输入教学课件名称" autoFocus />
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setShowTeachingMaterialModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowTeachingMaterialModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">添加</Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择实验课件 Modal */}
      {showExperimentMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[640px] overflow-hidden border border-neutral-200 flex flex-col h-[500px]">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div> 选择实验课件 <span className="text-[13px] text-blue-500 font-normal cursor-pointer hover:underline ml-2">帮助教程 <Info className="w-3.5 h-3.5 inline mb-0.5" /></span>
              </h2>
              <button onClick={() => setShowExperimentMaterialModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
               <div className="text-[14px] font-bold text-neutral-700">我创建的</div>
               <div className="flex items-center gap-3">
                 {isSearchingExperiment ? (
                   <div className="flex items-center border border-[#fa541c] rounded-full px-3 h-8 overflow-hidden bg-white animation-slide-left">
                     <Search className="w-3.5 h-3.5 text-[#fa541c] mr-2 shrink-0" />
                     <input type="text" className="w-32 text-[13px] outline-none text-neutral-800 placeholder-neutral-400" placeholder="搜索课件..." autoFocus onBlur={() => setIsSearchingExperiment(false)} />
                   </div>
                 ) : (
                   <div onClick={() => setIsSearchingExperiment(true)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-100 text-neutral-400 hover:text-[#fa541c] transition-colors">
                     <Search className="w-4 h-4" />
                   </div>
                 )}
                 <Button onClick={() => navigate('/teacher/course/1/experiment/new')} variant="outline" className="h-8 border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:text-[#fa541c] font-bold px-3 transition-colors">
                   <Plus className="w-3.5 h-3.5 mr-1" /> 新建
                 </Button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
               {[
                 { id: 'IL511779172854', subtitle: '人工智能' },
                 { id: 'IL511779173126', subtitle: '人工智能' }
               ].map((item, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedExperimentIndex(idx)}
                   className={cn(
                     "flex items-center justify-between p-4 border-b cursor-pointer group transition-all rounded-lg mb-1",
                     selectedExperimentIndex === idx ? "bg-orange-50 border-orange-100 shadow-[0_2px_10px_rgba(250,84,28,0.05)]" : "hover:bg-neutral-50 border-neutral-50"
                   )}
                 >
                   <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                       selectedExperimentIndex === idx ? "bg-[#fa541c] text-white" : "bg-orange-100 text-[#fa541c] group-hover:bg-[#fa541c] group-hover:text-white"
                     )}>
                       <Code className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-[15px] font-bold text-neutral-800 mb-1 group-hover:text-[#fa541c] transition-colors">{item.id}</div>
                       <div className="text-[12px] text-neutral-400 flex items-center gap-1"><Paperclip className="w-3 h-3" /> {item.subtitle}</div>
                     </div>
                   </div>
                   <div className={cn(
                     "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                     selectedExperimentIndex === idx ? "border-[#fa541c] bg-[#fa541c]" : "border-neutral-300 group-hover:border-[#fa541c]"
                   )}>
                     {selectedExperimentIndex === idx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
              <div className="text-[13px] text-neutral-500">已选 <span className="text-[#fa541c] font-bold">{selectedExperimentIndex !== null ? 1 : 0}</span> 项</div>
              <div className="flex gap-3">
                <Button onClick={() => setShowExperimentMaterialModal(false)} variant="outline" className="border-neutral-200 text-[#fa541c] font-bold h-9 px-6 hover:bg-orange-50 hover:text-[#fa541c]">取消</Button>
                <Button onClick={() => setShowExperimentMaterialModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-8 shadow-sm shadow-orange-500/20">确认</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建互动学习课件 Modal */}
      {showInteractiveMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 新建互动学习课件
              </h2>
              <button onClick={() => setShowInteractiveMaterialModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" placeholder="请输入课件名称" autoFocus />
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setShowInteractiveMaterialModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowInteractiveMaterialModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">添加</Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择随堂作业 Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[640px] overflow-hidden border border-neutral-200 flex flex-col h-[560px]">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div> 选择随堂作业
              </h2>
              <button onClick={() => setShowAssignmentModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 border-b border-neutral-100 flex items-center justify-between">
               <div className="flex items-center gap-8">
                 <div className="py-3 text-[14px] font-bold text-[#fa541c] border-b-2 border-[#fa541c] cursor-pointer">个人</div>
                 <div className="py-3 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer border-b-2 border-transparent transition-colors">公开</div>
               </div>
               <Search className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors" />
            </div>

            <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
               <div className="text-[13px] text-neutral-500">列表</div>
               <Button variant="outline" className="h-8 border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:text-[#fa541c] font-bold px-3 transition-colors">
                 <Plus className="w-3.5 h-3.5 mr-1" /> 新建
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
               {[
                 { title: '大模型应用测验', subtitle: '用于「Mo 体验课程」大模型应用测验试卷' },
                 { title: 'Python编程测验', subtitle: '用于「Mo 体验课程」的Python编程测验试卷' },
                 { title: 'AI 通识第一课测验', subtitle: '用于「Mo 体验课程」的“AI 通识第一课”章节测验试卷' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 hover:bg-neutral-50 border-b border-neutral-50 cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                       <FileText className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-[15px] font-bold text-neutral-800 mb-1">{item.title}</div>
                       <div className="text-[12px] text-neutral-400">{item.subtitle}</div>
                     </div>
                   </div>
                   <div className="w-4 h-4 rounded-full border border-neutral-300 group-hover:border-[#fa541c] shrink-0 ml-4 transition-colors"></div>
                 </div>
               ))}
            </div>

            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
              <div className="text-[13px] text-neutral-500">已选 <span className="text-[#fa541c] font-bold">0</span> 项</div>
              <div className="flex gap-3">
                <Button onClick={() => setShowAssignmentModal(false)} variant="outline" className="border-neutral-200 text-[#fa541c] font-bold h-9 px-6 hover:bg-orange-50 hover:text-[#fa541c]">取消</Button>
                <Button onClick={() => setShowAssignmentModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-8 shadow-sm shadow-orange-500/20">确认</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑章节 Modal */}
      {showEditChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 编辑章节
              </h2>
              <button onClick={() => setShowEditChapterModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" defaultValue="第一课" autoFocus />
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setShowEditChapterModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowEditChapterModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存</Button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 Modal */}
      {showDeleteChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col">
            <div className="p-6 flex items-start gap-4">
              <div className="w-1 h-5 bg-[#fa541c] rounded-full mt-1 shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-neutral-900">删除确认</h2>
                  <button onClick={() => setShowDeleteChapterModal(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[14px] text-neutral-600 mb-4">
                  确定要删除这个章吗？删除后将无法恢复
                </p>
                <p className="text-[14px] text-[#fa541c] font-medium mb-6">
                  若该目录下存在子目录或学生学习数据将一并删除
                </p>
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setShowDeleteChapterModal(false)} variant="outline" className="border-neutral-200 text-[#fa541c] font-bold h-9 px-6 hover:bg-orange-50 hover:text-[#fa541c] hover:border-orange-200">取消</Button>
                  <Button onClick={() => setShowDeleteChapterModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 shadow-sm">确定</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑课时 Modal */}
      {showEditLessonModal && selectedEditLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                 编辑课时
              </h2>
              <button onClick={() => setShowEditLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                  defaultValue={selectedEditLesson.title} 
                  autoFocus 
                />
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setShowEditLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowEditLessonModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存</Button>
            </div>
          </div>
        </div>
      )}

      {/* 删除课时确认 Modal */}
      {showDeleteLessonModal && selectedEditLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col">
            <div className="p-6 flex items-start gap-4">
              <div className="w-1 h-5 bg-[#fa541c] rounded-full mt-1 shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-neutral-900">删除课时确认</h2>
                  <button onClick={() => setShowDeleteLessonModal(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[14px] text-neutral-600 mb-4">
                  确定要删除 <strong>{selectedEditLesson.section} {selectedEditLesson.title}</strong> 吗？删除后将无法恢复。
                </p>
                <p className="text-[14px] text-[#fa541c] font-medium mb-6">
                  该课时关联的学习数据与学生记录将一并删除。
                </p>
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setShowDeleteLessonModal(false)} variant="outline" className="border-neutral-200 text-[#fa541c] font-bold h-9 px-6 hover:bg-orange-50 hover:text-[#fa541c] hover:border-orange-200">取消</Button>
                  <Button onClick={() => setShowDeleteLessonModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 shadow-sm">确定</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Add MonitorPlay import at the top
