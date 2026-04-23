import React, { useState } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, CheckCircle2, X, Map, Clock, FileText, Code, CheckSquare, ChevronDown, List, Search, Check, BarChart, Save, Plus, Play, Square, RotateCcw, Layers, Cpu, Database, Activity, HardDrive, Download, Eye, FileDigit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CourseDetailProps {
  onBack: () => void;
  onShowLearningPath?: () => void;
}

export default function CourseDetail({ onBack, onShowLearningPath }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('intro');
  const [playingLesson, setPlayingLesson] = useState<{title: string, type: string} | null>(null);
  const [activeExperimentTab, setActiveExperimentTab] = useState('course');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [datasetTab, setDatasetTab] = useState('public');
  const [importedDatasets, setImportedDatasets] = useState<string[]>([]);
  const isRecommendedMode = (window as any).__RECOMMENDED_MODE === true;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f5f5f5] flex flex-col font-sans w-[100vw] relative left-1/2 -translate-x-1/2 -mt-6 -mb-6">
      {/* Header Section */}
      <div className="relative pt-8 pb-12 px-14 overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/pythoncourse/1920/400" 
            alt="Course Banner" 
            className="w-full h-full object-cover opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e8]/95 to-[#ffd8bf]/90"></div>
        </div>
        
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
                <Bookmark className="w-4 h-4" /> 收藏
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white text-[13px] text-neutral-title transition-colors">
                <Share2 className="w-4 h-4" /> 分享
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
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-neutral-title">4.8</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn("w-4 h-4", star <= 4 ? "text-[#faad14] fill-[#faad14]" : "text-[#faad14]/30 fill-[#faad14]/30")} />
                  ))}
                </div>
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
              { id: 'syllabus', label: '课程目录', tag: '试学' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  "px-6 py-3 rounded-[8px] text-[15px] font-medium transition-all relative flex items-center gap-2",
                  activeTab === tab.id ? "text-[#fa541c] bg-[#fff2e8]" : "text-neutral-body hover:text-neutral-title hover:bg-neutral-bg"
                )}
              >
                {tab.label}
                {tab.tag && (
                  <span className="px-1.5 py-0.5 rounded-[4px] border border-[#fa541c]/30 text-[#fa541c] text-[10px] leading-none">
                    {tab.tag}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Intro Section */}
          <div id="intro" className="flex flex-col gap-6 scroll-mt-24">
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

          {/* Syllabus Section */}
          <div id="syllabus" className="bg-white rounded-[16px] shadow-sm p-8 scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-title">课程目录</h2>
              <Button 
                onClick={() => setShowReportModal(true)}
                className="bg-gradient-to-r from-[#fa541c] to-[#ff8c3a] hover:from-[#e84a15] hover:to-[#ff7a22] text-white shadow-md shadow-[#fa541c]/20 border-0 flex items-center gap-2 rounded-full px-6 h-10 transition-all hover:-translate-y-0.5"
              >
                <BarChart className="w-4 h-4" />
                <span className="font-bold tracking-wide">生成个性化学习报告</span>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-1"></div>
              </Button>
            </div>
            <div className="space-y-6">
              {[
                {
                  chapter: "第一课",
                  title: "人工智能训练师三级考试内容指导",
                  duration: 98,
                  videos: 1,
                  docs: 4,
                  experiments: 0,
                  description: "",
                  lessons: [
                    { section: "课时1:", title: "职业简介", tag: "免费试学", locked: false, status: "未学习", type: "doc" },
                    { section: "课时2:", title: "认定方案", locked: false, status: "未学习", type: "doc" },
                    { section: "课时3:", title: "认定要素细目表", locked: false, status: "未学习", type: "doc" },
                    { section: "课时4:", title: "实操平台演示", locked: false, status: "未学习", type: "video" },
                    { section: "课时5:", title: "代码复习讲义", locked: false, status: "未学习", type: "doc" }
                  ]
                },
                {
                  chapter: "第二课",
                  title: "培训与指导",
                  duration: 245,
                  videos: 0,
                  docs: 0,
                  experiments: 10,
                  description: "",
                  lessons: [
                    { section: "课时1:", title: "智能音箱产品的数据分析与优化[3.1.1]", locked: false, status: "未学习", type: "experiment" },
                    { section: "课时2:", title: "智能照明系统的数据分析与优化[3.1.2]", locked: true, status: "未学习", type: "experiment" },
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
              ].map((chapter, i) => (
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
                        <PlayCircle className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.videos}</span> 个视频</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.docs}</span> 个文档</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-neutral-caption" />
                        <span><span className="font-bold text-neutral-title">{chapter.experiments}</span> 个实验</span>
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
                              {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'doc' && <FileText className="w-4 h-4 text-neutral-400" />}
                              {lesson.type === 'experiment' && <Code className="w-4 h-4 text-neutral-400" />}
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
      </div>

      {/* Modals */}
      {playingLesson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {playingLesson.type === 'video' && (
            <div className="w-full max-w-5xl aspect-video bg-black relative rounded-lg overflow-hidden shadow-2xl mx-4 border border-white/10">
              <button 
                onClick={() => setPlayingLesson(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/50 hover:bg-black/80 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Placeholder for video player */}
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
          )}

          {playingLesson.type === 'doc' && (
            <div className="w-full max-w-4xl h-[80vh] bg-white relative rounded-lg overflow-hidden shadow-2xl mx-4 flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border bg-neutral-bg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#fa541c]" />
                  <h3 className="text-lg font-bold text-neutral-title">{playingLesson.title}</h3>
                </div>
                <button 
                  onClick={() => setPlayingLesson(null)}
                  className="text-neutral-caption hover:text-neutral-title transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 bg-[#f5f6f8] overflow-y-auto flex justify-center py-8 custom-scrollbar">
                {/* Real Document Content */}
                <div className="w-full max-w-3xl bg-white shadow-sm border border-neutral-border p-12 min-h-full">
                  <h1 className="text-3xl font-bold text-neutral-title mb-8 text-center pb-6 border-b border-neutral-border">{playingLesson.title}</h1>
                  
                  <div className="text-[15px] text-neutral-body leading-loose space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-title mb-3">一、核心概念</h2>
                      <p>
                        在当前的实战课程中，<strong>{playingLesson.title}</strong>的知识非常关键。
                        人工智能的核心不仅仅是代码和算法的堆砌，更是对业务逻辑以及数据形态的深刻理解。
                        在本章节中，我们将探索如何有效地将业务场景转化为可以计算和优化的数学模型。
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-neutral-title mb-3">二、学习目标</h2>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>理解基本理论背景与技术架构路线。</li>
                        <li>掌握在开发过程中的环境配置与代码实施流程。</li>
                        <li>熟悉异常处理、性能调优及实际业务的工程化部署。</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-neutral-title mb-3">三、关键参考资料</h2>
                      <p>
                        学习本节内容时，建议结合实验环境以及配套视频一起阅读。
                        如果有任何疑惑，可以随时进入 AI 答疑助手页面获取实时解答。
                      </p>
                    </div>

                    <div className="bg-neutral-50 p-4 border-l-4 border-[#fa541c] rounded mt-12">
                       <p className="text-sm text-neutral-caption m-0">注：本文档为《{playingLesson.title}》的官方配套讲义资料，未经许可严禁外传。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {playingLesson.type === 'experiment' && (
            <div className="w-full h-full bg-white relative flex flex-col">
              {/* Top Bar */}
              <div className="h-12 border-b border-neutral-border flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[#fa541c] font-bold">
                    <div className="w-6 h-6 bg-[#fa541c] rounded-full flex items-center justify-center text-white text-xs">M</div>
                    <span>{playingLesson.title}</span>
                  </div>
                  <span className="text-neutral-caption text-sm flex items-center gap-1">课程页 <ChevronRight className="w-3 h-3" /></span>
                </div>
                <div className="flex items-center gap-4">
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
                onClick={() => setPlayingLesson(null)}
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
