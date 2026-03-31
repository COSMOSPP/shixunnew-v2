import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'identity', label: '身份' },
  { id: 'domain', label: '领域' },
  { id: 'level', label: '水平' },
  { id: 'goal', label: '目标' },
  { id: 'time', label: '时间' },
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSelect = (stepId: string, value: string, multi: boolean = false) => {
    setSelections(prev => {
      if (multi) {
        const current = (prev[stepId] as string[]) || [];
        if (current.includes(value)) {
          return { ...prev, [stepId]: current.filter(v => v !== value) };
        } else {
          return { ...prev, [stepId]: [...current, value] };
        }
      } else {
        return { ...prev, [stepId]: value };
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. 你的身份是？</h3>
            <p className="text-slate-500 text-sm mb-6">了解你的背景，为你推荐更合适的学习内容</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                '学生（在校大学生/研究生）',
                '教师（高校/培训机构教师）',
                '企业员工（企业在职技术人员）',
                '其他（自由职业/爱好者等）'
              ].map(option => (
                <button
                  key={option}
                  onClick={() => handleSelect('identity', option)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selections['identity'] === option 
                      ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c] font-medium" 
                      : "border-slate-200 hover:border-[#fa541c]/50 hover:bg-slate-50 text-slate-700"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. 你的专业领域？</h3>
            <p className="text-slate-500 text-sm mb-6">可多选</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                '开发（软件/后端/前端开发）',
                '数据（数据分析/数据科学）',
                '产品（产品经理/产品设计）',
                '设计（UI/UX/视觉设计）',
                '运营（运营/市场/增长）',
                '管理（技术管理/项目管理）'
              ].map(option => {
                const isSelected = (selections['domain'] as string[] || []).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect('domain', option, true)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                      isSelected
                        ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c] font-medium" 
                        : "border-slate-200 hover:border-[#fa541c]/50 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <span className="text-sm">{option}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. 你的 AI 技能水平？</h3>
            <p className="text-slate-500 text-sm mb-6">帮助我们为你匹配合适难度的课程</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: '小白', desc: '对 AI 感兴趣，想从零开始学习' },
                { title: '进阶', desc: '有编程基础，想深入 AI 领域' },
                { title: '专家', desc: '有 AI 经验，想掌握前沿技术' }
              ].map(option => (
                <button
                  key={option.title}
                  onClick={() => handleSelect('level', option.title)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selections['level'] === option.title
                      ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c]" 
                      : "border-slate-200 hover:border-[#fa541c]/50 hover:bg-slate-50"
                  )}
                >
                  <div className="font-medium mb-1">{option.title}</div>
                  <div className={cn("text-sm", selections['level'] === option.title ? "text-[#fa541c]/80" : "text-slate-500")}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">4. 你的学习目标是？</h3>
            <p className="text-slate-500 text-sm mb-6">明确目标，学习更有动力</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: '求职', desc: '准备转行 / 找 AI 相关工作' },
                { title: '升职', desc: '提升技能，争取晋升机会' },
                { title: '考核', desc: '完成公司 / 学校培训要求' },
                { title: '兴趣', desc: '纯粹感兴趣，自我提升' }
              ].map(option => (
                <button
                  key={option.title}
                  onClick={() => handleSelect('goal', option.title)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selections['goal'] === option.title
                      ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c]" 
                      : "border-slate-200 hover:border-[#fa541c]/50 hover:bg-slate-50"
                  )}
                >
                  <div className="font-medium mb-1">{option.title}</div>
                  <div className={cn("text-sm", selections['goal'] === option.title ? "text-[#fa541c]/80" : "text-slate-500")}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-900 mb-2">5. 每周可投入学习时间？</h3>
            <p className="text-slate-500 text-sm mb-6">合理规划，稳步提升</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: '<2h', desc: '碎片时间' },
                { title: '2-5h', desc: '轻度学习' },
                { title: '5-10h', desc: '中度学习' },
                { title: '>10h', desc: '深度学习' }
              ].map(option => (
                <button
                  key={option.title}
                  onClick={() => handleSelect('time', option.title)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selections['time'] === option.title
                      ? "border-[#fa541c] bg-[#fff2e8] text-[#fa541c]" 
                      : "border-slate-200 hover:border-[#fa541c]/50 hover:bg-slate-50"
                  )}
                >
                  <div className="font-medium mb-1">{option.title}</div>
                  <div className={cn("text-sm", selections['time'] === option.title ? "text-[#fa541c]/80" : "text-slate-500")}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">画像设置完成！</h3>
            <p className="text-slate-500 mb-8">我们已为你生成专属学习路径</p>
            
            <div className="grid grid-cols-3 gap-4 w-full mb-8">
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl mb-2">🎯</span>
                <span className="text-sm font-medium text-slate-700">个性化学习路径</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium text-slate-700">专属技能矩阵</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl mb-2">💡</span>
                <span className="text-sm font-medium text-slate-700">精准课程推荐</span>
              </div>
            </div>
            
            <Button 
              onClick={onClose}
              className="w-full bg-[#fa541c] hover:bg-[#d4380d] text-white rounded-xl py-6 text-lg font-medium shadow-md shadow-[#fa541c]/20"
            >
              进入首页
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: return !!selections['identity'];
      case 1: return (selections['domain'] as string[])?.length > 0;
      case 2: return !!selections['level'];
      case 3: return !!selections['goal'];
      case 4: return !!selections['time'];
      default: return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          {currentStep < 5 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">完善你的学习画像</h2>
              <p className="text-slate-500 text-sm mb-6">让我们为你定制专属学习路径</p>
              
              {/* Progress Bar */}
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-10"></div>
                {STEPS.map((step, index) => {
                  const isCompleted = currentStep > index;
                  const isCurrent = currentStep === index;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                        isCompleted ? "bg-[#fa541c] text-white" : 
                        isCurrent ? "border-2 border-[#fa541c] text-[#fa541c] bg-white" : 
                        "bg-slate-100 text-slate-400"
                      )}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <span className={cn(
                        "text-[10px] font-medium",
                        isCompleted || isCurrent ? "text-slate-700" : "text-slate-400"
                      )}>{step.label}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {currentStep < 5 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <button 
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-4"
            >
              跳过，稍后设置
            </button>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> 上一步
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="bg-[#fa541c] hover:bg-[#d4380d] text-white rounded-xl shadow-md shadow-[#fa541c]/20 px-6"
              >
                {currentStep === STEPS.length - 1 ? '生成学习路径' : '下一步'} 
                {currentStep !== STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
