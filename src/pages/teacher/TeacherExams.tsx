import React, { useState } from 'react';
import { 
  Search, Plus, ChevronRight, X, Power, Bot, 
  Code, PenTool, CheckCircle, BrainCircuit,
  Calendar, Clock, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherExams({ embedded = false }) {
  // Exams mock data
  const [exams, setExams] = useState([
    {
      id: 1,
      name: '简答题测试',
      status: '启用',
      sessionsCount: 3,
      enrolled: 0,
      creator: 'sun',
      createTime: '2026-04-23 10:10',
      sessions: []
    },
    {
      id: 2,
      name: 'auto_云计算_私有云（实操题）caddywebVnc2026-04-08 15:38...',
      status: '启用',
      sessionsCount: 1,
      enrolled: 100,
      creator: '王凯',
      createTime: '2026-04-08 15:38',
      sessions: [
        {
          id: 201,
          name: 'auto_测试场次202...',
          type: '测试场次',
          location: '--',
          status: '进行中',
          invigilator: '王凯',
          startTime: '2026-04-08 15:38',
          endTime: '--',
          visibility: '显示'
        }
      ]
    },
    {
      id: 3,
      name: '佳能将',
      status: '草稿',
      sessionsCount: 0,
      enrolled: 0,
      creator: '弯弯',
      createTime: '2026-03-24 17:27',
      sessions: []
    },
    {
      id: 4,
      name: '4324321',
      status: '启用',
      sessionsCount: 1,
      enrolled: 0,
      creator: '东方',
      createTime: '2026-03-24 09:09',
      sessions: []
    },
    {
      id: 5,
      name: '432321',
      status: '启用',
      sessionsCount: 1,
      enrolled: 0,
      creator: '东方',
      createTime: '2026-03-24 09:08',
      sessions: []
    }
  ]);

  const [examTab, setExamTab] = useState('all'); // all, active, draft
  const [expandedRow, setExpandedRow] = useState<number | null>(2);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Exam Form states
  const [examName, setExamName] = useState('');
  const [examRule, setExamRule] = useState('仅能提交1次');
  const [enrollCount, setEnrollCount] = useState(0);
  const [organizer, setOrganizer] = useState('');
  const [coOrganizer, setCoOrganizer] = useState('');
  const [intro, setIntro] = useState('');
  const [notice, setNotice] = useState('test');
  const [paperConfig, setPaperConfig] = useState('随机抽题');
  
  // AI Disable Config states
  const [disableAI, setDisableAI] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    qa: true, // true means completely disabled, false means partial/enabled depending on mode
    code: true,
    question: true,
    scoring: true
  });

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleCreate = () => {
    setExams([{
      id: Date.now(),
      name: examName || '未命名考试',
      status: '草稿',
      sessionsCount: 0,
      enrolled: 0,
      creator: '当前用户',
      createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
      sessions: []
    }, ...exams]);
    setIsCreateDrawerOpen(false);
    setExamName('');
    setExamRule('仅能提交1次');
    setEnrollCount(0);
    setOrganizer('');
    setCoOrganizer('');
    setIntro('');
    setNotice('test');
    setPaperConfig('随机抽题');
    setDisableAI(false);
    showToast('新建考试成功');
  };

  // Exam Actions
  const handleToggleExamStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === '启用' ? '草稿' : '启用';
    setExams(exams.map(e => e.id === id ? { ...e, status: newStatus } : e));
    showToast(`考试已${newStatus}`);
  };

  const handleDeleteExam = (id: number) => {
    if (window.confirm('确定要删除该考试吗？此操作不可恢复。')) {
      setExams(exams.filter(e => e.id !== id));
      showToast('考试已删除');
    }
  };

  const handleAddSession = (examId: number) => {
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessionsCount: e.sessionsCount + 1,
          sessions: [
            ...e.sessions,
            {
              id: Date.now(),
              name: `新增测试场次${e.sessionsCount + 1}`,
              type: '测试场次',
              location: '未分配',
              status: '未开始',
              invigilator: '未指定',
              startTime: '--',
              endTime: '--',
              visibility: '隐藏'
            }
          ]
        };
      }
      return e;
    }));
    setExpandedRow(examId);
    showToast('已添加新场次');
  };

  const handleMockNavigate = (action: string) => {
    showToast(`正在跳转至：${action}`, 'info');
  };

  // Session Actions
  const handleToggleSessionVisibility = (examId: number, sessionId: number, currentVisibility: string) => {
    const newVisibility = currentVisibility === '显示' ? '隐藏' : '显示';
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessions: e.sessions.map(s => s.id === sessionId ? { ...s, visibility: newVisibility } : s)
        };
      }
      return e;
    }));
    showToast(`场次已${newVisibility}`);
  };

  const handleEndSession = (examId: number, sessionId: number) => {
    if (window.confirm('确定要结束该场考试吗？结束后学生将无法继续答题。')) {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessions: e.sessions.map(s => s.id === sessionId ? { ...s, status: '已结束' } : s)
          };
        }
        return e;
      }));
      showToast('考试已结束');
    }
  };

  const handleCopySession = (examId: number, session: any) => {
    setExams(exams.map(e => {
      if (e.id === examId) {
        return {
          ...e,
          sessionsCount: e.sessionsCount + 1,
          sessions: [
            ...e.sessions,
            { ...session, id: Date.now(), name: `${session.name} (副本)` }
          ]
        };
      }
      return e;
    }));
    showToast('场次复制成功');
  };

  return (
    <div className={cn("space-y-4", embedded ? "" : "p-6")}>
      
      {/* Top Controller */}
      <div className={cn("flex items-center justify-between gap-4", embedded ? "p-5 pb-4" : "")}>
        <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-border/50">
          <button 
            className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", examTab === 'all' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
            onClick={() => setExamTab('all')}
          >
            全部
          </button>
          <button 
            className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", examTab === 'active' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
            onClick={() => setExamTab('active')}
          >
            启用
          </button>
          <button 
            className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", examTab === 'draft' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
            onClick={() => setExamTab('draft')}
          >
            草稿
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索考试名称" 
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-64 transition-all"
            />
          </div>
          <Button 
            onClick={() => setIsCreateDrawerOpen(true)}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 shadow-sm border-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> 新建考试
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border-y border-neutral-100 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-neutral-100 text-[13px] text-neutral-600">
              <th className="p-4 font-medium w-10 text-center"></th>
              <th className="p-4 font-medium">考试名称</th>
              <th className="p-4 font-medium">考试状态</th>
              <th className="p-4 font-medium">考试场次</th>
              <th className="p-4 font-medium">报名人数</th>
              <th className="p-4 font-medium">创建人</th>
              <th className="p-4 font-medium">创建时间</th>
              <th className="p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <React.Fragment key={exam.id}>
                {/* Parent Row */}
                <tr className={cn(
                  "border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors text-[13px]",
                  expandedRow === exam.id ? "bg-neutral-50/30" : ""
                )}>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleRow(exam.id)}
                      className="text-neutral-400 hover:text-[#fa541c] transition-colors p-1 cursor-pointer"
                    >
                      <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", expandedRow === exam.id && "transform rotate-90 text-[#fa541c]")} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="text-neutral-800 font-medium max-w-[280px] truncate" title={exam.name}>
                      {exam.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[12px] rounded border font-medium",
                      exam.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-[#fff2e8] text-[#fa541c] border-[#ffbb96]"
                    )}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-600">{exam.sessionsCount}</td>
                  <td className="p-4 text-neutral-600">{exam.enrolled}</td>
                  <td className="p-4 text-neutral-600">{exam.creator}</td>
                  <td className="p-4 text-neutral-500">{exam.createTime}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {exam.status === '启用' ? (
                        <>
                          <button onClick={() => handleAddSession(exam.id)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">添加场次</button>
                          <button onClick={() => handleToggleExamStatus(exam.id, exam.status)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">取消启用</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleMockNavigate('编辑考试')} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">编辑</button>
                          <button onClick={() => handleDeleteExam(exam.id)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">删除</button>
                          <button onClick={() => handleToggleExamStatus(exam.id, exam.status)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">启用</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                
                {/* Nested Sessions Table */}
                {expandedRow === exam.id && (
                  <tr className="bg-neutral-50/50 border-b border-neutral-100">
                    <td colSpan={8} className="p-0">
                      <div className="p-6 pr-8 pl-16 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                        <table className="w-full text-left border-collapse border border-neutral-200 bg-white shadow-sm rounded-lg overflow-hidden">
                          <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[12px] text-neutral-500 font-bold">
                              <th className="p-3">场次名称</th>
                              <th className="p-3">场次类型</th>
                              <th className="p-3">考场</th>
                              <th className="p-3">状态</th>
                              <th className="p-3">监考老师</th>
                              <th className="p-3">开始时间</th>
                              <th className="p-3">结束时间</th>
                              <th className="p-3">可见状态</th>
                              <th className="p-3">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exam.sessions.length > 0 ? exam.sessions.map(session => (
                              <tr key={session.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/30 text-[12px]">
                                <td className="p-3 text-neutral-700 font-medium">{session.name}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">{session.type}</span>
                                </td>
                                <td className="p-3 text-neutral-600">{session.location}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded border border-[#ffbb96]">{session.status}</span>
                                </td>
                                <td className="p-3 text-neutral-600">{session.invigilator}</td>
                                <td className="p-3 text-neutral-600">{session.startTime}</td>
                                <td className="p-3 text-neutral-600">{session.endTime}</td>
                                <td className="p-3 text-neutral-600">{session.visibility}</td>
                                <td className="p-3">
                                  <div className="flex flex-wrap items-center gap-2 max-w-[160px]">
                                    <button onClick={() => handleMockNavigate('编辑场次')} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">编辑</button>
                                    <button onClick={() => handleCopySession(exam.id, session)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">复制</button>
                                    <button onClick={() => handleMockNavigate('考生名单管理')} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">考生名单</button>
                                    <button onClick={() => handleMockNavigate('监考信息管理')} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">监考信息</button>
                                    {session.status !== '已结束' && (
                                      <button onClick={() => handleEndSession(exam.id, session.id)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">结束考试</button>
                                    )}
                                    <button onClick={() => handleToggleSessionVisibility(exam.id, session.id, session.visibility)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">
                                      {session.visibility === '显示' ? '隐藏' : '显示'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={9} className="p-6 text-center text-neutral-400 text-xs">
                                  暂无场次信息
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={cn("flex items-center justify-between p-4 gap-4 mt-2", embedded ? "" : "border-t border-neutral-100")}>
        <span className="text-[13px] text-neutral-500">共 219 条</span>
        <div className="flex items-center gap-3">
          <select className="text-[13px] border border-neutral-200 rounded px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600">
            <option>30条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <div className="flex items-center gap-1 text-[13px] font-medium text-neutral-600">
            <button className="w-6 h-6 flex items-center justify-center text-neutral-400 cursor-not-allowed">&lt;</button>
            <button className="w-6 h-6 flex items-center justify-center text-[#fa541c] font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">3</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">4</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">5</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">6</button>
            <span className="w-4 flex justify-center">...</span>
            <button className="w-6 h-6 flex items-center justify-center hover:text-[#fa541c] cursor-pointer">8</button>
            <button className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-[#fa541c] cursor-pointer">&gt;</button>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-neutral-600 ml-2">
            前往 <input type="text" className="w-10 h-7 border border-neutral-200 rounded text-center focus:outline-none focus:border-[#fa541c]" defaultValue="1" /> 页
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white px-6 py-3 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-neutral-800">{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Create Exam Drawer */}
      {isCreateDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsCreateDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
              <h2 className="text-[15px] font-bold text-neutral-850">新增考试配置</h2>
              <button 
                onClick={() => setIsCreateDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              
              {/* Exam Name */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  考试名称 <span className="text-[#fa541c]">*</span>
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="请输入考试名称"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              {/* 规则 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  规则 <span className="text-[#fa541c]">*</span>
                </label>
                <select 
                  value={examRule}
                  onChange={(e) => setExamRule(e.target.value)}
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white"
                >
                  <option value="仅能提交1次">仅能提交1次</option>
                  <option value="无限次提交">无限次提交</option>
                </select>
              </div>

              {/* 报名人数 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  报名人数
                </label>
                <div className="flex items-center border border-neutral-200 rounded w-fit h-9">
                  <button 
                    onClick={() => setEnrollCount(Math.max(0, enrollCount - 1))}
                    className="w-9 h-full flex items-center justify-center text-neutral-400 hover:text-[#fa541c] border-r border-neutral-200 transition-colors bg-[#fbfbfb] cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min={0}
                    value={enrollCount}
                    onChange={(e) => setEnrollCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 h-full text-center text-[13px] font-medium text-neutral-800 focus:outline-none focus:bg-orange-50/30"
                  />
                  <button 
                    onClick={() => setEnrollCount(enrollCount + 1)}
                    className="w-9 h-full flex items-center justify-center text-neutral-400 hover:text-[#fa541c] border-l border-neutral-200 transition-colors bg-[#fbfbfb] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 主办方 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  主办方
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="请输入主办方"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              {/* 协办方 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  协办方
                </label>
                <input
                  type="text"
                  value={coOrganizer}
                  onChange={(e) => setCoOrganizer(e.target.value)}
                  placeholder="请输入协办方"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              {/* 介绍 */}
              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1 pt-2">
                  介绍
                </label>
                <textarea
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="请输入介绍"
                  className="w-full h-24 border border-neutral-200 rounded px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 resize-none"
                />
              </div>

              {/* 须知 */}
              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1 pt-2">
                  须知 <span className="text-[#fa541c]">*</span>
                </label>
                <textarea
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  placeholder="请输入须知"
                  className="w-full h-24 border border-neutral-200 rounded px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 resize-none"
                />
              </div>

              {/* 试卷配置 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right flex items-center justify-end gap-1">
                  试卷配置 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {['随机抽题', '手动选题', '千人千卷'].map((cfg) => (
                    <label key={cfg} className="flex items-center gap-2 cursor-pointer group text-[13px] text-neutral-500 select-none font-bold">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="paperConfig"
                          value={cfg}
                          checked={paperConfig === cfg}
                          onChange={() => setPaperConfig(cfg)}
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          paperConfig === cfg 
                            ? "border-neutral-300 bg-white" 
                            : "border-neutral-200 group-hover:border-[#fa541c]"
                        )}>
                          {paperConfig === cfg && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          )}
                        </span>
                      </span>
                      <span>{cfg}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100 mt-2 pt-6"></div>

              {/* AI Config Section (The Core Feature) */}
              <div className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm space-y-4 relative overflow-hidden group mx-1">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-orange-100/20 rounded-bl-full -z-0 pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                
                <div className="flex items-center justify-between border-b border-neutral-50 pb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <BrainCircuit className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 text-[15px]">考试期间禁用AI</h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5">防作弊策略，自动控制学生在考试期间的AI能力使用</p>
                    </div>
                  </div>
                  
                  {/* Premium Master Switch */}
                  <div 
                    onClick={() => setDisableAI(!disableAI)}
                    className={cn(
                      "w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 shadow-inner",
                      disableAI ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-neutral-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center",
                      disableAI ? "translate-x-6" : "translate-x-0"
                    )}>
                      {disableAI && <Power className="w-2.5 h-2.5 text-purple-600" />}
                    </div>
                  </div>
                </div>

                {/* Sub Configs when master switch is ON */}
                <div className={cn(
                  "grid gap-3 transition-all duration-300 origin-top overflow-hidden",
                  disableAI ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="min-h-0 space-y-3">
                    <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 text-xs text-purple-700 font-medium flex items-start gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p>启用后，将在指定场次的时间窗口内对参考学生生效。<strong>考试结束后自动恢复</strong>对应AI权限。</p>
                    </div>

                    <div className="space-y-3">
                      {/* AI QA */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50/30 hover:border-purple-200 hover:bg-purple-50/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                            <Bot className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-neutral-800">AI 问答助手</div>
                            <div className="text-[11px] text-neutral-500">全局对话与多轮问答功能</div>
                          </div>
                        </div>
                        <select 
                          className="text-xs border border-neutral-200 rounded py-1 px-2 focus:outline-none focus:border-purple-500 bg-white shadow-sm font-medium"
                          value={aiConfig.qa ? 'disable' : 'enable'}
                          onChange={(e) => setAiConfig({...aiConfig, qa: e.target.value === 'disable'})}
                        >
                          <option value="disable">禁用</option>
                          <option value="enable">允许使用</option>
                        </select>
                      </div>

                      {/* Code Assistant */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50/30 hover:border-purple-200 hover:bg-purple-50/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                            <Code className="w-4 h-4 text-sky-500" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-neutral-800">代码生成与补全</div>
                            <div className="text-[11px] text-neutral-500">IDE内的代码补全与诊断分析</div>
                          </div>
                        </div>
                        <select 
                          className="text-xs border border-neutral-200 rounded py-1 px-2 focus:outline-none focus:border-purple-500 bg-white shadow-sm font-medium"
                          value={aiConfig.code ? 'disable' : 'enable'}
                          onChange={(e) => setAiConfig({...aiConfig, code: e.target.value === 'disable'})}
                        >
                          <option value="disable">完全禁用</option>
                          <option value="downgrade">降级 (仅提示语法)</option>
                          <option value="enable">允许使用</option>
                        </select>
                      </div>

                      {/* Generation Assistant */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50/30 hover:border-purple-200 hover:bg-purple-50/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                            <PenTool className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-neutral-800">出题助手与文案生成</div>
                            <div className="text-[11px] text-neutral-500">限制一键生成内容的能力</div>
                          </div>
                        </div>
                        <select 
                          className="text-xs border border-neutral-200 rounded py-1 px-2 focus:outline-none focus:border-purple-500 bg-white shadow-sm font-medium"
                          value={aiConfig.question ? 'disable' : 'enable'}
                          onChange={(e) => setAiConfig({...aiConfig, question: e.target.value === 'disable'})}
                        >
                          <option value="disable">禁用</option>
                          <option value="enable">允许使用</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsCreateDrawerOpen(false)}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-lg cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-lg shadow-sm border-0 cursor-pointer"
              >
                保存并配置场次
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
