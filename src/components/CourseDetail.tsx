import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Star, Share2, Bookmark, PlayCircle, Lock, MessageSquare, ThumbsUp, ChevronLeft, ArrowLeft, CheckCircle2, X, Map, Clock, FileText, Code, CheckSquare, ChevronDown, List, Search, Check, BarChart, Save, Plus, Play, Square, RotateCcw, Layers, Cpu, Database, Activity, HardDrive, Download, Eye, FileDigit, BookOpen, Monitor, MonitorPlay, PlusCircle, Edit, Trash2, Compass, MoreHorizontal, Pin, Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TeacherPPTEditor from './TeacherPPTEditor';
import TeacherExperimentIDE from '@/pages/teacher/TeacherExperimentIDE';

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
      { section: "课时2:", title: "互动学习课件案例演示demo", locked: false, status: "未学习", type: "split_doc" },
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

const NEW_QUESTIONS = [
  {
    id: 1,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "存储分为哪些类型",
    options: ["并行存储", "对象存储", "云硬盘", "文件存储"]
  },
  {
    id: 2,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "在深度学习中，用于多分类任务的输出层激活函数通常是？",
    options: ["A. Sigmoid", "B. Tanh", "C. Softmax", "D. ReLU"]
  },
  {
    id: 3,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "关于有监督学习，以下说法正确的是？",
    options: ["A. 不需要训练数据", "B. 必须包含输入和对应的标签", "C. 只能做聚类任务", "D. 不需要优化器"]
  },
  {
    id: 4,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "以下哪一个不是常用的机器学习评估指标？",
    options: ["A. 准确率 (Accuracy)", "B. 精确率 (Precision)", "C. 学习率 (Learning Rate)", "D. 召回率 (Recall)"]
  },
  {
    id: 5,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "人工神经网络中，神经元的基本计算过程是？",
    options: ["A. 加权求和并经过激活函数", "B. 矩阵求逆", "C. 随机游走", "D. 傅里叶变换"]
  },
  {
    id: 6,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "卷积神经网络（CNN）中卷积层的主要作用是？",
    options: ["A. 特征提取", "B. 降维", "C. 分类", "D. 数据增强"]
  },
  {
    id: 7,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "在训练神经网络时，如果模型在训练集上表现极好但在测试集上表现极差，这通常被称为？",
    options: ["A. 欠拟合 (Underfitting)", "B. 过拟合 (Overfitting)", "C. 梯度消失", "D. 鞍点"]
  },
  {
    id: 8,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "用于防止神经网络过拟合的常用正则化方法是？",
    options: ["A. Dropout", "B. Adam", "C. ReLU", "D. MSE"]
  },
  {
    id: 9,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "深度学习中常用作优化算法的是？",
    options: ["A. Adam / SGD", "B. Sigmoid", "C. ResNet", "D. Word2Vec"]
  },
  {
    id: 10,
    type: "single",
    typeName: "单选题",
    score: 1,
    title: "在自然语言处理中，Transformer架构的核心机制是？",
    options: ["A. 自注意力机制 (Self-Attention)", "B. 循环神经网络 (RNN)", "C. 隐马尔可夫模型", "D. 卷积操作"]
  },
  {
    id: 11,
    type: "multi",
    typeName: "多选题",
    score: 2,
    title: "以下哪些属于人工智能的核心技术领域？",
    options: ["A. 机器学习", "B. 计算机视觉", "C. 自然语言处理", "D. 传统关系型数据库"]
  },
  {
    id: 12,
    type: "multi",
    typeName: "多选题",
    score: 2,
    title: "下列深度学习框架中，开源且广泛使用的是？",
    options: ["A. PyTorch", "B. TensorFlow", "C. MindSpore", "D. GCC 编译器"]
  },
  {
    id: 13,
    type: "multi",
    typeName: "多选题",
    score: 2,
    title: "评价分类模型性能时，混淆矩阵（Confusion Matrix）包含哪些基本元素？",
    options: ["A. 真正例 (TP)", "B. 假正例 (FP)", "C. 真负例 (TN)", "D. 假负例 (FN)"]
  },
  {
    id: 14,
    type: "multi",
    typeName: "多选题",
    score: 2,
    title: "在数据预处理阶段，常见的数据清洗操作包括？",
    options: ["A. 处理缺失值", "B. 去除异常值", "C. 归一化/标准化", "D. 直接删除半数以上特征"]
  },
  {
    id: 15,
    type: "multi",
    typeName: "多选题",
    score: 2,
    title: "下列关于人工神经网络中“偏置（Bias）”的说法，正确的是？",
    options: ["A. 偏置允许激活函数在横轴上左右移动", "B. 偏置是神经网络需要通过反向传播训练的参数", "C. 偏置是固定不变的超参数", "D. 偏置可以看作是神经元激活的阈值偏好"]
  },
  {
    id: 16,
    type: "practical",
    typeName: "实训题",
    score: 10,
    title: "基于人工神经网络算法的图像分类实践",
    content: "一、实验主题\n基于人工神经网络算法的图像分类实践\n\n二、实验目的\n掌握有监督学习的基本概念与人工神经网络的核心原理；\n学会使用torchvision库加载手写数字数据集并进行数据预处理；\n学会运用pytorch构建卷积神经网络模型，掌握模型结构的设置方法；\n掌握运用交叉验证、网格搜索等技术实现模型调优，提升模型泛化能力；\n掌握运用准确率、精确率、召回率、F1-score指标评估模型性能的方法；\n能够处理神经网络训练过程中的结构设置、参数调优和防止过拟合等常见问题，提升对有监督学习任务的理解和实际问题分析能力。\n\n三、实验内容\n安装pytorch和torchvision，并导入torch、torchvision、matplotlib、sklearn库；\n运用torch和torchvision实现计算单元设置和数据集预处理；\n运用pytorch构建循环神经网络模型，包括卷积层、池化层和全连接层；\n运用交叉验证、网格搜索技术实现卷积神经网络超参数调优，提升模型性能；\n运用准确率、精确率、召回率、F1-score指标评估模型性能；\n可视化展示最佳模型预测结果。"
  },
  {
    id: 17,
    type: "practical",
    typeName: "实训题",
    score: 10,
    title: "基于卷积神经网络(CNN)的手写数字识别(MNIST)",
    content: "一、实验主题\n基于卷积神经网络(CNN)的手写数字识别(MNIST)\n\n二、实验目的\n理解卷积操作、池化操作对图像局部特征提取的作用；\n掌握在PyTorch中搭建经典LeNet-5或自定义CNN结构的方法；\n学会利用训练集训练CNN并使用验证集调整超参数（如卷积核大小、步长等）。\n\n三、实验内容\n1. 下载并加载MNIST手写数字数据集，绘制样本图像；\n2. 搭建包含两个卷积层和两个全连接层的经典神经网络；\n3. 运行模型训练，记录并可视化每个Epoch的Loss和Accuracy变化。"
  },
  {
    id: 18,
    type: "practical",
    typeName: "实训题",
    score: 10,
    title: "智能音箱产品数据分析与对话系统评估",
    content: "一、实验主题\n智能音箱产品数据分析与对话系统评估\n\n二、实验目的\n掌握对话交互意图识别准确度的计算方法；\n学会清洗和解析用户会话日志，统计各意图的请求频率；\n评估意图识别模型的召回率和精确率，找出识别较差的意图类型。\n\n三、实验内容\n1. 导入对话日志文件，进行文本去噪与标签映射；\n2. 计算意图识别的混淆矩阵，统计总体Accuracy与各意图下的F1-score；\n3. 提出优化意见，输出评估分析报告。"
  }
];

