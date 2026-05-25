import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  X, 
  ArrowLeft, 
  Save, 
  Check, 
  Cpu, 
  GitBranch, 
  Terminal, 
  Layers, 
  Briefcase, 
  Tag, 
  BookOpen, 
  FileCode, 
  BarChart3, 
  Brain, 
  Settings, 
  GitFork, 
  Trash2, 
  Edit, 
  Copy, 
  Play, 
  Upload, 
  AlertCircle, 
  ChevronRight,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  desc: string;
  type: '编程项目' | '数据分析项目' | 'AI项目' | '运维项目';
  difficulty: '初级' | '中级' | '高级';
  duration: string;
  gitUrl: string;
  baseImage: string;
  resources: { cpu: string; memory: string; gpu: string };
  scope: { positions: string[]; skills: string[]; scenarios: string[] };
  status: '草稿' | '已发布';
  updateTime: string;
}

interface TeacherProjectsProps {
  embedded?: boolean;
  defaultCourseId?: number | null;
  defaultCourseName?: string | null;
  onBackToCourses?: () => void;
}

export default function TeacherProjects({
  embedded = false,
  defaultCourseId = null,
  defaultCourseName = null,
  onBackToCourses
}: TeacherProjectsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Route states / Props fallback
  const incomingCourseId = defaultCourseId || location.state?.courseId;
  const incomingCourseName = defaultCourseName || location.state?.courseName;

  // View states
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '草稿' | '已发布'>('all');

  // Form setup wizard active tab
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'git' | 'env' | 'scope'>('basic');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'编程项目' | '数据分析项目' | 'AI项目' | '运维项目'>('编程项目');
  const [formDifficulty, setFormDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [formDuration, setFormDuration] = useState('8');
  
  // Git / Source
  const [gitSourceType, setGitSourceType] = useState<'git' | 'upload'>('git');
  const [gitUrl, setGitUrl] = useState('');
  const [gitBranch, setGitBranch] = useState('main');
  const [gitToken, setGitToken] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isTestingGit, setIsTestingGit] = useState(false);
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([]);

  // Environment configuration
  const [baseImage, setBaseImage] = useState('python:3.10-slim');
  const [dependencies, setDependencies] = useState('numpy>=1.24.0\npandas>=2.0.0\nscikit-learn>=1.2.0');
  const [cpuCores, setCpuCores] = useState('2');
  const [memorySize, setMemorySize] = useState('4');
  const [gpuType, setGpuType] = useState('none');

  // Target audience / Scope
  const [jobPositions, setJobPositions] = useState<string[]>(['AI算法工程师', 'Python开发工程师']);
  const [skills, setSkills] = useState<string[]>(['PyTorch', 'Pandas', '特征工程']);
  const [scenarios, setScenarios] = useState<string[]>(['企业实训', '期末大作业']);

  const [newJobInput, setNewJobInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newScenarioInput, setNewScenarioInput] = useState('');

  // Floating notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock initial dataset
  const [projectsList, setProjectsList] = useState<Project[]>([
    {
      id: 1,
      name: '大语言模型智能客服助理',
      desc: '基于 Llama-3-8B 微调的智能多轮客服对话系统，支持企业知识库检索 (RAG) 与向量数据库路由。',
      type: 'AI项目',
      difficulty: '高级',
      duration: '16',
      gitUrl: 'https://github.com/cosmospp/ai-chatbot-rag.git',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1-cudnn8-devel',
      resources: { cpu: '4 核', memory: '16 GB', gpu: 'NVIDIA T4 (16G)' },
      scope: {
        positions: ['AI算法工程师', 'NLP开发工程师'],
        skills: ['PyTorch', 'Transformers', 'LangChain', 'VectorDB'],
        scenarios: ['企业实训', '毕业设计']
      },
      status: '已发布',
      updateTime: '2026/05/24 18:22'
    },
    {
      id: 2,
      name: '分布式高并发电商微服务交易系统',
      desc: '电商后端交易链路设计，结合 Spring Boot, Redis 缓存, RabbitMQ 异步队列实现秒杀防御策略。',
      type: '编程项目',
      difficulty: '高级',
      duration: '12',
      gitUrl: 'https://github.com/cosmospp/ecommerce-microservices.git',
      baseImage: 'openjdk:17-jdk-alpine',
      resources: { cpu: '2 核', memory: '8 GB', gpu: '无' },
      scope: {
        positions: ['Java开发工程师', '后端开发工程师'],
        skills: ['Spring Cloud', 'Redis', 'RabbitMQ', 'Docker'],
        scenarios: ['企业实训', '工程项目实践']
      },
      status: '已发布',
      updateTime: '2026/05/23 15:45'
    },
    {
      id: 3,
      name: '多渠道金融流失客户预测分析',
      desc: '获取金融板块流失特征，使用 Pandas/Seaborn 做特征工程，并应用 XGBoost 进行流失建模。',
      type: '数据分析项目',
      difficulty: '中级',
      duration: '6',
      gitUrl: 'https://github.com/cosmospp/financial-churn-analysis.git',
      baseImage: 'python:3.10-slim',
      resources: { cpu: '1 核', memory: '4 GB', gpu: '无' },
      scope: {
        positions: ['数据分析师', '风控策略分析师'],
        skills: ['Pandas', 'Scikit-Learn', 'XGBoost', '数据可视化'],
        scenarios: ['期末大作业', '课程作业']
      },
      status: '草稿',
      updateTime: '2026/05/25 09:12'
    },
    {
      id: 4,
      name: 'Kubernetes 容器化微服务高可用部署',
      desc: '设计微服务的 Dockerfile，并在三节点 Kubernetes 集群中部署实现滚动更新与弹性伸缩。',
      type: '运维项目',
      difficulty: '中级',
      duration: '8',
      gitUrl: 'https://github.com/cosmospp/k8s-ha-deployment.git',
      baseImage: 'ubuntu:22.04',
      resources: { cpu: '2 核', memory: '4 GB', gpu: '无' },
      scope: {
        positions: ['DevOps工程师', '系统运维工程师'],
        skills: ['Kubernetes', 'Docker', 'Prometheus', 'CI/CD'],
        scenarios: ['云计算实训', '运维工程实践']
      },
      status: '已发布',
      updateTime: '2026/05/20 11:30'
    }
  ]);

  // Project Templates (Preset Options)
  const templates = [
    {
      name: '大语言模型 (LLM) 应用开发微服务模板',
      desc: '预置 Python 3.10 与 PyTorch CUDA 镜像，装有 LangChain, HuggingFace 及常用向量库接口。',
      type: 'AI项目' as const,
      difficulty: '高级' as const,
      duration: '16',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1-cudnn8-devel',
      dependencies: 'transformers>=4.35.0\nlangchain>=0.0.350\nchromadb>=0.4.15\nsentence-transformers>=2.2.2',
      cpu: '4',
      memory: '16',
      gpu: 't4',
      positions: ['AI算法工程师', 'NLP开发工程师'],
      skills: ['LangChain', 'Milvus', 'PyTorch']
    },
    {
      name: 'Kaggle 经典机器学习回归建模模板',
      desc: '数据清洗、探索性分析 (EDA) 与特征提取脚手架，预装 Scikit-Learn、XGBoost、LightGBM 算法。',
      type: '数据分析项目' as const,
      difficulty: '中级' as const,
      duration: '6',
      baseImage: 'python:3.10-slim',
      dependencies: 'numpy>=1.24.0\npandas>=2.0.0\nscikit-learn>=1.2.0\nlightgbm>=4.0.0\nmatplotlib>=3.7.0',
      cpu: '2',
      memory: '4',
      gpu: 'none',
      positions: ['数据分析师', '算法工程师'],
      skills: ['EDA', 'FeatureEngineering', 'XGBoost']
    },
    {
      name: 'Spring Cloud 电商微服务骨架模板',
      desc: '内置 Consul 注册中心、Gateway 路由网关、Feign 声明式服务调用及 Docker-compose 配置。',
      type: '编程项目' as const,
      difficulty: '高级' as const,
      duration: '12',
      baseImage: 'openjdk:17-jdk-alpine',
      dependencies: 'maven-build-dependencies',
      cpu: '4',
      memory: '8',
      gpu: 'none',
      positions: ['后端开发工程师', 'Java开发工程师'],
      skills: ['Spring Cloud', 'Consul', 'Docker-compose']
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run a mock git connect validator with retro terminal styles
  const testGitConnection = () => {
    if (!gitUrl.trim()) {
      showToast('请输入 Git 仓库地址！');
      return;
    }
    setIsTestingGit(true);
    setGitTerminalLogs([]);
    
    const logs = [
      `[系统提示] 正在初始化 Git 代理连接服务器...`,
      `[Git 连接] 尝试连接到远程主机 github.com ...`,
      `[Git 安全] 正在交换 SSH 加密指纹与验证凭证...`,
      `[Git 握手] 凭证校验成功。正在解析仓库目录树...`,
      `[Git 仓库] 检测到默认分支: refs/heads/${gitBranch || 'main'}`,
      `[Git 提取] 成功获取最新 Commit: ad78c2e (Update README.md)`,
      `[SUCCESS] 关联成功！仓库与分支测试连接畅通，可用作实训基础代码。`
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setGitTerminalLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsTestingGit(false);
        }
      }, (idx + 1) * 600);
    });
  };

  const handleCreateNew = () => {
    // Reset Form to Empty
    setFormName('');
    setFormDesc('');
    setFormType('编程项目');
    setFormDifficulty('中级');
    setFormDuration('8');
    setGitSourceType('git');
    setGitUrl('');
    setGitBranch('main');
    setGitToken('');
    setUploadedFileName('');
    setBaseImage('python:3.10-slim');
    setDependencies('numpy>=1.24.0\npandas>=2.0.0\nscikit-learn>=1.2.0');
    setCpuCores('2');
    setMemorySize('4');
    setGpuType('none');
    setJobPositions(['Python开发工程师', '软件研发工程师']);
    setSkills(['Python', 'DataStructure']);
    setScenarios(['企业实训', '日常作业']);
    
    setCurrentProject(null);
    setActiveFormTab('basic');
    setView('create');
  };

  // Apply template values directly to editor state
  const handleLoadTemplate = (tpl: typeof templates[0]) => {
    setFormName(tpl.name);
    setFormDesc(tpl.desc);
    setFormType(tpl.type);
    setFormDifficulty(tpl.difficulty);
    setFormDuration(tpl.duration);
    setGitSourceType('git');
    setGitUrl('https://github.com/cosmospp-templates/' + tpl.type.toLowerCase() + '-scaffold.git');
    setGitBranch('main');
    setBaseImage(tpl.baseImage);
    setDependencies(tpl.dependencies);
    setCpuCores(tpl.cpu);
    setMemorySize(tpl.memory);
    setGpuType(tpl.gpu);
    setJobPositions(tpl.positions);
    setSkills(tpl.skills);
    setScenarios(['模板构建', '企业实训']);

    setActiveFormTab('basic');
    setView('create');
    showToast(`成功应用模板：${tpl.name.slice(0, 12)}...`);
  };

  const handleEditProject = (proj: Project) => {
    setCurrentProject(proj);
    setFormName(proj.name);
    setFormDesc(proj.desc);
    setFormType(proj.type);
    setFormDifficulty(proj.difficulty);
    setFormDuration(proj.duration);
    setGitSourceType(proj.gitUrl ? 'git' : 'upload');
    setGitUrl(proj.gitUrl || '');
    setGitBranch('main');
    setBaseImage(proj.baseImage);
    
    // Resource parsing
    const cores = proj.resources.cpu.replace(/[^0-9]/g, '');
    const memory = proj.resources.memory.replace(/[^0-9]/g, '');
    setCpuCores(cores || '2');
    setMemorySize(memory || '4');
    setGpuType(proj.resources.gpu.includes('T4') ? 't4' : proj.resources.gpu.includes('A10G') ? 'a10g' : 'none');

    setJobPositions(proj.scope.positions);
    setSkills(proj.scope.skills);
    setScenarios(proj.scope.scenarios);

    setActiveFormTab('basic');
    setView('edit');
  };

  const handleSave = (statusToSave: '草稿' | '已发布') => {
    if (!formName.trim()) {
      showToast('请输入项目名称！');
      return;
    }

    const gpuLabel = gpuType === 't4' ? 'NVIDIA T4 (16G)' : gpuType === 'a10g' ? 'NVIDIA A10G (24G)' : '无';

    const newProjectData: Project = {
      id: currentProject ? currentProject.id : Date.now(),
      name: formName,
      desc: formDesc,
      type: formType,
      difficulty: formDifficulty,
      duration: formDuration,
      gitUrl: gitSourceType === 'git' ? gitUrl : '',
      baseImage: baseImage,
      resources: {
        cpu: `${cpuCores} 核`,
        memory: `${memorySize} GB`,
        gpu: gpuLabel
      },
      scope: {
        positions: jobPositions,
        skills: skills,
        scenarios: scenarios
      },
      status: statusToSave,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/')
    };

    if (view === 'edit') {
      setProjectsList(projectsList.map(p => p.id === currentProject?.id ? newProjectData : p));
      showToast(`成功更新项目「${formName.slice(0, 10)}...」`);
    } else {
      setProjectsList([newProjectData, ...projectsList]);
      showToast(`成功创建项目「${formName.slice(0, 10)}...」并保存为${statusToSave}`);
    }

    setView('list');
  };

  const handleCopy = (proj: Project) => {
    const copied: Project = {
      ...proj,
      id: Date.now(),
      name: proj.name + ' - 副本',
      status: '草稿',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/')
    };
    setProjectsList([copied, ...projectsList]);
    showToast(`成功复制项目「${proj.name.slice(0, 8)}...」`);
  };

  const handleDelete = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id));
    showToast('项目已成功删除');
  };

  // Filter projects list
  const filteredProjects = projectsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.scope.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900/95 text-white border border-neutral-800 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-up text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {view === 'list' ? (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {embedded && onBackToCourses && (
                  <button 
                    onClick={onBackToCourses}
                    className="p-1 text-neutral-400 hover:text-[#fa541c] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer mr-1 border-0 bg-transparent flex items-center justify-center"
                    title="返回课程列表"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h1 className="text-xl font-bold text-neutral-900">实战项目管理</h1>
                {incomingCourseName && (
                  <span className="px-2.5 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded-md text-[11px] font-bold border border-[#ffbb96] flex items-center">
                    当前课程: {incomingCourseName}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                配置企业级编程、数据分析、AI与运维项目环境。学生通过IDE或Jupyter直接进行沙箱实训，支持Git拉取及定制化依赖安装。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={handleCreateNew}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded-lg border-0 cursor-pointer font-bold px-4 transition-all"
              >
                <Plus className="w-4 h-4" /> 新建实战项目
              </Button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '项目总数', count: projectsList.length, desc: '项实战教学项目', color: 'border-orange-100', bg: 'from-orange-50/20 to-orange-100/5', text: 'text-[#fa541c]' },
              { label: 'AI微调项目', count: projectsList.filter(p => p.type === 'AI项目').length, desc: '大模型与NLP实训', color: 'border-purple-100', bg: 'from-purple-50/20 to-purple-100/5', text: 'text-purple-600' },
              { label: '环境仓库', count: projectsList.filter(p => p.gitUrl).length, desc: '已关联外部Git仓库', color: 'border-blue-100', bg: 'from-blue-50/20 to-blue-100/5', text: 'text-blue-600' },
              { label: '已发布给学生', count: projectsList.filter(p => p.status === '已发布').length, desc: '正在运行的沙箱容器', color: 'border-green-100', bg: 'from-green-50/20 to-green-100/5', text: 'text-green-600' }
            ].map((metric, idx) => (
              <div key={idx} className={cn("bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between h-20 transition-all hover:scale-[1.01] hover:shadow-md", metric.color)}>
                <span className="text-[11px] font-bold text-neutral-400">{metric.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-xl font-extrabold font-mono", metric.text)}>{metric.count}</span>
                  <span className="text-[10px] text-neutral-400 font-medium">{metric.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar (Search & Filter Tabs) */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Type Filters */}
              <div className="flex flex-wrap bg-neutral-100 p-0.5 rounded-xl text-xs font-semibold w-full md:w-auto">
                {[
                  { key: 'all', label: '全部项目' },
                  { key: '编程项目', label: '💻 编程类' },
                  { key: '数据分析项目', label: '📊 数据分析' },
                  { key: 'AI项目', label: '🧠 人工智能' },
                  { key: '运维项目', label: '⚙️ 容器运维' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTypeFilter(item.key)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg transition-all cursor-pointer",
                      typeFilter === item.key 
                        ? "bg-white text-[#fa541c] shadow-sm font-bold" 
                        : "text-neutral-500 hover:text-neutral-800"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Status Filter Cards */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-neutral-450 mr-1.5">状态:</span>
                {[
                  { key: 'all', label: '不限' },
                  { key: '已发布', label: '已发布' },
                  { key: '草稿', label: '草稿' }
                ].map(st => (
                  <button
                    key={st.key}
                    onClick={() => setStatusFilter(st.key as any)}
                    className={cn(
                      "px-3 py-1 rounded-md border transition-all cursor-pointer",
                      statusFilter === st.key 
                        ? "bg-[#fa541c] border-[#fa541c] text-white shadow-sm font-bold" 
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-[#fa541c]/50"
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-neutral-100"></div>

            {/* Searching */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="快速查找项目名称、技能关键词 (如: PyTorch, Docker) 或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Preset Project Templates Slider (从模板创建) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#fa541c]" /> 从精品项目模板快捷创建
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((tpl, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-neutral-50/30 border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:border-[#fa541c]/30 hover:scale-[1.01] transition-all relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-[#fff2e8]/40 to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        tpl.type === 'AI项目' && "bg-purple-50 text-purple-600 border-purple-200",
                        tpl.type === '数据分析项目' && "bg-blue-50 text-blue-600 border-blue-200",
                        tpl.type === '编程项目' && "bg-orange-50 text-[#fa541c] border-orange-200"
                      )}>
                        {tpl.type}
                      </span>
                      <span className="text-[10px] text-neutral-450 font-bold bg-white px-2 py-0.5 rounded-full border">
                        {tpl.difficulty} • {tpl.duration}小时
                      </span>
                    </div>
                    <h3 className="text-xs font-black text-neutral-800 leading-snug group-hover:text-[#fa541c] transition-colors">{tpl.name}</h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">{tpl.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-1">
                      {tpl.skills.slice(0, 2).map((sk, sidx) => (
                        <span key={sidx} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[9px] rounded font-medium">{sk}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleLoadTemplate(tpl)}
                      className="text-[11px] font-bold text-[#fa541c] hover:text-[#e84a15] flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                    >
                      使用此模板 <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#fa541c]/30 hover:scale-[1.005] transition-all relative">
                
                {/* Project Status Ribbon */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                    proj.status === '已发布' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                  )}>
                    {proj.status}
                  </span>
                </div>

                {/* Card Main Info */}
                <div className="p-5 space-y-4">
                  {/* Category, Difficulty & Time */}
                  <div className="flex items-center gap-2">
                    {/* Category Icon */}
                    <span className={cn(
                      "p-1.5 rounded-lg border flex items-center justify-center shadow-sm",
                      proj.type === 'AI项目' && "bg-purple-50 text-purple-600 border-purple-200",
                      proj.type === '编程项目' && "bg-orange-50 text-[#fa541c] border-orange-200",
                      proj.type === '数据分析项目' && "bg-blue-50 text-blue-600 border-blue-200",
                      proj.type === '运维项目' && "bg-teal-50 text-teal-600 border-teal-200"
                    )}>
                      {proj.type === 'AI项目' && <Brain className="w-3.5 h-3.5" />}
                      {proj.type === '编程项目' && <FileCode className="w-3.5 h-3.5" />}
                      {proj.type === '数据分析项目' && <BarChart3 className="w-3.5 h-3.5" />}
                      {proj.type === '运维项目' && <Settings className="w-3.5 h-3.5" />}
                    </span>
                    
                    <span className="text-[11px] font-bold text-neutral-450">{proj.type}</span>
                    <span className="text-neutral-200">•</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                      proj.difficulty === '初级' && "bg-green-50 text-green-600 border-green-150",
                      proj.difficulty === '中级' && "bg-orange-50 text-[#fa541c] border-orange-150",
                      proj.difficulty === '高级' && "bg-red-50 text-red-600 border-red-150"
                    )}>
                      {proj.difficulty}
                    </span>
                    <span className="text-neutral-200">•</span>
                    <span className="text-[10px] text-neutral-450 font-bold">建议时长: {proj.duration}小时</span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-neutral-800 leading-snug hover:text-[#fa541c] cursor-pointer transition-colors" onClick={() => handleEditProject(proj)}>{proj.name}</h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">{proj.desc}</p>
                  </div>

                  {/* Source Code Git Info */}
                  <div className="bg-neutral-50/60 border border-neutral-100 rounded-xl p-3 space-y-2 text-[11px] font-medium text-neutral-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <GitBranch className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-400">源码：</span>
                      <span className="font-mono text-neutral-700 truncate" title={proj.gitUrl || '本地打包上传'}>
                        {proj.gitUrl ? proj.gitUrl : '📁 本地源码打包上传 (zip)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-400">容器：</span>
                      <span className="font-mono text-neutral-700 truncate" title={proj.baseImage}>{proj.baseImage}</span>
                      <span className="text-neutral-300">|</span>
                      <span className="text-neutral-500 font-bold bg-white px-1.5 border rounded">{proj.resources.cpu} {proj.resources.memory}</span>
                    </div>
                  </div>

                  {/* Scope Matrix */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1">
                      {proj.scope.positions.map((pos, pidx) => (
                        <span key={pidx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200/50 rounded-full text-[10px] font-medium">
                          💼 {pos}
                        </span>
                      ))}
                      {proj.scope.skills.map((sk, skidx) => (
                        <span key={skidx} className="px-2 py-0.5 bg-orange-50/50 text-[#fa541c] border border-orange-100 rounded-full text-[10px] font-semibold">
                          ⚡ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Operations Footer */}
                <div className="px-5 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-neutral-400 font-mono">更新: {proj.updateTime}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleEditProject(proj)} 
                      className="text-[#fa541c] hover:text-[#e84a15] font-bold cursor-pointer transition-colors bg-transparent border-0 flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" /> 编辑
                    </button>
                    <button 
                      onClick={() => handleCopy(proj)} 
                      className="text-neutral-600 hover:text-[#fa541c] font-bold cursor-pointer transition-colors bg-transparent border-0 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> 复制
                    </button>
                    <button 
                      onClick={() => handleDelete(proj.id)} 
                      className="text-neutral-400 hover:text-red-500 font-bold cursor-pointer transition-colors bg-transparent border-0 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> 删除
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full bg-white border rounded-2xl p-16 text-center text-neutral-400 font-semibold text-xs flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-8 h-8 text-neutral-300" />
                <span>没有找到符合搜索或筛选条件的实战项目</span>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ==================== CREATE / EDIT EDITOR VIEW ==================== */
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-md flex flex-col min-h-[85vh]">
          {/* Editor Header */}
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('list')}
                className="p-1.5 bg-white border border-neutral-200 hover:border-[#fa541c] text-neutral-500 hover:text-[#fa541c] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="space-y-0.5">
                <h2 className="text-sm font-black text-neutral-800">
                  {view === 'create' ? '新建实战项目' : `编辑项目: ${currentProject?.name}`}
                </h2>
                <p className="text-[10px] text-neutral-400 font-medium">配置实训专属的计算沙箱镜像、Git关联与目标职业技能体系</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => handleSave('草稿')} 
                variant="outline" 
                className="h-8.5 text-neutral-600 border-neutral-200 hover:bg-neutral-100 rounded-lg text-xs font-bold transition-all px-4 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> 保存为草稿
              </Button>
              <Button 
                onClick={() => handleSave('已发布')}
                className="h-8.5 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold shadow-sm px-5 transition-all border-0 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 mr-1" /> 确认发布项目
              </Button>
            </div>
          </div>

          {/* Multi-step Tabbed Workspace Controller */}
          <div className="flex border-b border-neutral-100 bg-neutral-50/40">
            {[
              { key: 'basic', label: '1. 基础信息配置', icon: BookOpen },
              { key: 'git', label: '2. 源码仓库关联', icon: GitBranch },
              { key: 'env', label: '3. 沙箱环境与资源', icon: Cpu },
              { key: 'scope', label: '4. 岗位技能画像', icon: Briefcase }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFormTab(tab.key as any)}
                className={cn(
                  "flex-1 py-3 px-4 border-b-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                  activeFormTab === tab.key 
                    ? "border-[#fa541c] text-[#fa541c] bg-white" 
                    : "border-transparent text-neutral-500 hover:text-neutral-850 hover:bg-neutral-50/20"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Editor Body Content Panel */}
          <div className="p-6 flex-1 bg-white overflow-y-auto">
            
            {/* TAB 1: BASIC INFORMATION */}
            {activeFormTab === 'basic' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 项目名称
                  </label>
                  <input 
                    type="text"
                    placeholder="请输入实战项目的主题标题，如：基于 XGBoost 客户特征分类建模"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all text-neutral-800"
                  />
                </div>

                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 项目类型
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: '编程项目', label: '编程项目', icon: FileCode, desc: '支持 C/C++, Java, Python, Web' },
                      { key: '数据分析项目', label: '数据分析项目', icon: BarChart3, desc: '支持 Pandas, Jupyter 交互' },
                      { key: 'AI项目', label: 'AI项目', icon: Brain, desc: '大模型微调、深度学习沙箱' },
                      { key: '运维项目', label: '运维项目', icon: Settings, desc: '容器编排、K8s 集群实操' }
                    ].map(typeCard => (
                      <div
                        key={typeCard.key}
                        onClick={() => setFormType(typeCard.key as any)}
                        className={cn(
                          "border p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 select-none",
                          formType === typeCard.key 
                            ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-sm" 
                            : "border-neutral-200 hover:border-[#fa541c]/50 hover:bg-neutral-50/40"
                        )}
                      >
                        <typeCard.icon className={cn("w-5 h-5", formType === typeCard.key ? "text-[#fa541c]" : "text-neutral-400")} />
                        <div className="space-y-1">
                          <span className={cn("text-xs font-black block", formType === typeCard.key ? "text-[#fa541c]" : "text-neutral-700")}>
                            {typeCard.label}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-medium block leading-snug">{typeCard.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty & Suggest Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Difficulty Radio Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 项目难度级别
                    </label>
                    <div className="flex gap-4">
                      {[
                        { key: '初级', color: 'border-green-300 text-green-600 bg-green-50/20' },
                        { key: '中级', color: 'border-orange-350 text-[#fa541c] bg-orange-50/15' },
                        { key: '高级', color: 'border-red-300 text-red-600 bg-red-50/20' }
                      ].map(level => (
                        <label 
                          key={level.key}
                          onClick={() => setFormDifficulty(level.key as any)}
                          className={cn(
                            "flex-1 border py-2.5 rounded-xl text-center text-xs font-bold cursor-pointer transition-all select-none",
                            formDifficulty === level.key 
                              ? `${level.color} shadow-sm border-2` 
                              : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                          )}
                        >
                          {level.key}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 建议实训时长 (小时)
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="1"
                        max="40"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        className="flex-1 accent-[#fa541c] h-1.5 bg-neutral-100 rounded-lg cursor-pointer"
                      />
                      <span className="w-14 text-center font-bold text-xs text-neutral-800 bg-neutral-50 px-2 py-1.5 border rounded-lg font-mono">
                        {formDuration} 小时
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                    项目详细描述 (实战任务说明)
                  </label>
                  <textarea 
                    placeholder="请输入该实战项目的背景、主要任务目标，以及期望学生达成的技术目标描述..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full min-h-[140px] text-xs border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all text-neutral-800 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SOURCE CODE & GIT ASSOCIATION */}
            {activeFormTab === 'git' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                {/* Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 源码上传/管理方式
                  </label>
                  <div className="flex gap-4">
                    {[
                      { key: 'git', label: '⚡ 关联外部 Git 仓库', desc: '支持 GitHub / GitLab 等私有/公开代码托管' },
                      { key: 'upload', label: '📁 本地源码文件上传', desc: '支持上传本地打包的工程代码压缩包 (.zip)' }
                    ].map(mode => (
                      <div
                        key={mode.key}
                        onClick={() => setGitSourceType(mode.key as any)}
                        className={cn(
                          "flex-1 border p-4 rounded-2xl cursor-pointer transition-all select-none space-y-1.5",
                          gitSourceType === mode.key 
                            ? "border-[#fa541c] bg-[#fff2e8]/10 shadow-sm" 
                            : "border-neutral-200 hover:border-[#fa541c]/50 hover:bg-neutral-50/40"
                        )}
                      >
                        <span className={cn("text-xs font-black block", gitSourceType === mode.key ? "text-[#fa541c]" : "text-neutral-700")}>
                          {mode.label}
                        </span>
                        <span className="text-[10px] text-neutral-450 block leading-snug">{mode.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {gitSourceType === 'git' ? (
                  /* ==================== GIT CONFIG ==================== */
                  <div className="space-y-4 border border-neutral-200 rounded-2xl p-5 bg-neutral-50/10 space-y-5 animate-slide-up">
                    <h3 className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      <GitFork className="w-4 h-4 text-[#fa541c]" /> 远程 Git 仓库详细参数
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-500">仓库 URL (HTTPS / SSH)</label>
                        <input 
                          type="text"
                          placeholder="git@github.com:your-user/your-project.git"
                          value={gitUrl}
                          onChange={(e) => setGitUrl(e.target.value)}
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] bg-white font-mono text-neutral-750"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-500">默认拉取分支</label>
                        <input 
                          type="text"
                          placeholder="main / master"
                          value={gitBranch}
                          onChange={(e) => setGitBranch(e.target.value)}
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] bg-white font-mono text-neutral-750"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                        私有仓库凭证令牌 Access Token (可选)
                        <HelpCircle className="w-3.5 h-3.5 text-neutral-450 cursor-pointer" title="若是私有仓库，需配置访问凭证令牌" />
                      </label>
                      <input 
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxx (个人凭证或部署私钥)"
                        value={gitToken}
                        onChange={(e) => setGitToken(e.target.value)}
                        className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] bg-white font-mono text-neutral-750"
                      />
                    </div>

                    {/* Tester Button */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      <p className="text-[10px] text-neutral-450 leading-relaxed max-w-md">
                        * 点击测试连接，系统将通过模拟网关探测仓库可用性，以确保学生在沙箱容器启动时可以顺利拉取代码。
                      </p>
                      <Button 
                        onClick={testGitConnection}
                        disabled={isTestingGit}
                        className="h-8.5 bg-transparent border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] hover:border-[#fa541c] rounded-lg text-xs font-bold px-4 cursor-pointer flex items-center gap-1 flex-shrink-0"
                      >
                        {isTestingGit ? '正在连接测试...' : '测试关联仓库'}
                      </Button>
                    </div>

                    {/* Simulated Retro Terminal Logs Screen */}
                    {(gitTerminalLogs.length > 0 || isTestingGit) && (
                      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-mono text-[11px] text-green-400 space-y-1.5 shadow-inner min-h-[120px] transition-all animate-fade-in relative overflow-hidden">
                        <div className="absolute right-3 top-3 flex items-center gap-1.5 select-none">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <p className="text-neutral-500 font-bold border-b border-neutral-800 pb-1.5 mb-2 select-none flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-neutral-400" /> CLI Terminal Session - Git Connection Tester
                        </p>
                        
                        <div className="space-y-1">
                          {gitTerminalLogs.map((log, index) => (
                            <p key={index} className={cn(
                              log.includes('SUCCESS') ? 'text-green-300 font-bold' : log.includes('系统') ? 'text-neutral-400' : 'text-green-400'
                            )}>
                              {log}
                            </p>
                          ))}
                          {isTestingGit && (
                            <p className="text-yellow-400 animate-pulse flex items-center gap-1">
                              <span>❯ 正在执行网络侦听与握手探测</span>
                              <span className="flex gap-0.5">
                                <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ==================== ZIP FILE UPLOAD ==================== */
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center space-y-4 bg-neutral-50/10 hover:border-[#fa541c]/50 transition-all select-none animate-slide-up flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-orange-50 text-[#fa541c] rounded-xl flex items-center justify-center shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-neutral-700">拖拽文件到此处，或点击浏览本地文件</h4>
                      <p className="text-[10px] text-neutral-400 font-medium">支持 .zip 压缩格式，单文件上限 100MB，请确保工程内含有启动脚手架</p>
                    </div>

                    <div className="flex gap-3">
                      <input 
                        type="file" 
                        accept=".zip"
                        id="zip-uploader"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFileName(file.name);
                            showToast(`成功选择源码文件: ${file.name}`);
                          }
                        }}
                      />
                      <label 
                        htmlFor="zip-uploader"
                        className="h-8.5 bg-white border border-neutral-200 hover:border-[#fa541c] text-neutral-700 hover:text-[#fa541c] rounded-lg text-xs font-bold px-5 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        浏览文件
                      </label>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 text-green-600 rounded-lg text-[11px] font-semibold">
                        <Check className="w-3.5 h-3.5" /> 已选择文件: <span className="font-mono">{uploadedFileName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CONTAINER ENVIRONMENT & COMPUTE RESOURCES */}
            {activeFormTab === 'env' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                
                {/* Preset Docker Base Images */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 实训容器基础镜像 (Base Docker Image)
                  </label>
                  <select 
                    value={baseImage}
                    onChange={(e) => setBaseImage(e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#fa541c] font-mono text-neutral-700"
                  >
                    <option value="python:3.10-slim">🐍 python:3.10-slim (轻量化科学计算环境)</option>
                    <option value="pytorch/pytorch:2.1.0-cuda12.1-cudnn8-devel">🧠 pytorch/pytorch:2.1.0-cuda12.1 (深度学习 GPU 加速环境)</option>
                    <option value="openjdk:17-jdk-alpine">☕ openjdk:17-jdk-alpine (Java 微服务运行环境)</option>
                    <option value="node:20-alpine">📦 node:20-alpine (前端 Web 开发及 JS 运算沙箱)</option>
                    <option value="ubuntu:22.04">⚙️ ubuntu:22.04 LTS (标准 Linux 系统基础运维环境)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Dependencies Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      依赖包定义 (requirements.txt / package.json)
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-400" title="容器拉取代码后将自动通过包管理器执行依赖安装" />
                    </label>
                    <textarea 
                      placeholder="numpy>=1.24.0&#10;pandas>=2.0.0&#10;scikit-learn>=1.2.0"
                      value={dependencies}
                      onChange={(e) => setDependencies(e.target.value)}
                      className="w-full min-h-[140px] text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Resource Limits (CPU & RAM Grid Setup) */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1">
                      <span className="text-[#fa541c]">*</span> 容器算力资源需求配额
                    </label>

                    {/* CPU Selection */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-500">分配 CPU 核心</span>
                      <div className="grid grid-cols-4 gap-2">
                        {['1', '2', '4', '8'].map(core => (
                          <div 
                            key={core}
                            onClick={() => setCpuCores(core)}
                            className={cn(
                              "border py-1.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all select-none",
                              cpuCores === core ? "border-[#fa541c] bg-[#fff2e8]/10 text-[#fa541c]" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            )}
                          >
                            {core} 核
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Memory Selection */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-500">分配 运行内存 (RAM)</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['2', '4', '8', '16', '32'].map(ram => (
                          <div 
                            key={ram}
                            onClick={() => setMemorySize(ram)}
                            className={cn(
                              "border py-1.5 rounded-lg text-center text-[11px] font-bold cursor-pointer transition-all select-none",
                              memorySize === ram ? "border-[#fa541c] bg-[#fff2e8]/10 text-[#fa541c]" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            )}
                          >
                            {ram} GB
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GPU Accel Card Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-500">GPU 加速设备</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'none', label: '无 GPU 加速' },
                          { key: 't4', label: 'NVIDIA T4' },
                          { key: 'a10g', label: 'NVIDIA A10G' }
                        ].map(gpu => (
                          <div 
                            key={gpu.key}
                            onClick={() => setGpuType(gpu.key)}
                            className={cn(
                              "border py-1.5 rounded-lg text-center text-[10px] font-bold cursor-pointer transition-all select-none",
                              gpuType === gpu.key ? "border-[#fa541c] bg-[#fff2e8]/10 text-[#fa541c]" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            )}
                          >
                            {gpu.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: JOB POSITION & TARGET SKILL PORTRAIT */}
            {activeFormTab === 'scope' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                
                {/* Job Position Tags */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-800 flex items-center justify-between">
                    <span>💼 面向目标职业/岗位 (Job Target)</span>
                    <span className="text-[10px] text-neutral-400 font-medium">输入名称后回车添加</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-xl p-3 bg-neutral-50/20">
                    {jobPositions.map((pos, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-neutral-200 text-neutral-700 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        {pos}
                        <button 
                          onClick={() => setJobPositions(jobPositions.filter(p => p !== pos))}
                          className="text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <input 
                      type="text"
                      placeholder="+ 添加关联岗位..."
                      value={newJobInput}
                      onChange={(e) => setNewJobInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newJobInput.trim()) {
                          e.preventDefault();
                          if (!jobPositions.includes(newJobInput.trim())) {
                            setJobPositions([...jobPositions, newJobInput.trim()]);
                          }
                          setNewJobInput('');
                        }
                      }}
                      className="bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none px-2 py-1 min-w-[120px]"
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-800 flex items-center justify-between">
                    <span>⚡ 关联核心专业技能 (Target Skills)</span>
                    <span className="text-[10px] text-neutral-400 font-medium">输入后回车添加</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-xl p-3 bg-[#fff2e8]/5">
                    {skills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#fff2e8]/45 border border-[#ffbb96]/60 text-[#fa541c] rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        {sk}
                        <button 
                          onClick={() => setSkills(skills.filter(s => s !== sk))}
                          className="text-[#fa541c]/50 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <input 
                      type="text"
                      placeholder="+ 添加技能点..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSkillInput.trim()) {
                          e.preventDefault();
                          if (!skills.includes(newSkillInput.trim())) {
                            setSkills([...skills, newSkillInput.trim()]);
                          }
                          setNewSkillInput('');
                        }
                      }}
                      className="bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none px-2 py-1 min-w-[120px]"
                    />
                  </div>
                </div>

                {/* Scenarios Checklist Matrix */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-neutral-800 flex items-center justify-between">
                    <span>🎯 适用教学场景 (Teaching Scenarios)</span>
                    <span className="text-[10px] text-neutral-400 font-medium">输入后回车添加</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-xl p-3 bg-neutral-50/20">
                    {scenarios.map((sc, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-neutral-200 text-neutral-700 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        {sc}
                        <button 
                          onClick={() => setScenarios(scenarios.filter(s => s !== sc))}
                          className="text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    <input 
                      type="text"
                      placeholder="+ 添加场景标签..."
                      value={newScenarioInput}
                      onChange={(e) => setNewScenarioInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newScenarioInput.trim()) {
                          e.preventDefault();
                          if (!scenarios.includes(newScenarioInput.trim())) {
                            setScenarios([...scenarios, newScenarioInput.trim()]);
                          }
                          setNewScenarioInput('');
                        }
                      }}
                      className="bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none px-2 py-1 min-w-[120px]"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Editor bottom floating tab controller actions */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/65 flex items-center justify-between">
            <div className="text-[10px] text-neutral-400 font-bold font-mono">
              * 必须完整填写基础配置以激活正常的沙箱环境生成
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setView('list')}
                variant="outline"
                className="h-9 px-5 text-xs text-neutral-600 border-neutral-200 hover:bg-neutral-100 rounded-lg font-bold cursor-pointer bg-white"
              >
                取消修改
              </Button>
              <Button 
                onClick={() => handleSave('草稿')} 
                variant="outline" 
                className="h-9 text-neutral-700 border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs font-bold px-5 cursor-pointer bg-white"
              >
                保存为草稿
              </Button>
              <Button 
                onClick={() => handleSave('已发布')}
                className="h-9 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold shadow-md shadow-orange-500/10 px-6 transition-all border-0 cursor-pointer"
              >
                确认发布项目
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
