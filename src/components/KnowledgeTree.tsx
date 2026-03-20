import React from "react";
import { ArrowRight } from "lucide-react";

type CourseNode = {
  name: string;
  status: "online" | "upcoming";
};

type BranchData = {
  title: string;
  courses: CourseNode[];
};

type TreeColumn = {
  id: number;
  up: BranchData;
  down: BranchData;
};

const treeData: TreeColumn[] = [
  {
    id: 1,
    up: {
      title: "人工智能入门",
      courses: [
        { name: "人工智能通识课", status: "online" },
        { name: "人人都学 | 什么是AI?", status: "online" },
        { name: "AI浪潮下的云计算和产...", status: "online" },
      ]
    },
    down: {
      title: "数学基础",
      courses: [
        { name: "AI数学基础", status: "online" },
      ]
    }
  },
  {
    id: 2,
    up: {
      title: "编程语言",
      courses: [
        { name: "天池编程基础课", status: "online" },
        { name: "Python编程入门", status: "online" },
      ]
    },
    down: {
      title: "工具与框架",
      courses: [
        { name: "Docker实践", status: "online" },
        { name: "TensorFlow", status: "online" },
        { name: "Pytorch实战", status: "online" },
      ]
    }
  },
  {
    id: 3,
    up: {
      title: "Python",
      courses: [
        { name: "Python语法", status: "online" },
        { name: "Python趣味绘画编程启蒙", status: "online" },
      ]
    },
    down: {
      title: "数据分析",
      courses: [
        { name: "Numpy实践", status: "online" },
        { name: "Pandas实践", status: "online" },
        { name: "Matplotlib实践", status: "online" },
      ]
    }
  },
  {
    id: 4,
    up: {
      title: "机器学习",
      courses: [
        { name: "机器学习原理与实践", status: "online" },
        { name: "机器学习算法与实战", status: "online" },
      ]
    },
    down: {
      title: "深度学习",
      courses: [
        { name: "深度学习原理与实践", status: "online" },
        { name: "深度学习理论与实战", status: "online" },
      ]
    }
  },
  {
    id: 5,
    up: {
      title: "计算机视觉",
      courses: [
        { name: "视觉AI应用入门与实战", status: "online" },
        { name: "计算机视觉入门与实战", status: "online" },
      ]
    },
    down: {
      title: "自然语言处理",
      courses: [
        { name: "机器阅读技术与应用", status: "online" },
        { name: "开放语聊技术与应用", status: "online" },
        { name: "达摩院NLP技术和应用", status: "online" },
      ]
    }
  },
  {
    id: 6,
    up: {
      title: "AI大模型",
      courses: [
        { name: "开发者的LLM入门课程", status: "online" },
        { name: "动手学Agent应用开发", status: "online" },
        { name: "Deepseek辅助学术科研...", status: "online" },
        { name: "AI高效编程秘籍", status: "online" },
        { name: "模型瘦身秘籍", status: "online" },
      ]
    },
    down: {
      title: "语音与语言技术",
      courses: [
        { name: "语音识别原理与应用", status: "online" },
        { name: "语音合成技术", status: "online" },
        { name: "声纹识别技术", status: "online" },
        { name: "人机对话技术浅析", status: "online" },
      ]
    }
  }
];