export default function CourseDetail({ onBack, onShowLearningPath, initialLesson, isTeacher }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState('intro');
  const [showStudentAnswering, setShowStudentAnswering] = useState(false);
  const [showPracticalIDE, setShowPracticalIDE] = useState(false);
  const [isSubmitAnswerDrawerOpen, setIsSubmitAnswerDrawerOpen] = useState(false);
  const [selectedAnswerFile, setSelectedAnswerFile] = useState<string | null>(null);
  const [answeringAnswers, setAnsweringAnswers] = useState<Record<number, number>>({});
  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(1);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [examTimeLeft, setExamTimeLeft] = useState(600); // 10 minutes count down

  useEffect(() => {
    if (!showStudentAnswering) return;
    setExamTimeLeft(600); // Reset timer
    (window as any).__EXAM_TIME_LEFT__ = 600;
    window.dispatchEvent(new CustomEvent("answering-time-change"));
    setUserAnswers({});
    setMarkedQuestions(new Set());
    setCurrentQuestionIdx(0);
  }, [showStudentAnswering]);

  useEffect(() => {
    (window as any).__IS_ANSWERING__ = showStudentAnswering;
    window.dispatchEvent(new CustomEvent("answering-state-change"));
    return () => {
      (window as any).__IS_ANSWERING__ = false;
      window.dispatchEvent(new CustomEvent("answering-state-change"));
    };
  }, [showStudentAnswering]);

  useEffect(() => {
    if (!showStudentAnswering) return;
    const interval = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          alert("考试时间到，已自动为您关闭答题！");
          setShowStudentAnswering(false);
          (window as any).__EXAM_TIME_LEFT__ = 0;
          window.dispatchEvent(new CustomEvent("answering-time-change"));
          return 0;
        }
        const nextTime = prev - 1;
        (window as any).__EXAM_TIME_LEFT__ = nextTime;
        window.dispatchEvent(new CustomEvent("answering-time-change"));
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showStudentAnswering]);

  const toggleMarkQuestion = (idx: number) => {
    setMarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleSelectOption = (qIdx: number, optIdx: number, type: string) => {
    if (type === 'single') {
      setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    } else {
      const currentAnswers = userAnswers[qIdx] || [];
      const updatedAnswers = currentAnswers.includes(optIdx)
        ? currentAnswers.filter((x: number) => x !== optIdx)
        : [...currentAnswers, optIdx];
      setUserAnswers(prev => ({ ...prev, [qIdx]: updatedAnswers }));
    }
  };

  const handleSubmitAnswering = () => {
    const totalQuestionsCount = NEW_QUESTIONS.length;
    const answeredCount = Object.keys(userAnswers).filter(k => {
      const ans = userAnswers[Number(k)];
      return ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true);
    }).length;

    const unansweredCount = totalQuestionsCount - answeredCount;

    if (unansweredCount > 0) {
      if (!window.confirm(`您还有 ${unansweredCount} 道题未作答，确定要提交作业吗？`)) {
        return;
      }
    } else {
      if (!window.confirm("确定要提交作业吗？提交后将无法修改答案。")) {
        return;
      }
    }

    // Calculate score
    let score = 0;
    NEW_QUESTIONS.forEach((q, idx) => {
      const answer = userAnswers[idx];
      if (q.type === 'single') {
        if (answer === 0) {
          score += q.score;
        }
      } else if (q.type === 'multi') {
        if (Array.isArray(answer) && answer.length === 2 && answer.includes(0) && answer.includes(1)) {
          score += q.score;
        }
      } else if (q.type === 'practical') {
        if (answer === true) {
          score += q.score;
        }
      }
    });

    alert(`作业提交成功！您的最终得分是：${score} 分（总分 50 分）`);
    setShowStudentAnswering(false);
  };
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
  const [isJoined, setIsJoined] = useState(false);
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

  if (showPracticalIDE) {
    return <TeacherExperimentIDE onBack={() => setShowPracticalIDE(false)} />;
  }

  if (showStudentAnswering) {
    const question = NEW_QUESTIONS[currentQuestionIdx];
    const isMarked = markedQuestions.has(currentQuestionIdx);
    const practicalQuestions = NEW_QUESTIONS.filter(q => q.type === 'practical');
    const currentPracticalIdx = practicalQuestions.findIndex(q => q.id === question.id);

    const formatExamTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const renderQuestionCircle = (idx: number, displayNum: number) => {
      const isCurrent = currentQuestionIdx === idx;
      const isMarked = markedQuestions.has(idx);
      const ans = userAnswers[idx];
      const isAnswered = ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : true);

      let circleColorClass = "";
      if (isCurrent) {
        circleColorClass = "border-2 border-[#fa541c] text-[#fa541c] bg-white font-bold shadow-xs";
      } else if (isAnswered) {
        circleColorClass = "bg-[#fa541c] border-[#fa541c] text-white font-medium";
      } else {
        circleColorClass = "border-neutral-300 text-neutral-600 bg-white hover:border-[#fa541c] hover:text-[#fa541c]";
      }

      return (
        <div 
          key={idx}
          onClick={() => setCurrentQuestionIdx(idx)}
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative",
            circleColorClass
          )}
        >
          {displayNum}
          {isMarked && (
            <span className="absolute top-[-1px] right-[-1px] w-2.5 h-2.5 bg-orange-500 rounded-full border border-white"></span>
          )}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans -mt-6 -mx-6 md:-mx-8 pt-0 px-6 pb-6 md:pb-8 md:px-8 animate-in fade-in duration-300">
        {/* Content Container */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)] md:h-[calc(100vh-5.5rem)] bg-white border border-neutral-200/80 shadow-lg">
          {/* Left Answering Area */}
          <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
            {/* Scrollable Question Content */}
            <div className="flex-1 overflow-y-auto px-10 pt-12 pb-4">
              {/* Question Paper Title */}
              <h1 className="text-[17px] font-bold text-neutral-title mb-6 pb-4 border-b border-neutral-100">
                中国电信云网资源管理(三级)云网资源管理(三级)
              </h1>

              {/* Question Type and Score */}
              <div className="flex items-center justify-between mb-5">
                <div className="text-[15px] font-bold text-neutral-title">
                  {currentQuestionIdx + 1}、{question.typeName} <span className="text-[13px] text-neutral-caption font-normal ml-1">({question.score}分)</span>
                </div>
                <button 
                  onClick={() => toggleMarkQuestion(currentQuestionIdx)}
                  className={cn(
                    "flex items-center gap-1.5 text-[12px] border px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer bg-white",
                    isMarked 
                      ? "bg-orange-50 border-[#fa541c] text-[#fa541c] font-bold" 
                      : "border-neutral-200 hover:border-[#fa541c] hover:text-[#fa541c] text-neutral-500"
                  )}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>标记</span>
                </button>
              </div>

              {/* Question Body */}
              {question.type !== 'practical' ? (
                <div>
                  {/* Clean Light-Bordered Question block */}
                  <div className="text-neutral-title mb-6 text-[15px] font-bold leading-relaxed flex items-center">
                    {question.title}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options?.map((opt, optIdx) => {
                      const isChecked = question.type === 'single'
                        ? userAnswers[currentQuestionIdx] === optIdx
                        : (userAnswers[currentQuestionIdx] || []).includes(optIdx);
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestionIdx, optIdx, question.type)}
                          className={cn(
                            "group flex items-center gap-3 px-5 py-4 border rounded-[4px] cursor-pointer transition-all select-none",
                            isChecked 
                              ? "bg-transparent border-[#fa541c] shadow-xs" 
                              : "bg-transparent border-neutral-150 hover:text-[#fa541c] hover:border-orange-200 hover:bg-[#fa541c]/5"
                          )}
                        >
                          {question.type === 'single' ? (
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                              isChecked ? "border-[#fa541c]" : "border-neutral-300 group-hover:border-orange-200"
                            )}>
                              {isChecked && <div className="w-2 h-2 bg-[#fa541c] rounded-full animate-scale-up"></div>}
                            </div>
                          ) : (
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                              isChecked ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300 group-hover:border-orange-200"
                            )}>
                              {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                            </div>
                          )}
                          <span className={cn(
                            "text-[14px] transition-colors",
                            isChecked ? "text-[#fa541c] font-bold" : "text-neutral-title group-hover:text-[#fa541c]"
                          )}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Practical Questions layout exactly as Figure 2 */
                <div className="space-y-4">
                  <div className="border border-neutral-200 rounded-lg p-5 bg-white overflow-y-auto max-h-[50vh] text-[14px] leading-relaxed text-[#333] text-left shadow-xs">
                    <div className="border border-neutral-200 rounded-md p-3 mb-4 font-bold text-neutral-title bg-neutral-50/50">
                      {question.title}
                    </div>
                    <div className="whitespace-pre-wrap font-medium space-y-1">
                      {question.content}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between px-10 py-5 border-t border-neutral-100 bg-white shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10">
              <Button
                variant="outline"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-6 h-9.5 text-[13px] font-bold rounded-[4px]"
              >
                上一题
              </Button>
              
              <div className="flex items-center gap-3">
                {question.type === 'practical' && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (currentPracticalIdx === 0) {
                        setShowPracticalIDE(true);
                        setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: true }));
                      } else {
                        setSelectedAnswerFile(null);
                        setIsSubmitAnswerDrawerOpen(true);
                      }
                    }}
                    className="border-[#fa541c] text-[#fa541c] hover:bg-[#fa541c]/5 hover:text-[#e84a15] hover:border-[#e84a15] px-6 h-9.5 text-[13px] font-bold rounded-[4px] transition-all flex items-center gap-1.5"
                  >
                    {currentPracticalIdx === 0 ? "开始答题" : "提交答案"}
                  </Button>
                )}
                
                <Button 
                  onClick={() => {
                    if (currentQuestionIdx < NEW_QUESTIONS.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else {
                      handleSubmitAnswering();
                    }
                  }}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1"
                >
                  {currentQuestionIdx === NEW_QUESTIONS.length - 1 ? "提交作业" : "下一题"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar navigation */}
          <div className="w-80 border-l border-neutral-border flex flex-col bg-white px-6 pt-12 pb-6 shrink-0 justify-between">
            <div className="overflow-y-auto flex-1 no-scrollbar">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center pb-5 border-b border-neutral-150 mb-5">
                <img 
                  src="https://picsum.photos/seed/studentavatar/150/150" 
                  alt="Student Avatar" 
                  className="w-full aspect-[16/9] object-cover rounded-lg border border-neutral-200 mb-2"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Grid lists */}
              <div className="space-y-5">
                {/* Single choices */}
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">单选题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'single').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>

                {/* Multiple choices */}
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">多选题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'multi').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>

                {/* Practical questions */}
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">实训题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'practical').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend & Submission */}
            <div className="border-t border-neutral-150 pt-5 mt-4">
              <div className="flex items-center justify-around text-[12px] text-neutral-caption mb-5">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#fa541c]"></div>
                  <span>已答</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-neutral-300 bg-white"></div>
                  <span>未答</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border-2 border-[#fa541c] bg-white"></div>
                  <span>当前</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-neutral-300 bg-white relative flex items-center justify-center">
                    <span className="absolute top-[0px] right-[0px] w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  </div>
                  <span>标记</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmitAnswering}
                className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white py-3 font-bold shadow-lg shadow-orange-500/10 rounded-[4px] transition-all text-sm cursor-pointer"
              >
                提交作业
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowStudentAnswering(false)}
                className="w-full mt-3 border-neutral-300 hover:text-[#fa541c] hover:border-orange-200 hover:bg-[#fa541c]/5 py-3 font-bold rounded-[4px] transition-all text-sm cursor-pointer"
              >
                退出试卷
              </Button>
            </div>
          </div>
        </div>

        {/* 提交答案 Drawer */}
        {isSubmitAnswerDrawerOpen && createPortal(
          <div 
            className="fixed inset-0 z-[400] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
            onClick={() => setIsSubmitAnswerDrawerOpen(false)}
          >
            <div 
              className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                  提交答案
                </h2>
                <button 
                  onClick={() => setIsSubmitAnswerDrawerOpen(false)} 
                  className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
                {/* 题目名称 */}
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-0.5">
                    题目名称 <span className="text-neutral-400 font-normal">：</span>
                  </label>
                  <div className="text-[13px] text-neutral-800 font-bold leading-normal">
                    {NEW_QUESTIONS[currentQuestionIdx]?.title}
                  </div>
                </div>

                {/* 上传答案文件 */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">
                    上传答案文件 <span className="text-neutral-400 font-normal">：</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="submit-answer-file-input"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedAnswerFile(file.name);
                        }
                      }}
                    />
                    <label
                      htmlFor="submit-answer-file-input"
                      className="border border-neutral-300 rounded-[4px] px-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 cursor-pointer text-xs text-neutral-600 transition-colors font-bold select-none"
                    >
                      选择文件
                    </label>
                    <span className="text-xs text-neutral-400">
                      {selectedAnswerFile || "未选择任何文件"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
                <Button 
                  onClick={() => setIsSubmitAnswerDrawerOpen(false)} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-6 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => {
                    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: true }));
                    setIsSubmitAnswerDrawerOpen(false);
                    alert("答案提交成功！");
                  }} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-6 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold flex items-center gap-1.5"
                >
                  <span>提交</span>
                  <span className="flex items-center justify-center bg-white text-[#fa541c] rounded w-4.5 h-4.5 text-[10px] font-bold shadow-sm">⚡</span>
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
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
          <div className="absolute right-32 top-1/2 -translate-y-1/2 z-10">
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

          {/* Title & Meta with Image on Left */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Left: Course Image */}
            <div className="z-10 shrink-0">
              <div className="w-[320px] h-[180px] rounded-xl overflow-hidden border-[6px] border-white shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src="https://picsum.photos/seed/python/640/360" 
                  alt="Python Course Cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold text-neutral-title">Python 基础</h1>
                <Button 
                  className="bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe4d3] border border-[#ffbb96] shadow-sm h-8.5 px-4 text-[13px] flex items-center gap-1.5 shrink-0 rounded-[8px] self-start sm:self-auto"
                  onClick={() => setShowReportModal(true)}
                >
                  <span className="text-[14px]">✨</span> 生成个性化学习报告
                </Button>
              </div>
              
              <div className="flex items-center gap-8 text-[14px] text-neutral-body mb-6">
                <div>课程学时 <span className="font-medium text-neutral-title ml-2">5 章节 | 5 课节 | 180 分钟</span></div>
              </div>

              <div>
                <button 
                  onClick={() => setIsJoined(!isJoined)}
                  className={cn(
                    "flex items-center gap-2 px-8 py-3 rounded-[8px] font-bold text-[15px] shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer",
                    isJoined 
                      ? "bg-[#52c41a] hover:bg-[#73d13d] text-white shadow-[#52c41a]/20 hover:shadow-[#52c41a]/30" 
                      : "bg-gradient-to-r from-[#fa541c] to-[#ff7a45] hover:from-[#ff7a45] hover:to-[#ff9c6e] text-white shadow-[#fa541c]/20 hover:shadow-[#fa541c]/30"
                  )}
                >
                  {isJoined ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      已加入，开始学习
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      加入课程
                    </>
                  )}
                </button>
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
              <h2 className="text-lg font-bold text-neutral-title mb-4">课程目录</h2>
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
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span><span className="font-bold text-neutral-title">{chapter.videos}</span> 个教学课件</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-[#fa541c]" />
                        <span><span className="font-bold text-neutral-title">{chapter.docs}</span> 个实验课件</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-blue-500" />
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

                              <div className={cn(
                                "w-6 h-6 rounded flex items-center justify-center shrink-0",
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
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {[
                {
                  id: 1,
                  title: "1.  黑白棋(Mini AlphaGo)",
                  deadline: "截止时间 2099/02/28 00:00",
                  objectiveCount: "1. 客观题 3 道，共 3 分",
                  objectiveTypes: "客观题包括：单选题、填空题、简答题",
                  practicalCount: "1. 实训题 2 道，共 20 分",
                  practicalTypes: "实训题包括：1、搭建AI 聊天助手智能体、2、人脸识别",
                  instructions: "作业说明：答题时间：2026/04/20 14:02:16 – 2026/05/12 23:59:00 ， 可在发布作业后 22 天 内分多次进入答题仅支持提交一次答案，请提前合理安排时间"
                },
                {
                  id: 2,
                  title: "2.  手写数字识别与垃圾分类",
                  deadline: "截止时间 2099/02/28 00:00",
                  objectiveCount: "1. 客观题 3 道，共 3 分",
                  objectiveTypes: "客观题包括：单选题、填空题、简答题",
                  practicalCount: "1. 实训题 2 道，共 20 分",
                  practicalTypes: "实训题包括：1、搭建AI 聊天助手智能体、2、人脸识别",
                  instructions: "作业说明：答题时间：2026/04/20 14:02:16 – 2026/05/12 23:59:00 ， 可在发布作业后 22 天 内分多次进入答题仅支持提交一次答案，请提前合理安排时间"
                }
              ].map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-[16px] shadow-sm border border-neutral-100/60 p-6 flex flex-col gap-4">
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="text-[16px] font-bold text-neutral-title">{assignment.title}</span>
                    <span className="text-[13px] text-neutral-caption">{assignment.deadline}</span>
                  </div>

                  {/* Inner Box with light grey background */}
                  <div className="bg-[#fafafa] rounded-[12px] p-5 border border-neutral-100 flex flex-col gap-5 text-[14px]">
                    {/* Objective Questions Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-title flex items-center gap-2">
                          <span className="w-1.5 h-3.5 bg-[#fa541c] rounded-full"></span>
                          客观题
                        </span>
                        <Button 
                          onClick={() => {
                            setShowStudentAnswering(true);
                            setAnsweringAnswers({});
                          }}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-5 h-8.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1"
                        >
                          开始答题
                        </Button>
                      </div>
                      <div className="pl-3.5 space-y-1">
                        <div className="text-neutral-title font-medium">{assignment.objectiveCount}</div>
                        <div className="text-[12px] text-neutral-caption">{assignment.objectiveTypes}</div>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-150/70"></div>

                    {/* Practical Questions Section */}
                    <div className="space-y-2">
                      <span className="font-bold text-neutral-title flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-blue-500 rounded-full"></span>
                        实训题
                      </span>
                      <div className="pl-3.5 space-y-1">
                        <div className="text-neutral-title font-medium">{assignment.practicalCount}</div>
                        <div className="text-[12px] text-neutral-caption">{assignment.practicalTypes}</div>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-150/70"></div>

                    {/* Instructions Section */}
                    <div className="text-[12px] text-neutral-body leading-relaxed pl-3.5">
                      <span className="font-bold text-neutral-title">作业说明：</span>
                      {assignment.instructions.replace("作业说明：", "")}
                    </div>
                  </div>
                </div>
              ))}
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
                        {chapter.lessons.filter(l => isTeacher || l.type !== 'assignment').map((lesson, idx) => {
                          const isActive = lesson.title === playingLesson.title;
                          const isMenuOpen = activeLessonMenu?.cIdx === i && activeLessonMenu?.lIdx === idx;
                          return (
                            <div 
                              key={idx} 
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-r-2 relative group",
                                isActive ? "bg-[#fff2e8] text-[#fa541c] border-[#fa541c]" : "text-neutral-body hover:bg-neutral-100 border-transparent",
                                lesson.locked && "opacity-50 cursor-not-allowed hover:bg-transparent",
                                isMenuOpen ? "z-20" : "z-10"
                              )}
                              onClick={() => {
                                if (!lesson.locked) {
                                  setPlayingLesson({ title: lesson.title, type: lesson.type });
                                  setIsExperimentStarted(false);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2.5 w-full pr-4">
                                <span className={cn("shrink-0", isActive ? "text-[#fa541c] font-medium" : "text-neutral-body")}>{i + 1}-{idx + 1}</span>
                                <div className={cn(
                                  "w-6 h-6 rounded flex items-center justify-center shrink-0",
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
                                ) : null
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
