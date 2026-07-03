import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  FileText,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Check,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradingTask {
  id: number;
  examName: string;
  sessionName: string;
  roomName: string;
  time: string;
  gradedCount: number;
  pendingCount: number;
}

interface StudentSubmission {
  id: number;
  name: string;
  account: string;
  status: '已交卷' | '未交卷' | '进行中';
  gradedStatus: '已批阅' | '未批阅' | '批阅中';
  score: number | null;
}

interface PreviewQuestion {
  id: string;
  title: string;
  options?: string[];
  content?: string;
}

const mockPreviewQuestions: Record<'单选题' | '多选题' | '简答题' | '实训编程题', PreviewQuestion[]> = {
  '单选题': [
    { id: 'preview-s-1', title: '以下哪个选项是人工智能的核心要素？', options: ['A. 算力、算法、数据', 'B. 硬件、外设、网络', 'C. 显示器、显卡、内存', 'D. 键盘、鼠标、系统'] },
    { id: 'preview-s-2', title: '深度学习主要基于以下哪种数学架构？', options: ['A. 人工神经网络', 'B. 线性规划方程', 'C. 拓扑同构映射', 'D. 离散傅里叶变换'] },
    { id: 'preview-s-3', title: '在Python中，用于多维数组科学计算的核心库是：', options: ['A. NumPy', 'B. Matplotlib', 'C. requests', 'D. Django'] },
    { id: 'preview-s-4', title: '下列哪个模型不属于生成式人工智能（Generative AI）？', options: ['A. SVM分类器', 'B. Generative Adversarial Networks (GAN)', 'C. GPT-4', 'D. Stable Diffusion'] },
    { id: 'preview-s-5', title: '机器学习中“过拟合”通常是指：', options: ['A. 模型在训练集表现极好但在测试集表现较差', 'B. 模型完全无法收敛', 'C. 模型在测试集表现极好而在训练集表现一般', 'D. 模型算力要求太高无法运行'] },
    { id: 'preview-s-6', title: '梯度下降算法的核心作用是：', options: ['A. 最小化目标损失函数', 'B. 加大神经元偏差权重', 'C. 清理无用训练数据集', 'D. 提高训练数据读取速率'] },
    { id: 'preview-s-7', title: '在自然语言处理中，NLP的缩写是：', options: ['A. Natural Language Processing', 'B. Network Link Protocol', 'C. Next Line Program', 'D. Neural Linear Path'] },
    { id: 'preview-s-8', title: '卷积神经网络（CNN）常用于以下哪一领域的研究？', options: ['A. 计算机视觉与图像识别', 'B. 金融大数据曲线预测', 'C. 关系型数据库结构优化', 'D. 多线程系统调度分配'] },
    { id: 'preview-s-9', title: '大模型微调中常用的高效微调（PEFT）技术是：', options: ['A. LoRA (Low-Rank Adaptation)', 'B. Batch Normalization', 'C. Learning Rate Decay', 'D. Grid Search Tuning'] },
    { id: 'preview-s-10', title: '神经网络的隐藏层节点中起激活作用的非线性函数叫：', options: ['A. 激活函数 (Activation Function)', 'B. 归一化函数', 'C. 聚类核函数', 'D. 正则化权重'] }
  ],
  '多选题': [
    { id: 'preview-m-1', title: '以下哪些算法属于无监督学习算法？（多选）', options: ['A. K-means聚类算法', 'B. PCA主成分分析', 'C. 支持向量机SVM', 'D. 逻辑回归Logistic Regression'] },
    { id: 'preview-m-2', title: '深度学习常用的优化器包括以下哪些？（多选）', options: ['A. SGD', 'B. Adam', 'C. RMSprop', 'D. KMeans'] },
    { id: 'preview-m-3', title: '在大模型训练中，常用的评估指标包含以下哪些？（多选）', options: ['A. BLEU Score', 'B. ROUGE Score', 'C. Perplexity (PPL)', 'D. F1-Score'] },
    { id: 'preview-m-4', title: 'PyTorch框架的主要特点有：（多选）', options: ['A. 采用动态计算图设计', 'B. 与Python完美契合集成', 'C. 支持GPU算力加速', 'D. 完全不需要编写任何代码'] },
    { id: 'preview-m-5', title: '常见的卷积神经网络架构包括哪些？（多选）', options: ['A. ResNet', 'B. VGG', 'C. LeNet', 'D. ARIMA'] }
  ],
  '简答题': [
    { id: 'preview-e-1', title: '请简述在大语言模型（LLM）微调（Fine-tuning）中，为什么通常需要引入人类反馈强化学习（RLHF）阶段？它的核心作用是什么？' },
    { id: 'preview-e-2', title: '解释什么是残差连接（Residual Connection），以及它如何有效解决深度神经网络在训练过程中的梯度消失（Vanishing Gradient）问题？' }
  ],
  '实训编程题': [
    { 
      id: 'preview-c-1', 
      title: '【Python 实训】基于人工神经网络算法 of 图像分类实践',
      content: "一、实验主题\n基于人工神经网络算法 of 图像分类实践\n\n二、实验目的\n掌握有监督学习的基本概念与人工神经网络的核心原理；\n学会使用torchvision库加载手写数字数据集并进行数据预处理；\n学会运用pytorch构建卷积神经网络模型，掌握模型结构的设置方法；\n掌握运用交叉验证、网格搜索等技术实现模型调优，提升模型泛化能力；\n掌握运用准确率、精确率、召回率、F1-score指标评估模型性能的方法；\n能够处理神经网络训练过程中的结构设置、参数调优和防止过拟合等常见问题，提升对有监督学习任务的理解和实际问题分析能力。\n\n三、实验内容\n安装pytorch和torchvision，并导入torch、torchvision、matplotlib、sklearn库；\n运用torch和torchvision实现计算单元设置和数据预处理；\n运用pytorch构建循环神经网络模型，包括卷积层、池化层 and 全连接层；\n运用交叉验证、网格搜索技术实现卷积神经网络超参数调优，提升模型性能；\n运用准确率、精确率、召回率、F1-score指标评估模型性能；\n可视化展示最佳模型预测结果。"
    }
  ]
};

