import React, { useState } from "react";
import { ChevronRight, Edit, FileText, Sparkles, User, Lightbulb, Calendar, Send, Target, Award, BookOpen, Clock, Settings, Zap, CheckCircle2, X, GraduationCap, Briefcase, Building, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const radarData = [
  { subject: "编程开发", A: 85, fullMark: 100 },
  { subject: "算法理论", A: 75, fullMark: 100 },
  { subject: "数据结构", A: 80, fullMark: 100 },
  { subject: "大模型应用", A: 65, fullMark: 100 },
  { subject: "工程部署", A: 50, fullMark: 100 },
  { subject: "数据分析", A: 85, fullMark: 100 },
];

export default function UserPersona() {
  const [showEditModal, setShowEditModal] = useState(false);
  const completionRate = 85;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between mb-6">
        <div className="flex items-center text-sm text-neutral-500">
          <Link to="/user" className="hover:text-[#fa541c] cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/user/center" className="hover:text-[#fa541c] cursor-pointer transition-colors">个人中心</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-900 font-bold">用户画像</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 space-y-6 pr-2">
        
        {/* Top Progress & Summary Card */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none transition-opacity group-hover:opacity-60"></div>
          
          {/* Left Avatar & Basic Info */}
          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-white shadow-md flex items-center justify-center shrink-0 text-[#fa541c]">
              <User className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[22px] font-black text-neutral-900 tracking-tight">张三</h2>
                <span className="px-2.5 py-0.5 bg-[#fff2e8] text-[#fa541c] text-[12px] font-bold rounded-md border border-orange-100/50 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> 学生
                </span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[12px] font-bold rounded-md border border-blue-100/50">
                  进阶学习者
                </span>
              </div>
              <p className="text-[14px] text-neutral-500 font-medium">加入平台已 128 天，累计学习 86 小时</p>
            </div>
          </div>

          {/* Right Progress & Actions */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <div className="flex items-end justify-between mb-2">
                <span className="text-[13px] font-bold text-neutral-600">画像完善度</span>
                <span className="text-[#fa541c] text-xl font-black leading-none">{completionRate}%</span>
              </div>
              <div className="w-full md:w-[200px] h-2 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-[#fa541c] rounded-full transition-all duration-1000" 
                  style={{ width: `${completionRate}%` }} 
                />
              </div>
              <p className="text-[11px] text-neutral-400 mt-2 text-right">完善画像可获得更精准的课程推荐</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={() => setShowEditModal(true)} variant="outline" className="flex-1 md:flex-none border-neutral-200 text-neutral-600 font-bold hover:text-[#fa541c] hover:bg-orange-50 hover:border-orange-200 h-10 shadow-sm transition-all">
                <FileText className="w-4 h-4 mr-2" /> 完善画像问卷
              </Button>
              <Button onClick={() => setShowEditModal(true)} className="flex-1 md:flex-none bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 shadow-md shadow-orange-500/20 transition-all">
                <Edit className="w-4 h-4 mr-2" /> 修改信息
              </Button>
            </div>
          </div>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Identity & Domain */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col hover:border-orange-200 transition-colors duration-300">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-neutral-900">身份角色与专业</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 border-dashed">
                  <span className="text-[13px] text-neutral-500 font-medium">所属院校</span>
                  <span className="text-[14px] font-bold text-neutral-900">清华大学</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 border-dashed">
                  <span className="text-[13px] text-neutral-500 font-medium">所在院系</span>
                  <span className="text-[14px] font-bold text-neutral-900">计算机科学与技术系</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 border-dashed">
                  <span className="text-[13px] text-neutral-500 font-medium">专业方向</span>
                  <span className="text-[14px] font-bold text-neutral-900">人工智能实验班</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 border-dashed">
                  <span className="text-[13px] text-neutral-500 font-medium">当前年级</span>
                  <span className="text-[14px] font-bold text-neutral-900">大二</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <h4 className="text-[13px] font-bold text-neutral-500 mb-4 uppercase tracking-widest">核心专业领域</h4>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1.5 bg-orange-50 text-[#fa541c] font-bold text-[13px] rounded-lg border border-orange-100">Python后端</span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-[13px] rounded-lg border border-emerald-100">数据分析</span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-[13px] rounded-lg border border-blue-100">AI 应用</span>
                  <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 font-bold text-[13px] rounded-lg border border-neutral-200">深度学习基础</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Skill Depth Radar */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col hover:border-orange-200 transition-colors duration-300">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-neutral-900">综合技能深度</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="h-[240px] w-full -ml-3 mt-2 z-10 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid stroke="#f3f4f6" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="技能值" dataKey="A" stroke="#fa541c" strokeWidth={2} fill="#fa541c" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-auto space-y-3 bg-neutral-50/80 p-5 rounded-xl border border-neutral-100 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-neutral-500">综合评估评级</span>
                  <span className="text-[14px] font-black text-blue-600">进阶 (Level 3)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-neutral-500">同龄人战胜率</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-[14px] font-black text-emerald-600">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Goals & Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col hover:border-orange-200 transition-colors duration-300 relative">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-gradient-to-r from-orange-400 to-[#fa541c] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI 生成画像
              </span>
            </div>
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-neutral-900">学习目标与偏好</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col space-y-7">
              
              <div>
                <h4 className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 mb-3">
                  <Target className="w-4 h-4 text-[#fa541c]" /> 核心学习目标
                </h4>
                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-[13.5px] text-neutral-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
                      掌握大模型应用层开发（Prompt Engineering & LangChain）
                    </li>
                    <li className="flex items-start gap-2 text-[13.5px] text-neutral-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
                      准备春季大厂实习招聘，主攻算法岗
                    </li>
                    <li className="flex items-start gap-2 text-[13.5px] text-neutral-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
                      提升工程化部署能力，完成1个端到端项目
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 mb-3">
                  <Clock className="w-4 h-4 text-blue-500" /> 学习习惯偏好
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1.5 bg-neutral-50 text-neutral-600 font-medium text-[13px] rounded-lg border border-neutral-200 flex items-center gap-1.5">
                    夜猫子型
                  </span>
                  <span className="px-3 py-1.5 bg-neutral-50 text-neutral-600 font-medium text-[13px] rounded-lg border border-neutral-200 flex items-center gap-1.5">
                    碎片化时间 <span className="text-neutral-400 text-[11px]">&lt;30m</span>
                  </span>
                  <span className="px-3 py-1.5 bg-neutral-50 text-neutral-600 font-medium text-[13px] rounded-lg border border-neutral-200 flex items-center gap-1.5">
                    偏好实战项目驱动
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <Button className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 shadow-md shadow-orange-500/20">
                  <Zap className="w-4 h-4 mr-2" /> 生成我的专属学习路径
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Modal / Questionnaire Overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-5 md:p-6 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white shrink-0">
              <div>
                <h2 className="text-lg font-black text-neutral-900 flex items-center gap-2 mb-1">
                  <Edit className="w-5 h-5 text-[#fa541c]" /> 完善画像问卷
                </h2>
                <p className="text-[13px] text-neutral-500 font-medium">填写越详细，AI 推荐的学习路径越精准</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-neutral-50/30">
              <div className="space-y-8">
                
                {/* Identity */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#fa541c]" /> 1. 您的当前身份是？<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['学生', '教师', '企业员工'].map((item, i) => (
                      <button key={item} className={cn(
                        "py-3 px-4 rounded-xl border text-[14px] font-bold transition-all",
                        i === 0 ? "border-[#fa541c] bg-orange-50 text-[#fa541c] shadow-sm shadow-orange-500/10" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      )}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#fa541c]" /> 2. 您对目前所学专业的掌握程度如何？<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-3 px-4 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 text-[14px] font-bold transition-all">小白入门</button>
                    <button className="py-3 px-4 rounded-xl border border-[#fa541c] bg-orange-50 text-[#fa541c] shadow-sm shadow-orange-500/10 text-[14px] font-bold transition-all">进阶学习</button>
                    <button className="py-3 px-4 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 text-[14px] font-bold transition-all">领域专家</button>
                  </div>
                </div>

                {/* Domains */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#fa541c]" /> 3. 您最感兴趣的技术领域？（多选）
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Python开发', '大语言模型', '前端开发', '后端架构', '数据分析', 'UI设计', '自动化测试', '运维部署'].map((tag, i) => (
                      <button key={tag} className={cn(
                        "px-4 py-2 rounded-full border text-[13px] font-bold transition-all",
                        [0, 1, 4].includes(i) ? "border-[#fa541c] bg-[#fa541c] text-white shadow-sm shadow-orange-500/20" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      )}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#fa541c]" /> 4. 您近期的核心学习目标是？
                  </label>
                  <textarea 
                    placeholder="例如：准备秋招，希望提升算法能力，或者想要完成一个大模型微调的实战项目..."
                    className="w-full h-24 p-4 rounded-xl border border-neutral-200 bg-white text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none"
                    defaultValue="掌握大模型应用层开发，准备春季大厂实习招聘，主攻算法岗。"
                  />
                </div>

              </div>
            </div>

            <div className="p-5 md:p-6 border-t border-neutral-100 bg-white shrink-0 flex items-center justify-end gap-3">
              <Button onClick={() => setShowEditModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button onClick={() => setShowEditModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存并生成新画像</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
