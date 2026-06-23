import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  FileText, 
  FileQuestion, 
  ChevronRight, 
  X, 
  ChevronLeft, 
  Calendar, 
  User, 
  Settings, 
  ClipboardList,
  Check,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [expandedConfigRow, setExpandedConfigRow] = useState<number | null>(null);

  // New Paper form states
  const [paperName, setPaperName] = useState('');
  const [paperDescription, setPaperDescription] = useState('');
  const [paperType, setPaperType] = useState('作业');
  const [paperScope, setPaperScope] = useState('私有');
  const [paperStatus, setPaperStatus] = useState('启用');

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

  const availableQuestions = [
    { 
      id: 1, 
      name: '列举AIGC在办公场景下的三种典型应用', 
      bank: 'Mo 体验课程试题库', 
      type: '简答题', 
      difficulty: '容易', 
      tag: '生成式AI与大模型应用', 
      grading: '人工评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:55',
      detailText: '列举AIGC的三种主要应用领域。',
      analysis: '考察AIGC应用范围'
    },
    { 
      id: 2, 
      name: '你认为人工智能是否会完全取代人类脑力劳动？请简述理由', 
      bank: 'Mo 体验课程试题库', 
      type: '思考题', 
      difficulty: '困难', 
      tag: '人工智能与大模型', 
      grading: '人工评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:54',
      detailText: '人工智能在特定领域能大幅超越人类，但缺乏情感、创造力与通用逻辑能力，请论述其取代极限。',
      analysis: '论述AI对劳动力市场及创造性工作的影响与局限性'
    },
    { 
      id: 3, 
      name: '机器学习中监督学习与无监督学习的核心区别是（ ）。', 
      bank: 'Mo 体验课程试题库', 
      type: '填空题', 
      difficulty: '中等', 
      tag: '机器学习基础', 
      grading: '自动评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:53',
      detailText: '监督学习依赖带标签的训练数据进行拟合预测，无监督学习对未标记数据寻找内部结构关系。',
      analysis: '考察监督学习与无监督学习的核心概念区别'
    },
    { 
      id: 4, 
      name: '人工智能发展的三个历史阶段分别是自动控制、知识工程和（ ）。', 
      bank: 'Mo 体验课程试题库', 
      type: '填空题', 
      difficulty: '容易', 
      tag: '人工智能与大模型', 
      grading: '自动评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:51',
      detailText: '三个阶段指自动控制（20世纪50年代）、专家系统与知识工程（70-80年代）、深度学习与连接主义（21世纪至今）。',
      analysis: '考察人工智能发展简史与重要技术节点'
    },
    { 
      id: 5, 
      name: '神经网络中的激活函数主要作用是引入非线性因素', 
      bank: 'Mo 体验课程试题库', 
      type: '单选题', 
      difficulty: '较易', 
      tag: '神经网络与深度学习', 
      grading: '自动评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:51',
      detailText: '如果没有激活函数，无论神经网络有多少层，它都只能表示线性映射，限制了其复杂特征学习能力。',
      analysis: '考察激活函数的作用和神经网络多层表示定理'
    },
    { 
      id: 6, 
      name: '机器学习基础期末选择题-随机森林的基分类器是（ ）。', 
      bank: 'Mo 体验课程试题库', 
      type: '单选题', 
      difficulty: '中等', 
      tag: '机器学习基础', 
      grading: '自动评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:50',
      detailText: '随机森林(Random Forest)通过集成学习的Bagging方法，将多个决策树(Decision Tree)作为基分类器。',
      analysis: '考察随机森林(Random Forest)的原理及基分类器构成'
    },
    { 
      id: 7, 
      name: '机器学习多选题：关于支持向量机(SVM)，以下说法正确的有', 
      bank: 'Mo 体验课程试题库', 
      type: '多选题', 
      difficulty: '较难', 
      tag: '人工智能与大模型', 
      grading: '自动评分', 
      scope: '未公开', 
      creator: '孙昕', 
      time: '2026/03/19 15:13:49',
      detailText: '支持向量机旨在寻找一个超平面，以最大化分类间隔。核函数用于解决非线性可分问题，支持向量是决定超平面的样本。',
      analysis: '考察SVM的决策边界、最大化间隔、支持向量以及核函数概念'
    }
  ];

  const [papersList, setPapersList] = useState([
    {
      id: 1,
      name: 'AI 通识第一课测验',
      description: '用于「Mo 体验课程」的“AI 通识第一课”章节测验试卷',
      questionCount: 5,
      types: '单选题',
      type: '作业',
      status: '启用',
      creator: '孙昕',
      updateTime: '2026/02/11'
    },
    {
      id: 2,
      name: '机器学习基础期中测验',
      description: '检验学生对线性回归 and 逻辑回归 of 掌握',
      questionCount: 20,
      types: '单选题, 简答题',
      type: '考试',
      status: '启用',
      creator: '张老师',
      updateTime: '2026/02/12'
    }
  ]);

  const totalObjCount = mcCount + msCount + tfCount + fbCount + saCount + thCount + pgCount;
  const totalObjScore = (mcCount * mcScore) + (msCount * msScore) + (tfCount * tfScore) + (fbCount * fbScore) + (saCount * saScore) + (thCount * thScore) + (pgCount * pgScore);
  
  const totalPracCount = sxCount;
  const totalPracScore = sxCount * sxScore;

  const totalCount = totalObjCount + totalPracCount;
  const totalScore = totalObjScore + totalPracScore;

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPapers(papersList.map(p => p.id));
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

  const handleSavePaper = () => {
    if (!paperName.trim()) {
      alert('请输入试卷名称！');
      return;
    }

    const newPaper = {
      id: Date.now(),
      name: paperName,
      description: paperDescription || '暂无试卷说明描述',
      questionCount: totalCount || 10,
      types: totalObjCount > 0 ? '单选题, 多选题' : '实训题',
      type: paperType,
      status: paperStatus,
      creator: '孙昕',
      updateTime: new Date().toLocaleDateString('zh-CN').replace(/-/g, '/')
    };

    setPapersList([newPaper, ...papersList]);
    setIsCreateOpen(false);

    // Reset Form
    setPaperName('');
    setPaperDescription('');
    setPaperType('作业');
    setPaperScope('私有');
    setPaperStatus('启用');
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

  const FilterIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div className="flex items-end gap-4">
              <h1 className="text-xl font-bold text-neutral-900">试卷管理</h1>
              <p className="text-sm text-neutral-500 mb-0.5">新建试卷前请先创建可用试题，试卷“启用”后即可用于课程作业或章节测验</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {selectedPapers.length > 0 && (
                <Button variant="outline" className="flex items-center gap-1.5 h-9 rounded border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm">
                  批量删除 ({selectedPapers.length})
                </Button>
              )}
              <Button onClick={() => setIsCreateOpen(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded cursor-pointer border-0 font-bold px-4">
                <Plus className="w-4 h-4" /> 新建试卷
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 font-medium w-12 text-center">
                      <button 
                        type="button"
                        onClick={() => toggleSelectAll(selectedPapers.length !== papersList.length || papersList.length === 0)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                          selectedPapers.length === papersList.length && papersList.length > 0
                            ? "bg-[#fa541c] border-[#fa541c] text-white"
                            : "border-neutral-300 hover:border-[#fa541c] bg-white"
                        )}
                      >
                        {selectedPapers.length === papersList.length && papersList.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    </th>
                    <th className="p-4 font-medium w-10 text-center"></th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">试卷名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                    </th>
                    <th className="p-4 font-medium">试卷说明</th>
                    <th className="p-4 font-medium">题目数量</th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">包含题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">试卷类型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">创建人 <Search className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {papersList.map(p => (
                    <React.Fragment key={p.id}>
                      <tr className={cn(
                        "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px] group",
                        expandedRow === p.id ? "bg-neutral-50/30" : ""
                      )}>
                        <td className="p-4 text-center">
                          <button 
                            type="button"
                            onClick={() => toggleSelect(p.id)}
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                              selectedPapers.includes(p.id)
                                ? "bg-[#fa541c] border-[#fa541c] text-white"
                                : "border-neutral-300 hover:border-[#fa541c] bg-white"
                            )}
                          >
                            {selectedPapers.includes(p.id) && <span className="text-[10px] font-bold">✓</span>}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleRow(p.id)}
                            className="text-neutral-400 hover:text-[#fa541c] transition-colors p-1 cursor-pointer"
                          >
                            <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", expandedRow === p.id && "transform rotate-90 text-[#fa541c]")} />
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="text-neutral-800 max-w-[220px] truncate font-medium" title={p.name}>{p.name}</div>
                        </td>
                        <td className="p-4 text-neutral-500 max-w-[200px] truncate" title={p.description}>{p.description}</td>
                        <td className="p-4 text-neutral-600">{p.questionCount}</td>
                        <td className="p-4 text-neutral-600">{p.types}</td>
                        <td className="p-4 text-neutral-800">{p.type}</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 text-[12px] rounded border", 
                            p.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                          )}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-600">{p.creator}</td>
                        <td className="p-4 text-neutral-500">{p.updateTime}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <button onClick={() => setViewingPaper(p)} className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent border-0 p-0">查看</button>
                            <button className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors bg-transparent border-0 p-0">编辑</button>
                            <button className="text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors bg-transparent border-0 p-0">复制</button>
                            <button onClick={() => setPapersList(papersList.filter(item => item.id !== p.id))} className="text-neutral-400 hover:text-neutral-600 font-bold transition-colors cursor-pointer bg-transparent border-0 p-0">删除</button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Content: 客观题部分左右两边留白大小完全一致 (px-8) 且右侧内容填充满 (w-full) */}
                      {expandedRow === p.id && (
                        <tr className="bg-neutral-50/30 border-b border-neutral-100">
                          <td colSpan={11} className="p-0 whitespace-normal">
                            <div className="py-6 px-8 animate-in fade-in duration-200 w-full">
                              <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm w-full">
                                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-neutral-100/80">
                                  <div className="w-8 h-8 rounded-lg bg-[#fff2e8] flex items-center justify-center">
                                    <FileText className="w-4.5 h-4.5 text-[#fa541c]" />
                                  </div>
                                  <h3 className="text-[15px] font-bold text-neutral-800">客观题配置信息</h3>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x divide-neutral-100">
                                    {/* Left Column */}
                                    <div className="space-y-2">
                                      <h4 className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                                        题量与分值
                                      </h4>
                                      <div className="pl-3.5 space-y-1 text-xs">
                                        <p className="text-neutral-600 font-medium">题目数量：<span className="font-bold text-[#fa541c] text-sm">{p.questionCount}</span> 道</p>
                                        <p className="text-neutral-600 font-medium">试卷分值：<span className="font-bold text-[#fa541c] text-sm">100</span> 分</p>
                                        <p className="text-neutral-400">包含题型：{p.types || '单选题'}</p>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-2 md:pl-6">
                                      <h4 className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                                        答题要求与限制
                                      </h4>
                                      <div className="pl-3.5 space-y-1 text-xs">
                                        <p className="text-neutral-600 font-medium">答题限时：<span className="font-bold text-neutral-800 text-sm">120</span> 分钟</p>
                                        <p className="text-neutral-400 leading-relaxed">客观题需一次性连续作答，中途无法暂停，仅限提交一次，请合理分配时间。</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Button Column */}
                                  <div className="flex-shrink-0 md:pl-6 border-t md:border-t-0 md:border-l border-neutral-100/80 pt-4 md:pt-0 flex items-center justify-center">
                                    <Button 
                                      onClick={() => {
                                        setViewingPaper(p);
                                        setView('preview');
                                      }} 
                                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg shadow-sm shadow-[#fa541c]/25 h-10 font-bold px-6 transition-all cursor-pointer border-0"
                                    >
                                      预览客观题
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end p-4 gap-4 mt-2">
              <span className="text-[13px] text-neutral-500">共 {papersList.length} 条</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm">&gt;</Button>
              </div>
              <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600">
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
                  
                  if (paperNameText.includes('AI 通识') || paperNameText.includes('生成式AI') || paperNameText.includes('大模型')) {
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

      {/* 新建试卷 Drawer (右侧弹出层，参考图2，主题色为橙色) */}
      {isCreateOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsCreateOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h2 className="text-[15px] font-bold text-neutral-850">新建试卷</h2>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
              {/* 试卷名称 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c] font-bold text-sm">*</span> 试卷名称：
                </label>
                <input
                  type="text"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  placeholder="请输入试卷名称"
                  className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800"
                />
              </div>

              {/* 试卷说明 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800">试卷说明：</label>
                <div className="relative">
                  <textarea
                    value={paperDescription}
                    onChange={(e) => setPaperDescription(e.target.value.slice(0, 250))}
                    placeholder="请输入试卷说明"
                    className="w-full min-h-[90px] border border-neutral-200 rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400 text-neutral-800 resize-y"
                  />
                  <div className="text-[10px] text-neutral-400 font-mono text-right mt-1">
                    {paperDescription.length}/250
                  </div>
                </div>
              </div>

              {/* 试卷类型 (改为“作业”与“考试”) */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c] font-bold text-sm">*</span> 试卷类型：
                </label>
                <div className="flex gap-6 items-center pt-1.5">
                  {['作业', '考试'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group text-xs text-neutral-700 select-none">
                      {/* Customized Custom Radio indicator for premium feeling */}
                      <span className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="paperType"
                          value={t}
                          checked={paperType === t}
                          onChange={() => setPaperType(t)}
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          paperType === t 
                            ? "border-[#fa541c] bg-white" 
                            : "border-neutral-300 group-hover:border-[#fa541c]"
                        )}>
                          {paperType === t && (
                            <span className="w-2 h-2 rounded-full bg-[#fa541c]" />
                          )}
                        </span>
                      </span>
                      <span className={cn(
                        "group-hover:text-[#fa541c] transition-colors font-medium text-xs",
                        paperType === t ? "text-[#fa541c]" : "text-neutral-600"
                      )}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 试题配置数据统计 */}
              <div className="space-y-2 pt-1">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c] font-bold text-sm">*</span> 试题配置：
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#fff2e8]/25 border border-[#ffbb96]/35 rounded-xl p-3 text-center transition-all hover:shadow-sm">
                    <p className="text-[10px] text-neutral-500 font-bold">选题数/总分数</p>
                    <p className="text-sm font-black text-[#fa541c] mt-1">{totalCount} / {totalScore}</p>
                  </div>
                  <div className="bg-[#fff2e8]/25 border border-[#ffbb96]/35 rounded-xl p-3 text-center transition-all hover:shadow-sm">
                    <p className="text-[10px] text-neutral-500 font-bold">客观题数/分数</p>
                    <p className="text-sm font-black text-[#fa541c] mt-1">{totalObjCount} / {totalObjScore}</p>
                  </div>
                  <div className="bg-[#fff2e8]/25 border border-[#ffbb96]/35 rounded-xl p-3 text-center transition-all hover:shadow-sm">
                    <p className="text-[10px] text-neutral-500 font-bold">实训题数/分数</p>
                    <p className="text-sm font-black text-[#fa541c] mt-1">{totalPracCount} / {totalPracScore}</p>
                  </div>
                </div>
              </div>

              {/* 客观题配置 (图2) */}
              <div className="border border-neutral-200/90 rounded-xl p-4 bg-white space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-[13px] font-bold text-neutral-850">客观题配置：</span>
                  <Button 
                    onClick={() => {
                      setIsConfigModalOpen(true);
                    }} 
                    className={cn(
                      "h-7 text-[11px] cursor-pointer rounded-lg px-3.5 font-bold shadow-sm transition-all flex items-center justify-center",
                      isObjConfigured
                        ? "bg-[#fa541c] hover:bg-[#e84a15] text-white border-0 shadow-[#fa541c]/15"
                        : "border border-[#fa541c] text-[#fa541c] bg-transparent hover:bg-[#fff2e8]"
                    )}
                  >
                    配置
                  </Button>
                </div>

                <div className="flex items-center gap-6">
                  {['随机选题', '固定选题'].map((sel) => (
                    <label key={sel} className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 select-none group">
                      <span className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="objSelection" 
                          defaultChecked={sel === '固定选题'} 
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          sel === '固定选题' 
                            ? "border-[#fa541c] bg-white" 
                            : "border-neutral-300 group-hover:border-[#fa541c]"
                        )}>
                          {sel === '固定选题' && (
                            <span className="w-2 h-2 rounded-full bg-[#fa541c]" />
                          )}
                        </span>
                      </span>
                      <span className="font-semibold text-xs text-neutral-600 group-hover:text-[#fa541c] transition-colors">{sel}</span>
                    </label>
                  ))}
                </div>

                {/* Table for Config Objective list */}
                <div className="border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500">
                        <th className="p-2.5 font-bold">试题名称</th>
                        <th className="p-2.5 font-bold">所属题库名称</th>
                        <th className="p-2.5 font-bold">题型</th>
                        <th className="p-2.5 font-bold w-12 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedQuestions.length > 0 ? (
                        confirmedQuestions.map((q: any) => (
                          <tr key={q.id} className="border-b border-neutral-100 text-neutral-800 bg-white hover:bg-neutral-50/30 transition-colors">
                            <td className="p-2.5 font-medium max-w-[200px] truncate" title={q.name}>{q.name}</td>
                            <td className="p-2.5 text-neutral-500 max-w-[150px] truncate" title={q.bank}>{q.bank}</td>
                            <td className="p-2.5 text-neutral-600">{q.type}</td>
                            <td className="p-2.5 text-center">
                              <button 
                                onClick={() => handleRemoveConfirmedQuestion(q.id)}
                                className="text-red-500 hover:text-red-700 font-bold bg-transparent border-0 cursor-pointer p-0"
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-b border-neutral-100/50 text-neutral-400">
                          <td colSpan={4} className="p-8 text-center bg-neutral-50/20">
                            <div className="flex flex-col items-center justify-center gap-2">
                              {/* Empty icon */}
                              <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                                <FileQuestion className="w-5 h-5 text-neutral-300" />
                              </div>
                              <span className="text-[11px] font-semibold text-neutral-400 mt-1">暂无试题</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Aligned 2-column Grid list for question types to prevent clutter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-100/80 bg-neutral-50/15 p-2 rounded-xl border border-neutral-100">
                  {[
                    { label: '单选题', count: mcCount, setCount: setMcCount, score: mcScore, setScore: setMcScore },
                    { label: '多选题', count: msCount, setCount: setMsCount, score: msScore, setScore: setMsScore },
                    { label: '判断题', count: tfCount, setCount: setTfCount, score: tfScore, setScore: setTfScore },
                    { label: '填空题', count: fbCount, setCount: setFbCount, score: fbScore, setScore: setFbScore },
                    { label: '简答题', count: saCount, setCount: setSaCount, score: saScore, setScore: setSaScore },
                    { label: '思考题', count: thCount, setCount: setThCount, score: thScore, setScore: setThScore },
                    { label: '编程题', count: pgCount, setCount: setPgCount, score: pgScore, setScore: setPgScore },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs py-1.5 px-3 bg-white rounded-lg hover:bg-neutral-50/40 transition-colors border border-neutral-200/60 shadow-sm">
                      <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                        <span className="font-bold text-neutral-700">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-450 font-semibold text-[10px]">选</span>
                        <input 
                          type="number" 
                          min={0}
                          value={item.count || ''} 
                          onChange={(e) => item.setCount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-11 h-6 border border-neutral-200 rounded text-center bg-white text-neutral-800 text-[11px] font-bold focus:outline-none focus:border-[#fa541c]"
                        />
                        <span className="text-neutral-500 text-[10px]">题</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-450 font-semibold text-[10px]">每</span>
                        <input 
                          type="number" 
                          min={0}
                          value={item.score || ''} 
                          onChange={(e) => item.setScore(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-11 h-6 border border-neutral-200 rounded text-center bg-white text-neutral-800 text-[11px] font-bold focus:outline-none focus:border-[#fa541c]"
                        />
                        <span className="text-neutral-500 text-[10px]">分</span>
                      </div>
                      
                      <div className="text-right w-16 flex-shrink-0 text-[11px]">
                        <span className="text-neutral-400">总 </span>
                        <span className="font-bold text-[#fa541c]">{item.count * item.score}</span>
                        <span className="text-neutral-400 text-[9px]">分</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 实训题配置 */}
              <div className="border border-neutral-200/90 rounded-xl p-4 bg-white space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-[13px] font-bold text-neutral-850">实训题配置：</span>
                  <Button variant="outline" className="h-7 text-[11px] border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] bg-transparent cursor-pointer rounded-lg px-3.5 font-bold shadow-sm transition-all">
                    配置
                  </Button>
                </div>

                <div className="border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500">
                        <th className="p-2.5 font-bold">试题名称</th>
                        <th className="p-2.5 font-bold">所属题库名称</th>
                        <th className="p-2.5 font-bold">题型</th>
                        <th className="p-2.5 font-bold w-12 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-100/50 text-neutral-400">
                        <td colSpan={4} className="p-8 text-center bg-neutral-50/20">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                              <FileQuestion className="w-5 h-5 text-neutral-300" />
                            </div>
                            <span className="text-[11px] font-semibold text-neutral-400 mt-1">暂无试题</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2.5 text-xs pt-1.5">
                  <span className="font-bold text-neutral-700">实训题 选取：</span>
                  <input 
                    type="number" 
                    min={0}
                    value={sxCount || ''} 
                    onChange={(e) => setSxCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-6.5 border border-neutral-200 rounded text-center bg-white text-neutral-800 font-bold focus:outline-none focus:border-[#fa541c]"
                  />
                  <span className="text-neutral-555">题，每题</span>
                  <input 
                    type="number" 
                    min={0}
                    value={sxScore || ''} 
                    onChange={(e) => setSxScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-6.5 border border-neutral-200 rounded text-center bg-white text-neutral-800 font-bold focus:outline-none focus:border-[#fa541c]"
                  />
                  <span className="text-neutral-500">分，总 <span className="font-bold text-[#fa541c]">{sxCount * sxScore}</span> 分</span>
                </div>
              </div>

              {/* 附加分 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                  附加分：
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                </label>
                <div className="flex items-center gap-3 text-xs text-neutral-700">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={useAdditionalCredit}
                      onChange={(e) => setUseAdditionalCredit(e.target.checked)}
                      className="w-4 h-4 rounded text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer"
                    />
                    <span className="font-medium">使用附加分，最高附加</span>
                  </label>
                  <input 
                    type="number" 
                    min={0}
                    disabled={!useAdditionalCredit}
                    value={additionalMaxScore || ''}
                    onChange={(e) => setAdditionalMaxScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-6 border border-neutral-200 rounded text-center py-0.5 bg-white disabled:bg-neutral-100 text-neutral-800 focus:outline-none focus:border-[#fa541c] font-bold"
                  />
                  <span className="text-neutral-500 font-medium">分</span>
                </div>
              </div>

              {/* 权限配置 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c] font-bold text-sm">*</span> 权限：
                </label>
                <div className="flex gap-6 items-center pt-1.5">
                  {['私有', '公开'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group text-xs text-neutral-700 select-none">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="paperScope"
                          value={s}
                          checked={paperScope === s}
                          onChange={() => setPaperScope(s)}
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          paperScope === s 
                            ? "border-[#fa541c] bg-white" 
                            : "border-neutral-300 group-hover:border-[#fa541c]"
                        )}>
                          {paperScope === s && (
                            <span className="w-2 h-2 rounded-full bg-[#fa541c]" />
                          )}
                        </span>
                      </span>
                      <span className={cn(
                        "group-hover:text-[#fa541c] transition-colors font-medium text-xs",
                        paperScope === s ? "text-[#fa541c]" : "text-neutral-600"
                      )}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 状态配置 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c] font-bold text-sm">*</span> 状态：
                </label>
                <div className="flex gap-6 items-center pt-1.5">
                  {['启用', '停用'].map((st) => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer group text-xs text-neutral-700 select-none">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="paperStatus"
                          value={st}
                          checked={paperStatus === st}
                          onChange={() => setPaperStatus(st)}
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          paperStatus === st 
                            ? "border-[#fa541c] bg-white" 
                            : "border-neutral-300 group-hover:border-[#fa541c]"
                        )}>
                          {paperStatus === st && (
                            <span className="w-2 h-2 rounded-full bg-[#fa541c]" />
                          )}
                        </span>
                      </span>
                      <span className={cn(
                        "group-hover:text-[#fa541c] transition-colors font-medium text-xs",
                        paperStatus === st ? "text-[#fa541c]" : "text-neutral-600"
                      )}>{st}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50">
              <Button 
                onClick={() => setIsCreateOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-lg cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSavePaper}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-lg shadow-sm border-0 cursor-pointer"
              >
                确 定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看试卷 Drawer (从右侧弹出查看试卷界面) */}
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
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded text-[11px] font-bold">
                  {viewingPaper.type}
                </span>
                <h2 className="text-[15px] font-bold text-neutral-800">查看试卷详情</h2>
              </div>
              <button 
                onClick={() => setViewingPaper(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable View */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
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
                  <p className="font-semibold text-neutral-800">1. 客观题配置：固定选题</p>
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
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end bg-neutral-50/50">
              <Button 
                onClick={() => setViewingPaper(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-lg shadow-sm border-0 cursor-pointer"
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
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h3 className="text-sm font-bold text-neutral-855">配置试题</h3>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar bg-white">
              {/* Action Bar */}
              <div className="flex justify-end items-center">
                <Button 
                  onClick={() => navigate('/teacher/questions', { state: { openCreateQuestion: true } })}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1 shadow-sm h-8 rounded-lg border-0 px-3.5 text-xs font-bold transition-all cursor-pointer"
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
                        <th className="py-2.5 px-4 w-10 text-center bg-neutral-50/30"></th>
                        <th className="py-2.5 px-4 w-12 text-center bg-neutral-50/30">
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedConfigQuestions.length === availableQuestions.length) {
                                setSelectedConfigQuestions([]);
                              } else {
                                setSelectedConfigQuestions(availableQuestions.map(q => q.id));
                              }
                            }}
                            className={cn(
                              "w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                              selectedConfigQuestions.length === availableQuestions.length
                                ? "bg-[#fa541c] border-[#fa541c] text-white"
                                : "border-neutral-300 hover:border-[#fa541c] bg-white"
                            )}
                          >
                            {selectedConfigQuestions.length === availableQuestions.length && <span className="text-[8px] font-bold">✓</span>}
                          </button>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">试题名称 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">所属题库 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">题型 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">难度 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">标签 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">评分方式 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">试题范围 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">
                          <div className="flex items-center gap-1">创建人 <FilterIcon /></div>
                        </th>
                        <th className="py-2.5 px-4">更新时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableQuestions.map((q) => {
                        const isSelected = selectedConfigQuestions.includes(q.id);
                        const isExpanded = expandedConfigRow === q.id;
                        return (
                          <React.Fragment key={q.id}>
                            <tr className={cn(
                              "border-b border-neutral-100 hover:bg-neutral-50/20 transition-colors text-neutral-700 font-medium bg-white",
                              isSelected ? "bg-orange-50/10" : ""
                            )}>
                              <td className="py-2.5 px-4 text-center">
                                <button 
                                  onClick={() => setExpandedConfigRow(isExpanded ? null : q.id)}
                                  className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all p-0",
                                    isExpanded 
                                      ? "border-[#fa541c] text-[#fa541c] bg-[#fff2e8]/45 font-black" 
                                      : "border-neutral-200 bg-white text-neutral-400 hover:border-[#fa541c] hover:text-[#fa541c]"
                                  )}
                                >
                                  {isExpanded ? '−' : '+'}
                                </button>
                              </td>
                              <td className="py-2.5 px-4 text-center">
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
                                  "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                  (q.difficulty === '初级' || q.difficulty === '容易' || q.difficulty === '较易') && "bg-green-50 text-green-600 border-green-150",
                                  (q.difficulty === '中级' || q.difficulty === '中等') && "bg-orange-50 text-[#fa541c] border-orange-150",
                                  (q.difficulty === '高级' || q.difficulty === '较难' || q.difficulty === '困难') && "bg-red-50 text-red-600 border-red-150"
                                )}>
                                  {q.difficulty}
                                </span>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] font-medium" title={q.tag}>{q.tag}</span>
                              </td>
                              <td className="py-2.5 px-4 text-neutral-600">{q.grading}</td>
                              <td className="py-2.5 px-4">
                                <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-500 rounded text-[10px] font-semibold text-center">{q.scope}</span>
                              </td>
                              <td className="py-2.5 px-4 text-neutral-600">{q.creator}</td>
                              <td className="py-2.5 px-4 text-neutral-400 font-mono">{q.time}</td>
                            </tr>
                            
                            {/* Expanded Configuration Detail Card (图3 - no shadow) */}
                            {isExpanded && (
                              <tr className="bg-neutral-50/15 border-b border-neutral-150">
                                <td colSpan={11} className="p-0 whitespace-normal">
                                  <div className="py-3 pl-16 pr-8 animate-in fade-in duration-200">
                                    <div className="bg-white border border-neutral-100 rounded-xl p-4 space-y-2.5">
                                      <div>
                                        <p className="text-xs font-bold text-neutral-800">{q.detailText}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-neutral-700">答案解析：</p>
                                        <p className="text-[11px] text-neutral-500 font-medium">{q.analysis}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination inside Modal - styled matching Questions page pagination (no shadow) */}
                <div className="flex items-center justify-end py-2.5 px-4 gap-4 bg-white border-t border-neutral-150">
                  <span className="text-[13px] text-neutral-500">共 {availableQuestions.length} 条</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm">&gt;</Button>
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
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50">
              <Button 
                onClick={() => setIsConfigModalOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-lg cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmSelections}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-lg shadow-sm border-0 cursor-pointer"
              >
                确定选择
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
