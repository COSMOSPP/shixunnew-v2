import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Pin, Check, Plus, X, CheckCircle2, Monitor, Clock, User, Webcam } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import TeacherExperimentIDE from '@/pages/teacher/TeacherExperimentIDE';

interface ExamSessionProps {
  exam: any;
  onBack: () => void;
  onSubmit: () => void;
}

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
    options: ["A. 特征特征提取", "B. 降维", "C. 分类", "D. 数据增强"]
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
    content: "一、实验主题\n基于人工神经网络算法的图像分类实践\n\n二、实验目的\n掌握有监督学习的基本概念与人工神经网络的核心原理；\n学会使用torchvision库加载手写数字数据集并进行数据预处理；\n学会运用pytorch构建卷积神经网络模型，掌握模型结构的设置方法；\n掌握运用交叉验证、网格搜索等技术实现模型调优，提升模型泛化能力；\n掌握运用准确率、精确率、召回率、F1-score指标评估模型性能的方法；\n能够处理神经网络训练过程中的结构设置、参数调优和防止过拟合等常见问题，提升对有监督学习任务的理解 and 实际问题分析能力。\n\n三、实验内容\n安装pytorch和torchvision，并导入torch、torchvision、matplotlib、sklearn库；\n运用torch和torchvision实现计算单元设置和数据集预处理；\n运用pytorch构建循环神经网络模型，包括卷积层、池化层和全连接层；\n运用交叉验证、网格搜索技术实现卷积神经网络超参数调优，提升模型性能；\n运用准确率、精确率、召回率、F1-score指标评估模型性能；\n可视化展示最佳模型预测结果。"
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
  },
  {
    id: 19,
    type: "judge",
    typeName: "判断题",
    score: 2,
    title: "HTTP协议是基于TCP/IP协议之上的应用层协议。",
    options: ["正确", "错误"]
  },
  {
    id: 20,
    type: "judge",
    typeName: "判断题",
    score: 2,
    title: "有监督学习在训练过程中不需要带有标注的答案或标签。",
    options: ["正确", "错误"]
  },
  {
    id: 21,
    type: "blank",
    typeName: "填空题",
    score: 2,
    title: "Python 想要开启一个简单的 HTTP 服务，可以使用命令：python -m ____"
  },
  {
    id: 22,
    type: "blank",
    typeName: "填空题",
    score: 2,
    title: "在机器学习的分类任务中，模型最终输出的是离散的____。"
  },
  {
    id: 23,
    type: "essay",
    typeName: "简答题",
    score: 10,
    title: "请简述有监督学习和无监督学习的主要区别，并各举一个常见的算法实例。"
  },
  {
    id: 24,
    type: "essay",
    typeName: "简答题",
    score: 10,
    title: "请简要说明卷积神经网络中的池化层（Pooling Layer）的主要作用及其常用类型。"
  }
];

