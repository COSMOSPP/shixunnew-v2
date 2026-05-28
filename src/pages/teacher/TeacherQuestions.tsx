import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Upload, Globe, Search, Brain, HelpCircle, ChevronDown, ChevronUp, Trash2, X, ChevronLeft, Send, MessageSquare, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper component for Rich Text Editor (Edit / Preview)
interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  isCollapsible?: boolean;
  onDelete?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "",
  isCollapsible = false,
  onDelete
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all focus-within:border-[#fa541c]/50">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-neutral-50 px-4 py-2 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          {isCollapsible && (
            <button 
              type="button" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-neutral-400 hover:text-neutral-600 p-0.5"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          <span className="text-[13px] font-bold text-neutral-800 flex items-center">
            {required && <span className="text-[#fa541c] mr-1">*</span>}
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete}
              className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors mr-2"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex bg-neutral-200/60 p-0.5 rounded text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setTab('edit')}
              className={cn("px-2.5 py-0.5 rounded-sm transition-colors", tab === 'edit' ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={cn("px-2.5 py-0.5 rounded-sm transition-colors", tab === 'preview' ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-700")}
            >
              预览
            </button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar & Textarea */}
      {!isCollapsed && (
        <div>
          {tab === 'edit' ? (
            <div>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3.5 px-3 py-1.5 border-b border-neutral-100 bg-neutral-50/20 text-neutral-400">
                <button type="button" className="font-serif font-black hover:text-neutral-700 text-xs transition-colors">H</button>
                <button type="button" className="font-bold hover:text-neutral-700 text-xs transition-colors">B</button>
                <button type="button" className="italic hover:text-neutral-700 text-xs transition-colors">I</button>
                <button type="button" className="line-through hover:text-neutral-700 text-xs transition-colors">S</button>
                <div className="w-[1px] h-3.5 bg-neutral-200"></div>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">🔗</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">”</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">&lt;/&gt;</button>
                <div className="w-[1px] h-3.5 bg-neutral-200"></div>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">📋</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">🔢</button>
                <button type="button" className="hover:text-neutral-700 text-[11px] transition-colors">☑️</button>
              </div>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "请输入内容..."}
                className="w-full min-h-[90px] p-3 text-xs text-neutral-800 focus:outline-none resize-y"
              />
            </div>
          ) : (
            <div className="p-3 min-h-[90px] text-xs text-neutral-700 bg-neutral-50/10 whitespace-pre-wrap">
              {value || <span className="text-neutral-400 italic">暂无预览内容</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function TeacherQuestions() {
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importBank, setImportBank] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState<any | null>(null);

  React.useEffect(() => {
    if (location.state?.openCreateQuestion) {
      setIsCreateModalOpen(true);
      // Clear location state to prevent reopening on refresh or back navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // AI Assistant states
  const [view, setView] = useState<'list' | 'ai'>('list');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [importedIndexes, setImportedIndexes] = useState<number[]>([]);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'assistant',
      text: `你好！我是你的 AI 出题助手，专门为你生成符合要求的各类题目。无论是人工智能、计算机、数学、历史或其他领域，我都能根据你指定的主题、难度和题型，快速生成清晰准确的题目。

请按照以下题目「示例格式」输入试题内容要求，我会立即为你定制高质量的题目：
请生成主题为《人工智能通识》的试题。每道题需包含：

1. 题目（必填）：
2. 关键概念/知识点（选填）：
3. 难度（必填）：初级/中级/高级
4. 标签（选填）：
5. 题型分布与题量（必填）：例如 -> 单选题 1 题，多选题 1 题，判断题 1 题，填空题 1 题，简答题 1 题，思考题 1 题，编程题 1 题`
    }
  ]);

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let generatedQuestion = {
        name: '神经网络中激活函数的主要作用是提供非线性建模能力。',
        type: '单选题',
        bank: '人工智能通识D-uni',
        difficulty: '中级',
        tags: '深度学习, 激活函数',
        grading: '自动评分',
        options: ['增加网络层数', '引入非线性因素，使网络能拟合复杂函数', '加速梯度下降的计算', '自动调节学习率'],
        correct: 'B',
        analysis: '激活函数的主要目的就是在多层神经网络中引入非线性因素。如果没有激活函数，无论网络叠加多少层，其输出始终是输入的线性组合，只能解决线性可分问题。'
      };

      if (currentInput.includes('多选')) {
        generatedQuestion = {
          name: '以下哪些方法常用于防止深度学习模型发生过拟合？',
          type: '多选题',
          bank: '人工智能通识D-uni',
          difficulty: '高级',
          tags: '深度学习, 过拟合',
          grading: '自动评分',
          options: ['使用 Dropout 丢弃法', '增加训练数据量', '采用 L1 或 L2 正则化项', '提高模型的复杂度'],
          correct: 'A, B, C',
          analysis: '防止过拟合的常见方法包括增加数据、引入 L1/L2 正则项以及使用 Dropout 随机失活。增加模型复杂度反而会加剧过拟合。'
        };
      } else if (currentInput.includes('判断')) {
        generatedQuestion = {
          name: '在监督学习中，所有的算法都必须依赖手工标注的高质量标签数据。',
          type: '判断题',
          bank: '人工智能通识D-uni',
          difficulty: '初级',
          tags: '监督学习',
          grading: '自动评分',
          options: ['正确', '错误'],
          correct: '错误',
          analysis: '在弱监督学习或自监督学习中，并不一定需要大量人工标注的数据，故说法不绝对。'
        };
      }

      const assistantMsg = {
        sender: 'assistant',
        text: `✨ 出题助手已为您成功生成以下 **${generatedQuestion.type}**，点击下方的「导入试题库」即可直接导入管理系统中：`,
        questionCard: generatedQuestion
      };

      setMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  const handleImportQuestion = (card: any, msgIndex: number) => {
    if (importedIndexes.includes(msgIndex)) return;

    const newQuestion = {
      id: Date.now(),
      name: card.name,
      bank: card.bank,
      type: card.type,
      status: '启用',
      source: '智能出题',
      difficulty: card.difficulty,
      tags: card.tags,
      grading: card.grading,
      creator: 'Momodel',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      scope: '已公开',
      auditStatus: '申请公开已通过'
    };

    setQuestionsList([newQuestion, ...questionsList]);
    setImportedIndexes([...importedIndexes, msgIndex]);
  };

  // Modal form states
  const [newQuestionType, setNewQuestionType] = useState('单选题');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBank, setNewQuestionBank] = useState('');
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  
  // Options state (default ABCD)
  const [options, setOptions] = useState([
    { id: 1, key: 'A', value: '' },
    { id: 2, key: 'B', value: '' },
    { id: 3, key: 'C', value: '' },
    { id: 4, key: 'D', value: '' },
  ]);

  // Correct answer states depending on question type
  const [correctAnswerSingle, setCorrectAnswerSingle] = useState('A');
  const [correctAnswerMultiple, setCorrectAnswerMultiple] = useState<string[]>([]);
  const [correctAnswerTrueFalse, setCorrectAnswerTrueFalse] = useState('正确');
  const [correctAnswerText, setCorrectAnswerText] = useState('');

  const [newQuestionAnalysis, setNewQuestionAnalysis] = useState('');
  const [newQuestionStatus, setNewQuestionStatus] = useState('启用');

  // Practical Question (实训题) specific states
  const [shixunDescription, setShixunDescription] = useState(`### 任务名称\n内容描述\n### 任务描述\n内容描述\n### 任务要求\n内容描述\n### 评分方式\n内容描述`);
  const [shixunAnswerType, setShixunAnswerType] = useState('线上环境答题');
  const [shixunType, setShixunType] = useState('自动评分');
  const [shixunTaskType, setShixunTaskType] = useState('回归');
  const [shixunTrainDataset, setShixunTrainDataset] = useState('');
  const [shixunTestDataset, setShixunTestDataset] = useState('');
  const [shixunScoreDataset, setShixunScoreDataset] = useState('');

  // Programming Question (编程题) specific states
  const [codingLanguage, setCodingLanguage] = useState('Python');
  const [codingMaxTime, setCodingMaxTime] = useState(1);
  const [codingInputDesc, setCodingInputDesc] = useState('');
  const [codingOutputDesc, setCodingOutputDesc] = useState('');
  const [codingExamples, setCodingExamples] = useState<any[]>([{ id: 1, input: '', output: '' }]);
  const [codingTestCases, setCodingTestCases] = useState<any[]>([{ id: 1, input: '', output: '', desc: '' }]);
  const [codingInitCode, setCodingInitCode] = useState('def solution():\n    # Write your code here\n    pass');

  // Tag management
  const [tags, setTags] = useState<string[]>([
    '人工智能概述',
    '大模型应用场景分析',
    '机器学习基本概念与流程',
    '大语言模型技术',
    '人工智能导论'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [searchTagQuery, setSearchTagQuery] = useState('');

  const [questionsList, setQuestionsList] = useState([
    {
      id: 1,
      name: '智能体与传统程序最本质的区别是什么？',
      bank: '人工智能通识D-uni',
      type: '单选题',
      status: '启用',
      source: '人工出题',
      difficulty: '初级',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    },
    {
      id: 2,
      name: '智能体的四个基本组成部分包括哪些？',
      bank: '人工智能通识D-uni',
      type: '多选题',
      status: '启用',
      source: '人工出题',
      difficulty: '初级',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    },
    {
      id: 3,
      name: '大语言模型是__________是构建生成式各种应用的...',
      bank: '人工智能通识D-uni',
      type: '填空题',
      status: '启用',
      source: '人工出题',
      difficulty: '中级',
      tags: '',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 17:02',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    }
  ]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(questionsList.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleAddOption = () => {
    const nextKey = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: Date.now(), key: nextKey, value: '' }]);
  };

  const handleDeleteOption = (id: number) => {
    const filtered = options.filter(opt => opt.id !== id);
    const rekeyed = filtered.map((opt, index) => ({
      ...opt,
      key: String.fromCharCode(65 + index)
    }));
    setOptions(rekeyed);
  };

  const handleSaveQuestion = () => {
    if (!newQuestionTitle.trim()) {
      alert('请输入试题标题！');
      return;
    }
    if (!newQuestionBank) {
      alert('请选择所属试题库！');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      name: newQuestionTitle,
      bank: newQuestionBank,
      type: newQuestionType,
      status: newQuestionStatus,
      source: '人工出题',
      difficulty: newQuestionDifficulty || '中级',
      tags: tags.slice(0, 2).join(', ') || '智能体',
      grading: newQuestionType === '实训题' ? shixunType : '自动评分',
      creator: 'Momodel',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      scope: '已公开',
      auditStatus: '申请公开已通过'
    };

    setQuestionsList([newQuestion, ...questionsList]);
    setIsCreateModalOpen(false);

    // Reset states
    setNewQuestionTitle('');
    setNewQuestionBank('');
    setNewQuestionDifficulty('');
    setNewQuestionBody('');
    setOptions([
      { id: 1, key: 'A', value: '' },
      { id: 2, key: 'B', value: '' },
      { id: 3, key: 'C', value: '' },
      { id: 4, key: 'D', value: '' },
    ]);
    setCorrectAnswerSingle('A');
    setCorrectAnswerMultiple([]);
    setCorrectAnswerTrueFalse('正确');
    setCorrectAnswerText('');
    setNewQuestionAnalysis('');
    setNewQuestionStatus('启用');
    setShixunDescription(`### 任务名称\n内容描述\n### 任务描述\n内容描述\n### 任务要求\n内容描述\n### 评分方式\n内容描述`);
    setShixunAnswerType('线上环境答题');
    setShixunType('自动评分');
    setShixunTaskType('回归');
    setShixunTrainDataset('');
    setShixunTestDataset('');
    setShixunScoreDataset('');
    setCodingLanguage('Python');
    setCodingMaxTime(1);
    setCodingInputDesc('');
    setCodingOutputDesc('');
    setCodingExamples([{ id: 1, input: '', output: '' }]);
    setCodingTestCases([{ id: 1, input: '', output: '', desc: '' }]);
    setCodingInitCode('def solution():\n    # Write your code here\n    pass');
  };

  const questionTypes = ['单选题', '多选题', '判断题', '填空题', '简答题', '思考题', '编程题', '实训题'];
  const filteredTags = tags.filter(tag => tag.toLowerCase().includes(searchTagQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      {view === 'list' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div className="flex items-end gap-4">
              <h1 className="text-xl font-bold text-neutral-900">试题管理</h1>
              <p className="text-sm text-neutral-500 mb-0.5">新建试题、仅展示公开或您个人题库内试题，试题“启用”后可用于组卷</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setView('ai')} variant="outline" className="flex items-center gap-1.5 h-9 border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] bg-white rounded shadow-sm cursor-pointer">
                <Brain className="w-4 h-4" /> 智能出题
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded cursor-pointer">
                <Plus className="w-4 h-4" /> 新建试题
              </Button>
              <Button variant="outline" className="flex items-center gap-1.5 h-9 rounded border-neutral-200 text-neutral-600">
                批量公开
              </Button>
              <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="flex items-center gap-1.5 h-9 rounded border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-[#fff2e8]/30 transition-all cursor-pointer">
                导入
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
                        onClick={() => toggleSelectAll(selectedQuestions.length !== questionsList.length || questionsList.length === 0)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                          selectedQuestions.length === questionsList.length && questionsList.length > 0
                            ? "bg-[#fa541c] border-[#fa541c] text-white"
                            : "border-neutral-300 hover:border-[#fa541c] bg-white"
                        )}
                      >
                        {selectedQuestions.length === questionsList.length && questionsList.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">试题名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">所属试题库 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">来源</th>
                    <th className="p-4 font-medium">难度</th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">标签 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">评分方式</th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">创建人 <Search className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">试题范围 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">审核状态 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                    </th>
                    <th className="p-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsList.map(q => (
                    <tr key={q.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                      <td className="p-4 text-center">
                        <button 
                          type="button"
                          onClick={() => toggleSelect(q.id)}
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                            selectedQuestions.includes(q.id)
                              ? "bg-[#fa541c] border-[#fa541c] text-white"
                              : "border-neutral-300 hover:border-[#fa541c] bg-white"
                          )}
                        >
                          {selectedQuestions.includes(q.id) && <span className="text-[10px] font-bold">✓</span>}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="text-neutral-800 max-w-[180px] truncate" title={q.name}>{q.name}</div>
                      </td>
                      <td className="p-4 text-neutral-600">{q.bank}</td>
                      <td className="p-4 text-neutral-800">{q.type}</td>
                      <td className="p-4">
                        <span className={cn("px-2 py-0.5 text-[12px] rounded border", q.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600">{q.source}</td>
                      <td className="p-4 text-neutral-600">{q.difficulty}</td>
                      <td className="p-4 text-neutral-600">{q.tags || '-'}</td>
                      <td className="p-4 text-neutral-600">{q.grading}</td>
                      <td className="p-4 text-neutral-600">{q.creator}</td>
                      <td className="p-4 text-neutral-500">{q.updateTime}</td>
                      <td className="p-4 text-[#fa541c]">
                        <span className="px-2 py-0.5 bg-[#fff2e8] rounded text-[12px] border border-[#ffbb96]">{q.scope}</span>
                      </td>
                      <td className={cn("p-4 font-medium", q.auditStatus === '申请公开已通过' ? "text-blue-600" : "text-[#fa541c]")}>
                        {q.auditStatus}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewingQuestion(q)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer">查看</button>
                          <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">复制</button>
                          <button onClick={() => setQuestionsList(questionsList.filter(item => item.id !== q.id))} className="text-neutral-400 hover:text-neutral-600 transition-colors">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end p-4 gap-4 mt-2">
              <span className="text-[13px] text-neutral-500">共 {questionsList.length} 条</span>
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
        /* AI出题助手界面 */
        <div className="h-[calc(100vh-56px)] flex flex-col bg-white overflow-hidden animate-fade-in -mx-6 -my-6">
          {/* 顶部通栏标题栏 */}
          <div className="h-14 border-b border-neutral-200/60 flex items-center justify-between px-6 bg-white flex-shrink-0 relative">
            {/* 顶部左侧返回智能出题 */}
            <button 
              onClick={() => setView('list')} 
              className="flex items-center gap-1.5 text-xs text-[#fa541c] hover:text-[#e84a15] font-bold transition-colors cursor-pointer bg-transparent px-1 py-1.5 z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> 返回智能出题
            </button>
            
            <div className="w-28"></div> 
          </div>

          <div className="flex flex-1 min-h-0">
            {/* 左侧侧边栏 */}
            <div className="w-64 border-r border-neutral-100 flex flex-col bg-neutral-50/20">
              {/* 新建对话按钮 */}
              <div className="p-4 border-b border-neutral-100">
                <button 
                  onClick={() => {
                    setMessages([
                      {
                        sender: 'assistant',
                        text: `你好！我是你的 AI 出题助手，专门为你生成符合要求的各类题目。无论是人工智能、计算机、数学、历史或其他领域，我都能根据你指定的主题、难度和题型，快速生成清晰准确的题目。
  
  请按照以下题目「示例格式」输入试题内容要求，我会立即为你定制高质量的题目：
  请生成主题为《人工智能通识》的试题。每道题需包含：
  
  1. 题目（必填）：
  2. 关键概念/知识点（选填）：
  3. 难度（必填）：初级/中级/高级
  4. 标签（选填）：
  5. 题型分布与题量（必填）：例如 -> 单选题 1 题，多选题 1 题，判断题 1 题，填空题 1 题，简答题 1 题，思考题 1 题，编程题 1 题`
                      }
                    ]);
                    setImportedIndexes([]);
                  }}
                  className="w-full bg-white border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 新建对话
                </button>
              </div>

              {/* 对话列表 */}
              <div className="flex-1 overflow-y-auto">
                <div className="mx-3 mt-3 bg-[#fff2e8] text-[#fa541c] flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>新的对话</span>
                </div>
              </div>

              {/* 侧边栏底部 */}
              <div className="p-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-medium">
                © 出题助手 2026
              </div>
            </div>

            {/* 右侧主对话视窗 */}
            <div className="flex-1 flex flex-col bg-white">
              {/* 气泡对话框滚动区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-50/10 flex flex-col">
                <h2 className="text-sm font-bold text-neutral-800 pb-3 border-b border-neutral-100 mb-2">新的对话</h2>
                
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-fade-in",
                      msg.sender === 'user' ? "ml-auto justify-end self-end" : "justify-start self-start"
                    )}
                  >
                    {/* AI头像 */}
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#fa541c]" />
                      </div>
                    )}

                    {/* 消息气泡 */}
                    <div 
                      className={cn(
                        "p-4 rounded-2xl shadow-sm text-xs leading-relaxed transition-all",
                        msg.sender === 'user' 
                          ? "bg-[#fa541c] text-white rounded-tr-none" 
                          : "bg-white border border-neutral-200/80 text-neutral-800 rounded-tl-none space-y-4"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* AI生成的试题展示卡片 */}
                      {msg.sender === 'assistant' && msg.questionCard && (
                        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-neutral-50/50 w-full max-w-[520px] transition-all animate-slide-up">
                          {/* 题卡头部 */}
                          <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded text-[10px] font-bold">
                              {msg.questionCard.type}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium bg-white px-2 py-0.5 rounded border border-neutral-100">
                              难度: {msg.questionCard.difficulty}
                            </span>
                          </div>
                          
                          {/* 题卡正文 */}
                          <div className="p-4 space-y-3.5">
                            <h4 className="text-xs font-bold text-neutral-800 leading-snug">{msg.questionCard.name}</h4>
                            
                            {/* 选择题选项 */}
                            {msg.questionCard.options && (
                              <div className="space-y-2">
                                {msg.questionCard.options.map((opt: string, idx: number) => {
                                  const letter = String.fromCharCode(65 + idx);
                                  return (
                                    <div key={letter} className="flex items-start gap-2.5 text-xs text-neutral-700">
                                      <span className="font-bold text-neutral-500 bg-neutral-100/80 border border-neutral-200/60 rounded w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] shadow-sm">
                                        {letter}
                                      </span>
                                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* 细分割线 */}
                            <div className="border-t border-neutral-200/50 my-2"></div>

                            {/* 答案与深度解析栏 */}
                            <div className="bg-[#fff2e8]/40 border border-[#ffbb96]/40 rounded-xl p-3.5 space-y-2">
                              <div className="text-xs text-[#fa541c] font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c]"></span>
                                <span>正确答案：</span>
                                <span className="px-2 py-0.5 bg-[#fa541c] text-white rounded text-[10px] font-bold shadow-sm">{msg.questionCard.correct}</span>
                              </div>
                              <div className="text-[11px] text-neutral-600 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-neutral-100">
                                <span className="font-bold text-neutral-700 block mb-1">解析：</span>
                                {msg.questionCard.analysis}
                              </div>
                            </div>
                          </div>

                          {/* 题卡保存按钮 */}
                          <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center">
                            <button
                              onClick={() => handleImportQuestion(msg.questionCard, index)}
                              disabled={importedIndexes.includes(index)}
                              className={cn(
                                "w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm cursor-pointer",
                                importedIndexes.includes(index)
                                  ? "bg-green-50 text-green-600 border border-green-200"
                                  : "bg-[#fa541c] hover:bg-[#e84a15] text-white"
                              )}
                            >
                              {importedIndexes.includes(index) ? (
                                <>✓ 已成功导入试题库</>
                              ) : (
                                <>
                                  <Database className="w-3.5 h-3.5 animate-bounce" /> 导入到试题库
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI正在输入动效 */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] animate-fade-in self-start justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center flex-shrink-0 animate-pulse shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#fa541c]" />
                    </div>
                    <div className="bg-white border border-neutral-200/80 rounded-2xl rounded-tl-none py-3.5 px-4 shadow-sm text-xs text-neutral-500 font-medium italic flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce delay-150"></span>
                        <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full animate-bounce delay-300"></span>
                      </div>
                      <span>出题助手正在智能生成试题中...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部交互输入区域 */}
              <div className="p-4 border-t border-neutral-100 bg-white">
                <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus-within:border-[#fa541c] focus-within:ring-1 focus-within:ring-[#fa541c] transition-all">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="请输入试题生成要求，如：生成主题为《深度学习》的试题，包含多选题。"
                    className="flex-1 bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none resize-none h-6 custom-scrollbar leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                  />
                  <div className="text-[10px] text-neutral-400 font-mono select-none">
                    {chatInput.length}
                  </div>
                  <button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim()}
                    className="text-[#fa541c] hover:text-[#e84a15] disabled:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建试题 Drawer (从界面右侧展示) */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h2 className="text-[15px] font-bold text-neutral-800">新建试题</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
              {/* Question Type Classification (Tabs) */}
              <div className="space-y-2">
                <div className="border-b border-neutral-200 flex gap-5 overflow-x-auto no-scrollbar pb-1">
                  {questionTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewQuestionType(type)}
                      className={cn(
                        "pb-2 text-[13px] font-medium transition-all relative whitespace-nowrap cursor-pointer",
                        newQuestionType === type
                          ? "text-[#fa541c] font-bold border-b-2 border-[#fa541c]"
                          : "text-neutral-500 hover:text-neutral-800"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Name Field */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 试题标题：
                </label>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="请输入试题标题（如：大模型应用场景分析单选）"
                  className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Dropdowns (Belonging Bank, Difficulty) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Belonging Question Bank */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 所属试题库：
                  </label>
                  <div className="relative">
                    <select
                      value={newQuestionBank}
                      onChange={(e) => setNewQuestionBank(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer"
                    >
                      <option value="">请添加试题库</option>
                      <option value="人工智能通识D-uni">人工智能通识D-uni</option>
                      <option value="深度学习基础题库">深度学习基础题库</option>
                      <option value="大语言模型进阶题库">大语言模型进阶题库</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800">
                    难度：
                  </label>
                  <div className="relative">
                    <select
                      value={newQuestionDifficulty}
                      onChange={(e) => setNewQuestionDifficulty(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer"
                    >
                      <option value="">请选择试题难度</option>
                      <option value="初级">初级</option>
                      <option value="中级">中级</option>
                      <option value="高级">高级</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800">
                  标签：
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {isAddingTag ? (
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-md p-1 shadow-sm">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="输入新标签"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTag();
                          }}
                          className="px-2 py-0.5 text-xs focus:outline-none w-28 bg-white text-neutral-700"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="text-[11px] bg-[#fa541c] hover:bg-[#e84a15] text-white px-2 py-0.5 rounded transition-colors font-medium cursor-pointer"
                        >
                          添加
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingTag(false)}
                          className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded transition-colors font-medium cursor-pointer"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className="h-7 px-3 border border-dashed border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded text-[11px] flex items-center gap-1 text-neutral-500 transition-colors font-medium bg-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> 新建标签
                      </button>
                    )}

                    {/* Tag Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTagQuery}
                        onChange={(e) => setSearchTagQuery(e.target.value)}
                        placeholder="搜索标签"
                        className="pl-8 pr-2.5 h-7 text-[11px] border border-neutral-200 rounded focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white w-32 text-neutral-700 transition-all"
                      />
                    </div>
                  </div>

                  {/* Tags Pills List */}
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-600 flex items-center gap-1 shadow-sm hover:border-neutral-300 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter(t => t !== tag))}
                          className="text-neutral-400 hover:text-red-500 transition-colors text-[10px] ml-1 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {filteredTags.length === 0 && (
                      <span className="text-xs text-neutral-400 italic">无匹配的标签</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Body Editor */}
              <RichTextEditor
                label="题目："
                required
                value={newQuestionBody}
                onChange={setNewQuestionBody}
                placeholder="请输入题目正文..."
              />

              {/* Answer Options ABCD (Show only for single and multiple selection) */}
              {(newQuestionType === '单选题' || newQuestionType === '多选题') && (
                <div className="space-y-3">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c] mr-1">*</span> 答案选项：
                  </label>
                  <div className="space-y-3.5">
                    {options.map((opt) => (
                      <RichTextEditor
                        key={opt.id}
                        label={`选项${opt.key}`}
                        value={opt.value}
                        onChange={(val) => {
                          setOptions(options.map(o => o.id === opt.id ? { ...o, value: val } : o));
                        }}
                        placeholder={`请输入选项${opt.key}的内容...`}
                        isCollapsible
                        onDelete={options.length > 2 ? () => handleDeleteOption(opt.id) : undefined}
                      />
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded-lg hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> 增加选项
                  </button>
                </div>
              )}

              {/* Practical Question (实训题) Fields */}
              {newQuestionType === '实训题' && (
                <div className="space-y-5 animate-slide-up">
                  
                  {/* 试题内容说明 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 试题内容说明：
                      <span className="text-xs text-neutral-400 font-normal ml-1">学生根据『试题内容说明』进行答题</span>
                    </label>
                    <RichTextEditor
                      label="内容说明："
                      required
                      value={shixunDescription}
                      onChange={setShixunDescription}
                    />
                  </div>

                  {/* 答题方式 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 答题方式：
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    </label>
                    <div className="flex flex-wrap gap-6 items-center p-3.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl">
                      {[
                        { value: '线下做题，上传结果文件', label: '线下做题，上传结果文件' },
                        { value: '线上环境答题', label: '线上环境答题' }
                      ].map((item) => (
                        <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                          <input
                            type="radio"
                            name="shixunAnswerType"
                            value={item.value}
                            checked={shixunAnswerType === item.value}
                            onChange={() => setShixunAnswerType(item.value)}
                            className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                          />
                          <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    {shixunAnswerType === '线上环境答题' && (
                      <p className="text-[11px] text-neutral-400 leading-normal pl-1">
                        点击【确定】后，可在开发环境内编辑详细的<span className="text-[#fa541c] font-medium">『试题内容说明』</span>文档
                      </p>
                    )}
                  </div>

                  {/* 实训类型 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 实训类型：
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    </label>
                    <div className="flex flex-wrap gap-6 items-center p-3.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl">
                      {[
                        { value: '自动评分', label: '自动评分' },
                        { value: '实训项目', label: '实训项目' },
                        { value: '实验报告', label: '实验报告' }
                      ].map((item) => (
                        <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                          <input
                            type="radio"
                            name="shixunType"
                            value={item.value}
                            checked={shixunType === item.value}
                            onChange={() => setShixunType(item.value)}
                            className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                          />
                          <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 任务类型 */}
                  {shixunType === '自动评分' && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                        <span className="text-[#fa541c]">*</span> 任务类型：
                        <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                      </label>
                      <div className="flex flex-wrap gap-6 items-center p-3.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl">
                        {[
                          { value: '回归', label: '回归' },
                          { value: 'csv分类', label: 'csv分类' },
                          { value: '图像分类', label: '图像分类' },
                          { value: '自定义', label: '自定义' }
                        ].map((item) => (
                          <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="shixunTaskType"
                              value={item.value}
                              checked={shixunTaskType === item.value}
                              onChange={() => setShixunTaskType(item.value)}
                              className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer bg-white"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 数据集选择 */}
                  <div className="space-y-4 pt-1">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 数据集选择：
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    </label>

                    <div className="space-y-4 pl-1">
                      {/* 训练数据集 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-700">训练数据集：</span>
                          <span className="text-[11px] text-neutral-400">用于学生实训训练过程中训练或验证模型的数据集</span>
                        </div>
                        {shixunTrainDataset ? (
                          <div className="flex items-center justify-between p-2.5 bg-[#fff2e8]/20 border border-[#ffbb96]/45 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-neutral-700">
                              <Database className="w-4 h-4 text-[#fa541c]" />
                              <span className="font-medium">{shixunTrainDataset}</span>
                              <span className="text-neutral-400 text-[10px]">(42.5 MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShixunTrainDataset('')}
                              className="text-neutral-400 hover:text-red-500 transition-colors text-xs font-bold p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShixunTrainDataset('house_prices_train.csv')}
                            className="w-full h-9 border border-dashed border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded-lg text-xs flex items-center justify-center gap-1.5 text-neutral-500 bg-white transition-all font-medium cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-neutral-400" /> 添加训练数据集
                          </button>
                        )}
                      </div>

                      {/* 测试数据集 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-700">测试数据集：</span>
                          <span className="text-[11px] text-neutral-400">用于学生提交结束前，系统测试模型结果的数据集，可根据测试结果调试文件</span>
                        </div>
                        {shixunTestDataset ? (
                          <div className="flex items-center justify-between p-2.5 bg-[#fff2e8]/20 border border-[#ffbb96]/45 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-neutral-700">
                              <Database className="w-4 h-4 text-[#fa541c]" />
                              <span className="font-medium">{shixunTestDataset}</span>
                              <span className="text-neutral-400 text-[10px]">(12.8 MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShixunTestDataset('')}
                              className="text-neutral-400 hover:text-red-500 transition-colors text-xs font-bold p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShixunTestDataset('house_prices_test.csv')}
                            className="w-full h-9 border border-dashed border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded-lg text-xs flex items-center justify-center gap-1.5 text-neutral-500 bg-white transition-all font-medium cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-neutral-400" /> 添加测试数据集
                          </button>
                        )}
                      </div>

                      {/* 评分数据集 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-700">评分数据集：</span>
                          <span className="text-[11px] text-neutral-400">用于学生提交结果后，进行最后自动评分的数据集</span>
                        </div>
                        {shixunScoreDataset ? (
                          <div className="flex items-center justify-between p-2.5 bg-[#fff2e8]/20 border border-[#ffbb96]/45 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-neutral-700">
                              <Database className="w-4 h-4 text-[#fa541c]" />
                              <span className="font-medium">{shixunScoreDataset}</span>
                              <span className="text-neutral-400 text-[10px]">(15.4 MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShixunScoreDataset('')}
                              className="text-neutral-400 hover:text-red-500 transition-colors text-xs font-bold p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShixunScoreDataset('house_prices_eval.csv')}
                            className="w-full h-9 border border-dashed border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded-lg text-xs flex items-center justify-center gap-1.5 text-neutral-500 bg-white transition-all font-medium cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-neutral-400" /> 添加评分数据集
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Programming Question (编程题) Fields */}
              {newQuestionType === '编程题' && (
                <div className="space-y-5 animate-slide-up">
                  
                  {/* Grid fields: Language & Timeout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 编程语言 */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                        <span className="text-[#fa541c]">*</span> 编程语言：
                      </label>
                      <div className="relative">
                        <select
                          value={codingLanguage}
                          onChange={(e) => setCodingLanguage(e.target.value)}
                          className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer font-medium"
                        >
                          <option value="Python">Python</option>
                          <option value="C++">C++</option>
                          <option value="Java">Java</option>
                          <option value="Go">Go</option>
                          <option value="JavaScript">JavaScript</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 单个测试集最大测评时长 */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                        <span className="text-[#fa541c]">*</span> 单个测试集最大测评时长：
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={codingMaxTime}
                          onChange={(e) => setCodingMaxTime(Number(e.target.value))}
                          min={1}
                          className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all"
                        />
                        <span className="text-xs text-neutral-600 shrink-0 font-medium">秒</span>
                      </div>
                    </div>
                  </div>

                  {/* 输入描述 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 输入描述：
                    </label>
                    <RichTextEditor
                      label="输入描述："
                      required
                      value={codingInputDesc}
                      onChange={setCodingInputDesc}
                      placeholder="请输入输入描述..."
                    />
                  </div>

                  {/* 输出描述 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 输出描述：
                    </label>
                    <RichTextEditor
                      label="输出描述："
                      required
                      value={codingOutputDesc}
                      onChange={setCodingOutputDesc}
                      placeholder="请输入输出描述..."
                    />
                  </div>

                  {/* 输入输出样例 */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 输入输出样例：
                    </label>

                    <div className="space-y-4 pl-1">
                      {codingExamples.map((item, idx) => (
                        <div key={item.id} className="border border-[#d9e8ff] rounded-xl overflow-hidden shadow-2xs">
                          {/* Banner Header exactly like Image 1 */}
                          <div className="bg-[#e6f4ff] border-b border-[#d9e8ff] px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#1677ff]">
                            <div className="flex items-center gap-2">
                              <span className="w-4.5 h-4.5 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-[10px] font-black">✓</span>
                              <span>样例 {idx + 1}</span>
                            </div>
                            {codingExamples.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setCodingExamples(codingExamples.filter(x => x.id !== item.id))}
                                className="text-neutral-400 hover:text-red-500 transition-colors text-[11px] font-bold cursor-pointer"
                              >
                                删除
                              </button>
                            )}
                          </div>

                          {/* Inputs body */}
                          <div className="p-4 space-y-3.5 bg-white">
                            {/* Input Area */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                <span className="text-[#fa541c]">*</span> 输入：
                              </span>
                              <textarea
                                value={item.input}
                                onChange={(e) => {
                                  setCodingExamples(codingExamples.map(x => x.id === item.id ? { ...x, input: e.target.value } : x));
                                }}
                                rows={3}
                                placeholder="请输入样例的输入内容"
                                className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-neutral-700 bg-white leading-relaxed"
                              />
                            </div>

                            {/* Output Area */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                <span className="text-[#fa541c]">*</span> 输出：
                              </span>
                              <textarea
                                value={item.output}
                                onChange={(e) => {
                                  setCodingExamples(codingExamples.map(x => x.id === item.id ? { ...x, output: e.target.value } : x));
                                }}
                                rows={3}
                                placeholder="请输入样例的输出内容"
                                className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-neutral-700 bg-white leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add example button styled in theme color orange */}
                      <button
                        type="button"
                        onClick={() => setCodingExamples([...codingExamples, { id: Date.now(), input: '', output: '' }])}
                        className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded-lg hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" /> 新增样例
                      </button>
                    </div>
                  </div>

                  {/* 测试用例 */}
                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 测试用例：
                    </label>

                    <div className="space-y-4 pl-1">
                      {codingTestCases.map((item, idx) => (
                        <div key={item.id} className="border border-[#d9e8ff] rounded-xl overflow-hidden shadow-2xs">
                          {/* Banner Header exactly like Image 1 */}
                          <div className="bg-[#e6f4ff] border-b border-[#d9e8ff] px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#1677ff]">
                            <div className="flex items-center gap-2">
                              <span className="w-4.5 h-4.5 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-[10px] font-black">✓</span>
                              <span>测试用例 {idx + 1}</span>
                            </div>
                            {codingTestCases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setCodingTestCases(codingTestCases.filter(x => x.id !== item.id))}
                                className="text-neutral-400 hover:text-red-500 transition-colors text-[11px] font-bold cursor-pointer"
                              >
                                删除
                              </button>
                            )}
                          </div>

                          {/* Inputs body */}
                          <div className="p-4 space-y-3.5 bg-white">
                            {/* Input Area */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                <span className="text-[#fa541c]">*</span> 输入：
                              </span>
                              <textarea
                                value={item.input}
                                onChange={(e) => {
                                  setCodingTestCases(codingTestCases.map(x => x.id === item.id ? { ...x, input: e.target.value } : x));
                                }}
                                rows={3}
                                placeholder="请输入测试用例的输入内容"
                                className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-neutral-700 bg-white leading-relaxed"
                              />
                            </div>

                            {/* Output Area */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                <span className="text-[#fa541c]">*</span> 输出：
                              </span>
                              <textarea
                                value={item.output}
                                onChange={(e) => {
                                  setCodingTestCases(codingTestCases.map(x => x.id === item.id ? { ...x, output: e.target.value } : x));
                                }}
                                rows={3}
                                placeholder="请输入测试用例的预期输出"
                                className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-neutral-700 bg-white leading-relaxed"
                              />
                            </div>

                            {/* Explanation Area */}
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-500 block">说明：</span>
                              <textarea
                                value={item.desc}
                                onChange={(e) => {
                                  setCodingTestCases(codingTestCases.map(x => x.id === item.id ? { ...x, desc: e.target.value } : x));
                                }}
                                rows={3}
                                placeholder="请输入测试用例的相关说明"
                                className="w-full border border-neutral-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none text-neutral-700 bg-white leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add case button styled in theme color orange */}
                      <button
                        type="button"
                        onClick={() => setCodingTestCases([...codingTestCases, { id: Date.now(), input: '', output: '', desc: '' }])}
                        className="h-8 px-4 border border-[#fa541c] text-[#fa541c] rounded-lg hover:bg-[#fff2e8] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" /> 新增用例
                      </button>
                    </div>
                  </div>

                  {/* 学生初始代码 Console exactly like Image 2 */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                      学生初始代码：
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    </label>
                    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-950 text-white font-mono p-3 shadow-sm transition-all focus-within:border-[#fa541c]/50 flex">
                      {/* Line numbers column */}
                      <div className="text-neutral-600 text-right pr-3.5 select-none border-r border-neutral-800 mr-3 text-xs leading-relaxed py-1 w-8 font-mono">
                        {codingInitCode.split('\n').map((_, index) => (
                          <div key={index}>{index + 1}</div>
                        ))}
                      </div>
                      {/* Textarea Code Console */}
                      <textarea
                        value={codingInitCode}
                        onChange={(e) => setCodingInitCode(e.target.value)}
                        rows={7}
                        placeholder="请输入学生初始代码..."
                        className="flex-1 bg-transparent text-xs text-emerald-400 focus:outline-none resize-y leading-relaxed font-mono py-1 custom-scrollbar whitespace-pre"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Correct Answer */}
              {(newQuestionType !== '实训题' && newQuestionType !== '编程题') && (
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 正确答案：
                  </label>
                  
                  <div className="p-4 bg-neutral-50/50 border border-neutral-200/60 rounded-xl">
                    {newQuestionType === '单选题' && (
                      <div className="flex flex-wrap gap-6 items-center">
                        {options.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="correctAnswerSingle"
                              value={opt.key}
                              checked={correctAnswerSingle === opt.key}
                              onChange={() => setCorrectAnswerSingle(opt.key)}
                              className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">选项 {opt.key}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {newQuestionType === '多选题' && (
                      <div className="flex flex-wrap gap-6 items-center">
                        {options.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="checkbox"
                              checked={correctAnswerMultiple.includes(opt.key)}
                              onChange={() => {
                                if (correctAnswerMultiple.includes(opt.key)) {
                                  setCorrectAnswerMultiple(correctAnswerMultiple.filter(k => k !== opt.key));
                                } else {
                                  setCorrectAnswerMultiple([...correctAnswerMultiple, opt.key]);
                                }
                              }}
                              className="w-4 h-4 text-[#fa541c] border-neutral-300 rounded focus:ring-[#fa541c] cursor-pointer"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">选项 {opt.key}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {newQuestionType === '判断题' && (
                      <div className="flex gap-6 items-center">
                        {['正确', '错误'].map((val) => (
                          <label key={val} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                            <input
                              type="radio"
                              name="correctAnswerTrueFalse"
                              value={val}
                              checked={correctAnswerTrueFalse === val}
                              onChange={() => setCorrectAnswerTrueFalse(val)}
                              className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer"
                            />
                            <span className="group-hover:text-[#fa541c] transition-colors font-medium">{val}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {!(newQuestionType === '单选题' || newQuestionType === '多选题' || newQuestionType === '判断题') && (
                      <input
                        type="text"
                        placeholder="请输入参考答案或评分标准..."
                        value={correctAnswerText}
                        onChange={(e) => setCorrectAnswerText(e.target.value)}
                        className="w-full border border-neutral-200 bg-white rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all text-neutral-700 placeholder:text-neutral-400"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Answer Analysis */}
              {newQuestionType !== '实训题' && (
                <RichTextEditor
                  label="答案解析："
                  value={newQuestionAnalysis}
                  onChange={setNewQuestionAnalysis}
                  placeholder="请输入详细的答案解析 and 解题思路..."
                />
              )}

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                  状态：
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                </label>
                <div className="flex gap-6 items-center">
                  {[
                    { value: '启用', label: '启用', desc: '启用后可用于组卷' },
                    { value: '停用', label: '停用', desc: '停用后暂不可用' }
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2.5 cursor-pointer group text-xs text-neutral-700">
                      <input
                        type="radio"
                        name="newQuestionStatus"
                        value={item.value}
                        checked={newQuestionStatus === item.value}
                        onChange={() => setNewQuestionStatus(item.value)}
                        className="w-4 h-4 text-[#fa541c] border-neutral-300 focus:ring-[#fa541c] cursor-pointer"
                      />
                      <span className="group-hover:text-[#fa541c] transition-colors font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50/50">
              <Button 
                onClick={() => setIsCreateModalOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-colors rounded cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveQuestion}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded shadow-sm cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批量导入 Modal */}
      {isImportModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl border border-neutral-100 p-6 flex flex-col relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2 border-l-4 border-[#fa541c] pl-2.5">
                <span className="text-[16px] font-bold text-neutral-800">批量导入</span>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              {/* 所属试题库 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 所属试题库：
                </label>
                <div className="relative">
                  <select
                    value={importBank}
                    onChange={(e) => setImportBank(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3.5 py-2 text-xs appearance-none focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-700 transition-all cursor-pointer"
                  >
                    <option value="">请选择所属试题库</option>
                    <option value="人工智能通识D-uni">人工智能通识D-uni</option>
                    <option value="深度学习基础题库">深度学习基础题库</option>
                    <option value="大语言模型进阶题库">大语言模型进阶题库</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 本地文件上传 */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 本地文件：
                </label>
                
                {/* Drag and Drop Zone */}
                <div 
                  onClick={() => {
                    if (isImporting) return;
                    setImportFileName('人工智能通识批量导入模板.xlsx');
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-neutral-50/30 transition-all cursor-pointer group text-center",
                    importFileName
                      ? "border-[#fa541c] bg-[#fff2e8]/10"
                      : "border-neutral-200 hover:border-[#fa541c] hover:bg-neutral-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110",
                    importFileName ? "bg-[#fa541c] text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-[#fff2e8]/60 group-hover:text-[#fa541c]"
                  )}>
                    <Upload className="w-5 h-5" />
                  </div>
                  {importFileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-neutral-800">{importFileName}</p>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setImportFileName('');
                        }}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer"
                      >
                        清除并重新上传
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        将文件拖到此或 <span className="text-[#fa541c] hover:text-[#e84a15] font-semibold underline">点击上传</span>
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">支持扩展名：.xlsx</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="border border-[#ffbb96] bg-[#fff2e8]/30 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden">
                <span className="bg-[#fa541c] text-white px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                  Tips
                </span>
                <div className="flex-1 flex justify-between items-start gap-4">
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">
                    上传前请先按照 Excel 格式填写试题内容，仅支持单选题、多选题、判断题、填空题、简答题、思考题、编程题批量导入
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('已为您成功触发模板下载！')}
                    className="text-[#fa541c] hover:text-[#e84a15] text-xs font-bold whitespace-nowrap hover:underline cursor-pointer flex items-center"
                  >
                    下载模板
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-5">
              <Button 
                onClick={() => setIsImportModalOpen(false)}
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-lg cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!importBank) {
                    alert('请选择所属试题库！');
                    return;
                  }
                  if (!importFileName) {
                    alert('请上传需要导入的本地 Excel 文件！');
                    return;
                  }
                  setIsImporting(true);
                  setTimeout(() => {
                    const importedQ = {
                      id: Date.now(),
                      name: '深度学习中卷积层与池化层分别有什么关键作用？',
                      bank: importBank,
                      type: '简答题',
                      status: '启用',
                      source: '批量导入',
                      difficulty: '中级',
                      tags: '深度学习, 卷积神经网络',
                      grading: '人工评分',
                      creator: 'Momodel',
                      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
                      scope: '已公开',
                      auditStatus: '申请公开已通过'
                    };
                    setQuestionsList([importedQ, ...questionsList]);
                    setIsImporting(false);
                    setIsImportModalOpen(false);
                    setImportFileName('');
                    alert('批量试题成功导入并追加到列表中！');
                  }, 1200);
                }}
                disabled={isImporting}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-lg shadow-sm cursor-pointer"
              >
                {isImporting ? '导入中...' : '导入'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 查看试题 Drawer (从界面右侧展示，类似新建试题风格) */}
      {viewingQuestion && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setViewingQuestion(null)}
        >
          <div 
            className="bg-white w-full max-w-[660px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] border border-[#ffbb96] rounded text-[11px] font-bold">
                  {viewingQuestion.type}
                </span>
                <h2 className="text-[15px] font-bold text-neutral-800">查看试题详情</h2>
              </div>
              <button 
                onClick={() => setViewingQuestion(null)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content - Scrollable View */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1 bg-white">
              {/* Question Name / Title */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">试题标题：</label>
                <div className="text-sm font-bold text-neutral-800 border border-neutral-100 bg-neutral-50/30 rounded-xl p-3.5 leading-relaxed">
                  {viewingQuestion.name}
                </div>
              </div>

              {/* Grid: Bank, Difficulty, Creator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">所属试题库</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg font-medium">{viewingQuestion.bank}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">难度级别</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg font-medium">{viewingQuestion.difficulty}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">评分方式</label>
                  <p className="text-xs text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg font-medium">{viewingQuestion.grading}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">关联标签：</label>
                <div className="flex flex-wrap gap-2">
                  {viewingQuestion.tags ? (
                    viewingQuestion.tags.split(', ').map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 bg-[#fff2e8] border border-[#ffbb96] rounded text-xs text-[#fa541c] font-medium shadow-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">暂无关联标签</span>
                  )}
                </div>
              </div>

              {/* Dynamic Options list (Mock items if none are listed) */}
              {['单选题', '多选题'].includes(viewingQuestion.type) && (
                <div className="space-y-2.5">
                  <label className="text-[13px] font-bold text-neutral-400">试题答案选项：</label>
                  <div className="space-y-2">
                    {[
                      { key: 'A', text: '自动搜索大语言模型的隐藏参数' },
                      { key: 'B', text: '结合外部知识库对生成结果进行事实增强' },
                      { key: 'C', text: '增加多模态数据输入通道' },
                      { key: 'D', text: '使用深度网络加速推理速度' },
                    ].map((opt) => (
                      <div key={opt.key} className="flex items-start gap-3 p-3 bg-neutral-50/50 border border-neutral-100 rounded-xl">
                        <span className="font-bold text-neutral-500 bg-white border border-neutral-200 rounded w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                          {opt.key}
                        </span>
                        <span className="text-xs text-neutral-700 pt-0.5 leading-relaxed">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">正确参考答案：</label>
                <div className="bg-[#fff2e8]/40 border border-[#ffbb96]/40 rounded-xl p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fa541c]"></span>
                  <span className="text-xs font-bold text-neutral-600">答案为：</span>
                  <span className="px-3 py-1 bg-[#fa541c] text-white rounded-lg text-xs font-bold shadow-sm">
                    {viewingQuestion.type === '单选题' ? 'B' : viewingQuestion.type === '多选题' ? 'A, B, C' : '正确'}
                  </span>
                </div>
              </div>

              {/* Answer Analysis */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-400">答案深度解析：</label>
                <div className="p-4 bg-neutral-50/80 border border-neutral-100 rounded-xl text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  该题的关键考点在于大模型主流应用的结合点。通过结合结构化或非结构化外部知识库，利用事实注入和二次检索召回，能够从根本上缓解或避免大模型输出的“幻觉”现象，提升特定业务场景的准确性。
                </div>
              </div>

              {/* Audit Status & Creator Details */}
              <div className="border-t border-neutral-100 pt-4 grid grid-cols-2 gap-4 text-xs text-neutral-500">
                <p>创建人：<span className="text-neutral-700 font-semibold">{viewingQuestion.creator}</span></p>
                <p>更新时间：<span className="text-neutral-700 font-semibold">{viewingQuestion.updateTime}</span></p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end bg-neutral-50/50">
              <Button 
                onClick={() => setViewingQuestion(null)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-colors rounded-lg shadow-sm cursor-pointer"
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