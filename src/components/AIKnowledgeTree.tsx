import React from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AIKnowledgeTree({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const navigate = useNavigate();
  const children = [
    { icon: '🌱', title: 'AI入门', courses: '12门课程' },
    { icon: '🐍', title: 'Python编程', courses: '28门课程' },
    { icon: '🤖', title: '机器学习', courses: '35门课程' },
    { icon: '🔮', title: '深度学习', courses: '42门课程' },
    { icon: '💬', title: 'NLP', courses: '38门课程' },
    { icon: '👁️', title: '计算机视觉', courses: '32门课程' },
  ];

  return (
    <div className="mb-12 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-16 gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="text-2xl">🗺️</span>
             <h2 className="text-2xl font-bold text-slate-900">AI 知识图谱</h2>
           </div>
           <p className="text-sm text-slate-500">完整的AI课程体系，覆盖从入门到专家的全链路学习路径</p>
        </div>
        <Button 
          variant="ghost" 
          className="text-[#fa541c] hover:bg-[#fa541c]/5 hover:text-[#d4380d] font-medium px-2"
          onClick={() => navigate('/user/courses')}
        >
           探索全部课程 <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      {/* Tree Visualization */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-8">
        <div className="min-w-[900px] flex flex-col items-center mx-auto px-4">
          
          {/* Root Node */}
          <div className="w-[260px] py-7 bg-gradient-to-br from-[#ff6b35] to-[#e84a15] rounded-[20px] shadow-[0_12px_32px_rgba(250,84,28,0.25)] flex flex-col items-center justify-center text-white relative z-10 transition-transform hover:scale-105 cursor-pointer">
            <span className="text-3xl mb-3 drop-shadow-md">🧠</span>
            <h3 className="text-xl font-bold mb-1 tracking-wide">人工智能</h3>
            <p className="text-sm text-white/90 font-medium">6大领域·200+课程</p>
          </div>

          {/* Vertical Stem */}
          <div className="w-px h-10 bg-slate-200"></div>

          {/* Children Row Container */}
          <div className="w-full max-w-[1000px] relative">
            {/* Horizontal Line connecting first and last child center */}
            <div className="absolute top-0 left-[8.333%] right-[8.333%] h-px bg-slate-200"></div>
            
            {/* Grid of Children */}
            <div className="grid grid-cols-6 gap-6 relative w-full">
              {children.map((child, i) => (
                <div key={i} className="flex flex-col items-center relative group cursor-pointer">
                  {/* Short vertical line connecting horizontal line to child */}
                  <div className="w-px h-6 bg-slate-200 transition-colors group-hover:bg-[#fa541c]/40"></div>
                  
                  {/* Child Node */}
                  <div className="w-full bg-white border border-slate-100 rounded-[20px] py-7 px-2 flex flex-col items-center shadow-sm group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group-hover:border-[#fa541c]/20 group-hover:-translate-y-1 transition-all duration-300">
                    <span className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{child.icon}</span>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1.5">{child.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{child.courses}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-8 bg-[#fffcf0] border border-[#ffebaa] text-[#d48806] text-[13px] py-3.5 px-8 rounded-full flex items-center justify-center w-fit mx-auto shadow-sm">
        <span className="mr-2 text-base">💡</span> 点击任意节点探索详细课程·登录后可获得个性化学习路径推荐
      </div>
    </div>
  );
}
