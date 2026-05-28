import React, { useState } from "react";
import { 
  Trophy, Users, Award, Clock, CheckCircle, AlertTriangle, Search, 
  Plus, Edit, Trash2, Shield, Calendar, BookOpen, ChevronRight, X,
  FileText, Sliders, Play, TrendingUp, BarChart2, Download, Filter, 
  AlertCircle, Settings, Check, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Data Interfaces ---

interface Competition {
  id: string;
  name: string;
  type: string;
  status: "筹备中" | "报名中" | "进行中" | "已结束";
  duration: string;
  teamsCount: number;
  participants: number;
  description: string;
  format: string;
  ruleMaxSubmissions: number;
  ruleFiles: string;
  ruleGpu: string;
  evalMetric: string;
}

interface ApplicationRequest {
  id: string;
  school: string;
  contestName: string;
  teacher: string;
  status: "待审核" | "已通过" | "已拒绝";
  submitDate: string;
  description: string;
  format: string;
  rules: string;
  scoring: string;
}

interface Team {
  id: string;
  name: string;
  captain: string;
  membersCount: number;
  school: string;
  submissions: number;
  status: "正常" | "已封禁";
  regDate: string;
}

interface LeaderboardRecord {
  id: string;
  teamId: string;
  teamName: string;
  school: string;
  score: number;
  time: string;
  file: string;
  codeReport: string;
}

// --- Initial Mock Database ---

const initialCompetitions: Competition[] = [
  { 
    id: "comp-1", 
    name: "2026年智云杯大语言模型应用创新赛", 
    type: "大模型开发", 
    status: "进行中", 
    duration: "2026-03-01 至 2026-05-31", 
    teamsCount: 452, 
    participants: 1356, 
    description: "基于主流开源大语言模型，面向全国高校开展大模型应用创新与微调开发对抗，覆盖Agent框架开发、RAG语义重排调优等多维实战赛道。", 
    format: "团队赛 (最大5人)", 
    ruleMaxSubmissions: 5, 
    ruleFiles: "zip, ipynb", 
    ruleGpu: "100 GPU小时", 
    evalMetric: "Accuracy / F1-Score" 
  },
  { 
    id: "comp-2", 
    name: "医疗影像肺部病灶分割挑战赛", 
    type: "计算机视觉", 
    status: "进行中", 
    duration: "2026-03-15 至 2026-04-30", 
    teamsCount: 320, 
    participants: 840, 
    description: "针对多模态医学图像，利用高维卷积神经网络与Transformer模型对典型肺部病灶进行高精度分割，比对重合度指标IoU。", 
    format: "个人赛 / 团队赛 (最大3人)", 
    ruleMaxSubmissions: 3, 
    ruleFiles: "tar.gz, py", 
    ruleGpu: "50 GPU小时", 
    evalMetric: "Mean IoU" 
  },
  { 
    id: "comp-3", 
    name: "金融风控非平衡样本分类预测算法赛", 
    type: "机器学习", 
    status: "已结束", 
    duration: "2025-12-01 至 2026-02-28", 
    teamsCount: 890, 
    participants: 2200, 
    description: "通过海量金融交易流水，在高度不平衡的欺诈样本集中，设计高泛化性的机器学习分类器，精准识别潜在风险交易。", 
    format: "团队赛 (最大4人)", 
    ruleMaxSubmissions: 10, 
    ruleFiles: "csv", 
    ruleGpu: "不限", 
    evalMetric: "AUC / LogLoss" 
  },
  { 
    id: "comp-4", 
    name: "智能客服多轮多意图对话评测赛", 
    type: "自然语言处理", 
    status: "报名中", 
    duration: "2026-04-01 至 2026-06-30", 
    teamsCount: 150, 
    participants: 450, 
    description: "参赛者需要设计并部署高并发、高准确率的多意图对话树提取与大模型编排链路，以通过极其苛刻的多轮人机交互压力测试。", 
    format: "团队赛 (最大3人)", 
    ruleMaxSubmissions: 5, 
    ruleFiles: "zip", 
    ruleGpu: "50 GPU小时", 
    evalMetric: "BLEU / ROUGE" 
  },
  { 
    id: "comp-5", 
    name: "第三届网络安全云原生微服务渗透对抗赛", 
    type: "安全对抗", 
    status: "筹备中", 
    duration: "2026-07-01 至 2026-07-31", 
    teamsCount: 0, 
    participants: 0, 
    description: "本届赛事聚焦云原生微服务集群的边界防御与横向移动渗透。参赛队伍在沙箱中，需要快速找出多实例环境下的逻辑越权与依赖项漏洞并提交PoC并提报。", 
    format: "团队赛 (最大5人)", 
    ruleMaxSubmissions: 8, 
    ruleFiles: "zip, yaml", 
    ruleGpu: "100 GPU小时", 
    evalMetric: "得分与修复率" 
  }
];

const initialApplications: ApplicationRequest[] = [
  { 
    id: "req-1", 
    school: "清华大学软件学院", 
    contestName: "首届图神经网络链路预测挑战赛", 
    teacher: "陈立峰 教授", 
    status: "待审核", 
    submitDate: "2026-05-25", 
    description: "针对超大规模学术合作关系网络，开展链路预测理论及并行加速评测，面向全国计算机专业学生公开招募参赛队伍。", 
    format: "团队赛 (最大3人)", 
    rules: "每日最大提交3次，限制zip文件，分配40小时GPU配额", 
    scoring: "以AUC为评测指标，占80%，代码结构及查重占20%" 
  },
  { 
    id: "req-2", 
    school: "北京航空航天大学计算机学院", 
    contestName: "智能网联汽车分布式路径规划对抗赛", 
    teacher: "林海华 副教授", 
    status: "待审核", 
    submitDate: "2026-05-26", 
    description: "面向多车编队的分布式三维路径规划，验证复杂障碍物及窄通道场景下的实时碰撞避免与能效最优路径决策算法。", 
    format: "团队赛 (最大4人)", 
    rules: "每日最大提交5次，限制tar.gz文件，限制分配50小时GPU", 
    scoring: "以避障安全性（40%）、路径平滑度（30%）、执行耗时（30%）加权得分" 
  },
  { 
    id: "req-3", 
    school: "南京大学人工智能研究院", 
    contestName: "小样本高光谱图像农作物分类创新赛", 
    teacher: "王建勋 研究员", 
    status: "已通过", 
    submitDate: "2026-05-24", 
    description: "探索光谱波段空间注意力机制在农作物精准普查中的应用，重点考察模型在超小样本监督学习条件下的极值泛化能力。", 
    format: "个人赛 / 团队赛 (最大3人)", 
    rules: "每日最大提交5次，限制py格式文件，分配80小时GPU", 
    scoring: "F1-Score (宏平均)" 
  }
];

const initialTeams: Record<string, Team[]> = {
  "comp-1": [
    { id: "team-1-1", name: "绝地大模型队", captain: "张立明", membersCount: 5, school: "清华大学", submissions: 12, status: "正常", regDate: "2026-03-02" },
    { id: "team-1-2", name: "梯度下降终结者", captain: "李瑞丰", membersCount: 4, school: "北京大学", submissions: 9, status: "正常", regDate: "2026-03-05" },
    { id: "team-1-3", name: "PyTorch狂热粉", captain: "王梓轩", membersCount: 3, school: "上海交通大学", submissions: 15, status: "已封禁", regDate: "2026-03-08" },
    { id: "team-1-4", name: "大语言偏微分队", captain: "赵宇涵", membersCount: 3, school: "哈尔滨工业大学", submissions: 5, status: "正常", regDate: "2026-03-12" },
    { id: "team-1-5", name: "注意力机制矩阵群", captain: "刘斯琪", membersCount: 5, school: "浙江大学", submissions: 14, status: "正常", regDate: "2026-03-03" }
  ],
  "comp-2": [
    { id: "team-2-1", name: "影像切割大师", captain: "陈伟杰", membersCount: 3, school: "复旦大学医学院", submissions: 8, status: "正常", regDate: "2026-03-16" },
    { id: "team-2-2", name: "UNet终极进化", captain: "周诗雨", membersCount: 2, school: "华中科技大学", submissions: 11, status: "正常", regDate: "2026-03-18" },
    { id: "team-2-3", name: "影像超分辨率群", captain: "马骁", membersCount: 3, school: "四川大学", submissions: 4, status: "正常", regDate: "2026-03-20" }
  ],
  "comp-3": [
    { id: "team-3-1", name: "特征工程搬砖人", captain: "李栋", membersCount: 4, school: "南京大学", submissions: 22, status: "正常", regDate: "2025-12-05" },
    { id: "team-3-2", name: "随机森林防卫者", captain: "杨浩", membersCount: 3, school: "西安交通大学", submissions: 18, status: "正常", regDate: "2025-12-08" }
  ],
  "comp-4": [
    { id: "team-4-1", name: "意图理解先锋", captain: "沈涛", membersCount: 3, school: "同济大学", submissions: 2, status: "正常", regDate: "2026-04-05" }
  ]
};

const initialLeaderboards: Record<string, LeaderboardRecord[]> = {
  "comp-1": [
    { id: "rank-1-1", teamId: "team-1-1", teamName: "绝地大模型队", school: "清华大学", score: 0.9654, time: "2026-05-27 15:30:12", file: "submission_v12.zip", codeReport: "静态代码评估: 优秀, Pylint评分 9.6, 无安全注入风险" },
    { id: "rank-1-2", teamId: "team-1-5", teamName: "注意力机制矩阵群", school: "浙江大学", score: 0.9421, time: "2026-05-27 14:12:00", file: "submission_v8.zip", codeReport: "静态代码评估: 优秀, Pylint评分 9.4, 复杂度符合O(N)" },
    { id: "rank-1-3", teamId: "team-1-2", teamName: "梯度下降终结者", school: "北京大学", score: 0.9205, time: "2026-05-26 18:24:55", file: "model_opt.zip", codeReport: "静态代码评估: 良好, Pylint评分 8.8, 局部变量未使用警告" },
    { id: "rank-1-4", teamId: "team-1-4", teamName: "大语言偏微分队", school: "哈尔滨工业大学", score: 0.8934, time: "2026-05-25 10:15:30", file: "baseline.zip", codeReport: "静态代码评估: 中等, Pylint评分 7.5, 缺少类文档注释说明" }
  ],
  "comp-2": [
    { id: "rank-2-1", teamId: "team-2-1", teamName: "影像切割大师", school: "复旦大学医学院", score: 0.8845, time: "2026-04-29 23:45:10", file: "segmentation_cleansed.tar.gz", codeReport: "静态代码评估: 优秀, Pylint评分 9.5" },
    { id: "rank-2-2", teamId: "team-2-2", teamName: "UNet终极进化", school: "华中科技大学", score: 0.8521, time: "2026-04-28 12:10:05", file: "unet_resnet.tar.gz", codeReport: "静态代码评估: 优秀, Pylint评分 8.9" },
    { id: "rank-2-3", teamId: "team-2-3", teamName: "影像超分辨率群", school: "四川大学", score: 0.7932, time: "2026-04-25 16:30:00", file: "baseline_sr.tar.gz", codeReport: "静态代码评估: 良好, Pylint评分 8.1" }
  ],
  "comp-3": [
    { id: "rank-3-1", teamId: "team-3-1", teamName: "特征工程搬砖人", school: "南京大学", score: 0.9845, time: "2026-02-27 18:40:02", file: "xgboost_stacking.csv", codeReport: "静态代码评估: 优秀, Pylint 9.8" },
    { id: "rank-3-2", teamId: "team-3-2", teamName: "随机森林防卫者", school: "西安交通大学", score: 0.9423, time: "2026-02-26 20:15:00", file: "lightgbm_tuned.csv", codeReport: "静态代码评估: 良好, Pylint 8.5" }
  ],
  "comp-4": [
    { id: "rank-4-1", teamId: "team-4-1", teamName: "意图理解先锋", school: "同济大学", score: 0.6542, time: "2026-04-10 11:22:11", file: "intent_dialog.zip", codeReport: "静态代码评估: 良好, Pylint 8.0" }
  ]
};

export default function AdminCompetitionsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "list" | "review" | "teams" | "scores">("overview");

  // --- Dynamic State Managers ---
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [applications, setApplications] = useState<ApplicationRequest[]>(initialApplications);
  const [teams, setTeams] = useState<Record<string, Team[]>>(initialTeams);
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardRecord[]>>(initialLeaderboards);

  // --- Filter & Search States ---
  const [compSearch, setCompSearch] = useState("");
  const [compTypeFilter, setCompTypeFilter] = useState("全部");
  const [compStatusFilter, setCompStatusFilter] = useState("全部");

  // --- Dropdown Selector for Sub-tabs ---
  const [selectedCompId, setSelectedCompId] = useState("comp-1");

  // --- Create / Edit Drawer Sheet ---
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingCompId, setEditingCompId] = useState<string | null>(null);

  // Drawer Form States
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("大模型开发");
  const [formStatus, setFormStatus] = useState<"筹备中" | "报名中" | "进行中" | "已结束">("筹备中");
  const [formDuration, setFormDuration] = useState("2026-06-01 至 2026-08-31");
  const [formDescription, setFormDescription] = useState("");
  const [formFormat, setFormFormat] = useState("团队赛 (最大5人)");
  const [formMaxSubmissions, setFormMaxSubmissions] = useState(5);
  const [formFiles, setFormFiles] = useState("zip");
  const [formGpu, setFormGpu] = useState("50 GPU小时");
  const [formEvalMetric, setFormEvalMetric] = useState("Accuracy");

  // --- Modals & Popovers ---
  const [selectedApp, setSelectedApp] = useState<ApplicationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReasonInput, setShowRejectReasonInput] = useState(false);

  // Score Adjustment Modal States
  const [adjustingRecord, setAdjustingRecord] = useState<LeaderboardRecord | null>(null);
  const [adjustScoreVal, setAdjustScoreVal] = useState(0.5);

  // Dynamic Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- Event Handlers ---

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setEditingCompId(null);
    setFormName("");
    setFormType("大模型开发");
    setFormStatus("筹备中");
    setFormDuration("2026-06-01 至 2026-08-31");
    setFormDescription("");
    setFormFormat("团队赛 (最大5人)");
    setFormMaxSubmissions(5);
    setFormFiles("zip");
    setFormGpu("50 GPU小时");
    setFormEvalMetric("Accuracy");
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (comp: Competition) => {
    setDrawerMode("edit");
    setEditingCompId(comp.id);
    setFormName(comp.name);
    setFormType(comp.type);
    setFormStatus(comp.status);
    setFormDuration(comp.duration);
    setFormDescription(comp.description);
    setFormFormat(comp.format);
    setFormMaxSubmissions(comp.ruleMaxSubmissions);
    setFormFiles(comp.ruleFiles);
    setFormGpu(comp.ruleGpu);
    setFormEvalMetric(comp.evalMetric);
    setShowDrawer(true);
  };

  const handleSaveCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (drawerMode === "create") {
      const newId = `comp-${Date.now()}`;
      const newComp: Competition = {
        id: newId,
        name: formName,
        type: formType,
        status: formStatus,
        duration: formDuration,
        teamsCount: 0,
        participants: 0,
        description: formDescription,
        format: formFormat,
        ruleMaxSubmissions: formMaxSubmissions,
        ruleFiles: formFiles,
        ruleGpu: formGpu,
        evalMetric: formEvalMetric
      };

      setCompetitions([newComp, ...competitions]);
      // Initialize empty lists for teams and leaderboards
      setTeams(prev => ({ ...prev, [newId]: [] }));
      setLeaderboards(prev => ({ ...prev, [newId]: [] }));

      triggerToast(`🎉 成功创建竞赛项目：「${formName}」`);
    } else if (drawerMode === "edit" && editingCompId) {
      setCompetitions(competitions.map(c => 
        c.id === editingCompId 
          ? { 
              ...c, 
              name: formName, 
              type: formType, 
              status: formStatus, 
              duration: formDuration, 
              description: formDescription,
              format: formFormat,
              ruleMaxSubmissions: formMaxSubmissions,
              ruleFiles: formFiles,
              ruleGpu: formGpu,
              evalMetric: formEvalMetric
            } 
          : c
      ));
      triggerToast(`💾 成功保存更新竞赛项目：「${formName}」`);
    }
    setShowDrawer(false);
  };

  const handleDeleteCompetition = (id: string, name: string) => {
    if (confirm(`确定要彻底删除该竞赛项目吗？「${name}」\n删除后将无法恢复其下的队伍及成绩记录！`)) {
      setCompetitions(competitions.filter(c => c.id !== id));
      triggerToast(`🗑️ 已彻底删除竞赛项目：「${name}」`);
    }
  };

  const handleToggleStatus = (id: string, nextStatus: Competition["status"]) => {
    setCompetitions(competitions.map(c => 
      c.id === id ? { ...c, status: nextStatus } : c
    ));
    triggerToast(`🔄 竞赛状态已调整为: [${nextStatus}]`);
  };

  // Applications approval workflows
  const handleApproveRequest = (app: ApplicationRequest) => {
    // 1. Update request status to '已通过'
    setApplications(applications.map(a => a.id === app.id ? { ...a, status: "已通过" } : a));
    
    // 2. Automatically generate and append it to our Master Competitions array!
    const newCompId = `comp-${Date.now()}`;
    const newComp: Competition = {
      id: newCompId,
      name: app.contestName,
      type: "大模型开发", // default type matching typical GNN context
      status: "筹备中",
      duration: "2026-06-15 至 2026-08-15",
      teamsCount: 0,
      participants: 0,
      description: app.description,
      format: app.format,
      ruleMaxSubmissions: 5,
      ruleFiles: "zip",
      ruleGpu: "50 GPU小时",
      evalMetric: "AUC"
    };

    setCompetitions([newComp, ...competitions]);
    setTeams(prev => ({ ...prev, [newCompId]: [] }));
    setLeaderboards(prev => ({ ...prev, [newCompId]: [] }));

    setSelectedApp(null);
    triggerToast(`✅ 审核通过！该校级赛事已成功升级并上架平台公开竞赛列表。`);
  };

  const handleRejectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !rejectReason.trim()) return;

    setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, status: "已拒绝" } : a));
    setSelectedApp(null);
    setRejectReason("");
    setShowRejectReasonInput(false);
    triggerToast(`❌ 竞赛公开申请已被拒绝，已反馈退回原因给对应老师。`);
  };

  // Team controls: Ban & Unban
  const handleToggleTeamBan = (teamId: string, currentStatus: Team["status"]) => {
    const nextStatus: Team["status"] = currentStatus === "正常" ? "已封禁" : "正常";
    const compTeams = teams[selectedCompId] || [];

    setTeams({
      ...teams,
      [selectedCompId]: compTeams.map(t => t.id === teamId ? { ...t, status: nextStatus } : t)
    });

    triggerToast(nextStatus === "已封禁" ? `🚫 已封禁该参赛队伍，终止其提交测试权限` : `✅ 已解除该队伍封禁，恢复其实验提交权限`);
  };

  // Leaderboard Score manually change & rank sort
  const handleOpenScoreAdjust = (record: LeaderboardRecord) => {
    setAdjustingRecord(record);
    setAdjustScoreVal(record.score);
  };

  const handleSaveAdjustedScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingRecord) return;

    const compLeaderboard = leaderboards[selectedCompId] || [];
    
    // Update score
    const updatedList = compLeaderboard.map(rec => 
      rec.id === adjustingRecord.id ? { ...rec, score: parseFloat(adjustScoreVal.toFixed(4)), time: "刚刚手动调整" } : rec
    );

    // Sort descending by score
    updatedList.sort((a, b) => b.score - a.score);

    setLeaderboards({
      ...leaderboards,
      [selectedCompId]: updatedList
    });

    setAdjustingRecord(null);
    triggerToast(`🏆 成绩调整成功！排行榜排名已根据新分数重新排列。`);
  };

  // Excel package data exporter simulator
  const handleSimulateExport = (datasetName: string) => {
    setIsExporting(true);
    triggerToast(`⏳ 正在准备并打包「${datasetName}」历史提交与分析报表...`);
    
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`📥 打包完毕！「${datasetName}_数据导出.xlsx」已下载至本地。`);
    }, 2000);
  };

  // Filters computed list
  const filteredCompetitions = competitions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(compSearch.toLowerCase()) || c.description.toLowerCase().includes(compSearch.toLowerCase());
    const matchesType = compTypeFilter === "全部" || c.type === compTypeFilter;
    const matchesStatus = compStatusFilter === "全部" || c.status === compStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800 font-sans">
      
      {/* Left Navigation Sidebar */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full select-none">
        {/* Title Header */}
        <div className="p-5 border-b border-neutral-border shrink-0 flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-[#fa541c]" />
          <div>
            <h2 className="text-sm font-black text-neutral-title leading-tight">公开竞赛管理</h2>
            <span className="text-[10px] text-neutral-caption font-bold">ZHIYUN COMPETITION HUB</span>
          </div>
        </div>

        {/* Tab Options */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: "overview", title: "数据大盘", icon: BarChart2 },
            { id: "list", title: "竞赛列表与状态", icon: Trophy },
            { id: "review", title: "公开申请审核", icon: Shield, badge: applications.filter(a => a.status === "待审核").length },
            { id: "teams", title: "参赛队伍管理", icon: Users },
            { id: "scores", title: "成绩与排行榜", icon: TrendingUp }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[13px] font-semibold transition-all duration-200 cursor-pointer border-0 bg-transparent text-left",
                  isActive 
                    ? "bg-[#fff2e8] text-[#fa541c] shadow-3xs" 
                    : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.title}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold scale-90">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Workspace */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0 custom-scrollbar relative">
        
        {/* Toast Alert Pop-up */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-800 text-xs font-bold animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ==================== 1. 数据大盘 ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <BarChart2 className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>竞赛运营统计大盘</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                统计平台当前举办的公开赛事及校级创新竞赛的核心运营指标、参赛活跃度与算力分配配额开销统计。
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
              {[
                { title: "公开赛事总量", value: "8 场", sub: "包含 3 场在办大模型创新赛", color: "text-[#fa541c]" },
                { title: "参赛注册总人次", value: "4,846 人", sub: "本月新增活跃 1,245 人", color: "text-emerald-500" },
                { title: "提报算法作品次数", value: "15,640 次", sub: "沙箱评测自动比对通过率 87%", color: "text-blue-500" },
                { title: "GPU累计算力消耗", value: "1,840 h", sub: "当前队列空闲，平均等待 12s", color: "text-purple-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider">{card.title}</span>
                  <div className="my-3">
                    <span className={cn("text-2.5xl font-black font-mono", card.color)}>{card.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-body">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Charts and distributions mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              
              {/* Box 1: Popular categories */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-[#fa541c]" />
                      <span>热门赛事赛道分布比例</span>
                    </span>
                    <span className="text-[10px] text-neutral-caption font-bold">热门赛道占比统计</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { type: "大模型应用开发 (LLM Apps)", count: 2100, pct: "43%", color: "bg-[#fa541c]" },
                      { type: "计算机视觉与图像分割 (CV)", count: 1200, pct: "25%", color: "bg-emerald-500" },
                      { type: "经典非平衡样本分类 (ML)", count: 890, pct: "18%", color: "bg-blue-500" },
                      { type: "安全防御与云渗透 (CTF)", count: 656, pct: "14%", color: "bg-purple-500" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-neutral-body">
                          <span>{item.type}</span>
                          <span>{item.count}人 ({item.pct})</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-500", item.color)} style={{ width: item.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-neutral-caption font-medium">数据基于 2026 年度统计导出，各赛道活跃比例实时同步。</span>
                  <button 
                    onClick={() => handleSimulateExport("平台整体竞赛数据统计大盘")}
                    disabled={isExporting}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出大盘数据报表</span>
                  </button>
                </div>
              </div>

              {/* Box 2: Quick Status Indicator overview */}
              <div className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <span className="text-xs font-bold text-neutral-title flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>正在开展中赛事动态</span>
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {competitions.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex justify-between items-start p-3 bg-neutral-50 rounded-lg border border-neutral-200/50">
                        <div className="space-y-1">
                          <span className="font-bold text-neutral-title block max-w-[180px] truncate">{c.name}</span>
                          <span className="text-[10px] text-neutral-caption block font-mono">{c.duration}</span>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-[4px] text-[9px] font-black border uppercase shrink-0 scale-90",
                          c.status === "进行中" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                          c.status === "报名中" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                        )}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab("list")}
                  className="w-full text-center text-[#fa541c] hover:text-[#e84a15] text-xs font-bold py-2 border border-[#ffbb96]/45 bg-[#fff2e8]/45 hover:bg-[#fff2e8] rounded-lg transition-colors cursor-pointer shrink-0 mt-4 block"
                >
                  查看完整竞赛列表 ➔
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 2. 竞赛列表与状态管理 ==================== */}
        {activeTab === "list" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Tab Header */}
            <div className="flex justify-between items-start shrink-0">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Trophy className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>平台公开竞赛库</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  管理和发布平台的公开性科学竞赛，监控赛制流转，审核公开申请并动态发布。
                </p>
              </div>
              <button 
                onClick={handleOpenCreateDrawer}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <Plus className="w-4 h-4 font-black" />
                <span>新建公开竞赛</span>
              </button>
            </div>

            {/* Search and filter toolbar */}
            <div className="flex flex-col md:flex-row gap-4 shrink-0 justify-between items-center">
              {/* Search bar */}
              <div className="relative w-full md:w-[280px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索竞赛名称或描述..."
                  value={compSearch}
                  onChange={(e) => setCompSearch(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-medium placeholder-neutral-400"
                />
              </div>

              {/* Select filters */}
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                  <Filter className="w-3.5 h-3.5 text-neutral-400" />
                  <span>赛道类别:</span>
                  <select 
                    value={compTypeFilter}
                    onChange={(e) => setCompTypeFilter(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c]"
                  >
                    <option value="全部">全部赛道</option>
                    <option value="大模型开发">大模型开发</option>
                    <option value="计算机视觉">计算机视觉</option>
                    <option value="机器学习">机器学习</option>
                    <option value="自然语言处理">自然语言处理</option>
                    <option value="安全对抗">安全对抗</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                  <span>竞赛状态:</span>
                  <select 
                    value={compStatusFilter}
                    onChange={(e) => setCompStatusFilter(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c]"
                  >
                    <option value="全部">所有状态</option>
                    <option value="筹备中">筹备中</option>
                    <option value="报名中">报名中</option>
                    <option value="进行中">进行中</option>
                    <option value="已结束">已结束</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Competitions table list container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4">竞赛名称</th>
                      <th className="px-6 py-4">赛道类型</th>
                      <th className="px-6 py-4">报名情况 (队伍/人数)</th>
                      <th className="px-6 py-4">状态流转</th>
                      <th className="px-6 py-4">竞赛周期</th>
                      <th className="px-6 py-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredCompetitions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2 animate-pulse" />
                          <span>没有找到符合搜索和筛选条件的竞赛项目。</span>
                        </td>
                      </tr>
                    ) : (
                      filteredCompetitions.map((comp) => (
                        <tr key={comp.id} className="hover:bg-neutral-50/30 transition-colors">
                          {/* Name and Description preview */}
                          <td className="px-6 py-4 max-w-[320px]">
                            <span className="font-black text-neutral-title block truncate" title={comp.name}>{comp.name}</span>
                            <span className="text-[10.5px] text-neutral-caption block mt-1 truncate" title={comp.description}>{comp.description}</span>
                          </td>
                          {/* Type */}
                          <td className="px-6 py-4 font-bold text-neutral-body">
                            {comp.type}
                          </td>
                          {/* Enrollment */}
                          <td className="px-6 py-4 font-mono font-bold text-neutral-body">
                            {comp.teamsCount} 支队伍 / {comp.participants} 人
                          </td>
                          {/* Status Badge & direct switcher */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded-[4px] text-[10px] font-black border uppercase tracking-wider font-sans",
                                comp.status === "进行中" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                                comp.status === "报名中" ? "bg-blue-50 border-blue-200 text-blue-600" :
                                comp.status === "筹备中" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-neutral-50 border-neutral-200 text-neutral-500"
                              )}>
                                {comp.status}
                              </span>

                              {/* Simple direct dropdown status manager */}
                              <select
                                value={comp.status}
                                onChange={(e) => handleToggleStatus(comp.id, e.target.value as any)}
                                className="border border-neutral-200 rounded text-[10px] bg-white px-1 py-0.5 focus:outline-none"
                              >
                                <option value="筹备中">筹备中</option>
                                <option value="报名中">报名中</option>
                                <option value="进行中">进行中</option>
                                <option value="已结束">已结束</option>
                              </select>
                            </div>
                          </td>
                          {/* Duration */}
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-body font-semibold">
                            {comp.duration}
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => handleOpenEditDrawer(comp)}
                                className="text-blue-500 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                                title="编辑竞赛属性"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>编辑</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteCompetition(comp.id, comp.name)}
                                className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                                title="删除竞赛"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>删除</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Bottom count footer */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>总共登记: {competitions.length} 个竞赛项目</span>
                <span className="text-[10px] text-neutral-caption font-medium">提示：状态标记为[进行中]时，评测沙箱将全天候响应参赛者的提报比对。</span>
              </div>
            </div>

            {/* --- Sliding Drawer for Creating/Editing (ZhiYun Premium Form Sheet) --- */}
            {showDrawer && (
              <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/35 backdrop-blur-xs animate-fade-in">
                
                {/* Click outside backdrop close handler */}
                <div className="flex-1" onClick={() => setShowDrawer(false)}></div>

                {/* Main Form container sliding in */}
                <div className="w-full max-w-[560px] bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
                  
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-neutral-border flex items-center justify-between shrink-0 bg-neutral-50">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5.5 h-5.5 text-[#fa541c]" />
                      <h2 className="text-base font-black text-neutral-title">
                        {drawerMode === "create" ? "新建公开竞赛项目" : "编辑竞赛配置信息"}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setShowDrawer(false)}
                      className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Body Scroll Container */}
                  <form onSubmit={handleSaveCompetition} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
                    
                    {/* Section 1: Basic */}
                    <div className="space-y-4">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">1. 竞赛基本属性</h3>
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">
                          <span className="text-red-500 font-black mr-0.5">*</span> 竞赛项目名称：
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="例如: 2026年智云杯大语言模型应用创新赛"
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium"
                        />
                      </div>

                      {/* Dropdown Type & Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">赛道方向类别：</label>
                          <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium"
                          >
                            <option value="大模型开发">大模型开发</option>
                            <option value="计算机视觉">计算机视觉</option>
                            <option value="机器学习">机器学习</option>
                            <option value="自然语言处理">自然语言处理</option>
                            <option value="安全对抗">安全对抗</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">初始竞赛阶段状态：</label>
                          <select
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value as any)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium"
                          >
                            <option value="筹备中">筹备中</option>
                            <option value="报名中">报名中</option>
                            <option value="进行中">进行中</option>
                            <option value="已结束">已结束</option>
                          </select>
                        </div>
                      </div>

                      {/* Date selection & Duration */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">竞赛起止日期周期：</label>
                        <input
                          type="text"
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          placeholder="例如: 2026-06-01 至 2026-08-31"
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 font-mono font-medium"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">竞赛主旨与详实背景描述：</label>
                        <textarea
                          rows={3}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="说明本届赛事的考察大纲、核心开发沙箱环境要求、背景及鼓励方向等信息..."
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800 placeholder-neutral-400 font-medium resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Section 2: Format */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">2. 赛制与团队配额设定</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">组队形式要求：</label>
                          <input
                            type="text"
                            value={formFormat}
                            onChange={(e) => setFormFormat(e.target.value)}
                            placeholder="如: 团队赛 (最大5人)"
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">单队最大提报测试次数/天：</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={formMaxSubmissions}
                            onChange={(e) => setFormMaxSubmissions(parseInt(e.target.value) || 5)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Rules & Quotas */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">3. 提报规则与算力隔离分配</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">限制算法提交文件类型：</label>
                          <input
                            type="text"
                            value={formFiles}
                            onChange={(e) => setFormFiles(e.target.value)}
                            placeholder="如: zip, py, ipynb"
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-neutral-700 block">单队GPU沙箱配额时长：</label>
                          <select
                            value={formGpu}
                            onChange={(e) => setFormGpu(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-medium"
                          >
                            <option value="30 GPU小时">30 GPU小时</option>
                            <option value="50 GPU小时">50 GPU小时</option>
                            <option value="100 GPU小时">100 GPU小时</option>
                            <option value="不限">全面透传 (不限)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Scoring */}
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <h3 className="font-black text-neutral-title text-sm border-l-3 border-[#fa541c] pl-2">4. 评分评测算法定义</h3>
                      
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 block">自动评分数学公式与比对指标：</label>
                        <input
                          type="text"
                          value={formEvalMetric}
                          onChange={(e) => setFormEvalMetric(e.target.value)}
                          placeholder="例如: AUC / Accuracy / F1-Score / MSE / IoU"
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs bg-white text-neutral-800 font-bold focus:outline-none focus:border-[#fa541c]"
                        />
                      </div>
                    </div>

                  </form>

                  {/* Drawer Footer Actions */}
                  <div className="p-6 border-t border-neutral-border bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDrawer(false)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors shadow-3xs"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      onClick={handleSaveCompetition}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      {drawerMode === "create" ? "发布并公开竞赛" : "保存更新参数"}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== 3. 公开申请审核 ==================== */}
        {activeTab === "review" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            <div>
              <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                <Shield className="w-5.5 h-5.5 text-[#fa541c]" />
                <span>公开赛事申请审核控制台</span>
              </h1>
              <p className="text-xs text-neutral-caption mt-1">
                处理来自高校合作教师发起的“校级封闭赛/课程赛升级为平台公开竞赛”申请。通过升级的赛事将享受平台算力分发及高维自动排行榜。
              </p>
            </div>

            {/* List of pending items */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {applications.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-neutral-border text-neutral-400">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <span className="text-xs font-semibold">所有教师申请已审核处理完毕，状态清空！</span>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-xl border border-neutral-border shadow-3xs space-y-4 relative overflow-hidden transition-all duration-200 hover:shadow-xs">
                    
                    {/* Status Badge background hint stripe */}
                    <div className={cn(
                      "absolute top-0 left-0 w-2 h-full",
                      app.status === "待审核" ? "bg-amber-500" :
                      app.status === "已通过" ? "bg-emerald-500" : "bg-red-500"
                    )} />

                    {/* App Row Header */}
                    <div className="flex justify-between items-start pl-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-neutral-title text-sm block">{app.contestName}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-[4px] text-[9px] font-black border uppercase tracking-wider",
                            app.status === "待审核" ? "bg-amber-50 border-amber-200 text-amber-600" :
                            app.status === "已通过" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"
                          )}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10.5px] text-neutral-caption font-semibold mt-1">
                          <span>申请单位: {app.school}</span>
                          <span>主事申报人: {app.teacher}</span>
                          <span>提交时间: {app.submitDate}</span>
                        </div>
                      </div>
                      
                      {/* Review Main CTA action triggers */}
                      {app.status === "待审核" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs"
                          >
                            审核公开申请
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-caption font-bold">审核流程已终结</span>
                      )}
                    </div>

                    {/* App Specs body */}
                    <div className="bg-neutral-50/50 p-4 rounded-lg text-xs space-y-3 pl-3 text-neutral-body border border-neutral-100">
                      <div>
                        <strong>💡 赛事详尽主旨背景：</strong>
                        <p className="mt-1 leading-relaxed text-[11px] font-semibold text-neutral-title">{app.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-100 text-[11px]">
                        <div><strong>赛制形式:</strong> {app.format}</div>
                        <div><strong>评测提交规则:</strong> {app.rules}</div>
                        <div><strong>计算评分标准:</strong> {app.scoring}</div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* --- Open Requests Details Modal dialog --- */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs animate-fade-in p-4">
                <div className="w-full max-w-[500px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Shield className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>审核公开竞赛升级申请</span>
                    </span>
                    <button 
                      onClick={() => { setSelectedApp(null); setShowRejectReasonInput(false); }}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-6 overflow-y-auto space-y-4 max-h-[420px] custom-scrollbar">
                    <div className="p-4 bg-[#fff2e8] border border-[#ffbb96]/45 rounded-lg space-y-2">
                      <div className="text-[11px] font-black text-[#fa541c]">升级后公开说明：</div>
                      <p className="text-[10.5px] leading-relaxed text-neutral-body font-medium">
                        一旦通过审核，该赛事将自动转换升级并**上架至平台公开竞赛列表中**。平台将向全国所有高校租户用户敞开注册报名，并由平台自动托管调度沙箱算力容器进行自动算法检测评测。
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div><strong>申请赛项:</strong> <span className="font-bold text-neutral-title">{selectedApp.contestName}</span></div>
                      <div><strong>发起单位:</strong> <span className="font-medium text-neutral-body">{selectedApp.school} - {selectedApp.teacher}</span></div>
                      <div><strong>考核主旨:</strong> <p className="text-neutral-body italic leading-relaxed font-medium bg-neutral-50 p-2.5 rounded border border-neutral-100">{selectedApp.description}</p></div>
                    </div>

                    {showRejectReasonInput && (
                      <div className="space-y-2 pt-2 border-t border-neutral-100 animate-slide-up">
                        <label className="font-bold text-neutral-700 block text-red-500">请输入回绝驳回原因：</label>
                        <textarea
                          rows={3}
                          required
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="说明驳回理由，如: 算力配额超限，请降低测试次数..."
                          className="w-full border border-neutral-200 rounded-lg p-2 focus:outline-none focus:border-[#fa541c] bg-white text-neutral-800"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    {showRejectReasonInput ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowRejectReasonInput(false)}
                          className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                        >
                          返回
                        </button>
                        <button
                          type="button"
                          onClick={handleRejectRequest}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          确认拒绝申请
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowRejectReasonInput(true)}
                          className="bg-white hover:bg-red-50 text-red-500 font-bold px-4 py-2 border border-red-200 rounded-lg cursor-pointer transition-colors"
                        >
                          驳回申请
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(selectedApp)}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                        >
                          同意升级公开
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. 参赛队伍管理 ==================== */}
        {activeTab === "teams" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header + Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <Users className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>参赛报名队伍名册</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  检索名册、筛选及监控队伍提交频次。对于违规刷分或脚本异常提报可直接拉黑封禁。
                </p>
              </div>

              {/* Contest selector mapping */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                <span>选择目标公开竞赛:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#fa541c]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teams master list container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4">队伍名称</th>
                      <th className="px-6 py-4">队长姓名</th>
                      <th className="px-6 py-4">队员结构</th>
                      <th className="px-6 py-4">所属院校</th>
                      <th className="px-6 py-4">沙箱累计提报</th>
                      <th className="px-6 py-4">队伍状态</th>
                      <th className="px-6 py-4">报名登记时间</th>
                      <th className="px-6 py-4 text-center">状态管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {(!teams[selectedCompId] || teams[selectedCompId].length === 0) ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>该赛事当前暂无注册或提报中的参赛队伍名录。</span>
                        </td>
                      </tr>
                    ) : (
                      teams[selectedCompId].map((team) => (
                        <tr key={team.id} className="hover:bg-neutral-50/30 transition-colors">
                          <td className="px-6 py-4 font-black text-neutral-title">{team.name}</td>
                          <td className="px-6 py-4 font-medium text-neutral-body">{team.captain}</td>
                          <td className="px-6 py-4 font-mono font-semibold text-neutral-body">{team.membersCount} 人结构</td>
                          <td className="px-6 py-4 font-medium text-neutral-body">{team.school}</td>
                          <td className="px-6 py-4 font-mono font-bold text-[#fa541c]">{team.submissions} 次</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded-[4px] text-[9.5px] font-black border uppercase tracking-wider",
                              team.status === "正常" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"
                            )}>
                              {team.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-caption font-semibold">{team.regDate}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleTeamBan(team.id, team.status)}
                              className={cn(
                                "text-xs font-bold px-3 py-1 border rounded-lg cursor-pointer transition-colors shadow-3xs",
                                team.status === "正常" 
                                  ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" 
                                  : "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                              )}
                            >
                              {team.status === "正常" ? "封禁" : "恢复"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Counts bar */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>当前赛事登记队伍量: {teams[selectedCompId]?.length || 0} 支</span>
                <button
                  onClick={() => handleSimulateExport(`参赛队伍花名册_${selectedCompId}`)}
                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 border border-neutral-200 rounded-lg shadow-3xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出队伍花名册</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== 5. 成绩与排行榜 ==================== */}
        {activeTab === "scores" && (
          <div className="space-y-6 flex flex-col flex-1 min-h-0 animate-slide-up">
            
            {/* Header + Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 border-b border-neutral-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-neutral-title flex items-center gap-2">
                  <TrendingUp className="w-5.5 h-5.5 text-[#fa541c]" />
                  <span>竞赛成绩与实时排行榜</span>
                </h1>
                <p className="text-xs text-neutral-caption mt-1">
                  查看及校准队伍的最高得分。支持手动微调分值并在榜单中实时重整排名。
                </p>
              </div>

              {/* Contest selector mapping */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-body">
                <span>选择目标公开竞赛:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#fa541c]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaderboard Table container */}
            <div className="bg-white rounded-xl border border-neutral-border shadow-3xs overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[11.5px] text-neutral-600 font-bold uppercase select-none">
                      <th className="px-6 py-4 w-20 text-center">名次</th>
                      <th className="px-6 py-4">参赛队名</th>
                      <th className="px-6 py-4">所属院校</th>
                      <th className="px-6 py-4">评测最高得分</th>
                      <th className="px-6 py-4">最终提交文件</th>
                      <th className="px-6 py-4">自动编译代码报告</th>
                      <th className="px-6 py-4">最后提报更新时间</th>
                      <th className="px-6 py-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {(!leaderboards[selectedCompId] || leaderboards[selectedCompId].length === 0) ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <span>该赛事当前暂无成绩或算法提交排行榜数据。</span>
                        </td>
                      </tr>
                    ) : (
                      leaderboards[selectedCompId].map((rec, index) => (
                        <tr key={rec.id} className="hover:bg-neutral-50/30 transition-colors">
                          {/* Rank */}
                          <td className="px-6 py-4 text-center select-none">
                            <span className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10.5px] font-black font-mono shadow-3xs",
                              index === 0 ? "bg-amber-100 text-amber-600 font-bold" :
                              index === 1 ? "bg-slate-100 text-slate-600 font-bold" :
                              index === 2 ? "bg-orange-100 text-orange-600 font-bold" : "bg-neutral-100 text-neutral-500"
                            )}>
                              {index + 1}
                            </span>
                          </td>
                          {/* Team Name */}
                          <td className="px-6 py-4 font-black text-neutral-title">{rec.teamName}</td>
                          {/* School */}
                          <td className="px-6 py-4 font-medium text-neutral-body">{rec.school}</td>
                          {/* Score */}
                          <td className="px-6 py-4 font-mono font-bold text-[#fa541c] text-sm">
                            {rec.score}
                          </td>
                          {/* File download trigger */}
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-body">
                            <button
                              onClick={() => triggerToast(`📥 正在下载学生最终提交算法压缩包: ${rec.file}`)}
                              className="text-blue-500 hover:text-blue-700 font-medium hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                              title="点击模拟下载包"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{rec.file}</span>
                            </button>
                          </td>
                          {/* Static report snippet */}
                          <td className="px-6 py-4 max-w-[200px]">
                            <span className="text-[10.5px] text-neutral-caption block truncate" title={rec.codeReport}>
                              {rec.codeReport}
                            </span>
                          </td>
                          {/* Update Time */}
                          <td className="px-6 py-4 font-mono text-[10.5px] text-neutral-caption font-semibold">{rec.time}</td>
                          {/* Score Mod trigger */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleOpenScoreAdjust(rec)}
                              className="text-xs font-bold text-neutral-title px-2.5 py-1 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors shadow-3xs"
                            >
                              修改得分
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom statistics and download triggers */}
              <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex justify-between items-center text-xs font-semibold text-neutral-body shrink-0 select-none">
                <span>榜单显示当前前 {leaderboards[selectedCompId]?.length || 0} 支成绩最高的有效队伍</span>
                <button
                  onClick={() => handleSimulateExport(`竞赛成绩排行榜_${selectedCompId}`)}
                  className="text-[#fa541c] hover:text-[#e84a15] font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 border border-neutral-200 rounded-lg shadow-3xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出总成绩单EXCEL</span>
                </button>
              </div>

            </div>

            {/* --- Score Adjustment Dialog Modal --- */}
            {adjustingRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-fade-in">
                <form onSubmit={handleSaveAdjustedScore} className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up flex flex-col text-xs">
                  
                  {/* Header */}
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-border flex items-center justify-between shrink-0">
                    <span className="font-black text-neutral-title text-sm flex items-center gap-1.5">
                      <Sliders className="w-4.5 h-4.5 text-[#fa541c]" />
                      <span>人工修改比赛分值</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setAdjustingRecord(null)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body inputs */}
                  <div className="p-6 space-y-4">
                    <div className="text-xs space-y-1.5">
                      <div><strong>修调队伍:</strong> <span className="font-bold text-neutral-title">{adjustingRecord.teamName} ({adjustingRecord.school})</span></div>
                      <div><strong>原评测得分:</strong> <span className="font-mono text-neutral-caption font-bold">{adjustingRecord.score}</span></div>
                    </div>

                    <div className="space-y-2 border-t border-neutral-100 pt-3">
                      <label className="font-bold text-neutral-700 block">新赋分得分分值：</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0.0}
                          max={1.0}
                          step={0.0001}
                          value={adjustScoreVal}
                          onChange={(e) => setAdjustScoreVal(parseFloat(e.target.value) || 0.0)}
                          className="flex-1 accent-[#fa541c] cursor-pointer"
                        />
                        <input
                          type="number"
                          min={0.0}
                          max={1.0}
                          step={0.0001}
                          value={adjustScoreVal}
                          onChange={(e) => setAdjustScoreVal(parseFloat(e.target.value) || 0.0)}
                          className="w-20 border border-neutral-200 rounded px-2 py-1 text-center font-mono font-bold text-sm bg-neutral-50 text-neutral-800"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-caption block mt-1">※ 请确保录入的值在 0.0000 至 1.0000 范围区间。</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-border flex items-center justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAdjustingRecord(null)}
                      className="bg-white hover:bg-neutral-100 text-neutral-title font-bold px-4 py-2 border border-neutral-border rounded-lg cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      保存微调值
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
