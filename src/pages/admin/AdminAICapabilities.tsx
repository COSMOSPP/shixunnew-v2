import React, { useState, useEffect } from "react";
import { 
  Cpu, Activity, CheckCircle, Clock, Brain, Star, Settings, 
  Trash2, Edit, Play, ArrowRight, Save, Plus, Search, Filter, 
  Layers, RefreshCw, FileText, Sliders, Building, Check, 
  Shield, AlertCircle, Sparkles, Terminal, ToggleLeft, ToggleRight,
  Table, Database
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

interface Tenant {
  id: number;
  name: string;
  tier: "Standard" | "Premium" | "Advanced";
  contact: string;
  quotaUsed: number;
  quotaTotal: number;
  authorizedTools: string[];
  limits: {
    dailyCalls: number;
    tokensTotal: string;
    concurrency: number;
    expireDate: string;
    autoRecycle: boolean;
  };
}

const initialTenants: Tenant[] = [
  {
    id: 1,
    name: "北京大学信息学院",
    tier: "Advanced",
    contact: "王院长",
    quotaUsed: 87,
    quotaTotal: 100,
    authorizedTools: ["DeepSeek-R1", "GPT-4o", "Llama-3-70B", "Whisper-v3", "Stable Diffusion XL"],
    limits: {
      dailyCalls: 100000,
      tokensTotal: "500M",
      concurrency: 100,
      expireDate: "2026-12-31",
      autoRecycle: true
    }
  },
  {
    id: 2,
    name: "清华大学计算机系",
    tier: "Advanced",
    contact: "李教授",
    quotaUsed: 42,
    quotaTotal: 100,
    authorizedTools: ["DeepSeek-R1", "GPT-4o", "Llama-3-70B", "Whisper-v3"],
    limits: {
      dailyCalls: 120000,
      tokensTotal: "600M",
      concurrency: 120,
      expireDate: "2026-11-30",
      autoRecycle: true
    }
  },
  {
    id: 3,
    name: "复旦大学软件学院",
    tier: "Premium",
    contact: "陈主任",
    quotaUsed: 78,
    quotaTotal: 80,
    authorizedTools: ["DeepSeek-R1", "Llama-3-70B", "Whisper-v3"],
    limits: {
      dailyCalls: 50000,
      tokensTotal: "200M",
      concurrency: 50,
      expireDate: "2026-08-15",
      autoRecycle: false
    }
  },
  {
    id: 4,
    name: "百度智能云研发部",
    tier: "Standard",
    contact: "张经理",
    quotaUsed: 24,
    quotaTotal: 30,
    authorizedTools: ["DeepSeek-R1"],
    limits: {
      dailyCalls: 10000,
      tokensTotal: "50M",
      concurrency: 10,
      expireDate: "2026-06-01",
      autoRecycle: true
    }
  }
];

interface AISkill {
  id: number;
  name: string;
  category: "通用技能" | "专业技能";
  type: "文本处理" | "代码生成" | "数据分析" | "知识问答";
  version: string;
  grayPercent: number; // canary release percentage
  inputs: string;
  outputs: string;
  status: "已发布" | "灰度中" | "草稿";
  description: string;
  nodes: string[];
}

const initialSkills: AISkill[] = [
  {
    id: 1,
    name: "智能长文本提炼摘要",
    category: "通用技能",
    type: "文本处理",
    version: "v2.1.0",
    grayPercent: 100,
    inputs: "document: text, max_words: int",
    outputs: "summary: text, keypoints: array",
    status: "已发布",
    description: "高效解析数万字学术论文或长篇报告，自动提炼出多维度的核心结论与思维导图节点。",
    nodes: ["PDF/TEXT预处理", "语义分块向量化", "大模型意图提取", "精简语言合成"]
  },
  {
    id: 2,
    name: "多语言Python单元测试生成",
    category: "专业技能",
    type: "代码生成",
    version: "v1.4.0",
    grayPercent: 30,
    inputs: "source_code: text, framework: string",
    outputs: "test_code: text, coverage_estimation: float",
    status: "灰度中",
    description: "输入任意Python业务逻辑代码，自动推理边界测试场景并生成高覆盖率的Pytest单元测试。",
    nodes: ["AST语法树分析", "测试场景自动演绎", "DeepSeek代码谱写", "断言智能合成"]
  },
  {
    id: 3,
    name: "智能SQL多源数据库查询生成",
    category: "专业技能",
    type: "数据分析",
    version: "v3.0.2",
    grayPercent: 100,
    inputs: "user_question: text, db_schema: text",
    outputs: "sql_query: text, query_plan: string",
    status: "已发布",
    description: "精准理解自然语言业务提问，关联数据库表结构与多表外键关联，零失误生成多层级SQL。",
    nodes: ["Schema实体关联识别", "自然语言转DSL", "SQL合规及安全拦截", "执行计划调优评估"]
  },
  {
    id: 4,
    name: "学术实训知识库精准问答",
    category: "通用技能",
    type: "知识问答",
    version: "v1.1.0",
    grayPercent: 0,
    inputs: "query: text, kb_ids: array, threshold: float",
    outputs: "answer: text, source_references: array",
    status: "草稿",
    description: "基于企业级密级知识库，支持融合检索与重排算法，提供可溯源的精准事实回答，完全规避幻觉。",
    nodes: ["Query向量编码", "RAG多路召回检索", "Cross-Encoder重排过滤", "LLM长上下文归纳回复"]
  }
];

interface AgentConfig {
  id: number;
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  boundSkills: string[];
  boundKnowledgeBases: string[];
  triggerKeywords: string[];
  intentTriggers: string[];
  responseTemplate: string;
  humanHandoffConditions: string[];
  environment: "Dev" | "Test" | "Prod";
  version: string;
}

const initialAgents: AgentConfig[] = [
  {
    id: 1,
    name: "教学AI出题与智能评阅助手",
    model: "DeepSeek-R1 (推理增强)",
    temperature: 0.2,
    maxTokens: 4096,
    boundSkills: ["智能长文本提炼摘要", "多语言Python单元测试生成"],
    boundKnowledgeBases: ["计算机网络实训教学大纲", "2026全国考研大纲"],
    triggerKeywords: ["出题", "试卷", "生成题目", "打分", "作业评判"],
    intentTriggers: ["考试题库扩充意图", "主观题答卷自动化评判"],
    responseTemplate: "您好！我是您的智能教学出题助手。根据您的输入主题【{topic}】，我已经调取了【{skills}】技能与【{kb}】知识库，为您量身定制了以下题目：\n\n1. 题目: ... \n2. 答案及深度解析: ...",
    humanHandoffConditions: ["学生对评分产生强烈异议", "系统连续三次无法分类异常作答", "涉及教师敏感配置修改"],
    environment: "Prod",
    version: "v2.5"
  },
  {
    id: 2,
    name: "全栈编程智能实训指导师",
    model: "Llama-3-70B-Instruct",
    temperature: 0.5,
    maxTokens: 2048,
    boundSkills: ["多语言Python单元测试生成", "智能SQL多源数据库查询生成"],
    boundKnowledgeBases: ["企业级Python开发编码规范", "MySQL性能调优手册"],
    triggerKeywords: ["写代码", "代码报错", "SQL报错", "怎么优化", "找BUG"],
    intentTriggers: ["代码编写辅助", "异常日志分析重构", "数据库调优提示"],
    responseTemplate: "同学你好！针对你遇到的代码/SQL问题，我已经进行了深度AST分析。以下是推荐的重构方案：\n\n```python\n# 优化后的代码\n```\n优化原理: ",
    humanHandoffConditions: ["学生连续提交无效代码且处于高焦虑度", "沙箱编译环境底层物理网络受阻"],
    environment: "Test",
    version: "v1.8"
  }
];

// Available tools for checklist
const allAITools = [
  { id: "DeepSeek-R1", type: "LLM大模型", desc: "最新开源超强深度推理大模型" },
  { id: "GPT-4o", type: "LLM大模型", desc: "高性价比全能多模态闭源模型" },
  { id: "Llama-3-70B", type: "LLM大模型", desc: "Meta开源高性能700亿参数大模型" },
  { id: "Whisper-v3", type: "语音大模型", desc: "高精度多语种实时语音识别" },
  { id: "Stable Diffusion XL", type: "视觉大模型", desc: "电影级逼真细节文生图与编辑" }
];

export default function AdminAICapabilities() {
  const [activeTab, setActiveTab] = useState<"auth" | "skills" | "agents">("auth");

  // --- States for AI工具授权 (Tab 1) ---
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState<number>(1);
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  // Auth editing wizard state
  const [wizardTools, setWizardTools] = useState<string[]>([]);
  const [wizardDailyLimit, setWizardDailyLimit] = useState<number>(100000);
  const [wizardTokensQuota, setWizardTokensQuota] = useState<string>("500M");
  const [wizardConcurrency, setWizardConcurrency] = useState<number>(100);
  const [wizardExpireDate, setWizardExpireDate] = useState<string>("2026-12-31");
  const [wizardAutoRecycle, setWizardAutoRecycle] = useState<boolean>(true);
  const [showAuthSuccessFlash, setShowAuthSuccessFlash] = useState<boolean>(false);

  // Sync wizard inputs when active tenant changes
  useEffect(() => {
    if (currentTenant) {
      setWizardTools(currentTenant.authorizedTools);
      setWizardDailyLimit(currentTenant.limits.dailyCalls);
      setWizardTokensQuota(currentTenant.limits.tokensTotal);
      setWizardConcurrency(currentTenant.limits.concurrency);
      setWizardExpireDate(currentTenant.limits.expireDate);
      setWizardAutoRecycle(currentTenant.limits.autoRecycle);
    }
  }, [selectedTenantId]);

  const handleToggleToolCheckbox = (toolId: string) => {
    if (wizardTools.includes(toolId)) {
      setWizardTools(wizardTools.filter(t => t !== toolId));
    } else {
      setWizardTools([...wizardTools, toolId]);
    }
  };

  const handleSaveAuthorization = () => {
    const updatedTenants = tenants.map(t => {
      if (t.id === selectedTenantId) {
        return {
          ...t,
          authorizedTools: wizardTools,
          limits: {
            dailyCalls: wizardDailyLimit,
            tokensTotal: wizardTokensQuota,
            concurrency: wizardConcurrency,
            expireDate: wizardExpireDate,
            autoRecycle: wizardAutoRecycle
          }
        };
      }
      return t;
    });
    setTenants(updatedTenants);
    setShowAuthSuccessFlash(true);
    setTimeout(() => setShowAuthSuccessFlash(false), 4000);
  };

  // --- States for Skills库管理 (Tab 2) ---
  const [skills, setSkills] = useState<AISkill[]>(initialSkills);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>("All");
  const [skillTypeFilter, setSkillTypeFilter] = useState<string>("All");

  // Effect testing modal
  const [testingSkill, setTestingSkill] = useState<AISkill | null>(null);
  const [testInputText, setTestInputText] = useState("");
  const [testOutputText, setTestOutputText] = useState("");
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Skill Creation Modal
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<"通用技能" | "专业技能">("通用技能");
  const [newSkillType, setNewSkillType] = useState<"文本处理" | "代码生成" | "数据分析" | "知识问答">("文本处理");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [newSkillInputs, setNewSkillInputs] = useState("");
  const [newSkillOutputs, setNewSkillOutputs] = useState("");
  const [newSkillNodes, setNewSkillNodes] = useState<string[]>([]);
  const [newSkillNodeInput, setNewSkillNodeInput] = useState("");

  const handleAddSkillNode = () => {
    if (newSkillNodeInput.trim()) {
      setNewSkillNodes([...newSkillNodes, newSkillNodeInput.trim()]);
      setNewSkillNodeInput("");
    }
  };

  const handleSaveNewSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: AISkill = {
      id: Date.now(),
      name: newSkillName,
      category: newSkillCategory,
      type: newSkillType,
      version: "v1.0.0",
      grayPercent: 100,
      inputs: newSkillInputs || "input: string",
      outputs: newSkillOutputs || "output: string",
      status: "已发布",
      description: newSkillDesc || "暂无技能描述信息",
      nodes: newSkillNodes.length > 0 ? newSkillNodes : ["核心模型解析"]
    };
    setSkills([newSkill, ...skills]);
    setIsCreateSkillOpen(false);

    // Reset values
    setNewSkillName("");
    setNewSkillDesc("");
    setNewSkillInputs("");
    setNewSkillOutputs("");
    setNewSkillNodes([]);
  };

  const handleTestSkillSubmit = () => {
    if (!testInputText.trim()) return;
    setIsTestLoading(true);
    setTestOutputText("");
    setTimeout(() => {
      setIsTestLoading(false);
      if (testingSkill?.type === "文本处理") {
        setTestOutputText(`[系统反馈] 分析处理成功！\n【提炼主旨】: 该实训项目重点阐述了AI深度工程落地实践流程。\n【核心脑图节点】:\n- 一、前置环境准备与租户隔离\n- 二、AI工具差异化授权及参数约束\n- 三、多技能编排灰度发布回滚`);
      } else if (testingSkill?.type === "代码生成") {
        setTestOutputText(`# pytest unit test generated for python code\nimport pytest\nfrom typing import Dict\n\ndef test_business_logic():\n    # Test boundary conditions\n    assert run_action(5) == "Expected Success"\n    with pytest.raises(ValueError):\n        run_action(-1)`);
      } else if (testingSkill?.type === "数据分析") {
        setTestOutputText(`-- Synthesized SQL Queries for MySQL Schema\nSELECT tenant_name, count(tool_id) AS total_tools \nFROM tenant_authorizations ta \nJOIN tenant_details td ON ta.tenant_id = td.id\nWHERE ta.expiration_date > NOW()\nGROUP BY tenant_name\nHAVING total_tools >= 3;`);
      } else {
        setTestOutputText(`[知识库检索精确应答]\n找到相关关联文献: [计算机网络实训大纲.pdf:L123]\n事实回答: 本系统采用基于Cos-Sim的多源向量混合检索机制。对匹配分低于0.65的高噪提问将予以策略拦截并推荐相似关键词，完全规避大模型业务场景的胡言乱语。`);
      }
    }, 1500);
  };

  const handleUpdateGrayRelease = (skillId: number, newPercent: number) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          grayPercent: newPercent,
          status: newPercent === 100 ? "已发布" : newPercent === 0 ? "草稿" : "灰度中"
        };
      }
      return s;
    }));
  };

  const handleRollbackSkill = (skillId: number) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          version: `v${parseFloat(s.version.replace("v", "")) - 1}.0`,
          grayPercent: 100,
          status: "已发布"
        };
      }
      return s;
    }));
    alert("已触发安全回滚！技能包版本已成功回退到前一稳定状态。");
  };

  // --- States for 智能体配置 (Tab 3) ---
  const [agents, setAgents] = useState<AgentConfig[]>(initialAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<number>(1);
  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const [agentEnv, setAgentEnv] = useState<"Dev" | "Test" | "Prod">("Prod");

  // Config parameters editing state
  const [cfgName, setCfgName] = useState("");
  const [cfgModel, setCfgModel] = useState("");
  const [cfgTemp, setCfgTemp] = useState(0.5);
  const [cfgMaxTokens, setCfgMaxTokens] = useState(2048);
  const [cfgSkills, setCfgSkills] = useState<string[]>([]);
  const [cfgKbs, setCfgKbs] = useState<string[]>([]);
  const [cfgKeywords, setCfgKeywords] = useState<string[]>([]);
  const [cfgIntents, setCfgIntents] = useState<string[]>([]);
  const [cfgTemplate, setCfgTemplate] = useState("");
  const [cfgHandoff, setCfgHandoff] = useState<string[]>([]);

  // Input string helpers
  const [keywordInput, setKeywordInput] = useState("");
  const [intentInput, setIntentInput] = useState("");
  const [handoffInput, setHandoffInput] = useState("");

  const [isPublishingAgent, setIsPublishingAgent] = useState(false);
  const [publishingAgentProgress, setPublishingAgentProgress] = useState(0);
  const [showPublishSuccessFlash, setShowPublishSuccessFlash] = useState(false);

  // Sync states when selected agent or environment changes
  useEffect(() => {
    if (currentAgent) {
      setCfgName(currentAgent.name);
      setCfgModel(currentAgent.model);
      setCfgTemp(currentAgent.temperature);
      setCfgMaxTokens(currentAgent.maxTokens);
      setCfgSkills(currentAgent.boundSkills);
      setCfgKbs(currentAgent.boundKnowledgeBases);
      setCfgKeywords(currentAgent.triggerKeywords);
      setCfgIntents(currentAgent.intentTriggers);
      setCfgTemplate(currentAgent.responseTemplate);
      setCfgHandoff(currentAgent.humanHandoffConditions);
      setAgentEnv(currentAgent.environment);
    }
  }, [selectedAgentId]);

  const handleSaveAgentLocalConfig = () => {
    setAgents(agents.map(a => {
      if (a.id === selectedAgentId) {
        return {
          ...a,
          name: cfgName,
          model: cfgModel,
          temperature: cfgTemp,
          maxTokens: cfgMaxTokens,
          boundSkills: cfgSkills,
          boundKnowledgeBases: cfgKbs,
          triggerKeywords: cfgKeywords,
          intentTriggers: cfgIntents,
          responseTemplate: cfgTemplate,
          humanHandoffConditions: cfgHandoff,
          environment: agentEnv
        };
      }
      return a;
    }));
    alert("智能体本地工作区配置已保存！可进一步点击下方的『一键发布』推送到服务器多环境。");
  };

  const handleOneClickPublishAgent = () => {
    setIsPublishingAgent(true);
    setPublishingAgentProgress(10);
    
    const interval = setInterval(() => {
      setPublishingAgentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPublishingAgent(false);
            setShowPublishSuccessFlash(true);
            // Increment version
            setAgents(prevAgents => prevAgents.map(a => {
              if (a.id === selectedAgentId) {
                const nextVer = (parseFloat(a.version.replace("v", "")) + 0.1).toFixed(1);
                return { ...a, version: `v${nextVer}` };
              }
              return a;
            }));
            setTimeout(() => setShowPublishSuccessFlash(false), 3000);
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(skillSearchQuery.toLowerCase());
    const matchesCategory = skillCategoryFilter === "All" || skill.category === skillCategoryFilter;
    const matchesType = skillTypeFilter === "All" || skill.type === skillTypeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6 min-h-full">
      {/* Title Header with top-tab links style referencing teacher datasets tab bar */}
      <div className="flex flex-col gap-5 bg-white p-6 border border-neutral-100 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">AI能力管理</h1>
            <p className="text-sm text-neutral-500 mt-1">管理各租户的AI工具和模型授权配额，编排复用Skills包，并对智能体触发和多环境配置进行一键灰度发布发布与回收控制</p>
          </div>
        </div>
        
        {/* Top flat tabs (referencing the mockup) */}
        <div className="flex items-center gap-8 border-b border-neutral-200/60 pb-3 shrink-0">
          <button 
            onClick={() => setActiveTab("auth")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "auth" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            AI工具授权
            {activeTab === "auth" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("skills")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "skills" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            Skills库管理
            {activeTab === "skills" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("agents")}
            className={cn(
              "text-[15px] font-bold pb-2 relative transition-all cursor-pointer bg-transparent border-none",
              activeTab === "agents" 
                ? "text-[#fa541c]" 
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            智能体配置
            {activeTab === "agents" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-[#fa541c] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AI工具授权 Tab Content */}
      {/* ========================================================================= */}
      {activeTab === "auth" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Tenant List Selector */}
          <div className="lg:col-span-4 bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
              <span className="font-bold text-neutral-800 text-xs tracking-wider uppercase">选择租户进行授权</span>
              <Building className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="divide-y divide-neutral-100">
              {tenants.map(tenant => {
                const isActive = tenant.id === selectedTenantId;
                return (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex flex-col gap-2 relative",
                      isActive ? "bg-[#fff2e8]/45 border-l-4 border-[#fa541c]" : ""
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn("text-xs font-bold transition-colors", isActive ? "text-[#fa541c]" : "text-neutral-800")}>
                        {tenant.name}
                      </span>
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-bold rounded",
                        tenant.tier === "Advanced" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                        tenant.tier === "Premium" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                        "bg-neutral-50 text-neutral-500 border border-neutral-200"
                      )}>
                        {tenant.tier === "Advanced" ? "高级租户" : tenant.tier === "Premium" ? "优质租户" : "普通租户"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                      <span>接口对接人: {tenant.contact}</span>
                      <span className="text-[#fa541c] font-semibold">{tenant.authorizedTools.length} 款AI能力</span>
                    </div>

                    {/* Progress of Quota */}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>本月Token额度占比</span>
                        <span>{tenant.quotaUsed}/{tenant.quotaTotal}M ({(tenant.quotaUsed / tenant.quotaTotal * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#fa541c] h-full rounded-full transition-all duration-300"
                          style={{ width: `${(tenant.quotaUsed / tenant.quotaTotal * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Step-by-Step Authorization Configurator */}
          <div className="lg:col-span-8 space-y-6">
            {/* Success flash notice */}
            {showAuthSuccessFlash && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-3 animate-fade-in shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">差异化授权更新成功！</span>
                  已为 <span className="underline font-semibold">{currentTenant.name}</span> 重新定制了AI工具链授权方案，并设定了严密的并发拦截与 Token 额度上限。
                </div>
              </div>
            )}

            <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-800">
                      AI能力授权配置面板 - {currentTenant.name}
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">高级租户可分配更多低延时专属推理模型并支持更大并发QPS额度</p>
                  </div>
                </div>
                <button 
                  onClick={handleSaveAuthorization}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> 确认保存授权
                </button>
              </div>

              {/* Wizard Steps Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left col: Tool Selection (Step 2 of the workflow) */}
                <div className="space-y-4 border-r border-neutral-100/60 pr-0 md:pr-6">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span className="text-xs font-bold text-neutral-800">勾选可用AI能力工具包</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {allAITools.map(tool => {
                      const isChecked = wizardTools.includes(tool.id);
                      return (
                        <div 
                          key={tool.id}
                          onClick={() => handleToggleToolCheckbox(tool.id)}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 hover:border-[#fa541c]/50 bg-neutral-50/20",
                            isChecked 
                              ? "border-[#fa541c] bg-[#fff2e8]/15" 
                              : "border-neutral-200"
                          )}
                        >
                          <button
                            type="button"
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all mt-0.5",
                              isChecked ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300"
                            )}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-neutral-800">{tool.id}</span>
                              <span className="px-1.5 py-0.2 bg-neutral-100 text-neutral-500 rounded text-[9px] font-medium border border-neutral-200">{tool.type}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">{tool.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right col: Quota limit details (Step 3 of the workflow) */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="text-xs font-bold text-neutral-800">设置调用约束、频率及Token总量配额</span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Dimension: Daily Calls */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 flex items-center justify-between">
                        <span>单日调用上限 (次数)</span>
                        <span className="text-neutral-400 text-[10px]">频率约束维度</span>
                      </label>
                      <input 
                        type="number"
                        value={wizardDailyLimit}
                        onChange={(e) => setWizardDailyLimit(parseInt(e.target.value) || 0)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-semibold"
                      />
                    </div>

                    {/* Dimension: Tokens quota */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 flex items-center justify-between">
                        <span>Token 总量配额</span>
                        <span className="text-neutral-400 text-[10px]">额度消耗总量</span>
                      </label>
                      <input 
                        type="text"
                        value={wizardTokensQuota}
                        onChange={(e) => setWizardTokensQuota(e.target.value)}
                        placeholder="例如 500M / 1B"
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-semibold"
                      />
                    </div>

                    {/* Dimension: Concurrency */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 flex items-center justify-between">
                        <span>并发限制数 (QPS)</span>
                        <span className="text-neutral-400 text-[10px]">并发约束维度</span>
                      </label>
                      <input 
                        type="number"
                        value={wizardConcurrency}
                        onChange={(e) => setWizardConcurrency(parseInt(e.target.value) || 0)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-semibold"
                      />
                    </div>

                    {/* Dimension: Expiry Date */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-600">授权到期日期</label>
                        <input 
                          type="date"
                          value={wizardExpireDate}
                          onChange={(e) => setWizardExpireDate(e.target.value)}
                          className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-neutral-600">到期自动回收</label>
                        <div 
                          onClick={() => setWizardAutoRecycle(!wizardAutoRecycle)}
                          className="flex items-center gap-2.5 py-1.5 cursor-pointer text-xs select-none"
                        >
                          {wizardAutoRecycle ? (
                            <ToggleRight className="w-8 h-8 text-[#fa541c]" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-neutral-300" />
                          )}
                          <span className="text-[11px] text-neutral-500 font-medium">{wizardAutoRecycle ? "开启回收" : "到期不回收"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Warning Box */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg text-[11px] text-amber-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>注意：</strong> 按租户差异化授权时，请确保高级租户对应的并发限制（QPS）和Token分配在其合约范围内。如果触发了到期自动回收，系统将会在指定截止时间零点彻底冻结工具接口，并自动归还算力资源到AI配额池中。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Skills库管理 Tab Content */}
      {/* ========================================================================= */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          {/* Filters & Control Panel styled exactly like dataset filters row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Category Filter Tab Selector */}
              <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60">
                <button 
                  className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200 cursor-pointer", skillCategoryFilter === 'All' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
                  onClick={() => setSkillCategoryFilter('All')}
                >
                  全部
                </button>
                <button 
                  className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200 cursor-pointer", skillCategoryFilter === '通用技能' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
                  onClick={() => setSkillCategoryFilter('通用技能')}
                >
                  通用技能
                </button>
                <button 
                  className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200 cursor-pointer", skillCategoryFilter === '专业技能' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
                  onClick={() => setSkillCategoryFilter('专业技能')}
                >
                  专业技能
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              {/* Type filter */}
              <div className="relative">
                <select 
                  value={skillTypeFilter}
                  onChange={(e) => setSkillTypeFilter(e.target.value)}
                  className="appearance-none border border-neutral-200 rounded-full pl-4 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer h-8"
                >
                  <option value="All">所有技能类型</option>
                  <option value="文本处理">文本处理</option>
                  <option value="代码生成">代码生成</option>
                  <option value="数据分析">数据分析</option>
                  <option value="知识问答">知识问答</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="搜索AI技能名称" 
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-8"
                />
              </div>

              {/* Add Button */}
              <button 
                onClick={() => setIsCreateSkillOpen(true)}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 h-8 text-[13px] shadow-sm shrink-0 flex items-center gap-1 cursor-pointer font-bold"
              >
                <Plus className="w-4 h-4" /> 增设AI技能
              </button>
            </div>
          </div>

          {/* Create Skill Form Overlay (Modal) */}
          {isCreateSkillOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl border border-neutral-100 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 animate-scale-up space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-sm font-bold text-neutral-800">新建可复用 AI 技能模块</h3>
                  <button 
                    onClick={() => setIsCreateSkillOpen(false)}
                    className="text-neutral-400 hover:text-neutral-600 text-xs font-semibold cursor-pointer"
                  >
                    取消
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">技能名称</label>
                    <input 
                      type="text" 
                      placeholder="例如: 大模型PDF摘要分析..."
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                    />
                  </div>

                  {/* Grid fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">技能分类</label>
                      <select 
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white"
                      >
                        <option value="通用技能">通用技能</option>
                        <option value="专业技能">专业技能</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">技能类型</label>
                      <select 
                        value={newSkillType}
                        onChange={(e) => setNewSkillType(e.target.value as any)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white"
                      >
                        <option value="文本处理">文本处理</option>
                        <option value="代码生成">代码生成</option>
                        <option value="数据分析">数据分析</option>
                        <option value="知识问答">知识问答</option>
                      </select>
                    </div>
                  </div>

                  {/* Desc */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">描述信息</label>
                    <textarea 
                      placeholder="简单说明技能的使用场景和推理效果..."
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      rows={2}
                      className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 resize-none"
                    />
                  </div>

                  {/* IO parameters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">输入参数定义 (Input Schema)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. text_input: string"
                        value={newSkillInputs}
                        onChange={(e) => setNewSkillInputs(e.target.value)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-700">输出参数定义 (Output Schema)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. output_data: text"
                        value={newSkillOutputs}
                        onChange={(e) => setNewSkillOutputs(e.target.value)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white text-neutral-800"
                      />
                    </div>
                  </div>

                  {/* Nodes Orchestrator */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-700 block">编排技能流环节 (多节点组合流)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="输入节点名称，如：LLM解析关键信息"
                        value={newSkillNodeInput}
                        onChange={(e) => setNewSkillNodeInput(e.target.value)}
                        className="flex-1 border border-neutral-200 rounded px-3 py-1.5 text-xs focus:outline-none bg-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkillNode();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddSkillNode}
                        className="bg-neutral-100 border border-neutral-200 px-3 text-xs font-semibold rounded text-neutral-700 hover:bg-neutral-200"
                      >
                        加入节点
                      </button>
                    </div>

                    {newSkillNodes.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-2 items-center bg-neutral-50 p-2.5 rounded border border-dashed border-neutral-200">
                        {newSkillNodes.map((nd, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded px-2.5 py-1 text-[10px] font-medium text-neutral-700">
                            <span>{nd}</span>
                            <span className="text-neutral-400 font-bold">#{idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-neutral-400 italic">未配置工作流节点时，系统将默认采用单模型直接回复。</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsCreateSkillOpen(false)}
                    className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveNewSkill}
                    disabled={!newSkillName.trim()}
                    className="px-4 py-2 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    增设并发布
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Effect Testing Overlay (Modal) */}
          {testingSkill && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl border border-neutral-100 max-w-2xl w-full p-6 animate-scale-up space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded text-[10px] font-bold">{testingSkill.type}</span>
                    <h3 className="text-sm font-bold text-neutral-800">
                      测试技能模块: {testingSkill.name} ({testingSkill.version})
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setTestingSkill(null);
                      setTestInputText("");
                      setTestOutputText("");
                    }}
                    className="text-neutral-400 hover:text-neutral-600 text-xs font-semibold cursor-pointer"
                  >
                    关闭测试
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-700 block">测试输入参数 ({testingSkill.inputs})</label>
                    <textarea 
                      rows={6}
                      placeholder="在此处填写符合输入定义的测试文本..."
                      value={testInputText}
                      onChange={(e) => setTestInputText(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 resize-none font-mono"
                    />
                    <button 
                      onClick={handleTestSkillSubmit}
                      disabled={!testInputText.trim() || isTestLoading}
                      className="w-full bg-[#fa541c] hover:bg-[#e84a15] text-white py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isTestLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 推理运行中...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> 运行效果测试
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: Output */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[11px] font-bold text-neutral-700 block">技能执行流输出 ({testingSkill.outputs})</label>
                    <div className="flex-1 bg-neutral-900 rounded-lg p-3.5 font-mono text-[11px] text-green-400 overflow-y-auto min-h-[160px] max-h-[220px] whitespace-pre-wrap border border-neutral-800">
                      {isTestLoading ? (
                        <div className="flex items-center gap-2 text-neutral-400 animate-pulse">
                          <span>$ executing nodes...</span>
                        </div>
                      ) : testOutputText ? (
                        testOutputText
                      ) : (
                        <span className="text-neutral-500 italic">$ 运行后此处将显示流输出报文...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nodes display in Modal */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">执行流流向 (Nodes Flow)</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {testingSkill.nodes.map((node, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />}
                        <span className="bg-white border border-neutral-200 rounded px-2 py-1 text-[10px] font-medium text-neutral-700">
                          {node}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout of Skills (matching the dataset card style mock perfectly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map(skill => {
              const getIconByType = (type: string) => {
                switch(type) {
                  case '文本处理': return <FileText className="w-5 h-5 text-blue-500" />;
                  case '代码生成': return <Cpu className="w-5 h-5 text-emerald-500" />;
                  case '数据分析': return <Table className="w-5 h-5 text-purple-500" />;
                  case '知识问答': return <Database className="w-5 h-5 text-teal-500" />;
                  default: return <Brain className="w-5 h-5 text-gray-500" />;
                }
              };

              return (
                <div key={skill.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col hover:-translate-y-1 relative">
                  {/* Category Tag matching mockup */}
                  <div className={cn(
                    "absolute top-0 right-0 text-[10px] font-bold px-2.5 py-1 rounded-bl-lg",
                    skill.category === '通用技能' ? "bg-[#fff2e8] text-[#fa541c]" : "bg-blue-50 text-blue-600"
                  )}>
                    {skill.category === '通用技能' ? "通用技能" : "专业技能"}
                  </div>
                  
                  <div className="p-6 flex-1 relative">
                    <div className="flex items-start gap-4">
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0">
                        {getIconByType(skill.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[15px] text-neutral-800 truncate group-hover:text-[#fa541c] transition-colors">{skill.name}</h3>
                        <p className="text-[12px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                    
                    {/* Tags matching mockup */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-neutral-50 text-neutral-600 rounded text-[11px] border border-neutral-200 font-mono">
                        {skill.version}
                      </span>
                      <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded text-[11px] border border-[#ffbb96] font-medium">
                        灰度 {skill.grayPercent}%
                      </span>
                      {skill.nodes.slice(0, 2).map((node, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[11px] border border-neutral-200">
                          {node}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stat Grid matching mockup exactly */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] bg-neutral-50/50 rounded-lg py-2 border border-neutral-100/50">
                      <div>
                        <div className="text-neutral-400 text-[10px]">类型</div>
                        <div className="font-medium text-neutral-700 mt-0.5">{skill.type}</div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-[10px]">输入</div>
                        <div className="font-medium text-neutral-700 mt-0.5 max-w-full truncate px-1" title={skill.inputs}>
                          {skill.inputs.split(':')[0]}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-400 text-[10px]">节点数</div>
                        <div className="font-medium text-neutral-700 mt-0.5">{skill.nodes.length}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer Actions */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                    <div className="text-[12px] text-neutral-400">更新于 2026-05-27</div>
                    
                    {/* Buttons on Hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Rollback */}
                      <button 
                        onClick={() => handleRollbackSkill(skill.id)}
                        disabled={skill.version === "v1.0.0"}
                        className="p-1.5 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors disabled:opacity-30 cursor-pointer" 
                        title="安全回滚"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      {/* Test */}
                      <button 
                        onClick={() => setTestingSkill(skill)}
                        className="p-1.5 text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors flex items-center justify-center cursor-pointer" 
                        title="效果测试"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      {/* Delete */}
                      <button 
                        onClick={() => setSkills(skills.filter(item => item.id !== skill.id))}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer" 
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 智能体配置 Tab Content */}
      {/* ========================================================================= */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel: Agent selection and Environment Switcher */}
          <div className="lg:col-span-4 bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
              <span className="font-bold text-neutral-800 text-xs tracking-wider uppercase">智能体配置列表</span>
              <span className="text-[10px] font-bold text-[#fa541c] bg-[#fff2e8] border border-[#ffbb96] rounded px-1.5 py-0.5">多环境</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {agents.map(agent => {
                const isActive = agent.id === selectedAgentId;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex flex-col gap-2 relative",
                      isActive ? "bg-[#fff2e8]/45 border-l-4 border-[#fa541c]" : ""
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn("text-xs font-bold leading-normal transition-colors", isActive ? "text-[#fa541c]" : "text-neutral-800")}>
                        {agent.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold">{agent.version}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1">
                      <span>底层模型: {agent.model}</span>
                      <span className={cn(
                        "px-1.5 py-0.2 rounded text-[9px] font-bold border",
                        agent.environment === "Prod" ? "bg-green-50 text-green-600 border-green-200" :
                        agent.environment === "Test" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-blue-50 text-blue-600 border-blue-200"
                      )}>
                        {agent.environment === "Prod" ? "生产环境" : agent.environment === "Test" ? "测试环境" : "开发环境"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Deep parameters config and Publish trigger */}
          <div className="lg:col-span-8 space-y-6">
            {/* Show publish success alert flash */}
            {showPublishSuccessFlash && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-3 animate-fade-in shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">一键多环境发布完成！</span>
                  智能体 <span className="underline font-semibold">{currentAgent.name}</span> 的最新配置已热更新推送至所有服务器，并且成功同步到【开发/测试/生产】对应镜像。
                </div>
              </div>
            )}

            <div className="bg-white border border-neutral-100 rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-800">
                      工作区高级参数配置 - {currentAgent.name}
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">在此修改智能体触发策略，能力关联和人工接管条件</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={agentEnv} 
                    onChange={(e) => setAgentEnv(e.target.value as any)}
                    className="text-xs border border-neutral-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
                  >
                    <option value="Dev">开发环境 (Dev)</option>
                    <option value="Test">测试环境 (Test)</option>
                    <option value="Prod">生产环境 (Prod)</option>
                  </select>
                  <button 
                    onClick={handleSaveAgentLocalConfig}
                    className="bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    暂存本地
                  </button>
                </div>
              </div>

              {/* Form Areas */}
              <div className="space-y-6">
                {/* 1. Basic Parameters Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-800 border-l-3 border-[#fa541c] pl-2 flex items-center justify-between">
                    <span>1. 基础推理参数</span>
                    <span className="text-[10px] text-neutral-400 font-normal">模型和输出控制</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/40 p-4 rounded-lg border border-neutral-100">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600">模型底座绑定</label>
                      <select 
                        value={cfgModel} 
                        onChange={(e) => setCfgModel(e.target.value)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white font-medium"
                      >
                        <option value="DeepSeek-R1 (推理增强)">DeepSeek-R1 (推理增强)</option>
                        <option value="Llama-3-70B-Instruct">Llama-3-70B-Instruct</option>
                        <option value="GPT-4o-Mini">GPT-4o-Mini</option>
                        <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600">Max Tokens (单词上限)</label>
                      <input 
                        type="number" 
                        value={cfgMaxTokens}
                        onChange={(e) => setCfgMaxTokens(parseInt(e.target.value) || 2048)}
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none bg-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <div className="flex justify-between text-[11px] font-bold text-neutral-600">
                        <span>核温系数 (Temperature - 发散度)</span>
                        <span className="text-[#fa541c] font-black">{cfgTemp}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-normal pb-1">较低核温回答精确严谨（适合出题及答卷打分），较高核温回答充满创意（适合写作与代码重构）</p>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={cfgTemp}
                        onChange={(e) => setCfgTemp(parseFloat(e.target.value))}
                        className="w-full h-1 accent-[#fa541c] bg-neutral-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Capability Binds (关联技能, 知识库) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-800 border-l-3 border-[#fa541c] pl-2 flex items-center justify-between">
                    <span>2. 能力绑定与知识融合</span>
                    <span className="text-[10px] text-neutral-400 font-normal">多端技能包 & 密级文档</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/40 p-4 rounded-lg border border-neutral-100">
                    {/* Skills bind */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-600">关联可复用 AI 技能 (Skills)</label>
                      <div className="space-y-2 border border-neutral-200 rounded p-2.5 bg-white max-h-36 overflow-y-auto">
                        {skills.map(skill => {
                          const isBound = cfgSkills.includes(skill.name);
                          return (
                            <div 
                              key={skill.id}
                              onClick={() => {
                                if (isBound) {
                                  setCfgSkills(cfgSkills.filter(s => s !== skill.name));
                                } else {
                                  setCfgSkills([...cfgSkills, skill.name]);
                                }
                              }}
                              className="flex items-center gap-2 cursor-pointer py-1 hover:bg-neutral-50 text-xs select-none"
                            >
                              <button
                                type="button"
                                className={cn(
                                  "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all",
                                  isBound ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300"
                                )}
                              >
                                {isBound && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </button>
                              <span className="text-neutral-700 truncate">{skill.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Knowledge base bind */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-600">注入本地专业知识库</label>
                      <div className="space-y-2 border border-neutral-200 rounded p-2.5 bg-white max-h-36 overflow-y-auto">
                        {["计算机网络实训教学大纲", "2026全国考研大纲", "企业级Python开发编码规范", "MySQL性能调优手册"].map(kb => {
                          const isBound = cfgKbs.includes(kb);
                          return (
                            <div 
                              key={kb}
                              onClick={() => {
                                if (isBound) {
                                  setCfgKbs(cfgKbs.filter(k => k !== kb));
                                } else {
                                  setCfgKbs([...cfgKbs, kb]);
                                }
                              }}
                              className="flex items-center gap-2 cursor-pointer py-1 hover:bg-neutral-50 text-xs select-none"
                            >
                              <button
                                type="button"
                                className={cn(
                                  "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all",
                                  isBound ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300"
                                )}
                              >
                                {isBound && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </button>
                              <span className="text-neutral-700 truncate">{kb}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Trigger rules & Intent settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-800 border-l-3 border-[#fa541c] pl-2 flex items-center justify-between">
                    <span>3. 自动触发策略及意图识别</span>
                    <span className="text-[10px] text-neutral-400 font-normal">前置网关规则</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/40 p-4 rounded-lg border border-neutral-100">
                    {/* Trigger keywords */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-600 block">触发关键词定义</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. 出题"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          className="flex-1 border border-neutral-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (keywordInput.trim()) {
                                setCfgKeywords([...cfgKeywords, keywordInput.trim()]);
                                setKeywordInput("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (keywordInput.trim()) {
                              setCfgKeywords([...cfgKeywords, keywordInput.trim()]);
                              setKeywordInput("");
                            }
                          }}
                          className="bg-white border border-neutral-200 px-3 text-xs rounded hover:bg-neutral-50"
                        >
                          加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cfgKeywords.map(kw => (
                          <span key={kw} className="bg-white border border-neutral-200 rounded px-2 py-0.5 text-[10px] text-neutral-600 flex items-center gap-1">
                            <span>{kw}</span>
                            <button 
                              type="button" 
                              onClick={() => setCfgKeywords(cfgKeywords.filter(k => k !== kw))}
                              className="text-neutral-400 hover:text-rose-600 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Intent trigger */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-600 block">高级语义意图模型关联</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. 代码编写辅助"
                          value={intentInput}
                          onChange={(e) => setIntentInput(e.target.value)}
                          className="flex-1 border border-neutral-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (intentInput.trim()) {
                                setCfgIntents([...cfgIntents, intentInput.trim()]);
                                setIntentInput("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (intentInput.trim()) {
                              setCfgIntents([...cfgIntents, intentInput.trim()]);
                              setIntentInput("");
                            }
                          }}
                          className="bg-white border border-neutral-200 px-3 text-xs rounded hover:bg-neutral-50"
                        >
                          加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cfgIntents.map(int => (
                          <span key={int} className="bg-[#fff2e8] border border-[#ffbb96]/45 rounded px-2 py-0.5 text-[10px] text-[#fa541c] flex items-center gap-1">
                            <span>{int}</span>
                            <button 
                              type="button" 
                              onClick={() => setCfgIntents(cfgIntents.filter(i => i !== int))}
                              className="text-neutral-400 hover:text-rose-600 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Response Strategy & Human Handoff */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-800 border-l-3 border-[#fa541c] pl-2 flex items-center justify-between">
                    <span>4. 答复模板及人机协作分流</span>
                    <span className="text-[10px] text-neutral-400 font-normal">接管逻辑与兜底安全</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/40 p-4 rounded-lg border border-neutral-100">
                    {/* Response Template */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-600">系统提示模板 (System Prompt Outline)</label>
                      <textarea
                        rows={3}
                        value={cfgTemplate}
                        onChange={(e) => setCfgTemplate(e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 leading-normal"
                      />
                    </div>

                    {/* Handoff conditions */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-600 block">触发自动转为人工坐席条件</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="例如：涉及安全合规词汇敏感报警"
                          value={handoffInput}
                          onChange={(e) => setHandoffInput(e.target.value)}
                          className="flex-1 border border-neutral-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (handoffInput.trim()) {
                                setCfgHandoff([...cfgHandoff, handoffInput.trim()]);
                                setHandoffInput("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (handoffInput.trim()) {
                              setCfgHandoff([...cfgHandoff, handoffInput.trim()]);
                              setHandoffInput("");
                            }
                          }}
                          className="bg-white border border-neutral-200 px-3 text-xs rounded hover:bg-neutral-50"
                        >
                          加
                        </button>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {cfgHandoff.map((cond, i) => (
                          <div key={i} className="bg-rose-50 border border-rose-200 rounded px-2.5 py-1.5 text-[10px] text-rose-600 flex items-center justify-between">
                            <span className="font-semibold leading-normal">{cond}</span>
                            <button 
                              type="button" 
                              onClick={() => setCfgHandoff(cfgHandoff.filter((_, idx) => idx !== i))}
                              className="text-neutral-400 hover:text-rose-600 font-bold"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* One-Click Publish Trigger */}
              <div className="border-t border-neutral-100 pt-5 flex items-center justify-between gap-4 mt-6">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">环境发布控制</span>
                  <span className="text-xs text-neutral-600 mt-1 block">配置版本将自动递增并在云端热部署</span>
                </div>

                <button
                  type="button"
                  onClick={handleOneClickPublishAgent}
                  disabled={isPublishingAgent}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#fa541c]/10 flex items-center gap-2 cursor-pointer select-none"
                >
                  {isPublishingAgent ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>正在部署镜像 ({publishingAgentProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>一键推送到多环境并发布</span>
                    </>
                  )}
                </button>
              </div>

              {/* publishing progress bar */}
              {isPublishingAgent && (
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden transition-all duration-300">
                  <div 
                    className="bg-[#fa541c] h-full rounded-full transition-all duration-300"
                    style={{ width: `${publishingAgentProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
