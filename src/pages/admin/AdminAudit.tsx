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
    <div className="space-y-6 min-h-full">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[14px] font-medium text-neutral-800">{toastMessage}</span>
        </div>
      )}

      {/* Clean text Header without background */}
      <div className="pb-1">
        <h1 className="text-xl font-bold text-neutral-900">审核中心</h1>
        <p className="text-sm text-neutral-500 mt-1">平台超级管理员在此审核各校教师提请公开的课程、项目、试题及AI能力，通过后成为平台级公共资源供所有租户使用</p>
      </div>

      {/* Unified Main Split Workspace Container */}
      <div className="bg-white p-6 border border-neutral-100 rounded-xl shadow-sm space-y-6 flex flex-col md:flex-row gap-6 min-h-[500px]">
        
        {/* Left sidebar Navigation (描边框, no background/shadow) */}
        <div className="w-full md:w-60 border border-neutral-200 rounded-xl overflow-hidden shrink-0 flex flex-col">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
            <span className="font-bold text-neutral-800 text-xs tracking-wider uppercase">待审核资源维度</span>
            <ClipboardCheck className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="divide-y divide-neutral-100 flex-1">
            {/* Courses menu */}
            <div 
              onClick={() => { setActiveMenu("course"); setActiveStatusFilter("全部"); }}
              className={cn(
                "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex items-center justify-between",
                activeMenu === "course" ? "bg-[#fff2e8]/40 border-l-4 border-[#fa541c]" : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className={cn("w-4.5 h-4.5", activeMenu === "course" ? "text-[#fa541c]" : "text-neutral-500")} />
                <span className={cn("text-xs font-bold", activeMenu === "course" ? "text-[#fa541c]" : "text-neutral-700")}>课程公开审核</span>
              </div>
              {getPendingCount("course") > 0 && (
                <span className="bg-[#fa541c] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {getPendingCount("course")}
                </span>
              )}
            </div>

            {/* Projects menu */}
            <div 
              onClick={() => { setActiveMenu("project"); setActiveStatusFilter("全部"); }}
              className={cn(
                "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex items-center justify-between",
                activeMenu === "project" ? "bg-[#fff2e8]/40 border-l-4 border-[#fa541c]" : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className={cn("w-4.5 h-4.5", activeMenu === "project" ? "text-[#fa541c]" : "text-neutral-500")} />
                <span className={cn("text-xs font-bold", activeMenu === "project" ? "text-[#fa541c]" : "text-neutral-700")}>项目公开审核</span>
              </div>
              {getPendingCount("project") > 0 && (
                <span className="bg-[#fa541c] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {getPendingCount("project")}
                </span>
              )}
            </div>

            {/* Questions menu */}
            <div 
              onClick={() => { setActiveMenu("question"); setActiveStatusFilter("全部"); }}
              className={cn(
                "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex items-center justify-between",
                activeMenu === "question" ? "bg-[#fff2e8]/40 border-l-4 border-[#fa541c]" : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                <FileQuestion className={cn("w-4.5 h-4.5", activeMenu === "question" ? "text-[#fa541c]" : "text-neutral-500")} />
                <span className={cn("text-xs font-bold", activeMenu === "question" ? "text-[#fa541c]" : "text-neutral-700")}>试题公开审核</span>
              </div>
              {getPendingCount("question") > 0 && (
                <span className="bg-[#fa541c] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {getPendingCount("question")}
                </span>
              )}
            </div>

            {/* AI capacities menu */}
            <div 
              onClick={() => { setActiveMenu("ai_capacity"); setActiveStatusFilter("全部"); }}
              className={cn(
                "p-4 cursor-pointer transition-all hover:bg-neutral-50 flex items-center justify-between",
                activeMenu === "ai_capacity" ? "bg-[#fff2e8]/40 border-l-4 border-[#fa541c]" : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className={cn("w-4.5 h-4.5", activeMenu === "ai_capacity" ? "text-[#fa541c]" : "text-neutral-500")} />
                <span className={cn("text-xs font-bold", activeMenu === "ai_capacity" ? "text-[#fa541c]" : "text-neutral-700")}>AI能力公开审核</span>
              </div>
              {getPendingCount("ai_capacity") > 0 && (
                <span className="bg-[#fa541c] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {getPendingCount("ai_capacity")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right workspace: Review List (No background/shadow, flat styling) */}
        <div className="flex-1 space-y-6">
          
          {/* Flat Filters & Search toolbar referencing TeacherDatasets style */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-neutral-100 pb-4">
            {/* Status pill selectors */}
            <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60">
              {(["全部", "待审核", "已通过", "已驳回"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveStatusFilter(f)}
                  className={cn(
                    "px-4 py-1.5 text-[12px] rounded-full transition-all duration-200 cursor-pointer",
                    activeStatusFilter === f 
                      ? "bg-white text-[#fa541c] font-bold shadow-sm" 
                      : "text-neutral-500 hover:text-neutral-800"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Search Input bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索资源名称、提请人或所属单位"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full text-xs border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400"
              />
            </div>
          </div>

          {/* Table displaying pending/completed audits */}
          <div className="overflow-x-auto border border-neutral-100 rounded-xl">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                  <th className="p-4 font-medium">资源名称</th>
                  <th className="p-4 font-medium">提请租户/所属单位</th>
                  <th className="p-4 font-medium">提交教师</th>
                  <th className="p-4 font-medium">申请时间</th>
                  <th className="p-4 font-medium">状态</th>
                  <th className="p-4 font-medium text-right">审核操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(item => (
                  <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px]">
                    <td className="p-4 font-bold text-neutral-800 whitespace-normal max-w-[200px] truncate" title={item.name}>{item.name}</td>
                    <td className="p-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.tenant}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.creator}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500">{item.submitTime}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border font-medium",
                        item.status === "待审核" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        item.status === "审核中" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        item.status === "已通过" ? "bg-green-50 text-green-600 border-green-200" :
                        "bg-rose-50 text-rose-600 border-rose-200"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.status === "待审核" || item.status === "审核中" ? (
                        <button 
                          onClick={() => setReviewingItem(item)}
                          className="bg-[#fff2e8] hover:bg-[#ffe8d6] text-[#fa541c] text-xs font-bold px-3.5 py-1.5 border border-[#ffbb96]/45 rounded transition-all cursor-pointer"
                        >
                          评估审核
                        </button>
                      ) : (
                        <span className="text-neutral-400 italic text-[12px]">审核已结案</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredResources.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-xs text-neutral-400 italic">
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
          <div className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#fa541c]" />
                <span>公共资源准入合规度评估</span>
              </h3>
              <button onClick={() => setReviewingItem(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Basic Details Box */}
              <div className="space-y-2 bg-neutral-50/40 p-4 rounded-xl border border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-500">{reviewingItem.id} • {reviewingItem.tenant}</span>
                <h4 className="text-sm font-bold text-neutral-800 pt-0.5 leading-normal">{reviewingItem.name}</h4>
                <p className="text-[11px] text-neutral-400">提请公开教师: {reviewingItem.creator} • 规格属性: {reviewingItem.details.meta}</p>
              </div>

              {/* Resource Core details */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">资源内容正文详情</span>
                <div className="p-4 border border-neutral-200/80 rounded-xl bg-[#fcfcfc] space-y-3">
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">{reviewingItem.details.content}</p>
                  
                  <div className="border-t border-neutral-200/50 my-2"></div>
                  
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">大纲结构/核心章节/评分细则:</span>
                  <div className="space-y-1.5 pt-1">
                    {reviewingItem.details.outline.map((line, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-neutral-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dimensions Checkbox Scorecard */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">平台公共资源公开考核维度指标</span>
                
                {/* 1. 内容质量 */}
                <div 
                  onClick={() => setCheckQuality(!checkQuality)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                    checkQuality ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                  )}
                >
                  <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkQuality ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkQuality && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-800">内容质量准入 (完整、准确、高价值)</span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">要求实验描述详尽完整，理论术语精准，对全平台各校师生有普适的应用价值。</p>
                  </div>
                </div>

                {/* 2. 原创性 */}
                <div 
                  onClick={() => setCheckOriginality(!checkOriginality)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                    checkOriginality ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                  )}
                >
                  <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkOriginality ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkOriginality && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-800">高度原创性 (非抄袭、无版权及泄密问题)</span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">无任何第三方版权限制或学术纠纷，不含有未脱敏的系统数据或高校内部机密数据。</p>
                  </div>
                </div>

                {/* 3. 规范性 */}
                <div 
                  onClick={() => setCheckStandard(!checkStandard)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 bg-neutral-50/20",
                    checkStandard ? "border-[#fa541c] bg-[#fff2e8]/15" : "border-neutral-200"
                  )}
                >
                  <button type="button" className={cn("w-4 h-4 rounded border flex items-center justify-center mt-0.5", checkStandard ? "bg-[#fa541c] border-[#fa541c] text-white" : "border-neutral-300 bg-white")}>
                    {checkStandard && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-neutral-800">格式规范性 (描述清晰、架构及排版统一)</span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">目录节点、代码格式及中英文排版分段完全契合智云实训平台公共素材库格式手册。</p>
                  </div>
                </div>
              </div>

              {/* Rejection input area */}
              {showRejectForm && (
                <div className="space-y-2 pt-2 animate-slide-up">
                  <label className="text-[11px] font-bold text-rose-600 block">驳回审核具体意见 (必填)</label>
                  <textarea 
                    rows={3}
                    placeholder="请输入对该教学资源调整修改的细则说明，协助教师进行补充重构..."
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 resize-none font-medium leading-normal"
                  />
                </div>
              )}

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              {showRejectForm ? (
                <>
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer">返回</button>
                  <button onClick={() => handleReject(reviewingItem.id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">确认驳回</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowRejectForm(true)} className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-50 cursor-pointer">驳回并通知</button>
                  <button onClick={() => handleApprove(reviewingItem.id)} className="px-4 py-2 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">评估通过并公开为公共资源</button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
