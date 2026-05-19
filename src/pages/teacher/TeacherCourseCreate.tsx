import React, { useState } from 'react';
import { ArrowLeft, Upload, Info, CheckCircle2, LayoutTemplate, BarChart, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PRESET_COVERS = [
  "bg-gradient-to-br from-[#fa541c] to-[#ff7a45]",
  "bg-gradient-to-br from-[#40a9ff] to-[#096dd9]",
  "bg-gradient-to-br from-[#52c41a] to-[#237804]",
  "bg-gradient-to-br from-[#722ed1] to-[#391085]",
  "bg-gradient-to-br from-[#13c2c2] to-[#006d75]",
  "bg-gradient-to-br from-[#fadb14] to-[#d4b106]",
];

export default function TeacherCourseCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    category: '人工智能',
    level: '初级',
    tags: '',
    description: '',
    coverBg: PRESET_COVERS[0],
    creator: '张老师'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/teacher');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="animate-in fade-in duration-500 font-sans pb-12">
      {/* Title Area */}
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/teacher')}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-neutral-500 transition-colors bg-white/50 border border-neutral-200/60 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fa541c] to-[#ff7a45] flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-[18px] font-bold text-neutral-900 tracking-wide">新建实训课程</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            草稿自动保存中
          </span>
          <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/teacher')}
              className="border-neutral-200 bg-white shadow-sm text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 h-9 px-5 rounded-full font-medium"
            >
              取消
            </Button>
            <Button 
              onClick={() => handleSubmit()}
              disabled={isSubmitting || !formData.name}
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white shadow-md shadow-orange-500/20 h-9 px-6 rounded-full font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              {isSubmitting ? "创建中..." : "完成并创建"}
            </Button>
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left: Form Area */}
          <div className="flex-1 space-y-5 w-full">
            {/* Step 1: 基础配置 */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-[#fa541c] flex items-center justify-center text-[12px] font-black">1</div>
                <h2 className="text-[15px] font-black text-neutral-900 tracking-wide">基础配置</h2>
              </div>
              <div className="p-5 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 课程名称 */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                      课程名称 <span className="text-[#fa541c]">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="例如：人工智能基础与实践"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#fa541c] focus:ring-2 focus:ring-[#fa541c]/20 outline-none transition-all placeholder:text-neutral-300 text-[15px] font-medium text-neutral-900"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                  </div>
                  
                  {/* 课程分类 */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                      课程方向 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="relative">
                      <select
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#fa541c] focus:ring-2 focus:ring-[#fa541c]/20 outline-none transition-all text-[15px] font-medium bg-white appearance-none text-neutral-900"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="人工智能">人工智能</option>
                          <option value="数据科学">数据科学</option>
                          <option value="前端开发">前端开发</option>
                          <option value="后端架构">后端架构</option>
                          <option value="云计算">云计算</option>
                          <option value="UI/UX设计">UI/UX设计</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* 难度等级 */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                      难度等级 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="flex gap-3 h-[50px]">
                      {['初级', '中级', '高级'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({...formData, level})}
                          className={cn(
                            "flex-1 rounded-xl border text-[14px] font-bold transition-all h-full",
                            formData.level === level 
                              ? "border-[#fa541c] bg-orange-50 text-[#fa541c] ring-1 ring-[#fa541c]" 
                              : "border-neutral-200 text-neutral-600 hover:border-orange-200 hover:bg-orange-50/50"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 课程简介 */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center justify-between">
                    <span>一句话简介 <span className="text-[#fa541c]">*</span></span>
                    <span className="text-[12px] text-neutral-400 font-medium">{formData.shortDesc.length}/50</span>
                  </label>
                  <input
                      type="text"
                      maxLength={50}
                      placeholder="用一句话概括课程的核心价值..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#fa541c] focus:ring-2 focus:ring-[#fa541c]/20 outline-none transition-all placeholder:text-neutral-300 text-[15px] font-medium text-neutral-900"
                      value={formData.shortDesc}
                      onChange={e => setFormData({...formData, shortDesc: e.target.value})}
                    />
                </div>
              </div>
            </div>

            {/* Step 2: 详情与视觉 */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-[#fa541c] flex items-center justify-center text-[12px] font-black">2</div>
                <h2 className="text-[15px] font-black text-neutral-900 tracking-wide">详情与视觉</h2>
              </div>
              <div className="p-5 md:p-6 space-y-6">
                
                {/* 封面选择 */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                    封面图选择 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {PRESET_COVERS.map((bg, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setFormData({...formData, coverBg: bg})}
                        className={cn(
                          "aspect-video rounded-xl cursor-pointer transition-all relative overflow-hidden group",
                          bg,
                          formData.coverBg === bg ? "ring-2 ring-offset-2 ring-[#fa541c] shadow-md shadow-orange-500/20" : "hover:opacity-80 hover:scale-105"
                        )}
                      >
                        {formData.coverBg === bg && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        )}
                        {/* Decorative pattern for presets */}
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] mix-blend-overlay"></div>
                      </div>
                    ))}
                    <div className="aspect-video rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-orange-50 cursor-pointer transition-all group">
                      <Upload className="w-5 h-5 mb-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[11px] font-bold">自定义</span>
                    </div>
                  </div>
                </div>

                {/* 课程标签 */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                    课程标签
                  </label>
                  <input
                      type="text"
                      placeholder="使用逗号分隔，例如：Python, 深度学习, 实战"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#fa541c] focus:ring-2 focus:ring-[#fa541c]/20 outline-none transition-all placeholder:text-neutral-300 text-[14px] text-neutral-900"
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                </div>

                {/* 课程描述 */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1">
                    详细描述
                  </label>
                  <textarea
                      rows={5}
                      placeholder="详细说明课程的教学大纲、适用人群、以及学习后的收获..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#fa541c] focus:ring-2 focus:ring-[#fa541c]/20 outline-none transition-all resize-none placeholder:text-neutral-300 text-[14px] text-neutral-900 leading-relaxed custom-scrollbar"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
            <div className="mb-4 flex items-center gap-2 text-[14px] font-black text-neutral-400 px-1 uppercase tracking-widest">
              <LayoutTemplate className="w-4 h-4" /> 课程卡片实时预览
            </div>
            
            <div className="bg-white rounded-[20px] border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(250,84,28,0.1)] group">
              {/* Cover Area */}
              <div className={cn("h-[210px] w-full relative flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-all duration-700", formData.coverBg)}>
                  {/* Decorative background overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
                  
                  {/* Hexagon Pattern Decoration */}
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:rotate-12 transition-transform duration-1000">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>

                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded border border-white/30 shadow-sm z-10">
                    {formData.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded border border-white/10 flex items-center gap-1.5 z-10 shadow-sm">
                    <BarChart className="w-3.5 h-3.5" /> {formData.level}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white drop-shadow-md line-clamp-2 leading-tight relative z-10 px-4">
                    {formData.name || '此处显示课程名称'}
                  </h3>
              </div>
              
              {/* Card Content Area */}
              <div className="p-6">
                  <p className="text-[13px] text-neutral-500 mb-5 line-clamp-2 min-h-[40px] leading-relaxed">
                    {formData.shortDesc || '在这里用一句话描述这门课程的核心亮点和价值，吸引学生报名学习...'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6 min-h-[26px]">
                    {formData.tags ? formData.tags.split(/[,，]/).map((tag, i) => tag.trim() && (
                      <span key={i} className="px-2.5 py-1 bg-neutral-100/80 text-neutral-600 text-[11px] font-bold rounded-md border border-neutral-200">
                        {tag.trim()}
                      </span>
                    )) : (
                      <span className="px-2.5 py-1 bg-neutral-50 text-neutral-400 text-[11px] font-bold rounded-md border border-neutral-200 border-dashed">
                        # 添加课程标签
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-[#fa541c] flex items-center justify-center text-[12px] font-black border border-orange-200 shadow-sm">
                        {formData.creator.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-neutral-800">{formData.creator}</span>
                    </div>
                    <div className="text-[12px] font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded">
                      0 人在学
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-[13px] text-blue-800 shadow-sm">
              <Info className="w-5 h-5 shrink-0 text-blue-500" />
              <p className="leading-relaxed">
                优秀的课程名称和吸引人的封面图可以提升 <strong className="text-blue-600 text-[14px]">300%</strong> 的学生选课转化率。请确保您的描述精准且富有吸引力。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-neutral-100 flex flex-col items-center justify-center text-center max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-3">课程创建成功！</h2>
            <p className="text-neutral-500 text-[15px] font-medium mb-8">即将为您跳转回课程管理页...</p>
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[progress_1.5s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
