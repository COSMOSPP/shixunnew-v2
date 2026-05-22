import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, ArrowLeft, CheckCircle2, X, Map, Clock, FileText, Code, CheckSquare, ChevronDown, List, Search, Check, BarChart, Save, Plus, Play, Square, RotateCcw, Layers, Cpu, Database, Activity, HardDrive, Download, Eye, FileDigit, BookOpen, Monitor, PlusCircle, Edit, Trash2, Compass, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TeacherPPTEditor from './TeacherPPTEditor';

interface CourseDetailProps {
  onBack: () => void;
  onShowLearningPath?: () => void;
  initialLesson?: { title: string, type: string } | null;
  isTeacher?: boolean;
}

interface Lesson {
  section: string;
  title: string;
  locked: boolean;
  status: string;
  type: string;
  tag?: string;
}

interface Chapter {
  chapter: string;
  title: string;
  duration: number;
  videos: number;
  docs: number;
  experiments: number;
  assignments: number;
  description: string;
  lessons: Lesson[];
}

const COURSE_SYLLABUS: Chapter[] = [
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
      { section: "课时4:", title: "实操平台演示", locked: false, status: "未学习", type: "doc" },
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
  const [showStudentAnswering, setShowStudentAnswering] = useState(false);
  const [answeringAnswers, setAnsweringAnswers] = useState<Record<number, number>>({});
  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(1);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 59, seconds: 15 });

  useEffect(() => {
    if (!showStudentAnswering) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showStudentAnswering]);

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

  // Dynamic syllabus state & editing states
  const [syllabus, setSyllabus] = useState<Chapter[]>(COURSE_SYLLABUS);
  const [activeLessonMenu, setActiveLessonMenu] = useState<{ cIdx: number, lIdx: number } | null>(null);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [newLessonName, setNewLessonName] = useState("");
  const [editLessonName, setEditLessonName] = useState("");
  const [lessonToEdit, setLessonToEdit] = useState<{ cIdx: number, lIdx: number } | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{ cIdx: number, lIdx: number } | null>(null);

  const currentChapterIdx = syllabus.findIndex((ch: any) => 
    ch.lessons.some((l: any) => l.title === (playingLesson?.title || ""))
  ) !== -1 ? syllabus.findIndex((ch: any) => 
    ch.lessons.some((l: any) => l.title === (playingLesson?.title || ""))
  ) : 0;

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonName.trim()) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[currentChapterIdx];
    if (targetChapter) {
      const sectionNum = `课时${targetChapter.lessons.length + 1}:`;
      targetChapter.lessons = [
        ...targetChapter.lessons,
        {
          section: sectionNum,
          title: newLessonName,
          locked: false,
          status: "未学习",
          type: "doc"
        }
      ];
      setSyllabus(updatedSyllabus);
      setPlayingLesson({ title: newLessonName, type: "doc" });
    }
    setNewLessonName("");
    setShowCreateLessonModal(false);
  };

  const handleOpenEditModal = (cIdx: number, lIdx: number, currentTitle: string) => {
    setLessonToEdit({ cIdx, lIdx });
    setEditLessonName(currentTitle);
    setShowEditLessonModal(true);
  };

  const handleEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLessonName.trim() || !lessonToEdit) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[lessonToEdit.cIdx];
    if (targetChapter && targetChapter.lessons[lessonToEdit.lIdx]) {
      const oldTitle = targetChapter.lessons[lessonToEdit.lIdx].title;
      targetChapter.lessons[lessonToEdit.lIdx].title = editLessonName;
      setSyllabus(updatedSyllabus);
      
      if (playingLesson?.title === oldTitle) {
        setPlayingLesson({ title: editLessonName, type: playingLesson.type });
      }
    }
    setShowEditLessonModal(false);
    setLessonToEdit(null);
  };

  const handleOpenDeleteModal = (cIdx: number, lIdx: number) => {
    setLessonToDelete({ cIdx, lIdx });
    setShowDeleteLessonModal(true);
  };

  const handleDeleteLesson = () => {
    if (!lessonToDelete) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[lessonToDelete.cIdx];
    if (targetChapter) {
      const deletedTitle = targetChapter.lessons[lessonToDelete.lIdx].title;
      
      targetChapter.lessons = targetChapter.lessons.filter((_, idx) => idx !== lessonToDelete.lIdx);
      targetChapter.lessons = targetChapter.lessons.map((lesson: any, idx: number) => ({
        ...lesson,
        section: `课时${idx + 1}:`
      }));
      
      setSyllabus(updatedSyllabus);
      
      if (playingLesson?.title === deletedTitle) {
        let foundNewActive = false;
        for (const ch of updatedSyllabus) {
          if (ch.lessons.length > 0) {
            setPlayingLesson({ title: ch.lessons[0].title, type: ch.lessons[0].type });
            setIsExperimentStarted(false);
            foundNewActive = true;
            break;
          }
        }
        if (!foundNewActive) {
          setPlayingLesson(null);
        }
      }
    }
    setShowDeleteLessonModal(false);
    setLessonToDelete(null);
  };

  // Interactive Paper Management States
  const [expandedRows, setExpandedRows] = useState<number[]>([1]); // Row 1 expanded by default
  const [showCreatePaperModal, setShowCreatePaperModal] = useState(false);
  const [showPreviewQuestionsModal, setShowPreviewQuestionsModal] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  // Custom Paper Creation form state
  const [newPaperForm, setNewPaperForm] = useState({
    name: "",
    desc: "",
    questionsCount: 1,
    questionTypes: "编程题",
    paperType: "测验",
    timeLimit: 60
  });

  const [papers, setPapers] = useState([
    {
      id: 1,
      name: "Python编程测验",
      desc: "用于「Mo 体验课程」的 Python编程测验试卷",
      questionsCount: 1,
      questionTypes: "编程题",
      paperType: "测验",
      status: "启用",
      creator: "孙昕",
      updatedAt: "2026/02/11 11:55"
    },
    {
      id: 2,
      name: "Python编程测验演示",
      desc: "Python编程测验演示",
      questionsCount: 1,
      questionTypes: "编程题",
      paperType: "测验",
      status: "启用",
      creator: "Momodel",
      updatedAt: "2026/02/02 15:08"
    }
  ]);

  const handleToggleRow = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(prev => prev.filter(x => x !== id));
    } else {
      setExpandedRows(prev => [...prev, id]);
    }
  };

  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperForm.name) {
      alert("请输入试卷名称！");
      return;
    }
    const newId = papers.length > 0 ? Math.max(...papers.map(p => p.id)) + 1 : 1;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newPaper = {
      id: newId,
      name: newPaperForm.name,
      desc: newPaperForm.desc || "自定义创建的试卷",
      questionsCount: Number(newPaperForm.questionsCount) || 1,
      questionTypes: newPaperForm.questionTypes,
      paperType: newPaperForm.paperType,
      status: "启用",
      creator: "李老师", // Current teacher name
      updatedAt: formattedDate
    };

    setPapers(prev => [newPaper, ...prev]);
    setShowCreatePaperModal(false);
    setNewPaperForm({
      name: "",
      desc: "",
      questionsCount: 1,
      questionTypes: "编程题",
      paperType: "测验",
      timeLimit: 60
    });
    alert("试卷新建成功！");
  };

  const handleDeletePaper = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("确定要删除这张试卷吗？此操作不可恢复。")) {
      setPapers(prev => prev.filter(p => p.id !== id));
      setExpandedRows(prev => prev.filter(x => x !== id));
    }
  };

  const handleCloseLesson = () => {
    setTeacherActionMode('detail');
    if (initialLesson) {
      onBack();
    } else {
      setPlayingLesson(null);
    }
  };

  if (showStudentAnswering) {
    const questions = [
      {
        id: 1,
        title: "神经网络中ReLU是？",
        options: ["A 激活函数", "B 损失函数", "C 优化器", "D 正则化方法"]
      },
      {
        id: 2,
        title: "以下哪项不是深度学习框架？",
        options: ["A PyTorch", "B Java", "C Keras", "D Caffe"]
      },
      {
        id: 3,
        title: "监督学习与无监督学习的主要区别是？",
        options: ["A 计算设备", "B 算法数据", "C 数据大小", "D 标签存在与否"]
      },
      {
        id: 4,
        title: "人工智能的英文缩写是？",
        options: ["A AI", "B UI", "C AR", "D VR"]
      },
      {
        id: 5,
        title: "训练集、验证集和测试集的比例通常为？",
        options: ["A 8:2:2", "B 6:2:2", "C 7:2:1", "D 5:5:0"]
      }
    ];

    const correctAnswers: Record<number, number> = {
      1: 0,
      2: 1,
      3: 3,
      4: 0,
      5: 2
    };

    const handleSubmit = () => {
      const unansweredCount = questions.length - Object.keys(answeringAnswers).length;
      if (unansweredCount > 0) {
        if (!window.confirm(`您还有 ${unansweredCount} 道题未作答，确定要提交吗？`)) {
          return;
        }
      }

      let score = 0;
      Object.entries(answeringAnswers).forEach(([qId, selectedIdx]) => {
        if (correctAnswers[Number(qId)] === selectedIdx) {
          score += 20;
        }
      });

      alert(`作业提交成功！您的得分是：${score}分（共100分）`);
      setShowStudentAnswering(false);
    };

    const padZero = (num: number) => String(num).padStart(2, '0');

    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans -mt-6 -mx-6 md:-mx-8 animate-in fade-in duration-300">
        {/* Top Banner (Orange Theme) */}
        <div className="bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] pt-6 pb-16 px-10 relative overflow-hidden shrink-0">
          
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full"></div>
            <div className="absolute -right-10 top-10 w-[300px] h-[300px] border-[2px] border-white/10 rounded-full"></div>
            
            {/* Decorative cubes representing AI/Tech */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 transform rotate-12 flex flex-wrap w-[200px] gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-14 h-14 bg-white/40 rounded shadow-lg backdrop-blur-sm"></div>
              ))}
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto relative z-10 flex justify-between items-end">
            <div className="text-white">
              <div className="flex items-center gap-2 text-[12px] text-white/70 mb-4 font-medium tracking-wider">
                <button onClick={() => setShowStudentAnswering(false)} className="hover:text-white transition-colors flex items-center gap-1 bg-transparent border-none outline-none cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> 课程
                </button>
                <span>/</span>
                <span>人工智能基础与实践</span>
                <span>/</span>
                <span className="text-white">人工智能通讯课-客观题</span>
              </div>
              
              <h1 className="text-[28px] font-bold mb-4 tracking-wider">人工智能通讯课-客观题</h1>
              
              <div className="flex items-center gap-6 text-[13px] text-white/90">
                <span>学生：张同学</span>
                <span>作业时长：90分钟</span>
              </div>
            </div>
            
            <div className="text-white flex flex-col items-end">
               <div className="text-[12px] text-white/80 mb-2 tracking-widest font-medium">倒计时</div>
               <div className="flex items-baseline gap-2">
                 <div className="flex items-baseline gap-1">
                   <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">{timeLeft.days}</div>
                   <span className="text-[12px] opacity-80">天</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                   <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">{padZero(timeLeft.hours)}</div>
                   <span className="text-[12px] opacity-80">时</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                   <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">{padZero(timeLeft.minutes)}</div>
                   <span className="text-[12px] opacity-80">分</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                   <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">{padZero(timeLeft.seconds)}</div>
                   <span className="text-[12px] opacity-80">秒</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 -mt-8 relative z-20 pb-20 px-4">
          <div className="max-w-[1000px] mx-auto bg-white rounded-t-xl rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 min-h-[600px] border border-neutral-100 flex flex-col">
            
            <div className="flex items-center gap-2 mb-10 pb-4 border-b border-neutral-100">
              <CheckCircle2 className="w-5 h-5 text-[#fa541c]" />
              <h2 className="text-[16px] font-bold text-neutral-800">
                单选题 <span className="text-[13px] text-neutral-400 font-normal ml-2 tracking-wide">(第 1-10 题, 每题 2 分, 共 30 分)</span>
              </h2>
            </div>

            <div className="space-y-12 flex-1">
              {questions.map((q) => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-[15px] font-bold text-neutral-800 leading-relaxed">
                    {q.id}、{q.title}
                  </h3>
                  <div className="space-y-2 pl-6">
                    {q.options.map((opt, i) => {
                      const isSelected = answeringAnswers[q.id] === i;
                      return (
                        <div 
                          key={i} 
                          onClick={() => setAnsweringAnswers({...answeringAnswers, [q.id]: i})}
                          className={cn(
                            "text-[14px] cursor-pointer transition-colors flex items-center gap-3 px-4 py-2.5 rounded-lg border",
                            isSelected 
                              ? "bg-orange-50/50 border-[#fa541c] text-[#fa541c] font-medium" 
                              : "border-transparent hover:bg-neutral-50 text-neutral-600 hover:text-[#fa541c]"
                          )}
                        >
                           <span className={cn(
                             "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                             isSelected ? "border-[#fa541c] bg-[#fa541c]" : "border-neutral-300"
                           )}>
                             {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                           </span>
                           {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-12 pt-6 border-t border-neutral-100">
              <Button 
                onClick={handleSubmit}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-8 h-10 text-[14px] font-bold shadow-sm rounded-md transition-all flex items-center gap-1.5"
              >
                提交作业
              </Button>
            </div>

          </div>
        </div>
      </div>
    );
  }

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
              { id: 'assignments', label: '课程作业' },
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
              {syllabus.map((chapter, i) => (
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
                      {isTeacher && chapter.assignments > 0 && (
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-neutral-caption" />
                          <span><span className="font-bold text-neutral-title">{chapter.assignments}</span> 个随堂作业</span>
                        </div>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2 text-neutral-caption" />
                    </div>
                  </div>
                  
                  {/* Chapter Content */}
                  <div className="pt-4 pb-2 px-6">
                    {chapter.description && (
                      <p className="text-[14px] text-neutral-body mb-4">{chapter.description}</p>
                    )}
                    <div className="space-y-1">
                      {chapter.lessons.filter(l => isTeacher || l.type !== 'assignment').map((lesson, idx) => (
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
          {activeTab === 'assignments' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              {[
                {
                  id: 1,
                  title: "1. 人工智能通讯作业",
                  deadline: "截止时间: 2099/02/28 00:00:00",
                  hasDetail: true,
                  sectionTitle: "客观题",
                  items: [
                    {
                      label: "1. 客观题 18 道，共 100 分",
                      desc: "客观题包括单选题、多选题、判断题、填空题、简答题、思考题、编程题"
                    },
                    {
                      label: "2. 答题限时: 90 分钟",
                      desc: "客观题需在 90 分钟内完成答题，过程中无法暂停，仅支持提交一次，请提前合理安排时间"
                    }
                  ],
                  btnText: "开始答题"
                },
                {
                  id: 2,
                  title: "2. 搭建 AI 聊天助手智能体作业",
                  deadline: "截止时间: 2099/02/28 00:00:00",
                  hasDetail: false
                },
                {
                  id: 3,
                  title: "3. 实验报告 (理工类): 基于人工神经网络算法的图像分类实践",
                  deadline: "截止时间: 2099/02/28 00:00:00",
                  hasDetail: false
                }
              ].map((assignment) => {
                const isExpanded = expandedAssignment === assignment.id;
                return (
                  <div key={assignment.id} className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-neutral-100/60 transition-all duration-300">
                    {/* Header Row */}
                    <div 
                      onClick={() => {
                        if (assignment.hasDetail) {
                          setExpandedAssignment(isExpanded ? null : assignment.id);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-6 select-none transition-colors",
                        assignment.hasDetail ? "cursor-pointer hover:bg-neutral-50/30" : "cursor-default"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-neutral-title">{assignment.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-neutral-caption">{assignment.deadline}</span>
                        {assignment.hasDetail && (
                          <ChevronDown className={cn("w-4 h-4 text-neutral-caption transition-transform duration-300", isExpanded && "transform rotate-180")} />
                        )}
                      </div>
                    </div>

                    {/* Detailed Content */}
                    {isExpanded && assignment.hasDetail && (
                      <div className="px-8 pb-8 pt-2 border-t border-neutral-100/60 animate-in slide-in-from-top-2 duration-300">
                        <div className="mt-4 bg-[#fafafa] rounded-[12px] p-6 border border-neutral-100 flex flex-col gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-lg bg-[#fff2e8] flex items-center justify-center text-[#fa541c] shrink-0 mt-0.5 shadow-xs">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <h3 className="text-[15px] font-bold text-neutral-title flex items-center gap-2">
                                {assignment.sectionTitle}
                              </h3>
                              
                              <div className="space-y-4 pl-1">
                                {assignment.items?.map((item, idx) => (
                                  <div key={idx} className="space-y-1.5">
                                    <div className="text-[14px] font-bold text-neutral-title">{item.label}</div>
                                    <div className="text-[13px] text-neutral-body leading-relaxed pl-4">{item.desc}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 pl-[52px]">
                            <Button 
                              onClick={() => {
                                setShowStudentAnswering(true);
                                setAnsweringAnswers({});
                              }}
                              className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-md transition-all flex items-center gap-1.5"
                            >
                              {assignment.btnText}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {playingLesson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* PPT Editor UI */}
          {isTeacher && playingLesson.type === 'doc' && (
            <TeacherPPTEditor 
              courseSyllabus={syllabus}
              initialLesson={playingLesson}
              onSyllabusChange={(updatedSyllabus) => setSyllabus(updatedSyllabus)}
              onActiveLessonChange={(newTitle) => setPlayingLesson(prev => prev ? { ...prev, title: newTitle } : prev)}
              onClose={() => { setTeacherActionMode('detail'); setPlayingLesson(null); }}
            />
          )}

          {/* Assignment Edit UI */}
          {teacherActionMode === 'edit' && playingLesson.type === 'assignment' && (
            <div className="w-full h-full bg-[#f5f6f8] relative flex font-sans animation-fade-in">
              {/* Left Sidebar */}
              <div className="w-56 bg-white border-r border-neutral-200 flex flex-col shrink-0">
                {/* Sidebar Brand/Logo */}
                <div className="h-14 border-b border-neutral-100 flex items-center px-6 gap-2 shrink-0 bg-white">
                  <div className="w-6 h-6 rounded-md bg-[#fa541c] flex items-center justify-center text-white font-bold text-xs shadow-sm">Mo</div>
                  <span className="font-bold text-[14px] text-neutral-800">实训教师端</span>
                </div>
                
                {/* Sidebar Menu */}
                <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
                  {/* Menu Item 1: 资源分配 */}
                  <div>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
                        <span className="text-[13px] font-medium">资源分配</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 transform -rotate-90" />
                    </div>
                  </div>

                  {/* Menu Item 2: 题库管理 */}
                  <div>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-800 font-bold cursor-default transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4 text-[#fa541c]" />
                        <span className="text-[13px]">题库管理</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                    
                    {/* Submenus */}
                    <div className="pl-3 mt-1.5 space-y-2">
                      <div className="text-[12px] text-neutral-500 hover:text-[#fa541c] cursor-pointer transition-colors select-none">
                        试题管理
                      </div>
                      <div className="text-[12px] font-bold text-[#fa541c] cursor-pointer transition-all select-none">
                        试卷管理
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation / Breadcrumbs */}
                <div className="h-11 border-b border-neutral-200 bg-white flex items-center px-6 justify-between shrink-0">
                   <div className="flex items-center gap-2 text-xs">
                     <span className="text-neutral-400">题库管理</span>
                     <span className="text-neutral-300">/</span>
                     <span className="text-neutral-800 font-medium">试卷管理</span>
                   </div>
                </div>

                {/* Workspace Card */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#f5f6f8]">
                  <div className="w-full bg-white rounded-[16px] shadow-sm border border-neutral-200/80 p-4 min-h-[500px] flex flex-col">
                    
                    {/* Title & Description */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between pb-4 border-b border-neutral-100 mb-4 gap-4 shrink-0">
                      <div>
                        {/* Return/Back button placed directly above title */}
                        <button 
                          onClick={() => setTeacherActionMode('detail')} 
                          className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-[#fa541c] transition-colors mb-1.5 w-fit font-medium group"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#fa541c] transition-colors" /> 返回
                        </button>
                        <h2 className="text-[18px] font-bold text-neutral-800 flex items-center gap-2">
                          <span className="w-1.5 h-4.5 bg-[#fa541c] rounded-full"></span>
                          试卷管理
                        </h2>
                        <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">
                          新建试卷前请先创建可用试题，试卷“启用”后即可用于课程作业或章节测验。您可以对试卷进行编辑、删除或预览客观题内容。
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowCreatePaperModal(true)}
                        className="bg-[#fa541c] hover:bg-[#ff7a45] text-white hover:shadow-md transition-all h-8.5 px-4 rounded-md text-[13px] font-bold flex items-center gap-1.5 shrink-0 shadow-sm mt-6 md:mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> 新建试卷
                      </Button>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#fafafa] text-[13px] text-neutral-600 font-bold border-b border-neutral-200 select-none">
                            <th className="py-4 px-6 w-12 text-center">
                              <input type="checkbox" className="rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer" readOnly checked />
                            </th>
                            <th className="py-4 px-4 w-72">
                              <div className="flex items-center gap-1">
                                试卷名称 
                                <Search className="w-3.5 h-3.5 text-[#fa541c] cursor-pointer hover:opacity-80 transition-opacity" />
                              </div>
                            </th>
                            <th className="py-4 px-4">试卷说明</th>
                            <th className="py-4 px-4 text-center">题目数量</th>
                            <th className="py-4 px-4">
                              <div className="flex items-center gap-0.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                包含题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            </th>
                            <th className="py-4 px-4">
                              <div className="flex items-center gap-0.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                试卷类型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            </th>
                            <th className="py-4 px-4">
                              <div className="flex items-center gap-0.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                状态 
                                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full border border-neutral-400 text-[9px] text-neutral-400 ml-1 font-normal cursor-help" title="试卷启用后方可被课程引用">?</span>
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            </th>
                            <th className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                创建人 
                                <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                              </div>
                            </th>
                            <th className="py-4 px-4">
                              <div className="flex items-center gap-0.5 cursor-pointer hover:text-neutral-900 transition-colors">
                                更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                              </div>
                            </th>
                            <th className="py-4 px-6 text-right">操作</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                          {papers.map((paper) => {
                            const isExpanded = expandedRows.includes(paper.id);
                            return (
                              <React.Fragment key={paper.id}>
                                {/* Main Row */}
                                <tr className="border-b border-neutral-100 hover:bg-[#fff2e8]/10 transition-colors">
                                  <td className="py-4 px-6 text-center select-none">
                                    <input type="checkbox" className="rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer" />
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                      <button 
                                        onClick={() => handleToggleRow(paper.id)}
                                        className={cn(
                                          "w-4 h-4 border flex items-center justify-center text-xs font-bold transition-all rounded-[3px] select-none",
                                          isExpanded 
                                            ? "bg-[#fff2e8] border-[#fa541c] text-[#fa541c]" 
                                            : "bg-white border-neutral-300 text-neutral-500 hover:border-[#fa541c] hover:text-[#fa541c]"
                                        )}
                                      >
                                        {isExpanded ? "-" : "+"}
                                      </button>
                                      <span className="text-[14px] font-semibold text-neutral-800">{paper.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-[13px] text-neutral-500 leading-relaxed max-w-xs truncate" title={paper.desc}>
                                    {paper.desc}
                                  </td>
                                  <td className="py-4 px-4 text-[14px] text-neutral-800 font-mono text-center">
                                    {paper.questionsCount}
                                  </td>
                                  <td className="py-4 px-4 text-[13px] text-neutral-600">
                                    {paper.questionTypes}
                                  </td>
                                  <td className="py-4 px-4 text-[13px] text-neutral-600">
                                    {paper.paperType}
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f6ffed] border border-[#b7eb8f] text-[#389e0d] text-[11px] font-medium">
                                      {paper.status}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 text-[13px] text-neutral-600">
                                    {paper.creator}
                                  </td>
                                  <td className="py-4 px-4 text-[12px] text-neutral-400 font-mono">
                                    {paper.updatedAt}
                                  </td>
                                  <td className="py-4 px-6 text-[13px] font-medium text-right whitespace-nowrap select-none">
                                    <div className="flex items-center justify-end gap-4">
                                      <button className="text-[#fa541c] hover:text-[#ff7a45] transition-colors">编辑</button>
                                      <button 
                                        onClick={(e) => handleDeletePaper(paper.id, e)}
                                        className="text-[#fa541c] hover:text-[#ff7a45] transition-colors"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Expanded Detail Row */}
                                {isExpanded && (
                                  <tr className="bg-[#fafafa]/50 border-b border-neutral-100">
                                    <td colSpan={10} className="p-4">
                                      <div className="w-full bg-white border border-neutral-200/80 rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
                                        
                                        <h3 className="flex items-center gap-2 text-[13.5px] font-bold text-neutral-800 mb-4 mt-1">
                                          <FileText className="w-4 h-4 text-[#fa541c]" /> 客观题配置明细
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                                          {/* Item 1 */}
                                          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-[#ffbb96]/60 transition-all group">
                                            <div className="font-bold text-[13px] text-neutral-800 mb-1 flex items-center gap-1.5">
                                              <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full"></span>
                                              1. 客观题 {paper.questionsCount} 道，共 100 分
                                            </div>
                                            <div className="text-[12px] text-neutral-400 pl-3">包含客观选择题以及Python基础编程自动测评题。</div>
                                          </div>
                                          
                                          {/* Item 2 */}
                                          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-[#ffbb96]/60 transition-all group">
                                            <div className="font-bold text-[13px] text-neutral-800 mb-1 flex items-center gap-1.5">
                                              <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full"></span>
                                              2. 答题限时：60 分钟
                                            </div>
                                            <div className="text-[12px] text-neutral-400 pl-3">客观题需在 60 分钟内完成答题，过程中无法暂停，仅支持提交一次，请提前合理安排时间。</div>
                                          </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end pl-4">
                                          <Button 
                                            onClick={() => {
                                              setShowPreviewQuestionsModal(true);
                                              setSelectedAnswers({});
                                            }}
                                            className="bg-white hover:bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] h-8.5 px-6 rounded-md text-[12px] font-bold transition-all shadow-sm flex items-center gap-1"
                                          >
                                            <Eye className="w-3.5 h-3.5" /> 预览客观题
                                          </Button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                          
                          {papers.length === 0 && (
                            <tr>
                              <td colSpan={10} className="py-12 text-center text-neutral-400">
                                <Database className="w-12 h-12 mx-auto mb-2 text-neutral-200" />
                                暂无可用试卷，请点击右上角【新建试卷】
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>

              {/* 新建试卷 Modal */}
              {showCreatePaperModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                  <div className="w-[500px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-neutral-150">
                    {/* Header */}
                    <div className="h-14 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] flex items-center justify-between px-6 shrink-0 text-white font-bold text-sm relative">
                      <div className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" />
                        <span>新建试卷</span>
                      </div>
                      <button 
                        onClick={() => setShowCreatePaperModal(false)}
                        className="text-white/80 hover:text-white p-2 transition-colors rounded-full hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleCreatePaper} className="p-6 space-y-4">
                      <div>
                        <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">试卷名称 <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="请输入试卷名称，例如：Python基础数据类型测试"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all"
                          value={newPaperForm.name}
                          onChange={(e) => setNewPaperForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">试卷说明</label>
                        <textarea 
                          placeholder="请输入试卷的描述性信息..."
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all resize-none h-20"
                          value={newPaperForm.desc}
                          onChange={(e) => setNewPaperForm(prev => ({ ...prev, desc: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">题目数量</label>
                          <input 
                            type="number" 
                            min="1"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all"
                            value={newPaperForm.questionsCount}
                            onChange={(e) => setNewPaperForm(prev => ({ ...prev, questionsCount: Number(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">答题限时 (分钟)</label>
                          <input 
                            type="number" 
                            min="1"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all"
                            value={newPaperForm.timeLimit}
                            onChange={(e) => setNewPaperForm(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">包含题型</label>
                          <select 
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white"
                            value={newPaperForm.questionTypes}
                            onChange={(e) => setNewPaperForm(prev => ({ ...prev, questionTypes: e.target.value }))}
                          >
                            <option value="编程题">编程题</option>
                            <option value="选择题">选择题</option>
                            <option value="选择题, 编程题">混合题型</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">试卷类型</label>
                          <select 
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#fa541c] focus:border-[#fa541c] transition-all bg-white"
                            value={newPaperForm.paperType}
                            onChange={(e) => setNewPaperForm(prev => ({ ...prev, paperType: e.target.value }))}
                          >
                            <option value="测验">测验</option>
                            <option value="作业">作业</option>
                            <option value="考试">考试</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreatePaperModal(false)}
                          className="h-9 px-5 text-neutral-600 hover:bg-neutral-50 rounded-md text-[13px] font-medium"
                        >
                          取消
                        </Button>
                        <Button 
                          type="submit"
                          className="h-9 px-5 bg-[#fa541c] hover:bg-[#ff7a45] text-white rounded-md text-[13px] font-bold shadow-sm"
                        >
                          确认创建
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 预览客观题 Modal */}
              {showPreviewQuestionsModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                  <div className="w-[700px] max-w-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-neutral-200 mx-4 h-[550px]">
                    {/* Header */}
                    <div className="h-14 bg-gradient-to-r from-[#fa541c] to-[#ff7a45] flex items-center justify-between px-6 shrink-0 text-white font-bold text-sm relative">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 animate-pulse" />
                        <span>客观题在线预览（互动答题模式）</span>
                      </div>
                      <button 
                        onClick={() => setShowPreviewQuestionsModal(false)}
                        className="text-white/80 hover:text-white p-2 transition-colors rounded-full hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa] custom-scrollbar">
                      {/* Question Box */}
                      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="px-2 py-0.5 rounded bg-orange-50 text-[#fa541c] font-bold border border-[#ffbb96]/60">单选题</span>
                          <span className="text-neutral-400 font-mono font-medium">题目 1 / 1</span>
                        </div>
                        
                        <h4 className="text-[15px] font-bold text-neutral-800 leading-relaxed">
                          问题：在 Python 中，关于数据类型和变量的描述，以下哪一项是错误的？
                        </h4>

                        <div className="space-y-2.5 pt-2">
                          {[
                            { key: 'A', text: "Python 是一种解释型语言，运行前不需要编译成二进制代码。" },
                            { key: 'B', text: "Python 中的列表（List）是可变的，而元组（Tuple）是不可变的。" },
                            { key: 'C', text: "Python 中的变量在使用前必须声明其数据类型，否则会报错。" },
                            { key: 'D', text: "Python 支持面向对象、函数式等多种编程范式。" }
                          ].map((opt) => {
                            const isSelected = selectedAnswers[1] === opt.key;
                            return (
                              <div 
                                key={opt.key}
                                onClick={() => setSelectedAnswers({ 1: opt.key })}
                                className={cn(
                                  "p-3 rounded-lg border text-sm cursor-pointer transition-all flex items-start gap-3 select-none",
                                  isSelected 
                                    ? "bg-[#fff2e8]/80 border-[#fa541c] text-[#fa541c] shadow-sm font-semibold" 
                                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50/50 hover:border-[#ffbb96]/60"
                                )}
                              >
                                <span className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono text-xs border transition-colors",
                                  isSelected 
                                    ? "bg-[#fa541c] border-[#fa541c] text-white font-bold" 
                                    : "border-neutral-300 text-neutral-400 bg-white"
                                )}>
                                  {opt.key}
                                </span>
                                <span className="leading-normal">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation Block (Shown when answered) */}
                      {selectedAnswers[1] && (
                        <div className={cn(
                          "p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300",
                          selectedAnswers[1] === 'C' 
                            ? "bg-[#f6ffed] border-[#b7eb8f] text-[#389e0d]" 
                            : "bg-red-50 border-red-200 text-red-600"
                        )}>
                          <div className="font-bold text-sm mb-1.5 flex items-center gap-1.5">
                            {selectedAnswers[1] === 'C' ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-[#52c41a]" />
                                恭喜你，回答正确！
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5 text-red-500 rounded-full border border-red-500 flex items-center justify-center shrink-0" />
                                回答错误，正确答案是 C。
                              </>
                            )}
                          </div>
                          <p className="text-[12px] leading-relaxed opacity-90 pl-6.5 mt-1 text-neutral-600">
                            解析：Python 是动态类型语言，变量不需要显式声明类型，直接赋值即可（例如 `x = 5`），Python 解释器会自动推断变量的数据类型。因此选项 C 的说法是错误的。
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="h-14 border-t border-neutral-200 bg-white flex items-center justify-between px-6 shrink-0 select-none">
                      <div className="text-[11px] text-neutral-400">
                        {selectedAnswers[1] ? "您可以关闭预览或重新选择答案" : "点击选项选择您的答案进行测评"}
                      </div>
                      <Button 
                        onClick={() => setShowPreviewQuestionsModal(false)}
                        className="bg-[#fa541c] hover:bg-[#ff7a45] text-white h-9 px-6 rounded-md text-[13px] font-bold transition-all shadow-sm"
                      >
                        关闭预览
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
                        <h2 className="text-[14px] font-bold text-neutral-title">课程目录</h2>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2 text-[#fa541c] border-[#fa541c] hover:bg-[#fff2e8] flex items-center gap-1 text-xs shadow-sm"
                        onClick={() => setShowCreateLessonModal(true)}
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> 新建课节
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
                  {syllabus.map((chapter, i) => (
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
                                "flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-r-2 relative group",
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
                                isTeacher && teacherActionMode !== 'preview' ? (
                                  <div className="shrink-0 relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLessonMenu(activeLessonMenu?.cIdx === i && activeLessonMenu?.lIdx === idx ? null : { cIdx: i, lIdx: idx });
                                      }}
                                      className={cn(
                                        "w-6 h-6 rounded hover:bg-neutral-200/60 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors",
                                        activeLessonMenu?.cIdx === i && activeLessonMenu?.lIdx === idx && "text-[#fa541c]"
                                      )}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    
                                    {activeLessonMenu?.cIdx === i && activeLessonMenu?.lIdx === idx && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveLessonMenu(null); }}></div>
                                        <div className="absolute right-0 top-7 w-24 bg-white rounded-lg shadow-lg border border-neutral-100 z-50 py-1 flex flex-col">
                                          <button 
                                            className="px-4 py-2 text-[12px] text-left text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] font-medium"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenEditModal(i, idx, lesson.title);
                                              setActiveLessonMenu(null);
                                            }}
                                          >
                                            设置
                                          </button>
                                          <button 
                                            className="px-4 py-2 text-[12px] text-left text-red-600 hover:bg-red-50 font-medium"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenDeleteModal(i, idx);
                                              setActiveLessonMenu(null);
                                            }}
                                          >
                                            删除
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <div className={cn("w-3.5 h-3.5 shrink-0 rounded-full border border-neutral-300", isActive && "border-[#fa541c] border-2")}></div>
                                )
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

          {((teacherActionMode === 'edit' && playingLesson.type !== 'assignment') || (playingLesson.type === 'experiment' && isExperimentStarted)) && (
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

      {/* 新建课节 Modal */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#fa541c]" /> 新建课节
              </h2>
              <button onClick={() => setShowCreateLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLesson}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课节名称
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入课节名称" 
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
                    autoFocus 
                    required
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
                <Button type="button" onClick={() => setShowCreateLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">添加</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 修改课节 Modal */}
      {showEditLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#fa541c]" /> 修改课节
              </h2>
              <button onClick={() => setShowEditLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditLesson}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课节名称
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入课节名称" 
                    value={editLessonName}
                    onChange={(e) => setEditLessonName(e.target.value)}
                    autoFocus 
                    required
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
                <Button type="button" onClick={() => setShowEditLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除课节确认 Modal */}
      {showDeleteLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-red-600 flex items-center gap-2">
                提示
              </h2>
              <button onClick={() => setShowDeleteLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-neutral-700 font-medium">确定要删除该课节吗？删除后不可恢复。</p>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setShowDeleteLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button type="button" onClick={handleDeleteLesson} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-8 shadow-md shadow-red-500/20">确定删除</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