export default function ExamSession({ exam, onBack, onSubmit }: ExamSessionProps) {
  const [showPracticalIDE, setShowPracticalIDE] = useState(false);
  const [isSubmitAnswerDrawerOpen, setIsSubmitAnswerDrawerOpen] = useState(false);
  const [selectedAnswerFile, setSelectedAnswerFile] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [examTimeLeft, setExamTimeLeft] = useState(600); // 10 minutes count down
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [submitConfirmMessage, setSubmitConfirmMessage] = useState('');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const isAllQuestionsAnswered = Object.keys(userAnswers).filter(k => {
    const ans = userAnswers[Number(k)];
    return ans !== undefined && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== "");
  }).length === NEW_QUESTIONS.length;

  const userAnswersRef = useRef(userAnswers);
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);

  useEffect(() => {
    setExamTimeLeft(600); // Reset timer
    setUserAnswers({});
    setMarkedQuestions(new Set());
    setCurrentQuestionIdx(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          
          // Auto-submit and calculate score on timeout
          let score = 0;
          NEW_QUESTIONS.forEach((q, idx) => {
            const answer = userAnswersRef.current[idx];
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
          setCalculatedScore(score);
          setShowTimeoutModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    if (type === 'single' || type === 'judge') {
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
      setSubmitConfirmMessage(`您还有 ${unansweredCount} 道题未作答，确定要提交作业吗？`);
    } else {
      setSubmitConfirmMessage("确定要提交作业吗？提交后将无法修改答案。");
    }
    setShowSubmitConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmModal(false);
    onSubmit();
  };

  if (showPracticalIDE) {
    return <TeacherExperimentIDE onBack={() => setShowPracticalIDE(false)} />;
  }

  const question = NEW_QUESTIONS[currentQuestionIdx];
  const isMarked = markedQuestions.has(currentQuestionIdx);
  const practicalQuestions = NEW_QUESTIONS.filter(q => q.type === 'practical');
  const currentPracticalIdx = practicalQuestions.findIndex(q => q.id === question.id);

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

  const timeLeft = examTimeLeft;

  return (
    <div className="fixed inset-0 z-[200] h-screen bg-[#f5f7fa] flex flex-col font-sans overflow-hidden animate-in fade-in duration-300 text-left">
      {/* Top Navigation */}
      <div className="h-16 bg-white border-b border-neutral-200 border-t-[3px] border-t-purple-600 px-8 flex items-center justify-between shrink-0 relative z-10 font-sans">
        <div className="flex items-center">
           <button onClick={onBack} className="text-neutral-caption hover:text-neutral-title flex items-center gap-1.5 text-[14px] font-medium">
             <span className="text-[16px] font-bold">←</span> 退出
           </button>
           <div className="h-4 w-px bg-neutral-200 mx-4"></div>
           <h1 className="font-bold text-[14px] text-neutral-title">{exam.title}</h1>
        </div>
        
        <div className="flex items-center">
           {/* Monitoring */}
           <div className="flex items-center gap-2 text-neutral-title text-[13px] font-semibold">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <Webcam className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
             <span>正在监控</span>
           </div>

           {/* Timer Box */}
           <div className="border border-[#fa541c] bg-orange-50/5 rounded-[4px] px-3.5 py-1.5 flex items-center gap-2 font-mono font-bold text-[13px] text-[#fa541c] ml-6 shadow-xs">
              <Clock className="w-4 h-4 text-[#fa541c] shrink-0" />
              <span className="font-sans text-[#fa541c] font-medium">距离考试结束：</span>
              <span>
                {Math.floor(timeLeft / 3600) > 0 ? (
                  <>
                    {Math.floor(timeLeft / 3600).toString().padStart(2, '0')}:
                    {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:
                    {(timeLeft % 60).toString().padStart(2, '0')}
                  </>
                ) : (
                  <>
                    {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:
                    {(timeLeft % 60).toString().padStart(2, '0')}
                  </>
                )}
              </span>
           </div>

           {/* User Profile */}
           <div className="flex items-center gap-2 text-neutral-title text-[13px] font-semibold ml-6">
             <div className="w-7 h-7 rounded-full border border-orange-200 flex items-center justify-center bg-[#fa541c]/5 text-[#fa541c]">
               <User className="w-3.5 h-3.5 text-[#fa541c] shrink-0" />
             </div>
             <span>学生1</span>
           </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 mt-[20px] px-6 pb-6 relative z-20 overflow-hidden flex flex-col">
        <div className="max-w-[1400px] w-full mx-auto flex flex-1 bg-white border border-neutral-200/80 shadow-lg rounded-xl overflow-hidden min-h-[600px] h-[calc(100vh-7.5rem)]">
          {/* Left Answering Area */}
          <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
            {/* Scrollable Question Content */}
            <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4 text-left">

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
              {(question.type === 'single' || question.type === 'multi' || question.type === 'judge') && (
                <div>
                  {/* Clean Light-Bordered Question block */}
                  <div className="text-neutral-title mb-6 text-[15px] font-bold leading-relaxed flex items-center">
                    {question.title}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options?.map((opt, optIdx) => {
                      const isChecked = (question.type === 'single' || question.type === 'judge')
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
                          {(question.type === 'single' || question.type === 'judge') ? (
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
              )}

              {question.type === 'blank' && (
                <div className="space-y-4">
                  <div className="text-neutral-title mb-6 text-[15px] font-bold leading-relaxed">
                    {question.title}
                  </div>
                  <div className="max-w-[400px]">
                    <Input
                      value={userAnswers[currentQuestionIdx] || ""}
                      onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: e.target.value }))}
                      placeholder="请输入答案..."
                      className="border-neutral-200 focus:border-[#fa541c] focus:ring-[#fa541c] rounded-[4px] h-10 w-full"
                    />
                  </div>
                </div>
              )}

              {question.type === 'essay' && (
                <div className="space-y-4">
                  <div className="text-neutral-title mb-6 text-[15px] font-bold leading-relaxed">
                    {question.title}
                  </div>
                  <textarea
                    value={userAnswers[currentQuestionIdx] || ""}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: e.target.value }))}
                    placeholder="请在这里写下您的简答..."
                    className="w-full min-h-[160px] border border-neutral-200 hover:border-neutral-300 focus:border-[#fa541c] focus:outline-none p-4 rounded-lg text-[14px] leading-relaxed transition-all shadow-xs"
                  />
                </div>
              )}

              {question.type === 'practical' && (
                /* Practical Questions layout */
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
                
                {currentQuestionIdx < NEW_QUESTIONS.length - 1 && !isAllQuestionsAnswered && (
                  <Button 
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1"
                  >
                    下一题
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar navigation */}
          <div className="w-80 border-l border-neutral-border flex flex-col bg-white px-6 pt-12 pb-6 shrink-0 justify-between h-full">
            {/* Profile Avatar (Fixed, does not scroll) */}
            <div className="flex flex-col items-center pb-5 border-b border-neutral-150 mb-5 shrink-0">
              <img 
                src="https://picsum.photos/seed/studentavatar/150/150" 
                alt="Student Avatar" 
                className="w-full aspect-[16/9] object-cover rounded-lg border border-neutral-200 mb-2"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Grid lists (Scrollable) */}
            <div className="overflow-y-auto flex-1 no-scrollbar space-y-5 pr-1">
              {/* Single choices */}
              {NEW_QUESTIONS.some(q => q.type === 'single') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">单选题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'single').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}

              {/* Multiple choices */}
              {NEW_QUESTIONS.some(q => q.type === 'multi') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">多选题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'multi').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}

              {/* Judgment questions */}
              {NEW_QUESTIONS.some(q => q.type === 'judge') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">判断题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'judge').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}

              {/* Blank questions */}
              {NEW_QUESTIONS.some(q => q.type === 'blank') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">填空题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'blank').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}

              {/* Essay questions */}
              {NEW_QUESTIONS.some(q => q.type === 'essay') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">简答题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'essay').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}

              {/* Practical questions */}
              {NEW_QUESTIONS.some(q => q.type === 'practical') && (
                <div>
                  <h3 className="text-[13px] font-bold text-neutral-title mb-2.5">实训题</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {NEW_QUESTIONS.filter(q => q.type === 'practical').map((q, filteredIdx) => {
                      const idx = NEW_QUESTIONS.findIndex(x => x.id === q.id);
                      return renderQuestionCircle(idx, filteredIdx + 1);
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Legend & Submission (Fixed at bottom) */}
            <div className="border-t border-neutral-150 pt-5 mt-4 shrink-0">
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
                提交试卷
              </Button>
            </div>
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
                <Plus className="w-5 h-5 text-[#fa541c]" />
                提交答案
              </h2>
              <button 
                onClick={() => setIsSubmitAnswerDrawerOpen(false)} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* 题目名称 */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-0.5">
                  题目名称
                </label>
                <div className="text-[13px] text-neutral-800 font-bold leading-normal">
                  {NEW_QUESTIONS[currentQuestionIdx]?.title}
                </div>
              </div>

              {/* 上传答案文件 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  上传答案文件 <span className="text-[#fa541c]">*</span>
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
                    className="border border-[#fa541c] rounded-[4px] px-3.5 py-1.5 bg-transparent hover:bg-[#fa541c]/5 cursor-pointer text-xs text-[#fa541c] transition-colors font-bold select-none"
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
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: true }));
                  setIsSubmitAnswerDrawerOpen(false);
                  alert("答案提交成功！");
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 提交考试确认 Modal */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                提交考试
              </h2>
              <button 
                onClick={() => setShowSubmitConfirmModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 text-center bg-white">
              <div className="text-[14px] text-neutral-750 leading-relaxed font-medium">
                请确认所有题型已提交答案，当前考试还可以提交97次，是否确认提交考试？
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowSubmitConfirmModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmSubmit} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 考试时间到 Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                考试结束
              </h2>
              <button 
                onClick={() => {
                  setShowTimeoutModal(false);
                  onSubmit();
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-10 text-center bg-white">
              <div className="text-[14px] text-neutral-750 leading-relaxed font-medium">
                考试时间到，系统已自动提交您的试卷！
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setShowTimeoutModal(false);
                  onSubmit();
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 提交成功 Modal */}
      {showSubmitSuccessModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                提交成功
              </h2>
              <button 
                onClick={() => {
                  setShowSubmitSuccessModal(false);
                  onSubmit();
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-10 text-center bg-white">
              <div className="text-[14px] text-neutral-750 leading-relaxed font-medium">
                试卷提交成功！您的最终得分是：{calculatedScore} 分（总分 50 分）。
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setShowSubmitSuccessModal(false);
                  onSubmit();
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
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
