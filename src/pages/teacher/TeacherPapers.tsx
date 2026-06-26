import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  FileQuestion, 
  X, 
  ChevronLeft, 
  Calendar, 
  User, 
  Settings, 
  ClipboardList,
  Check,
  ArrowLeft,
  Layers,
  Info,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DrawRule {
  id: string;
  type: string;
  tag: string;
  difficulty: string;
  count: number | '';
  maxAvailable: number;
  score: number | '';
}

export default function TeacherPapers() {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<number | null>(1);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);
  const [view, setView] = useState<'list' | 'preview'>('list');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingPaper, setViewingPaper] = useState<any | null>(null);

  // Config Modal states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedConfigQuestions, setSelectedConfigQuestions] = useState<number[]>([]);
  const [confirmedQuestions, setConfirmedQuestions] = useState<any[]>([]);
  const [isObjConfigured, setIsObjConfigured] = useState(false);

  // New Paper form states
  const [paperName, setPaperName] = useState('');
  const [paperDescription, setPaperDescription] = useState('');
  const [paperType, setPaperType] = useState('作业');
  const [paperScope, setPaperScope] = useState('私有');
  const [paperStatus, setPaperStatus] = useState('启用');
  const [paperSelectionMethod, setPaperSelectionMethod] = useState('随机抽题');

  // Random Selection rules states
  const [selectedQuestionBanks, setSelectedQuestionBanks] = useState<string[]>([]);
  const [typeOrder, setTypeOrder] = useState<string[]>([]);
  const [selectedAddType, setSelectedAddType] = useState('单选题');
  const [isAddTypeDropdownOpen, setIsAddTypeDropdownOpen] = useState(false);
  const addTypeDropdownRef = React.useRef<HTMLDivElement>(null);

  // Custom modal states & refs for Delete Type & Add Rule
  const [deleteTypeTarget, setDeleteTypeTarget] = useState<string | null>(null);
  const [addRuleTypeTarget, setAddRuleTypeTarget] = useState<string | null>(null);
  const [ruleFormTag, setRuleFormTag] = useState('标签1');
  const [ruleFormDifficulty, setRuleFormDifficulty] = useState('容易');
  const [isModalTagDropdownOpen, setIsModalTagDropdownOpen] = useState(false);
  const [isModalDiffDropdownOpen, setIsModalDiffDropdownOpen] = useState(false);
  const modalTagDropdownRef = React.useRef<HTMLDivElement>(null);
  const modalDiffDropdownRef = React.useRef<HTMLDivElement>(null);

  // Custom dropdown states & refs
  const [isQuestionBankDropdownOpen, setIsQuestionBankDropdownOpen] = useState(false);
  const [activeRuleTagDropdownId, setActiveRuleTagDropdownId] = useState<string | null>(null);
  const [activeRuleDiffDropdownId, setActiveRuleDiffDropdownId] = useState<string | null>(null);

  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const bankDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(target)) {
        setIsQuestionBankDropdownOpen(false);
      }
      if (addTypeDropdownRef.current && !addTypeDropdownRef.current.contains(target)) {
        setIsAddTypeDropdownOpen(false);
      }
      if (modalTagDropdownRef.current && !modalTagDropdownRef.current.contains(target)) {
        setIsModalTagDropdownOpen(false);
      }
      if (modalDiffDropdownRef.current && !modalDiffDropdownRef.current.contains(target)) {
        setIsModalDiffDropdownOpen(false);
      }
      if (target instanceof HTMLElement && !target.closest('.rule-dropdown-container')) {
        setActiveRuleTagDropdownId(null);
        setActiveRuleDiffDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  const [drawRules, setDrawRules] = useState<DrawRule[]>([]);

  // Question Config selections and scores
  const [mcCount, setMcCount] = useState(0);
  const [mcScore, setMcScore] = useState(0);
  const [msCount, setMsCount] = useState(0);
  const [msScore, setMsScore] = useState(0);
  const [tfCount, setTfCount] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [fbCount, setFbCount] = useState(0);
  const [fbScore, setFbScore] = useState(0);
  const [saCount, setSaCount] = useState(0);
  const [saScore, setSaScore] = useState(0);
  const [thCount, setThCount] = useState(0);
  const [thScore, setThScore] = useState(0);
  const [pgCount, setPgCount] = useState(0);
  const [pgScore, setPgScore] = useState(0);
  const [sxCount, setSxCount] = useState(0);
  const [sxScore, setSxScore] = useState(0);

  // Additional credit
  const [useAdditionalCredit, setUseAdditionalCredit] = useState(false);
  const [additionalMaxScore, setAdditionalMaxScore] = useState(0);

  // Manual selection states
  const [manualTypeScores, setManualTypeScores] = useState<Record<string, string>>({
    '单选题': '3',
    '多选题': '3',
    '判断题': '3',
    '填空题': '3',
    '简答题': '10',
    '思考题': '10',
    '编程题': '10',
    '实训题': ''
  });
  const [manualTypeOrder, setManualTypeOrder] = useState<string[]>([]);

  // Search & dynamic interactions
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [paperToApplyPublic, setPaperToApplyPublic] = useState<any | null>(null);
  const [applyPublicRange, setApplyPublicRange] = useState<'租户' | '平台'>('租户');
  const [applyPublicReason, setApplyPublicReason] = useState('');
  const [isApplyingPublic, setIsApplyingPublic] = useState(false);
  const [editingPaper, setEditingPaper] = useState<any | null>(null);

  const availableQuestions = [
    {
      id: 1,
      name: '智能体与传统程序最本质的区别是什么？',
      bank: '人工智能通识D-uni',
      type: '单选题',
      status: '停用',
      source: '人工智能',
      difficulty: '容易',
      tag: '智能体',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      time: '2026/05/15 14:45',
      updateTime: '2026/05/15 14:45',
      scope: '私有',
      detailText: '分析智能体(Agent)的自主性、感知与反应能力，以及其与传统基于固定逻辑的规则引擎程序的核心区别。',
      analysis: '智能体具有自主决策、动态感知环境并进行反馈调整的特征，而传统程序多为确定性的硬编码分支。'
    },
    {
      id: 2,
      name: '智能体的四个基本组成部分包括哪些？',
      bank: '人工智能通识D-uni',
      type: '多选题',
      status: '启用',
      source: '人工智能',
      difficulty: '较易',
      tag: '智能体',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      time: '2026/05/15 14:45',
      updateTime: '2026/05/15 14:45',
      scope: '租户',
      detailText: '智能体通常包含环境(Environment)、感知(Sensor)、执行器(Actuator)和决策系统/主体(Agent Core/Brain)。',
      analysis: '考察智能体架构 model 的核心组成部分及职责划分。'
    },
    {
      id: 3,
      name: '大语言模型是__________是构建生成式各种应用的...',
      bank: '人工智能通识D-uni',
      type: '填空题',
      status: '启用',
      source: '人工出题',
      difficulty: '中等',
      tag: '-',
      tags: '',
      grading: '自动评分',
      creator: 'Momodel',
      time: '2026/05/15 17:02',
      updateTime: '2026/05/15 17:02',
      scope: '平台',
      detailText: '大语言模型(LLM)一般是基于Transformer架构在大规模文本语料库上训练所得的概率语言预测模型。',
      analysis: '考察生成式AI应用开发中大语言模型的技术基础定位与概念。'
    },
    {
      id: 4,
      name: '基于大模型的端到端自动驾驶 system 开发',
      bank: '人工智能通识D-uni',
      type: '实训题',
      status: '启用',
      source: '人工智能',
      difficulty: '困难',
      tag: '深度学习, 自动驾驶',
      tags: '深度学习, 自动驾驶',
      grading: '自动评分',
      creator: 'Momodel',
      time: '2026/05/16 11:20',
      updateTime: '2026/05/16 11:20',
      scope: '私有',
      detailText: '实现一个简单的基于多模态大模型的视觉-控制指令端到端输出实验，包含感知对齐与控制策略生成。',
      analysis: '端到端自动驾驶系统将传感器感知与动作输出直接通过大型模型进行关联和拟合，通常需要高维表征学习。'
    }
  ];

  const [papersList, setPapersList] = useState([
    {
      id: 1,
      name: '人工智能通识E-大模型技术进阶',
      description: '用于「人工智能通识」课程的“大模型技术进阶”章节测验试卷',
      questionCount: 10,
      types: '单选题, 多选题',
      type: '作业',
      selectionMethod: '随机抽题',
      status: '启用',
      creator: '孙昕',
      updateTime: '2026/05/15 14:45',
      scope: '私有',
      auditStatus: '未审核',
      mcCount: 5, mcScore: 10, msCount: 5, msScore: 10
    },
    {
      id: 2,
      name: '人工智能通识E-AI伦理与治理',
      description: '探讨AI伦理与道德规范，包含数据隐私与算法偏见等重点内容',
      questionCount: 20,
      types: '单选题, 多选题',
      type: '考试',
      selectionMethod: '手动抽题',
      status: '停用',
      creator: '张老师',
      updateTime: '2026/05/15 14:45',
      scope: '私有',
      auditStatus: '未审核',
      mcCount: 10, mcScore: 5, msCount: 10, msScore: 5
    },
    {
      id: 3,
      name: '人工智能通识E-大模型开发平台初识',
      description: '学习提示词工程与API接入开发的基础考测试卷',
      questionCount: 15,
      types: '单选题',
      type: '作业',
      selectionMethod: '随机抽题',
      status: '启用',
      creator: '孙昕',
      updateTime: '2026/05/15 17:02',
      scope: '租户',
      auditStatus: '已通过',
      mcCount: 15, mcScore: 6
    },
    {
      id: 4,
      name: '人工智能通识E-大语言模型专题',
      description: '大语言模型理论基础、架构与行业落地案例专题考核',
      questionCount: 25,
      types: '单选题, 多选题, 判断题',
      type: '考试',
      selectionMethod: '随机抽题',
      status: '停用',
      creator: '李老师',
      updateTime: '2026/05/16 11:20',
      scope: '平台',
      auditStatus: '已通过',
      mcCount: 10, mcScore: 4, msCount: 10, msScore: 4, tfCount: 5, tfScore: 4
    },
    {
      id: 5,
      name: '人工智能通识E-深度学习入门',
      description: '机器学习向深度学习演进的过渡知识测验',
      questionCount: 18,
      types: '单选题, 判断题',
      type: '作业',
      selectionMethod: '随机抽题',
      status: '启用',
      creator: '孙昕',
      updateTime: '2026/05/16 14:30',
      scope: '租户',
      auditStatus: '已通过',
      mcCount: 10, mcScore: 5, tfCount: 8, tfScore: 5
    },
    {
      id: 6,
      name: '人工智能通识E-神经网络基础',
      description: '人工神经网络前向传播与反向传播算法核心推导测试',
      questionCount: 30,
      types: '单选题, 简答题',
      type: '考试',
      selectionMethod: '手动抽题',
      status: '停用',
      creator: '孙昕',
      updateTime: '2026/05/17 09:15',
      scope: '平台',
      auditStatus: '已通过',
      mcCount: 20, mcScore: 3, saCount: 10, saScore: 4
    }
  ]);

  const filteredPapers = papersList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.creator && p.creator.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalObjCount = mcCount + msCount + tfCount + fbCount + saCount + thCount + pgCount;
  const totalObjScore = (mcCount * mcScore) + (msCount * msScore) + (tfCount * tfScore) + (fbCount * fbScore) + (saCount * saScore) + (thCount * thScore) + (pgCount * pgScore);
  
  const totalPracCount = sxCount;
  const totalPracScore = sxCount * sxScore;

  const totalCount = totalObjCount + totalPracCount;
  const totalScore = totalObjScore + totalPracScore;

  // 随机抽题计算逻辑
  const drawRulesCount = drawRules.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
  const drawRulesScore = drawRules.reduce((sum, r) => sum + ((Number(r.count) || 0) * (Number(r.score) || 0)), 0);

  // 手动选题计算逻辑
  const manualCount = confirmedQuestions.length;
  const manualScore = confirmedQuestions.reduce((sum, q) => {
    const scoreStr = manualTypeScores[q.type] !== undefined ? manualTypeScores[q.type] : (q.type === '单选题' || q.type === '多选题' ? '3' : '');
    return sum + (parseFloat(scoreStr) || 0);
  }, 0);

  const displayCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? drawRulesCount : manualCount;
  const displayScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? drawRulesScore : manualScore;

  const getRuleTypeCount = (type: string) => {
    return drawRules.filter(r => r.type === type).reduce((sum, r) => sum + (Number(r.count) || 0), 0);
  };
  const getRuleTypeScore = (type: string) => {
    const rules = drawRules.filter(r => r.type === type && Number(r.count) > 0);
    return rules.length > 0 ? Number(rules[0].score) || 0 : 0;
  };

  const handleUpdateRule = (id: string, key: keyof DrawRule, value: any) => {
    setDrawRules(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  const handleAddRule = (type: string, tag: string = '标签1', difficulty: string = '容易') => {
    const newRule: DrawRule = {
      id: `r-${Date.now()}-${Math.random()}`,
      type,
      tag,
      difficulty,
      count: '',
      maxAvailable: 3,
      score: ''
    };
    setDrawRules(prev => [...prev, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setDrawRules(prev => prev.filter(r => r.id !== id));
  };

  const handleMoveTypeUp = (type: string) => {
    const idx = typeOrder.indexOf(type);
    if (idx > 0) {
      const newOrder = [...typeOrder];
      newOrder[idx] = typeOrder[idx - 1];
      newOrder[idx - 1] = typeOrder[idx];
      setTypeOrder(newOrder);
    }
  };

  const handleMoveTypeDown = (type: string) => {
    const idx = typeOrder.indexOf(type);
    if (idx < typeOrder.length - 1) {
      const newOrder = [...typeOrder];
      newOrder[idx] = typeOrder[idx + 1];
      newOrder[idx + 1] = typeOrder[idx];
      setTypeOrder(newOrder);
    }
  };

  const handleAddTypeSection = (type: string) => {
    if (!typeOrder.includes(type)) {
      setTypeOrder(prev => [...prev, type]);
    } else {
      alert('该题型已存在，请勿重复添加！');
    }
  };

  const handleDeleteTypeSection = (type: string) => {
    setDeleteTypeTarget(type);
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPapers(filteredPapers.map(p => p.id));
    } else {
      setSelectedPapers([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedPapers.includes(id)) {
      setSelectedPapers(selectedPapers.filter(pId => pId !== id));
    } else {
      setSelectedPapers([...selectedPapers, id]);
    }
  };

  const togglePaperStatus = (id: number) => {
    setPapersList(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === '启用' ? '停用' : '启用'
        };
      }
      return p;
    }));
  };

  const handleOpenApplyPublic = (p: any) => {
    setPaperToApplyPublic(p);
    setApplyPublicRange('租户');
    setApplyPublicReason('');
    setIsApplyPublicModalOpen(true);
  };

  const handleSubmitApplyPublic = () => {
    if (!applyPublicReason.trim()) {
      alert('请填写申请说明！');
      return;
    }
    setIsApplyingPublic(true);
    setTimeout(() => {
      setIsApplyingPublic(false);
      setIsApplyPublicModalOpen(false);
      setPapersList(prev => prev.map(item => {
        if (item.id === paperToApplyPublic.id) {
          return {
            ...item,
            scope: applyPublicRange,
            auditStatus: '未审核'
          };
        }
        return item;
      }));
      alert('已成功提交公开申请！');
    }, 1000);
  };

  const handleCopyPaper = (p: any) => {
    const newPaper = {
      ...p,
      id: Date.now(),
      name: `${p.name} - 副本`,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      creator: '孙昕',
      scope: '私有',
      auditStatus: '未审核'
    };
    setPapersList([newPaper, ...papersList]);
    alert(`已成功复制试卷 "${p.name}"！`);
  };

  const handleEditPaper = (p: any) => {
    setEditingPaper(p);
    setPaperName(p.name);
    setPaperDescription(p.description || '');
    setPaperType(p.type);
    setPaperScope(p.scope || '私有');
    setPaperStatus(p.status);
    setPaperSelectionMethod(p.selectionMethod || '随机抽题');
    
    // Set counts if available
    setMcCount(p.mcCount || 0);
    setMcScore(p.mcScore || 0);
    setMsCount(p.msCount || 0);
    setMsScore(p.msScore || 0);
    setTfCount(p.tfCount || 0);
    setTfScore(p.tfScore || 0);
    setFbCount(p.fbCount || 0);
    setFbScore(p.fbScore || 0);
    setSaCount(p.saCount || 0);
    setSaScore(p.saScore || 0);
    setThCount(p.thCount || 0);
    setThScore(p.thScore || 0);
    setPgCount(p.pgCount || 0);
    setPgScore(p.pgScore || 0);
    setSxCount(p.sxCount || 0);
    setSxScore(p.sxScore || 0);
    
    if ((p.selectionMethod || '随机抽题') === '随机抽题' || p.selectionMethod === '千人千卷') {
      setSelectedQuestionBanks(['人工智能通识D-uni']);
      const types: string[] = [];
      const rules: DrawRule[] = [];
      const typeMappings = [
        { name: '单选题', count: p.mcCount, score: p.mcScore },
        { name: '多选题', count: p.msCount, score: p.msScore },
        { name: '判断题', count: p.tfCount, score: p.tfScore },
        { name: '填空题', count: p.fbCount, score: p.fbScore },
        { name: '简答题', count: p.saCount, score: p.saScore },
        { name: '思考题', count: p.thCount, score: p.thScore },
        { name: '编程题', count: p.pgCount, score: p.pgScore },
        { name: '实训题', count: p.sxCount, score: p.sxScore },
      ];
      typeMappings.forEach(tm => {
        if (tm.count > 0) {
          types.push(tm.name);
          rules.push({
            id: `r-edit-${tm.name}-${Date.now()}`,
            type: tm.name,
            tag: '标签1',
            difficulty: '容易',
            count: tm.count.toString(),
            maxAvailable: tm.count + 2,
            score: tm.score.toString()
          });
        }
      });
      setTypeOrder(types);
      setDrawRules(rules);
    } else {
      setSelectedQuestionBanks([]);
      setTypeOrder([]);
      setDrawRules([]);
      
      // Populate confirmedQuestions and manualQuestionScores for manual selection
      const mockConfirmed = availableQuestions.filter(q => {
        if (q.type === '单选题' && p.mcCount > 0) return true;
        if (q.type === '多选题' && p.msCount > 0) return true;
        if (q.type === '判断题' && p.tfCount > 0) return true;
        if (q.type === '填空题' && p.fbCount > 0) return true;
        if (q.type === '简答题' && p.saCount > 0) return true;
        if (q.type === '思考题' && p.thCount > 0) return true;
        if (q.type === '编程题' && p.pgCount > 0) return true;
        if (q.type === '实训题' && p.sxCount > 0) return true;
        return false;
      });
      setConfirmedQuestions(mockConfirmed);
      setSelectedConfigQuestions(mockConfirmed.map(q => q.id));
      setIsObjConfigured(mockConfirmed.length > 0);

      const initialScores: Record<string, string> = {
        '单选题': (p.mcScore !== undefined ? p.mcScore : 3).toString(),
        '多选题': (p.msScore !== undefined ? p.msScore : 3).toString(),
        '判断题': (p.tfScore !== undefined ? p.tfScore : 3).toString(),
        '填空题': (p.fbScore !== undefined ? p.fbScore : 3).toString(),
        '简答题': (p.saScore !== undefined ? p.saScore : 10).toString(),
        '思考题': (p.thScore !== undefined ? p.thScore : 10).toString(),
        '编程题': (p.pgScore !== undefined ? p.pgScore : 10).toString(),
        '实训题': (p.sxScore !== undefined ? p.sxScore : '').toString()
      };
      const initialTypes: string[] = [];
      mockConfirmed.forEach(q => {
        if (!initialTypes.includes(q.type)) {
          initialTypes.push(q.type);
        }
      });
      setManualTypeScores(initialScores);
      setManualTypeOrder(initialTypes);
    }
    
    setIsCreateOpen(true);
  };

  const handleCloseCreateDrawer = () => {
    setIsCreateOpen(false);
    setEditingPaper(null);
    setPaperName('');
    setPaperDescription('');
    setPaperType('作业');
    setPaperScope('私有');
    setPaperStatus('启用');
    setPaperSelectionMethod('随机抽题');
    setMcCount(0); setMcScore(0);
    setMsCount(0); setMsScore(0);
    setTfCount(0); setTfScore(0);
    setFbCount(0); setFbScore(0);
    setSaCount(0); setSaScore(0);
    setThCount(0); setThScore(0);
    setPgCount(0); setPgScore(0);
    setSxCount(0); setSxScore(0);
    setUseAdditionalCredit(false);
    setAdditionalMaxScore(0);
    setConfirmedQuestions([]);
    setSelectedConfigQuestions([]);
    setIsObjConfigured(false);
    setSelectedQuestionBanks([]);
    setTypeOrder([]);
    setDrawRules([]);
    setManualTypeScores({
      '单选题': '3',
      '多选题': '3',
      '判断题': '3',
      '填空题': '3',
      '简答题': '10',
      '思考题': '10',
      '编程题': '10',
      '实训题': ''
    });
    setManualTypeOrder([]);
  };

  const handleSavePaper = () => {
    if (!paperName.trim()) {
      alert('请输入试卷名称！');
      return;
    }

    const finalMcCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('单选题') : mcCount;
    const finalMcScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('单选题') : mcScore;
    const finalMsCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('多选题') : msCount;
    const finalMsScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('多选题') : msScore;
    const finalTfCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('判断题') : tfCount;
    const finalTfScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('判断题') : tfScore;
    const finalFbCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('填空题') : fbCount;
    const finalFbScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('填空题') : fbScore;
    const finalSaCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('简答题') : saCount;
    const finalSaScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('简答题') : saScore;
    const finalThCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('思考题') : thCount;
    const finalThScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('思考题') : thScore;
    const finalPgCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('编程题') : pgCount;
    const finalPgScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('编程题') : pgScore;
    const finalSxCount = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeCount('实训题') : sxCount;
    const finalSxScore = (paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? getRuleTypeScore('实训题') : sxScore;

    const activeTypesList = [];
    if (finalMcCount > 0) activeTypesList.push('单选题');
    if (finalMsCount > 0) activeTypesList.push('多选题');
    if (finalTfCount > 0) activeTypesList.push('判断题');
    if (finalFbCount > 0) activeTypesList.push('填空题');
    if (finalSaCount > 0) activeTypesList.push('简答题');
    if (finalThCount > 0) activeTypesList.push('思考题');
    if (finalPgCount > 0) activeTypesList.push('编程题');
    if (finalSxCount > 0) activeTypesList.push('实训题');
    const finalTypesString = activeTypesList.join(', ') || '单选题';

    if (editingPaper) {
      setPapersList(prev => prev.map(p => {
        if (p.id === editingPaper.id) {
          return {
            ...p,
            name: paperName,
            description: paperDescription || '暂无试卷说明描述',
            questionCount: displayCount || 10,
            types: finalTypesString,
            type: paperType,
            selectionMethod: paperSelectionMethod,
            status: paperStatus,
            scope: paperScope,
            updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
            mcCount: finalMcCount, mcScore: finalMcScore, msCount: finalMsCount, msScore: finalMsScore, tfCount: finalTfCount, tfScore: finalTfScore, fbCount: finalFbCount, fbScore: finalFbScore, saCount: finalSaCount, saScore: finalSaScore, thCount: finalThCount, thScore: finalThScore, pgCount: finalPgCount, pgScore: finalPgScore, sxCount: finalSxCount, sxScore: finalSxScore
          };
        }
        return p;
      }));
    } else {
      const newPaper = {
        id: Date.now(),
        name: paperName,
        description: paperDescription || '暂无试卷说明描述',
        questionCount: displayCount || 10,
        types: finalTypesString,
        type: paperType,
        selectionMethod: paperSelectionMethod,
        status: paperStatus,
        creator: '孙昕',
        updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
        scope: paperScope,
        auditStatus: '未审核',
        mcCount: finalMcCount, mcScore: finalMcScore, msCount: finalMsCount, msScore: finalMsScore, tfCount: finalTfCount, tfScore: finalTfScore, fbCount: finalFbCount, fbScore: finalFbScore, saCount: finalSaCount, saScore: finalSaScore, thCount: finalThCount, thScore: finalThScore, pgCount: finalPgCount, pgScore: finalPgScore, sxCount: finalSxCount, sxScore: finalSxScore
      };
      setPapersList([newPaper, ...papersList]);
    }
    
    handleCloseCreateDrawer();
  };

  const handleConfirmSelections = () => {
    const selectedList = availableQuestions.filter(q => selectedConfigQuestions.includes(q.id));
    setConfirmedQuestions(selectedList);
    setIsObjConfigured(selectedList.length > 0);
    setIsConfigModalOpen(false);

    // Automatically recalculate and set the counts in the inputs!
    const counts = {
      '单选题': 0,
      '多选题': 0,
      '判断题': 0,
      '填空题': 0,
      '简答题': 0,
      '思考题': 0,
      '编程题': 0,
    };

    selectedList.forEach(q => {
      if (q.type in counts) {
        counts[q.type as keyof typeof counts] += 1;
      }
    });

    setMcCount(counts['单选题']);
    setMsCount(counts['多选题']);
    setTfCount(counts['判断题']);
    setFbCount(counts['填空题']);
    setSaCount(counts['简答题']);
    setThCount(counts['思考题']);
    setPgCount(counts['编程题']);

    // Set default score per question to 10 points if they are selected
    if (counts['单选题'] > 0) setMcScore(10);
    if (counts['多选题'] > 0) setMsScore(15);
    if (counts['判断题'] > 0) setTfScore(5);
    if (counts['填空题'] > 0) setFbScore(5);
    if (counts['简答题'] > 0) setSaScore(20);
    if (counts['思考题'] > 0) setThScore(20);
    if (counts['编程题'] > 0) setPgScore(30);

    // Populate manualTypeOrder
    const newTypes = [...manualTypeOrder];
    selectedList.forEach(q => {
      if (!newTypes.includes(q.type)) {
        newTypes.push(q.type);
      }
    });
    setManualTypeOrder(newTypes);
  };

  const handleRemoveConfirmedQuestion = (id: number) => {
    const updated = confirmedQuestions.filter(q => q.id !== id);
    setConfirmedQuestions(updated);
    setIsObjConfigured(updated.length > 0);
    setSelectedConfigQuestions(selectedConfigQuestions.filter(qId => qId !== id));

    // Recalculate
    const counts = {
      '单选题': 0,
      '多选题': 0,
      '判断题': 0,
      '填空题': 0,
      '简答题': 0,
      '思考题': 0,
      '编程题': 0,
    };

    updated.forEach(q => {
      if (q.type in counts) {
        counts[q.type as keyof typeof counts] += 1;
      }
    });

    setMcCount(counts['单选题']);
    setMsCount(counts['多选题']);
    setTfCount(counts['判断题']);
    setFbCount(counts['填空题']);
    setSaCount(counts['简答题']);
    setThCount(counts['思考题']);
    setPgCount(counts['编程题']);
  };

  const handleRemoveManualTypeSection = (type: string) => {
    if (confirm(`确定要移除所有${type}吗？`)) {
      const updated = confirmedQuestions.filter(q => q.type !== type);
      setConfirmedQuestions(updated);
      setIsObjConfigured(updated.length > 0);
      setSelectedConfigQuestions(updated.map(q => q.id));
    }
  };

  const handleMoveManualTypeUp = (type: string) => {
    const idx = manualTypeOrder.indexOf(type);
    if (idx > 0) {
      const newOrder = [...manualTypeOrder];
      newOrder[idx] = manualTypeOrder[idx - 1];
      newOrder[idx - 1] = manualTypeOrder[idx];
      setManualTypeOrder(newOrder);
    }
  };

  const handleMoveManualTypeDown = (type: string) => {
    const idx = manualTypeOrder.indexOf(type);
    if (idx < manualTypeOrder.length - 1) {
      const newOrder = [...manualTypeOrder];
      newOrder[idx] = manualTypeOrder[idx + 1];
      newOrder[idx + 1] = manualTypeOrder[idx];
      setManualTypeOrder(newOrder);
    }
  };

  const handleBatchDelete = () => {
    if (selectedPapers.length === 0) return;
    if (confirm(`确定要删除选中的 ${selectedPapers.length} 套试卷吗？`)) {
      setPapersList(prev => prev.filter(p => !selectedPapers.includes(p.id)));
      setSelectedPapers([]);
    }
  };

  const filteredConfigQuestions = availableQuestions.filter(q => 
    q.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    q.bank.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    q.type.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    q.difficulty.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    q.creator.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    q.scope.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* CSS float animation for preview banner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateY(-6px) rotate(-1deg); }
          50% { transform: translateY(-50%) translateY(6px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

      {view === 'list' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4 text-left">
            <div className="flex items-end gap-4">
              <h1 className="text-xl font-bold text-neutral-900">试卷管理</h1>
              <p className="text-sm text-neutral-500 mb-0.5">新建试卷前请先创建可用试题，试卷“启用”后即可用于课程作业或章节测验</p>
            </div>
          </div>

          {/* Table and Toolbar unified module */}
          <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入要搜索的内容"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
                <Button 
                  onClick={() => {
                    handleCloseCreateDrawer();
                    setIsCreateOpen(true);
                  }} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0"
                >
                  <Plus className="w-3.5 h-3.5" /> 新建试卷
                </Button>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="pl-6 pr-3 py-3.5 font-medium text-left">试卷名称</th>
                    <th className="px-3 py-3.5 font-medium text-left">题目数量</th>
                    <th className="px-3 py-3.5 font-medium text-left">包含题型</th>
                    <th className="px-3 py-3.5 font-medium text-left">试卷类型</th>
                    <th className="px-3 py-3.5 font-medium text-left">抽题方式</th>
                    <th className="px-3 py-3.5 font-medium text-left">状态</th>
                    <th className="px-3 py-3.5 font-medium text-left">创建人</th>
                    <th className="px-3 py-3.5 font-medium text-left">更新时间</th>
                    <th className="px-3 py-3.5 font-medium text-left">试题范围</th>
                    <th className="px-3 py-3.5 font-medium text-left">审核状态</th>
                    <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map((p, idx) => (
                    <React.Fragment key={p.id}>
                      <tr className={cn(
                        "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                        idx === filteredPapers.length - 1 && "border-b-0"
                      )}>
                        <td className="pl-6 pr-3 py-3">
                          <div className="text-neutral-800 max-w-[180px] truncate font-medium" title={p.name}>{p.name}</div>
                        </td>
                        <td className="px-3 py-3 text-neutral-600">{p.questionCount}</td>
                        <td className="px-3 py-3 text-neutral-600">
                          <div className="max-w-[100px] truncate" title={p.types}>{p.types}</div>
                        </td>
                        <td className="px-3 py-3 text-neutral-800">{p.type}</td>
                        <td className="px-3 py-3 text-neutral-600">{p.selectionMethod}</td>
                        <td className="px-3 py-3">
                          <span className={cn(
                            "px-2 py-0.5 text-[12px] rounded-[4px] border", 
                            p.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                          )}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-neutral-600">{p.creator}</td>
                        <td className="px-3 py-3 text-neutral-500 text-[12px]">{p.updateTime}</td>
                        <td className="px-3 py-3">
                          {p.scope === '私有' && (
                            <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded-[4px] text-[12px] text-neutral-600">私有</span>
                          )}
                          {p.scope === '租户' && (
                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-[4px] text-[12px] text-blue-600">租户</span>
                          )}
                          {p.scope === '平台' && (
                            <span className="px-2 py-0.5 bg-[#fff2e8] border border-[#ffbb96] rounded-[4px] text-[12px] text-[#fa541c]">平台</span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-medium text-left">
                          {p.auditStatus === '已通过' ? (
                            <span className="text-green-600">已通过</span>
                          ) : p.auditStatus === '未审核' ? (
                            <span className="text-amber-500">未审核</span>
                          ) : (
                            <span className="text-neutral-500">{p.auditStatus}</span>
                          )}
                        </td>
                        <td className="pl-3 pr-6 py-3 text-left">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const rowActions = [
                                { label: '详情', onClick: () => setViewingPaper(p), isDanger: false },
                                { label: '编辑', onClick: () => handleEditPaper(p), isDanger: false },
                              ];
                              
                              if (p.status === '启用' && p.scope === '私有') {
                                rowActions.push({ label: '公开', onClick: () => handleOpenApplyPublic(p), isDanger: false });
                              }
                              
                              rowActions.push({ 
                                label: p.status === '启用' ? '停用' : '启用', 
                                onClick: () => togglePaperStatus(p.id), 
                                isDanger: false 
                              });
                              
                              rowActions.push({ 
                                label: '复制', 
                                onClick: () => handleCopyPaper(p), 
                                isDanger: false 
                              });
                              
                              rowActions.push({ 
                                label: '删除', 
                                onClick: () => setPapersList(papersList.filter(item => item.id !== p.id)), 
                                isDanger: true 
                              });

                              const visibleActions = rowActions.slice(0, 2);
                              const dropdownActions = rowActions.slice(2);

                              return (
                                <>
                                  {visibleActions.map((act) => (
                                    <button
                                      key={act.label}
                                      type="button"
                                      onClick={act.onClick}
                                      className={cn(
                                        "text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap",
                                        act.isDanger && "text-red-500 hover:text-red-700"
                                      )}
                                    >
                                      {act.label}
                                    </button>
                                  ))}

                                  {dropdownActions.length > 0 && (
                                    <div className="relative inline-block text-left">
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveDropdownId(activeDropdownId === p.id ? null : p.id);
                                        }}
                                        className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap"
                                      >
                                        <span>更多</span>
                                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-neutral-400", activeDropdownId === p.id && "rotate-180")} />
                                      </button>
                                      
                                      {activeDropdownId === p.id && (
                                        <div 
                                          className="absolute right-0 mt-1.5 w-20 bg-white border border-neutral-200 rounded-[4px] shadow-lg z-[60] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {dropdownActions.map((act) => (
                                            <button 
                                              key={act.label}
                                              type="button"
                                              onClick={() => {
                                                act.onClick();
                                                setActiveDropdownId(null);
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-1.5 text-xs transition-colors bg-transparent border-0 cursor-pointer block font-medium",
                                                act.isDanger 
                                                  ? "text-red-500 hover:bg-red-50" 
                                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-[#fa541c]"
                                              )}
                                            >
                                              {act.label}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end px-6 py-4 gap-4 border-t border-neutral-border/30">
              <span className="text-[13px] text-neutral-500">共 {filteredPapers.length} 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white">&gt;</Button>
              </div>
              <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white">
                <option>10 条/页</option>
                <option>20 条/页</option>
                <option>50 条/页</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        /* 客观题预览界面 (参考题库详情布局和排版，橙色主题) */
        <div className="animate-fade-in -mx-6 -mt-6 min-h-[calc(100vh-56px)] bg-[#f5f7fa] pb-12 text-left">
          {/* Inject style for floating animation */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes float {
              0% { transform: translateY(0px) rotate(12deg); }
              50% { transform: translateY(-10px) rotate(10deg); }
              100% { transform: translateY(0px) rotate(12deg); }
            }
            .style-floating-element {
              animation: float 4s ease-in-out infinite;
            }
          `}} />

          {/* 顶部橙色渐变 Banner 区域 */}
          <div className="relative bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] pt-6 pb-16 text-white select-none overflow-hidden shrink-0">
            {/* Background circular decorations referencing assignment preview */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full"></div>
              <div className="absolute -right-10 top-10 w-[300px] h-[300px] border-[2px] border-white/10 rounded-full"></div>
            </div>

            {/* 3D Glassmorphic Cube/Sphere floats on the right side */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 overflow-visible pointer-events-none hidden md:block">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Glow circle */}
                <div className="absolute w-40 h-40 rounded-full bg-white/20 blur-xl animate-pulse"></div>
                {/* Rotating Outer Rings */}
                <div className="absolute w-36 h-36 border border-white/20 rounded-full animate-[spin_12s_linear_infinite] border-dashed"></div>
                <div className="absolute w-28 h-28 border border-white/30 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                {/* Inner floating cube/sphere */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-white/30 to-white/15 backdrop-blur-md border border-white/45 shadow-2xl rotate-12 flex items-center justify-center style-floating-element">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-[#fa541c] to-[#ff7875] opacity-85 shadow-sm transform -rotate-12 border border-white/25"></div>
                </div>
                {/* Secondary floating dots */}
                <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-[#ff7875] opacity-75 blur-[1px] animate-[float_3s_ease-in-out_infinite_alternate]"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-white opacity-60 blur-[0.5px] animate-[float_5s_ease-in-out_infinite_alternate]"></div>
              </div>
            </div>

            {/* Content info (centered & aligned horizontally with the card container) */}
            <div className="max-w-5xl mx-auto px-6 w-full relative z-10 flex flex-col">
              {/* Breadcrumbs - Line 1: back button link inline */}
              <div className="flex items-center gap-2 text-[12px] text-white/70 mb-4 font-medium tracking-wider">
                <button 
                  onClick={() => {
                    setView('list');
                    setViewingPaper(null);
                  }} 
                  className="hover:text-white transition-colors flex items-center gap-1 font-bold border-0 bg-transparent p-0 cursor-pointer text-white/70"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 返回试卷列表
                </button>
              </div>
              
              {/* Big Title - Line 2 */}
              <h1 className="text-[28px] font-bold mb-4 tracking-wider leading-tight">
                {viewingPaper?.name || '生成式AI与大模型应用期末考试-客观题'}
              </h1>

              {/* Creator info - Line 3 */}
              <div className="flex items-center gap-6 text-[13px] text-white/90">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> 创建人：{viewingPaper?.creator || '孙昕'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 更新时间：{viewingPaper?.updateTime || '2026/02/11'}</span>
                <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> 题目数量：{viewingPaper?.questionCount || 0} 道题</span>
              </div>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-8 pb-20">
            <div className="bg-white rounded-t-xl rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 min-h-[400px] border border-neutral-100">
              {(() => {
                // Inline helper to get questions for this paper
                const getQuestionsForPaper = () => {
                  if (viewingPaper && viewingPaper.name === paperName && confirmedQuestions.length > 0) {
                    return confirmedQuestions;
                  }
                  const paperNameText = viewingPaper?.name || '';
                  const questions: any[] = [];
                  
                  if (
                    paperNameText.includes('AI 通识') || 
                    paperNameText.includes('人工智能通识') || 
                    paperNameText.includes('生成式AI') || 
                    paperNameText.includes('大模型') || 
                    paperNameText.includes('伦理') ||
                    paperNameText.includes('语言模型')
                  ) {
                    questions.push(
                      {
                        id: 1,
                        name: '关于大模型的“涌现能力”，以下说法正确的是（ ）。',
                        type: '单选题',
                        options: [
                          '涌现能力是指模型参数规模超过某个阈值后，突然展现出的新能力',
                          '涌现能力只能通过增加训练数据量获得，与参数规模无关',
                          '涌现能力是所有大模型都具备的，不需要达到一定规模',
                          '涌现能力是小模型特有的，大模型不具备'
                        ],
                        correct: 'A',
                        analysis: '涌现能力是指当模型参数规模达到一定量级时，模型突然表现出之前小规模模型不具备的高级认知能力。'
                      },
                      {
                        id: 2,
                        name: '以下哪个工具属于“内容分析”类应用？（ ）。',
                        type: '单选题',
                        options: [
                          'DeepSeek',
                          'Kimi',
                          'MidJourney',
                          'GitHub Copilot'
                        ],
                        correct: 'B',
                        analysis: 'Kimi 以长文本分析 and 内容归纳为核心特色，属于典型的内容分析类大模型应用。'
                      },
                      {
                        id: 3,
                        name: '多模态大模型是指能够处理（ ）的模型。',
                        type: '单选题',
                        options: [
                          '文字、图像、音频、视频等多种类型数据',
                          '仅限图像',
                          '仅限文字',
                          '仅限音频'
                        ],
                        correct: 'A',
                        analysis: '多模态大模型能够跨越单一的文本模态，同时接收和生成文本、图像、语音、视频等多种信息媒介。'
                      },
                      {
                        id: 4,
                        name: '零样本提示（Zero-shot Prompting）指的是不向模型提供任何示例，直接给出任务指令。',
                        type: '判断题',
                        options: ['正确', '错误'],
                        correct: '正确',
                        analysis: 'Zero-shot Prompting 依赖模型预训练阶段积累的知识，直接执行从未见过示范的特定任务。'
                      },
                      {
                        id: 5,
                        name: '大语言模型由于其自回归的概率预测机制，容易产生符合语法逻辑但内容完全不真实的（ ）现象。',
                        type: '填空题',
                        options: [],
                        correct: '幻觉',
                        analysis: '幻觉（Hallucination）是大语言模型根据概率分布输出文本时常见的局限性。'
                      }
                    );
                  } else if (paperNameText.includes('机器学习') || paperNameText.includes('深度学习')) {
                    questions.push(
                      {
                        id: 11,
                        name: '机器学习中监督学习与无监督学习的核心区别是（ ）。',
                        type: '单选题',
                        options: [
                          '训练数据是否包含标签/标注信息',
                          '模型运行速度的快慢',
                          '是否使用神经网络算法',
                          '是否可以连接互联网进行实时学习'
                        ],
                        correct: 'A',
                        analysis: '监督学习需要明确的输入输出对（即标签）作为指导，而无监督学习直接对未标记数据寻找内部结构关系。'
                      },
                      {
                        id: 12,
                        name: '随机森林（Random Forest）的基分类器通常是决策树（Decision Tree）。',
                        type: '判断题',
                        options: ['正确', '错误'],
                        correct: '正确',
                        analysis: '随机森林通过Bagging集成方法，并行构建多棵决策树作为其基础估计器。'
                      },
                      {
                        id: 13,
                        name: '关于支持向量机（SVM），以下说法正确的有（ ）。',
                        type: '多选题',
                        options: [
                          '支持向量机旨在寻找一个最优超平面以最大化分类间隔',
                          '引入核函数是为了处理低维空间中线性不可分的问题',
                          '支持向量是指距离决策超平面最近的那些训练样本点',
                          'SVM 的训练过程不需要任何参数调优'
                        ],
                        correct: 'A, B, C',
                        analysis: 'SVM 的核心思想是最大化分类间隔，核函数用于做非线性映射，支持向量决定了超平面的位置。'
                      },
                      {
                        id: 14,
                        name: '在神经网络中，激活函数的主要作用是（ ）。',
                        type: '单选题',
                        options: [
                          '为网络引入非线性建模能力，从而可以拟合任意复杂的函数',
                          '加速正向传播的矩阵乘法速度',
                          '初始化权值 and 偏置，避免梯度消失',
                          '自动调节优化器（如 Adam）的学习率'
                        ],
                        correct: 'A',
                        analysis: '若不包含激活函数，神经网络的多层叠加只能退化为单层线性映射。激活函数引入非线性从而支持拟合复杂曲线。'
                      },
                      {
                        id: 15,
                        name: '过拟合是指模型在训练集上表现优异，但在测试集或未知数据上表现很差的现象。',
                        type: '判断题',
                        options: ['正确', '错误'],
                        correct: '正确',
                        analysis: '过拟合说明模型过度拟合了训练集中的噪声，降低了泛化性能。'
                      }
                    );
                  } else {
                    // Fallback: mix of default mock questions
                    questions.push(
                      {
                        id: 21,
                        name: '人工智能发展的三个历史阶段分别是自动控制、知识工程和（ ）。',
                        type: '单选题',
                        options: [
                          '机器学习与连接主义（深度学习）',
                          '区块链技术',
                          '量子计算',
                          '云计算与虚拟化'
                        ],
                        correct: 'A',
                        analysis: '人工智能自诞生起经历了自动控制、以专家系统为核心 of 知识工程，再到当前的深度学习浪潮。'
                      },
                      {
                        id: 22,
                        name: '神经网络中的激活函数主要作用是引入非线性因素。',
                        type: '判断题',
                        options: ['正确', '错误'],
                        correct: '正确',
                        analysis: '激活函数提供非线性特征。'
                      },
                      {
                        id: 23,
                        name: '机器学习中常见的分类算法包括以下哪些？',
                        type: '多选题',
                        options: [
                          '逻辑回归 (Logistic Regression)',
                          '支持向量机 (SVM)',
                          '决策树 (Decision Tree)',
                          'K-Means 均值聚类'
                        ],
                        correct: 'A, B, C',
                        analysis: '逻辑回归、SVM、决策树均为分类算法，而 K-Means 是典型的无监督聚类算法。'
                      }
                    );
                  }
                  return questions;
                };

                const paperQuestions = getQuestionsForPaper();
                const groupedQuestions: { [key: string]: any[] } = {};
                
                // Group them by type
                paperQuestions.forEach(q => {
                  if (!groupedQuestions[q.type]) {
                    groupedQuestions[q.type] = [];
                  }
                  groupedQuestions[q.type].push(q);
                });

                // Calculate global index offsets for group headers
                let currentGlobalIndex = 1;
                const groupsInfo = Object.entries(groupedQuestions).map(([type, list]) => {
                  const startIdx = currentGlobalIndex;
                  const endIdx = currentGlobalIndex + list.length - 1;
                  currentGlobalIndex += list.length;
                  return {
                    type,
                    list,
                    startIdx,
                    endIdx,
                    totalPoints: list.length * 20
                  };
                });

                if (groupsInfo.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 text-sm gap-2">
                      <FileQuestion className="w-12 h-12 stroke-[1.2] text-neutral-300 animate-pulse" />
                      <span>该试卷内暂无可用客观题</span>
                    </div>
                  );
                }

                return (
                  <div className="space-y-10">
                    {groupsInfo.map((group) => (
                      <div key={group.type} className="animate-slide-up">
                        {/* Group Header */}
                        <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3.5 mb-6 text-left">
                          <div className="w-5.5 h-5.5 rounded-full bg-blue-50 text-[#1677ff] flex items-center justify-center flex-shrink-0 border border-blue-100">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-[14px] font-bold text-neutral-800">
                            {group.type}
                          </span>
                          <span className="text-[12px] text-neutral-400 font-medium">
                            {group.startIdx === group.endIdx 
                              ? `(第 ${group.startIdx} 题，共 1 题)`
                              : `(第 ${group.startIdx}-${group.endIdx} 题，共 ${group.list.length} 题)`
                            }
                          </span>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-8 pl-1">
                          {group.list.map((q, qIndex) => {
                            const number = group.startIdx + qIndex;
                            const isChoice = ['单选题', '多选题'].includes(q.type);
                            
                            return (
                              <div key={q.id || qIndex} className="text-left space-y-3.5">
                                {/* Question Title */}
                                <h4 className="text-[14px] font-bold text-neutral-800 leading-snug">
                                  {number}、{q.name}
                                </h4>

                                {/* Options (For single & multiple choices) */}
                                {isChoice && (
                                  <div className="space-y-3 pl-5">
                                    {q.options && q.options.map((optText: string, optIdx: number) => {
                                      const letter = String.fromCharCode(65 + optIdx);
                                      return (
                                        <div key={letter} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed font-semibold">
                                          <span className="font-bold text-neutral-400 w-4 select-none shrink-0">{letter}</span>
                                          <span>{optText}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Underline for fill-in-the-blank or basic placeholder for other types */}
                                {q.type === '填空题' && (
                                  <div className="pl-5 text-xs text-neutral-400 italic">
                                    （答题栏：______________________________________）
                                  </div>
                                )}

                                {/* Answer and Analysis section referencing TeacherQuestions details drawer */}
                                <div className="mt-3 bg-[#fff2e8]/40 border border-[#ffbb96]/45 rounded-xl p-4 space-y-2.5 max-w-2xl ml-5">
                                  <div className="text-xs text-[#fa541c] font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                                    <span>正确答案：</span>
                                    <span className="px-2 py-0.5 bg-[#fa541c] text-white rounded text-[10px] font-bold shadow-sm">{q.correct}</span>
                                  </div>
                                  <div className="text-[11px] text-neutral-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-neutral-100/80">
                                    <span className="font-bold text-neutral-700 block mb-1">解析：</span>
                                    {q.analysis}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
          {/* 新建/编辑试卷 Drawer */}
      {isCreateOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={handleCloseCreateDrawer}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 text-left">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                {editingPaper ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />}
                {editingPaper ? '编辑试卷' : '新建试卷'}
              </h2>
              <button 
                onClick={handleCloseCreateDrawer}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-left">
              {/* 试卷名称 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  试卷名称 <span className="text-[#fa541c]">*</span>
                </label>
                <input
                  type="text"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  placeholder="请输入试卷名称"
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 bg-white"
                />
              </div>

              {/* 试卷说明 */}
              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                  试卷说明
                </label>
                <div className="relative w-full">
                  <textarea
                    value={paperDescription}
                    onChange={(e) => setPaperDescription(e.target.value.slice(0, 250))}
                    placeholder="请输入试卷说明"
                    className="w-full min-h-[90px] border border-neutral-200 rounded-[4px] p-3 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 resize-y bg-white"
                  />
                  <div className="text-[10px] text-neutral-400 font-mono text-right mt-1">
                    {paperDescription.length}/250
                  </div>
                </div>
              </div>

              {/* 试卷类型 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  试卷类型 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex gap-6 items-center w-full">
                  {['作业', '考试'].map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                      <input
                        type="radio"
                        name="paperType"
                        value={t}
                        checked={paperType === t}
                        onChange={() => setPaperType(t)}
                        className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                      />
                      <span className="group-hover:text-[#fa541c] transition-colors font-medium">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 试题配置 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right">
                  试题配置 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex gap-6 items-center w-full">
                  {['随机抽题', '手动抽题', '千人千卷'].map((m) => (
                    <label key={m} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                      <input
                        type="radio"
                        name="paperSelectionMethod"
                        value={m}
                        checked={paperSelectionMethod === m}
                        onChange={() => setPaperSelectionMethod(m)}
                        className="w-4 h-4 text-[#fa541c] accent-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                      />
                      <span className="group-hover:text-[#fa541c] transition-colors font-medium">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 试题配置 */}
              {(paperSelectionMethod === '随机抽题' || paperSelectionMethod === '千人千卷') ? (
                <>
                  {/* 所属试题库 */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      所属试题库 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div ref={bankDropdownRef} className="relative w-full text-xs">
                      <div
                        onClick={() => setIsQuestionBankDropdownOpen(!isQuestionBankDropdownOpen)}
                        className={cn(
                          "min-h-[36px] w-full border border-neutral-200 rounded px-3.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all bg-white cursor-pointer select-none",
                          isQuestionBankDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                        )}
                      >
                        {selectedQuestionBanks.length === 0 ? (
                          <span className="text-neutral-400 select-none">请选择所属题库</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 items-center w-full pr-8">
                            {selectedQuestionBanks.map(bankName => (
                              <span
                                key={bankName}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50/60 border border-orange-100/70 text-xs text-[#fa541c] font-medium animate-in fade-in zoom-in-95 duration-100"
                              >
                                <span>{bankName}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedQuestionBanks(selectedQuestionBanks.filter(b => b !== bankName));
                                  }}
                                  className="hover:bg-[#fa541c]/10 rounded p-0.5 transition-colors cursor-pointer text-current flex items-center justify-center border-0 bg-transparent"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                          <ChevronDown 
                            className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isQuestionBankDropdownOpen && "rotate-180")} 
                          />
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      {isQuestionBankDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {['人工智能通识D-uni', '深度学习基础题库', '大语言模型进阶题库'].map(bankName => {
                              const isSelected = selectedQuestionBanks.includes(bankName);
                              return (
                                <div
                                  key={bankName}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedQuestionBanks(selectedQuestionBanks.filter(b => b !== bankName));
                                    } else {
                                      setSelectedQuestionBanks([...selectedQuestionBanks, bankName]);
                                    }
                                  }}
                                  className={cn(
                                    "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                    isSelected 
                                      ? "bg-orange-50 text-[#fa541c] font-bold"
                                      : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                                  )}
                                >
                                  <span>{bankName}</span>
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

                  {/* 选择题型 */}
                  {selectedQuestionBanks.length > 0 && (
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                      <label className="text-[13px] font-bold text-[#262626] text-right">
                        选择题型
                      </label>
                      <div className="flex items-center gap-3 w-full text-left">
                        {/* Dropdown Menu Select */}
                        <div ref={addTypeDropdownRef} className="relative w-48 text-xs">
                          <div
                            onClick={() => setIsAddTypeDropdownOpen(!isAddTypeDropdownOpen)}
                            className={cn(
                              "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                              isAddTypeDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                            )}
                          >
                            <span className="text-neutral-700 font-medium">
                              {selectedAddType}
                            </span>
                            <ChevronDown 
                              className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isAddTypeDropdownOpen && "rotate-180")} 
                            />
                          </div>

                          {isAddTypeDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[150] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                {['单选题', '多选题', '判断题', '填空题', '简答题', '实训题'].map(type => {
                                  const isSelected = selectedAddType === type;
                                  return (
                                    <div
                                      key={type}
                                      onClick={() => {
                                        setSelectedAddType(type);
                                        setIsAddTypeDropdownOpen(false);
                                      }}
                                      className={cn(
                                        "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                        isSelected 
                                          ? "bg-orange-50 text-[#fa541c] font-bold"
                                          : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                                      )}
                                    >
                                      <span>{type}</span>
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

                        {/* Add Button */}
                        <Button 
                          type="button"
                          onClick={() => {
                            handleAddTypeSection(selectedAddType);
                          }}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-4 rounded-[4px] border-0 cursor-pointer shadow-sm text-xs flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          添加题型
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 抽题规则表 */}
                  {selectedQuestionBanks.length > 0 && typeOrder.length > 0 && (
                    <div className="col-span-2 space-y-6 pt-2 w-full text-left">
                      <div className="border-t border-neutral-100 pb-2"></div>
                    
                    {typeOrder.map((type) => {
                      const rulesOfType = drawRules.filter(r => r.type === type);
                      return (
                        <div key={type} className="border border-neutral-200 rounded-[8px] p-4 bg-white space-y-4 shadow-sm w-full">
                          {/* Header with Title and Buttons */}
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                            <span className="text-[14px] font-bold text-neutral-800">{type}</span>
                            <div className="flex items-center gap-2">
                              <Button 
                                type="button" 
                                onClick={() => {
                                  setRuleFormTag('标签1');
                                  setRuleFormDifficulty('容易');
                                  setAddRuleTypeTarget(type);
                                }}
                                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-7 text-[11px] font-bold px-3 rounded-[4px] border-0 cursor-pointer shadow-sm flex items-center gap-1 transition-all"
                              >
                                <Plus className="w-3 h-3" />
                                添加规则
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => handleDeleteTypeSection(type)}
                                className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                                删除题型
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => handleMoveTypeUp(type)}
                                className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                              >
                                <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                                上移
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => handleMoveTypeDown(type)}
                                className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                              >
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                                下移
                              </Button>
                            </div>
                          </div>

                          {/* Table */}
                          <div className="border border-neutral-200 rounded-[4px] relative">
                            <table className="w-full text-left border-collapse text-[12px] whitespace-nowrap">
                              <thead>
                                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 font-bold select-none">
                                  <th className="p-3 w-44">抽取标签</th>
                                  <th className="p-3 w-28">难易程度</th>
                                  <th className="p-3 w-24 text-center">抽取数量</th>
                                  <th className="p-3 w-24 text-center">最多可抽</th>
                                  <th className="p-3 w-24 text-center">分值</th>
                                  <th className="p-3 w-20 text-center">总分</th>
                                  <th className="p-3 w-20 text-center">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rulesOfType.map((rule) => (
                                  <tr key={rule.id} className="border-b border-neutral-100 bg-white hover:bg-neutral-50/30 transition-colors text-[12px]">
                                    {/* 抽取标签 */}
                                    <td className="p-3 w-44 text-neutral-700 font-medium">
                                      {rule.tag}
                                    </td>
                                    {/* 难易程度 */}
                                    <td className="p-3 w-28 text-neutral-600">
                                      {rule.difficulty}
                                    </td>
                                    {/* 抽取数量 */}
                                    <td className="p-3 w-24">
                                      <input 
                                        type="number"
                                        min={0}
                                        value={rule.count === '' ? '' : rule.count}
                                        onChange={(e) => {
                                          const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0);
                                          handleUpdateRule(rule.id, 'count', val);
                                        }}
                                        placeholder="0"
                                        className="border border-neutral-200 rounded-[4px] px-2 py-1 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 w-full text-center"
                                      />
                                    </td>
                                    {/* 最多可抽 */}
                                    <td className="p-3 w-24 text-center text-neutral-700 font-bold font-mono">
                                      {rule.maxAvailable}
                                    </td>
                                    {/* 分值 */}
                                    <td className="p-3 w-24">
                                      <input 
                                        type="number"
                                        min={0}
                                        value={rule.score === '' ? '' : rule.score}
                                        onChange={(e) => {
                                          const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0);
                                          handleUpdateRule(rule.id, 'score', val);
                                        }}
                                        placeholder="0"
                                        className="border border-neutral-200 rounded-[4px] px-2.5 py-1 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 w-full text-center"
                                      />
                                    </td>
                                    {/* 总分 */}
                                    <td className="p-3 w-20 text-center text-neutral-700 font-bold font-mono">
                                      {Number(rule.count) && Number(rule.score) ? Number(rule.count) * Number(rule.score) : 0}
                                    </td>
                                    {/* 操作 - 移除 */}
                                    <td className="p-3 w-20 text-center">
                                      <button 
                                        type="button" 
                                        onClick={() => handleRemoveRule(rule.id)}
                                        className="text-[#fa541c] hover:text-[#e84a15] font-bold bg-transparent border-0 cursor-pointer p-0 text-xs transition-colors"
                                      >
                                        移除
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {rulesOfType.length === 0 && (
                                  <tr>
                                    <td colSpan={7} className="p-8 text-center text-neutral-400 select-none bg-neutral-50/10 text-xs">
                                      暂无抽题规则，请点击右上角【添加规则】添加
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}



                    {/* Bottom Summary */}
                    <div className="border border-neutral-200/80 rounded-[8px] p-5 mt-6 w-full max-w-[320px] text-left bg-white shadow-sm space-y-4">
                      {/* Question Types List */}
                      <div className="space-y-3.5 w-full">
                        {typeOrder.map(type => {
                          const typeRules = drawRules.filter(r => r.type === type);
                          const typeCount = typeRules.reduce((sum, r) => sum + (Number(r.count) || 0), 0);
                          const typeScore = typeRules.reduce((sum, r) => sum + ((Number(r.count) || 0) * (Number(r.score) || 0)), 0);
                          return (
                            <div key={type} className="flex justify-between items-center text-xs font-bold text-neutral-855">
                              <span>{type}</span>
                              <span className="text-neutral-500 font-semibold">
                                共 {typeCount} 题，共 {typeScore.toFixed(1)} 分
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Divider Line */}
                      <div className="border-t border-neutral-100 w-full"></div>

                      {/* Overall Totals */}
                      <div className="space-y-1">
                        <div className="text-[20px] font-black text-[#fa541c] leading-none">
                          试卷总分{displayScore.toFixed(1)}分
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">
                          共 {displayCount} 道题
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
              ) : (
                <>
                  {/* 试题配置 - 添加试题按钮 row */}
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-[13px] font-bold text-[#262626] text-right">
                      配置 <span className="text-[#fa541c]">*</span>
                    </label>
                    <div className="flex justify-start w-full">
                      <Button
                        type="button"
                        onClick={() => setIsConfigModalOpen(true)}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        添加试题
                      </Button>
                    </div>
                  </div>

                  {/* 手动选题题型卡片列表 - 放在 root 层级以铺满宽度 */}
                  {confirmedQuestions.length > 0 && (
                    <div className="col-span-2 space-y-6 pt-2 w-full text-left">
                      <div className="border-t border-neutral-100 pb-2"></div>
                      {manualTypeOrder
                        .filter(type => confirmedQuestions.some(q => q.type === type))
                        .map((type) => {
                          const questionsOfType = confirmedQuestions.filter(q => q.type === type);
                          return (
                            <div key={type} className="border border-neutral-200 rounded-[8px] p-4 bg-white space-y-4 shadow-sm w-full">
                              {/* Header with Title and Buttons */}
                              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                                <span className="text-[14px] font-bold text-neutral-800">{type}</span>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => handleRemoveManualTypeSection(type)}
                                    className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                                    删除题型
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => handleMoveManualTypeUp(type)}
                                    className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                                    上移
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => handleMoveManualTypeDown(type)}
                                    className="border border-neutral-200 text-neutral-600 hover:text-neutral-800 bg-white hover:bg-neutral-50 h-7 text-[11px] font-medium px-2 rounded-[4px] cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                                    下移
                                  </Button>
                                </div>
                              </div>

                              {/* Table */}
                              <div className="border border-neutral-200 rounded-[4px] relative">
                                <table className="w-full text-left border-collapse text-[12px] whitespace-nowrap">
                                  <thead>
                                    <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 font-bold select-none">
                                      <th className="p-3">试题名称</th>
                                      <th className="p-3 w-48">所属试题库</th>
                                      <th className="p-3 w-32 text-center">分值</th>
                                      <th className="p-3 w-24 text-center">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {questionsOfType.map((q) => {
                                      const score = manualTypeScores[q.type] !== undefined ? manualTypeScores[q.type] : (q.type === '单选题' || q.type === '多选题' ? '3' : '0');
                                      return (
                                        <tr key={q.id} className="border-b border-neutral-100 bg-white hover:bg-neutral-50/30 transition-colors text-[12px]">
                                          {/* 试题名称 */}
                                          <td className="p-3 text-neutral-700 font-medium max-w-[350px] truncate" title={q.name}>
                                            {q.name}
                                          </td>
                                          {/* 所属试题库 */}
                                          <td className="p-3 w-48 text-neutral-600 truncate" title={q.bank}>
                                            {q.bank}
                                          </td>
                                          {/* 分值 */}
                                          <td className="p-3 w-32 text-center text-neutral-700 font-medium">
                                            {score || '0'}
                                          </td>
                                          {/* 操作 - 移除 */}
                                          <td className="p-3 w-24 text-center">
                                            <button 
                                              type="button" 
                                              onClick={() => handleRemoveConfirmedQuestion(q.id)}
                                              className="text-[#fa541c] hover:text-[#e84a15] font-bold bg-transparent border-0 cursor-pointer p-0 text-xs transition-colors"
                                            >
                                              移除
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}

                      {/* Bottom Summary for Manual Selection */}
                      <div className="border border-neutral-200/80 rounded-[8px] p-5 mt-6 w-full max-w-[420px] text-left bg-white shadow-sm space-y-4">
                        {/* Question Types List */}
                        <div className="space-y-3.5 w-full">
                          {manualTypeOrder
                            .filter(type => confirmedQuestions.some(q => q.type === type))
                            .map(type => {
                              const qs = confirmedQuestions.filter(q => q.type === type);
                              const typeCount = qs.length;
                              const scoreVal = parseFloat(manualTypeScores[type]) || 0;
                              const typeScore = typeCount * scoreVal;
                              return (
                                <div key={type} className="flex justify-between items-center text-xs font-bold text-neutral-800">
                                  <span className="w-16 shrink-0">{type}</span>
                                  <div className="flex items-center justify-end gap-3 text-neutral-500 font-semibold flex-1">
                                    <span>共 {typeCount} 题，共 {typeScore.toFixed(1)} 分</span>
                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                      <span className="text-[11px] text-neutral-450 font-medium">每题</span>
                                      <input 
                                        type="text"
                                        value={manualTypeScores[type] || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          if (/^\d*\.?\d*$/.test(val)) {
                                            setManualTypeScores(prev => ({
                                              ...prev,
                                              [type]: val
                                            }));
                                          }
                                        }}
                                        placeholder="请输入"
                                        className="border border-neutral-200 rounded-[4px] px-1 py-0.5 text-xs font-normal focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-800 w-14 text-center"
                                      />
                                      <span className="text-[11px] text-neutral-450 font-medium">分</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {/* Divider Line */}
                        <div className="border-t border-neutral-100 w-full"></div>

                        {/* Overall Totals */}
                        <div className="space-y-1">
                          <div className="text-[20px] font-black text-[#fa541c] leading-none">
                            试卷总分{displayScore.toFixed(1)}分
                          </div>
                          <div className="text-xs text-neutral-400 font-medium">
                            共 {displayCount} 道题
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </>
              )}




            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 shrink-0">
              <Button 
                onClick={handleCloseCreateDrawer}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSavePaper}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确 定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看试卷 Drawer */}
      {viewingPaper && view !== 'preview' && (
        <div 
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setViewingPaper(null)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 text-left shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded-[4px] text-[11px] font-bold">
                  {viewingPaper.type}
                </span>
                <h2 className="text-[15px] font-bold text-neutral-800">查看试卷详情</h2>
              </div>
              <button 
                onClick={() => setViewingPaper(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable View */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white text-left">
              {/* Paper Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">试卷名称：</label>
                <div className="text-sm font-bold text-neutral-800 border border-neutral-100 bg-neutral-50/30 rounded-xl p-3.5 leading-relaxed shadow-sm">
                  {viewingPaper.name}
                </div>
              </div>

              {/* Paper Description */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">试卷说明：</label>
                <div className="text-xs text-neutral-700 bg-neutral-50/30 border border-neutral-100 rounded-xl p-3.5 leading-relaxed shadow-sm">
                  {viewingPaper.description}
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">题目总数</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg font-bold shadow-sm">{viewingPaper.questionCount} 道题</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">包含题型</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg font-bold truncate shadow-sm" title={viewingPaper.types}>{viewingPaper.types}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">试卷状态</label>
                  <p className="text-xs text-green-600 bg-green-50/50 border border-green-100 px-3 py-1.5 rounded-lg font-bold shadow-sm text-center">{viewingPaper.status}</p>
                </div>
              </div>

              {/* Objective Question Detail Card */}
              <div className="bg-[#fff2e8]/20 border border-[#ffbb96]/40 rounded-xl p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-bold text-[#fa541c] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                  <span>客观题配置详情</span>
                </h4>
                <div className="space-y-3.5 text-xs text-neutral-600 leading-relaxed bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                  <p className="font-semibold text-neutral-800">1. 客观题配置：{viewingPaper.selectionMethod || '固定选题'}</p>
                  <p>2. 客观题题量：<span className="font-bold text-[#fa541c]">{viewingPaper.questionCount}</span> 道，满分 <span className="font-bold text-[#fa541c]">100</span> 分</p>
                  <p>3. 答题限制时间：<span className="font-bold text-neutral-800">120</span> 分钟</p>
                  <p className="text-[11px] text-neutral-400 font-semibold">（客观题提交即评分，不支持二次更改或暂停时间）</p>
                </div>
              </div>

              {/* Creator details */}
              <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-4 text-xs text-neutral-400">
                <p className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> 创建人：<span className="text-neutral-700 font-bold">{viewingPaper.creator}</span></p>
                <p className="flex items-center gap-1"><Settings className="w-3.5 h-3.5" /> 更新时间：<span className="text-neutral-700 font-bold">{viewingPaper.updateTime}</span></p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end bg-neutral-50/50 shrink-0">
              <Button 
                onClick={() => setViewingPaper(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 配置试题 Modal Dialog */}
      {isConfigModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-[1.5px] p-4 animate-fade-in"
          onClick={() => setIsConfigModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[1150px] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] border border-neutral-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 text-left shrink-0">
              <h3 className="text-sm font-bold text-neutral-855">配置试题</h3>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar bg-white text-left">
              {/* Action Bar */}
              <div className="flex justify-between items-center gap-4">
                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入要搜索的内容"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-full bg-white border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
                  />
                </div>
                <Button 
                  onClick={() => navigate('/teacher/questions', { state: { openCreateQuestion: true } })}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1 shadow-sm h-8 rounded-[4px] border-0 px-3.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 新建试题
                </Button>
              </div>

              {/* Table wrapper with custom styling matching Question management table (no shadow) */}
              <div className="border border-neutral-200 bg-white rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px] whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-bold">
                        <th className="py-2.5 pl-6 pr-4 w-12 text-center bg-neutral-50/30">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedConfigQuestions.length === filteredConfigQuestions.length) {
                                setSelectedConfigQuestions([]);
                              } else {
                                setSelectedConfigQuestions(filteredConfigQuestions.map(q => q.id));
                              }
                            }}
                            className={cn(
                              "w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                              selectedConfigQuestions.length === filteredConfigQuestions.length
                                ? "bg-[#fa541c] border-[#fa541c] text-white"
                                : "border-neutral-300 hover:border-[#fa541c] bg-white"
                            )}
                          >
                            {selectedConfigQuestions.length === filteredConfigQuestions.length && <span className="text-[8px] font-bold">✓</span>}
                          </button>
                        </th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">试题名称</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">所属题库</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">题型</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">状态</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">来源</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">难度</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">标签</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">创建人</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">更新时间</th>
                        <th className="py-2.5 px-4 bg-neutral-50/30">试题范围</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConfigQuestions.map((q) => {
                        const isSelected = selectedConfigQuestions.includes(q.id);
                        return (
                          <tr 
                            key={q.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedConfigQuestions(selectedConfigQuestions.filter(id => id !== q.id));
                              } else {
                                setSelectedConfigQuestions([...selectedConfigQuestions, q.id]);
                              }
                            }}
                            className={cn(
                              "border-b border-neutral-100 hover:bg-neutral-50/20 transition-colors text-neutral-700 font-medium bg-white cursor-pointer select-none",
                              isSelected ? "bg-orange-50/20" : ""
                            )}
                          >
                            <td className="py-2.5 pl-6 pr-4 text-center w-12" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedConfigQuestions(selectedConfigQuestions.filter(id => id !== q.id));
                                  } else {
                                    setSelectedConfigQuestions([...selectedConfigQuestions, q.id]);
                                  }
                                }}
                                className={cn(
                                  "w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                                  isSelected
                                    ? "bg-[#fa541c] border-[#fa541c] text-white"
                                    : "border-neutral-300 hover:border-[#fa541c] bg-white"
                                )}
                              >
                                {isSelected && <span className="text-[8px] font-bold">✓</span>}
                              </button>
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-neutral-800 max-w-[180px] truncate" title={q.name}>{q.name}</td>
                            <td className="py-2.5 px-4 text-neutral-500 max-w-[120px] truncate" title={q.bank}>{q.bank}</td>
                            <td className="py-2.5 px-4 text-neutral-600">{q.type}</td>
                            <td className="py-2.5 px-4">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] border",
                                q.status === '启用' ? "bg-green-50 text-green-600 border-green-200 font-bold" : "bg-neutral-50 text-neutral-450 border-neutral-200 font-medium"
                              )}>
                                {q.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-neutral-650">{q.source}</td>
                            <td className="py-2.5 px-4">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                (q.difficulty === '容易' || q.difficulty === '较易') && "bg-green-50 text-green-600 border-green-150",
                                q.difficulty === '中等' && "bg-orange-50 text-[#fa541c] border-orange-150",
                                (q.difficulty === '困难' || q.difficulty === '较难') && "bg-red-50 text-red-600 border-red-150"
                              )}>
                                {q.difficulty}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] font-medium" title={q.tag}>{q.tag || '-'}</span>
                            </td>
                            <td className="py-2.5 px-4 text-neutral-600">{q.creator}</td>
                            <td className="py-2.5 px-4 text-neutral-400 font-mono">{q.time}</td>
                            <td className="py-2.5 px-4">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                                q.scope === '平台' && "bg-orange-50 text-[#fa541c] border-orange-200",
                                q.scope === '租户' && "bg-blue-50 text-blue-600 border-blue-200",
                                q.scope === '私有' && "bg-neutral-50 text-neutral-500 border-neutral-200"
                              )}>
                                {q.scope}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination inside Modal - styled matching Questions page pagination (no shadow) */}
                <div className="flex items-center justify-end py-2.5 px-4 gap-4 bg-white">
                  <span className="text-[13px] text-neutral-500">共 {filteredConfigQuestions.length} 条</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white" disabled>&lt;</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-white">&gt;</Button>
                  </div>
                  <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 font-medium bg-white">
                    <option>10 条/页</option>
                    <option>20 条/页</option>
                    <option>50 条/页</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50 shrink-0">
              <Button 
                onClick={() => setIsConfigModalOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmSelections}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定选择
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 申请公开试卷 Drawer/Modal */}
      {isApplyPublicModalOpen && paperToApplyPublic && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => !isApplyingPublic && setIsApplyPublicModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-[#f0f0f0] animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0 text-left">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                申请公开试卷
              </h2>
              <button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
                disabled={isApplyingPublic}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px] text-left">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后可用于租户/平台组卷或班级分发</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    提交申请后，超管将从 <strong>试卷完整性、题目结构、分值合理性、参考价值</strong> 四个维度进行审核。审核通过后将进入公共试卷库。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">试卷名称</label>
                  <input 
                    type="text" 
                    value={paperToApplyPublic.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有教师可见并引用' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户教师可见并引用' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => setApplyPublicRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyPublicRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <span className={cn("font-bold text-[13px]", applyPublicRange === opt.key ? "text-[#fa541c]" : "text-[#262626]")}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 leading-normal">{opt.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    申请说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={applyPublicReason}
                    onChange={(e) => setApplyPublicReason(e.target.value)}
                    placeholder="请描述该试卷的申请公开原因及相关说明..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                disabled={isApplyingPublic}
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmitApplyPublic} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold flex items-center"
                disabled={isApplyingPublic}
              >
                {isApplyingPublic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    提交中...
                  </>
                ) : (
                  '提交审核申请'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 删除题型确认弹窗 */}
      {deleteTypeTarget && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[1.5px] p-4 animate-fade-in"
          onClick={() => setDeleteTypeTarget(null)}
        >
          <div 
            className="bg-white w-full max-w-[420px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-neutral-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-neutral-800">确认删除题型</h3>
                <p className="text-xs text-neutral-500 leading-relaxed px-4">
                  确定要删除【<span className="font-bold text-red-500">{deleteTypeTarget}</span>】及该题型下的所有抽取规则吗？
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2.5 shrink-0">
              <Button 
                onClick={() => setDeleteTypeTarget(null)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-8 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  setTypeOrder(prev => prev.filter(t => t !== deleteTypeTarget));
                  setDrawRules(prev => prev.filter(r => r.type !== deleteTypeTarget));
                  setDeleteTypeTarget(null);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-4 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定删除
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 添加规则弹窗 */}
      {addRuleTypeTarget && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[1.5px] p-4 animate-fade-in"
          onClick={() => setAddRuleTypeTarget(null)}
        >
          <div 
            className="bg-white w-full max-w-[460px] rounded-xl shadow-2xl flex flex-col border border-neutral-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 text-left shrink-0 rounded-t-xl">
              <h3 className="text-sm font-bold text-neutral-800">添加抽题规则（{addRuleTypeTarget}）</h3>
              <button 
                onClick={() => setAddRuleTypeTarget(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5 text-left bg-white flex-1 text-xs">
              {/* 抽取标签 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4 relative">
                <label className="text-xs font-bold text-neutral-600 text-right">
                  抽取标签 <span className="text-[#fa541c]">*</span>
                </label>
                <div ref={modalTagDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => {
                      setIsModalTagDropdownOpen(!isModalTagDropdownOpen);
                      setIsModalDiffDropdownOpen(false);
                    }}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                      isModalTagDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className="text-neutral-700 font-medium">
                      {ruleFormTag}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isModalTagDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {isModalTagDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[210] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
                        {['选择全部', '标签1', '标签2', '标签3', '深度学习', '人工智能', '大语言模型'].map(tagOption => {
                          const isSelected = ruleFormTag === tagOption;
                          return (
                            <div
                              key={tagOption}
                              onClick={() => {
                                setRuleFormTag(tagOption);
                                setIsModalTagDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{tagOption}</span>
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

              {/* 难易程度 */}
              <div className="grid grid-cols-[80px_1fr] items-center gap-4 relative">
                <label className="text-xs font-bold text-neutral-600 text-right">
                  难易程度 <span className="text-[#fa541c]">*</span>
                </label>
                <div ref={modalDiffDropdownRef} className="relative w-full text-xs">
                  <div
                    onClick={() => {
                      setIsModalDiffDropdownOpen(!isModalDiffDropdownOpen);
                      setIsModalTagDropdownOpen(false);
                    }}
                    className={cn(
                      "h-[36px] w-full border border-neutral-200 rounded px-3.5 py-2 flex items-center justify-between transition-all bg-white cursor-pointer select-none",
                      isModalDiffDropdownOpen ? "border-[#fa541c] ring-1 ring-[#fa541c]" : "hover:border-[#fa541c]"
                    )}
                  >
                    <span className="text-neutral-700 font-medium">
                      {ruleFormDifficulty}
                    </span>
                    <ChevronDown 
                      className={cn("w-3.5 h-3.5 transition-transform duration-200 text-neutral-400", isModalDiffDropdownOpen && "rotate-180")} 
                    />
                  </div>

                  {isModalDiffDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-[210] overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="max-h-[160px] overflow-y-auto custom-scrollbar">
                        {['选择全部', '容易', '较易', '中等', '较难', '困难'].map(diffOption => {
                          const isSelected = ruleFormDifficulty === diffOption;
                          return (
                            <div
                              key={diffOption}
                              onClick={() => {
                                setRuleFormDifficulty(diffOption);
                                setIsModalDiffDropdownOpen(false);
                              }}
                              className={cn(
                                "px-4 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between",
                                isSelected 
                                  ? "bg-orange-50 text-[#fa541c] font-bold"
                                  : "text-neutral-700 hover:bg-orange-50/40 hover:text-neutral-900"
                              )}
                            >
                              <span>{diffOption}</span>
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-[#f9fafb] flex justify-end gap-2.5 shrink-0 rounded-b-xl">
              <Button 
                onClick={() => setAddRuleTypeTarget(null)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-8 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  handleAddRule(addRuleTypeTarget, ruleFormTag, ruleFormDifficulty);
                  setAddRuleTypeTarget(null);
                }}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-8 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确 定
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

