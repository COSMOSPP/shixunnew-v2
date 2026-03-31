import { ArrowRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIKnowledgeTree() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Map className="w-6 h-6 text-slate-700" />
           <h2 className="text-2xl font-bold text-slate-900">你的学习路径</h2>
        </div>
        <Button variant="ghost" className="text-slate-500 hover:text-[#fa541c]">
          查看详情 <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-sm text-slate-500 mb-1">当前路径</div>
            <div className="text-xl font-bold text-[#fa541c]">Python开发 → 机器学习工程师</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-1">总进度</div>
            <div className="text-xl font-bold text-[#1e3a8a]">35%</div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="relative mb-12">
          <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
          <div className="absolute top-4 left-0 w-[35%] h-1 bg-[#fa541c] rounded-full"></div>
          
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#fa541c] flex items-center justify-center z-10 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#fa541c]"></div>
              </div>
              <div className="text-sm font-medium text-[#fa541c] line-through decoration-[#fa541c]">入门</div>
              <div className="text-xs text-[#fa541c] mt-1">已完成</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#fff2e8] border-2 border-[#ffbb96] flex items-center justify-center z-10 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#fa541c]"></div>
              </div>
              <div className="text-sm font-medium text-[#fa541c]">基础</div>
              <div className="text-xs text-slate-500 mt-1">进行中</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center z-10 mb-2"></div>
              <div className="text-sm font-medium text-slate-400">进阶</div>
              <div className="text-xs text-slate-400 mt-1">待学习</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center z-10 mb-2"></div>
              <div className="text-sm font-medium text-slate-400">实战</div>
              <div className="text-xs text-slate-400 mt-1">待学习</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center z-10 mb-2"></div>
              <div className="text-sm font-medium text-slate-400">专家</div>
              <div className="text-xs text-slate-400 mt-1">待学习</div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2563eb] flex items-center justify-center text-2xl">🐍</div>
            <div>
              <div className="font-bold text-slate-900 mb-1">Python 核心编程</div>
              <div className="text-sm text-slate-500">进行中 · 65%</div>
            </div>
          </div>
          
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2563eb] flex items-center justify-center text-2xl">📊</div>
            <div>
              <div className="font-bold text-slate-900 mb-1">数据分析基础</div>
              <div className="text-sm text-slate-500">进行中 · 42%</div>
            </div>
          </div>
          
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#2563eb] flex items-center justify-center text-2xl">🤖</div>
            <div>
              <div className="font-bold text-slate-900 mb-1">机器学习入门</div>
              <div className="text-sm text-slate-500">待开始</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
