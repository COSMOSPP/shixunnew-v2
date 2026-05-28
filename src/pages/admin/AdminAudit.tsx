import React, { useState } from "react";
import { 
  BookOpen, FolderKanban, FileQuestion, Cpu, Building, CheckCircle, 
  Clock, Search, Filter, Check, Shield, AlertCircle, Sparkles, X, 
  FileText, ClipboardCheck, ThumbsUp, User, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

interface AuditResource {
  id: string;
  name: string;
  creator: string;
  tenant: string;
  submitTime: string;
  status: "待审核" | "审核中" | "已通过" | "已驳回";
  rejectionReason?: string;
  details: {
    meta: string; // e.g. "32课时 | 2学分"
    content: string; // long summary
    outline: string[]; // key sub-items
  };
}

const initialResources: Record<"course" | "project" | "question" | "ai_capacity", AuditResource[]> = {
  course: [
    {
      id: "AUD-CRS-001",
      name: "大语言模型工程应用与LoRA微调技术",
      creator: "张旭东 教授",
      tenant: "北京大学信息学院",
      submitTime: "2026-05-26 11:30",
      status: "待审核",
      details: {
        meta: "32 课时 | 2.0 学分 | RAG 与 LoRA 核心方向",
        content: "本课程专注大模型应用落地，涵盖 Prompt Engineering 最佳编写规范、语义向量数据库融合、RAG 混合召回系统搭建，以及利用 LoRA 算法针对垂直行业私有数据集进行高效微调部署。",
        outline: [
          "第一章: 生成式 AI 与大模型产业背景 (4课时)",
          "第二章: 向量检索与 RAG 融合系统架构 (8课时)",
          "第三章: 参数高效微调 (PEFT) 与 LoRA 实战 (12课时)",
          "第四章: 大模型安全合规性与企业级沙箱部署 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-002",
      name: "Python数据分析与多维科学计算实训",
      creator: "陈明 助教",
      tenant: "复旦大学软件学院",
      submitTime: "2026-05-25 10:15",
      status: "审核中",
      details: {
        meta: "48 课时 | 3.0 学分 | 数据分析与建模方向",
        content: "实战向数据科学基石课，针对高校学生定制，主攻 Numpy 多维数值计算、Pandas 多维表格数据操作清洗、Matplotlib & Seaborn 数据智能分析呈现以及 Scikit-learn 基本经典算法训练。",
        outline: [
          "第一章: Python 编程基础与科学计算环境搭建 (6课时)",
          "第二章: Numpy 矩阵操作与向量运算加速 (10课时)",
          "第三章: Pandas 高维数据清洗、聚合与时序操作 (16课时)",
          "第四章: 经典机器学习回归、分类及特征工程实战 (16课时)"
        ]
      }
    }
  ],
  project: [
    {
      id: "AUD-PRJ-001",
      name: "云原生微服务高并发电商实训项目",
      creator: "王强 教授",
      tenant: "清华大学计算机系",
      submitTime: "2026-05-26 14:00",
      status: "待审核",
      details: {
        meta: "大型分布式实训项目 | 建议耗时 2-3 周",
        content: "本实训模拟企业级超高并发电商结算场景，要求学生使用 Spring Cloud Alibaba 进行微服务治理，整合 Kubernetes 自动化容器调度、Sentinel 限流熔断防护，以及 Redis 哨兵多级缓存及秒杀库存一致性问题解决。",
        outline: [
          "环节一: 系统模块微服务架构拆分与 Eureka 注册中心注册",
          "环节二: 使用 Redis 乐观锁 + Lua 脚本实现超卖防御与一致性",
          "环节三: 编写 Dockerfile 并使用 Jenkins 流水线自动推送 Harbor",
          "环节四: 在 K8s 上编写 Deployment 与 Service 文件进行水平扩缩容部署"
        ]
      }
    },
    {
      id: "AUD-PRJ-002",
      name: "ResNet50医学影像病灶智能分割项目",
      creator: "徐教授",
      tenant: "上海交通大学医学院",
      submitTime: "2026-05-24 09:00",
      status: "已通过",
      details: {
        meta: "深度学习医学影像实训 | 建议耗时 1-2 周",
        content: "跨学科前沿 AI 实验。学生需要使用 PyTorch 加载预训练 ResNet50/UNet 模型，针对脱敏公开的肺部 CT/脑部 MRI 影像进行边缘检测与图像分割处理，使用 Dice 相似系数评估病灶捕捉效果。",
        outline: [
          "环节一: 医学 DICOM 图像格式转换及 CLAHE 对比度受限自适应直方图均衡化",
          "环节二: 使用 PyTorch 构建包含 Skip Connection 的 UNet 核心网络",
          "环节三: 采用 CrossEntropy 与 Dice Loss 混合损失函数进行迭代寻优",
          "环节四: 通过 Confusion Matrix 计算 Precision、Recall 和 F1-score 指标"
        ]
      }
    }
  ],
  question: [
    {
      id: "AUD-QUE-001",
      name: "Transformer自注意力机制物理意义考核题",
      creator: "刘博士",
      tenant: "浙江大学控制系",
      submitTime: "2026-05-26 15:30",
      status: "待审核",
      details: {
        meta: "大模型理论主观思考题 | 标签: 深度学习, Transformer",
        content: "简答题：请写出 Transformer 核心架构中 Self-Attention (自注意力机制) 的数学计算公式，并分别详细阐述公式中查询矩阵 (Q)、键矩阵 (K)、值矩阵 (V) 的物理含义。最后说明为什么在计算内积后需要除以根号下 dk 缩放因子？",
        outline: [
          "考察知识点: Transformer 架构, QKV 矩阵投影, 梯度消失预防机制",
          "评分标准一: 完整写出 Self-Attention 公式: Softmax(Q K^T / sqrt(d_k)) * V 占 30% 分数",
          "评分标准二: 阐明 Q-查询, K-被查询键值, V-内容信息的表征占 40% 分数",
          "评分标准三: 解释除以缩放因子是为了防止 dk 维度过大时内积结果过大，Softmax 进入饱和区导致梯度消失占 30% 分数"
        ]
      }
    },
    {
      id: "AUD-QUE-002",
      name: "Kubernetes就绪与存活探针机制单选题",
      creator: "赵讲师",
      tenant: "武汉大学软件学院",
      submitTime: "2026-05-25 16:00",
      status: "已通过",
      details: {
        meta: "云原生容器单选题 | 标签: K8s, 运维监控",
        content: "单选题：在 Kubernetes 的 Pod 生命周期管理中，如果希望评估容器内服务是否已经初始化完成，能正常承接外部网关 Service 流量，应该优选配置哪种机制？\n选项：\nA. Liveness Probe (存活探针)\nB. Readiness Probe (就绪探针)\nC. Startup Probe (启动探针)\nD. PostStart Hook (后置启动钩子)",
        outline: [
          "正确答案: B. Readiness Probe (就绪探针)",
          "解析: Readiness Probe 就绪探针用来确定容器是否准备好接受网络服务流量。若就绪探针失败，Endpoint 控制器会将该 Pod 的 IP 从 Service 对应的主机列表中移除，不予转发网络请求；而 Liveness Probe 失败时会自动重启容器，不属于纯粹的外部流量准入控制。"
        ]
      }
    }
  ],
  ai_capacity: [
    {
      id: "AUD-AIC-001",
      name: "智能中英文口语流畅度及发音评测能力",
      creator: "吴教授",
      tenant: "南京大学外国语学院",
      submitTime: "2026-05-26 17:00",
      status: "待审核",
      details: {
        meta: "音频评测 API 能力 | 平均响应 SLA 150ms",
        content: "提供一键式流式音频口语发音评估 API。支持录入 mp3/wav 音频与标准文本对比，智能识别学生读音中的音素错漏、重音偏移、语流卡顿及流畅度得分，完美贴合英语人机口语实训教学。",
        outline: [
          "接口规格: POST /api/v1/speech/eval (Payload: audio_file, target_text)",
          "吞吐量限制: 单租户默认并发数 50 QPS, 可按需配额扩增",
          "底层模型: 基于 Whisper-v3 音素对齐优化模型"
        ]
      }
    }
  ]
};

export default function AdminAudit() {
  const [activeMenu, setActiveMenu] = useState<"course" | "project" | "question" | "ai_capacity">("course");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"全部" | "待审核" | "已通过" | "已驳回">("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const [resources, setResources] = useState<Record<string, AuditResource[]>>(initialResources);
  const activeList = resources[activeMenu] || [];

  // Review Drawer state
  const [reviewingItem, setReviewingItem] = useState<AuditResource | null>(null);
  const [rejectionInput, setRejectionInput] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Scorecards toggles
  const [checkQuality, setCheckQuality] = useState(true);
  const [checkOriginality, setCheckOriginality] = useState(true);
  const [checkStandard, setCheckStandard] = useState(true);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id: string) => {
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已通过" as const };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    triggerToast("审核通过！资源已正式升级为平台公共资源，全网租户可见可用。");
  };

  const handleReject = (id: string) => {
    if (!rejectionInput.trim()) {
      triggerToast("请填写具体的驳回意见，告知教师需要调整的格式或缺陷！");
      return;
    }
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已驳回" as const, rejectionReason: rejectionInput };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    setShowRejectForm(false);
    setRejectionInput("");
    triggerToast("已驳回申请，审核意见已安全投递到该校教师工作台。");
  };

  // Counting pending requests for left badges
  const getPendingCount = (key: "course" | "project" | "question" | "ai_capacity") => {
    return (resources[key] || []).filter(item => item.status === "待审核").length;
  };

  const filteredResources = activeList.filter(item => {
    const matchesStatus = activeStatusFilter === "全部" || item.status === activeStatusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[14px] font-medium text-neutral-800">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Menu */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full">
        <div className="p-5 border-b border-neutral-border shrink-0">
          <h2 className="text-lg font-semibold text-neutral-title">审核中心</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Menu Item 1: Course */}
          <button 
            onClick={() => { setActiveMenu("course"); setActiveStatusFilter("全部"); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "course" 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
            )}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>课程公开审核</span>
          </button>

          {/* Menu Item 2: Project */}
          <button 
            onClick={() => { setActiveMenu("project"); setActiveStatusFilter("全部"); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "project" 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
            )}
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span>项目公开审核</span>
          </button>

          {/* Menu Item 3: Question */}
          <button 
            onClick={() => { setActiveMenu("question"); setActiveStatusFilter("全部"); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "question" 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
            )}
          >
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>试题公开审核</span>
          </button>

          {/* Menu Item 4: AI Capacity */}
          <button 
            onClick={() => { setActiveMenu("ai_capacity"); setActiveStatusFilter("全部"); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "ai_capacity" 
                ? "bg-[#fff2e8] text-[#fa541c]" 
                : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
            )}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>AI能力公开审核</span>
          </button>
        </nav>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0">
        
        {/* Right Pane Title Header */}
        <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-neutral-title flex items-center gap-2">
              {activeMenu === "course" && "课程公开审核"}
              {activeMenu === "project" && "项目公开审核"}
              {activeMenu === "question" && "试题公开审核"}
              {activeMenu === "ai_capacity" && "AI能力公开审核"}
            </h1>
            <p className="text-sm text-neutral-body mt-1 max-w-[680px]">
              {activeMenu === "course" && "审核各高校教师提请公开的实训课程大纲与课时设计，审核通过后将合并至公共课程资源库。"}
              {activeMenu === "project" && "评估企业级及学术性前沿实训项目案例，通过后在全网租户范围提供秒级沙箱环境部署。"}
              {activeMenu === "question" && "严控试卷试题的知识点覆盖度、科学性及格式标准，确保高价值考核资源的入库品质。"}
              {activeMenu === "ai_capacity" && "测试和校验教师研发定制的高性能AI大模型API接口、离线推理实例以及流畅度评测能力。"}
            </p>
          </div>
          
          {/* Quick Statistics Banner */}
          <div className="flex gap-4 self-stretch md:self-auto justify-end">
            <div className="bg-white px-4 py-2 rounded-xl border border-neutral-border shadow-xs flex flex-col min-w-[100px]">
              <span className="text-[11px] text-neutral-caption font-medium">当前分类总数</span>
              <span className="text-lg font-bold text-neutral-title mt-0.5">{activeList.length}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-neutral-border shadow-xs flex flex-col min-w-[100px]">
              <span className="text-[11px] text-neutral-caption font-medium">待审核申请</span>
              <span className="text-lg font-bold text-[#fa541c] mt-0.5">{getPendingCount(activeMenu)}</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters Card */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
          {/* Status pill selectors */}
          <div className="flex bg-neutral-100 rounded-full p-1 border border-neutral-200/50">
            {(["全部", "待审核", "已通过", "已驳回"] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveStatusFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer border-0 bg-transparent",
                  activeStatusFilter === f 
                    ? "bg-white text-[#fa541c] font-bold shadow-sm" 
                    : "text-neutral-body hover:text-neutral-title"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Input bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
            <input 
              type="text"
              placeholder="搜索资源名称、提请人或所属单位"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] bg-white text-neutral-title placeholder-neutral-caption transition-all duration-200"
            />
          </div>
        </div>

        {/* Table Card Display */}
        <div className="bg-white border border-neutral-border rounded-xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                  <th className="p-4 pl-6 font-medium">资源名称</th>
                  <th className="p-4 font-medium">提请租户/所属单位</th>
                  <th className="p-4 font-medium">提交教师</th>
                  <th className="p-4 font-medium">申请时间</th>
                  <th className="p-4 font-medium">状态</th>
                  <th className="p-4 pr-6 font-medium text-right">审核操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(item => (
                  <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                    <td className="p-4 pl-6 text-neutral-800 font-medium whitespace-normal max-w-[260px] truncate" title={item.name}>{item.name}</td>
                    <td className="p-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                        <span>{item.tenant}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-caption shrink-0" />
                        <span>{item.creator}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-caption">{item.submitTime}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[12px] rounded border font-medium",
                        item.status === "待审核" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        item.status === "审核中" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        item.status === "已通过" ? "bg-green-50 text-green-600 border-green-200" :
                        "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {item.status === "待审核" || item.status === "审核中" ? (
                        <button 
                          onClick={() => setReviewingItem(item)}
                          className="bg-[#fff2e8] hover:bg-[#ffe8d6] text-[#fa541c] text-xs font-bold px-4 py-1.5 border border-[#ffbb96]/45 rounded-[6px] transition-all duration-200 cursor-pointer shadow-2xs"
                        >
                          评估审核
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5 text-neutral-caption italic text-[12px]">
                          <span>审核已结案</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredResources.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-xs text-neutral-caption italic">
                      无对应的提请申请记录。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Audit Evaluation Drawer Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-border animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-neutral-border flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-sm font-bold text-neutral-title flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#fa541c]" />
                <span className="text-[15px]">公共资源准入合规度评估</span>
              </h3>
              <button 
                onClick={() => setReviewingItem(null)} 
                className="text-neutral-caption hover:text-neutral-title transition-colors p-1 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Basic Details Box */}
              <div className="space-y-3 bg-[#fff2e8]/10 p-5 rounded-xl border border-[#ffbb96]/30">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#fa541c] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{reviewingItem.id}</span>
                  <span className="text-[11px] font-semibold text-neutral-caption">{reviewingItem.tenant}</span>
                </div>
                <h4 className="text-[15px] font-bold text-neutral-title leading-snug">{reviewingItem.name}</h4>
                <div className="h-[1px] bg-neutral-border/60"></div>
                <p className="text-[12px] text-neutral-body flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>提请教师:</strong> {reviewingItem.creator}</span>
                  <span><strong>规格属性:</strong> {reviewingItem.details.meta}</span>
                  <span><strong>提交时间:</strong> {reviewingItem.submitTime}</span>
                </p>
              </div>

              {/* Resource Core details */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider block">资源内容正文详情</span>
                <div className="p-5 border border-neutral-border rounded-xl bg-white space-y-4 shadow-3xs">
                  <p className="text-xs text-neutral-body leading-relaxed font-medium bg-neutral-50 p-3 rounded-lg border border-neutral-100">{reviewingItem.details.content}</p>
                  
                  <div className="border-t border-neutral-200/50"></div>
                  
                  <span className="text-[10px] font-bold text-neutral-caption block uppercase tracking-wider">大纲结构/核心章节/评分细则:</span>
                  <div className="space-y-2 pt-1">
                    {reviewingItem.details.outline.map((line, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-neutral-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] mt-1.5 shrink-0" />
                        <span className="leading-relaxed font-medium">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dimensions Checkbox Scorecard */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider block">平台公共资源公开考核维度指标</span>
                
                {/* 1. 内容质量 */}
                <div 
                  onClick={() => setCheckQuality(!checkQuality)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-white shadow-3xs hover:border-[#fa541c]/50",
                    checkQuality ? "border-[#fa541c] bg-[#fff2e8]/5" : "border-neutral-border"
                  )}
                >
                  <button type="button" className={cn("w-4.5 h-4.5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors", checkQuality ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkQuality && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-title block">内容质量准入 (完整、准确、高价值)</span>
                    <p className="text-[10px] text-neutral-caption mt-1 leading-normal">要求实验描述详尽完整，理论术语精准，对全平台各校师生有普适的应用价值。</p>
                  </div>
                </div>

                {/* 2. 原创性 */}
                <div 
                  onClick={() => setCheckOriginality(!checkOriginality)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-white shadow-3xs hover:border-[#fa541c]/50",
                    checkOriginality ? "border-[#fa541c] bg-[#fff2e8]/5" : "border-neutral-border"
                  )}
                >
                  <button type="button" className={cn("w-4.5 h-4.5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors", checkOriginality ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkOriginality && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-title block">高度原创性 (非抄袭、无版权及泄密问题)</span>
                    <p className="text-[10px] text-neutral-caption mt-1 leading-normal">无任何第三方版权限制或学术纠纷，不含有未脱敏的系统数据或高校内部机密数据。</p>
                  </div>
                </div>

                {/* 3. 规范性 */}
                <div 
                  onClick={() => setCheckStandard(!checkStandard)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-white shadow-3xs hover:border-[#fa541c]/50",
                    checkStandard ? "border-[#fa541c] bg-[#fff2e8]/5" : "border-neutral-border"
                  )}
                >
                  <button type="button" className={cn("w-4.5 h-4.5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors", checkStandard ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkStandard && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-title block">格式规范性 (描述清晰、架构及排版统一)</span>
                    <p className="text-[10px] text-neutral-caption mt-1 leading-normal">目录节点、代码格式及中英文排版分段完全契合智云实训平台公共素材库格式手册。</p>
                  </div>
                </div>
              </div>

              {/* Rejection input area */}
              {showRejectForm && (
                <div className="space-y-2 pt-2 animate-slide-up">
                  <label className="text-[11px] font-bold text-rose-600 block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>驳回审核具体意见 (必填)</span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="请输入对该教学资源调整修改的细则说明，协助教师进行补充重构..."
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    className="w-full border border-neutral-border rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-title resize-none font-medium leading-normal shadow-3xs"
                  />
                </div>
              )}

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-neutral-border bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              {showRejectForm ? (
                <>
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2.5 border border-neutral-border text-neutral-body rounded-lg text-xs font-bold hover:bg-neutral-100 cursor-pointer transition-colors">返回</button>
                  <button onClick={() => handleReject(reviewingItem.id)} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">确认驳回</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowRejectForm(true)} className="px-4 py-2.5 border border-neutral-border text-neutral-body rounded-lg text-xs font-bold hover:bg-neutral-100 cursor-pointer transition-colors">驳回并通知</button>
                  <button onClick={() => handleApprove(reviewingItem.id)} className="px-5 py-2.5 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">评估通过并公开为公共资源</button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
