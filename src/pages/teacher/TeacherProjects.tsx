import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  HelpCircle, 
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
  Upload, 
  AlertCircle, 
  ChevronRight,
  FolderOpen,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

interface EnvConfig {
  id: string;
  resourcePool: '天翼云资源池1' | '上海园区资源池';
  type: '容器' | '虚机';
  // 容器字段
  sourceFile?: string; // 项目源码文件
  cpuCores?: string;
  memoryGB?: string;
  gpu?: {
    power: string; // 算力
    vram: string;  // 显存
    count: string; // 卡数
  };
  image: string;
  envVariables?: { key: string; value: string }[];
  startCommand?: string;
  // 虚机字段
  vmSpecType?: 'custom' | 'spec'; // 自定义 or 选择规格
  selectedSpec?: string;
  storage?: {
    type: string;
    systemDisk: string;
    dataDisk: string;
  };
  network?: {
    vpc: string;
    subnet: string;
  };
  vncType?: 'caddyVnc' | 'noVnc';
}

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
  image: string;
  courseId?: number | null;
  publicApplyStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  tags?: string[];
  environments?: EnvConfig[];
  range?: '私有' | '租户' | '平台';
  auditStatus?: '待审核' | '已审核' | '已驳回';
}

const CONTAINER_IMAGES = {
  '天翼云资源池1': [
    'ctyun-python:3.10-slim-cpu',
    'ctyun-pytorch:2.1.0-cuda12.1-gpu',
    'ctyun-tensorflow:2.14.0-cuda11.8-gpu',
    'ctyun-openjdk:17-jdk-alpine',
    'ctyun-node:20-alpine'
  ],
  '上海园区资源池': [
    'sh-python:3.11-slim',
    'sh-pytorch:2.2.0-cuda12.1-gpu',
    'sh-tensorflow:2.15.0-cuda12.2-gpu',
    'sh-openjdk:11-jdk-alpine',
    'sh-node:18-alpine'
  ]
};

const VM_IMAGES = {
  '天翼云资源池1': [
    'ctyun-ubuntu-22.04-server-x86_64.qcow2',
    'ctyun-centos-7.9-x86_64.qcow2',
    'ctyun-debian-11.5-x86_64.qcow2',
    'ctyun-windows-server-2022-standard.qcow2'
  ],
  '上海园区资源池': [
    'sh-ubuntu-20.04-server-x86_64.img',
    'sh-centos-8.4-x86_64.img',
    'sh-debian-12.0-x86_64.img',
    'sh-windows-10-enterprise-x64.img'
  ]
};

