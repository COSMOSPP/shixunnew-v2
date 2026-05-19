import React, { useState } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, CheckCircle2, X, Map, Clock, FileText, Code, CheckSquare, ChevronDown, List, Search, Check, BarChart, Save, Plus, Play, Square, RotateCcw, Layers, Cpu, Database, Activity, HardDrive, Download, Eye, FileDigit, BookOpen, Monitor, PlusCircle, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CourseDetailProps {
  onBack: () => void;
  onShowLearningPath?: () => void;
  initialLesson?: { title: string, type: string } | null;
  isTeacher?: boolean;
}

const COURSE_SYLLABUS = [
  {
    chapter: "第一课",
    title: "人工智能训练师三级考试内容指导",
    duration: 98,
    videos: 5,
    docs: 0,
    experiments: 0,
    assignments: 1,
    description: "",
    lessons: [
      { section: "课时1:", title: "职业简介", locked: false, status: "已完成", type: "doc" },
      { section: "课时2:", title: "认定方案", locked: false, status: "未学习", type: "doc" },
      { section: "课时3:", title: "认定要素细目表", locked: false, status: "未学习", type: "doc" },
      { section: "课时4:", title: "实操平台演示", locked: false, status: "未学习", type: "video" },
      { section: "课时5:", title: "代码复习讲义", locked: false, status: "未学习", type: "doc" },
      { section: "课时6:", title: "第一课随堂作业", locked: false, status: "未学习", type: "assignment" }
    ]
  },
  {
    chapter: "第二课",
    title: "培训与指导",
    duration: 245,
    videos: 0,
    docs: 1,
    experiments: 9,
    assignments: 0,
    description: "",
    lessons: [
      { section: "课时1:", title: "智能音箱产品的数据分析与优化[3.1.1]", locked: false, status: "未学习", type: "experiment" },
      { section: "课时2:", title: "智能照明系统的数据分析与优化[3.1.2]", locked: false, status: "未学习", type: "split_doc" },
      { section: "课时3:", title: "智能健康手环的数据分析与优化[3.1.3]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时4:", title: "智能健康监测系统的数据分析与优化[3.1.4]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时5:", title: "智能家居环境控制系统的数据分析与优化[3.1.5]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时6:", title: "图像识别评估系统交互流程设计[3.2.1]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时7:", title: "手写数字识别系统交互流程设计[3.2.2]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时8:", title: "面部表情识别系统交互流程设计[3.2.3]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时9:", title: "花朵智能识别系统交互流程设计[3.2.4]", locked: true, status: "未学习", type: "experiment" },
      { section: "课时10:", title: "人脸AI智能检测系统交互流程设计[3.2.5]", locked: true, status: "未学习", type: "experiment" }
    ]
  }
];

