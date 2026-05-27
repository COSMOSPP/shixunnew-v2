import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Award, 
  Compass, 
  Sparkles, 
  CheckCircle,
  X,
  FileText,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Competition {
  id: string;
  name: string;
  type: "AI算法" | "大模型" | "云原生" | "安全运维" | "公有云" | "私有云";
  category: "ai" | "cloud";
  status: "进行中" | "未开始" | "已结束";
  time: string;
  participants: number;
  prize: string;
  sponsor: string;
  desc: string;
  difficulty: "入门" | "中阶" | "高阶";
  rules: string[];
  rewards: { rank: string; prize: string }[];
}

export default function CompetitionList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "ai" | "cloud">("all");
  const [activeStatus, setActiveStatus] = useState<"all" | "ongoing" | "upcoming" | "ended">("all");
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [registeredComps, setRegisteredComps] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCompName, setSuccessCompName] = useState("");

  const competitions: Competition[] = [
    {
      id: "comp-101",
      name: "DeepSeek-R1 大模型垂直领域微调算法挑战赛",
      type: "大模型",
      category: "ai",
      status: "进行中",
      time: "2026-05-01 至 2026-06-15",
      participants: 3420,
      prize: "￥120,000",
      sponsor: "翼云智能科技有限公司",
      desc: "本赛事旨在通过行业领域特有问答及逻辑数据，对开源 DeepSeek-R1 模型进行高效参数微调（如 LoRA/QLoRA/Full-FT），在医疗咨询与司法常识两大专业问答指标中突破模型边界。",
      difficulty: "高阶",
      rules: [
        "参赛团队需提交训练脚本、适配器权重（LoRA）及微调前后的系统评测结果。",
        "禁止人工干预标注测试集数据，一经发现取消参赛资格。",
        "性能评估以推理速度、语义相似度得分（BLEU/ROUGE）及行业专家盲审为准。"
      ],
      rewards: [
        { rank: "第一名 (1支队伍)", prize: "￥60,000 + 荣誉证书 + 直通大厂面试" },
        { rank: "第二名 (2支队伍)", prize: "￥20,000 + 荣誉证书" },
        { rank: "优秀奖 (5支队伍)", prize: "￥4,000 + 荣誉证书" }
      ]
    },
    {
      id: "comp-102",
      name: "多云架构高可用部署与故障恢复对抗赛",
      type: "云原生",
      category: "cloud",
      status: "未开始",
      time: "2026-06-20 至 2026-07-30",
      participants: 1280,
      prize: "￥80,000",
      sponsor: "华为云算力部",
      desc: "模拟企业级大规模异地多活及云原生混合部署场景。参赛选手需要快速完成K8s跨云集群联邦搭建，设计完善的高可用网关，并在系统被注入突发性故障的10分钟内实现无感主备切换与自愈恢复。",
      difficulty: "高阶",
      rules: [
        "比赛统一在实训沙箱环境进行，资源额度配额受限。",
        "网络高可用保障率需达到 99.99%，任何请求丢失均扣分。",
        "编写自动化故障响应脚本，根据自愈恢复的响应时效与稳定性评分。"
      ],
      rewards: [
        { rank: "特等奖 (1支队伍)", prize: "￥40,000 + 华为云实训绿卡" },
        { rank: "一等奖 (2支队伍)", prize: "￥15,000" },
        { rank: "极客精神奖 (3支队伍)", prize: "￥5,000" }
      ]
    },
    {
      id: "comp-103",
      name: "企业级网络安全渗透与红蓝防攻防对抗赛",
      type: "安全运维",
      category: "cloud",
      status: "进行中",
      time: "2026-05-15 至 2026-06-20",
      participants: 2150,
      prize: "￥50,000",
      sponsor: "腾讯安全防护实验室",
      desc: "基于真实企业内网拓铺，通过虚拟局域网靶场提供红蓝对决沙盒。红队实施限时多漏洞链渗透，蓝队编写自动化防护与监测规则阻断扫描攻击，考察系统运维安全综合底座能力。",
      difficulty: "中阶",
      rules: [
        "严格遵循竞赛红线，禁止对裁判系统及公共基础设施发起拒绝服务攻击（DDoS）。",
        "以捕获靶机上的特定 FLAG 字符串为得分判定依据。",
        "蓝队必须提交完整的安全审计日志与攻击防御架构分析报告。"
      ],
      rewards: [
        { rank: "卓越红蓝星 (1名)", prize: "￥25,000" },
        { rank: "优秀防守团队 (2名)", prize: "￥10,000" },
        { rank: "技术突破奖 (1名)", prize: "￥5,000" }
      ]
    },
    {
      id: "comp-104",
      name: "Stable Diffusion XL 商业海报创意设计挑战赛",
      type: "AI算法",
      category: "ai",
      status: "已结束",
      time: "2026-03-10 至 2026-04-20",
      participants: 4890,
      prize: "￥30,000",
      sponsor: "视觉中国版权中心",
      desc: "利用 SD-XL 模型与 ControlNet 条件引导技术，根据给定品牌提示词与结构图定制出商业级高拟真平面视觉海报。完美考核参赛者对Prompt工程、微调LoRA模型以及图层融合技术的掌控。",
      difficulty: "入门",
      rules: [
        "所有海报设计图生成过程必须开源对应的工作流 json 与种子数，确保结果可复现。",
        "作品严禁抄袭已有商标，模型生成内容需遵循版权许可协议。",
        "评分指标包含视觉创意力 40%、技术应用难度 30%、商业转化契合度 30%。"
      ],
      rewards: [
        { rank: "至尊创意金奖 (1名)", prize: "￥15,000 + 视觉中国约稿作者绿卡" },
        { rank: "银奖 (2名)", prize: "￥5,000" },
        { rank: "铜奖 (5名)", prize: "￥1,000" }
      ]
    },
    {
      id: "comp-105",
      name: "基于 Dify 搭建企业级智能体 Agent 应用大赛",
      type: "大模型",
      category: "ai",
      status: "进行中",
      time: "2026-05-10 至 2026-06-25",
      participants: 1940,
      prize: "￥60,000",
      sponsor: "Dify 开源社区",
      desc: "使用 Dify 无代码/低代码流程图编排工具，连接企业自建向量知识库（RAG）和一系列API工具插件，开发出一款能在网页端交互、自动执行客户接待、意图分析及后台录单的行业大模型 Agent 应用。",
      difficulty: "中阶",
      rules: [
        "智能体应至少包含 3 个以上的自定义 Tool 接口调用与条件路由分支。",
        "意图识别率与流程卡死纠错响应度需通过沙箱测试集高强度的自动化压测。",
        "评委组将评估其创新性、技术架构完整性及落地商用价值得分。"
      ],
      rewards: [
        { rank: "最佳 Agent 奖 (1名)", prize: "￥30,000" },
        { rank: "行业应用创新奖 (2名)", prize: "￥10,000" },
        { rank: "优秀开发者荣誉", prize: "Dify 官方全额奖学金与勋章" }
      ]
    }
  ];

  // Filters logic
  const filteredCompetitions = competitions.filter((comp) => {
    // 1. Search Query
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category Tab
    const matchesCategory = activeCategory === "all" || comp.category === activeCategory;
    
    // 3. Status Tab
    const matchesStatus = 
      activeStatus === "all" ||
      (activeStatus === "ongoing" && comp.status === "进行中") ||
      (activeStatus === "upcoming" && comp.status === "未开始") ||
      (activeStatus === "ended" && comp.status === "已结束");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRegister = (comp: Competition) => {
    if (registeredComps.includes(comp.id)) return;
    setRegisteredComps((prev) => [...prev, comp.id]);
    setSuccessCompName(comp.name);
    setShowSuccessModal(true);
    // Auto increment participants locally to show dynamic update
    comp.participants += 1;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans text-slate-800">
      
      {/* Light-Luxury Futuristic Header */}
      <div className="relative w-full overflow-hidden bg-[#fff5eb] border-b border-[#ffd8bf] py-20 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7a45]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto max-w-[1200px] relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff2e8] border border-[#ffbb96] text-[#fa541c] text-xs font-bold mb-6 tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-[#fa541c]" />
            <span>翼智实战擂台</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            实战竞赛 <span className="text-[#fa541c]">赋能跃升</span>
          </h1>
          <p className="text-slate-600 text-lg font-light max-w-2xl leading-relaxed">
            协同顶尖合作企业及主流开源技术组织，为您定制以真实业务挑战、漏洞防护、大模型微调为背景的沉浸式实战赛道，实现在攻防对决中突破技术瓶颈！
          </p>
        </div>
      </div>

      {/* Main Content & Interactive Table Container */}
      <div className="container mx-auto max-w-[1200px] px-4 mt-16">
        
        {/* Glassmorphic Search & Filters Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Direct Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索竞赛名称、分类或赞助方..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fa541c]/10 focus:border-[#fa541c] bg-[#fafafa] placeholder-slate-400 transition-all font-medium"
              />
            </div>

            {/* Stats Summary Panel */}
            <div className="flex items-center gap-6 self-start text-sm border-l border-slate-200 pl-6 h-10 text-slate-500 font-light">
              <div>全部赛事: <span className="font-bold text-slate-900">{competitions.length}</span></div>
              <div>进行中: <span className="font-bold text-emerald-600">{competitions.filter(c => c.status === "进行中").length}</span></div>
              <div>总奖金池: <span className="font-bold text-[#fa541c]">￥340,000</span></div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                  activeCategory === "all" ? "bg-white text-[#fa541c] shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
                )}
              >
                全部赛道
              </button>
              <button
                onClick={() => setActiveCategory("ai")}
                className={cn(
                  "px-5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                  activeCategory === "ai" ? "bg-white text-[#fa541c] shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
                )}
              >
                AI大模型
              </button>
              <button
                onClick={() => setActiveCategory("cloud")}
                className={cn(
                  "px-5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                  activeCategory === "cloud" ? "bg-white text-[#fa541c] shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
                )}
              >
                云原生/安全
              </button>
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">状态筛选:</span>
              <button
                onClick={() => setActiveStatus("all")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                  activeStatus === "all" ? "bg-[#fa541c] border-[#fa541c] text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                全部
              </button>
              <button
                onClick={() => setActiveStatus("ongoing")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                  activeStatus === "ongoing" ? "bg-[#fa541c] border-[#fa541c] text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                进行中
              </button>
              <button
                onClick={() => setActiveStatus("upcoming")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                  activeStatus === "upcoming" ? "bg-[#fa541c] border-[#fa541c] text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                未开始
              </button>
              <button
                onClick={() => setActiveStatus("ended")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                  activeStatus === "ended" ? "bg-[#fa541c] border-[#fa541c] text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                已结束
              </button>
            </div>
          </div>
        </div>

        {/* Visual, Rich-in-detail Table List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          {filteredCompetitions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
              <Compass className="w-16 h-16 text-slate-200 mb-4 animate-pulse" />
              <p className="text-sm font-medium">没有找到符合条件的赛事</p>
              <p className="text-xs text-slate-400 mt-1">您可以尝试更改筛选条件或清空输入搜索项</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-xs tracking-wider font-semibold">
                    <th className="py-4.5 px-6">竞赛名称 / 承办赞助</th>
                    <th className="py-4.5 px-6">方向分类</th>
                    <th className="py-4.5 px-6">活动状态</th>
                    <th className="py-4.5 px-6">竞赛时间</th>
                    <th className="py-4.5 px-6">参与人数</th>
                    <th className="py-4.5 px-6 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {filteredCompetitions.map((comp) => {
                    const isRegistered = registeredComps.includes(comp.id);
                    return (
                      <tr 
                        key={comp.id} 
                        className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                        onClick={() => setSelectedComp(comp)}
                      >
                        
                        {/* Name & Sponsor */}
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1 max-w-[380px]">
                            <span className="font-bold text-slate-900 group-hover:text-[#fa541c] transition-colors leading-snug line-clamp-2">
                              {comp.name}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              由 {comp.sponsor} 提供算力与数据集支持
                            </span>
                          </div>
                        </td>

                        {/* Direction / Type */}
                        <td className="py-5 px-6">
                          <div className="flex flex-col items-start gap-1">
                            <span className={cn(
                              "px-2.5 py-0.5 text-xs font-bold rounded-md border shadow-sm",
                              comp.category === 'ai' 
                                ? "bg-orange-50/70 border-orange-100 text-[#fa541c]" 
                                : "bg-blue-50/70 border-blue-100 text-blue-600"
                            )}>
                              {comp.type}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5">
                              难度: <span className="font-semibold text-slate-600">{comp.difficulty}</span>
                            </span>
                          </div>
                        </td>

                        {/* Event Status */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full relative",
                              comp.status === "进行中" ? "bg-emerald-500" :
                              comp.status === "未开始" ? "bg-orange-400 animate-pulse" : "bg-slate-300"
                            )}>
                              {comp.status === "进行中" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              )}
                            </span>
                            <span className={cn(
                              "font-bold text-xs",
                              comp.status === "进行中" ? "text-emerald-600" :
                              comp.status === "未开始" ? "text-orange-500" : "text-slate-400"
                            )}>
                              {comp.status}
                            </span>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-0.5 text-slate-500 font-medium text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{comp.time.split(" ")[0]}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 pl-5">至 {comp.time.split(" 至 ")[1]}</div>
                          </div>
                        </td>

                        {/* Participant Avatars */}
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400" />
                              {comp.participants.toLocaleString()} 队
                            </span>
                            <div className="flex -space-x-1.5 overflow-hidden">
                              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-500">A</div>
                              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#ffd8bf] text-[8px] flex items-center justify-center font-bold text-[#fa541c]">B</div>
                              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#d6e4ff] text-[8px] flex items-center justify-center font-bold text-blue-500">C</div>
                            </div>
                          </div>
                        </td>

                        {/* Register Actions */}
                        <td className="py-5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedComp(comp)}
                              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs"
                            >
                              详情
                            </Button>
                            
                            {comp.status === "已结束" ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-slate-200 text-slate-400 hover:bg-slate-50 rounded-lg text-xs cursor-default"
                              >
                                已结束
                              </Button>
                            ) : isRegistered ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#ffbb96] bg-[#fff2e8]/40 text-[#fa541c] hover:bg-[#fff2e8]/40 rounded-lg text-xs gap-1 cursor-default font-bold"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> 已报名
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleRegister(comp)}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold px-4 transition-all"
                              >
                                立即报名
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Detail Drawer/Modal */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedComp(null)} />
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 mx-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header decoration */}
            <div className="h-4 bg-gradient-to-r from-orange-400 to-[#fa541c]" />
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedComp(null)}
              className="absolute top-8 right-6 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors border border-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="p-8">
              
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  "px-2.5 py-0.5 text-xs font-bold rounded-md border",
                  selectedComp.category === 'ai' ? "bg-orange-50 border-orange-100 text-[#fa541c]" : "bg-blue-50 border-blue-100 text-blue-600"
                )}>
                  {selectedComp.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {selectedComp.id}</span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-snug">
                {selectedComp.name}
              </h2>
              
              <p className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                奖金池总额: <span className="font-bold text-slate-900">{selectedComp.prize}</span>
                <span className="text-slate-300">|</span>
                由 <span className="font-semibold text-slate-600">{selectedComp.sponsor}</span> 赞助举办
              </p>

              <div className="h-[1px] bg-slate-100 w-full mb-6" />

              {/* Scrollable details */}
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#fa541c]" /> 赛事简介
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedComp.desc}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#fa541c]" /> 奖项分配
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs">
                    {selectedComp.rewards.map((r, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">{r.rank}</span>
                        <span className="font-black text-[#fa541c]">{r.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#fa541c]" /> 参赛规则及评审
                  </h4>
                  <ul className="list-decimal list-inside space-y-2 text-slate-600 text-sm leading-relaxed pl-1">
                    {selectedComp.rules.map((rule, i) => (
                      <li key={i} className="text-xs">{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                <div className="text-xs text-slate-500 font-medium">
                  {selectedComp.status === "进行中" && (
                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-bold">
                      <Clock className="w-3.5 h-3.5 animate-spin" /> 火热报名进行中
                    </span>
                  )}
                  {selectedComp.status === "未开始" && (
                    <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2.5 py-1 rounded-md font-bold">
                      <Calendar className="w-3.5 h-3.5" /> 即将开启通道
                    </span>
                  )}
                  {selectedComp.status === "已结束" && (
                    <span className="text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md font-bold">已结束</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedComp(null)}
                    className="border-slate-200 text-slate-600 rounded-xl"
                  >
                    返回列表
                  </Button>
                  
                  {selectedComp.status === "已结束" ? (
                    <Button 
                      variant="outline" 
                      className="border-slate-200 text-slate-400 rounded-xl cursor-default"
                    >
                      已结束
                    </Button>
                  ) : registeredComps.includes(selectedComp.id) ? (
                    <Button 
                      variant="outline" 
                      className="border-[#ffbb96] bg-[#fff2e8]/40 text-[#fa541c] rounded-xl font-bold gap-1 cursor-default"
                    >
                      <UserCheck className="w-4 h-4" /> 已报名成功
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        handleRegister(selectedComp);
                        setSelectedComp(null);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold px-6"
                    >
                      立即报名参赛
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Glow Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          
          {/* Glowing Card */}
          <div className="bg-white border-2 border-orange-500/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 mx-4 p-8 text-center animate-in fade-in zoom-in-90 duration-200 shadow-[0_20px_50px_rgba(250,84,28,0.15)]">
            <div className="w-16 h-16 rounded-full bg-[#fff2e8] border border-[#ffbb96] flex items-center justify-center text-[#fa541c] mx-auto mb-6 shadow-md shadow-orange-500/5">
              <CheckCircle className="w-8 h-8 text-[#fa541c]" />
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-2">报名提交成功!</h3>
            <p className="text-xs text-slate-400 mb-6 px-4">您已成功加入该项实训竞技赛道</p>
            
            <div className="bg-[#fff5eb] border border-[#ffd8bf] rounded-xl p-4 text-xs font-semibold text-[#fa541c] mb-6 select-all break-words leading-relaxed text-center shadow-inner">
              【{successCompName}】
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-6 px-4">
              实训沙箱环境凭证已全额打入您的个人账户，系统自动为您开启配额。预祝您在本次竞技中取得优异成绩！
            </p>
            
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-semibold"
            >
              我知道了
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
