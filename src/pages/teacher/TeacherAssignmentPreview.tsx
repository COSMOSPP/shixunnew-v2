import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Pin, Eye, X, Plus, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import TeacherExperimentIDE from './TeacherExperimentIDE';

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
    options: ["A. 偏置允许激活函数在横轴上左右移动", "B. 偏置是神经网络需要通过反向传播训练 of 参数", "C. 偏置是固定不变的超参数", "D. 偏置可以看作是神经元激活的阈值偏好"]
  },
  {
    id: 16,
    type: "practical",
    typeName: "实训编程题",
    score: 40,
    title: "【Python 实训】基于人工神经网络算法的图像分类实践",
    content: "一、实验主题\n基于人工神经网络算法 of 图像分类实践\n\n二、实验目的\n掌握有监督学习的基本概念与人工神经网络的核心原理；\n学会使用torchvision库加载手写数字数据集并进行数据预处理；\n学会运用pytorch构建卷积神经网络模型，掌握模型结构的设置方法；\n掌握运用交叉验证、网格搜索等技术实现模型调优，提升模型泛化能力；\n掌握运用准确率、精确率、召回率、F1-score指标评估模型性能的方法；\n能够处理神经网络训练过程中的结构设置、参数调优和防止过拟合等常见问题，提升对有监督学习任务的理解 and 实际问题分析能力。\n\n三、实验内容\n安装pytorch和torchvision，并导入torch、torchvision、matplotlib、sklearn库；\n运用torch和torchvision实现计算单元设置和数据预处理；\n运用pytorch构建循环神经网络模型，包括卷积层、池化层 and 全连接层；\n运用交叉验证、网格搜索技术实现卷积神经网络超参数调优，提升模型性能；\n运用准确率、精确率、召回率、F1-score指标评估模型性能；\n可视化展示最佳模型预测结果。"
  },
  {
    id: 17,
    type: "practical",
    typeName: "实训编程题",
    score: 40,
    title: "【Python 实训】基于卷积神经网络(CNN)的手写数字识别(MNIST)",
    content: "一、实验主题\n基于卷积神经网络(CNN)的手写数字识别(MNIST)\n\n二、实验目的\n理解卷积操作、池化操作对图像局部特征提取的作用；\n掌握在PyTorch中搭建经典LeNet-5或自定义CNN结构的方法；\n学会利用训练集训练CNN并使用验证集调整超参数（如卷积核大小、步长等）。\n\n三、实验内容\n1. 下载并加载MNIST手写数字数据集，绘制样本图像；\n2. 搭建包含两个卷积层和两个全连接层的经典神经网络；\n3. 运行模型训练，记录并可视化每个Epoch of Loss和Accuracy变化。"
  },
  {
    id: 18,
    type: "practical",
    typeName: "实训编程题",
    score: 40,
    title: "【Python 实训】智能音箱产品数据分析与对话系统评估",
    content: "一、实验主题\n智能音箱产品数据分析与对话系统评估\n\n二、实验目的\n掌握对话交互意图识别准确度的计算方法；\n学会清洗和解析用户会话日志，统计各意图的请求频率；\n评估意图识别模型的召回率和精确率，找出识别较差的意图类型。\n\n三、实验内容\n1. 导入对话日志文件，进行文本去噪与标签映射；\n2. 计算意图识别 of 混淆矩阵，统计总体Accuracy与各意图下的F1-score；\n3. 提出优化意见，输出评估分析报告。"
  }
];

