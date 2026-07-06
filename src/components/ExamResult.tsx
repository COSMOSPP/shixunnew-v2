import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Award, BarChart2, Clock, Target, Hash, ShieldCheck, Zap, AlertTriangle, PlayCircle, LineChart, FileText, Bot, PenTool, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamResultProps {
  exam: any;
  onBack: () => void;
  directPreview?: boolean;
}

export default function ExamResult({ exam, onBack, directPreview = false }: ExamResultProps) {
  const [showReviewPreview, setShowReviewPreview] = useState(directPreview);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const attemptRows = Array.from({ length: Math.max(1, exam.attempts || 1) }).map((_, idx) => ({
    attemptNumber: idx + 1,
    types: "单选题、多选题、判断题、填空题、简答题、实训题",
    time: exam.startTime ? `${exam.startTime.split(' ')[0]} 11:${15 + idx}:32` : "2026-07-02 11:15:32",
  }));

  const getDynamicPreviewQuestions = (studentScore: number) => {
    return [
      {
        id: 1,
        type: '单选题',
        title: '下列哪个 Python 数据类型是不可变的？',
        options: [
          { key: 'A', value: 'List (列表)' },
          { key: 'B', value: 'Dictionary (字典)' },
          { key: 'C', value: 'Tuple (元组)' },
          { key: 'D', value: 'Set (集合)' }
        ],
        answer: 'C',
        studentAnswer: studentScore > 11 ? 'C' : 'A',
        isCorrect: studentScore > 11,
        score: studentScore > 11 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 2,
        type: '单选题',
        title: '在 Python 中，下列哪个关键字用于定义匿名函数？',
        options: [
          { key: 'A', value: 'def' },
          { key: 'B', value: 'lambda' },
          { key: 'C', value: 'class' },
          { key: 'D', value: 'func' }
        ],
        answer: 'B',
        studentAnswer: studentScore >= 80 ? 'B' : 'A',
        isCorrect: studentScore >= 80,
        score: studentScore >= 80 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 3,
        type: '多选题',
        title: '以下哪些属于 Python 中的内置修饰器 (Decorator)？',
        options: [
          { key: 'A', value: '@property' },
          { key: 'B', value: '@staticmethod' },
          { key: 'C', value: '@classmethod' },
          { key: 'D', value: '@override' }
        ],
        answer: ['A', 'B', 'C'],
        studentAnswer: studentScore === 100 || studentScore === 80 || studentScore === 56 ? ['A', 'B', 'C'] : (studentScore === 11 ? ['A', 'B'] : []),
        isCorrect: studentScore === 100 || studentScore === 80 || studentScore === 56,
        score: (studentScore === 100 || studentScore === 80 || studentScore === 56) ? 10 : (studentScore === 11 ? 5 : 0),
        maxScore: 10
      },
      {
        id: 4,
        type: '多选题',
        title: '下列关于 Python 列表 (List) 和元组 (Tuple) 的说法，正确的有？',
        options: [
          { key: 'A', value: '列表是可变对象，元组是不可变对象' },
          { key: 'B', value: '列表和元组都支持切片操作' },
          { key: 'C', value: '列表和元组都可以作为字典的键' },
          { key: 'D', value: '元组的内存开销通常比列表小' }
        ],
        answer: ['A', 'B', 'D'],
        studentAnswer: studentScore === 100 || studentScore === 80 ? ['A', 'B', 'D'] : ['A', 'C'],
        isCorrect: studentScore === 100 || studentScore === 80,
        score: studentScore === 100 || studentScore === 80 ? 10 : 0,
        maxScore: 10
      },
      {
        id: 5,
        type: '简答题',
        title: '请简述 Python 中 is 和 == 的区别。',
        answerText: 'is 比较的是两个对象的物理内存地址是否相同（同一性），而 == 比较的是两个对象的值是否相等（相等性）。例如，a = [1, 2] 和 b = [1, 2]，a == b 为 True，但 a is b 为 False。',
        studentAnswerText: studentScore > 40
          ? 'is 比较的是两个对象的物理内存地址是否相同（同一性），而 == 比较的是两个对象的值是否相等（相等性）。例如，a = [1, 2] 和 b = [1, 2]，a == b 为 True，但 a is b 为 False。'
          : (studentScore === 40 ? 'is比较地址，==比较内容。' : '未作答'),
        isCorrect: studentScore > 40,
        score: studentScore === 100 ? 20 : (studentScore === 80 ? 15 : (studentScore === 56 ? 11 : (studentScore === 40 ? 10 : (studentScore === 11 ? 1 : 0)))),
        maxScore: 20
      },
      {
        id: 6,
        type: '实训编程题',
        title: '请编写一个 Python 函数，计算斐波那契数列的第 n 项。要求输入正整数 n，返回对应的斐波那契数，时间复杂度控制在 O(n)。',
        answerText: 'def fibonacci(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b',
        studentAnswerText: studentScore > 40
          ? 'def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b'
          : (studentScore === 40 ? 'def fibonacci(n):\n    # 递归法（时间复杂度较高）\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)' : '未作答'),
        isCorrect: studentScore > 40,
        score: studentScore === 100 ? 40 : (studentScore === 80 ? 25 : (studentScore === 56 ? 25 : (studentScore === 40 ? 10 : 0))),
        maxScore: 40
      }
    ];
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8] relative py-6">
      <div className="max-w-6xl mx-auto w-full px-8 mb-6 text-left">
         <div className="flex items-center text-[13px] text-neutral-500 mb-4 font-medium">
            <button onClick={onBack} className="hover:text-neutral-850 flex items-center gap-1 transition-colors bg-white hover:bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200 shadow-xs cursor-pointer">
              <ChevronLeft className="w-4 h-4" /> 返回我的考试
            </button>
         </div>
         
         <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">{exam.title} - 提交历史</h1>
         <p className="text-neutral-500 text-xs flex items-center gap-2 font-medium">
           <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] animate-pulse"></span>
           报告基于 AI 双盲评卷模型与自动化判分系统生成，客观公正。
         </p>
      </div>

      <div className="max-w-6xl mx-auto w-full px-8 pb-12">
        <div className="bg-white rounded border border-neutral-200 p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-[16px] font-bold text-neutral-800">答卷提交记录</h2>
            <span className="text-[13px] text-neutral-500 font-medium">共提交 {attemptRows.length} 次</span>
          </div>

          <div className="bg-white rounded overflow-hidden border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 font-medium">提交次数</th>
                    <th className="p-4 font-medium">提交时间</th>
                    <th className="p-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {attemptRows.map((row) => (
                    <tr key={row.attemptNumber} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                      <td className="p-4 text-neutral-800 font-bold">第 {row.attemptNumber} 次提交</td>
                      <td className="p-4 text-neutral-500">{row.time}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            setCurrentQuestionIndex(0);
                            setShowReviewPreview(true);
                          }}
                          className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors hover:underline cursor-pointer bg-transparent border-0"
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
        </div>
      </div>

      {showReviewPreview && (() => {
        const questions = getDynamicPreviewQuestions(exam.score || 80);
        const q = questions[currentQuestionIndex];
        return (
          <div className="fixed inset-x-0 bottom-0 top-[64px] z-[200] bg-[#f5f5f5] flex flex-col font-sans text-neutral-800 animate-fade-in text-[13px]">
            {/* Header Bar */}
            <div className="h-[56px] bg-white border-b border-neutral-200/60 px-6 flex items-center shrink-0 text-left select-none">
              <button 
                onClick={() => {
                  if (directPreview) {
                    onBack();
                  } else {
                    setShowReviewPreview(false);
                  }
                }}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 font-medium transition-colors border-0 bg-transparent cursor-pointer p-0 text-[13px]"
              >
                <ArrowLeft className="w-4 h-4" />
                退出
              </button>
              <div className="w-[1px] h-4 bg-neutral-200 mx-4"></div>
              <span className="font-bold text-neutral-800 text-[14px]">
                {exam.title || 'Python 基础 - 答卷预览'}
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 mt-[20px] px-6 pb-6 relative z-20 overflow-hidden flex flex-col">
              <div className="max-w-[1400px] w-full mx-auto flex flex-1 bg-white border border-neutral-200/80 shadow-lg rounded-xl overflow-hidden min-h-[600px] h-[calc(100vh-14rem)]">
                {/* Left Answering Area */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
                  {/* Scrollable Question Content */}
                  <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4 text-left">
                    
                    {/* Question Type and Score */}
                    <div className="flex items-center justify-between mb-5 select-none">
                      <div className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                        <span>{currentQuestionIndex + 1}、{q.type}</span>
                        <span className="text-[13px] text-neutral-400 font-normal">({q.maxScore}分)</span>
                        <span className="text-[13px] text-[#fa541c] font-bold ml-2">（得分: {q.score}分）</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-orange-50 text-[#fa541c] border border-orange-100/50 rounded-[4px] font-medium">
                          该题{q.maxScore}.0分
                        </span>
                        <span className="px-2.5 py-1 bg-orange-50 text-[#fa541c] border border-orange-100/50 rounded-[4px] font-bold">
                          得{q.score}分
                        </span>
                      </div>
                    </div>

                    {/* Question Title */}
                    <div className="text-neutral-800 mb-6 text-[15px] font-bold leading-relaxed">
                      {q.title}
                    </div>

                    {/* Options / Textarea depending on question type */}
                    {q.options ? (
                      <div className="space-y-6 max-w-[800px]">
                        <div className="space-y-3">
                          {q.options.map((opt) => {
                            const isSelected = Array.isArray(q.studentAnswer) ? q.studentAnswer.includes(opt.key) : q.studentAnswer === opt.key;
                            const isRight = Array.isArray(q.answer) ? q.answer.includes(opt.key) : q.answer === opt.key;
                            
                            let cardStyle = "border-neutral-200 bg-neutral-50/30 text-neutral-600";
                            if (isSelected) {
                              if (q.isCorrect) {
                                cardStyle = "border-green-500 text-green-600 bg-green-50/10 font-bold";
                              } else {
                                cardStyle = "border-red-500 text-red-600 bg-red-50/10 font-bold";
                              }
                            }

                            return (
                              <div 
                                key={opt.key}
                                className={cn(
                                  "px-5 py-4 border rounded-[4px] font-medium text-left flex items-center justify-between text-[14px]",
                                  cardStyle
                                )}
                              >
                                <span>{opt.key}. {opt.value}</span>
                                <div className="flex gap-2 text-xs shrink-0 select-none">
                                  {isSelected && (
                                    <span className={cn(
                                      "px-2 py-0.5 rounded-[4px] text-[11px] font-bold",
                                      q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}>学生作答</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Answer Details matching the mock image exactly */}
                        <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5 text-left text-[14px] select-none">
                          <div className="flex items-center gap-1.5 font-bold text-neutral-650">
                            <span>正确答案：</span>
                            <span className="text-[#52c41a] font-mono">{Array.isArray(q.answer) ? q.answer.sort().join(', ') : q.answer}</span>
                          </div>
                          <div className="flex items-center gap-2 font-bold text-neutral-650">
                            <span>学生答案：</span>
                            <span className="text-neutral-700 font-mono">{Array.isArray(q.studentAnswer) ? q.studentAnswer.sort().join(', ') : q.studentAnswer}</span>
                            {q.isCorrect ? (
                              <span className="text-[#52c41a] font-sans font-bold text-[18px]">✓</span>
                            ) : (
                              <span className="text-[#f5222d] font-sans font-bold text-[18px]">✗</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 max-w-[900px] text-left pt-2">
                        {/* Student Answer */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-neutral-500 block">学生作答：</span>
                          <pre className="p-4 bg-neutral-50 border border-neutral-200 rounded-[4px] text-[13px] text-neutral-700 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {q.studentAnswerText}
                          </pre>
                        </div>

                        {/* Standard Answer */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-green-700 block">参考答案：</span>
                          <pre className="p-4 bg-green-50/20 border border-green-200 rounded-[4px] text-[13px] text-green-800 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {q.answerText}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex items-center justify-between px-10 py-5 border-t border-neutral-100 bg-white shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10 select-none">
                    <Button
                      variant="outline"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(idx => idx - 1)}
                      className="border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50/20 px-6 h-9.5 text-[13px] font-bold rounded-[4px]"
                    >
                      上一题
                    </Button>
                    
                    <Button 
                      disabled={currentQuestionIndex === questions.length - 1}
                      onClick={() => setCurrentQuestionIndex(idx => idx + 1)}
                      className={cn(
                        "px-6 h-9.5 text-[13px] font-bold shadow-sm rounded-[4px] transition-all flex items-center gap-1 cursor-pointer",
                        currentQuestionIndex === questions.length - 1
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200 shadow-none"
                          : "bg-[#fa541c] hover:bg-[#e84a15] text-white"
                      )}
                    >
                      下一题
                    </Button>
                  </div>
                </div>

                {/* Right Sidebar navigation */}
                <div className="w-80 border-l border-neutral-200 flex flex-col bg-white px-6 pt-8 pb-6 shrink-0 justify-between h-full text-left select-none">
                  <div className="overflow-y-auto flex-1 no-scrollbar space-y-6 flex flex-col justify-between">
                    {/* Sidebar navigations for all types */}
                    <div className="space-y-6 pt-2">
                      {['单选题', '多选题', '简答题', '实训编程题'].map((typeStr) => {
                        const typeQuestions = questions.map((q, qIdx) => ({ ...q, originalIndex: qIdx })).filter(q => q.type === typeStr);
                        if (typeQuestions.length === 0) return null;
                        return (
                          <div key={typeStr} className="space-y-3">
                            <h3 className="text-[13px] font-bold text-neutral-800">{typeStr}</h3>
                            <div className="grid grid-cols-5 gap-3">
                              {typeQuestions.map((item) => {
                                const isActive = item.originalIndex === currentQuestionIndex;
                                return (
                                  <div 
                                    key={item.id}
                                    onClick={() => setCurrentQuestionIndex(item.originalIndex)}
                                    className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold select-none cursor-pointer transition-all relative border",
                                      item.score > 0
                                        ? (isActive 
                                            ? "bg-emerald-500 text-white border-transparent" 
                                            : "bg-emerald-500/[0.08] border-emerald-500 text-emerald-600 hover:bg-emerald-500/[0.15]")
                                        : (isActive 
                                            ? "bg-red-500 text-white border-transparent" 
                                            : "bg-red-500/[0.08] border-red-500 text-red-600 hover:bg-red-500/[0.15]")
                                    )}
                                  >
                                    {item.originalIndex + 1}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Exit Preview Button below the navigations */}
                    <div className="pt-6 border-t border-neutral-200 mt-6 select-none shrink-0">
                      <Button 
                        onClick={() => {
                          if (directPreview) {
                            onBack();
                          } else {
                            setShowReviewPreview(false);
                          }
                        }}
                        className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white border-0 font-bold h-9.5 text-[13px] rounded-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        退出预览
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
