import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function TeacherAssignmentPreview() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});

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

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans -mt-6 -mx-6 md:-mx-8">
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
              <button onClick={() => navigate(-1)} className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> 课程
              </button>
              <span>/</span>
              <span>人工智能基础与实践</span>
              <span>/</span>
              <span className="text-white">人工智能通讯课-客观题</span>
            </div>
            
            <h1 className="text-[28px] font-bold mb-4 tracking-wider">人工智能通讯课-客观题</h1>
            
            <div className="flex items-center gap-6 text-[13px] text-white/90">
              <span>学生：待定</span>
              <span>作业时长：90分钟</span>
            </div>
          </div>
          
          <div className="text-white flex flex-col items-end">
             <div className="text-[12px] text-white/80 mb-2 tracking-widest font-medium">倒计时</div>
             <div className="flex items-baseline gap-2">
               <div className="flex items-baseline gap-1">
                 <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">0</div>
                 <span className="text-[12px] opacity-80">天</span>
               </div>
               <div className="flex items-baseline gap-1">
                 <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">00</div>
                 <span className="text-[12px] opacity-80">时</span>
               </div>
               <div className="flex items-baseline gap-1">
                 <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">59</div>
                 <span className="text-[12px] opacity-80">分</span>
               </div>
               <div className="flex items-baseline gap-1">
                 <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1.5 text-xl font-bold border border-white/20">15</div>
                 <span className="text-[12px] opacity-80">秒</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 -mt-8 relative z-20 pb-20 px-4">
        <div className="max-w-[1000px] mx-auto bg-white rounded-t-xl rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 min-h-[600px] border border-neutral-100">
          
          <div className="flex items-center gap-2 mb-10 pb-4 border-b border-neutral-100">
            <CheckCircle2 className="w-5 h-5 text-[#fa541c]" />
            <h2 className="text-[16px] font-bold text-neutral-800">
              单选题 <span className="text-[13px] text-neutral-400 font-normal ml-2 tracking-wide">(第 1-10 题, 每题 2 分, 共 30 分)</span>
            </h2>
          </div>

          <div className="space-y-12">
            {questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <h3 className="text-[15px] font-bold text-neutral-800 leading-relaxed">
                  {q.id}、{q.title}
                </h3>
                <div className="space-y-2 pl-6">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[q.id] === i;
                    return (
                      <div 
                        key={i} 
                        onClick={() => setAnswers({...answers, [q.id]: i})}
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

        </div>
      </div>
    </div>
  );
}