export default function TeacherAssignmentPreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for simulated preview interactions
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showPracticalIDE, setShowPracticalIDE] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes

  // Helper to get preview type robustly from HashRouter URL parameters
  const getPreviewType = () => {
    const hash = window.location.hash;
    const searchIdx = hash.indexOf('?');
    if (searchIdx !== -1) {
      const searchParams = new URLSearchParams(hash.substring(searchIdx));
      return searchParams.get('type') || 'objective';
    }
    return 'objective';
  };

  const previewType = getPreviewType();

  // Filter questions according to preview type: objective vs practical
  const questions = NEW_QUESTIONS.filter(q => {
    if (previewType === 'practical') {
      return q.type === 'practical';
    } else {
      return q.type === 'single' || q.type === 'multi';
    }
  });
  
  // Reset selected index when URL search type changes
  useEffect(() => {
    setCurrentQuestionIdx(0);
  }, [window.location.hash]);

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const question = questions[currentQuestionIdx] || questions[0];

  const handleExitPreview = () => {
    navigate(`/teacher/course/${id}?tab=assignments`);
  };

  const renderQuestionCircle = (idx: number, displayNum: number) => {
    const isCurrent = currentQuestionIdx === idx;
    let circleColorClass = "";
    if (isCurrent) {
      circleColorClass = "border-2 border-[#fa541c] text-[#fa541c] bg-white font-bold shadow-xs";
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
      </div>
    );
  };

  if (showPracticalIDE) {
    return <TeacherExperimentIDE onBack={() => setShowPracticalIDE(false)} />;
  }

  return (
    <div className="h-screen bg-[#f5f7fa] flex flex-col font-sans overflow-hidden">
      {/* Header Bar */}
      <div className="h-[56px] bg-white border-b border-neutral-200/60 px-6 flex justify-between items-center shrink-0 text-left">
        {/* Left Side */}
        <div className="flex items-center gap-4 select-none">
          <button 
            onClick={handleExitPreview}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 font-medium transition-colors border-0 bg-transparent cursor-pointer p-0 text-[13px]"
          >
            <ArrowLeft className="w-4 h-4" />
            退出
          </button>
          <div className="w-[1px] h-4 bg-neutral-200"></div>
          <span className="font-bold text-neutral-800 text-[14px]">
            {previewType === 'practical' ? "人工智能实操课作业 (预览)" : "人工智能客观题作业 (预览)"}
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
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 mt-[20px] px-6 pb-6 relative z-20 overflow-hidden flex flex-col">
        <div className="max-w-[1400px] w-full mx-auto flex flex-1 bg-white border border-neutral-200/80 shadow-lg rounded-xl overflow-hidden min-h-[650px] h-[calc(100vh-7.5rem)]">
          {/* Left Answering Area */}
          <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
            {/* Scrollable Question Content */}
            <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4 text-left">

              {/* Question Type and Score */}
              {question && (
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[15px] font-bold text-neutral-800">
                    {currentQuestionIdx + 1}、{question.typeName} <span className="text-[13px] text-neutral-400 font-normal ml-1">({question.score}分)</span>
                  </div>
                </div>
              )}

              {/* Question Body */}
              {question && (
                <div>
                  <div className="text-neutral-800 mb-6 text-[15px] font-bold leading-relaxed text-left">
                    {question.title}
                  </div>

                  {question.type !== 'practical' ? (
                    /* Options (Read-Only Preview - Cannot select answers) */
                    <div className="space-y-3 max-w-[800px]">
                      {question.options?.map((opt, optIdx) => {
                        return (
                          <div
                            key={optIdx}
                            className="px-5 py-4 border border-neutral-200 rounded-[4px] bg-neutral-50/30 cursor-default select-none transition-all text-left"
                          >
                            <span className="text-[14px] text-neutral-600 font-medium">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Practical Questions layout */
                    <div className="space-y-4 max-w-[900px] text-left">
                      <div className="border border-neutral-200 rounded-lg p-5 bg-white overflow-y-auto max-h-[50vh] text-[13px] leading-relaxed text-neutral-600 shadow-xs">
                        <div className="whitespace-pre-wrap font-medium space-y-1">
                          {question.content}
                        </div>
                      </div>
                    </div>
                  )}
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
                {question && question.type === 'practical' && (
                  <Button 
                    disabled
                    variant="outline"
                    className="border-neutral-200 text-neutral-400 bg-neutral-50 opacity-60 px-6 h-9.5 text-[13px] font-bold rounded-[4px] cursor-not-allowed flex items-center gap-1.5"
                  >
                    开始答题
                  </Button>
                )}
                
                {currentQuestionIdx < questions.length - 1 && (
                  <Button 
                    onClick={() => {
                      setCurrentQuestionIdx(prev => prev + 1);
                    }}
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

              {/* Grid lists */}
              <div className="space-y-5">
                {previewType === 'objective' && (
                  <>
                    {/* Single choices */}
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">单选题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {questions.filter(q => q.type === 'single').map((q, filteredIdx) => {
                          const idx = questions.findIndex(x => x.id === q.id);
                          return renderQuestionCircle(idx, filteredIdx + 1);
                        })}
                      </div>
                    </div>

                    {/* Multiple choices */}
                    <div>
                      <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">多选题</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {questions.filter(q => q.type === 'multi').map((q, filteredIdx) => {
                          const idx = questions.findIndex(x => x.id === q.id);
                          return renderQuestionCircle(idx, filteredIdx + 1);
                        })}
                      </div>
                    </div>
                  </>
                )}

                {previewType === 'practical' && (
                  /* Practical questions */
                  <div>
                    <h3 className="text-[13px] font-bold text-neutral-800 mb-2.5">实训题</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {questions.filter(q => q.type === 'practical').map((q, filteredIdx) => {
                        const idx = questions.findIndex(x => x.id === q.id);
                        return renderQuestionCircle(idx, filteredIdx + 1);
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
                onClick={handleExitPreview}
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