export default function TeacherGrading() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Candidates search query inside drawer
  const [candQuery, setCandQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Candidates drawer pagination states
  const [drawerPage, setDrawerPage] = useState(1);
  const [drawerPageSize, setDrawerPageSize] = useState(5);

  // Mock Grading Tasks Data
  const [tasksList, setTasksList] = useState<GradingTask[]>([
    { id: 1, examName: '2026年春季学期人工智能导论期末考', sessionName: 'AI导论-A班场', roomName: '博学楼计算中心301', time: '2026/06/12 10:00 - 12:00', gradedCount: 42, pendingCount: 3 },
    { id: 2, examName: '机器学习核心算法阶段性测验', sessionName: '机器学习-随堂测', roomName: '线上考场-防作弊监考', time: '2026/06/18 14:00 - 15:30', gradedCount: 28, pendingCount: 0 },
    { id: 3, examName: '大语言模型应用开发实训赛', sessionName: 'LLM应用开发竞赛场', roomName: '天翼云虚拟算力中心', time: '2026/06/25 09:00 - 11:30', gradedCount: 15, pendingCount: 12 },
    { id: 4, examName: '深度学习神经网络架构随堂考', sessionName: '深度学习-B班场', roomName: '求是楼402多媒体教室', time: '2026/06/28 16:00 - 17:30', gradedCount: 0, pendingCount: 35 },
    { id: 5, examName: 'Python数据分析实训考查', sessionName: '数据分析-重修场', roomName: '实验楼501机房', time: '2026/06/29 19:00 - 21:00', gradedCount: 8, pendingCount: 2 }
  ]);

  // Drawer details state for "批阅"
  const [selectedTask, setSelectedTask] = useState<GradingTask | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Sub-Drawer states for single student grading
  const [gradingStudent, setGradingStudent] = useState<StudentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  // View exam states
  const [viewExamStudent, setViewExamStudent] = useState<StudentSubmission | null>(null);
  
  // Status Change Modal states
  const [statusModalStudent, setStatusModalStudent] = useState<StudentSubmission | null>(null);
  const [tempStatus, setTempStatus] = useState<StudentSubmission['gradedStatus']>('未批阅');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Preview Mode states
  const [previewModeActive, setPreviewModeActive] = useState(false);
  const [previewQuestionType, setPreviewQuestionType] = useState<'单选题' | '多选题' | '简答题' | '实训编程题'>('单选题');
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  const [countdownSeconds, setCountdownSeconds] = useState(7189); // 01:59:49

  // Toast Notification states
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Preview timer countdown
  React.useEffect(() => {
    if (!previewModeActive) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [previewModeActive]);

  const formatCountdown = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter Tasks
  const filteredTasks = tasksList.filter(t => 
    t.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Candidates inside drawer
  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(candQuery.toLowerCase()) ||
    sub.account.toLowerCase().includes(candQuery.toLowerCase())
  );

  // Pagination calculations
  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / pageSize) || 1;
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Candidates pagination calculations
  const totalDrawerItems = filteredSubmissions.length;
  const totalDrawerPages = Math.ceil(totalDrawerItems / drawerPageSize) || 1;
  const paginatedSubmissions = filteredSubmissions.slice((drawerPage - 1) * drawerPageSize, drawerPage * drawerPageSize);

  // Handle open grading drawer
  const handleOpenGrading = (task: GradingTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
    setCandQuery('');
    setDrawerPage(1);
    
    // Generate mock submissions for the selected task matching target screenshots
    const mockSubs: StudentSubmission[] = [
      { id: 101, name: '2', account: 't********j', status: '已交卷', gradedStatus: '未批阅', score: 0 },
      { id: 102, name: '陈小明', account: 't2026010045a', status: '已交卷', gradedStatus: '已批阅', score: 4 },
      { id: 103, name: '林静媛', account: 't2026010067b', status: '已交卷', gradedStatus: '批阅中', score: 0 },
      { id: 104, name: '王志军', account: 't2026010082c', status: '已交卷', gradedStatus: '未批阅', score: 0 },
      { id: 105, name: '李瑞杰', account: 't2026010103d', status: '已交卷', gradedStatus: '已批阅', score: 3 }
    ];
    setSubmissions(mockSubs);
  };

  // Open single student grading dialog
  const handleStartGrade = (student: StudentSubmission) => {
    if (student.status !== '已交卷') {
      showToast('该考生尚未交卷，无法批阅', 'error');
      return;
    }
    setGradingStudent(student);
    setScoreInput(student.score !== null ? student.score.toString() : '0');
    setCommentInput('');
  };

  // Refresh candidates handler
  const handleRefreshCandidates = () => {
    setCandQuery('');
    showToast('已刷新数据', 'success');
  };

  // View exam handler
  const handleViewExam = (sub: StudentSubmission) => {
    setViewExamStudent(sub);
  };

  // Save single student score
  const handleSaveScore = () => {
    if (!scoreInput.trim() || isNaN(Number(scoreInput))) {
      showToast('请输入有效的分数', 'error');
      return;
    }
    const scoreVal = Number(scoreInput);
    if (scoreVal < 0 || scoreVal > 4) {
      showToast('分数必须在 0 到 4 之间', 'error');
      return;
    }

    // Update submissions list
    const updatedSubs = submissions.map(sub => 
      sub.id === gradingStudent!.id 
        ? { ...sub, gradedStatus: '已批阅' as const, score: scoreVal } 
        : sub
    );
    setSubmissions(updatedSubs);

    // Update parent tasks counters
    if (selectedTask) {
      const isNewlyGraded = gradingStudent!.gradedStatus !== '已批阅';
      setTasksList(tasksList.map(t => 
        t.id === selectedTask.id 
          ? { 
              ...t, 
              gradedCount: isNewlyGraded ? t.gradedCount + 1 : t.gradedCount,
              pendingCount: isNewlyGraded ? Math.max(0, t.pendingCount - 1) : t.pendingCount
            } 
          : t
      ));
      
      // Sync selected task counter
      setSelectedTask({
        ...selectedTask,
        gradedCount: isNewlyGraded ? selectedTask.gradedCount + 1 : selectedTask.gradedCount,
        pendingCount: isNewlyGraded ? Math.max(0, selectedTask.pendingCount - 1) : selectedTask.pendingCount
      });
    }

    showToast(`已成功录入考生 ${gradingStudent!.name} 的成绩：${scoreVal}分`, 'success');
    setGradingStudent(null);
  };

  // Save grading status and details
  const handleSaveStatus = () => {
    if (!statusModalStudent || !tempStatus) return;

    let finalScore: number | null = statusModalStudent.score;

    if (tempStatus === '已批阅') {
      if (finalScore === null || finalScore === 0) {
        finalScore = 4;
      }
    } else {
      finalScore = null;
    }

    const oldStatus = statusModalStudent.gradedStatus;
    const newStatus = tempStatus;

    // Update submissions list
    const updatedSubs = submissions.map(sub => 
      sub.id === statusModalStudent.id 
        ? { ...sub, gradedStatus: newStatus, score: finalScore } 
        : sub
    );
    setSubmissions(updatedSubs);

    // Update parent tasks counters
    if (selectedTask) {
      let gradedDiff = 0;
      let pendingDiff = 0;

      // Old is not graded, new is graded
      if (oldStatus !== '已批阅' && newStatus === '已批阅') {
        gradedDiff = 1;
        pendingDiff = -1;
      }
      // Old is graded, new is not graded
      else if (oldStatus === '已批阅' && newStatus !== '已批阅') {
        gradedDiff = -1;
        pendingDiff = 1;
      }

      if (gradedDiff !== 0 || pendingDiff !== 0) {
        setTasksList(tasksList.map(t => 
          t.id === selectedTask.id 
            ? { 
                ...t, 
                gradedCount: t.gradedCount + gradedDiff,
                pendingCount: Math.max(0, t.pendingCount + pendingDiff)
              } 
            : t
        ));
        
        // Sync selected task counter
        setSelectedTask({
          ...selectedTask,
          gradedCount: selectedTask.gradedCount + gradedDiff,
          pendingCount: Math.max(0, selectedTask.pendingCount + pendingDiff)
        });
      }
    }

    showToast(`已成功变更考生 ${statusModalStudent.name} 的批阅状态为：${newStatus}`, 'success');
    setStatusModalStudent(null);
  };

  if (previewModeActive) {
    const curQuestions = mockPreviewQuestions[previewQuestionType];
    const curQuestion = curQuestions[previewQuestionIdx];
    const hasPrev = previewQuestionIdx > 0;
    const hasNext = previewQuestionIdx < curQuestions.length - 1;

    const handleOptionClick = (optionStr: string) => {
      const questionId = curQuestion.id;
      if (previewQuestionType === '单选题') {
        setPreviewAnswers({ ...previewAnswers, [questionId]: optionStr });
      } else {
        const curSelections = (previewAnswers[questionId] as string[]) || [];
        if (curSelections.includes(optionStr)) {
          setPreviewAnswers({
            ...previewAnswers,
            [questionId]: curSelections.filter(o => o !== optionStr)
          });
        } else {
          setPreviewAnswers({
            ...previewAnswers,
            [questionId]: [...curSelections, optionStr]
          });
        }
      }
    };

    const isOptionSelected = (optionStr: string) => {
      const questionId = curQuestion.id;
      const ans = previewAnswers[questionId];
      if (!ans) return false;
      if (previewQuestionType === '单选题') {
        return ans === optionStr;
      } else {
        return (ans as string[]).includes(optionStr);
      }
    };

    return (
      <div className="fixed inset-0 z-[300] bg-[#f5f5f5] flex flex-col font-sans text-neutral-800 animate-fade-in text-[13px]">
        {/* Header Bar */}
        <div className="h-[56px] bg-white border-b border-neutral-200/60 px-6 flex justify-between items-center shrink-0 text-left">
          {/* Left Side */}
          <div className="flex items-center gap-4 select-none">
            <button 
              onClick={() => setPreviewModeActive(false)}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 font-medium transition-colors border-0 bg-transparent cursor-pointer p-0 text-[13px]"
            >
              <ArrowLeft className="w-4 h-4" />
              退出
            </button>
            <div className="w-[1px] h-4 bg-neutral-200"></div>
            <span className="font-bold text-neutral-800 text-[14px]">
              {selectedTask?.examName || 'Python 编程进阶阶段测试'}
            </span>
          </div>

          {/* Middle Side */}
          <div className="hidden md:flex items-center gap-2 text-[#52c41a] font-medium text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>系统已于 11:10:00 自动保存</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Timer Box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded px-3 py-1.5 flex items-center gap-2 font-mono text-[14px] font-bold text-neutral-700 select-none">
              <span className="text-neutral-400 font-normal text-xs">⏱</span>
              <span>{formatCountdown(countdownSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 mt-[20px] px-6 pb-6 relative z-20 overflow-hidden flex flex-col">
          <div className="max-w-[1400px] w-full mx-auto flex flex-1 bg-white border border-neutral-200/80 shadow-lg rounded-xl overflow-hidden min-h-[600px] h-[calc(100vh-14rem)]">
            {/* Left Answering Area */}
            <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
              {/* Scrollable Question Content */}
              <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4 text-left">


                {/* Question Type and Score */}
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[15px] font-bold text-neutral-800">
                    {previewQuestionIdx + 1}、{previewQuestionType} <span className="text-[13px] text-neutral-400 font-normal ml-1">({previewQuestionType === '单选题' ? '1' : previewQuestionType === '多选题' ? '2' : previewQuestionType === '简答题' ? '15' : '40'}分)</span>
                  </div>
                </div>

                {/* Question Body */}
                <div className="text-neutral-800 mb-6 text-[15px] font-bold leading-relaxed">
                  {curQuestion.title}
                </div>

                {/* Options / Textarea depending on question type */}
                {curQuestion.options ? (
                  <div className="space-y-3 max-w-[800px]">
                    {curQuestion.options.map((opt, oIdx) => {
                      return (
                        <div
                          key={oIdx}
                          className="px-5 py-4 border border-neutral-200 rounded-[4px] bg-neutral-50/30 cursor-default select-none text-[14px] text-neutral-600 font-medium text-left"
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                ) : previewQuestionType === '实训编程题' ? (
                  <div className="space-y-4 max-w-[900px] text-left pt-2">
                    <div className="border border-neutral-200 rounded-lg p-5 bg-white overflow-y-auto max-h-[48vh] text-[13px] leading-relaxed text-neutral-600 shadow-xs">
                      <div className="whitespace-pre-wrap font-medium space-y-1">
                        {curQuestion.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 text-left max-w-[900px]">
                    <span className="text-xs font-semibold text-neutral-500 block">您的回答：</span>
                    <textarea
                      value={(previewAnswers[curQuestion.id] as string) || ''}
                      onChange={(e) => setPreviewAnswers({ ...previewAnswers, [curQuestion.id]: e.target.value })}
                      placeholder="请输入您的回答..."
                      className="w-full border border-neutral-200 rounded-md p-4 text-xs focus:outline-none focus:border-neutral-300 transition-all bg-white text-neutral-800 resize-none font-sans h-36"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between px-10 py-5 border-t border-neutral-100 bg-white shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10">
                <Button
                  variant="outline"
                  disabled={!hasPrev}
                  onClick={() => setPreviewQuestionIdx(idx => idx - 1)}
                  className="border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-6 h-9.5 text-[13px] font-bold rounded-[4px]"
                >
                  上一题
                </Button>
                
                <div className="flex items-center gap-3">
                  {previewQuestionType === '实训编程题' && (
                    <Button 
                      disabled
                      variant="outline"
                      className="border-neutral-200 text-neutral-400 bg-neutral-50 opacity-60 px-6 h-9.5 text-[13px] font-bold rounded-[4px] cursor-not-allowed flex items-center gap-1.5"
                    >
                      开始答题
                    </Button>
                  )}
                  
                  {hasNext && (
                    <Button 
                      onClick={() => setPreviewQuestionIdx(idx => idx + 1)}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      下一题
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar navigation */}
            <div className="w-80 border-l border-neutral-200 flex flex-col bg-white px-6 pt-8 pb-6 shrink-0 justify-between h-full text-left">
              <div className="overflow-y-auto flex-1 no-scrollbar space-y-6">
                {/* Teacher Mode Alert */}
                <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fa541c]/10 flex items-center justify-center text-[#fa541c] font-bold shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-neutral-800">教师预览模式</div>
                    <div className="text-[11px] text-neutral-400">正在参考学生答题界面</div>
                  </div>
                </div>

                {/* Sidebar navigations for all types */}
                <div className="space-y-5 pt-4">
                  {/* Single Choice Nav */}
                  {previewQuestionType === '单选题' && (
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">单选题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {mockPreviewQuestions.单选题.map((_, index) => {
                          const isActive = previewQuestionType === '单选题' && previewQuestionIdx === index;
                          const hasAnswer = !!previewAnswers[`preview-s-${index + 1}`];
                          return (
                            <div 
                              key={index}
                              onClick={() => {
                                setPreviewQuestionType('单选题');
                                setPreviewQuestionIdx(index);
                              }}
                              className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative",
                                isActive
                                  ? "bg-[#fa541c] border-[#fa541c] text-white font-bold animate-scale-up"
                                  : "border-[#fa541c]/30 bg-[#fa541c]/5 text-[#fa541c] hover:bg-[#fa541c]/10 hover:border-[#fa541c]/50"
                              )}
                            >
                              {index + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Multiple Choice Nav */}
                  {previewQuestionType === '多选题' && (
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">多选题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {mockPreviewQuestions.多选题.map((_, index) => {
                          const isActive = previewQuestionType === '多选题' && previewQuestionIdx === index;
                          const hasAnswer = (previewAnswers[`preview-m-${index + 1}`] as string[])?.length > 0;
                          return (
                            <div 
                              key={index}
                              onClick={() => {
                                setPreviewQuestionType('多选题');
                                setPreviewQuestionIdx(index);
                              }}
                              className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative",
                                isActive
                                  ? "bg-[#fa541c] border-[#fa541c] text-white font-bold animate-scale-up"
                                  : "border-[#fa541c]/30 bg-[#fa541c]/5 text-[#fa541c] hover:bg-[#fa541c]/10 hover:border-[#fa541c]/50"
                              )}
                            >
                              {index + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Short Essay Nav */}
                  {previewQuestionType === '简答题' && (
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">简答题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {mockPreviewQuestions.简答题.map((_, index) => {
                          const isActive = previewQuestionType === '简答题' && previewQuestionIdx === index;
                          const hasAnswer = !!previewAnswers[`preview-e-${index + 1}`];
                          return (
                            <div 
                              key={index}
                              onClick={() => {
                                setPreviewQuestionType('简答题');
                                setPreviewQuestionIdx(index);
                              }}
                              className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative",
                                isActive
                                  ? "bg-[#fa541c] border-[#fa541c] text-white font-bold animate-scale-up"
                                  : "border-[#fa541c]/30 bg-[#fa541c]/5 text-[#fa541c] hover:bg-[#fa541c]/10 hover:border-[#fa541c]/50"
                              )}
                            >
                              {index + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coding Nav */}
                  {previewQuestionType === '实训编程题' && (
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">实训编程题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {mockPreviewQuestions.实训编程题.map((_, index) => {
                          const isActive = previewQuestionType === '实训编程题' && previewQuestionIdx === index;
                          const hasAnswer = !!previewAnswers[`preview-c-${index + 1}`];
                          return (
                            <div 
                              key={index}
                              onClick={() => {
                                setPreviewQuestionType('实训编程题');
                                setPreviewQuestionIdx(index);
                              }}
                              className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative",
                                isActive
                                  ? "bg-[#52c41a] border-[#52c41a] text-white font-bold animate-scale-up"
                                  : "border-[#52c41a]/30 bg-[#52c41a]/5 text-[#389e0d] hover:bg-[#52c41a]/10 hover:border-[#52c41a]/50"
                              )}
                            >
                              {index + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend & Submission */}
              <div className="border-t border-neutral-100 pt-5 mt-4">
                <div className="flex items-center justify-around text-[12px] text-neutral-400 mb-5">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-4.5 h-4.5 rounded-full border border-neutral-300 bg-white"></div>
                    <span>未看</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-[#fa541c] bg-white ring-2 ring-[#fa541c]/15"></div>
                    <span>当前</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setPreviewModeActive(false)}
                  className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white py-3 font-bold shadow-lg shadow-orange-500/10 rounded-[4px] transition-all text-sm cursor-pointer border-0"
                >
                  退出预览
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-white border border-neutral-100 shadow-xl rounded-lg px-4 py-3 flex items-center gap-2 animate-bounce-short text-left">
          <div className={cn(
            "w-2 h-2 rounded-full",
            toastMessage.type === 'success' ? "bg-green-500" : toastMessage.type === 'error' ? "bg-red-500" : "bg-blue-500"
          )}></div>
          <span className="text-sm font-bold text-neutral-800">{toastMessage.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4 text-left">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">批阅管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">主客观题人工批改与反馈进度管理</p>
        </div>
      </div>

      {/* Table and Toolbar unified module */}
      <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden text-left">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="请输入要搜索的考试/场次"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
            <thead>
              <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none">
                <th className="pl-6 pr-3 py-3.5 font-medium text-left bg-transparent">考试名称</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">场次名称</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">考场</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">考试时间</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">已批阅人数</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">待批阅人数</th>
                <th className="pl-3 pr-6 py-3.5 font-medium text-center bg-transparent w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task, idx) => (
                  <tr 
                    key={task.id} 
                    className={cn(
                      "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                      idx === paginatedTasks.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="pl-6 pr-3 py-3.5 font-medium text-neutral-850 max-w-[220px] truncate" title={task.examName}>
                      {task.examName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-650 max-w-[150px] truncate" title={task.sessionName}>
                      {task.sessionName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-550 max-w-[150px] truncate" title={task.roomName}>
                      {task.roomName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-500 font-mono">
                      {task.time}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-neutral-700">
                      <span className="text-[#52c41a]">{task.gradedCount}</span>
                    </td>
                    <td className="px-3 py-3.5 font-medium">
                      {task.pendingCount > 0 ? (
                        <span className="text-[#fa541c] font-bold">{task.pendingCount}</span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>
                    <td className="pl-3 pr-6 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenGrading(task)}
                        className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap"
                      >
                        批阅
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 bg-white select-none">
                    暂无待批阅的考试场次
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar matching Course management list styles */}
        {totalTasks > 0 && (
          <div className="flex items-center justify-end px-6 py-4 border-t border-neutral-border/30 select-none bg-neutral-50/20 gap-4">
            <span className="text-[13px] text-neutral-500">
              共 {totalTasks} 条
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                &lt;
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button 
                  key={pageNum}
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-7 w-7 p-0 rounded-sm font-bold text-[12px] cursor-pointer",
                    currentPage === pageNum 
                      ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#fa541c] hover:text-white" 
                      : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                  )}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                &gt;
              </Button>
            </div>
            <select 
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>{size} 条/页</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grading Workspace Drawer (Right Side) */}
      {isDrawerOpen && selectedTask && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[720px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#fa541c]" /> 
                  批阅控制台 - {selectedTask.examName}
                </h2>
                <p className="text-[11px] text-neutral-400">场次：{selectedTask.sessionName} | 考场：{selectedTask.roomName}</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidates Submission List */}
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4 custom-scrollbar flex flex-col">
              {/* Filter row */}
              <div className="flex justify-between items-center select-none gap-4">
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    value={candQuery}
                    onChange={(e) => {
                      setCandQuery(e.target.value);
                      setDrawerPage(1);
                    }}
                    className="pl-9 pr-4 py-1.5 w-full bg-white border border-neutral-border rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-8"
                  />
                </div>
                <Button
                  onClick={handleRefreshCandidates}
                  variant="outline"
                  className="border border-neutral-200 text-neutral-500 rounded-[4px] h-8 w-8 p-0 flex items-center justify-center bg-white hover:bg-neutral-50 cursor-pointer shrink-0"
                  title="刷新"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Table */}
              <div className="w-full overflow-y-auto border border-neutral-100 rounded-[8px] bg-white custom-scrollbar max-h-[380px]">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium sticky top-0 z-10 select-none">
                      <th className="p-3 pl-4">账号</th>
                      <th className="p-3">姓名</th>
                      <th className="p-3 text-center">批阅状态</th>
                      <th className="p-3 text-center">得分 / 总分</th>
                      <th className="p-3 text-center pr-4 w-36">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {paginatedSubmissions.length > 0 ? (
                      paginatedSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-3 pl-4 text-neutral-800 font-mono">{sub.account}</td>
                          <td className="p-3 font-semibold text-neutral-800">{sub.name}</td>
                          <td className="p-3 text-center">
                            <span className={cn(
                              "px-1.5 py-0.5 text-[10px] rounded border font-medium select-none",
                              sub.gradedStatus === '已批阅' 
                                ? "bg-green-50 text-green-600 border-green-200" 
                                : sub.gradedStatus === '批阅中'
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : "bg-neutral-50 text-neutral-500 border-neutral-200"
                            )}>
                              {sub.gradedStatus}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-neutral-600 font-medium">
                            {sub.score !== null ? `${sub.score} / 4` : '0 / 4'}
                          </td>
                          <td className="p-3 text-center pr-4">
                            <div className="flex items-center justify-center gap-1 text-neutral-300 select-none">
                              <button
                                onClick={() => handleViewExam(sub)}
                                className="text-xs text-[#fa541c] hover:underline transition-colors border-0 bg-transparent p-0 cursor-pointer font-medium"
                              >
                                查看试卷
                              </button>
                              <span className="mx-1.5 text-neutral-200">|</span>
                              <button
                                onClick={() => {
                                  setStatusModalStudent(sub);
                                  setTempStatus(sub.gradedStatus);
                                  setStatusDropdownOpen(false);
                                }}
                                className="text-xs text-[#fa541c] hover:underline transition-colors border-0 bg-transparent p-0 cursor-pointer font-medium"
                              >
                                变更批阅状态
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-400 bg-white select-none">
                          没有找到符合条件的考生
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Drawer Pagination */}
              {totalDrawerItems > 0 && (
                <div className="flex items-center justify-end px-6 py-4 select-none bg-neutral-50/20 gap-4 mt-2 rounded-[8px]">
                  <span className="text-[13px] text-neutral-500">
                    共 {totalDrawerItems} 条
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={drawerPage === 1}
                      onClick={() => setDrawerPage(p => Math.max(1, p - 1))}
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalDrawerPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button 
                        key={pageNum}
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "h-7 w-7 p-0 rounded-sm font-bold text-[12px] cursor-pointer",
                          drawerPage === pageNum 
                            ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#fa541c] hover:text-white" 
                            : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                        )}
                        onClick={() => setDrawerPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={drawerPage === totalDrawerPages}
                      onClick={() => setDrawerPage(p => Math.min(totalDrawerPages, p + 1))}
                    >
                      &gt;
                    </Button>
                  </div>
                  <select 
                    value={drawerPageSize}
                    onChange={(e) => {
                      setDrawerPageSize(Number(e.target.value));
                      setDrawerPage(1);
                    }}
                    className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white"
                  >
                    {[5, 10, 20].map(size => (
                      <option key={size} value={size}>{size} 条/页</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end shrink-0">
              <Button 
                onClick={() => setIsDrawerOpen(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                关闭工作台
              </Button>
            </div>

            {/* Inner Sub-Drawer for Student Grading Panel */}
            {gradingStudent && (
              <div className="absolute inset-0 z-50 bg-black/45 flex justify-end animate-fade-in">
                <div className="bg-white w-full max-w-[460px] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#fa541c]" />
                      批阅：{gradingStudent.name} ({gradingStudent.account})
                    </h3>
                    <button 
                      onClick={() => setGradingStudent(null)} 
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <div className="p-6 flex-1 space-y-5 overflow-y-auto">
                    <div className="bg-[#fff7e6] border border-[#ffd591] text-[#d4380d] p-3.5 rounded-[4px] text-xs font-semibold">
                      请仔细核对该考生的实训云端运行状态与提交的代码包，确认无误后输入评分。
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1 select-none">
                        打分 (满分 4 分) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        placeholder="请输入考生成绩分数"
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1 select-none">
                        评语与反馈建议
                      </label>
                      <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="请输入对考生的主观评语或修改建议..."
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                    <Button 
                      onClick={() => setGradingStudent(null)} 
                      variant="outline"
                      className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleSaveScore}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
                    >
                      保存评分
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* View Exam Modal */}
      {viewExamStudent && (
        <div 
          className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-[2px] flex items-center justify-center animate-fade-in p-4 text-[13px]"
          onClick={() => setViewExamStudent(null)}
        >
          <div 
            className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#fa541c]" />
                查看试卷 - {viewExamStudent.name}
              </h3>
              <button 
                onClick={() => setViewExamStudent(null)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="border border-neutral-100 rounded-md overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-600 font-medium select-none whitespace-nowrap">
                      <th className="p-3 pl-4 w-16 whitespace-nowrap">序号</th>
                      <th className="p-3">题型</th>
                      <th className="p-3">题目数量</th>
                      <th className="p-3">总分值</th>
                      <th className="p-3 text-center pr-4">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {[
                      { id: 'single', name: '单选题', count: 10, totalPoints: 10 },
                      { id: 'multiple', name: '多选题', count: 5, totalPoints: 10 },
                      { id: 'essay', name: '简答题', count: 2, totalPoints: 30 },
                      { id: 'coding', name: '实训编程题', count: 1, totalPoints: 50 }
                    ].map((sec, idx) => (
                      <tr key={sec.id} className="hover:bg-neutral-50/40 transition-colors whitespace-nowrap">
                        <td className="p-3 pl-4 font-mono text-neutral-500 whitespace-nowrap">{idx + 1}</td>
                        <td className="p-3 font-semibold text-neutral-800">{sec.name}</td>
                        <td className="p-3 text-neutral-600">{sec.count} 题</td>
                        <td className="p-3 text-neutral-600">{sec.totalPoints} 分</td>
                        <td className="p-3 text-center pr-4">
                          <button
                            onClick={() => {
                              setPreviewQuestionType(sec.name as any);
                              setPreviewQuestionIdx(0);
                              setPreviewModeActive(true);
                              setViewExamStudent(null);
                            }}
                            className="text-xs text-[#fa541c] hover:text-[#e84a15] transition-colors border border-[#fa541c]/30 hover:border-[#fa541c] bg-transparent px-2.5 py-1 rounded-[4px] cursor-pointer font-medium"
                          >
                            预览
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end shrink-0">
              <Button 
                onClick={() => setViewExamStudent(null)} 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Grading Status Modal */}
      {statusModalStudent && (
        <div 
          className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-[2px] flex items-center justify-center animate-fade-in p-4 text-[13px]"
          onClick={() => {
            setStatusModalStudent(null);
            setStatusDropdownOpen(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-[450px] rounded-lg shadow-2xl flex flex-col overflow-visible animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 rounded-t-lg">
              <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#fa541c]" />
                变更批阅状态
              </h3>
              <button 
                onClick={() => {
                  setStatusModalStudent(null);
                  setStatusDropdownOpen(false);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: ONLY display status dropdown picker */}
            <div className="p-6 pb-8">
              {/* Form Layout matches single selection questions in TeacherQuestions.tsx */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 relative select-none">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  批阅状态 <span className="text-[#fa541c]">*</span>
                </label>
                
                <div className="relative w-full">
                  {/* Select Trigger Box */}
                  <div 
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none text-left text-xs",
                      statusDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(tempStatus ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {tempStatus || '请选择'}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", statusDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {/* Dropdown Options matching belonging bank style */}
                  {statusDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        {['未批阅', '批阅中', '已批阅'].map((option) => {
                          const isSelected = tempStatus === option;
                          return (
                            <div
                              key={option}
                              onClick={() => {
                                setTempStatus(option as any);
                                setStatusDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{option}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0 rounded-b-lg">
              <Button 
                onClick={() => {
                  setStatusModalStudent(null);
                  setStatusDropdownOpen(false);
                }} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveStatus}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
