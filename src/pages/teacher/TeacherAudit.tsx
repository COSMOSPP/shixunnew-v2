import React, { useState } from 'react';
import { 
  ShieldCheck, Search, ChevronDown, Check, X, RotateCcw, HelpCircle, 
  Clock, FileText, Info, Award, MessageSquare, AlertTriangle, AlertCircle, 
  Cpu, BookOpen, FolderKanban, Star, ShieldAlert, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Interface Types ---
interface AuditItemBase {
  id: string;
  applicant: string;
  time: string;
  status: '待审核' | '已通过' | '已拒绝' | '已退回' | '待补充说明';
}

interface AICapabilityAuditItem extends AuditItemBase {
  name: string;
  desc: string;
  scenario: string;
  resources: string;
  compliance: '符合' | '待核对' | '不合规';
}

interface CourseAuditItem extends AuditItemBase {
  courseName: string;
  quality: '优秀' | '合格' | '有待提升';
  compliance: '符合' | '待核对' | '不合规';
  gpuRequested: number; // in hours
  cpuRequested: number; // in hours
  resourceRationality: '合理' | '偏高' | '过高';
}

interface ProjectAuditItem extends AuditItemBase {
  projectName: string;
  quality: '优秀' | '合格' | '有待提升';
  compliance: '符合' | '待核对' | '不合规';
  gpuRequested: number;
  cpuRequested: number;
  resourceRationality: '合理' | '偏高' | '过高';
}

interface PracticeAuditItem extends AuditItemBase {
  title: string;
  quality: number; // 1-5 star
  completeness: '完整' | '部分缺失' | '严重缺失';
  practicality: '高' | '中' | '低';
  compliance: '符合' | '不合规';
  slaDaysLeft: number; // Suggested 3 days SLA
}

interface AuditHistoryItem {
  id: string;
  type: 'AI能力' | '课程' | '项目' | '最佳实践';
  targetName: string;
  applicant: string;
  auditor: string;
  time: string;
  result: '通过' | '拒绝' | '退回修改' | '补充说明';
  opinion: string;
}

export default function TeacherAudit() {
  const [activeTab, setActiveTab] = useState<'ai_capability' | 'course' | 'project' | 'practice' | 'logs'>('ai_capability');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog Open States
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [targetAICap, setTargetAICap] = useState<AICapabilityAuditItem | null>(null);

  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [targetCourse, setTargetCourse] = useState<CourseAuditItem | null>(null);
  const [adjustGpu, setAdjustGpu] = useState(100);
  const [adjustCpu, setAdjustCpu] = useState(200);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [targetProject, setTargetProject] = useState<ProjectAuditItem | null>(null);
  const [adjustProjGpu, setAdjustProjGpu] = useState(50);
  const [adjustProjCpu, setAdjustProjCpu] = useState(100);

  // Best Practice Wizard States (查看申请 -> 评估内容 -> 决定结果 -> 填写意见)
  const [isPracticeDialogOpen, setIsPracticeDialogOpen] = useState(false);
  const [targetPractice, setTargetPractice] = useState<PracticeAuditItem | null>(null);
  const [practiceStep, setPracticeStep] = useState<1 | 2 | 3 | 4>(1);
  const [practiceDecision, setPracticeDecision] = useState<'已通过' | '已拒绝' | '已退回'>('已通过');
  const [practiceOpinion, setPracticeOpinion] = useState('');

  // General audit opinion state for basic items
  const [auditOpinion, setAuditOpinion] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Mock Database ---
  const [aiCaps, setAICaps] = useState<AICapabilityAuditItem[]>([
    { id: 'AUD-AI-01', name: '多模态医疗病历 RAG 问答知识库能力', desc: '支持导入多种医学影像文本并基于医学知识库进行高精准智能检索和答疑接口。', scenario: '医学信息实训课大模型应用开发环节', resources: 'A100 * 2 持续占用 / 并发 15 QPS', compliance: '符合', applicant: '张旭东 教授', time: '2026-05-26 09:12', status: '待审核' },
    { id: 'AUD-AI-02', name: '基于 Llama-3 的金融研报智能清洗与评级微调能力', desc: '自动对海量 PDF 金融财报行自动化清洗，提取财务表格并给予 A/B/C 三级资质评判能力接口。', scenario: '量化金融实训室项目演示与评估', resources: 'V100 * 4 闲时占用 / 并发 8 QPS', compliance: '符合', applicant: '李瑞 讲师', time: '2026-05-25 14:30', status: '待审核' },
    { id: 'AUD-AI-03', name: '智能工业质检视觉边缘微调模型接口', desc: '支持产线高精度异常缺陷标记、分类和低延迟边缘推理。', scenario: '工业物联网专业结课大作业', resources: 'T4 * 1 持续占用 / 并发 20 QPS', compliance: '待核对', applicant: '王立强 讲师', time: '2026-05-24 11:05', status: '待审核' }
  ]);

  const [courses, setCourses] = useState<CourseAuditItem[]>([
    { id: 'AUD-CR-01', courseName: '深度神经网络与多模态大模型应用开发实训课', quality: '优秀', compliance: '符合', gpuRequested: 600, cpuRequested: 1200, resourceRationality: '合理', applicant: '张旭东 教授', time: '2026-05-26 10:45', status: '待审核' },
    { id: 'AUD-CR-02', courseName: '云原生自动化容器编排实战课程', quality: '合格', compliance: '符合', gpuRequested: 300, cpuRequested: 1500, resourceRationality: '偏高', applicant: '刘德华 讲师', time: '2026-05-25 16:20', status: '待审核' }
  ]);

  const [projects, setProjects] = useState<ProjectAuditItem[]>([
    { id: 'AUD-PR-01', projectName: '基于 Ray 的分布式强化学习机械臂抓取实训项目', quality: '优秀', compliance: '符合', gpuRequested: 400, cpuRequested: 800, resourceRationality: '合理', applicant: '王立强 讲师', time: '2026-05-26 08:30', status: '待审核' },
    { id: 'AUD-PR-02', projectName: '基于 CoreML 的移动端手势智能交互沙箱项目', quality: '有待提升', compliance: '待核对', gpuRequested: 150, cpuRequested: 300, resourceRationality: '合理', applicant: '陈明 助教', time: '2026-05-24 15:40', status: '待审核' }
  ]);

  const [practices, setPractices] = useState<PracticeAuditItem[]>([
    { id: 'AUD-PC-01', title: '基于 DeepSpeed + PyTorch 的百亿参数大语言模型多卡并分布式训练最佳实践', quality: 5, completeness: '完整', practicality: '高', compliance: '符合', slaDaysLeft: 2.8, applicant: '张旭东 教授', time: '2026-05-26 11:30', status: '待审核' },
    { id: 'AUD-PC-02', title: '使用 Hugging Face Transformer 实现端到端实体关系提取最佳实践', quality: 4, completeness: '完整', practicality: '高', compliance: '符合', slaDaysLeft: 1.5, applicant: '李瑞 讲师', time: '2026-05-25 10:15', status: '待审核' },
    { id: 'AUD-PC-03', title: '轻量级卷积网络在低算力设备上的部署调试最佳实践', quality: 3, completeness: '部分缺失', practicality: '中', compliance: '符合', slaDaysLeft: 0.5, applicant: '陈明 助教', time: '2026-05-23 09:00', status: '待审核' }
  ]);

  const [historyLogs, setHistoryLogs] = useState<AuditHistoryItem[]>([
    { id: 'LOG-1082', type: '课程', targetName: '量化金融算法交易平台构建课', applicant: '李瑞 讲师', auditor: '系统主管理员', time: '2026-05-24 16:30', result: '通过', opinion: '课程设计完备，算力申请额度与预估选课人数高度匹配，予以通过。' },
    { id: 'LOG-1081', type: 'AI能力', targetName: '租户级特定领域知识库RAG检索接口', applicant: '陈明 助教', auditor: '教学评估组', time: '2026-05-23 14:15', result: '退回修改', opinion: '申请大模型并发数过高，超出了租户总物理带宽，请退回修改降至5QPS以内。' }
  ]);

  // --- Handlers ---

  // Handle AI Capability Action
  const handleAICapSubmit = (result: '已通过' | '已拒绝' | '已退回' | '待补充说明') => {
    if (!targetAICap) return;

    // Update in-memory state
    setAICaps(aiCaps.map(item => item.id === targetAICap.id ? { ...item, status: result } : item));

    const resultLabel = result === '已通过' ? '通过' : result === '已拒绝' ? '拒绝' : result === '已退回' ? '退回修改' : '补充说明';

    // Insert history log
    const newLog: AuditHistoryItem = {
      id: 'LOG-' + Math.floor(1100 + Math.random() * 900),
      type: 'AI能力',
      targetName: targetAICap.name,
      applicant: targetAICap.applicant,
      auditor: '系统主管理员',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      result: resultLabel,
      opinion: auditOpinion || '已完成合规评估并审核处理。'
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setIsAIDialogOpen(false);
    setAuditOpinion('');
    showToast(`成功处理 AI能力公开申请！已置为 [${resultLabel}] 状态。`);
  };

  // Handle Course Action
  const handleCourseSubmit = (result: '已通过' | '已拒绝') => {
    if (!targetCourse) return;

    setCourses(courses.map(item => item.id === targetCourse.id ? { ...item, status: result } : item));

    const resultLabel = result === '已通过' ? '通过' : '拒绝';

    const newLog: AuditHistoryItem = {
      id: 'LOG-' + Math.floor(1100 + Math.random() * 900),
      type: '课程',
      targetName: targetCourse.courseName,
      applicant: targetCourse.applicant,
      auditor: '系统主管理员',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      result: resultLabel,
      opinion: auditOpinion || `审核处理。分配算力: GPU ${adjustGpu}h, CPU ${adjustCpu}h.`
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setIsCourseDialogOpen(false);
    setAuditOpinion('');
    showToast(`成功处理课程审核！已置为 [${resultLabel}] 状态。`);
  };

  // Handle Project Action
  const handleProjectSubmit = (result: '已通过' | '已拒绝') => {
    if (!targetProject) return;

    setProjects(projects.map(item => item.id === targetProject.id ? { ...item, status: result } : item));

    const resultLabel = result === '已通过' ? '通过' : '拒绝';

    const newLog: AuditHistoryItem = {
      id: 'LOG-' + Math.floor(1100 + Math.random() * 900),
      type: '项目',
      targetName: targetProject.projectName,
      applicant: targetProject.applicant,
      auditor: '系统主管理员',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      result: resultLabel,
      opinion: auditOpinion || `审核处理。分配算力: GPU ${adjustProjGpu}h, CPU ${adjustProjCpu}h.`
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setIsProjectDialogOpen(false);
    setAuditOpinion('');
    showToast(`成功处理项目审核！已置为 [${resultLabel}] 状态。`);
  };

  // Handle Practice Action (Wizard Flow)
  const handlePracticeSubmit = () => {
    if (!targetPractice) return;

    setPractices(practices.map(item => item.id === targetPractice.id ? { ...item, status: practiceDecision } : item));

    const resultLabel = practiceDecision === '已通过' ? '通过' : practiceDecision === '已拒绝' ? '拒绝' : '退回修改';

    const newLog: AuditHistoryItem = {
      id: 'LOG-' + Math.floor(1100 + Math.random() * 900),
      type: '最佳实践',
      targetName: targetPractice.title,
      applicant: targetPractice.applicant,
      auditor: '系统主管理员',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      result: resultLabel,
      opinion: practiceOpinion || '最佳实践公开审核完成。'
    };

    setHistoryLogs([newLog, ...historyLogs]);
    setIsPracticeDialogOpen(false);
    setPracticeStep(1);
    setPracticeOpinion('');
    showToast(`成功审核最佳实践！已置为 [${resultLabel}] 并发布。`);
  };

  // Inlined filters are used below for maximum type safety and simple compilation.

  return (
    <div className="space-y-6 pb-12 relative animate-fade-in text-neutral-800">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            审核中心
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            租户管理员可对教师提交的AI公开接口、新建课程、实训沙箱项目及最佳实践文档进行多维度安全与质量审核
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-neutral-200 mt-2">
        <button
          onClick={() => { setActiveTab('ai_capability'); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'ai_capability' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Cpu className="w-4 h-4" />
          AI能力公开审核 ({aiCaps.filter(i => i.status === '待审核').length})
        </button>
        <button
          onClick={() => { setActiveTab('course'); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'course' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <BookOpen className="w-4 h-4" />
          课程审核 ({courses.filter(i => i.status === '待审核').length})
        </button>
        <button
          onClick={() => { setActiveTab('project'); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'project' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <FolderKanban className="w-4 h-4" />
          项目审核 ({projects.filter(i => i.status === '待审核').length})
        </button>
        <button
          onClick={() => { setActiveTab('practice'); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'practice' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Award className="w-4 h-4" />
          最佳实践审核 ({practices.filter(i => i.status === '待审核').length})
        </button>
        <button
          onClick={() => { setActiveTab('logs'); setSearchQuery(''); }}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'logs' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <History className="w-4 h-4" />
          审核操作记录
        </button>
      </div>

      {/* Global query filter */}
      {activeTab !== 'logs' && (
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="搜索申请人、名称、描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] w-full bg-white transition-all text-neutral-700"
          />
        </div>
      )}

      {/* Tab 1: AI能力公开审核 */}
      {activeTab === 'ai_capability' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>AI能力公开审核说明：</strong> 审核主讲教师自研并申请公开的特定大语言模型/多模态API能力。审核通过后将正式升级为<strong>租户级公共大模型资源</strong>，本租户内所有协同教师及选课学生均可调用与学习。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {aiCaps.filter(item => {
              const q = searchQuery.toLowerCase();
              return item.applicant.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
            }).map((item) => (
              <div key={item.id} className="p-5 hover:bg-neutral-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded font-mono font-bold">{item.id}</span>
                    <span className="text-neutral-400 font-mono">{item.time}</span>
                    <span className="font-bold text-neutral-700">申请教师: {item.applicant}</span>
                    <span className="text-neutral-300">|</span>
                    <span className={cn(
                      "px-2 py-0.5 border rounded-md font-bold text-[10px]",
                      item.compliance === '符合' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                    )}>
                      合规性: {item.compliance}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-bold text-neutral-900 leading-snug">{item.name}</h3>
                  <p className="text-neutral-500 leading-relaxed max-w-4xl">{item.desc}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-neutral-400">
                    <div>使用场景：<span className="text-neutral-600">{item.scenario}</span></div>
                    <div>算力及资源预算需求：<span className="text-neutral-600 font-mono">{item.resources}</span></div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  {item.status === '待审核' ? (
                    <Button 
                      onClick={() => { setTargetAICap(item); setIsAIDialogOpen(true); }}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg text-xs"
                    >
                      接入审核
                    </Button>
                  ) : (
                    <span className={cn(
                      "px-3 py-1 rounded-lg border font-bold text-[11px]",
                      item.status === '已通过' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    )}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 课程审核 */}
      {activeTab === 'course' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>课程公开审核说明：</strong> 审核教师自建的实训课程大纲与课程体系。重点评估<strong>课件内容合规性、课程质量、以及申请划拨的云端 GPU/CPU 算力额度合理性</strong>。通过后该课程将在租户内上架公开，本租户学生立即可见选修。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {courses.filter(item => {
              const q = searchQuery.toLowerCase();
              return item.applicant.toLowerCase().includes(q) || item.courseName.toLowerCase().includes(q);
            }).map((item) => (
              <div key={item.id} className="p-5 hover:bg-neutral-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded font-mono font-bold">{item.id}</span>
                    <span className="text-neutral-400 font-mono">{item.time}</span>
                    <span className="font-bold text-neutral-700">创建教师: {item.applicant}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 border rounded-md font-bold text-[10px]">
                      质量评估: {item.quality}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 border rounded-md font-bold text-[10px]">
                      内容合规: {item.compliance}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-bold text-neutral-900 leading-snug">{item.courseName}</h3>
                  
                  <div className="flex flex-wrap items-center gap-6 text-neutral-500">
                    <div>申请 GPU 算力：<strong className="text-neutral-800 font-mono">{item.gpuRequested} 小时</strong></div>
                    <div>申请 CPU 算力：<strong className="text-neutral-800 font-mono">{item.cpuRequested} 小时</strong></div>
                    <div>
                      额度合理性评估：
                      <span className={cn(
                        "font-bold",
                        item.resourceRationality === '合理' ? 'text-green-600' : 'text-amber-500'
                      )}>
                        {item.resourceRationality}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  {item.status === '待审核' ? (
                    <Button 
                      onClick={() => { setTargetCourse(item); setAdjustGpu(item.gpuRequested); setAdjustCpu(item.cpuRequested); setIsCourseDialogOpen(true); }}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg text-xs"
                    >
                      接入审核
                    </Button>
                  ) : (
                    <span className={cn(
                      "px-3 py-1 rounded-lg border font-bold text-[11px]",
                      item.status === '已通过' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    )}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 项目审核 */}
      {activeTab === 'project' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>实训项目审核说明：</strong> 审核教师自建的实训沙箱与项目模版。重点评估<strong>项目的教学质量、预装镜像合规性、以及分配算力资源（GPU卡时/CPU时长）的配额边界</strong>。通过后项目上架租户库，学生可选做。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {projects.filter(item => {
              const q = searchQuery.toLowerCase();
              return item.applicant.toLowerCase().includes(q) || item.projectName.toLowerCase().includes(q);
            }).map((item) => (
              <div key={item.id} className="p-5 hover:bg-neutral-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded font-mono font-bold">{item.id}</span>
                    <span className="text-neutral-400 font-mono">{item.time}</span>
                    <span className="font-bold text-neutral-700">创建教师: {item.applicant}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 border rounded-md font-bold text-[10px]">
                      质量等级: {item.quality}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 border rounded-md font-bold text-[10px]">
                      内容合规: {item.compliance}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-bold text-neutral-900 leading-snug">{item.projectName}</h3>
                  
                  <div className="flex flex-wrap items-center gap-6 text-neutral-500">
                    <div>申请 GPU 算力：<strong className="text-neutral-800 font-mono">{item.gpuRequested} 小时</strong></div>
                    <div>申请 CPU 算力：<strong className="text-neutral-800 font-mono">{item.cpuRequested} 小时</strong></div>
                    <div>资源合理性评估：<span className="text-green-600 font-bold">{item.resourceRationality}</span></div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  {item.status === '待审核' ? (
                    <Button 
                      onClick={() => { setTargetProject(item); setAdjustProjGpu(item.gpuRequested); setAdjustProjCpu(item.cpuRequested); setIsProjectDialogOpen(true); }}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg text-xs"
                    >
                      接入审核
                    </Button>
                  ) : (
                    <span className={cn(
                      "px-3 py-1 rounded-lg border font-bold text-[11px]",
                      item.status === '已通过' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    )}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 最佳实践审核 */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/20 border border-orange-200 rounded-xl text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5">
            <Info className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <span>
              <strong>最佳实践公开审核说明：</strong> 评估教师撰写并申请租户级公开的最佳实践文档。审核通过后将正式置于租户级最佳实践区，供全体师生查阅及直接运行。请务必在 <strong>3个工作日 (3-day SLA)</strong> 内完成各项评估并签署意见。
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
            {practices.filter(item => {
              const q = searchQuery.toLowerCase();
              return item.applicant.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
            }).map((item) => {
              const alertSLA = item.slaDaysLeft <= 1.0;
              return (
                <div key={item.id} className="p-5 hover:bg-neutral-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded font-mono font-bold">{item.id}</span>
                      <span className="text-neutral-400 font-mono">{item.time}</span>
                      <span className="font-bold text-neutral-700">作者教师: {item.applicant}</span>
                      <span className="text-neutral-300">|</span>
                      
                      {/* SLA Warning light */}
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full font-bold text-[9px] flex items-center gap-1",
                        alertSLA ? "bg-red-50 text-red-600 border border-red-200 animate-pulse" : "bg-green-50 text-green-600 border border-green-200"
                      )}>
                        <Clock className="w-3 h-3" />
                        SLA期限：还剩 {item.slaDaysLeft} 天
                      </span>
                    </div>

                    <h3 className="text-[13px] font-bold text-neutral-900 leading-snug">{item.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-5 text-neutral-500">
                      
                      {/* Interactive star indicator */}
                      <div className="flex items-center gap-1">
                        <span>内容质量：</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: item.quality }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <div className="text-neutral-300">|</div>
                      <div>结构完整性：<strong className="text-neutral-800">{item.completeness}</strong></div>
                      <div className="text-neutral-300">|</div>
                      <div>教学实用性：<strong className="text-neutral-800">{item.practicality}</strong></div>
                      <div className="text-neutral-300">|</div>
                      <div>合规等级：<span className="text-green-600 font-bold">{item.compliance}</span></div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end md:self-center">
                    {item.status === '待审核' ? (
                      <Button 
                        onClick={() => { setTargetPractice(item); setPracticeStep(1); setIsPracticeDialogOpen(true); }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg text-xs"
                      >
                        介入向导审核
                      </Button>
                    ) : (
                      <span className={cn(
                        "px-3 py-1 rounded-lg border font-bold text-[11px]",
                        item.status === '已通过' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                      )}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: 审核操作记录 */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap text-xs text-neutral-700">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-600">
                    <th className="p-4 pl-5">变更哈希 / 日志时间</th>
                    <th className="p-4">业务分类</th>
                    <th className="p-4">审核目标名称</th>
                    <th className="p-4">申请教师</th>
                    <th className="p-4">审核人</th>
                    <th className="p-4">签署意见结果</th>
                    <th className="p-4 pl-4 pr-5">详细审计决策意见</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLogs.map(log => (
                    <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group">
                      <td className="p-4 pl-5">
                        <div className="font-mono font-bold text-neutral-800">{log.id}</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{log.time}</div>
                      </td>
                      <td className="p-4 font-bold">{log.type}</td>
                      <td className="p-4 text-neutral-800 max-w-[200px] truncate">{log.targetName}</td>
                      <td className="p-4">{log.applicant}</td>
                      <td className="p-4 text-neutral-500">{log.auditor}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] border font-black rounded-md",
                          log.result === '通过' ? 'bg-green-50 text-green-600 border-green-200' :
                          log.result === '拒绝' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                        )}>
                          {log.result}
                        </span>
                      </td>
                      <td className="p-4 pl-4 pr-5 text-neutral-500 max-w-sm whitespace-normal leading-relaxed">{log.opinion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- Dialog Modals --- */}

      {/* Dialog 1: AI Capability Audit */}
      {isAIDialogOpen && targetAICap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150 text-xs">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#fa541c]" /> AI能力公开审核台
              </h2>
              <button 
                onClick={() => { setIsAIDialogOpen(false); setTargetAICap(null); setAuditOpinion(''); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-2 leading-relaxed text-neutral-600">
                <div>大模型能力名：<strong className="text-neutral-900">{targetAICap.name}</strong></div>
                <div>申请发布教师：<span>{targetAICap.applicant}</span></div>
                <div>大模型能力描述：<span className="text-neutral-700 block mt-0.5">{targetAICap.desc}</span></div>
                <div>预设使用场景：<span className="text-neutral-700 block mt-0.5">{targetAICap.scenario}</span></div>
                <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>算力带宽资源申请: <span className="text-neutral-900 font-bold">{targetAICap.resources}</span></div>
                  <div>合规检测状态: <span className="text-green-600 font-bold">{targetAICap.compliance}</span></div>
                </div>
              </div>

              {/* Textarea for opinion */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">填写审核决定签署意见</label>
                <textarea 
                  value={auditOpinion}
                  onChange={(e) => setAuditOpinion(e.target.value)}
                  placeholder="在此输入您的详细审查评判意见或打回修改说明..."
                  className="w-full h-20 border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#fa541c] resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex flex-wrap items-center justify-end gap-2">
              <Button 
                onClick={() => handleAICapSubmit('已退回')}
                variant="outline"
                className="border-neutral-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 font-bold h-9 px-4 rounded-lg"
              >
                退回修改
              </Button>
              <Button 
                onClick={() => handleAICapSubmit('待补充说明')}
                variant="outline"
                className="border-neutral-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-bold h-9 px-4 rounded-lg"
              >
                补充说明
              </Button>
              <Button 
                onClick={() => handleAICapSubmit('已拒绝')}
                variant="outline"
                className="border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold h-9 px-4 rounded-lg"
              >
                拒绝
              </Button>
              <Button 
                onClick={() => handleAICapSubmit('已通过')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-5 rounded-lg shadow-md shadow-emerald-500/10 animate-pulse"
              >
                通过并租户公开
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Dialog 2: Course Audit */}
      {isCourseDialogOpen && targetCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150 text-xs">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#fa541c]" /> 课程公开上架审核
              </h2>
              <button 
                onClick={() => { setIsCourseDialogOpen(false); setTargetCourse(null); setAuditOpinion(''); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-1.5 leading-relaxed text-neutral-600">
                <div>申请公开课程：<strong className="text-neutral-900">{targetCourse.courseName}</strong></div>
                <div>创建教师姓名：<span>{targetCourse.applicant}</span></div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>课程质量初步评估: <span className="text-green-600 font-bold">{targetCourse.quality}</span></div>
                  <div>内容安全合规性: <span className="text-blue-600 font-bold">{targetCourse.compliance}</span></div>
                </div>
              </div>

              {/* Adjust resources */}
              <div className="p-4 border border-orange-200 bg-orange-50/10 rounded-xl space-y-3">
                <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#fa541c]" /> 管理员审减算力资源划拨
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 block">GPU 算力额度 (小时)</label>
                    <input 
                      type="number" 
                      value={adjustGpu}
                      onChange={(e) => setAdjustGpu(Number(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 block">CPU 算力额度 (小时)</label>
                    <input 
                      type="number" 
                      value={adjustCpu}
                      onChange={(e) => setAdjustCpu(Number(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:outline-none" 
                    />
                  </div>
                </div>
                <span className="text-[9px] text-neutral-400 block mt-1">管理员可针对该课程的理科实验需求与合理性直接在此审减削减或增补实际配额。</span>
              </div>

              {/* Input for opinion */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">填写审核决定签署意见</label>
                <textarea 
                  value={auditOpinion}
                  onChange={(e) => setAuditOpinion(e.target.value)}
                  placeholder="在此输入您的详细审查评判意见..."
                  className="w-full h-16 border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#fa541c] resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-2.5">
              <Button 
                onClick={() => handleCourseSubmit('已拒绝')}
                variant="outline"
                className="border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold h-9 px-5 rounded-lg"
              >
                拒绝
              </Button>
              <Button 
                onClick={() => handleCourseSubmit('已通过')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-emerald-500/10"
              >
                同意并公开课程
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Dialog 3: Project Audit */}
      {isProjectDialogOpen && targetProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150 text-xs">
            
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#fa541c]" /> 实训沙箱项目上架审核
              </h2>
              <button 
                onClick={() => { setIsProjectDialogOpen(false); setTargetProject(null); setAuditOpinion(''); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-1.5 leading-relaxed text-neutral-600">
                <div>申请公开项目：<strong className="text-neutral-900">{targetProject.projectName}</strong></div>
                <div>项目创建教师：<span>{targetProject.applicant}</span></div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>项目质量评估: <span className="text-green-600 font-bold">{targetProject.quality}</span></div>
                  <div>安全及合规性: <span className="text-blue-600 font-bold">{targetProject.compliance}</span></div>
                </div>
              </div>

              {/* Adjust resources */}
              <div className="p-4 border border-orange-200 bg-orange-50/10 rounded-xl space-y-3">
                <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#fa541c]" /> 管理员核对算力资源划拨
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 block">GPU 卡时限制 (小时)</label>
                    <input 
                      type="number" 
                      value={adjustProjGpu}
                      onChange={(e) => setAdjustProjGpu(Number(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 block">CPU 机时限制 (小时)</label>
                    <input 
                      type="number" 
                      value={adjustProjCpu}
                      onChange={(e) => setAdjustProjCpu(Number(e.target.value))}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Input for opinion */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-700 block">填写审核决定签署意见</label>
                <textarea 
                  value={auditOpinion}
                  onChange={(e) => setAuditOpinion(e.target.value)}
                  placeholder="在此输入您的详细审查评判意见..."
                  className="w-full h-16 border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#fa541c] resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-2.5">
              <Button 
                onClick={() => handleProjectSubmit('已拒绝')}
                variant="outline"
                className="border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold h-9 px-5 rounded-lg"
              >
                拒绝
              </Button>
              <Button 
                onClick={() => handleProjectSubmit('已通过')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-emerald-500/10"
              >
                通过并上架项目
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Dialog 4: Best Practice Wizard Audit */}
      {isPracticeDialogOpen && targetPractice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[550px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150 text-xs">
            
            {/* Header with Wizard Step Indicator */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#fa541c]" /> 最佳实践上架智能评估台
                </h2>
                <button 
                  onClick={() => { setIsPracticeDialogOpen(false); setTargetPractice(null); setPracticeStep(1); }} 
                  className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wizard Steps progress bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-2 mt-1">
                <div className={cn("flex items-center gap-1", practiceStep >= 1 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-4 h-4 rounded-full flex items-center justify-center border text-[9px]", practiceStep >= 1 ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300")}>1</span>
                  查看申请
                </div>
                <div className="h-0.5 bg-neutral-200 grow mx-2"></div>
                <div className={cn("flex items-center gap-1", practiceStep >= 2 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-4 h-4 rounded-full flex items-center justify-center border text-[9px]", practiceStep >= 2 ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300")}>2</span>
                  评估内容
                </div>
                <div className="h-0.5 bg-neutral-200 grow mx-2"></div>
                <div className={cn("flex items-center gap-1", practiceStep >= 3 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-4 h-4 rounded-full flex items-center justify-center border text-[9px]", practiceStep >= 3 ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300")}>3</span>
                  决定结果
                </div>
                <div className="h-0.5 bg-neutral-200 grow mx-2"></div>
                <div className={cn("flex items-center gap-1", practiceStep >= 4 ? "text-[#fa541c]" : "")}>
                  <span className={cn("w-4 h-4 rounded-full flex items-center justify-center border text-[9px]", practiceStep >= 4 ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300")}>4</span>
                  填写意见
                </div>
              </div>
            </div>

            {/* Wizard Steps Content */}
            <div className="p-6 h-[260px] overflow-y-auto leading-relaxed">
              
              {/* Step 1: 查看申请 */}
              {practiceStep === 1 && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-1.5 text-neutral-600">
                    <div><strong>最佳实践标题：</strong> <span className="text-neutral-900 font-bold">{targetPractice.title}</span></div>
                    <div><strong>申请公开教师：</strong> <span>{targetPractice.applicant}</span></div>
                    <div><strong>申请提交时间：</strong> <span>{targetPractice.time}</span></div>
                  </div>
                  <div className="p-3 bg-amber-50/20 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>SLA 建议周期：</strong> 该申请属于紧急结课科研配套，要求在 3 个工作日内完成审核。当前已经滞留了约 1.5 天，请尽快推进以下步骤。</span>
                  </div>
                </div>
              )}

              {/* Step 2: 评估内容 */}
              {practiceStep === 2 && (
                <div className="space-y-4">
                  <span className="font-bold text-neutral-800 block text-[13px]">最佳实践文档指标评估指标 checklist：</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl">
                      <span className="text-neutral-400 block mb-1">内容质量及实用性</span>
                      <div className="flex text-amber-500 gap-1 mt-0.5">
                        {Array.from({ length: targetPractice.quality }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="text-neutral-600 font-bold text-[10px] ml-1">({targetPractice.practicality}实用性)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl">
                      <span className="text-neutral-400 block mb-1">结构完整性与安全合规</span>
                      <strong className="text-neutral-800">{targetPractice.completeness}</strong>
                      <span className="ml-2 font-bold text-green-600">({targetPractice.compliance}合规)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/50 space-y-1">
                    <div className="text-neutral-400">大模型及分布式算法适配检测：</div>
                    <div className="text-neutral-800 font-bold">DeepSpeed-ZeRO3 + PyTorch 2.4 / A100多卡并行适配良好。</div>
                  </div>
                </div>
              )}

              {/* Step 3: 决定结果 */}
              {practiceStep === 3 && (
                <div className="space-y-4">
                  <span className="font-bold text-neutral-800 block text-[13px]">做出上架审批最终裁决决定</span>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPracticeDecision('已通过')}
                      className={cn(
                        "p-4 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5",
                        practiceDecision === '已通过' ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      <Check className="w-5 h-5 text-emerald-600" />
                      同意公开并发布
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeDecision('已退回')}
                      className={cn(
                        "p-4 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5",
                        practiceDecision === '已退回' ? "bg-amber-50 border-amber-500 text-amber-700" : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      <RotateCcw className="w-5 h-5 text-amber-500" />
                      退回修改
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeDecision('已拒绝')}
                      className={cn(
                        "p-4 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5",
                        practiceDecision === '已拒绝' ? "bg-red-50 border-red-500 text-red-700" : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      <X className="w-5 h-5 text-red-500" />
                      直接拒绝驳回
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: 填写意见 */}
              {practiceStep === 4 && (
                <div className="space-y-3">
                  <span className="font-bold text-neutral-800 block text-[13px]">填写最佳实践公开签署意见</span>
                  <textarea 
                    value={practiceOpinion}
                    onChange={(e) => setPracticeOpinion(e.target.value)}
                    placeholder="在此输入本次最佳实践质量审查的评估反馈或整改意见..."
                    className="w-full h-32 border border-neutral-200 rounded-xl p-3.5 focus:outline-none focus:border-[#fa541c] resize-none"
                  />
                </div>
              )}

            </div>

            {/* Wizard Actions Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-between">
              
              {/* Back button */}
              <Button 
                onClick={() => setPracticeStep((prev) => Math.max(1, prev - 1) as any)}
                disabled={practiceStep === 1}
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 rounded-lg text-xs"
              >
                上一步
              </Button>

              {/* Next/Submit button */}
              {practiceStep < 4 ? (
                <Button 
                  onClick={() => setPracticeStep((prev) => Math.min(4, prev + 1) as any)}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg text-xs"
                >
                  下一步
                </Button>
              ) : (
                <Button 
                  onClick={handlePracticeSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-6 rounded-lg shadow-md shadow-emerald-500/10 text-xs"
                >
                  确认签署并提交评估
                </Button>
              )}

            </div>

          </div>
        </div>
      )}

      {/* --- Simple Toast Popup --- */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 px-4 py-2.5 rounded-xl shadow-lg text-white font-bold text-xs flex items-center gap-2 z-50 animate-bounce",
          toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-amber-500'
        )}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

    </div>
  );
}
