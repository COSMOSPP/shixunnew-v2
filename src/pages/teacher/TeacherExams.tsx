import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, ChevronRight, ChevronDown, X, Power, Bot, Check,
  Code, PenTool, CheckCircle, BrainCircuit,
  Calendar, Clock, User,
  Bold, Italic, Type, List, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Link2, Maximize2, FileText,
  Users, Award, Trophy, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

interface MockPaper {
  name: string;
  count: number;
  method: string;
  types: string;
  score: number;
  creator: string;
}

const MOCK_PAPERS_PAGED: Record<number, MockPaper[]> = {
  1: [
    { name: '基础练习试卷1', count: 10, method: '随机抽题', types: '单选题、多选题', score: 50, creator: '李四' },
    { name: '基础练习试卷2', count: 15, method: '手动抽题', types: '填空题、简答题', score: 50, creator: '王五' },
    { name: '基础练习试卷3', count: 20, method: '随机抽题', types: '简答题、思考题', score: 100, creator: '张三' },
    { name: '基础练习试卷4', count: 30, method: '手动抽题', types: '编程题', score: 100, creator: '刘能' },
  ],
  2: [
    { name: '作业试卷1', count: 100, method: '随机抽题', types: '单选题、填空题、实训题、简答题', score: 100, creator: '张三' },
    { name: '作业试卷2', count: 2, method: '手动抽题', types: '实训题', score: 20, creator: '李四' },
    { name: '作业试卷3', count: 40, method: '随机抽题', types: '单选题、填空题、多选题、简答题、思考题、判断题', score: 40, creator: '王五' },
    { name: '作业试卷4', count: 4, method: '手动抽题', types: '实训题', score: 60, creator: '刘能' },
  ],
  3: [
    { name: '期末测试A卷', count: 50, method: '随机抽题', types: '单选题、填空题、多选题、编程题', score: 100, creator: '张三' },
    { name: '期末测试B卷', count: 50, method: '随机抽题', types: '单选题、填空题、多选题、编程题', score: 100, creator: '张三' },
    { name: 'Mo智能体开发试卷', count: 5, method: '手动抽题', types: '实训题', score: 100, creator: '李四' },
    { name: 'Python高级特性自测', count: 10, method: '随机抽题', types: '单选题、多选题、编程题', score: 100, creator: '王五' },
  ],
  4: [
    { name: '机器学习导论测试', count: 25, method: '随机抽题', types: '单选题、多选题、简答题', score: 100, creator: '王五' },
    { name: '深度学习神经网络测试', count: 30, method: '手动抽题', types: '单选题、简答题、思考题', score: 100, creator: '张三' },
    { name: '计算机视觉实战练习', count: 3, method: '手动抽题', types: '实训题', score: 60, creator: '李四' },
    { name: '自然语言处理实践作业', count: 5, method: '手动抽题', types: '实训题、编程题', score: 80, creator: '刘能' },
  ],
  5: [
    { name: '人工智能基础常识', count: 50, method: '随机抽题', types: '单选题、判断题', score: 100, creator: '刘能' },
    { name: '强化学习算法自测', count: 8, method: '手动抽题', types: '简答题、编程题', score: 100, creator: '张三' },
    { name: 'Mo模型部署操作题', count: 1, method: '手动抽题', types: '实训题', score: 100, creator: '李四' },
    { name: '大模型微调技巧练习', count: 12, method: '随机抽题', types: '单选题、多选题、思考题', score: 100, creator: '王五' },
  ]
};

