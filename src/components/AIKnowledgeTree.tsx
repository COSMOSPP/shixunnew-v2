import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Map, ZoomIn, ZoomOut, Maximize, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialNodes = [
  { id: '1', x: 400, y: 80, title: '人工智能基础', type: 'core', status: 'completed', desc: 'AI基础理论、发展历史及核心分类。' },
  { id: '2', x: 200, y: 200, title: 'Python编程', type: 'basic', status: 'completed', desc: 'Python核心语法、数据结构及常用库。' },
  { id: '3', x: 600, y: 200, title: '数学基础', type: 'basic', status: 'completed', desc: '线性代数、微积分与概率论基础。' },
  { id: '4', x: 400, y: 320, title: '机器学习算法', type: 'core', status: 'current', desc: '监督学习、无监督学习及模型评估方法。' },
  { id: '5', x: 200, y: 450, title: '自然语言处理(NLP)', type: 'advanced', status: 'locked', desc: '文本预处理、词嵌入及Transformer架构。' },
  { id: '6', x: 600, y: 450, title: '计算机视觉(CV)', type: 'advanced', status: 'locked', desc: '图像处理、CNN及目标检测。' },
  { id: '7', x: 400, y: 580, title: '大模型与Agent', type: 'expert', status: 'locked', desc: 'LLM微调、Prompt工程及Agent系统搭建。' },
];

const initialEdges = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '1', target: '3' },
  { id: 'e3', source: '2', target: '4' },
  { id: 'e4', source: '3', target: '4' },
  { id: 'e5', source: '4', target: '5' },
  { id: 'e6', source: '4', target: '6' },
  { id: 'e7', source: '5', target: '7' },
  { id: 'e8', source: '6', target: '7' },
];