const VM_SPECS = [
  { value: 'ecs.g6.large', label: '通用计算型 g6.large | 2核 8GB | 无GPU' },
  { value: 'ecs.g6.xlarge', label: '通用计算型 g6.xlarge | 4核 16GB | 无GPU' },
  { value: 'ecs.gn6i-c4g1.xlarge', label: 'GPU计算型 gn6i | 4核 16GB | T4 * 1 (16GB)' },
  { value: 'ecs.gn7i-c8g1.2xlarge', label: 'GPU计算型 gn7i | 8核 32GB | A10G * 1 (24GB)' }
];

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

  // Default covers for premium look
  const defaultCovers = [
    '/shixunnew-v2/images/covers/microsoft_tech_ai_1779333317936.png',
    '/shixunnew-v2/images/covers/microsoft_tech_data_1779333332856.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cloud_1779333396845.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cyber_1779333412582.png',
    '/shixunnew-v2/images/covers/microsoft_tech_dev_1779333430898.png',
    '/shixunnew-v2/images/covers/microsoft_tech_ml_1779333449102.png',
  ];

  // View states (List or Modals)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Search & Filter (Course Module Style)
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTab, setProjectTab] = useState<'all' | '已发布' | '草稿'>('all'); // Match courseTab style

  // Form setup wizard active tab inside Modal
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'env'>('basic');

  // Form states
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'编程项目' | '数据分析项目' | 'AI项目' | '运维项目'>('编程项目');
  const [formDifficulty, setFormDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [formRange, setFormRange] = useState<'私有' | '租户' | '平台'>('私有');
  const [formDuration, setFormDuration] = useState('8');
  const [selectedCover, setSelectedCover] = useState(defaultCovers[0]);
  
  // New States for tags and environment configs
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [formEnvironments, setFormEnvironments] = useState<EnvConfig[]>([]);

  // Floating notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Application for Public State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [projectToApply, setProjectToApply] = useState<Project | null>(null);
  const [applyTargetAudience, setApplyTargetAudience] = useState('');
  const [applyUsageSuggestion, setApplyUsageSuggestion] = useState('');
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');
  const [isApplying, setIsApplying] = useState(false);

  // Mock initial dataset with real courseId assignments and default premium covers
  const [projectsList, setProjectsList] = useState<Project[]>([
    {
      id: 1,
      name: '大语言模型智能客服助理',
      desc: '基于 Llama-3-8B 微调 of the smart customer service system, support RAG search.',
      type: 'AI项目',
      difficulty: '高级',
      duration: '16',
      gitUrl: '',
      baseImage: 'pytorch/pytorch:2.1.0-cuda12.1',
      resources: { cpu: '4 核', memory: '16 GB', gpu: 'NVIDIA T4' },
      scope: {
        positions: ['AI算法工程师', 'NLP开发工程师'],
        skills: ['PyTorch', 'Transformers', 'LangChain'],
        scenarios: ['企业实训', '毕业设计']
      },
      status: '已发布',
      range: '平台',
      auditStatus: '已审核',
      updateTime: '2026/05/24 18:22',
      image: '/shixunnew-v2/images/covers/microsoft_tech_ai_1779333317936.png',
      courseId: 1,
      tags: ['大模型', 'RAG', '深度学习'],
      environments: [
        {
          id: 'env-1',
          resourcePool: '上海园区资源池',
          type: '容器',
          sourceFile: 'ai-chatbot-rag-v1.zip',
          cpuCores: '4',
          memoryGB: '16',
          gpu: { power: 'A10G', vram: '24GB', count: '1' },
          image: 'sh-pytorch:2.2.0-cuda12.1-gpu',
          envVariables: [
            { key: 'MODEL_PATH', value: '/models/Llama-3-8B' },
            { key: 'CUDA_VISIBLE_DEVICES', value: '0' }
          ],
          startCommand: 'python main.py'
        }
      ]
    },
    {
      id: 2,
      name: '分布式高并发电商微服务交易系统',
      desc: '结合 Spring Boot, Redis 缓存, RabbitMQ 异步队列，实现秒杀高可用防御策略。',
      type: '编程项目',
      difficulty: '高级',
      duration: '12',
      gitUrl: '',
      baseImage: 'openjdk:17-jdk-alpine',
      resources: { cpu: '2 核', memory: '8 GB', gpu: '无' },
      scope: {
        positions: ['Java开发工程师', '后端开发工程师'],
        skills: ['Spring Cloud', 'Redis', 'Docker'],
        scenarios: ['企业实训', '工程项目实践']
      },
      status: '已发布',
      range: '租户',
      auditStatus: '已审核',
      updateTime: '2026/05/23 15:45',
      image: '/shixunnew-v2/images/covers/microsoft_tech_dev_1779333430898.png',
      courseId: 2,
      tags: ['微服务', '高并发', 'Redis'],
      environments: [
        {
          id: 'env-2',
          resourcePool: '天翼云资源池1',
          type: '容器',
          sourceFile: 'mall-seckill-code.zip',
          cpuCores: '2',
          memoryGB: '8',
          image: 'ctyun-openjdk:17-jdk-alpine',
          envVariables: [
            { key: 'SPRING_PROFILES_ACTIVE', value: 'prod' }
          ],
          startCommand: 'java -jar app.jar'
        }
      ]
    },
    {
      id: 3,
      name: '多渠道金融流失客户预测分析',
      desc: '获取金融板块流失特征，使用 Pandas/Seaborn 做特征工程，并应用 XGBoost 流失预测。',
      type: '数据分析项目',
      difficulty: '中级',
      duration: '6',
      gitUrl: '',
      baseImage: 'python:3.10-slim',
      resources: { cpu: '1 核', memory: '4 GB', gpu: '无' },
      scope: {
        positions: ['数据分析师', '风控策略分析师'],
        skills: ['Pandas', 'Scikit-Learn', 'XGBoost'],
        scenarios: ['期末大作业', '课程作业']
      },
      status: '草稿',
      range: '私有',
      auditStatus: '待审核',
      updateTime: '2026/05/25 09:12',
      image: '/shixunnew-v2/images/covers/microsoft_tech_data_1779333332856.png',
      courseId: 1,
      tags: ['特征工程', 'XGBoost', '数据挖掘'],
      environments: [
        {
          id: 'env-3',
          resourcePool: '上海园区资源池',
          type: '容器',
          sourceFile: 'churn-analysis.zip',
          cpuCores: '1',
          memoryGB: '4',
          image: 'sh-python:3.11-slim',
          envVariables: [],
          startCommand: 'python predict.py'
        }
      ]
    },
    {
      id: 4,
      name: 'Kubernetes 容器化微服务高可用部署',
      desc: '设计微服务的 Dockerfile，并在 Kubernetes 集群中部署实现滚动更新与自愈伸缩。',
      type: '运维项目',
      difficulty: '中级',
      duration: '8',
      gitUrl: '',
      baseImage: 'ubuntu:22.04',
      resources: { cpu: '2 核', memory: '4 GB', gpu: '无' },
      scope: {
        positions: ['DevOps工程师', '系统运维工程师'],
        skills: ['Kubernetes', 'Docker', 'Prometheus'],
        scenarios: ['云计算实训', '运维工程实践']
      },
      status: '已发布',
      range: '平台',
      auditStatus: '已驳回',
      updateTime: '2026/05/20 11:30',
      image: '/shixunnew-v2/images/covers/microsoft_tech_cloud_1779333396845.png',
      courseId: 3,
      tags: ['K8s', 'Docker', 'DevOps'],
      environments: [
        {
          id: 'env-4',
          resourcePool: '天翼云资源池1',
          type: '虚机',
          image: 'ctyun-ubuntu-22.04-server-x86_64.qcow2',
          vmSpecType: 'spec',
          selectedSpec: 'ecs.g6.large',
          storage: {
            type: 'SSD',
            systemDisk: '50',
            dataDisk: '100'
          },
          network: {
            vpc: 'vpc-ctyun-default',
            subnet: 'subnet-10.100.1.0/24'
          },
          vncType: 'noVnc'
        }
      ]
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNew = () => {
    setCurrentProjectId(null);
    setFormName('');
    setFormDesc('');
    setFormType('编程项目');
    setFormDifficulty('中级');
    setFormRange('私有');
    setFormDuration('8');
    setSelectedCover(defaultCovers[0]);
    setFormTags(['实战', 'Docker']);
    setFormEnvironments([
      {
        id: 'env-' + Date.now(),
        resourcePool: '天翼云资源池1',
        type: '容器',
        sourceFile: '',
        cpuCores: '2',
        memoryGB: '4',
        gpu: { power: '无', vram: '0', count: '0' },
        image: CONTAINER_IMAGES['天翼云资源池1'][0],
        envVariables: [],
        startCommand: 'python main.py'
      }
    ]);
    
    setActiveFormTab('basic');
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    setCurrentProjectId(proj.id);
    setFormName(proj.name);
    setFormDesc(proj.desc);
    setFormType(proj.type);
    setFormDifficulty(proj.difficulty);
    setFormRange(proj.range || '私有');
    setFormDuration(proj.duration);
    setSelectedCover(proj.image || defaultCovers[0]);
    setFormTags(proj.tags || []);
    
    if (proj.environments && proj.environments.length > 0) {
      setFormEnvironments(JSON.parse(JSON.stringify(proj.environments)));
    } else {
      // Fallback for older projects
      const isGpu = proj.resources.gpu && proj.resources.gpu !== '无';
      const defaultEnv: EnvConfig = {
        id: 'env-default-' + Date.now(),
        resourcePool: '天翼云资源池1',
        type: '容器',
        image: proj.baseImage || 'ctyun-python:3.10-slim-cpu',
        cpuCores: proj.resources.cpu.replace(/[^0-9]/g, '') || '2',
        memoryGB: proj.resources.memory.replace(/[^0-9]/g, '') || '4',
        gpu: {
          power: isGpu ? (proj.resources.gpu.includes('T4') ? 'T4' : 'A10G') : '无',
          vram: isGpu ? (proj.resources.gpu.includes('T4') ? '16GB' : '24GB') : '0',
          count: isGpu ? '1' : '0'
        },
        envVariables: [],
        startCommand: 'python main.py'
      };
      setFormEnvironments([defaultEnv]);
    }

    setActiveFormTab('basic');
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSave = (statusToSave?: '草稿' | '已发布') => {
    if (!formName.trim()) {
      showToast('请输入项目名称！');
      return;
    }

    // Set legacy fields for backwards compatibility with list views if any
    const firstEnv = formEnvironments[0];
    const legacyCpu = firstEnv ? (firstEnv.type === '容器' ? `${firstEnv.cpuCores} 核` : (firstEnv.vmSpecType === 'spec' ? '规格' : `${firstEnv.cpuCores} 核`)) : '2 核';
    const legacyMem = firstEnv ? (firstEnv.type === '容器' ? `${firstEnv.memoryGB} GB` : (firstEnv.vmSpecType === 'spec' ? '规格' : `${firstEnv.memoryGB} GB`)) : '4 GB';
    const legacyGpu = firstEnv ? (firstEnv.type === '容器' ? (firstEnv.gpu?.power !== '无' ? firstEnv.gpu?.power || '无' : '无') : (firstEnv.vmSpecType === 'spec' ? '规格' : (firstEnv.gpu?.power !== '无' ? firstEnv.gpu?.power || '无' : '无'))) : '无';

    const existingProj = currentProjectId ? projectsList.find(p => p.id === currentProjectId) : null;
    const finalStatus = statusToSave || (existingProj ? existingProj.status : '草稿');
    const finalRange = formRange;
    const finalAuditStatus = existingProj ? (existingProj.auditStatus || '待审核') : '待审核';

    const newProjectData: Project = {
      id: currentProjectId ? currentProjectId : Date.now(),
      name: formName,
      desc: formDesc,
      type: formType,
      difficulty: formDifficulty,
      duration: formDuration,
      gitUrl: '',
      baseImage: firstEnv?.image || 'python:3.10-slim',
      resources: {
        cpu: legacyCpu,
        memory: legacyMem,
        gpu: legacyGpu
      },
      scope: {
        positions: [],
        skills: formTags,
        scenarios: []
      },
      status: finalStatus,
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      image: selectedCover,
      courseId: currentProjectId ? projectsList.find(p => p.id === currentProjectId)?.courseId : (incomingCourseId || undefined),
      tags: formTags,
      environments: formEnvironments,
      range: finalRange,
      auditStatus: finalAuditStatus
    };

    if (modalMode === 'edit') {
      setProjectsList(projectsList.map(p => p.id === currentProjectId ? newProjectData : p));
      showToast(`成功更新项目「${formName.slice(0, 10)}...」`);
    } else {
      setProjectsList([newProjectData, ...projectsList]);
      showToast(`成功创建项目「${formName.slice(0, 10)}...」并保存`);
    }

    setIsModalOpen(false);
  };


  const handleCopy = (proj: Project) => {
    const copied: Project = {
      ...proj,
      id: Date.now(),
      name: proj.name + ' - 副本',
      status: '草稿',
      updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/-/g, '/'),
      tags: proj.tags ? [...proj.tags] : [],
      environments: proj.environments ? JSON.parse(JSON.stringify(proj.environments)) : []
    };
    setProjectsList([copied, ...projectsList]);
    showToast(`成功复制项目「${proj.name.slice(0, 8)}...」`);
  };

  const handleDelete = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id));
    showToast('项目已成功删除');
  };

  const handlePublish = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, status: '已发布', auditStatus: '已审核' } : p));
    showToast('项目已成功发布');
  };

  const handleCancelPublish = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, status: '草稿', auditStatus: '待审核' } : p));
    showToast('项目已成功取消发布');
  };

  const handleApplyPublic = (proj: Project) => {
    if (proj.status === '草稿') {
      showToast('草稿状态的项目不可用，请先发布。');
      return;
    }
    setProjectToApply(proj);
    setApplyUsageSuggestion('');
    setApplyRange('租户');
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!applyUsageSuggestion.trim()) {
      showToast('请填写完整的申请说明');
      return;
    }
    setIsApplying(true);
    setTimeout(() => {
      setProjectsList(projectsList.map(p => 
        p.id === projectToApply?.id ? { ...p, publicApplyStatus: 'pending', auditStatus: '待审核', range: applyRange } : p
      ));
      setIsApplying(false);
      setIsApplyModalOpen(false);
      showToast('项目公开申请已提交，等待平台超管审核');
    }, 800);
  };

  // Filter projects list
  const filteredProjects = projectsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.scope.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = projectTab === 'all' || p.status === projectTab;
    const matchesCourse = !incomingCourseId || p.courseId === incomingCourseId;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="relative w-full border-t border-neutral-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-neutral-900/95 text-white border border-neutral-800 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-up text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Associated Course Banner */}
      {incomingCourseId && incomingCourseName && (
        <div className="mx-5 mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#fa541c] shrink-0">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-bold text-neutral-800">
                当前管理课程：<span className="text-[#fa541c]">{incomingCourseName}</span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 font-medium">
                在此添加或编辑的项目将自动关联到该课程中。
              </div>
            </div>
          </div>
          {onBackToCourses && (
            <Button 
              variant="outline" 
              onClick={onBackToCourses}
              className="border-orange-200 hover:bg-orange-100/50 text-[#fa541c] hover:text-[#e84a15] h-8 text-xs font-bold px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 返回课程列表
            </Button>
          )}
        </div>
      )}

      {/* TOP CONTROLLER - Styled exactly like Course Search & Filter Controls */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Rounded-full filter capsule - Course style */}
        <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-border/50 self-start">
          {[
            { key: 'all', label: '全部' },
            { key: '已发布', label: '已发布' },
            { key: '草稿', label: '草稿' }
          ].map(tab => (
            <button 
              key={tab.key}
              className={cn(
                "px-6 py-1.5 text-sm rounded-full transition-all duration-200 cursor-pointer font-medium", 
                (projectTab === tab.key) 
                  ? "bg-white text-[#fa541c] font-bold shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-800"
              )}
              onClick={() => setProjectTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Pill Button - Course style */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索项目名称/技能..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-full sm:w-60 transition-all text-neutral-855 bg-white h-9"
            />
          </div>

          <Button 
            onClick={handleCreateNew}
            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 shadow-sm font-bold flex-shrink-0 cursor-pointer border-0 h-9 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> 新建项目
          </Button>
        </div>
      </div>

      {/* TABLE VIEW - Styled exactly like Course management Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap text-[13px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
              <th className="p-4 font-medium w-[35%]">
                <span>项目信息</span>
              </th>
              <th className="p-4 font-medium">项目类型</th>
              <th className="p-4 font-medium">建议时长</th>
              <th className="p-4 font-medium">难度级别</th>
              <th className="p-4 font-medium">容器配置环境</th>
              <th className="p-4 font-medium">算力资源</th>
              <th className="p-4 font-medium">范围</th>
              <th className="p-4 font-medium">状态</th>
              <th className="p-4 font-medium">审核状态</th>
              <th className="p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj, index) => (
              <tr key={proj.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                {/* Project Cover & Basic Info */}
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-neutral-border/50 shadow-sm relative bg-neutral-100">
                      <img 
                        src={proj.image} 
                        alt={proj.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer max-w-[260px] truncate" title={proj.name} onClick={() => handleEditProject(proj)}>
                        {proj.name}
                      </div>
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {proj.tags && proj.tags.length > 0 ? (
                          proj.tags.map((tag, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] border border-neutral-200/60 font-medium">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-neutral-450">无标签</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Project Type */}
                <td className="p-4 text-neutral-600">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-[11px] font-bold border",
                    proj.type === 'AI项目' && "bg-purple-50 text-purple-600 border-purple-200",
                    proj.type === '编程项目' && "bg-orange-50 text-[#fa541c] border-orange-200",
                    proj.type === '数据分析项目' && "bg-blue-50 text-blue-600 border-blue-200",
                    proj.type === '运维项目' && "bg-teal-50 text-teal-600 border-teal-200"
                  )}>
                    {proj.type}
                  </span>
                </td>

                {/* Duration */}
                <td className="p-4 text-neutral-850 font-bold font-mono">
                  {proj.duration} 小时
                </td>

                {/* Difficulty */}
                <td className="p-4">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                    proj.difficulty === '初级' && "bg-green-50 text-green-600 border-green-150",
                    proj.difficulty === '中级' && "bg-orange-50 text-[#fa541c] border-orange-150",
                    proj.difficulty === '高级' && "bg-red-50 text-red-600 border-red-150"
                  )}>
                    {proj.difficulty}
                  </span>
                </td>

                {/* Environment Image */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {proj.environments && proj.environments.length > 0 ? (
                      proj.environments.map((env, i) => (
                        <span key={i} className="text-xs text-neutral-700 max-w-[160px] truncate flex items-center gap-1.5">
                          <span className={cn("px-1.5 py-0.2 rounded text-[9px] font-black border", env.type === '容器' ? "bg-blue-50/80 text-blue-600 border-blue-250" : "bg-purple-50/80 text-purple-600 border-purple-250")}>
                            {env.type}
                          </span>
                          <span className="truncate font-mono" title={env.image}>{env.image.split('/').pop() || env.image}</span>
                        </span>
                      ))
                    ) : (
                      <div className="font-mono text-xs text-neutral-700 max-w-[150px] truncate" title={proj.baseImage}>
                        {proj.baseImage}
                      </div>
                    )}
                  </div>
                </td>

                {/* Computation Resources */}
                <td className="p-4 text-neutral-600">
                  <div className="flex flex-col gap-1">
                    {proj.environments && proj.environments.length > 0 ? (
                      proj.environments.map((env, i) => (
                        <div key={i} className="text-[11px] text-neutral-600 font-sans flex flex-col gap-0.5">
                          {env.type === '容器' ? (
                            <>
                              <div className="flex items-center gap-1 font-mono font-bold text-neutral-800">
                                <span>{env.cpuCores}核</span>
                                <span className="text-neutral-300">/</span>
                                <span>{env.memoryGB}GB</span>
                              </div>
                              {env.gpu && env.gpu.power !== '无' && (
                                <span className="text-[9px] text-purple-600 font-extrabold">{env.gpu.power} ({env.gpu.vram}) * {env.gpu.count}</span>
                              )}
                            </>
                          ) : (
                            <>
                              {env.vmSpecType === 'spec' ? (
                                <span className="font-mono font-bold text-neutral-800 truncate max-w-[120px]" title={env.selectedSpec}>
                                  规格: {env.selectedSpec || '2核 4G'}
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 font-mono font-bold text-neutral-800">
                                  <span>{env.cpuCores}核</span>
                                  <span className="text-neutral-300">/</span>
                                  <span>{env.memoryGB}GB</span>
                                </div>
                              )}
                              {env.gpu && env.gpu.power !== '无' && (
                                <span className="text-[9px] text-purple-600 font-extrabold">{env.gpu.power} ({env.gpu.vram}) * {env.gpu.count}</span>
                              )}
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-semibold text-neutral-800">{proj.resources.cpu}</span>
                          <span className="text-neutral-350">|</span>
                          <span className="font-semibold text-neutral-800">{proj.resources.memory}</span>
                        </div>
                        {proj.resources.gpu !== '无' && (
                          <div className="text-[10px] text-purple-600 font-bold mt-0.5">{proj.resources.gpu} 加速</div>
                        )}
                      </>
                    )}
                  </div>
                </td>

                {/* 范围 */}
                <td className="p-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[12px] font-medium border",
                    proj.range === '平台' && "bg-blue-50/80 text-blue-600 border-blue-200",
                    proj.range === '租户' && "bg-teal-50/80 text-teal-600 border-teal-200",
                    (proj.range === '私有' || !proj.range) && "bg-neutral-50 text-neutral-500 border-neutral-200"
                  )}>
                    {proj.range || '私有'}
                  </span>
                </td>

                {/* Status - Matches course scope styles */}
                <td className="p-4">
                  {proj.status === '已发布' ? (
                    <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded text-[12px] border border-[#ffbb96]">{proj.status}</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[12px] border border-neutral-200">{proj.status}</span>
                  )}
                </td>

                {/* 审核状态 */}
                <td className="p-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[12px] font-medium border",
                    proj.auditStatus === '已审核' && "bg-green-50/80 text-green-600 border-green-200",
                    (proj.auditStatus === '待审核' || !proj.auditStatus) && "bg-amber-50/80 text-amber-600 border-amber-200",
                    proj.auditStatus === '已驳回' && "bg-red-50/80 text-red-600 border-red-200"
                  )}>
                    {proj.auditStatus || '待审核'}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {proj.status === '已发布' ? (
                      <button onClick={() => handleCancelPublish(proj.id)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium">取消发布</button>
                    ) : (
                      <button onClick={() => handlePublish(proj.id)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium">发布</button>
                    )}
                    {proj.publicApplyStatus === 'pending' ? (
                      <span className="text-neutral-400 font-medium">审核中</span>
                    ) : proj.publicApplyStatus === 'approved' ? (
                      <span className="text-emerald-500 font-medium">已公开</span>
                    ) : (
                      <button onClick={() => handleApplyPublic(proj)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium">申请公开</button>
                    )}
                    <button onClick={() => handleEditProject(proj)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium">编辑</button>
                    <button onClick={() => handleCopy(proj)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer font-medium">复制</button>
                    <button onClick={() => handleDelete(proj.id)} className="text-neutral-400 hover:text-neutral-600 transition-colors bg-transparent border-0 cursor-pointer">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProjects.length === 0 && (
          <div className="p-16 text-center text-neutral-400 font-semibold text-xs flex flex-col items-center justify-center gap-2 bg-neutral-50/10">
            <FolderOpen className="w-8 h-8 text-neutral-300" />
            <span>暂无符合条件的实战项目</span>
          </div>
        )}

        {/* PAGINATION - Styled exactly like Course Table Pagination */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2 border-t border-neutral-100">
          <span className="text-[13px] text-neutral-500">共 {filteredProjects.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm">&gt;</Button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>

      {/* PROJECT DIALOG (Create/Edit Modal) - Styled exactly like Course creation dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="w-5 h-5 text-[#fa541c]" /> : <Edit className="w-5 h-5 text-[#fa541c]" />} 
                {modalMode === 'create' ? '新建实战项目' : '编辑实战项目'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Headers for configurations */}
            <div className="flex border-b border-neutral-100 bg-neutral-50/20 text-[11px] font-bold select-none flex-shrink-0">
              {[
                { key: 'basic', label: '1. 基础信息', icon: BookOpen },
                { key: 'env', label: '2. 项目环境', icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFormTab(tab.key as any)}
                  className={cn(
                    "flex-1 py-3 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5",
                    activeFormTab === tab.key 
                      ? "border-[#fa541c] text-[#fa541c] bg-white font-extrabold" 
                      : "border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/40"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content Forms */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 bg-white text-xs">
              
              {/* TAB 1: BASIC INFORMATION */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-850 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 项目名称
                    </label>
                    <input 
                      type="text"
                      placeholder="请输入实战项目标题"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-855"
                    />
                  </div>



                  {/* Project Tags (项目标签) */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex justify-between">
                      <span>🏷️ 项目标签</span>
                      <span className="text-[10px] text-neutral-400 font-normal">回车添加标签</span>
                    </label>
                    <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-lg p-2.5 bg-neutral-50/10">
                      {formTags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all">
                          {tag}
                          <button 
                            type="button"
                            onClick={() => setFormTags(formTags.filter(t => t !== tag))}
                            className="text-[#fa541c]/50 hover:text-red-500 rounded-full p-0.5 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text"
                        placeholder="+ 添加标签"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            if (!formTags.includes(newTagInput.trim())) {
                              setFormTags([...formTags, newTagInput.trim()]);
                            }
                            setNewTagInput('');
                          }
                        }}
                        className="bg-transparent text-xs text-neutral-850 placeholder:text-neutral-450 focus:outline-none px-2 py-0.5 min-w-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 难度级别
                    </label>
                    <div className="flex gap-4">
                      {[
                        { key: '初级', color: 'border-green-350 text-green-650 bg-green-50/15' },
                        { key: '中级', color: 'border-orange-350 text-[#fa541c] bg-orange-50/10' },
                        { key: '高级', color: 'border-red-350 text-red-650 bg-red-50/15' }
                      ].map(level => (
                        <label 
                          key={level.key}
                          onClick={() => setFormDifficulty(level.key as any)}
                          className={cn(
                            "flex-1 border py-2 rounded-xl text-center font-bold cursor-pointer transition-all select-none",
                            formDifficulty === level.key 
                              ? `${level.color} shadow-sm border-2` 
                              : "border-neutral-200 text-neutral-550 hover:bg-neutral-50"
                          )}
                        >
                          {level.key}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 发布范围
                    </label>
                    <div className="flex gap-4">
                      {[
                        { key: '私有', color: 'border-neutral-350 text-neutral-650 bg-neutral-50/15' },
                        { key: '租户', color: 'border-teal-350 text-teal-650 bg-teal-50/15' },
                        { key: '平台', color: 'border-blue-350 text-blue-650 bg-blue-50/15' }
                      ].map(rangeOption => (
                        <label 
                          key={rangeOption.key}
                          onClick={() => setFormRange(rangeOption.key as any)}
                          className={cn(
                            "flex-1 border py-2 rounded-xl text-center font-bold cursor-pointer transition-all select-none",
                            formRange === rangeOption.key 
                              ? `${rangeOption.color} shadow-sm border-2` 
                              : "border-neutral-200 text-neutral-550 hover:bg-neutral-50"
                          )}
                        >
                          {rangeOption.key}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855">项目说明描述</label>
                    <textarea 
                      placeholder="请简述该实战项目背景与核心技术目标描述"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full min-h-[100px] border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#fa541c] resize-none leading-relaxed text-neutral-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-neutral-855 flex items-center gap-1">
                      <span className="text-[#fa541c] font-black">*</span> 项目图片
                    </label>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                      {defaultCovers.map((cover, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedCover(cover)}
                          className={cn(
                            "h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative",
                            selectedCover === cover ? "border-[#fa541c] shadow-md scale-[1.02]" : "border-transparent hover:border-[#fa541c]/50 hover:scale-[1.02]"
                          )}
                        >
                          <img src={cover} alt={`cover-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {selectedCover === cover && (
                            <div className="absolute top-1.5 right-1.5 bg-[#fa541c] text-white rounded-full p-0.5 shadow-sm flex items-center justify-center">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECT ENVIRONMENT (MULTI-INSTANCE CONFIG) */}
              {activeFormTab === 'env' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#fa541c]" />
                      <span className="text-[13px] font-bold text-neutral-800">多实例环境配置 ({formEnvironments.length})</span>
                    </div>
                    <Button 
                      type="button"
                      onClick={() => {
                        const newEnv: EnvConfig = {
                          id: 'env-' + Date.now(),
                          resourcePool: '天翼云资源池1',
                          type: '容器',
                          sourceFile: '',
                          cpuCores: '2',
                          memoryGB: '4',
                          gpu: { power: '无', vram: '0', count: '0' },
                          image: CONTAINER_IMAGES['天翼云资源池1'][0],
                          envVariables: [],
                          startCommand: 'python main.py'
                        };
                        setFormEnvironments([...formEnvironments, newEnv]);
                        showToast('已添加新环境实例');
                      }}
                      className="bg-transparent hover:bg-orange-50 border border-[#fa541c] text-[#fa541c] hover:text-[#e84a15] rounded-lg px-3 py-1.5 h-8 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> 添加环境实例
                    </Button>
                  </div>

                  {formEnvironments.length === 0 && (
                    <div className="border border-dashed border-neutral-200 rounded-xl p-10 text-center space-y-3 bg-neutral-50/20 flex flex-col items-center justify-center">
                      <Cpu className="w-8 h-8 text-neutral-300" />
                      <div>
                        <p className="text-xs font-bold text-neutral-600">暂无配置环境实例</p>
                        <p className="text-[10px] text-neutral-450 mt-1">请点击上方按钮添加至少一个环境配置</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {formEnvironments.map((env, idx) => (
                      <div key={env.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/10 shadow-sm animate-slide-up">
                        {/* Card Header */}
                        <div className="px-4 py-2.5 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-[#fa541c] text-[10px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[12px] font-bold text-neutral-800">
                              环境实例 #{idx + 1} - {env.type} ({env.resourcePool})
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              setFormEnvironments(formEnvironments.filter(e => e.id !== env.id));
                              showToast('已删除环境实例');
                            }}
                            className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors border-0 bg-transparent cursor-pointer"
                            title="删除此环境"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-4 bg-white">
                          {/* Row 1: Resource Pool & Environment Type (Stacked vertically) */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-neutral-600">选择资源池</label>
                              <select
                                value={env.resourcePool}
                                onChange={(e) => {
                                  const updated = [...formEnvironments];
                                  const pool = e.target.value as any;
                                  updated[idx].resourcePool = pool;
                                  // Automatically switch to first image of new pool
                                  const images = updated[idx].type === '容器' ? CONTAINER_IMAGES[pool] : VM_IMAGES[pool];
                                  updated[idx].image = images[0];
                                  setFormEnvironments(updated);
                                }}
                                className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] cursor-pointer"
                              >
                                <option value="天翼云资源池1">天翼云资源池1</option>
                                <option value="上海园区资源池">上海园区资源池</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-neutral-600">选择环境类型</label>
                              <div className="flex bg-neutral-100 rounded-lg p-0.5 border border-neutral-200">
                                {['容器', '虚机'].map(typeOption => (
                                  <button
                                    key={typeOption}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formEnvironments];
                                      const pool = updated[idx].resourcePool;
                                      updated[idx].type = typeOption as any;
                                      // Reset type-specific fields and select default image
                                      const images = typeOption === '容器' ? CONTAINER_IMAGES[pool] : VM_IMAGES[pool];
                                      updated[idx].image = images[0];
                                      if (typeOption === '容器') {
                                        updated[idx].sourceFile = '';
                                        updated[idx].cpuCores = '2';
                                        updated[idx].memoryGB = '4';
                                        updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                        updated[idx].envVariables = [];
                                        updated[idx].startCommand = 'python main.py';
                                      } else {
                                        updated[idx].vmSpecType = 'spec';
                                        updated[idx].selectedSpec = VM_SPECS[0].value;
                                        updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].network = { vpc: 'vpc-default', subnet: 'subnet-1' };
                                        updated[idx].vncType = 'noVnc';
                                      }
                                      setFormEnvironments(updated);
                                    }}
                                    className={cn(
                                      "flex-1 py-1 text-center text-[11px] rounded-md transition-all cursor-pointer font-bold",
                                      env.type === typeOption 
                                        ? "bg-white text-[#fa541c] shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-800"
                                    )}
                                  >
                                    {typeOption}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* CONTAINER SPECIFIC FORM FIELDS */}
                          {env.type === '容器' && (
                            <div className="space-y-4 border-t border-neutral-100 pt-4 animate-in fade-in duration-200">
                              {/* Project Source File Upload */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">项目源码 (源码包文件)</label>
                                <div className="border border-dashed border-neutral-200 hover:border-[#fa541c]/50 rounded-xl p-4 text-center space-y-2 bg-neutral-50/10 transition-all relative">
                                  <input 
                                    type="file" 
                                    accept=".zip,.tar.gz,.tgz"
                                    id={`uploader-${env.id}`}
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const updated = [...formEnvironments];
                                        updated[idx].sourceFile = file.name;
                                        setFormEnvironments(updated);
                                        showToast(`已选择源码: ${file.name}`);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`uploader-${env.id}`}
                                    className="flex flex-col items-center justify-center cursor-pointer gap-1.5"
                                  >
                                    <Upload className="w-5 h-5 text-[#fa541c]" />
                                    <span className="text-[11px] font-bold text-neutral-600">点击选择或拖拽源码文件上传</span>
                                    <span className="text-[9px] text-neutral-400">单文件上限 100MB</span>
                                  </label>
                                  {env.sourceFile && (
                                    <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg inline-block">
                                      ✓ 已就绪: {env.sourceFile}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Select Image */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">选择容器镜像</label>
                                <select
                                  value={env.image}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].image = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] font-mono cursor-pointer"
                                >
                                  {CONTAINER_IMAGES[env.resourcePool].map(img => (
                                    <option key={img} value={img}>{img}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Resource Configuration: CPU, Memory, GPU */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700 flex items-center gap-1">
                                  <Cpu className="w-3.5 h-3.5 text-[#fa541c]" /> 资源配置
                                </h5>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-450 block">CPU 核数</span>
                                    <select
                                      value={env.cpuCores}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        updated[idx].cpuCores = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      {['1', '2', '4', '8', '16'].map(c => (
                                        <option key={c} value={c}>{c}核</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-450 block">内存 GB</span>
                                    <select
                                      value={env.memoryGB}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        updated[idx].memoryGB = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      {['2', '4', '8', '16', '32', '64'].map(m => (
                                        <option key={m} value={m}>{m}GB</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-2 border-t border-neutral-200/60 pt-2">
                                  <span className="text-[10px] text-neutral-450 block font-bold">GPU配置</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">算力</span>
                                      <select
                                        value={env.gpu?.power || '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          if (!updated[idx].gpu) updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                          updated[idx].gpu!.power = e.target.value;
                                          if (e.target.value === '无') {
                                            updated[idx].gpu!.vram = '无';
                                            updated[idx].gpu!.count = '0';
                                          } else if (e.target.value === 'T4') {
                                            updated[idx].gpu!.vram = '16GB';
                                            updated[idx].gpu!.count = '1';
                                          } else if (e.target.value === 'A10G') {
                                            updated[idx].gpu!.vram = '24GB';
                                            updated[idx].gpu!.count = '1';
                                          }
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        <option value="无">无 GPU</option>
                                        <option value="T4">NVIDIA T4</option>
                                        <option value="A10G">NVIDIA A10G</option>
                                      </select>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">显存</span>
                                      <select
                                        value={env.gpu?.vram || '无'}
                                        disabled={env.gpu?.power === '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].gpu!.vram = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                      >
                                        <option value="无">无</option>
                                        <option value="8GB">8GB</option>
                                        <option value="16GB">16GB</option>
                                        <option value="24GB">24GB</option>
                                      </select>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-neutral-400 block">卡数</span>
                                      <select
                                        value={env.gpu?.count || '0'}
                                        disabled={env.gpu?.power === '无'}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].gpu!.count = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                      >
                                        <option value="0">0</option>
                                        <option value="1">1 卡</option>
                                        <option value="2">2 卡</option>
                                        <option value="4">4 卡</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Environment Variable Configuration */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-neutral-600">环境变量配置</label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formEnvironments];
                                      if (!updated[idx].envVariables) updated[idx].envVariables = [];
                                      updated[idx].envVariables!.push({ key: '', value: '' });
                                      setFormEnvironments(updated);
                                    }}
                                    className="text-[#fa541c] hover:text-[#e84a15] text-[10px] font-bold bg-transparent border-0 cursor-pointer flex items-center gap-0.5"
                                  >
                                    <Plus className="w-3 h-3" /> 添加变量
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {env.envVariables && env.envVariables.length > 0 ? (
                                    env.envVariables.map((variable, vIdx) => (
                                      <div key={vIdx} className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          placeholder="KEY (如: API_KEY)"
                                          value={variable.key}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables![vIdx].key = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="flex-1 text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800"
                                        />
                                        <span className="text-neutral-400">=</span>
                                        <input
                                          type="text"
                                          placeholder="VALUE"
                                          value={variable.value}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables![vIdx].value = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="flex-1 text-xs border border-neutral-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...formEnvironments];
                                            updated[idx].envVariables = updated[idx].envVariables!.filter((_, i) => i !== vIdx);
                                            setFormEnvironments(updated);
                                          }}
                                          className="text-neutral-450 hover:text-red-500 p-1 cursor-pointer border-0 bg-transparent"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-[10px] text-neutral-400 italic">暂无环境变量，可点击右上角添加。</p>
                                  )}
                                </div>
                              </div>

                              {/* Container Start Command */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">容器启动命令</label>
                                <input
                                  type="text"
                                  placeholder="例如: python main.py"
                                  value={env.startCommand || ''}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].startCommand = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] font-mono text-neutral-800 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* VM SPECIFIC FORM FIELDS */}
                          {env.type === '虚机' && (
                            <div className="space-y-4 border-t border-neutral-100 pt-4 animate-in fade-in duration-200">
                              {/* Spec selector vs Custom */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600 block">算力配置</label>
                                <div className="flex bg-neutral-100 rounded-lg p-0.5 border border-neutral-200 max-w-max">
                                  {[
                                    { key: 'spec', label: '选择规格' },
                                    { key: 'custom', label: '自定义资源' }
                                  ].map(opt => (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formEnvironments];
                                        updated[idx].vmSpecType = opt.key as any;
                                        setFormEnvironments(updated);
                                      }}
                                      className={cn(
                                        "px-3 py-1 text-center text-[10px] rounded-md transition-all cursor-pointer font-bold",
                                        env.vmSpecType === opt.key 
                                          ? "bg-white text-[#fa541c] shadow-sm"
                                          : "text-neutral-500 hover:text-neutral-800"
                                      )}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {env.vmSpecType === 'spec' ? (
                                <div className="space-y-1.5">
                                  <label className="text-[11px] font-bold text-neutral-600">选择虚机规格</label>
                                  <select
                                    value={env.selectedSpec}
                                    onChange={(e) => {
                                      const updated = [...formEnvironments];
                                      updated[idx].selectedSpec = e.target.value;
                                      setFormEnvironments(updated);
                                    }}
                                    className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] cursor-pointer"
                                  >
                                    {VM_SPECS.map(spec => (
                                      <option key={spec.value} value={spec.value}>{spec.label}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                  <h5 className="text-[11px] font-bold text-neutral-700">自定义虚机规格</h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-neutral-450 block">CPU 核数</span>
                                      <select
                                        value={env.cpuCores}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].cpuCores = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        {['1', '2', '4', '8', '16'].map(c => (
                                          <option key={c} value={c}>{c}核</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <span className="text-[10px] text-neutral-450 block">内存大小 (GB)</span>
                                      <select
                                        value={env.memoryGB}
                                        onChange={(e) => {
                                          const updated = [...formEnvironments];
                                          updated[idx].memoryGB = e.target.value;
                                          setFormEnvironments(updated);
                                        }}
                                        className="w-full text-[11px] border border-neutral-200 rounded p-1 bg-white"
                                      >
                                        {['2', '4', '8', '16', '32', '64'].map(m => (
                                          <option key={m} value={m}>{m}GB</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-2 border-t border-neutral-200/60 pt-2">
                                    <span className="text-[10px] text-neutral-450 block font-bold">GPU规格</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">算力</span>
                                        <select
                                          value={env.gpu?.power || '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            if (!updated[idx].gpu) updated[idx].gpu = { power: '无', vram: '0', count: '0' };
                                            updated[idx].gpu!.power = e.target.value;
                                            if (e.target.value === '无') {
                                              updated[idx].gpu!.vram = '无';
                                              updated[idx].gpu!.count = '0';
                                            } else if (e.target.value === 'T4') {
                                              updated[idx].gpu!.vram = '16GB';
                                              updated[idx].gpu!.count = '1';
                                            } else if (e.target.value === 'A10G') {
                                              updated[idx].gpu!.vram = '24GB';
                                              updated[idx].gpu!.count = '1';
                                            }
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                        >
                                          <option value="无">无 GPU</option>
                                          <option value="T4">NVIDIA T4</option>
                                          <option value="A10G">NVIDIA A10G</option>
                                        </select>
                                      </div>

                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">显存</span>
                                        <select
                                          value={env.gpu?.vram || '无'}
                                          disabled={env.gpu?.power === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].gpu!.vram = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                        >
                                          <option value="无">无</option>
                                          <option value="8GB">8GB</option>
                                          <option value="16GB">16GB</option>
                                          <option value="24GB">24GB</option>
                                        </select>
                                      </div>

                                      <div>
                                        <span className="text-[9px] text-neutral-400 block">卡数</span>
                                        <select
                                          value={env.gpu?.count || '0'}
                                          disabled={env.gpu?.power === '无'}
                                          onChange={(e) => {
                                            const updated = [...formEnvironments];
                                            updated[idx].gpu!.count = e.target.value;
                                            setFormEnvironments(updated);
                                          }}
                                          className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
                                        >
                                          <option value="0">0</option>
                                          <option value="1">1 卡</option>
                                          <option value="2">2 卡</option>
                                          <option value="4">4 卡</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Select Image */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600">选择虚机镜像</label>
                                <select
                                  value={env.image}
                                  onChange={(e) => {
                                    const updated = [...formEnvironments];
                                    updated[idx].image = e.target.value;
                                    setFormEnvironments(updated);
                                  }}
                                  className="w-full text-xs border border-neutral-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:border-[#fa541c] font-mono cursor-pointer"
                                >
                                  {VM_IMAGES[env.resourcePool].map(img => (
                                    <option key={img} value={img}>{img}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Storage configuration */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700">存储配置</h5>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">存储类型</span>
                                    <select
                                      value={env.storage?.type || 'SSD'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.type = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white"
                                    >
                                      <option value="SSD">SSD</option>
                                      <option value="HDD">HDD</option>
                                      <option value="ESSD">ESSD</option>
                                    </select>
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">系统盘 (GB)</span>
                                    <input
                                      type="text"
                                      value={env.storage?.systemDisk || '40'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.systemDisk = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white font-mono"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">数据盘 (GB)</span>
                                    <input
                                      type="text"
                                      value={env.storage?.dataDisk || '100'}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].storage) updated[idx].storage = { type: 'SSD', systemDisk: '40', dataDisk: '100' };
                                        updated[idx].storage!.dataDisk = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-[10px] border border-neutral-200 rounded p-1 bg-white font-mono"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Network Configuration */}
                              <div className="bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 space-y-3">
                                <h5 className="text-[11px] font-bold text-neutral-700">网络配置</h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">VPC</span>
                                    <input
                                      type="text"
                                      placeholder="选择或输入VPC"
                                      value={env.network?.vpc || ''}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].network) updated[idx].network = { vpc: '', subnet: '' };
                                        updated[idx].network!.vpc = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-xs border border-neutral-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#fa541c]"
                                    />
                                  </div>

                                  <div>
                                    <span className="text-[10px] text-neutral-450 block">子网</span>
                                    <input
                                      type="text"
                                      placeholder="选择或输入子网"
                                      value={env.network?.subnet || ''}
                                      onChange={(e) => {
                                        const updated = [...formEnvironments];
                                        if (!updated[idx].network) updated[idx].network = { vpc: '', subnet: '' };
                                        updated[idx].network!.subnet = e.target.value;
                                        setFormEnvironments(updated);
                                      }}
                                      className="w-full text-xs border border-neutral-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#fa541c]"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* VNC Type */}
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-neutral-600 block font-bold">VNC类型</label>
                                <div className="flex gap-4">
                                  {['caddyVnc', 'noVnc'].map(vnc => (
                                    <label
                                      key={vnc}
                                      onClick={() => {
                                        const updated = [...formEnvironments];
                                        updated[idx].vncType = vnc as any;
                                        setFormEnvironments(updated);
                                      }}
                                      className={cn(
                                        "flex-1 border py-2 rounded-lg text-center font-mono text-[11px] font-bold cursor-pointer transition-all select-none",
                                        env.vncType === vnc 
                                          ? "border-[#fa541c] text-[#fa541c] bg-[#fff2e8]/10"
                                          : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                                      )}
                                    >
                                      {vnc}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer - styled exactly like course modal footer */}
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3 flex-shrink-0 bg-neutral-50/50">
              {activeFormTab === 'basic' ? (
                <>
                  <Button 
                    onClick={() => setIsModalOpen(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => setActiveFormTab('env')} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-7 shadow-md shadow-orange-500/20 border-0 cursor-pointer"
                  >
                    下一步
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setActiveFormTab('basic')} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white mr-auto"
                  >
                    上一步
                  </Button>
                  <Button 
                    onClick={() => setIsModalOpen(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={() => handleSave()} 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-7 shadow-md shadow-orange-500/20 border-0 cursor-pointer"
                  >
                    保存
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Application for Public Modal */}
      {isApplyModalOpen && projectToApply && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => !isApplying && setIsApplyModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-neutral-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                申请公开项目
              </h2>
              <button 
                onClick={() => !isApplying && setIsApplyModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors bg-transparent border-0 cursor-pointer"
                disabled={isApplying}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-neutral-50/30 overflow-y-auto space-y-6">
              
              {/* Info Alert */}
              <div className="bg-[#fff2e8] border border-[#ffbb96] rounded-xl p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold mb-1">公开后全平台可见可用</p>
                  <p className="opacity-90">
                    提交申请后，超管将从 <strong>项目完整性、代码质量、文档规范、培训价值</strong> 四个维度进行审核。审核通过后将进入公共资源库。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">项目名称</label>
                  <div className="text-sm text-neutral-600 bg-neutral-100 px-4 py-2.5 rounded-lg border border-neutral-200">
                    {projectToApply.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="flex gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级可见' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户可见' }
                    ].map(opt => (
                      <label 
                        key={opt.key}
                        onClick={() => setApplyRange(opt.key as any)}
                        className={cn(
                          "flex-1 border p-3 rounded-xl cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyRange === opt.key 
                            ? "border-[#fa541c] text-[#fa541c] bg-[#fff2e8]/10"
                            : "border-neutral-200 text-neutral-550 hover:bg-neutral-50"
                        )}
                      >
                        <span className="font-bold text-xs">{opt.label}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    申请说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={applyUsageSuggestion}
                    onChange={(e) => setApplyUsageSuggestion(e.target.value)}
                    placeholder="请描述该项目的申请公开原因及相关说明..."
                    className="w-full text-sm border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3">
              <Button 
                onClick={() => setIsApplyModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-10 px-6 cursor-pointer bg-white"
                disabled={isApplying}
              >
                取消
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-7 shadow-md shadow-orange-500/20 border-0 cursor-pointer flex items-center gap-2"
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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

    </div>
  );
}