export default function KnowledgeTree() {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden relative">
      <div className="p-6 pb-0 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#fa541c] rounded-full"></span>
          AI知识树
        </h2>
      </div>

      <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
        <div className="min-w-[1350px] h-[480px] relative mt-8">
          
          {/* Main Trunk */}
          <div className="absolute top-1/2 left-[60px] right-[60px] h-[2px] bg-[#fa541c] -translate-y-1/2 z-10"></div>
          
          {/* Left Label */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center z-20">
            <div className="bg-[#fa541c] text-white px-2.5 py-5 rounded-full font-bold text-[13px] tracking-[0.2em] shadow-sm flex items-center justify-center min-h-[120px]" style={{ writingMode: 'vertical-lr' }}>
              AI知识树
            </div>
          </div>

          {/* Right Buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 z-20">
            <button className="flex flex-col items-center justify-center gap-2 px-2.5 py-5 rounded-full border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] transition-colors bg-white shadow-sm min-h-[120px]">
              <span className="tracking-widest text-[13px] font-medium" style={{ writingMode: 'vertical-lr' }}>所有课程</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Branches */}
          <div className="absolute inset-0 left-[120px] right-[260px] z-10">
            {treeData.map((col, index) => {
              // Calculate horizontal position
              const leftPos = `${(index / (treeData.length - 1)) * 100}%`;
              
              return (
                <div key={col.id} className="absolute top-0 bottom-0 w-0" style={{ left: leftPos }}>
                  
                  {/* Up Branch */}
                  <div className="absolute bottom-1/2 left-0 flex flex-col justify-end pb-4">
                    {/* Curved line connecting to trunk */}
                    <svg className="absolute bottom-0 left-0 w-8 h-8 -translate-x-full translate-y-[1px]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                      <path d="M0 32 Q 32 32 32 0" stroke="#fa541c" strokeWidth="1.5" fill="none" />
                    </svg>
                    
                    {/* Vertical line */}
                    <div className="absolute bottom-0 left-0 w-[1.5px] bg-[#fa541c] h-[calc(100%-16px)]"></div>
                    
                    {/* Nodes */}
                    <div className="relative z-10 flex flex-col gap-4 pl-4">
                      {/* Title Node */}
                      <div className="flex items-center gap-2 -ml-[23px]">
                        <div className="w-4 h-4 rounded-full bg-[#fa541c] flex items-center justify-center border-2 border-white shadow-sm relative z-20">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap">{col.up.title}</span>
                      </div>
                      
                      {/* Course Nodes */}
                      {col.up.courses.map((course, i) => (
                        <div key={i} className="flex items-center gap-2 -ml-[21px] group cursor-pointer relative z-20">
                          <div className={`w-3 h-3 rounded-full border-2 ${course.status === 'online' ? 'border-[#fa541c] bg-white' : 'border-[#fa541c] bg-[#fa541c]'} group-hover:scale-125 transition-transform`}></div>
                          <span className="text-[13px] text-slate-600 group-hover:text-[#fa541c] transition-colors whitespace-nowrap">{course.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Down Branch */}
                  <div className="absolute top-1/2 left-8 flex flex-col pt-4">
                    {/* Curved line connecting to trunk */}
                    <svg className="absolute top-0 left-0 w-8 h-8 -translate-x-full -translate-y-[1px]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                      <path d="M0 0 Q 32 0 32 32" stroke="#fa541c" strokeWidth="1.5" fill="none" />
                    </svg>
                    
                    {/* Vertical line */}
                    <div className="absolute top-0 left-0 w-[1.5px] bg-[#fa541c] h-[calc(100%-16px)]"></div>
                    
                    {/* Nodes */}
                    <div className="relative z-10 flex flex-col gap-4 pl-4">
                      {/* Course Nodes */}
                      {col.down.courses.map((course, i) => (
                        <div key={i} className="flex items-center gap-2 -ml-[21px] group cursor-pointer relative z-20">
                          <div className={`w-3 h-3 rounded-full border-2 ${course.status === 'online' ? 'border-[#fa541c] bg-white' : 'border-[#fa541c] bg-[#fa541c]'} group-hover:scale-125 transition-transform`}></div>
                          <span className="text-[13px] text-slate-600 group-hover:text-[#fa541c] transition-colors whitespace-nowrap">{course.name}</span>
                        </div>
                      ))}
                      
                      {/* Title Node */}
                      <div className="flex items-center gap-2 -ml-[23px]">
                        <div className="w-4 h-4 rounded-full bg-[#fa541c] flex items-center justify-center border-2 border-white shadow-sm relative z-20">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap">{col.down.title}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