export default function AIKnowledgeTree({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.85 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');

  // Center on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTransform({ x: (rect.width - 800) / 2, y: 20, scale: 0.9 });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() !== 'svg') return;
    setIsDraggingCanvas(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return;
    setTransform({ 
      ...transform, 
      x: e.clientX - dragStart.current.x, 
      y: e.clientY - dragStart.current.y 
    });
  };

  const handleMouseUp = () => setIsDraggingCanvas(false);

  const zoomIn = () => setTransform(t => ({ ...t, scale: Math.min(t.scale + 0.15, 2) }));
  const zoomOut = () => setTransform(t => ({ ...t, scale: Math.max(t.scale - 0.15, 0.4) }));
  const resetZoom = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTransform({ x: (rect.width - 800) / 2, y: 20, scale: 0.9 });
    }
  };

  const activeNode = activeNodeId ? initialNodes.find(n => n.id === activeNodeId) : null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Map className="w-6 h-6 text-slate-700" />
           <h2 className="text-2xl font-bold text-slate-900">{isLoggedIn ? '图谱化学习路径' : 'AI 知识图谱'}</h2>
           {!isLoggedIn && <span className="ml-4 text-sm text-slate-500 hidden md:inline bg-slate-100 px-3 py-1 rounded-full">完整的AI课程体系，覆盖从入门到专家的全链路</span>}
        </div>
        <div className="flex items-center gap-4">
           {/* Filters */}
           <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
             {[{id:'all', label:'全部'}, {id:'core', label:'核心主线'}, {id:'basic', label:'基础铺垫'}].map(f => (
               <button 
                 key={f.id} 
                 onClick={() => setFilterType(f.id)}
                 className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filterType === f.id ? 'bg-white text-slate-900 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {f.label}
               </button>
             ))}
           </div>
           <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#fa541c]">
             {isLoggedIn ? '查看详情' : '探索课程'} <ArrowRight className="w-4 h-4 ml-1" />
           </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[600px] relative flex">
        
        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className={`flex-1 relative overflow-hidden bg-[#fafafa] ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div 
            className="absolute origin-top-left transition-transform duration-75 ease-linear"
            style={{ 
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              width: '800px', height: '800px'
            }}
          >
            {/* SVG Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#fa541c" />
                </marker>
              </defs>
              {initialEdges.map(edge => {
                const source = initialNodes.find(n => n.id === edge.source);
                const target = initialNodes.find(n => n.id === edge.target);
                if (!source || !target) return null;
                
                // Hide if filtered out
                if (filterType !== 'all' && source.type !== filterType && target.type !== filterType) return null;

                const isActive = activeNodeId === edge.source || activeNodeId === edge.target;
                
                return (
                  <line 
                    key={edge.id}
                    x1={source.x} 
                    y1={source.y} 
                    x2={target.x} 
                    y2={target.y} 
                    stroke={isActive ? '#fa541c' : '#e2e8f0'} 
                    strokeWidth={isActive ? 3 : 2}
                    markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-all duration-300 pointer-events-none"
                  />
                );
              })}
            </svg>

            {/* HTML Nodes */}
            {initialNodes.map(node => {
              if (filterType !== 'all' && node.type !== filterType) {
                 return null; // hide completely
              }

              const isCompleted = isLoggedIn && node.status === 'completed';
              const isCurrent = isLoggedIn && node.status === 'current';
              const isDemoHighlight = !isLoggedIn && (node.type === 'core' || node.type === 'basic');
              const isActive = activeNodeId === node.id;
              
              let bgClass = 'bg-white border-slate-200 text-slate-600';
              if (isCompleted) bgClass = 'bg-[#f0fdf4] border-green-200 text-green-700 shadow-green-100';
              else if (isCurrent) bgClass = 'bg-[#fff2e8] border-[#fa541c] text-[#fa541c] shadow-orange-100 ring-2 ring-[#fa541c]/20';
              else if (isDemoHighlight) bgClass = 'bg-blue-50 border-blue-200 text-blue-700 shadow-blue-100';
              
              return (
                <div 
                  key={node.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 rounded-xl py-3 px-5 shadow-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 z-10 w-36 ${bgClass} ${isActive ? 'ring-4 ring-blue-500/30 scale-110 z-20 shadow-lg' : ''}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNodeId(node.id);
                  }}
                >
                  <div className="font-bold text-sm text-center mb-1">{node.title}</div>
                  <div className="text-[10px] uppercase font-medium opacity-70 bg-black/5 px-2 py-0.5 rounded-full">
                    {isLoggedIn ? (isCompleted ? '已掌握' : isCurrent ? '学习中' : '待解锁') : (node.type === 'core' ? '核心必修' : node.type === 'basic' ? '基础铺垫' : '进阶内容')}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col pointer-events-auto">
            <button onClick={zoomIn} className="p-2 hover:bg-slate-50 border-b border-slate-100 transition-colors" title="放大"><ZoomIn className="w-4 h-4 text-slate-600" /></button>
            <button onClick={resetZoom} className="p-2 hover:bg-slate-50 border-b border-slate-100 transition-colors" title="适应屏幕"><Maximize className="w-4 h-4 text-slate-600" /></button>
            <button onClick={zoomOut} className="p-2 hover:bg-slate-50 transition-colors" title="缩小"><ZoomOut className="w-4 h-4 text-slate-600" /></button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className={`w-80 bg-white border-l border-slate-200 transition-all duration-300 flex flex-col z-20 ${activeNodeId ? 'translate-x-0' : 'translate-x-[110%] absolute right-0 h-full shadow-2xl'}`}>
           {activeNode ? (
             <>
                <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <span className={`w-2 h-2 rounded-full ${isLoggedIn ? (activeNode.status === 'completed' ? 'bg-green-500' : activeNode.status === 'current' ? 'bg-[#fa541c]' : 'bg-slate-300') : 'bg-blue-500'}`}></span>
                       <span className="text-xs text-slate-500 font-medium">
                         {isLoggedIn ? (activeNode.status === 'completed' ? '已掌握知识点' : activeNode.status === 'current' ? '当前学习目标' : '前置要求未满足') : (activeNode.type === 'core' ? '核心必修部分' : activeNode.type === 'basic' ? '基础铺垫部分' : '进阶扩展部分')}
                       </span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900">{activeNode.title}</h3>
                   </div>
                   <button onClick={() => setActiveNodeId(null)} className="p-1 hover:bg-slate-200 bg-white rounded-md text-slate-400 border border-slate-200">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">知识点概述</h4>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{activeNode.desc}</p>
                  
                  <h4 className="text-sm font-bold text-slate-900 mb-3">相关课程</h4>
                  <div className="space-y-3">
                     {[1, 2].map((_, i) => (
                       <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-3 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-colors group flex items-start gap-3">
                         <div className="w-10 h-10 rounded bg-[#fa541c]/10 text-[#fa541c] flex flex-shrink-0 items-center justify-center group-hover:bg-[#fa541c] group-hover:text-white transition-colors">
                           <Play className="w-4 h-4 ml-0.5" />
                         </div>
                         <div>
                           <div className="text-sm font-medium text-slate-900 mb-1 leading-tight">{activeNode.title} 核心实战课-{i+1}</div>
                           <div className="text-xs text-slate-500">2.5 小时 · 12节课</div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100">
                  <Button className="w-full bg-[#fa541c] hover:bg-[#d4380d] text-white">
                    {isLoggedIn ? (activeNode.status === 'locked' ? '锁定中 (需完成前置)' : '继续学习') : '登录后开始学习'}
                  </Button>
                </div>
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                点击节点查看详情
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