export default function TeacherExams({ embedded = false }) {
  const navigate = useNavigate();
  // Exams mock data
  const [exams, setExams] = useState([
    {
      id: 1,
      name: '机器学习技术与应用',
      status: '启用',
      sessionsCount: 3,
      enrolled: 21,
      creator: '管理员',
      createTime: '2099/02/28 00:00',
      sessions: [
        {
          id: 101,
          name: '9月25日下午场',
          type: '正式场次',
          location: '天宝路C402',
          status: '已结束',
          invigilator: '张三',
          startTime: '2099/02/28 00:00',
          endTime: '2099/02/28 00:00',
          visibility: '显示'
        },
        {
          id: 102,
          name: '9月25日下午场',
          type: '正式场次',
          location: '天宝路C402',
          status: '已结束',
          invigilator: '张三',
          startTime: '2099/02/28 00:00',
          endTime: '2099/02/28 00:00',
          visibility: '显示'
        }
      ]
    },
    {
      id: 2,
      name: '机器学习技术与应用',
      status: '启用',
      sessionsCount: 3,
      enrolled: 21,
      creator: '管理员',
      createTime: '2099/02/28 00:00',
      sessions: [
        {
          id: 201,
          name: '9月25日下午场',
          type: '正式场次',
          location: '天宝路C402',
          status: '已结束',
          invigilator: '张三',
          startTime: '2099/02/28 00:00',
          endTime: '2099/02/28 00:00',
          visibility: '显示'
        },
        {
          id: 202,
          name: '9月25日下午场',
          type: '正式场次',
          location: '天宝路C402',
          status: '已结束',
          invigilator: '张三',
          startTime: '2099/02/28 00:00',
          endTime: '2099/02/28 00:00',
          visibility: '显示'
        }
      ]
    }
  ]);

  const [examTab, setExamTab] = useState('all'); // all, active, draft
  const [expandedRow, setExpandedRow] = useState<number | null>(2);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    showCancel: boolean;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    showCancel: true,
    onConfirm: () => {}
  });
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdownId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Exam Form states
  const [examName, setExamName] = useState('');
  const [examRule, setExamRule] = useState('仅能提交1次');
  const [isExamRuleDropdownOpen, setIsExamRuleDropdownOpen] = useState(false);
  const examRuleDropdownRef = useRef<HTMLDivElement>(null);
  const [enrollCount, setEnrollCount] = useState(0);
  const [organizer, setOrganizer] = useState('');
  const [coOrganizer, setCoOrganizer] = useState('');
  const [intro, setIntro] = useState('');
  const [notice, setNotice] = useState('test');
   const [paperConfig, setPaperConfig] = useState('');
  const [showSelectPaperModal, setShowSelectPaperModal] = useState(false);
  const [paperModalPage, setPaperModalPage] = useState(1);
  const [tempSelectedPaper, setTempSelectedPaper] = useState('');

  // Add Session Drawer states
  const [isAddSessionDrawerOpen, setIsAddSessionDrawerOpen] = useState(false);
  const [targetExamId, setTargetExamId] = useState<number | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState('正式场次');
  const [sessionStartTime, setSessionStartTime] = useState('');
  const [sessionEndTime, setSessionEndTime] = useState('');
  const [sessionLocation, setSessionLocation] = useState('');
  const [sessionInvigilator, setSessionInvigilator] = useState('');
  const [isInvigilatorDropdownOpen, setIsInvigilatorDropdownOpen] = useState(false);

  // Details Drawer states
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsType, setDetailsType] = useState<'students' | 'scores' | 'scoring' | 'invigilation' | 'rank' | 'exam'>('students');
  const [detailsSession, setDetailsSession] = useState<any>(null);

  // Candidates Drawer states
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [candidateList, setCandidateList] = useState([
    { id: 1, account: 'liuwei', name: 'liuwei', phone: '18751836671', group: '测试用户' },
    { id: 2, account: 'zhangsan', name: '张三', phone: '13812345678', group: '人工智能一班' },
    { id: 3, account: 'lisi', name: '李四', phone: '13912345678', group: '数据科学二班' },
    { id: 4, account: 'wangwu', name: '王五', phone: '13512345678', group: '软件工程一班' }
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (examRuleDropdownRef.current && !examRuleDropdownRef.current.contains(event.target as Node)) {
        setIsExamRuleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? {
        ...e,
        name: examName || '未命名考试'
      } : e));
      showToast('编辑考试成功');
    } else {
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
      showToast('新建考试成功');
    }
    setIsCreateDrawerOpen(false);
    setEditingExam(null);
    setExamName('');
    setExamRule('仅能提交1次');
    setEnrollCount(0);
    setOrganizer('');
    setCoOrganizer('');
    setIntro('');
    setNotice('test');
    setPaperConfig('');
    setDisableAI(false);
    setShowSelectPaperModal(false);
    setPaperModalPage(1);
    setTempSelectedPaper('');
    setIsExamRuleDropdownOpen(false);
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

  const handleSaveSession = () => {
    if (!sessionName.trim()) {
      showToast('请输入场次名称', 'error');
      return;
    }
    if (!sessionStartTime || !sessionEndTime) {
      showToast('请选择场次时间', 'error');
      return;
    }
    if (!sessionInvigilator) {
      showToast('请选择监考老师', 'error');
      return;
    }

    setExams(exams.map(e => {
      if (e.id === targetExamId) {
        return {
          ...e,
          sessionsCount: e.sessionsCount + 1,
          sessions: [
            ...e.sessions,
            {
              id: Date.now(),
              name: sessionName,
              type: sessionType,
              location: sessionLocation || '未分配考场',
              status: '未开始',
              invigilator: sessionInvigilator,
              startTime: sessionStartTime.replace('T', ' '),
              endTime: sessionEndTime.replace('T', ' '),
              visibility: '隐藏'
            }
          ]
        };
      }
      return e;
    }));
    
    setExpandedRow(targetExamId);
    setIsAddSessionDrawerOpen(false);
    showToast('场次添加成功！');
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

  const handleDeleteSession = (examId: number, sessionId: number) => {
    if (window.confirm('确定要删除该场次吗？此操作不可恢复。')) {
      setExams(exams.map(e => {
        if (e.id === examId) {
          return {
            ...e,
            sessionsCount: Math.max(0, e.sessionsCount - 1),
            sessions: e.sessions.filter(s => s.id !== sessionId)
          };
        }
        return e;
      }));
      showToast('场次已删除');
    }
  };

  const handleExamDetails = (exam: any) => {
    setDetailsSession(exam);
    setDetailsType('exam');
    setIsDetailsDrawerOpen(true);
  };

  const handleEditExam = (exam: any) => {
    setEditingExam(exam);
    setExamName(exam.name);
    setIsCreateDrawerOpen(true);
  };

  const handleConfirmDeleteExam = (exam: any) => {
    setConfirmModal({
      show: true,
      title: '删除考试确认',
      message: `确定要删除考试「${exam.name}」吗？删除后该考试下的所有场次、监考信息及学生答卷数据将永久丢失，此操作不可恢复。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.filter(e => e.id !== exam.id));
        showToast('考试已成功删除');
      }
    });
  };

  const handleConfirmToggleExamStatus = (exam: any) => {
    const isEnabling = exam.status !== '启用';
    setConfirmModal({
      show: true,
      title: isEnabling ? '启用考试确认' : '停用考试确认',
      message: isEnabling 
        ? `确定要启用考试「${exam.name}」吗？启用后，系统将正式开放本考试的选课与场次关联，学生可准备参考。`
        : `确定要停用考试「${exam.name}」吗？停用后，所有关联场次将立即挂起，尚未提交答卷的学生将无法继续答题。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.map(e => e.id === exam.id ? { ...e, status: isEnabling ? '启用' : '草稿' } : e));
        showToast(`考试已${isEnabling ? '启用' : '停用'}`);
      }
    });
  };

  const handleConfirmAddSession = (exam: any) => {
    setConfirmModal({
      show: true,
      title: '添加场次确认',
      message: `确定要在考试「${exam.name}」下追加一个新的考试场次吗？新建后您可以前往场次列表配置考场和监考教师。`,
      showCancel: true,
      onConfirm: () => {
        handleAddSession(exam.id);
      }
    });
  };

  const handleConfirmDeleteSession = (examId: number, session: any) => {
    setConfirmModal({
      show: true,
      title: '删除场次确认',
      message: `确定要删除场次「${session.name}」吗？此操作不可逆，已分配考生的准考信息也将一并清除。`,
      showCancel: true,
      onConfirm: () => {
        setExams(exams.map(e => {
          if (e.id === examId) {
            return {
              ...e,
              sessionsCount: Math.max(0, e.sessionsCount - 1),
              sessions: e.sessions.filter(s => s.id !== session.id)
            };
          }
          return e;
        }));
        showToast('场次已删除');
      }
    });
  };

  const handleConfirmCopySession = (examId: number, session: any) => {
    setConfirmModal({
      show: true,
      title: '复制场次确认',
      message: `确定要复制场次「${session.name}」吗？系统将自动创建该场次的一个克隆副本（副本名称包含 (副本) 后缀）。`,
      showCancel: true,
      onConfirm: () => {
        handleCopySession(examId, session);
      }
    });
  };

  const handleSessionStudents = (session: any) => {
    setDetailsSession(session);
    setDetailsType('students');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionInvigilators = (session: any) => {
    setDetailsSession(session);
    setDetailsType('invigilation');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionScoring = (session: any) => {
    setDetailsSession(session);
    setDetailsType('scoring');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionScores = (session: any) => {
    setDetailsSession(session);
    setDetailsType('scores');
    setIsDetailsDrawerOpen(true);
  };

  const handleSessionPublish = (session: any) => {
    setConfirmModal({
      show: true,
      title: '公布成绩确认',
      message: `确定要向所有参考考生公布场次「${session.name}」的最终成绩吗？公布后学生将能查看到各个小题的得分明细与教师批语。`,
      showCancel: true,
      onConfirm: () => {
        showToast('成绩已成功公布！');
      }
    });
  };

  const handleSessionRank = (session: any) => {
    setDetailsSession(session);
    setDetailsType('rank');
    setIsDetailsDrawerOpen(true);
  };

  return (
    <div className={cn("space-y-4", embedded ? "" : "p-6")}>
      
      {/* Unified Table Card Module (Styled exactly like assignments / projects) */}
      <div className="bg-white rounded border border-neutral-border text-left">
        {/* Toolbar */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-border/50">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索考试名称" 
              className="pl-9 pr-4 py-2 w-full sm:w-60 bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-9"
            />
          </div>
          <Button 
            onClick={() => setIsCreateDrawerOpen(true)}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 shadow-sm font-bold flex-shrink-0 cursor-pointer border-0 h-9 flex items-center gap-1.5 transition-colors text-[13px]"
          >
            <Plus className="w-4 h-4" /> 新建考试
          </Button>
        </div>

        {/* Main Table without vertical borders */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                <th className="p-4 font-medium w-12 text-center"></th>
                <th className="p-4 font-medium text-left w-[240px]">考试名称</th>
                <th className="p-4 font-medium text-left w-[120px]">考试状态</th>
                <th className="p-4 font-medium text-left w-24">考试场次</th>
                <th className="p-4 font-medium text-left w-24">报名人数</th>
                <th className="p-4 font-medium text-left w-28">创建人</th>
                <th className="p-4 font-medium text-left w-48">创建时间</th>
                <th className="p-4 font-medium text-left w-[180px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <React.Fragment key={exam.id}>
                  {/* Parent Row */}
                  <tr className={cn(
                    "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                    expandedRow === exam.id ? "bg-neutral-50/30" : ""
                  )}>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleRow(exam.id)}
                        className="text-neutral-400 hover:text-[#fa541c] transition-colors p-1 cursor-pointer bg-transparent border-0"
                      >
                        <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", expandedRow === exam.id && "transform rotate-90 text-[#fa541c]")} />
                      </button>
                    </td>
                    <td className="p-4 text-left">
                      <div className="text-neutral-800 font-medium max-w-[320px] truncate" title={exam.name}>
                        {exam.name}
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium",
                        exam.status === '启用' ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-4 text-left text-neutral-600">{exam.sessionsCount}</td>
                    <td className="p-4 text-left text-neutral-600">{exam.enrolled}</td>
                    <td className="p-4 text-left text-neutral-600">{exam.creator}</td>
                    <td className="p-4 text-left text-neutral-500 font-mono">{exam.createTime}</td>
                    <td className="p-4 text-left">
                      <div className="flex items-center gap-3">
                        {expandedRow === exam.id ? (
                          <>
                            <button 
                              onClick={() => {
                                setTargetExamId(exam.id);
                                setSessionName('');
                                setSessionType('正式场次');
                                setSessionStartTime('');
                                setSessionEndTime('');
                                setSessionLocation('');
                                setSessionInvigilator('');
                                setIsInvigilatorDropdownOpen(false);
                                setIsAddSessionDrawerOpen(true);
                              }} 
                              className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
                            >
                              添加场次
                            </button>
                            <button onClick={() => handleConfirmToggleExamStatus(exam)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">停用</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleExamDetails(exam)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">详情</button>
                            <button onClick={() => handleEditExam(exam)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">编辑</button>
                            
                            {/* Dropdown triggers */}
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(activeDropdownId === `exam-${exam.id}` ? null : `exam-${exam.id}`);
                                }}
                                className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px] flex items-center gap-0.5"
                              >
                                更多 <ChevronDown className="w-3 h-3" />
                              </button>
                              {activeDropdownId === `exam-${exam.id}` && (
                                <div className="absolute left-0 sm:left-auto sm:right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg py-1 z-30 min-w-[100px] text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                  <button 
                                    onClick={() => handleConfirmToggleExamStatus(exam)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                  >
                                    {exam.status === '启用' ? '停用' : '启用'}
                                  </button>
                                  <button 
                                    onClick={() => handleConfirmDeleteExam(exam)}
                                    className="w-full text-left px-3 py-1.5 hover:bg-orange-50/50 hover:text-[#e84a15] text-[12px] text-[#fa541c] bg-transparent border-0 cursor-pointer block font-medium transition-colors"
                                  >
                                    删除
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Nested Sessions Table */}
                  {expandedRow === exam.id && (
                    <tr>
                      <td colSpan={8} className="p-0 bg-neutral-50/20">
                        <div className="p-6 pr-8 pl-16 w-full animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-50/30 border-b border-neutral-100">
                          <table className="w-full text-left border-collapse bg-white rounded border border-neutral-border/50">
                            <thead>
                              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[12px] text-neutral-500 font-medium">
                                <th className="p-3 text-left w-[200px]">场次名称</th>
                                <th className="p-3 text-left w-24">场次类型</th>
                                <th className="p-3 text-left w-28">考场</th>
                                <th className="p-3 text-left w-20">状态</th>
                                <th className="p-3 text-left w-24">监考老师</th>
                                <th className="p-3 text-left w-40">开始时间</th>
                                <th className="p-3 text-left w-40">结束时间</th>
                                <th className="p-3 text-left w-20">可见状态</th>
                                <th className="p-3 text-left w-[200px]">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exam.sessions.length > 0 ? exam.sessions.map(session => (
                                <tr key={session.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/30 text-[12px]">
                                  <td className="p-3 text-left text-neutral-700 font-medium">{session.name}</td>
                                  <td className="p-3 text-left">
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[11px] border border-indigo-200 font-medium">
                                      {session.type}
                                    </span>
                                  </td>
                                  <td className="p-3 text-left text-neutral-600">{session.location}</td>
                                  <td className="p-3 text-left">
                                    <span className={cn(
                                      "px-2 py-0.5 text-[11px] rounded border font-medium",
                                      session.status === '已结束' ? "bg-neutral-50 text-neutral-500 border-neutral-200" : "bg-orange-50 text-orange-600 border-orange-200"
                                    )}>
                                      {session.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-left text-neutral-600">{session.invigilator}</td>
                                  <td className="p-3 text-left text-neutral-500 font-mono">{session.startTime}</td>
                                  <td className="p-3 text-left text-neutral-500 font-mono">{session.endTime}</td>
                                  <td className="p-3 text-left text-neutral-600">{session.visibility}</td>
                                  <td className="p-3 text-left">
                                    <div className="flex items-center gap-3">
                                      <button onClick={() => handleSessionStudents(session)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">考生名单</button>
                                      <button onClick={() => handleSessionScores(session)} className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px]">查看成绩</button>
                                      
                                      {/* Dropdown overlay */}
                                      <div className="relative">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdownId(activeDropdownId === `session-${session.id}` ? null : `session-${session.id}`);
                                          }}
                                          className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[12px] flex items-center gap-0.5"
                                        >
                                          更多 <ChevronDown className="w-3 h-3" />
                                        </button>
                                        {activeDropdownId === `session-${session.id}` && (
                                          <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 min-w-[120px] text-left animate-in fade-in slide-in-from-bottom-1 duration-150">
                                            <button 
                                              onClick={() => handleSessionScoring(session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              批阅任务
                                            </button>
                                            <button 
                                              onClick={() => handleSessionPublish(session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              公布成绩
                                            </button>
                                            <button 
                                              onClick={() => handleSessionInvigilators(session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              监考信息
                                            </button>
                                            <button 
                                              onClick={() => handleSessionRank(session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              排行榜
                                            </button>
                                            <button 
                                              onClick={() => handleConfirmCopySession(exam.id, session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              复制场次
                                            </button>
                                            <button 
                                              onClick={() => handleToggleSessionVisibility(exam.id, session.id, session.visibility)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-[12px] text-neutral-750 bg-transparent border-0 cursor-pointer block transition-colors"
                                            >
                                              {session.visibility === '显示' ? '隐藏场次' : '显示场次'}
                                            </button>
                                            <div className="h-[1px] bg-neutral-100 my-0.5"></div>
                                            <button 
                                              onClick={() => handleConfirmDeleteSession(exam.id, session)}
                                              className="w-full text-left px-3 py-1.5 hover:bg-orange-50/50 hover:text-[#e84a15] text-[12px] text-[#fa541c] bg-transparent border-0 cursor-pointer block font-medium transition-colors"
                                            >
                                              删除场次
                                            </button>
                                          </div>
                                        )}
                                      </div>
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
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 bg-white">
          <span className="text-[13px] text-neutral-500">共 {exams.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 font-medium bg-white">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
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
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>考试名称
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试规则 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>考试规则
                </label>
                <div ref={examRuleDropdownRef} className="relative w-full text-[13px]">
                  <div 
                    onClick={() => setIsExamRuleDropdownOpen(!isExamRuleDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none border-neutral-200",
                      isExamRuleDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(examRule ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {examRule || '请选择考试规则'}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isExamRuleDropdownOpen && "rotate-180")} />
                  </div>
                  {/* Dropdown Menu */}
                  {isExamRuleDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setExamRule("");
                            setIsExamRuleDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !examRule 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择考试规则</span>
                          {!examRule && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {['仅能提交1次', '限时提交', '不允许二次提交', '无限次提交'].map((rule) => {
                          const isSelected = examRule === rule;
                          return (
                            <div
                              key={rule}
                              onClick={() => {
                                setExamRule(rule);
                                setIsExamRuleDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected ? "bg-orange-50 text-[#fa541c] font-bold" : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{rule}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 报名人数 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  报名人数
                </label>
                <input 
                  type="number"
                  min={0}
                  value={enrollCount || ''}
                  onChange={(e) => setEnrollCount(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 主办方 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  主办方
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 协办方 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  协办方
                </label>
                <input
                  type="text"
                  value={coOrganizer}
                  onChange={(e) => setCoOrganizer(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试介绍 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  考试介绍
                </label>
                <input
                  type="text"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="请输入"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626]"
                />
              </div>

              {/* 考试须知 */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                  <span className="text-[#fa541c]">*</span>考试须知
                </label>
                <div className="border border-neutral-200 rounded overflow-hidden focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c]/25 transition-all flex flex-col bg-white">
                  {/* Rich Text Editor Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-neutral-100 bg-neutral-50/50 select-none">
                    <button type="button" title="加粗" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" title="斜体" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" title="文字颜色" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-0.5"><Type className="w-3.5 h-3.5" /><span className="text-[9px] border-b border-neutral-600 leading-none">A</span></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="标题" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-650 font-mono text-[11px] font-bold leading-none cursor-pointer border-0 bg-transparent flex items-center justify-center">H1</button>
                    <button type="button" title="无序列表" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-650 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><List className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="左对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignLeft className="w-3.5 h-3.5" /></button>
                    <button type="button" title="居中对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignCenter className="w-3.5 h-3.5" /></button>
                    <button type="button" title="右对齐" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><AlignRight className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="撤销" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Undo2 className="w-3.5 h-3.5" /></button>
                    <button type="button" title="重做" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Redo2 className="w-3.5 h-3.5" /></button>
                    <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>
                    <button type="button" title="插入链接" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"><Link2 className="w-3.5 h-3.5" /></button>
                    <button type="button" title="全屏" className="p-1 hover:bg-neutral-200/60 rounded text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent ml-auto flex items-center justify-center"><Maximize2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {/* Textarea */}
                  <textarea
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                    placeholder="请输入"
                    className="w-full h-24 border-0 rounded-b p-3 text-[13px] focus:outline-none transition-all text-[#262626] bg-white resize-none"
                  />
                </div>
              </div>

              {/* 试卷配置 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>试卷配置
                </label>
                <div className="flex items-center gap-3">
                  {paperConfig ? (
                    <span 
                      className="text-[#fa541c] hover:text-[#e84a15] font-semibold cursor-pointer hover:underline text-[13px]"
                      onClick={() => {
                        setTempSelectedPaper(paperConfig);
                        setShowSelectPaperModal(true);
                      }}
                    >
                      {paperConfig}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTempSelectedPaper(paperConfig);
                        setShowSelectPaperModal(true);
                      }}
                      className="text-[#fa541c] hover:text-[#e84a15] font-semibold bg-transparent border-0 cursor-pointer p-0 text-[13px] transition-colors"
                    >
                      请选择
                    </button>
                  )}
                </div>
              </div>



            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsCreateDrawerOpen(false)}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleCreate}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                保存并配置场次
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Add Session Drawer */}
      {isAddSessionDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-[13px]"
          onClick={() => setIsAddSessionDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
              <h2 className="text-[15px] font-bold text-neutral-850">新增场次配置</h2>
              <button 
                onClick={() => setIsAddSessionDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              {/* 场次名称 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次名称
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setSessionName(e.target.value);
                      }
                    }}
                    placeholder="请输入场次名称"
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 pr-16 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626] bg-white font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                    {sessionName.length} / 100
                  </span>
                </div>
              </div>

              {/* 场次类型 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次类型
                </label>
                <div className="flex items-center gap-6">
                  <div 
                    onClick={() => setSessionType('正式场次')}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {sessionType === '正式场次' ? (
                      <div className="w-[18px] h-[18px] rounded-full border border-[#fa541c] flex items-center justify-center shrink-0">
                        <div className="w-[9px] h-[9px] rounded-full bg-[#fa541c]" />
                      </div>
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span className={cn("text-[13px] transition-colors font-medium", sessionType === '正式场次' ? "text-[#fa541c]" : "text-neutral-600")}>正式场次</span>
                  </div>
                  <div 
                    onClick={() => setSessionType('测试场次')}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    {sessionType === '测试场次' ? (
                      <div className="w-[18px] h-[18px] rounded-full border border-[#fa541c] flex items-center justify-center shrink-0">
                        <div className="w-[9px] h-[9px] rounded-full bg-[#fa541c]" />
                      </div>
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 shrink-0" />
                    )}
                    <span className={cn("text-[13px] transition-colors font-medium", sessionType === '测试场次' ? "text-[#fa541c]" : "text-neutral-600")}>测试场次</span>
                  </div>
                </div>
              </div>

              {/* 场次时间 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>场次时间
                </label>
                <div className="flex items-center gap-2 text-[13px] w-full text-neutral-800">
                  <div className="flex-1">
                    <DateTimePicker 
                      value={sessionStartTime}
                      onChange={(val) => setSessionStartTime(val)}
                      placeholder="请选择开始时间"
                      className="text-[13px] w-full"
                      showPresets={false}
                      align="left"
                    />
                  </div>
                  <span className="text-neutral-400 font-medium">—</span>
                  <div className="flex-1">
                    <DateTimePicker 
                      value={sessionEndTime}
                      onChange={(val) => setSessionEndTime(val)}
                      placeholder="请选择结束时间"
                      className="text-[13px] w-full"
                      showPresets={false}
                    />
                  </div>
                </div>
              </div>

              {/* 考场 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  考场
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={sessionLocation}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setSessionLocation(e.target.value);
                      }
                    }}
                    placeholder="请输入考场"
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 pr-16 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-[#262626] bg-white font-medium"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                    {sessionLocation.length} / 100
                  </span>
                </div>
              </div>

              {/* 监考老师 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  <span className="text-[#fa541c]">*</span>监考老师
                </label>
                <div className="relative w-full text-[13px]">
                  <div 
                    onClick={() => setIsInvigilatorDropdownOpen(!isInvigilatorDropdownOpen)}
                    className={cn(
                      "h-[36px] w-full border rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none border-neutral-200",
                      isInvigilatorDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]/25 shadow-[0_0_0_2px_rgba(250,84,28,0.1)]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className={cn(sessionInvigilator ? "text-neutral-700 font-medium" : "text-neutral-400")}>
                      {sessionInvigilator || '请选择监考老师'}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isInvigilatorDropdownOpen && "rotate-180")} />
                  </div>
                  {isInvigilatorDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div
                          onClick={() => {
                            setSessionInvigilator("");
                            setIsInvigilatorDropdownOpen(false);
                          }}
                          className={cn(
                            "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                            !sessionInvigilator 
                              ? "bg-orange-50 text-[#fa541c] font-bold"
                              : "text-neutral-400 hover:bg-orange-50/40 hover:text-neutral-600"
                          )}
                        >
                          <span>请选择监考老师</span>
                          {!sessionInvigilator && (
                            <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                          )}
                        </div>
                        {['张维老师', '李杰老师', '王莹老师', '陈晨老师'].map((teacher) => {
                          const isSelected = sessionInvigilator === teacher;
                          return (
                            <div
                              key={teacher}
                              onClick={() => {
                                setSessionInvigilator(teacher);
                                setIsInvigilatorDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected ? "bg-orange-50 text-[#fa541c] font-bold" : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{teacher}</span>
                              {isSelected && (
                                <Check className="w-3 h-3 text-[#fa541c]" strokeWidth={2.5} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsAddSessionDrawerOpen(false)}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveSession}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                保存场次
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[420px] overflow-hidden border border-neutral-100 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-5">
              <h3 className="text-[15px] font-bold text-[#262626] mb-2">{confirmModal.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed whitespace-pre-wrap">{confirmModal.message}</p>
            </div>
            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-2.5">
              {confirmModal.showCancel && (
                <Button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} 
                  variant="outline"
                  className="border-neutral-200 text-neutral-650 font-semibold h-8 px-4 rounded-[4px] text-xs bg-white hover:bg-neutral-50"
                >
                  取消
                </Button>
              )}
              <Button 
                onClick={() => {
                  setConfirmModal(prev => ({ ...prev, show: false }));
                  confirmModal.onConfirm();
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-5 rounded-[4px] text-xs border-0 cursor-pointer animate-none"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择试卷 Modal */}
      {showSelectPaperModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left text-[13px]"
          onClick={() => {
            setPaperConfig(tempSelectedPaper);
            setShowSelectPaperModal(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-[900px] max-h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#fa541c]" /> 选择试卷
              </h2>
              <button 
                onClick={() => {
                  setPaperConfig(tempSelectedPaper);
                  setShowSelectPaperModal(false);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
              <div className="mb-4 flex justify-end">
                <Button 
                  onClick={() => {
                    navigate('/teacher/papers', { state: { openCreate: true } });
                  }}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold text-[12px] px-3.5 h-8 transition-colors shrink-0 border-0 cursor-pointer"
                >
                  新建试卷
                </Button>
              </div>
              <div className="bg-white rounded overflow-hidden border border-neutral-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                      <th className="p-4 font-medium w-[50px] text-center"></th>
                      <th className="p-4 font-medium text-left">试卷名称</th>
                      <th className="p-4 font-medium text-center w-[100px]">题目数量</th>
                      <th className="p-4 font-medium text-center w-[120px]">抽题方式</th>
                      <th className="p-4 font-medium text-left">包含题型</th>
                      <th className="p-4 font-medium text-center w-[100px]">试卷分数</th>
                      <th className="p-4 font-medium text-center w-[120px]">创建人</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(MOCK_PAPERS_PAGED[paperModalPage] || []).map((paper, i) => (
                      <tr 
                        key={i} 
                        className={cn(
                          "border-b border-neutral-100 hover:bg-neutral-50/30 cursor-pointer transition-colors text-[13px] text-neutral-700",
                          paperConfig === paper.name ? "bg-orange-50/10" : ""
                        )}
                        onClick={() => setPaperConfig(paper.name)}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="radio" 
                            name="paperSelect" 
                            checked={paperConfig === paper.name} 
                            onChange={() => setPaperConfig(paper.name)}
                            className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer accent-[#fa541c] mx-auto" 
                          />
                        </td>
                        <td className="p-4 text-left font-medium text-neutral-900">{paper.name}</td>
                        <td className="p-4 text-center">{paper.count}</td>
                        <td className="p-4 text-center">{paper.method}</td>
                        <td className="p-4 text-left text-neutral-600 max-w-[280px] truncate" title={paper.types}>{paper.types}</td>
                        <td className="p-4 text-center font-semibold text-neutral-850">{paper.score}</td>
                        <td className="p-4 text-center text-neutral-500">{paper.creator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Component */}
              <div className="flex items-center justify-end py-4 bg-transparent gap-4 mt-2 select-none">
                <span className="text-[13px] text-neutral-500 font-medium">共 20 条</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-[4px] bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700" 
                    disabled={paperModalPage === 1}
                    onClick={() => setPaperModalPage(p => Math.max(1, p - 1))}
                  >
                    &lt;
                  </Button>
                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <Button 
                      key={pageNum}
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "h-7 w-7 p-0 rounded-[4px] font-bold text-[12px]",
                        paperModalPage === pageNum 
                          ? "bg-[#fa541c] text-white border-[#fa541c]" 
                          : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                      )}
                      onClick={() => setPaperModalPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-[4px] bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700" 
                    disabled={paperModalPage === 5}
                    onClick={() => setPaperModalPage(p => Math.min(5, p + 1))}
                  >
                    &gt;
                  </Button>
                </div>
                <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] text-neutral-600">
                  <option>10 条/页</option>
                  <option>20 条/页</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setPaperConfig(tempSelectedPaper);
                  setShowSelectPaperModal(false);
                }} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  setShowSelectPaperModal(false);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs border-0 cursor-pointer shadow-sm"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer (For Students list, Scores, Scoring, Invigilation, Rank) */}
      {isDetailsDrawerOpen && detailsSession && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]"
          onClick={() => setIsDetailsDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[600px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 z-10">
              <h2 className="text-[15px] font-bold text-neutral-850 flex items-center gap-2">
                {detailsType === 'students' && <Users className="w-5 h-5 text-[#fa541c]" />}
                {detailsType === 'scores' && <Award className="w-5 h-5 text-[#fa541c]" />}
                {detailsType === 'scoring' && <PenTool className="w-5 h-5 text-[#fa541c]" />}
                {detailsType === 'invigilation' && <ShieldCheck className="w-5 h-5 text-[#fa541c]" />}
                {detailsType === 'rank' && <Trophy className="w-5 h-5 text-[#fa541c]" />}
                {detailsType === 'exam' && <FileText className="w-5 h-5 text-[#fa541c]" />}
                
                {detailsType === 'students' && '考生名单详情'}
                {detailsType === 'scores' && '查看成绩明细'}
                {detailsType === 'scoring' && '批阅任务控制台'}
                {detailsType === 'invigilation' && '监考安排详情'}
                {detailsType === 'rank' && '场次成绩排行榜'}
                {detailsType === 'exam' && '考试详情面板'}
              </h2>
              <button 
                onClick={() => setIsDetailsDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white relative">
              {detailsType === 'exam' ? (
                <div className="bg-orange-50/20 rounded-xl p-4 border border-orange-100/60 space-y-2">
                  <div className="text-[14px] font-bold text-neutral-800">考试名称：{detailsSession.name}</div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-neutral-600">
                    <div>考试状态：<span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold",
                      detailsSession.status === '启用' ? "bg-green-50 text-green-600 border border-green-200" : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                    )}>{detailsSession.status}</span></div>
                    <div>参考人数：<span className="text-neutral-900 font-semibold">{detailsSession.enrolled} 人</span></div>
                    <div>关联场次：<span className="text-neutral-900 font-semibold">{detailsSession.sessionsCount} 个场次</span></div>
                    <div>创建人员：<span className="text-neutral-800">{detailsSession.creator}</span></div>
                    <div className="col-span-2">创建时间：<span className="text-neutral-800">{detailsSession.createTime}</span></div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50/20 rounded-xl p-4 border border-orange-100/60 space-y-2">
                  <div className="text-[14px] font-bold text-neutral-800">场次名称：{detailsSession.name}</div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-neutral-600">
                    <div>考试考场：<span className="text-neutral-900 font-semibold">{detailsSession.location}</span></div>
                    <div>主监考官：<span className="text-neutral-900 font-semibold">{detailsSession.invigilator}</span></div>
                    <div>考试状态：<span className="text-orange-600 font-semibold">{detailsSession.status}</span></div>
                    <div>参考时间：<span className="text-neutral-800">{detailsSession.startTime.slice(5)}</span></div>
                  </div>
                </div>
              )}

              {/* Conditional Content based on detailsType */}
              {detailsType === 'exam' && (
                <div className="space-y-4 text-xs">
                  {/* Detailed configuration section */}
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200 font-bold text-neutral-800 text-sm">
                      考试基础配置信息
                    </div>
                    <div className="p-4 space-y-3.5 text-neutral-700 text-left">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">考试规则：</span>
                        <span className="text-neutral-800 font-semibold">仅能提交1次</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">关联试卷：</span>
                        <span className="text-[#fa541c] font-semibold">机器学习期末考试A卷</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">主办单位：</span>
                        <span className="text-neutral-800 font-semibold">教育部虚拟教研室</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">协办单位：</span>
                        <span className="text-neutral-800 font-semibold">深度学习工坊</span>
                      </div>
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-neutral-500">考试介绍：</span>
                        <span className="text-neutral-800 leading-relaxed bg-neutral-50 p-2.5 rounded border border-neutral-100">
                          针对机器学习及深度学习专业能力的综合性考核，涵盖了多元线性回归、卷积神经网络（CNN）、循环神经网络（RNN）等主流架构的原理题与动手编程实践题。
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-cheat and notice */}
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200 font-bold text-neutral-800 text-sm">
                      考试须知与注意事项
                    </div>
                    <div className="p-4 text-left">
                      <div className="bg-orange-50/30 border border-orange-100 p-3.5 rounded text-neutral-800 leading-relaxed">
                        1. 请各位参考考生提前准备好考试环境，确保摄像头与音频输入输出设备运行良好。<br/>
                        2. 考中将自动启用摄像头轨迹检测与切屏警示拦截。<br/>
                        3. 超过 3 次切屏或检测到中途更换人员，系统将自动执行强制交卷，成绩按零分处理。
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailsType === 'students' && (
                <div className="space-y-4 text-[13px]">
                  {/* Top Bar with Search and Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white pb-1 select-none">
                    {/* Search Input */}
                    <div className="w-full sm:w-auto">
                      <input 
                        type="text" 
                        placeholder="账号/姓名" 
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="w-full sm:w-56 border border-neutral-200 rounded-[4px] px-3 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 transition-all text-neutral-800 bg-white h-8"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => {
                          showToast('已刷新数据', 'success');
                        }}
                        variant="outline"
                        className="border-neutral-200 text-neutral-600 rounded-[4px] h-8 px-4 text-xs bg-white hover:bg-neutral-50 cursor-pointer font-medium"
                      >
                        刷新
                      </Button>
                      <Button
                        onClick={() => {
                          showToast('批量导出成功，文件已开始下载', 'success');
                        }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-8 px-4 text-xs border-0 cursor-pointer font-bold shadow-sm"
                      >
                        批量导出
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedStudentIds.length === 0) {
                            showToast('请先勾选需要移除的考生', 'error');
                            return;
                          }
                          setCandidateList(candidateList.filter(stu => !selectedStudentIds.includes(stu.id)));
                          setSelectedStudentIds([]);
                          showToast('批量移除成功！', 'success');
                        }}
                        className={cn(
                          "rounded-[4px] h-8 px-4 text-xs border-0 cursor-pointer font-bold transition-all text-white",
                          selectedStudentIds.length > 0 
                            ? "bg-[#fa541c] hover:bg-[#e84a15] shadow-sm" 
                            : "bg-[#ffbb96] opacity-90 cursor-not-allowed"
                        )}
                      >
                        批量移除
                      </Button>
                      <Button
                        onClick={() => {
                          const newName = prompt('请输入快速添加的考生账号/姓名：');
                          if (newName && newName.trim()) {
                            const account = newName.trim();
                            const newId = Date.now();
                            setCandidateList([
                              ...candidateList,
                              { id: newId, account, name: account, phone: '1875183' + Math.floor(1000 + Math.random() * 9000), group: '测试用户' }
                            ]);
                            showToast(`已成功快速添加考生: ${account}`, 'success');
                          }
                        }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-8 px-4 text-xs border-0 cursor-pointer font-bold shadow-sm"
                      >
                        快速添加
                      </Button>
                      <Button
                        onClick={() => {
                          const account = prompt('请输入考生账号：');
                          if (!account || !account.trim()) return;
                          const name = prompt('请输入考生姓名：');
                          if (!name || !name.trim()) return;
                          const phone = prompt('请输入考生手机号：') || '18751836671';
                          const group = prompt('请输入用户组：') || '测试用户';
                          const newId = Date.now();
                          setCandidateList([
                            ...candidateList,
                            { id: newId, account: account.trim(), name: name.trim(), phone: phone.trim(), group: group.trim() }
                          ]);
                          showToast(`已添加考生: ${name}`, 'success');
                        }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-8 px-4 text-xs border-0 cursor-pointer font-bold shadow-sm"
                      >
                        添加
                      </Button>
                    </div>
                  </div>

                  {/* Table Heading */}
                  <div className="text-left font-bold text-[#262626] text-sm pt-2">
                    当前场次考生信息
                  </div>

                  {/* Candidates Table */}
                  <div className="border border-neutral-100 rounded-[4px] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500 font-medium h-10 select-none">
                          <th className="p-3 w-10 text-center">
                            <input 
                              type="checkbox"
                              checked={candidateList.length > 0 && candidateList.every(stu => selectedStudentIds.includes(stu.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIds(candidateList.map(stu => stu.id));
                                } else {
                                  setSelectedStudentIds([]);
                                }
                              }}
                              className="w-3.5 h-3.5 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] accent-[#fa541c] cursor-pointer"
                            />
                          </th>
                          <th className="p-3">账号</th>
                          <th className="p-3">姓名</th>
                          <th className="p-3">手机号</th>
                          <th className="p-3">用户组</th>
                          <th className="p-3 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50 text-neutral-700 bg-white">
                        {candidateList.filter(stu => 
                          stu.account.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          stu.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        ).map((stu) => {
                          const isChecked = selectedStudentIds.includes(stu.id);
                          return (
                            <tr key={stu.id} className="hover:bg-neutral-50/20 h-11">
                              <td className="p-3 text-center">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStudentIds([...selectedStudentIds, stu.id]);
                                    } else {
                                      setSelectedStudentIds(selectedStudentIds.filter(id => id !== stu.id));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] accent-[#fa541c] cursor-pointer"
                                />
                              </td>
                              <td className="p-3 text-neutral-800 font-medium font-mono">{stu.account}</td>
                              <td className="p-3 text-neutral-800">{stu.name}</td>
                              <td className="p-3 text-neutral-500 font-mono">{stu.phone}</td>
                              <td className="p-3 text-neutral-600">{stu.group}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    setCandidateList(candidateList.filter(s => s.id !== stu.id));
                                    setSelectedStudentIds(selectedStudentIds.filter(id => id !== stu.id));
                                    showToast(`已成功移除考生: ${stu.name}`, 'success');
                                  }}
                                  className="text-red-500 hover:text-red-600 font-semibold cursor-pointer border-0 bg-transparent p-0 text-xs transition-colors"
                                >
                                  移除
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {candidateList.filter(stu => 
                          stu.account.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          stu.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-neutral-400">
                              暂无考生数据
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailsType === 'scores' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-neutral-50/50 p-3 rounded-lg border border-neutral-100 text-center">
                      <div className="text-neutral-500 text-[10px]">参考人数</div>
                      <div className="text-lg font-bold text-neutral-800 mt-0.5">21人</div>
                    </div>
                    <div className="bg-neutral-50/50 p-3 rounded-lg border border-neutral-100 text-center">
                      <div className="text-neutral-500 text-[10px]">平均分</div>
                      <div className="text-lg font-bold text-[#fa541c] mt-0.5">82.4</div>
                    </div>
                    <div className="bg-neutral-50/50 p-3 rounded-lg border border-neutral-100 text-center">
                      <div className="text-neutral-500 text-[10px]">及格率</div>
                      <div className="text-lg font-bold text-green-600 mt-0.5">95%</div>
                    </div>
                    <div className="bg-neutral-50/50 p-3 rounded-lg border border-neutral-100 text-center">
                      <div className="text-neutral-500 text-[10px]">最高分</div>
                      <div className="text-lg font-bold text-indigo-600 mt-0.5">98分</div>
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                          <th className="p-3">姓名</th>
                          <th className="p-3">考卷得分</th>
                          <th className="p-3">客观题/主观题</th>
                          <th className="p-3 text-center">结论</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                        {[
                          { name: '李四', score: 98, sub: '50 / 48', pass: '优秀' },
                          { name: '张三', score: 95, sub: '50 / 45', pass: '优秀' },
                          { name: '王五', score: 92, sub: '48 / 44', pass: '优秀' },
                          { name: '赵六', score: 89, sub: '45 / 44', pass: '良好' },
                          { name: '周七', score: 88, sub: '46 / 42', pass: '良好' },
                          { name: '钱八', score: 75, sub: '40 / 35', pass: '合格' },
                          { name: '孙九', score: 60, sub: '35 / 25', pass: '合格' },
                        ].map((stu, i) => (
                          <tr key={i} className="hover:bg-neutral-50/50">
                            <td className="p-3 font-semibold text-neutral-900">{stu.name}</td>
                            <td className="p-3 font-bold text-[#fa541c]">{stu.score} 分</td>
                            <td className="p-3 text-neutral-500 font-mono">{stu.sub}</td>
                            <td className="p-3 text-center">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                                stu.pass === '优秀' && "bg-orange-50 text-[#fa541c]",
                                stu.pass === '良好' && "bg-blue-50 text-blue-600",
                                stu.pass === '合格' && "bg-green-50 text-green-600"
                              )}>
                                {stu.pass}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailsType === 'scoring' && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-lg flex items-center gap-3">
                    <PenTool className="w-5 h-5 text-purple-600" />
                    <div className="text-xs text-purple-950">
                      <strong>AI辅助评分提示：</strong> 客观选择题与判断题已由AI评判打分完毕。现有 21 份主观编程设计题需要教师人工或AI辅助评阅。
                    </div>
                  </div>
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                          <th className="p-3">题目描述</th>
                          <th className="p-3">待阅卷份数</th>
                          <th className="p-3 text-center">批阅操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                        {[
                          { name: '机器学习实践题-线性回归模型实现', count: 21, status: '待批阅' },
                          { name: '问答题-说明Transformer自注意力机制的计算步骤', count: 21, status: '待批阅' },
                          { name: '综合编程题-PyTorch多层感知机模型设计', count: 0, status: '已完成' },
                        ].map((task, i) => (
                          <tr key={i} className="hover:bg-neutral-50/50">
                            <td className="p-3 text-neutral-800 font-medium truncate max-w-[280px]" title={task.name}>{task.name}</td>
                            <td className="p-3 text-neutral-500 font-mono">{task.count} / 21</td>
                            <td className="p-3 text-center">
                              {task.count > 0 ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    showToast('正在为您拉起阅卷控制台...', 'success');
                                  }}
                                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-[11px] font-bold rounded h-7 border-0 cursor-pointer px-3.5 animate-none"
                                >
                                  开始批阅
                                </Button>
                              ) : (
                                <span className="text-green-600 font-semibold text-xs">批阅完成</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailsType === 'invigilation' && (
                <div className="space-y-4">
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200 flex justify-between items-center">
                      <span className="font-bold text-neutral-800 text-sm">主考官监考安排</span>
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">● 监考设备就绪</span>
                    </div>
                    <div className="p-4 space-y-3.5">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">主监考教师：</span>
                        <span className="text-neutral-800 font-bold">{detailsSession.invigilator}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">巡考教师：</span>
                        <span className="text-neutral-800 font-bold">王老师 (教务处)</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-500">安排地点：</span>
                        <span className="text-neutral-800 font-bold">{detailsSession.location}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-neutral-500">考前广播准备：</span>
                        <span className="text-neutral-800 font-bold">已录入并配置完成</span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-cheat configuration lists */}
                  <div className="border border-neutral-200 rounded overflow-hidden">
                    <div className="bg-neutral-50/50 p-4 border-b border-neutral-200">
                      <span className="font-bold text-neutral-800 text-sm">防作弊策略配置 (Anti-Cheat Policies)</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { title: '摄像头抓拍抓取检测', desc: '考中随机截取答题环境，识别人脸特征及替考行为。', enabled: true },
                        { title: '锁屏与切屏限制策略', desc: '超过 3 次切换窗口即判定作弊并自动强制交卷。', enabled: true },
                        { title: '考试IP绑定校验', desc: '禁止非特定IP登录，防止外网代刷、代考。', enabled: true },
                        { title: 'AI异常轨迹预警', desc: '异常复制粘贴、快速答题以及鼠标划出页面进行警告。', enabled: true },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center gap-4 border-b border-neutral-100/60 pb-3 last:border-0 last:pb-0">
                          <div>
                            <div className="text-xs font-bold text-neutral-800">{item.title}</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-semibold flex-shrink-0">
                            已启用
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailsType === 'rank' && (
                <div className="space-y-5 text-center">
                  <div className="text-sm font-bold text-neutral-800 text-left">学霸荣誉榜 (前 5 名)</div>
                  
                  {/* Top 3 Podium layout */}
                  <div className="flex justify-center items-end gap-3 pt-6 pb-2 border-b border-neutral-100">
                    {/* 2nd place */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">🥈</div>
                      <div className="text-xs font-bold text-neutral-800 mt-2">张三</div>
                      <div className="text-[#fa541c] font-bold text-xs mt-0.5">95分</div>
                      <div className="h-20 w-16 bg-gradient-to-t from-slate-100 to-slate-200 rounded-t-lg mt-3 flex items-center justify-center text-xs font-bold text-slate-600">2</div>
                    </div>

                    {/* 1st place */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center font-bold text-amber-500 border border-amber-200 shadow-md scale-110">🥇</div>
                      <div className="text-xs font-bold text-neutral-900 mt-2 scale-110">李四</div>
                      <div className="text-[#fa541c] font-bold text-xs mt-0.5 scale-110">98分</div>
                      <div className="h-28 w-18 bg-gradient-to-t from-amber-100 to-amber-200/80 rounded-t-lg mt-3 flex items-center justify-center text-sm font-bold text-amber-700 shadow-sm">1</div>
                    </div>

                    {/* 3rd place */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center font-bold text-orange-600 border border-orange-200">🥉</div>
                      <div className="text-xs font-bold text-neutral-800 mt-2">王五</div>
                      <div className="text-[#fa541c] font-bold text-xs mt-0.5">92分</div>
                      <div className="h-16 w-16 bg-gradient-to-t from-orange-100/50 to-orange-200/50 rounded-t-lg mt-3 flex items-center justify-center text-xs font-bold text-orange-700">3</div>
                    </div>
                  </div>

                  {/* Rest list */}
                  <div className="border border-neutral-200 rounded overflow-hidden text-left">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-semibold">
                          <th className="p-3 w-16 text-center">排名</th>
                          <th className="p-3">考生姓名</th>
                          <th className="p-3">所属班级</th>
                          <th className="p-3 text-right">最终得分</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                        {[
                          { rank: 4, name: '赵六', class: '软件工程一班', score: 89 },
                          { rank: 5, name: '周七', class: '软件工程一班', score: 88 },
                        ].map((stu, i) => (
                          <tr key={i} className="hover:bg-neutral-50/50">
                            <td className="p-3 text-center text-neutral-500 font-bold">{stu.rank}</td>
                            <td className="p-3 font-semibold text-neutral-900">{stu.name}</td>
                            <td className="p-3 text-neutral-600">{stu.class}</td>
                            <td className="p-3 text-right font-bold text-[#fa541c]">{stu.score} 分</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 z-10">
              <Button 
                onClick={() => setIsDetailsDrawerOpen(false)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded shadow-sm border-0 cursor-pointer"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