export default function CourseDetail({ onBack, onShowLearningPath, initialLesson, isTeacher }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('intro');
  const [playingLesson, setPlayingLesson] = useState<{title: string, type: string} | null>(initialLesson || null);
  const [isExperimentStarted, setIsExperimentStarted] = useState(false);
  const [activeExperimentTab, setActiveExperimentTab] = useState('course');
  const [teacherActionMode, setTeacherActionMode] = useState<'detail' | 'preview' | 'edit'>('detail');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [datasetTab, setDatasetTab] = useState('public');
  const [importedDatasets, setImportedDatasets] = useState<string[]>([]);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const isRecommendedMode = (window as any).__RECOMMENDED_MODE === true;

  const handleCloseLesson = () => {
    setTeacherActionMode('detail');
    if (initialLesson) {
      onBack();
    } else {
      setPlayingLesson(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f5f5] flex flex-col font-sans -mx-6 -mt-6 -mb-6">
      {/* Header Section */}
      <div className="relative pt-8 pb-12 px-14">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/pythoncourse/1920/400" 
            alt="Course Banner" 
            className="w-full h-full object-cover opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e8]/95 to-[#ffd8bf]/90"></div>
          
          {/* Decorative background elements */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="absolute right-32 top-1/2 -translate-y-1/2 pointer-events-none z-0">
            {/* Abstract illustration placeholder */}
            <div className="w-64 h-48 bg-gradient-to-br from-[#fa541c]/20 to-[#ff9c6e]/20 rounded-xl backdrop-blur-sm border border-white/50 shadow-xl flex items-center justify-center transform rotate-3">
              <div className="w-32 h-32 bg-white/60 rounded-lg shadow-inner flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-[#fa541c]/60" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-[13px] text-neutral-caption">
              <button onClick={onBack} className="hover:text-[#fa541c] flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> 返回
              </button>
              <span className="mx-2">/</span>
              <span className="hover:text-[#fa541c] cursor-pointer">课程</span>
              <span className="mx-2">/</span>
              <span className="hover:text-[#fa541c] cursor-pointer">Python 系列课程</span>
              <span className="mx-2">/</span>
              <span className="text-neutral-title">Python 基础</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white text-[13px] text-neutral-title transition-colors">
                <Star className="w-4 h-4" /> 收藏
              </button>
            </div>
          </div>

          {/* Title & Meta */}
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-neutral-title mb-6">Python 基础</h1>
            
            {/* Teacher Intro */}
            <div className="flex items-center gap-4 mb-6 mt-[-10px]">
              <img src="https://picsum.photos/seed/teacher/48/48" className="w-10 h-10 rounded-full border-2 border-[#fff2e8]" alt="Teacher" />
              <div>
                <div className="text-[14px] font-bold text-neutral-title flex items-center gap-2">
                  李老师
                  <span className="text-[10px] font-normal px-1.5 py-0.5 bg-[#fa541c]/10 text-[#fa541c] rounded-full border border-[#fa541c]/20">资深讲师</span>
                </div>
                <div className="text-[12px] text-neutral-body mt-0.5">曾在大厂主导架构研发，10年丰富教学实战经验，授课风格通俗易懂</div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-[14px] text-neutral-body mb-8">
              <div>适合人群 <span className="font-medium text-neutral-title ml-2">零基础</span></div>
              <div>教学模式 <span className="font-medium text-neutral-title ml-2">Mo-Lab</span></div>
              <div>课程学时 <span className="font-medium text-neutral-title ml-2">5 章节 | 5 课节 | 180 分钟</span></div>
            </div>

            {/* Rating & Enrollment */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-[#faad14]">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-bold">1.2w</span>
                <span className="text-[13px] font-medium text-neutral-title ml-0.5">人收藏</span>
              </div>
              <div className="w-px h-6 bg-neutral-border"></div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://picsum.photos/seed/u1/32/32" className="w-8 h-8 rounded-full border-2 border-[#fff2e8]" alt="User" />
                  <img src="https://picsum.photos/seed/u2/32/32" className="w-8 h-8 rounded-full border-2 border-[#fff2e8]" alt="User" />
                  <img src="https://picsum.photos/seed/u3/32/32" className="w-8 h-8 rounded-full border-2 border-[#fff2e8]" alt="User" />
                </div>
                <span className="text-[14px] text-neutral-body"><span className="text-[#fa541c] font-medium">9246</span> 人加入学习</span>
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
          <div className="bg-white rounded-[12px] shadow-sm p-1 flex items-center gap-2 mb-6">
            {[
              { id: 'intro', label: '课程介绍' },
              { id: 'syllabus', label: '课程目录' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-[8px] text-[15px] font-medium transition-all relative flex items-center gap-2",
                  activeTab === tab.id ? "text-[#fa541c] bg-[#fff2e8]" : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Intro Section */}
          {activeTab === 'intro' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[16px] shadow-sm p-8">
              <h2 className="text-lg font-bold text-neutral-title mb-4">课程介绍</h2>
              <p className="text-[14px] text-neutral-body leading-relaxed mb-6">
                本课程包含了基础数据类型、字符串及其操作、列表和元组等章节，介绍了 Python 的基础知识，通过理论介绍和代码实操，你可以掌握基本的 Python 语法和流程控制，后续推荐继续学习《Python 进阶》课程。
              </p>
              <div className="bg-[#fafafa] rounded-[12px] p-6 grid grid-cols-2 gap-4">
                {[
                  "掌握 Python 数据类型",
                  "学习基础 Python 知识",
                  "撰写简单逻辑代码",
                  "开发基础 Python 应用"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] text-neutral-title">
                    <div className="w-6 h-6 rounded-full bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Syllabus Section */}
          {activeTab === 'syllabus' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[16px] shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-title">课程目录</h2>
                <Button 
                  className="bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe4d3] border border-[#ffbb96] shadow-sm h-8 px-4 text-[13px] flex items-center gap-1.5"
                  onClick={() => setShowReportModal(true)}
                >
                  <span className="text-[14px]">✨</span> 生成个性化学习报告
                </Button>
              </div>
            <div className="space-y-6">
              {COURSE_SYLLABUS.map((chapter, i) => (
                <div key={i} className="flex flex-col">
                  {/* Chapter Header */}
                  <div className="flex items-center justify-between bg-[#f5f6f8] px-6 py-4 rounded-[8px]">
                    <div className="flex items-center gap-4">
                      <span className="text-[16px] font-bold text-neutral-title">{chapter.chapter}</span>
                      <span className="text-[16px] font-bold text-neutral-title">{chapter.title}</span>
                    </div>
                    <div className="flex items-center gap-6 text-[14px] text-neutral-body">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-neutral-caption" />
                        <span>预计学习 <span className="font-bold text-neutral-title">{chapter.duration}</span> 分钟</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.videos}</span> 个教学课件</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.docs}</span> 个实验课件</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.experiments}</span> 个互动学习课件</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.assignments}</span> 个随堂作业</span>
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2 text-neutral-caption" />
                    </div>
                  </div>
                  
                  {/* Chapter Content */}
                  <div className="pt-4 pb-2 px-6">
                    {chapter.description && (
                      <p className="text-[14px] text-neutral-body mb-4">{chapter.description}</p>
                    )}
                    <div className="space-y-1">
                      {chapter.lessons.map((lesson, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "flex items-center justify-between py-3 px-2 rounded-[6px] transition-colors group",
                            lesson.locked ? "opacity-60 cursor-not-allowed" : "hover:bg-[#f5f6f8] cursor-pointer"
                          )}
                          onClick={() => {
                            if (!lesson.locked) {
                              setPlayingLesson({ title: lesson.title, type: lesson.type });
                              setIsExperimentStarted(false);
                              setTeacherActionMode('detail');
                            }
                          }}
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-[14px] text-neutral-body w-12">{lesson.section}</span>
                            <div className="flex items-center gap-3">
                              {/* Progress Marker */}
                              {lesson.status === '已完成' ? (
                                 <CheckCircle2 className="w-4 h-4 text-[#52c41a]" />
                              ) : lesson.status === '学习中' ? (
                                 <div className="w-4 h-4 rounded-full border-2 border-[#fa541c] border-t-transparent animate-spin"></div>
                              ) : (
                                 <div className="w-4 h-4 rounded-full border-2 border-neutral-300"></div>
                              )}
                              {lesson.type === 'video' && <BookOpen className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'doc' && <BookOpen className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'split_doc' && <Monitor className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'experiment' && <Code className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'assignment' && <CheckSquare className="w-4 h-4 text-neutral-400" />}
                              <span className={cn(
                                "text-[14px] transition-colors",
                                lesson.locked ? "text-neutral-body" : "text-neutral-title group-hover:text-[#fa541c]"
                              )}>
                                {lesson.title}
                              </span>
                              {lesson.locked && <Lock className="w-3.5 h-3.5 text-neutral-caption" />}
                              {lesson.tag && (
                                <span className="px-2 py-0.5 rounded-full border border-[#52c41a] text-[#52c41a] text-[12px]">
                                  {lesson.tag}
                                </span>
                              )}
                            </div>
                          </div>
                          {lesson.status === '未学习' && !lesson.locked ? (
                            <div className="flex items-center justify-end w-20">
                              <span className="text-[14px] text-neutral-caption group-hover:hidden">未学习</span>
                              <span className="text-[14px] text-[#fa541c] font-bold hidden group-hover:block transition-all">开始学习</span>
                            </div>
                          ) : (
                            <span className={cn("text-[14px] w-20 text-right", lesson.status === '已完成' ? "text-[#52c41a]" : "text-neutral-caption")}>
                              {lesson.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {playingLesson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Assignment Edit UI */}
          {teacherActionMode === 'edit' && playingLesson.type === 'assignment' && (
            <div className="w-full h-full bg-[#f5f6f8] relative flex flex-col font-sans animation-fade-in">
              <div className="h-14 border-b border-neutral-200 bg-white flex items-center px-6 shrink-0 justify-between">
                 <div className="flex items-center gap-3">
                   <button onClick={() => setTeacherActionMode('detail')} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-[#fa541c] transition-colors">
                     <ArrowLeft className="w-5 h-5" />
                   </button>
                   <span className="text-[14px] text-neutral-400">题库管理 / <span className="text-neutral-900 font-bold">试卷管理</span></span>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                 <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-neutral-200 p-6 min-h-[600px]">
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-4">
                       <h2 className="text-[18px] font-bold text-neutral-900">试卷管理</h2>
                       <span className="text-[13px] text-neutral-400">新建试卷前请先创建可用试题，试卷“启用”后即可用于课程作业或章节测验</span>
                     </div>
                     <Button className="bg-[#2f54eb] hover:bg-[#1d39c4] text-white h-8 px-4 rounded shadow-sm shadow-blue-500/20 text-[13px] font-medium flex items-center gap-1.5 transition-colors">
                       <Plus className="w-3.5 h-3.5" /> 新建试卷
                     </Button>
                   </div>
                   
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse border border-neutral-200 rounded-lg overflow-hidden">
                       <thead>
                         <tr className="bg-neutral-50/80 text-[13px] text-neutral-600 font-medium border-b border-neutral-200">
                           <th className="py-4 px-4 font-bold border-r border-neutral-200">试卷名称</th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 w-64">试卷说明</th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200">题目数量</th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 cursor-pointer hover:text-neutral-900">包含题型 <ChevronDown className="w-3.5 h-3.5 inline ml-1" /></th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 cursor-pointer hover:text-neutral-900">试卷类型 <ChevronDown className="w-3.5 h-3.5 inline ml-1" /></th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 cursor-pointer hover:text-neutral-900">状态 <ChevronDown className="w-3.5 h-3.5 inline ml-1" /></th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 cursor-pointer hover:text-neutral-900">创建人 <Search className="w-3.5 h-3.5 inline ml-1" /></th>
                           <th className="py-4 px-4 font-bold border-r border-neutral-200 cursor-pointer hover:text-neutral-900">更新时间 <ChevronDown className="w-3.5 h-3.5 inline ml-1" /></th>
                           <th className="py-4 px-4 font-bold">操作</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr className="border-b border-neutral-200 hover:bg-blue-50/30 transition-colors">
                           <td className="py-4 px-4 border-r border-neutral-200">
                             <div className="flex items-center gap-3">
                               <div className="w-5 h-5 rounded border border-blue-400 flex items-center justify-center text-blue-500 bg-blue-50 text-[16px] font-bold cursor-pointer transition-colors">-</div>
                               <span className="text-[14px] font-bold text-neutral-800">大模型应用测验</span>
                               <Search className="w-3.5 h-3.5 text-blue-500 cursor-pointer ml-auto hover:text-blue-700 transition-colors" />
                             </div>
                           </td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[13px] text-neutral-600 leading-relaxed">用于「Mo 体验课程」大模型应用测验试卷</td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[14px] text-neutral-800">10</td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[13px] text-neutral-600">单选题、填空题、多选题、编程题、判断题</td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[14px] text-neutral-800">测验</td>
                           <td className="py-4 px-4 border-r border-neutral-200">
                             <span className="px-2 py-0.5 rounded border border-[#52c41a] text-[#52c41a] text-[12px]">启用</span>
                           </td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[14px] text-neutral-800">孙昕</td>
                           <td className="py-4 px-4 border-r border-neutral-200 text-[13px] text-neutral-500">2026/02/11 12:07</td>
                           <td className="py-4 px-4 text-[13px]">
                             <button className="text-blue-600 hover:text-blue-800 mr-3 transition-colors">编辑</button>
                             <button className="text-blue-600 hover:text-blue-800 transition-colors">删除</button>
                           </td>
                         </tr>
                         {/* Details expanded view */}
                         <tr className="bg-neutral-50/50">
                           <td colSpan={9} className="p-8">
                             <div className="max-w-4xl">
                               <h3 className="flex items-center gap-2 text-[15px] font-bold text-neutral-800 mb-6">
                                 <FileText className="w-4 h-4 text-blue-600" /> 客观题
                               </h3>
                               <div className="space-y-6 pl-6">
                                 <div>
                                   <div className="font-bold text-[14px] text-neutral-800 mb-2">1. 客观题 10 道，共 100 分</div>
                                   <div className="text-[12px] text-neutral-400">客观题包括单选题、多选题、判断题、填空题、编程题</div>
                                 </div>
                                 <div>
                                   <div className="font-bold text-[14px] text-neutral-800 mb-2">2. 答题限时： 分钟</div>
                                   <div className="text-[12px] text-neutral-400">客观题需在 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</div>
                                 </div>
                                 <Button className="mt-4 bg-[#2f54eb] hover:bg-[#1d39c4] text-white h-9 px-6 rounded text-[13px] font-medium transition-colors">
                                   预览客观题
                                 </Button>
                               </div>
                             </div>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                     
                     <div className="flex items-center justify-end mt-6 text-[13px] text-neutral-500 gap-4">
                       <span>共 1 条</span>
                       <div className="flex items-center gap-1">
                         <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded text-neutral-300 cursor-not-allowed">
                           <ChevronLeft className="w-4 h-4" />
                         </button>
                         <button className="w-8 h-8 flex items-center justify-center border border-[#2f54eb] rounded bg-[#2f54eb] text-white">
                           1
                         </button>
                         <button className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded text-neutral-300 cursor-not-allowed">
                           <ChevronRight className="w-4 h-4" />
                         </button>
                       </div>
                       <div className="flex items-center gap-1 border border-neutral-200 rounded px-2 h-8 cursor-pointer hover:border-blue-400 transition-colors">
                         <span>10 条/页</span>
                         <ChevronDown className="w-3.5 h-3.5" />
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* Standard Lesson View */}
          {(teacherActionMode !== 'edit' && (['doc', 'video', 'assignment', 'split_doc'].includes(playingLesson.type) || (playingLesson.type === 'experiment' && !isExperimentStarted))) && (
            <div className="w-full h-full bg-white relative flex font-sans">
              {/* Left Sidebar */}
              <div className="w-80 border-r border-neutral-border flex flex-col bg-[#fafafa]">
                {/* Header */}
                {isTeacher && teacherActionMode !== 'preview' ? (
                  <div className="p-4 flex flex-col gap-4 border-b border-neutral-border">
                    <div 
                      className="flex items-center gap-1 text-[15px] font-medium text-neutral-title cursor-pointer hover:text-[#fa541c] w-fit"
                      onClick={handleCloseLesson}
                    >
                      <ChevronLeft className="w-4 h-4" /> 人工智能基础与实践
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#fa541c] rounded-sm flex items-center justify-center text-white text-[10px]">
                          <BookOpen className="w-2.5 h-2.5" />
                        </div>
                        <h2 className="text-[14px] font-bold text-neutral-title">课程目录</h2>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8] flex items-center gap-1 text-xs shadow-sm">
                        <PlusCircle className="w-3.5 h-3.5" /> 新建章
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-4 border-b border-neutral-border">
                    <div 
                      className="flex items-center gap-1 text-[13px] text-neutral-body cursor-pointer hover:text-neutral-title w-fit"
                      onClick={() => {
                        if (teacherActionMode === 'preview') {
                          setTeacherActionMode('detail');
                        } else {
                          handleCloseLesson();
                        }
                      }}
                    >
                        <ChevronLeft className="w-4 h-4" /> 返回
                      </div>
                      <div>
                        <h2 className="text-[16px] font-bold text-neutral-title mb-2">人工智能训练师三级考试</h2>
                        <div className="flex items-center justify-between text-[12px] text-neutral-caption mb-1.5">
                          <span className="truncate pr-2">当前学习：{playingLesson.title}</span>
                          <span className="shrink-0">3.4%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#fa541c] w-[3.4%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Syllabus List */}
                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                  {COURSE_SYLLABUS.map((chapter, i) => (
                    <div key={i} className="mb-4">
                      <div className="px-4 py-2 flex items-center gap-2">
                        <span className="font-bold text-neutral-title text-[14px]">{i + 1} {chapter.title}</span>
                      </div>
                      <div className="flex flex-col">
                        {chapter.lessons.map((lesson, idx) => {
                          const isActive = lesson.title === playingLesson.title;
                          return (
                            <div 
                              key={idx} 
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-r-2",
                                isActive ? "bg-[#fff2e8] text-[#fa541c] border-[#fa541c]" : "text-neutral-body hover:bg-neutral-100 border-transparent",
                                lesson.locked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                              )}
                              onClick={() => {
                                if (!lesson.locked) {
                                  setPlayingLesson({ title: lesson.title, type: lesson.type });
                                  setIsExperimentStarted(false);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 w-full pr-4">
                                <span className={cn("shrink-0", isActive ? "text-[#fa541c] font-medium" : "text-neutral-body")}>{i + 1}-{idx + 1}</span>
                                <span className={cn("truncate", isActive ? "font-medium" : "")}>{lesson.title}</span>
                              </div>
                              {lesson.locked ? (
                                <Lock className="w-3.5 h-3.5 shrink-0 text-neutral-caption" />
                              ) : (
                                <div className={cn("w-3.5 h-3.5 shrink-0 rounded-full border border-neutral-300", isActive && "border-[#fa541c] border-2")}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column (Course Summary List) */}
              {isTeacher && teacherActionMode !== 'preview' && (
                <div className="w-64 border-r border-neutral-border flex flex-col bg-white shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
                  <div className="p-4 border-b border-neutral-border bg-neutral-50/50">
                    <h3 className="font-bold text-neutral-title text-[15px]">{playingLesson.title}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    <div className="flex flex-col">
                      <div className="px-4 py-3.5 text-[13px] bg-[#fff2e8] text-[#fa541c] border-l-[3px] border-[#fa541c] cursor-pointer font-medium hover:bg-[#ffe4d3] transition-colors">
                        1.1 我们为什么要学 AI
                      </div>
                      <div className="px-4 py-3.5 text-[13px] text-neutral-body hover:bg-neutral-50 hover:text-neutral-title cursor-pointer border-l-[3px] border-transparent transition-colors">
                        2.1 什么是 AI
                      </div>
                      <div className="px-4 py-3.5 text-[13px] text-neutral-body hover:bg-neutral-50 hover:text-neutral-title cursor-pointer border-l-[3px] border-transparent transition-colors">
                        3.1 大模型的出现
                      </div>
                      <div className="px-4 py-3.5 text-[13px] text-neutral-body hover:bg-neutral-50 hover:text-neutral-title cursor-pointer border-l-[3px] border-transparent transition-colors">
                        4.1 AI 是怎么学习的
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Center Content Area */}
              <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                {isTeacher && teacherActionMode === 'detail' && (
                  <div className="h-14 border-b border-neutral-border flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-20">
                    <div className="flex items-center gap-2 text-neutral-title font-medium">
                      {playingLesson.title}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="h-8 px-4 text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8] flex items-center gap-1.5 shadow-sm rounded-md" onClick={() => setTeacherActionMode('preview')}>
                        <Eye className="w-3.5 h-3.5" /> 预览
                      </Button>
                      <Button className="h-8 px-4 bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm rounded-md" onClick={() => setTeacherActionMode('edit')}>
                        <Edit className="w-3.5 h-3.5" /> 编辑
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto flex justify-center py-12 custom-scrollbar relative">
                {playingLesson.type === 'doc' && (
                  <div className="w-full max-w-4xl px-8 relative">
                    <h1 className="text-3xl font-bold text-neutral-title mb-8 text-center pb-6 border-b border-neutral-border w-[80%] mx-auto">{playingLesson.title}</h1>
                    
                    <div className="text-[15px] text-neutral-body leading-loose space-y-6">
                      <p>
                        搜索算法从初始节点出发，不断选择后续节点，完成了搜索树的构造。
                      </p>
                      <p>
                        一开始，搜索树中只有根节点，在每一步中搜索算法将选择与搜索树中某个节点相邻的一个后续节点加入搜索树，这个操作叫做扩展一个节点。
                      </p>
                      <p>
                        能够扩展的节点需满足条件：
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>该节点不能已经在搜索树中，即该节点不能已经被扩展过；</li>
                        <li>该节点能够从搜索树中某个节点出发通过执行一个动作抵达。被扩展节点和搜索树节点的某个节点是相邻的。</li>
                      </ul>
                      <p>
                        这些能够被扩展的节点构成的集合称为未访问节点集合。
                      </p>
                      <p>
                        于是，搜索算法的每一步操作可以做如下描述：
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>每次选择未访问节点集合中的一个节点加入当前搜索树。</li>
                        <li>检查这个节点所有后续相邻节点。</li>
                        <li>将满足条件的节点加入未访问节点集合中。</li>
                        <li>重复执行上述操作，直至被扩展的节点对应一条从初始节点到终止结点的路径。</li>
                      </ul>

                      <div>
                        <h2 className="text-xl font-bold text-neutral-title mt-8 mb-4">根据以上内容，我们可以按照下面的步骤来实现深度优先搜索算法。</h2>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>定义已访问的路径的列表 S</li>
                          <li>定义一个待访问的路径的列表 Q</li>
                          <li>把初始起点放进列表 Q 中</li>
                          <li>如果还有待访问的路径，则
                            <ol className="list-[upper-alpha] pl-6 mt-2 space-y-2 text-neutral-body">
                              <li>从列表 Q 中拿取最后一个元素，也就是一个尚未访问的路径，记作 this_path</li>
                              <li>将此路径加入已访问的路径 S 中</li>
                              <li>如果此路径的末尾点是目标点，则说明找到了目标点，可继续进行下一循环</li>
                              <li>对路径末尾点的每一个相邻点，如果该相邻点不在路径中（即不存在回路），则将其连接到 this_path 后，作为新的待访问路径添加到 Q 中</li>
                            </ol>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-neutral-50 p-4 border-l-4 border-[#fa541c] rounded mt-12">
                         <p className="text-sm text-neutral-caption m-0">注：本文档为《{playingLesson.title}》的官方配套讲义资料，未经许可严禁外传。</p>
                      </div>
                    </div>
                  </div>
                )}
                {playingLesson.type === 'split_doc' && (
                  <div className="w-full h-full flex bg-white absolute inset-0">
                    {/* Left half: Document */}
                    <div className="flex-1 border-r border-neutral-border p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
                       <div className="w-full max-w-3xl">
                         <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-2">
                           <div className="flex gap-2 text-neutral-400 font-serif items-center text-sm">
                             <span className="font-bold hover:bg-neutral-100 px-1 rounded cursor-pointer">H</span>
                             <span className="font-bold italic hover:bg-neutral-100 px-1 rounded cursor-pointer">B</span>
                             <span className="italic hover:bg-neutral-100 px-1 rounded cursor-pointer">I</span>
                             <span className="line-through hover:bg-neutral-100 px-1 rounded cursor-pointer">S</span>
                             <span className="text-xs hover:bg-neutral-100 px-1 rounded cursor-pointer ml-1">🔗</span>
                             <span className="mx-1 h-3 w-px bg-neutral-300"></span>
                             <List className="w-3.5 h-3.5 hover:text-neutral-600 cursor-pointer" />
                             <CheckSquare className="w-3.5 h-3.5 hover:text-neutral-600 cursor-pointer" />
                             <span className="mx-1 h-3 w-px bg-neutral-300"></span>
                             <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium cursor-pointer flex items-center gap-1">
                               <div className="w-3 h-2 bg-blue-600 rounded-full"></div> AI 备课
                             </span>
                           </div>
                         </div>
                         <h1 className="text-3xl font-bold text-neutral-title mb-8">第1课：数字图像基本概念</h1>
                         
                         <h2 className="text-xl font-bold text-neutral-title mb-4 flex items-center gap-2">
                           <Layers className="w-5 h-5 text-blue-500" /> 学习目标
                         </h2>
                         <div className="bg-white mb-10">
                           <p className="text-[14px] text-neutral-body mb-3">学完本课后，你将能够：</p>
                           <ul className="space-y-2">
                             <li className="flex items-start gap-2 text-[14px] text-neutral-title"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> 理解什么是像素，以及像素与图像的关系</li>
                             <li className="flex items-start gap-2 text-[14px] text-neutral-title"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> 掌握图像分辨率的含义</li>
                             <li className="flex items-start gap-2 text-[14px] text-neutral-title"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> 理解RGB颜色模式的原理</li>
                             <li className="flex items-start gap-2 text-[14px] text-neutral-title"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" /> 使用Python读取和分析图像的像素信息</li>
                           </ul>
                         </div>

                         <h2 className="text-xl font-bold text-neutral-title mb-6">1. 图片的本质：数字的集合</h2>
                         <h3 className="text-[16px] font-bold text-neutral-title mb-3">1.1 图像在计算机中是什么？</h3>
                         <p className="text-[14px] text-neutral-body leading-loose mb-4">
                           我们每天用手机拍照、看电脑屏幕，这些彩色的、栩栩如生的图片，在计算机里究竟是什么样子呢？
                         </p>
                         <p className="text-[14px] text-neutral-body leading-loose mb-4">
                           答案是：<span className="font-bold">一串串数字！</span>
                         </p>
                         <p className="text-[14px] text-neutral-body leading-loose mb-8">
                           计算机不能直接"看"图片，它只能理解数字。所以，所有的图片都被转换成了数字的形式存储和处理。
                         </p>
                       </div>
                    </div>

                    {/* Right half: Workspace */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                       <div className="h-12 border-b border-neutral-border flex items-center justify-between px-6 bg-white absolute top-0 left-0 right-0 z-10">
                         <span className="text-[14px] font-medium text-neutral-title">操作区</span>
                         <div className="flex gap-3 text-neutral-400">
                            <span className="cursor-pointer hover:text-neutral-title">⇌</span>
                            <span className="cursor-pointer hover:text-neutral-title">⤢</span>
                         </div>
                       </div>
                       <div className="flex-1 p-8 pt-20 overflow-y-auto custom-scrollbar bg-[#f5f6f8]">
                          <div className="flex items-center gap-2 mb-8">
                             <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                             <h2 className="text-2xl font-bold text-neutral-title">1. 数字图像基本概念</h2>
                          </div>
                          
                          <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
                            <h3 className="text-[18px] font-bold text-neutral-title mb-4">1.1 图片的本质：数字矩阵</h3>
                            <p className="text-[14px] text-neutral-body mb-6 leading-loose">
                              我们看到的图像，在计算机内部其实是一串串数字。这些数字按照行和列整齐地排列，形成了一个 <span className="text-[#fa541c] font-medium">矩阵</span>。
                            </p>
                            
                            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center bg-[#fafafa]">
                               <div className="text-[#e83e8c] font-bold mb-4 flex items-center gap-2 text-[15px]">
                                 <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#e83e8c] to-[#ff75c3]"></div>
                                 互动实验：像素马赛克（粉色渐变心形）
                               </div>
                               <p className="text-[13px] text-neutral-caption mb-8">鼠标悬停在像素块上，可以查看该点的颜色。图像就是由这些纯色的小方块拼成的。</p>
                               
                               {/* Heart grid visualization */}
                               <div className="grid grid-cols-9 gap-0.5 w-64 h-64 bg-white p-3 border border-neutral-200 shadow-sm">
                                  {Array.from({length: 81}).map((_, i) => {
                                    const row = Math.floor(i / 9);
                                    const col = i % 9;
                                    let isHeart = false;
                                    let intensity = 50; // percentage
                                    
                                    if (row === 1 && (col === 2 || col === 3 || col === 5 || col === 6)) { isHeart = true; intensity = 60; }
                                    if (row === 2 && (col >= 1 && col <= 7)) { isHeart = true; intensity = 70; }
                                    if (row === 3 && (col >= 1 && col <= 7)) { isHeart = true; intensity = 80; }
                                    if (row === 4 && (col >= 2 && col <= 6)) { isHeart = true; intensity = 90; }
                                    if (row === 5 && (col >= 3 && col <= 5)) { isHeart = true; intensity = 100; }
                                    if (row === 6 && col === 4) { isHeart = true; intensity = 100; }
                                    
                                    if (isHeart) {
                                      // Generate a shade of pink/red based on intensity
                                      const opacity = intensity / 100;
                                      return (
                                        <div 
                                          key={i} 
                                          className="w-full h-full cursor-pointer hover:scale-110 transition-transform hover:shadow-md"
                                          style={{ backgroundColor: `rgba(255, 107, 129, ${opacity})` }}
                                          title={`Pixel (${row},${col}) - rgba(255,107,129,${opacity})`}
                                        ></div>
                                      );
                                    } else {
                                      return (
                                        <div key={i} className="w-full h-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer" title={`Background Pixel (${row},${col})`}></div>
                                      )
                                    }
                                  })}
                               </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                {playingLesson.type === 'video' && (
                  <div className="w-full max-w-4xl px-8 flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-neutral-title mb-8 text-center pb-6 border-b border-neutral-border w-full">{playingLesson.title}</h1>
                    <div className="w-full aspect-video bg-black relative rounded-lg overflow-hidden shadow-2xl border border-white/10">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 bg-gradient-to-b from-neutral-900 to-black">
                        <div className="w-20 h-20 rounded-full bg-[#fa541c]/20 flex items-center justify-center mb-6 animate-pulse">
                          <PlayCircle className="w-12 h-12 text-[#fa541c]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{playingLesson.title}</h3>
                        <p className="text-neutral-400">视频正在加载中...</p>
                        
                        {/* Fake Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4">
                          <div className="w-full flex items-center gap-4">
                            <PlayCircle className="w-6 h-6 text-white cursor-pointer hover:text-[#fa541c] transition-colors" />
                            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                              <div className="w-1/3 h-full bg-[#fa541c] rounded-full"></div>
                            </div>
                            <span className="text-xs text-white/70 font-mono">05:24 / 15:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {playingLesson.type === 'assignment' && (
                  <div className="w-full max-w-3xl px-8">
                    <h1 className="text-3xl font-bold text-neutral-title mb-8 text-center pb-6 border-b border-neutral-border">{playingLesson.title}</h1>
                    <div className="text-[15px] text-neutral-body leading-loose space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-neutral-title mb-3">一、选择题</h2>
                        <p>1. 以下哪个是正确的 Python 变量名？</p>
                        <ul className="list-none space-y-2 mt-4">
                          <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" className="text-[#fa541c] focus:ring-[#fa541c]" /> <span>A. 1_variable</span></label></li>
                          <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" className="text-[#fa541c] focus:ring-[#fa541c]" /> <span>B. variable_1</span></label></li>
                          <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" className="text-[#fa541c] focus:ring-[#fa541c]" /> <span>C. var-1</span></label></li>
                          <li><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="q1" className="text-[#fa541c] focus:ring-[#fa541c]" /> <span>D. def</span></label></li>
                        </ul>
                      </div>

                      <div className="mt-8">
                        <h2 className="text-xl font-bold text-neutral-title mb-3">二、简答题</h2>
                        <p>2. 简述 Python 中列表和元组的区别。</p>
                        <textarea className="w-full h-32 p-3 mt-4 border border-neutral-border rounded-md outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all resize-none" placeholder="请输入你的答案..."></textarea>
                      </div>
                      
                      <div className="flex justify-end mt-8 pt-6 border-t border-neutral-border">
                         <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-8" onClick={() => { alert('作业提交成功！'); handleCloseLesson(); }}>提交作业</Button>
                      </div>
                    </div>
                  </div>
                )}
                {playingLesson.type === 'experiment' && !isExperimentStarted && (
                  <div className="w-full h-full flex flex-col absolute inset-0">
                    <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-border bg-white shrink-0 z-10">
                      <span className="text-[16px] font-bold text-neutral-title">{playingLesson.title}</span>
                      <div className="flex gap-4">
                        <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-6" onClick={() => setIsExperimentStarted(true)}>启动实验</Button>
                        <Button variant="outline" className="text-neutral-body h-9 px-6">结束实验</Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-neutral-title mb-8">🧠第12课：Linux 实时进程监控工具 top</h1>
                        
                        <h2 className="text-xl font-bold text-neutral-title mt-8 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#fa541c]" /> 介绍</h2>
                        <p className="text-[14px] text-neutral-body leading-loose mb-6">
                          在 Linux 系统中，<code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">top</code> 是动态监控进程和系统资源使用情况的核心工具。它以交互式界面的形式实时显示 CPU、内存、负载和每个进程的详细状态，并支持快捷键进行排序、筛选和操作。本课将带你从基础运行 <code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">top</code> 开始，逐步掌握界面解读、常用快捷键、自定义显示字段、批处理模式以及结合脚本进行自动化监控，让你能够实时掌握系统的运行状态。
                        </p>

                        <h2 className="text-2xl font-bold text-neutral-title mt-10 mb-6">1. 理论</h2>
                        <h3 className="text-[18px] font-bold text-neutral-title mt-6 mb-4 flex items-center gap-2"><span className="text-yellow-400">💡</span> 基本介绍 什么是 top?</h3>
                        <p className="text-[14px] text-neutral-body leading-loose mb-4">
                          <code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">top</code> (table of processes) 是 Linux 中实时显示系统状态的命令。它提供一个全屏交互界面，默认每 3 秒刷新一次，动态展示系统负载、任务总数、CPU 使用率、内存和交换分区使用情况，以及各进程的详细资源占用。用户可通过按键对进程进行排序、杀死进程、调整进程优先级等操作。
                        </p>
                        <p className="text-[14px] text-neutral-body leading-loose mb-3">基本语法：</p>
                        <div className="bg-[#282c34] rounded-lg overflow-hidden mb-8">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-[#181a1f]">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-400">
                              <span>bash</span>
                              <span className="cursor-pointer hover:text-white flex items-center gap-1 ml-4">复制代码 <CheckSquare className="w-3 h-3" /></span>
                            </div>
                          </div>
                          <div className="p-4 text-neutral-300 font-mono text-[14px]">
                            <span className="text-neutral-500 mr-4">1</span> <span className="text-[#98c379]">top</span> [选项]
                          </div>
                        </div>

                        <h3 className="text-[18px] font-bold text-neutral-title mt-8 mb-4 flex items-center gap-2"><BarChart className="w-5 h-5 text-[#fa541c]" /> 解析</h3>
                        <p className="text-[14px] text-neutral-body leading-loose mb-4">常用选项：</p>
                        <ul className="list-disc pl-6 space-y-4 text-[14px] text-neutral-body mb-8">
                          <li><code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">-d 秒数</code> : 指定刷新间隔（默认 3 秒）</li>
                          <li><code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">-p PID1,PID2</code> : 只监视指定 PID 的进程</li>
                          <li><code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">-u 用户名</code> : 只显示指定用户的进程</li>
                          <li><code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">-b</code> : 批处理模式，将输出重定向到文件或管道</li>
                          <li><code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">-n 次数</code> : 批处理模式下指定刷新次数</li>
                        </ul>
                        <p className="text-[14px] text-neutral-body leading-loose">
                          最简单的用法直接在终端输入 <code className="bg-[#fff2e8] text-[#fa541c] px-1.5 py-0.5 rounded text-[13px]">top</code> 进入交互界面。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* Notes Panel */}
              {showNotesPanel && (
                <div className="w-80 border-l border-neutral-border bg-white flex flex-col animate-in slide-in-from-right-8 duration-300">
                  <div className="p-4 border-b border-neutral-border flex justify-between items-center">
                    <h3 className="font-bold text-neutral-title flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#fa541c]" /> 课堂笔记
                    </h3>
                    <X className="w-4 h-4 cursor-pointer text-neutral-caption hover:text-neutral-title" onClick={() => setShowNotesPanel(false)} />
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto bg-[#fafafa]">
                    <textarea 
                      className="w-full h-full p-4 border border-neutral-border rounded-lg outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-[14px] text-neutral-body bg-white shadow-sm transition-all" 
                      placeholder="在这里记录你的学习心得、重要知识点或待办事项..."
                    ></textarea>
                  </div>
                  <div className="p-4 border-t border-neutral-border bg-white flex justify-end">
                    <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-8 text-xs px-4">保存笔记</Button>
                  </div>
                </div>
              )}

              {/* Right Sidebar */}
              <div className="w-16 border-l border-neutral-border flex flex-col py-6 bg-[#fafafa]">
                <div className="flex flex-col gap-6 w-full">
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-1.5 cursor-pointer group",
                      showNotesPanel ? "text-[#fa541c]" : "text-neutral-caption hover:text-[#fa541c]"
                    )}
                    onClick={() => setShowNotesPanel(!showNotesPanel)}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px]">小记</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(teacherActionMode === 'edit' || (playingLesson.type === 'experiment' && isExperimentStarted)) && (
            <div className="w-full h-full bg-white relative flex flex-col">
              {/* Top Bar */}
              <div className="h-12 border-b border-neutral-border flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center gap-1 text-[14px] font-bold text-neutral-title cursor-pointer hover:text-[#fa541c]"
                    onClick={() => {
                      if (teacherActionMode === 'edit') {
                        setTeacherActionMode('detail');
                      } else {
                        handleCloseLesson();
                      }
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" /> 返回
                  </div>
                  <div className="w-px h-4 bg-neutral-border mx-2"></div>
                  <span className="text-sm font-bold text-neutral-title">{playingLesson.title}</span>
                  {teacherActionMode === 'edit' && (
                    <span className="ml-2 px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] text-[10px] rounded border border-[#ffbb96]">编辑模式</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {teacherActionMode === 'edit' && (
                    <Button size="sm" className="h-7 text-xs bg-[#fa541c] hover:bg-[#e84a15] text-white px-4 mr-4" onClick={() => setTeacherActionMode('detail')}>
                      保存课时
                    </Button>
                  )}
                  <div className="flex items-center gap-2 text-sm text-neutral-body">
                    <div className="mx-2 h-4 w-px bg-neutral-border"></div>
                    <button className="p-1 hover:bg-neutral-200 rounded text-neutral-600" title="Save file"><Save className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-neutral-200 rounded text-neutral-600" title="Add cell below"><Plus className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-neutral-200 rounded text-neutral-600" title="Run selected cell"><Play className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-neutral-200 rounded text-neutral-600" title="Interrupt the kernel"><Square className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-neutral-200 rounded text-neutral-600" title="Restart the kernel"><RotateCcw className="w-4 h-4" /></button>
                    <div className="mx-2 h-4 w-px bg-neutral-border"></div>
                    <Button variant="outline" size="sm" className="h-7 text-xs text-[#fa541c] border-[#ffbb96] hover:bg-[#fff2e8] px-2 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> 收起/展开非Cell块
                    </Button>
                    <Button size="sm" className="h-7 text-xs bg-[#fa541c] hover:bg-[#e84a15] text-white px-3 flex items-center gap-1 mt-0">
                      <Cpu className="w-3.5 h-3.5" /> 启动 GPU 环境
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Menu Bar */}
              <div className="h-8 border-b border-neutral-border flex items-center px-4 text-sm text-neutral-body gap-4 bg-[#f5f6f8]">
                <span className="cursor-pointer hover:text-neutral-title">File</span>
                <span className="cursor-pointer hover:text-neutral-title">Edit</span>
                <span className="cursor-pointer hover:text-neutral-title">View</span>
                <span className="cursor-pointer hover:text-neutral-title">Run</span>
                <span className="cursor-pointer hover:text-neutral-title">Kernel</span>
                <span className="cursor-pointer hover:text-neutral-title">Tabs</span>
                <span className="cursor-pointer hover:text-neutral-title">Help</span>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Icons */}
                <div className="w-16 border-r border-neutral-border flex flex-col items-center py-4 gap-6 text-neutral-caption bg-[#fafafa]">
                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'course' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('course')}
                  >
                    <CheckSquare className="w-5 h-5" />
                    <span className="text-[10px]">课程</span>
                  </div>
                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'file' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('file')}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px]">文件</span>
                  </div>
                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'dataset' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('dataset')}
                  >
                    <Map className="w-5 h-5" />
                    <span className="text-[10px]">数据集</span>
                  </div>

                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'toc' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('toc')}
                  >
                    <List className="w-5 h-5" />
                    <span className="text-[10px]">目录</span>
                  </div>
                </div>

                {/* Left Sidebar - Dynamic Content */}
                <div className="w-72 border-r border-neutral-border flex flex-col bg-white">
                  {activeExperimentTab === 'file' && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-2 border-b border-neutral-border text-neutral-caption">
                        <FileText className="w-4 h-4 cursor-pointer hover:text-neutral-title" />
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 cursor-pointer hover:text-neutral-title" />
                          <Map className="w-4 h-4 cursor-pointer hover:text-neutral-title" />
                          <Clock className="w-4 h-4 cursor-pointer hover:text-neutral-title" />
                        </div>
                      </div>
                      <div className="p-2 border-b border-neutral-border">
                        <div className="flex items-center gap-2 text-neutral-title">
                          <Map className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border-b border-neutral-border text-xs font-medium text-neutral-title bg-neutral-50">
                        <span>Name</span>
                        <span>Last Modified</span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between p-2 bg-[#fa541c] text-white text-sm cursor-pointer">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-white" />
                            <span>Python 基础数据类型</span>
                          </div>
                          <span className="text-xs text-white/80">3 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-neutral-50 text-sm cursor-pointer">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-yellow-500" />
                            <span className="text-neutral-title">results</span>
                          </div>
                          <span className="text-xs text-neutral-caption">2 months ago</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeExperimentTab === 'dataset' && (
                    <div className="flex flex-col h-full bg-white">
                      <div className="flex border-b border-neutral-border">
                        {[
                          {id: 'public', label: '公开', icon: Database},
                          {id: 'import', label: '导入', icon: Download},
                          {id: 'fav', label: '收藏', icon: Star},
                          {id: 'my', label: '我的', icon: Activity}
                        ].map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => setDatasetTab(t.id)}
                            className={cn(
                              "flex-1 py-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors border-b-2",
                              datasetTab === t.id ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-caption border-transparent hover:text-neutral-title"
                            )}
                          >
                            <t.icon className="w-4 h-4" />
                            <span className="text-[10px] transform scale-90">{t.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 relative">
                         {datasetTab === 'public' && (
                           <>
                             <div className="relative mb-4">
                               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
                               <input type="text" placeholder="搜索公开数据集..." className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c]" />
                             </div>
                             <div className="space-y-3">
                                {[
                                   {name: "MNIST Digit Recognizer", desc: "经典手写数字识别公开验证集"},
                                   {name: "IMDB Movie Reviews", desc: "自然语言情感分类标准数据集"},
                                   {name: "COCO Image 2017", desc: "目标检测巨无霸公开数据集"}
                                ].map((d, i) => (
                                   <div onClick={() => setSelectedDataset(d)} key={i} className="p-3 border border-neutral-border rounded hover:border-[#fa541c] hover:shadow-sm cursor-pointer transition-all bg-white group">
                                     <div className="text-sm font-bold text-neutral-title mb-1 group-hover:text-[#fa541c]">{d.name}</div>
                                     <div className="text-[11px] text-neutral-caption line-clamp-2">{d.desc}</div>
                                   </div>
                                ))}
                             </div>
                           </>
                         )}
                         {datasetTab === 'import' && (
                           <>
                             <div className="text-xs text-neutral-body mb-4 font-medium">共 {importedDatasets.length} 个已导入的数据集</div>
                             <div className="space-y-3">
                                {importedDatasets.map((name, i) => (
                                   <div key={i} className="p-3 border border-neutral-border rounded bg-[#fafafa]">
                                     <div className="text-sm font-bold text-neutral-title mb-2">{name}</div>
                                     <div className="flex items-center gap-2">
                                       <Button size="sm" variant="outline" className="h-6 text-[11px] flex-1 bg-white hover:bg-neutral-50 border-neutral-300" onClick={() => setActiveExperimentTab('file')}>
                                          <Eye className="w-3 h-3 mr-1" /> 查看文件
                                       </Button>
                                       <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-6 text-[11px] text-red-500 border-red-200 hover:bg-red-50"
                                          onClick={() => {
                                             if(window.confirm("确认要取消导入此数据集吗？该操作立即生效。")){
                                                setImportedDatasets(prev => prev.filter(x => x !== name));
                                             }
                                          }}
                                       >
                                          取消
                                       </Button>
                                     </div>
                                   </div>
                                ))}
                                {importedDatasets.length === 0 && (
                                   <div className="text-center py-8 text-neutral-caption text-xs">空空如也，快去公开库导入吧~</div>
                                )}
                             </div>
                           </>
                         )}
                         {datasetTab === 'fav' && (
                           <div className="text-center py-8 text-neutral-caption text-xs">暂无收藏内容</div>
                         )}
                         {datasetTab === 'my' && (
                           <>
                             <Button size="sm" className="w-full mb-4 bg-white border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] h-8 shadow-none rounded-md text-xs transition-colors">
                               <Plus className="w-3.5 h-3.5 mr-1" /> 上传私有数据集
                             </Button>
                             <div className="space-y-3">
                               {[
                                 {name: "公司财务脱敏验证集(2023)", desc: "我自己清洗加工的文件包"}
                               ].map((d, i) => (
                                 <div key={i} className="p-3 border border-neutral-border rounded bg-white group hover:border-[#fa541c] transition-colors cursor-pointer shadow-sm" onClick={() => setSelectedDataset(d)}>
                                   <div className="text-sm font-bold text-neutral-title mb-1 group-hover:text-[#fa541c]">{d.name}</div>
                                   <div className="text-[11px] text-neutral-caption line-clamp-2 mb-2">{d.desc}</div>
                                   <div className="text-right">
                                     {!importedDatasets.includes(d.name) ? (
                                        <Button size="sm" className="h-6 text-[10px] bg-[#f5f6f8] text-neutral-title hover:bg-[#fa541c] hover:text-white" onClick={(e) => { e.stopPropagation(); setImportedDatasets(prev => [...prev, d.name]); }}>
                                           <Download className="w-3 h-3 mr-1" /> 导入
                                        </Button>
                                     ) : (
                                        <span className="text-[10px] text-[#52c41a] font-medium bg-[#52c41a]/10 px-2 py-0.5 rounded">已导入</span>
                                     )}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </>
                         )}
                      </div>
                    </div>
                  )}

                  {activeExperimentTab === 'toc' && (
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b border-neutral-border">
                        <h3 className="text-xs font-bold text-neutral-title tracking-wider">TABLE OF CONTENTS</h3>
                      </div>
                      <div className="flex-1 bg-white"></div>
                    </div>
                  )}

                  {activeExperimentTab === 'course' && (
                    <div className="flex flex-col h-full bg-[#fafafa]">
                      <div className="p-2 text-xs font-bold text-neutral-caption uppercase tracking-wider border-b border-neutral-border">
                        {playingLesson.title}.ipynb
                      </div>
                      <div className="p-2 flex items-center gap-2 border-b border-neutral-border">
                        <ChevronLeft className="w-4 h-4 text-neutral-caption" />
                        <ChevronRight className="w-4 h-4 text-neutral-caption" />
                        <span className="text-neutral-caption text-xs">M↓</span>
                        <div className="ml-auto">
                          <ChevronDown className="w-4 h-4 text-neutral-caption" />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2">
                        <div className="flex items-center gap-1 text-sm text-neutral-title font-medium py-1">
                          <ChevronDown className="w-4 h-4" />
                          Python 基础数据类型
                        </div>
                        {isRecommendedMode ? (
                          <>
                             <div className="pl-6 py-1.5 text-sm text-[#fa541c] font-medium hover:bg-neutral-200 cursor-pointer flex items-center justify-between pr-2">
                                <span>常用数据类型</span> <span className="text-[10px] bg-[#fa541c]/10 px-1.5 rounded">推荐</span>
                             </div>
                             <div className="pl-6 py-1.5 text-sm text-[#fa541c] font-medium hover:bg-neutral-200 cursor-pointer flex items-center justify-between pr-2">
                                <span>交互计算</span> <span className="text-[10px] bg-[#fa541c]/10 px-1.5 rounded">推荐</span>
                             </div>
                             <div className="pl-6 py-1.5 text-sm text-[#fa541c] font-medium hover:bg-neutral-200 cursor-pointer flex items-center justify-between pr-2">
                                <span>类型转换</span> <span className="text-[10px] bg-[#fa541c]/10 px-1.5 rounded">推荐</span>
                             </div>
                          </>
                        ) : (
                          <>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">第一行 Python 代码</div>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">常用数据类型</div>
                             <div className="flex items-center gap-1 text-sm text-neutral-title font-medium py-1 pl-4">
                               <ChevronDown className="w-4 h-4" />
                               数字
                             </div>
                             <div className="pl-10 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">整型</div>
                             <div className="pl-10 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">浮点数</div>
                             <div className="pl-10 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">交互计算</div>
                             <div className="pl-10 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">简单的数学函数</div>
                             <div className="pl-10 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">其他表示</div>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">布尔型</div>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">变量赋值</div>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">字符串</div>
                             <div className="pl-6 py-1 text-sm text-neutral-body hover:bg-neutral-200 cursor-pointer">类型转换</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Editor Tabs */}
                  <div className="flex border-b border-neutral-border bg-[#f5f6f8]">
                    <div className="px-4 py-2 border-r border-neutral-border flex items-center gap-2 bg-white border-t-2 border-t-[#fa541c]">
                      <div className="w-3 h-3 bg-[#fa541c] rounded-sm"></div>
                      <span className="text-sm text-neutral-title">{playingLesson.title}.ipynb</span>
                      <X className="w-3 h-3 text-neutral-caption cursor-pointer hover:text-neutral-title ml-2" />
                    </div>
                    <div className="px-4 py-2 border-r border-neutral-border flex items-center gap-2 hover:bg-white cursor-pointer transition-colors">
                      <div className="w-3 h-3 bg-neutral-400 rounded-sm"></div>
                      <span className="text-sm text-neutral-body">Launcher</span>
                      <X className="w-3 h-3 text-neutral-caption cursor-pointer hover:text-neutral-title ml-2" />
                    </div>
                  </div>
                  
                  {/* Editor Content (Dataset or Launcher View) */}
                  <div className="flex-1 p-8 overflow-y-auto bg-white flex flex-col">
                    {selectedDataset ? (
                        <div className="flex-1 max-w-4xl mx-auto w-full">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h2 className="text-xl font-bold text-neutral-title flex items-center gap-3">
                                   <Database className="w-6 h-6 text-[#fa541c]" /> {selectedDataset.name}
                                 </h2>
                                 <p className="text-[13px] text-neutral-caption mt-2">{selectedDataset.desc}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 shadow-sm">
                                   <Star className="w-4 h-4 mr-1" /> 收藏
                                </Button>
                                {importedDatasets.includes(selectedDataset.name) ? (
                                   <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8 shadow-sm text-neutral-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                                      onClick={() => {
                                         if(window.confirm("确认要取消导入此数据集吗？")){
                                            setImportedDatasets(prev => prev.filter(d => d !== selectedDataset.name));
                                         }
                                      }}
                                   >
                                      取消导入
                                   </Button>
                                ) : (
                                   <Button 
                                      size="sm" 
                                      className="h-8 shadow-sm bg-[#fa541c] hover:bg-[#d4380d] text-white"
                                      onClick={() => { setImportedDatasets(prev => [...prev, selectedDataset.name]); setDatasetTab('import'); }}
                                   >
                                      <Download className="w-4 h-4 mr-1" /> 导入
                                   </Button>
                                )}
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedDataset(null)}>
                                   <X className="w-5 h-5 text-neutral-400" />
                                </Button>
                              </div>
                           </div>
                           <div className="border border-neutral-border rounded-lg p-6 bg-[#fafafa]">
                              <h3 className="font-bold text-neutral-title mb-4 flex items-center gap-2"><FileDigit className="w-4 h-4 text-neutral-caption"/> 概览介绍 (README.md)</h3>
                              <p className="text-[14px] text-neutral-body leading-relaxed mb-6">
                                此数据集包含 100,000 条高质量的样本数据以及标准化标注格式，适用于在机器学习领域进行模型微调和基准测试。<br/><br/>
                                数据采集于公开来源，经过脱敏与分词处理，确保安全隔离。直接点击导入即可分配进您的文件工作存储区。
                              </p>
                              
                              <h3 className="font-bold text-neutral-title flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4 text-neutral-caption" /> 文件预览 (部分示例数据)
                              </h3>
                              <div className="border border-neutral-border rounded overflow-hidden">
                                <table className="w-full text-left text-[12px] bg-white">
                                  <thead className="bg-[#f5f6f8] text-neutral-title font-medium">
                                    <tr><th className="p-3 border-b">id</th><th className="p-3 border-b">text / feature</th><th className="p-3 border-b">label</th></tr>
                                  </thead>
                                  <tbody>
                                    <tr><td className="p-3 border-b text-neutral-caption">1</td><td className="p-3 border-b text-neutral-body">这是一个积极的影评，我非常喜欢。</td><td className="p-3 border-b"><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600">positive</span></td></tr>
                                    <tr><td className="p-3 border-b text-neutral-caption">2</td><td className="p-3 border-b text-neutral-body">很糟糕的体验，太失望了。</td><td className="p-3 border-b"><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600">negative</span></td></tr>
                                    <tr><td className="p-3 border-b text-neutral-caption">3</td><td className="p-3 border-b text-neutral-body">中规中矩，没有亮点也没有大失误。</td><td className="p-3 border-b"><span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">neutral</span></td></tr>
                                  </tbody>
                                </table>
                              </div>
                           </div>
                        </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-medium text-neutral-title mb-6">{playingLesson.title}</h2>
                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-4 border-b border-neutral-border pb-2">
                            <div className="w-6 h-6 bg-[#fa541c] rounded flex items-center justify-center text-white">
                              <Code className="w-4 h-4" />
                            </div>
                            <span className="text-lg text-neutral-title">Notebook</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">P</span>
                              </div>
                              <span className="text-sm text-neutral-body">Python 3</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-4 border-b border-neutral-border pb-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-mono text-xs">
                              &gt;_
                            </div>
                            <span className="text-lg text-neutral-title">Console</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">P</span>
                              </div>
                              <span className="text-sm text-neutral-body">Python 3</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-4 border-b border-neutral-border pb-2">
                            <span className="text-lg text-neutral-title">Other</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center text-white font-mono">
                                $_
                              </div>
                              <span className="text-sm text-neutral-body">Terminal</span>
                            </div>
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-neutral-400 rounded flex items-center justify-center text-white font-serif text-2xl">
                                T
                              </div>
                              <span className="text-sm text-neutral-body">Text File</span>
                            </div>
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-2xl">
                                M↓
                              </div>
                              <span className="text-sm text-neutral-body">Markdown ...</span>
                            </div>
                            <div className="w-32 h-32 border border-neutral-border rounded hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-4 transition-shadow">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">P</span>
                              </div>
                              <span className="text-sm text-neutral-body">Py File</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Sidebar - Dynamic Content */}
                {(activeExperimentTab === 'api' || activeExperimentTab === 'monitor') && (
                  <div className="w-80 border-l border-neutral-border flex flex-col bg-white">
                    {activeExperimentTab === 'api' && (
                      <div className="flex flex-col h-full">
                        <div className="p-2 border-b border-neutral-border flex items-center gap-2">
                          <Search className="w-4 h-4 text-neutral-caption" />
                          <input type="text" placeholder="Search..." className="flex-1 outline-none text-sm" />
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                          <h2 className="text-xl font-bold mb-4">欢迎!</h2>
                          <p className="text-sm text-neutral-body mb-4 leading-relaxed">
                            这里集合了很多常用 Python 库的文档，你可以在上方搜索栏搜索关键词来查询结果。
                          </p>
                          <p className="text-sm text-neutral-body mb-4 leading-relaxed">
                            我们也支持特定文档的搜索，比如：想要查询 numpy 相关文档，输入 numpy 和空格，即可在 numpy 的文档中进行查询。
                          </p>
                          <p className="text-sm text-neutral-body mb-4">
                            开发快乐！
                          </p>
                          <p className="text-sm text-neutral-caption">
                            基于开源的 <span className="text-[#fa541c] cursor-pointer hover:underline">DevDocs</span>。
                          </p>
                        </div>
                      </div>
                    )}

                    {activeExperimentTab === 'monitor' && (
                      <div className="flex flex-col h-full bg-[#fdfdfd]">
                        <div className="p-4 border-b border-neutral-border flex items-center gap-2 bg-white">
                          <Activity className="w-5 h-5 text-[#fa541c]" />
                          <h3 className="font-bold text-neutral-title text-[15px]">资源监控</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-neutral-title flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> CPU 使用率</span>
                              <span className="text-sm text-blue-600 font-mono">12.4%</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[12%]"></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-neutral-title flex items-center gap-2"><HardDrive className="w-4 h-4 text-green-500" /> 内存使用</span>
                              <span className="text-sm text-green-600 font-mono">4.2 / 16 GB (26%)</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-[26%]"></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-neutral-title flex items-center gap-2"><svg className="w-4 h-4 text-[#fa541c]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> GPU 使用率</span>
                              <span className="text-sm text-[#fa541c] font-mono">89%</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#fa541c] w-[89%]"></div>
                            </div>
                            <div className="text-[11px] text-neutral-caption mt-2 flex justify-between">
                              <span>显存: 14.2 / 16 GB</span>
                              <span>Temp: 76°C</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Right Sidebar - Tools */}
                <div className="w-16 border-l border-neutral-border flex flex-col items-center py-4 gap-6 bg-[#fafafa]">
                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'api' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('api')}
                  >
                    <div className={cn("w-8 h-8 rounded flex items-center justify-center text-xs font-bold", activeExperimentTab === 'api' ? "bg-neutral-200 text-neutral-title" : "text-neutral-caption group-hover:text-neutral-title")}>
                      <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center text-white text-[10px]">API</div>
                    </div>
                  </div>
                  <div 
                    className={cn("flex flex-col items-center gap-1 cursor-pointer group w-full", activeExperimentTab === 'monitor' ? "text-[#fa541c]" : "hover:text-neutral-title")}
                    onClick={() => setActiveExperimentTab('monitor')}
                  >
                    <div className={cn("w-8 h-8 rounded flex items-center justify-center", activeExperimentTab === 'monitor' ? "bg-neutral-200 text-neutral-title" : "text-neutral-caption group-hover:text-neutral-title")}>
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="h-6 bg-neutral-600 text-white/80 text-xs flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                  <span>0 $_</span>
                  <span>1 🛡️</span>
                  <span>0 📄</span>
                  <span>0 ⬇️</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>GPU: 2 h 0 min</span>
                  <span>Launcher</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setTeacherActionMode('detail');
                  setPlayingLesson(null);
                }}
                className="absolute top-2 right-2 text-neutral-caption hover:text-neutral-title z-50 bg-white/80 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Personalized AI Report Modal */}
      {showReportModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col mx-4 animate-in zoom-in-95 duration-200">
             <div className="h-16 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/10 skew-x-12 translate-x-10"></div>
               <div className="flex items-center gap-3 text-white z-10">
                 <BarChart className="w-6 h-6" />
                 <h2 className="text-lg font-bold">大模型专属个性化学习报告</h2>
               </div>
               <button onClick={() => setShowReportModal(false)} className="text-white/80 hover:text-white z-10 p-2"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
               <div className="text-[14px] text-neutral-body leading-relaxed">
                 基于您在 <span className="text-[#fa541c] font-bold">《Python 基础》</span> 各小节测验中的作答分析以及参与的实验记录，大模型为您提炼了如下多维度学习报告：
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#fff2e8] p-4 rounded-xl border border-[#ffbb96]">
                   <div className="text-[13px] font-bold text-[#d4380d] mb-4">🏆 知识点掌握情况</div>
                   <div className="space-y-3">
                     <div>
                       <div className="flex justify-between text-[12px] mb-1"><span className="text-neutral-title">基础概念</span> <span className="font-medium">95%</span></div>
                       <div className="h-1.5 w-full bg-[#ffd8bf] rounded-full overflow-hidden"><div className="h-full bg-[#fa541c] w-[95%]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-[12px] mb-1"><span className="text-neutral-title">控制逻辑</span> <span className="font-medium">85%</span></div>
                       <div className="h-1.5 w-full bg-[#ffd8bf] rounded-full overflow-hidden"><div className="h-full bg-[#fa541c] w-[85%]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-[12px] mb-1"><span className="text-neutral-title">数据处理</span> <span className="font-medium">60%</span></div>
                       <div className="h-1.5 w-full bg-[#ffd8bf] rounded-full overflow-hidden"><div className="h-full bg-[#faad14] w-[60%]"></div></div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-[#fff2e8] p-4 rounded-xl border border-[#ffd8bf]">
                   <div className="text-[13px] font-bold text-[#fa541c] mb-2">💡 专家分析建议</div>
                   <p className="text-[12px] text-neutral-body leading-relaxed">
                     您在 Python 基础语法的理解上非常扎实，但在 <strong className="text-[#fa541c]">数据处理（如列表切片、字典合并）</strong> 相关小节中的代码实验耗时较长，错误率略高。
                     <br/><br/>
                     LLM 建议：接下来您可以针对《交互计算》与《序列实操》模块进行定向复习，建议额外进行 2 次代码练习即可融会贯通。
                   </p>
                 </div>
               </div>
               
               <div className="flex items-center justify-end mt-4">
                  <Button className="bg-[#fa541c] hover:bg-[#d4380d] text-white rounded-full px-8">
                     导出完整 PDF 报告
                  </Button>
               </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
}
