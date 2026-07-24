import React, { useState } from 'react';
import { User, Bell, Database, Key, Shield, AlertCircle, CheckCircle, ChevronRight, Clock, Plus, Trash2, Edit, Activity, Copy, Eye, EyeOff, Laptop, Smartphone, FileText, Check, Settings, Globe, Mail, Phone, Building2, Hash, Calendar, X, Lock, Award, BookOpen, GraduationCap, Sparkles, Users, Share2, Camera, FolderKanban, Star, CheckCircle2, Briefcase, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// --- Mock Data ---

const mockNotifications = [
  { id: 1, type: '系统通知', title: '平台例行维护通知', content: '平台将于本周五晚22:00进行例行升级维护，期间部分服务可能会出现短暂波动。', time: '2026-05-25 10:00:00', read: false },
  { id: 2, type: '考试提醒', title: '《人工智能基础》期中考试即将开始', content: '您负责的《人工智能基础》期中考试将在30分钟后开始，请提前进入考场监控面板。', time: '2026-05-25 09:30:00', read: false },
  { id: 3, type: '审核结果通知', title: '项目申请已通过', content: '您提交的《基于深度学习的图像分类》教学项目申请已通过管理员审核，现已上架至公共库。', time: '2026-05-24 16:45:00', read: true },
  { id: 4, type: '课程更新通知', title: '课程资源配额不足提醒', content: '您的课程《Python数据分析》剩余GPU资源配额不足20%，请及时申请扩容或清理无效容器。', time: '2026-05-23 11:20:00', read: true },
];

const mockQuotaHistory = [
  { id: 1, type: 'GPU卡时', amount: '+500 小时', reason: '期末深度学习大作业需要集中训练模型', status: '已通过', time: '2026-05-20' },
  { id: 2, type: '项目额度', amount: '+5 个', reason: '新增跨学科融合教学实验', status: '待审批', time: '2026-05-24' },
  { id: 3, type: 'Token额度', amount: '+10,000,000 Tokens', reason: '班级人数扩容，需要更多AI问答额度', status: '已拒绝', time: '2026-05-15' },
];

const mockApiKeys = [
  { id: 1, name: '教学辅助脚本Key', key: 'sk-tj89...3k2a', created: '2026-01-10', status: '启用', scopes: ['模型推理', '知识库查询'], calls: 12503, tokens: '2.5M' },
  { id: 2, name: '自动批改系统对接', key: 'sk-pz41...9m1x', created: '2026-03-22', status: '启用', scopes: ['模型推理', '数字员工管理'], calls: 45012, tokens: '18.2M' },
  { id: 3, name: '旧版测试Key', key: 'sk-old1...xxxx', created: '2025-11-05', status: '禁用', scopes: ['模型推理'], calls: 300, tokens: '50K' },
];

const mockLoginLogs = [
  { id: 1, time: '2026-05-25 08:30:15', ip: '113.110.25.10 (广东深圳)', device: 'Chrome / Windows 11', status: '成功' },
  { id: 2, time: '2026-05-24 19:45:22', ip: '113.110.25.10 (广东深圳)', device: 'Safari / macOS', status: '成功' },
  { id: 3, time: '2026-05-22 14:20:05', ip: '161.117.200.1 (新加坡)', device: 'Firefox / Linux', status: '失败 (密码错误)' },
  { id: 4, time: '2026-05-21 09:10:33', ip: '113.110.25.10 (广东深圳)', device: 'Chrome / Windows 11', status: '成功' },
];

export default function TeacherCenter() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'quota' | 'api' | 'security'>('profile');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const menuItems = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'notifications', label: '消息通知管理', icon: Bell },
    { id: 'quota', label: '资源配额', icon: Database },
    { id: 'api', label: 'API Key 配置', icon: Key },
    { id: 'security', label: '账号安全', icon: Shield },
  ];

  // --- Profile State ---
  const [profile, setProfile] = useState({
    name: '张大伟',
    title: '教授 / 博士生导师',
    department: '计算机科学与技术学院',
    lab: '大模型与智能计算实验室',
    staffId: 'T20150982',
    phone: '138****5678',
    email: 'zhangdawei@university.edu.cn',
    bio: '专注人工智能大模型微调、分布式高并发架构及深度学习实训教学。用代码点亮智慧，用AI赋能未来教学。',
    specializations: ['大模型微调 & RAG', '微服务与高并发', 'Python数据分析', '计算机视觉实训'],
    status: '在教 / 实验室负责人',
    rating: '4.98',
    totalStudents: '1,280',
    totalCourses: '16',
    totalProjects: '24',
    totalQuestions: '456'
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ ...profile, specializationsStr: profile.specializations.join(', ') });

  // --- Notification State ---
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notiFilter, setNotiFilter] = useState('所有');
  const [notiSearchQuery, setNotiSearchQuery] = useState('');
  const [selectedNotiIds, setSelectedNotiIds] = useState<number[]>([]);

  const filteredNotis = notifications.filter(n => {
    if (notiFilter !== '所有' && n.type !== notiFilter) return false;
    if (notiSearchQuery && !n.title.toLowerCase().includes(notiSearchQuery.toLowerCase()) && !n.content.toLowerCase().includes(notiSearchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSelectNoti = (id: number) => {
    setSelectedNotiIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAllNotis = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedNotiIds(filteredNotis.map(n => n.id));
    } else {
      setSelectedNotiIds([]);
    }
  };

  // --- Quota State ---
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quotaForm, setQuotaForm] = useState({ type: 'GPU卡时', amount: '', reason: '', duration: '30天' });

  // --- API Key State ---
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyForm, setKeyForm] = useState({ name: '', scopes: ['模型推理'] });

  // --- Security Modals State ---
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // --- Render Functions ---

  const renderProfile = () => (
    <div className="animate-fade-in space-y-6 w-full text-left pb-10">
      {/* Hero Profile Header Card */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden relative">
        
        {/* Top Gradient Orange Header Banner with Name & Buttons INSIDE */}
        <div className="bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#ffa940] p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/10"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

          {/* Top Right Honor Badges */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> 国家级精品课程主讲教师
            </span>
            <span className="px-3 py-1 bg-black/20 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/20">
              AI 教学团队负责人
            </span>
          </div>

          {/* Name & Buttons Row Inside Orange Region */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              {/* Avatar Box */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#fff2e8] to-[#ffd8bf] rounded-lg flex items-center justify-center text-[#fa541c] text-2xl font-black shadow-inner">
                    {profile.name.substring(0, 1)}
                  </div>
                </div>
                <button 
                  onClick={() => showToast('已开启头像更换，请选择图片文件')}
                  className="absolute inset-1 rounded-lg bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium gap-1"
                >
                  <Camera className="w-3.5 h-3.5" /> 更换
                </button>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="在教 / 正常"></span>
              </div>

              {/* Name & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
                  <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-[4px] text-xs font-semibold backdrop-blur-md border border-white/30">
                    {profile.title}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/25 text-white rounded-[4px] text-xs font-medium border border-emerald-300/40 backdrop-blur-md">
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons inside Orange Area */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button 
                onClick={() => {
                  setEditProfileForm({ ...profile, specializationsStr: profile.specializations.join(', ') });
                  setIsEditProfileOpen(true);
                }}
                className="bg-white hover:bg-orange-50 text-[#fa541c] font-bold rounded-[4px] px-4 h-9 text-xs shadow-sm cursor-pointer border-0 flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> 编辑资料
              </Button>
              <Button 
                onClick={() => showToast('已成功复制个人名片链接至剪贴板！')}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-[4px] px-3.5 h-9 text-xs font-medium cursor-pointer flex items-center gap-1.5 backdrop-blur-md transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> 分享名片
              </Button>
            </div>
          </div>
        </div>

        {/* Lower White Area with Subtitle & Bio */}
        <div className="p-6 bg-white space-y-4 text-left">
          {/* Subtitle Info Line */}
          <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium border-b border-neutral-100 pb-3.5">
            <span className="flex items-center gap-1.5 font-mono text-neutral-800">
              <Hash className="w-3.5 h-3.5 text-[#fa541c]" /> 教工号: <span className="font-bold">{profile.staffId}</span>
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1.5 text-neutral-800">
              <Building2 className="w-3.5 h-3.5 text-[#fa541c]" /> 院系: <span className="font-bold">{profile.department}</span>
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1.5 text-neutral-800">
              <Briefcase className="w-3.5 h-3.5 text-[#fa541c]" /> 实验室: <span className="font-bold">{profile.lab}</span>
            </span>
          </div>

          {/* Bio Line */}
          <div className="bg-neutral-50/80 p-3.5 rounded-[6px] border border-neutral-100 text-xs text-neutral-600 font-medium leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#fa541c] shrink-0 mt-0.5" />
            <p className="flex-1">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Teaching & Academic Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3.5 group hover:border-[#fa541c]/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#fa541c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-neutral-400">指导学生数</div>
            <div className="text-lg font-bold text-neutral-900 mt-0.5">{profile.totalStudents} <span className="text-xs font-normal text-neutral-500">人</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3.5 group hover:border-[#fa541c]/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-neutral-400">主讲课程</div>
            <div className="text-lg font-bold text-neutral-900 mt-0.5">{profile.totalCourses} <span className="text-xs font-normal text-neutral-500">门</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3.5 group hover:border-[#fa541c]/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-neutral-400">实训案例</div>
            <div className="text-lg font-bold text-neutral-900 mt-0.5">{profile.totalProjects} <span className="text-xs font-normal text-neutral-500">个</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3.5 group hover:border-[#fa541c]/40 transition-all">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-neutral-400">综合评价</div>
            <div className="text-lg font-bold text-neutral-900 mt-0.5">{profile.rating} <span className="text-xs font-normal text-neutral-500">/ 5.0</span></div>
          </div>
        </div>
      </div>

      {/* 2-Column Detailed Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Detailed Profile Information & Specialties */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Info Card */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#fa541c]" /> 详细档案与联系信息
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">最后更新: 2026-05-20</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-[6px] bg-neutral-50/70 border border-neutral-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">教工号 ID</div>
                  <div className="text-xs font-bold text-neutral-800 font-mono mt-0.5 flex items-center gap-1.5">
                    {profile.staffId}
                    <button 
                      onClick={() => showToast('教工号已复制')}
                      className="text-neutral-400 hover:text-[#fa541c] cursor-pointer bg-transparent border-0 p-0"
                      title="复制"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-[6px] bg-neutral-50/70 border border-neutral-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">所属院系</div>
                  <div className="text-xs font-bold text-neutral-800 mt-0.5">{profile.department}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-[6px] bg-neutral-50/70 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 shrink-0">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">联系电话</div>
                    <div className="text-xs font-bold text-neutral-800 mt-0.5 font-mono">{profile.phone}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="text-xs text-[#fa541c] hover:underline cursor-pointer font-medium border-0 bg-transparent p-0"
                >
                  修改
                </button>
              </div>

              <div className="p-3.5 rounded-[6px] bg-neutral-50/70 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-md bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] text-neutral-400 font-medium">官方邮箱</div>
                    <div className="text-xs font-bold text-neutral-800 mt-0.5 truncate">{profile.email}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(true)}
                  className="text-xs text-[#fa541c] hover:underline cursor-pointer font-medium border-0 bg-transparent p-0 shrink-0 ml-2"
                >
                  修改
                </button>
              </div>
            </div>

            {/* Specializations Tags */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2.5">主讲领域与教研方向</span>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-neutral-50 hover:bg-[#fff2e8] hover:text-[#fa541c] transition-colors text-neutral-700 rounded-[4px] text-xs font-medium border border-neutral-200/80 cursor-default flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#fa541c]" /> {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Academic Certifications & Honors */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3.5">
              <Award className="w-4 h-4 text-[#fa541c]" /> 教师荣誉与学术资质
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-[6px] border border-neutral-200/80 bg-neutral-50/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">2025年度全校十佳优秀教师标兵</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">获颁单位: 计算机科学学院教务处</div>
                </div>
              </div>

              <div className="p-3.5 rounded-[6px] border border-neutral-200/80 bg-neutral-50/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">工信部大模型算法高级认证导师</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">证书编号: IT-AI-2025-0892</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ongoing Active Courses & Timeline */}
        <div className="space-y-6">
          
          {/* Active Courses Card */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#fa541c]" /> 当前负责实训课程
              </h3>
              <span className="text-[11px] text-[#fa541c] font-semibold">2 门运行中</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-[6px] border border-neutral-200/80 hover:border-[#fa541c]/40 transition-all bg-white">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-800">《大语言模型微调与 RAG 架构》</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">进行中</span>
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between">
                  <span>选择学生: 320 人</span>
                  <span>进度: 85%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#fa541c] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-3 rounded-[6px] border border-neutral-200/80 hover:border-[#fa541c]/40 transition-all bg-white">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-800">《深度学习与 PyTorch 核心实践》</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">进行中</span>
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between">
                  <span>选择学生: 450 人</span>
                  <span>进度: 60%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Teaching Activities */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Activity className="w-4 h-4 text-[#fa541c]" /> 最近教学活动轨迹
            </h3>
            
            <div className="space-y-3.5 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fa541c] absolute -left-[4.5px] top-1 ring-4 ring-orange-50"></div>
                <div className="text-xs font-bold text-neutral-800">上架《云原生微服务高并发项目》</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">2026-05-20 14:30</div>
              </div>

              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[4.5px] top-1 ring-4 ring-blue-50"></div>
                <div className="text-xs font-bold text-neutral-800">申请并获批 500 GPU 卡时配额</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">2026-05-18 09:15</div>
              </div>

              <div className="relative pl-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[4.5px] top-1 ring-4 ring-emerald-50"></div>
                <div className="text-xs font-bold text-neutral-800">更新人工智能期中试题库 (120道)</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">2026-05-12 16:40</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 border border-neutral-200 flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#fa541c]" /> 编辑教师个人资料
              </h3>
              <button 
                onClick={() => setIsEditProfileOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar text-xs">
              <div>
                <label className="block text-xs font-bold text-[#262626] mb-1.5">姓名 <span className="text-[#fa541c]">*</span></label>
                <input 
                  type="text" 
                  value={editProfileForm.name} 
                  onChange={e => setEditProfileForm({...editProfileForm, name: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium bg-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#262626] mb-1.5">职称/头衔</label>
                  <input 
                    type="text" 
                    value={editProfileForm.title} 
                    onChange={e => setEditProfileForm({...editProfileForm, title: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#262626] mb-1.5">在职状态</label>
                  <input 
                    type="text" 
                    value={editProfileForm.status} 
                    onChange={e => setEditProfileForm({...editProfileForm, status: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262626] mb-1.5">所属院系</label>
                <input 
                  type="text" 
                  value={editProfileForm.department} 
                  onChange={e => setEditProfileForm({...editProfileForm, department: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262626] mb-1.5">个人研究签名 / 教学座右铭</label>
                <textarea 
                  rows={3} 
                  value={editProfileForm.bio} 
                  onChange={e => setEditProfileForm({...editProfileForm, bio: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium resize-none bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262626] mb-1.5">主讲领域 (用逗号分隔)</label>
                <input 
                  type="text" 
                  value={editProfileForm.specializationsStr} 
                  onChange={e => setEditProfileForm({...editProfileForm, specializationsStr: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-[4px] border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-xs font-medium bg-white" 
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-neutral-50/50 flex justify-end gap-2.5 border-t border-neutral-100 shrink-0">
              <Button 
                onClick={() => setIsEditProfileOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 rounded-[4px] px-4 text-xs font-semibold h-8 bg-white cursor-pointer hover:bg-neutral-50"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  const specs = editProfileForm.specializationsStr.split(/[,，]/).map(s => s.trim()).filter(Boolean);
                  setProfile({ ...editProfileForm, specializations: specs });
                  setIsEditProfileOpen(false);
                  showToast('个人资料已成功更新！');
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 text-xs font-semibold h-8 shadow-xs cursor-pointer border-0"
              >
                保存修改
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="animate-fade-in space-y-4 text-left w-full">
      {/* Header Section matching AdminAudit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-neutral-900">消息通知</h2>
          <p className="text-xs text-neutral-500 mb-0.5">
            查看与管理系统通知、考试提醒、课程审核与团队协作消息
          </p>
        </div>

        {/* Quick Statistics Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded border border-neutral-200 text-xs flex items-center gap-2">
            <span className="text-neutral-500 font-medium">总通知:</span>
            <span className="font-bold text-neutral-800">{notifications.length}</span>
          </div>
          <div className="bg-white px-3 py-1.5 rounded border border-neutral-200 text-xs flex items-center gap-2">
            <span className="text-neutral-500 font-medium">未读:</span>
            <span className="font-bold text-[#fa541c]">{unreadCount}</span>
          </div>
        </div>
      </div>

      {/* Table and Toolbar Unified Module (Ref AdminAudit Style) */}
      <div className="bg-white rounded border border-neutral-200 overflow-hidden flex-1 flex flex-col">
        {/* Integrated Toolbar Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-100 bg-white shrink-0">
          {/* Search Input bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索消息内容..."
                value={notiSearchQuery}
                onChange={(e) => setNotiSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full bg-white border border-neutral-200 rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-9"
              />
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {unreadCount > 0 && (
              <Button 
                onClick={() => {
                  setNotifications(notifications.map(n => ({...n, read: true})));
                  showToast('已全部标记为已读');
                }}
                variant="outline" 
                className="h-8 rounded-[4px] px-3.5 text-xs font-semibold border-neutral-200 text-neutral-700 hover:bg-neutral-50 bg-white cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 mr-1" /> 全部已读
              </Button>
            )}

            {selectedNotiIds.length > 0 && (
              <Button 
                onClick={() => {
                  setNotifications(prev => prev.filter(n => !selectedNotiIds.includes(n.id)));
                  setSelectedNotiIds([]);
                  showToast('已删除选中的消息通知');
                }}
                className="bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6] border border-[#ffbb96]/50 h-8 px-3 rounded-[4px] text-xs font-semibold cursor-pointer shadow-2xs transition-all"
              >
                批量删除 ({selectedNotiIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Main Table Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap text-[13px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                <th className="p-4 font-medium w-[55%] flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={filteredNotis.length > 0 && selectedNotiIds.length === filteredNotis.length}
                    onChange={(e) => toggleSelectAllNotis(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer accent-[#fa541c]"
                  />
                  <span>消息详情</span>
                </th>
                <th className="p-4 font-medium w-[20%]">消息分类</th>
                <th className="p-4 font-medium w-[25%]">消息时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotis.length > 0 ? (
                filteredNotis.map((noti, index) => (
                  <tr key={noti.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredNotis.length - 1 && "border-b-0", !noti.read && "bg-orange-50/20")}>
                    {/* 消息详情 (带前置方框) */}
                    <td className="p-4 whitespace-normal">
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox"
                          checked={selectedNotiIds.includes(noti.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectNoti(noti.id);
                          }}
                          className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer mt-1 shrink-0 accent-[#fa541c]"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {!noti.read && (
                              <span className="w-2 h-2 rounded-full bg-[#fa541c] shrink-0" title="未读消息"></span>
                            )}
                            <div className={cn("font-medium transition-colors cursor-pointer group-hover:text-[#fa541c]", !noti.read ? "text-neutral-900 font-bold" : "text-neutral-800")}>
                              {noti.title}
                            </div>
                          </div>
                          <div className="text-xs text-neutral-500 leading-relaxed font-normal">
                            {noti.content}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 消息分类 - 普通方式展示，无标签/背景样式 */}
                    <td className="p-4 text-neutral-700 font-normal text-[13px]">
                      {noti.type}
                    </td>

                    {/* 消息时间 */}
                    <td className="p-4 text-neutral-500 font-mono text-[12px]">
                      {noti.time}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-neutral-400 text-xs">
                    暂无相关通知记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuota = () => (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">我的资源配额</h2>
          <p className="text-[13px] text-neutral-500 mt-1">查看和管理平台为您分配的教学资源额度</p>
        </div>
        <Button onClick={() => setIsQuotaModalOpen(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 shadow-sm font-bold">
          <Plus className="w-4 h-4 mr-1.5" /> 申请临时额度
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { label: 'GPU卡时', total: 1000, used: 850, unit: '小时', color: 'bg-indigo-500' },
          { label: 'CPU时长', total: 5000, used: 1200, unit: '小时', color: 'bg-blue-500' },
          { label: '项目额度', total: 20, used: 15, unit: '个', color: 'bg-emerald-500' },
          { label: '数据集额度', total: 100, used: 45, unit: 'GB', color: 'bg-amber-500' },
          { label: '智能助手额度', total: 5, used: 2, unit: '个', color: 'bg-purple-500' },
          { label: 'AI Token消耗', total: '50M', used: '42M', unit: 'Tokens', color: 'bg-[#fa541c]' },
        ].map(q => {
          const percent = typeof q.total === 'number' ? Math.round((q.used as number) / (q.total as number) * 100) : 84;
          return (
            <div key={q.label} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[15px] font-bold text-neutral-800">{q.label}</span>
                <span className={cn("text-[13px] font-bold", percent > 80 ? "text-red-500" : "text-emerald-500")}>
                  {percent}% 已用
                </span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden mb-3">
                <div className={cn("h-full rounded-full transition-all duration-1000", q.color, percent > 80 && "bg-red-500")} style={{ width: `${percent}%` }}></div>
              </div>
              <div className="flex justify-between text-[12px] text-neutral-500 mt-auto">
                <span>已用: <strong className="text-neutral-800">{q.used}</strong> {q.unit}</span>
                <span>总量: <strong className="text-neutral-800">{q.total}</strong> {q.unit}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="font-bold text-neutral-800 text-[15px]">配额申请历史</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">申请时间</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">配额类型</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">申请数量</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">原因说明</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockQuotaHistory.map((h, i) => (
              <tr key={h.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50 transition-colors", i === mockQuotaHistory.length - 1 && "border-b-0")}>
                <td className="py-4 px-6 text-[13px] text-neutral-500 font-mono">{h.time}</td>
                <td className="py-4 px-6 text-[13px] font-bold text-neutral-800">{h.type}</td>
                <td className="py-4 px-6 text-[13px] font-bold text-blue-600">{h.amount}</td>
                <td className="py-4 px-6 text-[13px] text-neutral-500">{h.reason}</td>
                <td className="py-4 px-6">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-bold",
                    h.status === '已通过' ? "bg-emerald-50 text-emerald-600" :
                    h.status === '已拒绝' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isQuotaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-neutral-800">申请临时资源额度</h3>
              <button onClick={() => setIsQuotaModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">资源类型 <span className="text-red-500">*</span></label>
                <select 
                  value={quotaForm.type} onChange={e => setQuotaForm({...quotaForm, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]"
                >
                  <option>GPU卡时</option><option>CPU时长</option><option>项目额度</option><option>Token额度</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-neutral-700 mb-2">申请数量 <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="如: 500" value={quotaForm.amount} onChange={e => setQuotaForm({...quotaForm, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-neutral-700 mb-2">使用期限 <span className="text-red-500">*</span></label>
                  <select 
                    value={quotaForm.duration} onChange={e => setQuotaForm({...quotaForm, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]"
                  >
                    <option>7天</option><option>30天</option><option>一学期</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">申请原因 <span className="text-red-500">*</span></label>
                <textarea rows={3} placeholder="请详细说明申请扩容的教学场景及原因..." value={quotaForm.reason} onChange={e => setQuotaForm({...quotaForm, reason: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px] resize-none" />
              </div>
            </div>
            <div className="px-8 py-5 bg-neutral-50 flex justify-end gap-3 border-t border-neutral-100">
              <Button onClick={() => setIsQuotaModalOpen(false)} variant="outline" className="rounded-full px-6 font-bold text-[13px]">取消</Button>
              <Button onClick={() => {
                if(!quotaForm.amount || !quotaForm.reason) return showToast('请填写完整申请信息', 'error');
                showToast('申请已提交，请等待管理员审批');
                setIsQuotaModalOpen(false);
              }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-8 font-bold shadow-sm text-[13px]">提交申请</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderApi = () => (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">API Key 配置</h2>
          <p className="text-[13px] text-neutral-500 mt-1">管理您的个人访问密钥，用于对接大模型能力及平台开放接口</p>
        </div>
        <Button onClick={() => setIsKeyModalOpen(true)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 shadow-sm font-bold">
          <Plus className="w-4 h-4 mr-1.5" /> 创建 API Key
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">活跃 Key 数量</div>
            <div className="text-[24px] font-bold text-neutral-900">{apiKeys.filter(k => k.status === '启用').length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">本月总调用次数</div>
            <div className="text-[24px] font-bold text-neutral-900">57,815</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fa541c] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[13px] text-neutral-500 mb-1">本月 Token 消耗</div>
            <div className="text-[24px] font-bold text-neutral-900">20.7M</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-100">
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[200px]">名称</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[250px]">Secret Key</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">权限范围</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[120px]">创建时间</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[100px]">调用量</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[100px]">状态</th>
              <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[150px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map(k => (
              <tr key={k.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                <td className="py-4 px-6 text-[13px] font-bold text-neutral-800">{k.name}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono text-neutral-500 bg-neutral-100 px-2 py-1 rounded">{k.key}</span>
                    <button onClick={() => showToast('已复制到剪贴板')} className="text-neutral-400 hover:text-[#fa541c]"><Copy className="w-4 h-4"/></button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1 flex-wrap">
                    {k.scopes.map(s => <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[11px] font-bold">{s}</span>)}
                  </div>
                </td>
                <td className="py-4 px-6 text-[13px] text-neutral-500 font-mono">{k.created}</td>
                <td className="py-4 px-6 text-[13px] font-bold text-neutral-700">{k.calls.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => {
                      setApiKeys(apiKeys.map(api => api.id === k.id ? {...api, status: k.status === '启用' ? '禁用' : '启用'} : api));
                      showToast(`已${k.status === '启用' ? '禁用' : '启用'} API Key`);
                    }}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors", 
                      k.status === '启用' ? "bg-emerald-500" : "bg-neutral-200"
                    )}
                  >
                    <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", k.status === '启用' ? "left-5" : "left-0.5")}></span>
                  </button>
                </td>
                <td className="py-4 px-6 flex items-center gap-2">
                  <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Edit className="w-4 h-4"/></Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      if(confirm('确认删除此 API Key 吗？将无法恢复。')) {
                        setApiKeys(apiKeys.filter(api => api.id !== k.id));
                        showToast('删除成功');
                      }
                    }}
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-[16px] font-bold text-neutral-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#fa541c]" /> 安全设置
        </h3>
        
        <div className="divide-y divide-neutral-100">
          <div className="py-5 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0"><Key className="w-5 h-5 text-neutral-600"/></div>
              <div>
                <h4 className="text-[15px] font-bold text-neutral-800">登录密码</h4>
                <p className="text-[13px] text-neutral-500 mt-0.5">建议定期修改密码以保证账号安全，密码长度不少于8位</p>
              </div>
            </div>
            <Button onClick={() => setIsPwdModalOpen(true)} variant="outline" className="rounded-full px-5 text-[13px] font-bold text-neutral-600">修改密码</Button>
          </div>
          
          <div className="py-5 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0"><Smartphone className="w-5 h-5 text-neutral-600"/></div>
              <div>
                <h4 className="text-[15px] font-bold text-neutral-800 flex items-center gap-2">绑定手机 <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-md font-bold">已绑定</span></h4>
                <p className="text-[13px] text-neutral-500 mt-0.5">当前绑定: 138****5678</p>
              </div>
            </div>
            <Button onClick={() => setIsPhoneModalOpen(true)} variant="outline" className="rounded-full px-5 text-[13px] font-bold text-neutral-600">更换绑定</Button>
          </div>

          <div className="py-5 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0"><Globe className="w-5 h-5 text-neutral-600"/></div>
              <div>
                <h4 className="text-[15px] font-bold text-neutral-800 flex items-center gap-2">绑定邮箱 <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-md font-bold">已绑定</span></h4>
                <p className="text-[13px] text-neutral-500 mt-0.5">当前绑定: zhang****@university.edu.cn</p>
              </div>
            </div>
            <Button onClick={() => setIsEmailModalOpen(true)} variant="outline" className="rounded-full px-5 text-[13px] font-bold text-neutral-600">更换绑定</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-800 text-[15px]">近期登录日志</h3>
          <span className="text-[12px] text-neutral-500">仅展示最近30天的登录记录</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="py-4 px-8 text-[13px] font-bold text-neutral-500 w-[200px]">时间</th>
              <th className="py-4 px-8 text-[13px] font-bold text-neutral-500 w-[250px]">IP地址及位置</th>
              <th className="py-4 px-8 text-[13px] font-bold text-neutral-500">设备及浏览器</th>
              <th className="py-4 px-8 text-[13px] font-bold text-neutral-500 w-[150px]">状态</th>
            </tr>
          </thead>
          <tbody>
            {mockLoginLogs.map(log => (
              <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                <td className="py-4 px-8 text-[13px] text-neutral-500 font-mono">{log.time}</td>
                <td className="py-4 px-8 text-[13px] font-bold text-neutral-800">{log.ip}</td>
                <td className="py-4 px-8 text-[13px] text-neutral-600">{log.device}</td>
                <td className="py-4 px-8">
                  <span className={cn(
                    "text-[12px] font-bold",
                    log.status === '成功' ? "text-emerald-600" : "text-red-500"
                  )}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Modals */}
      {isPwdModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-neutral-800">修改登录密码</h3>
              <button onClick={() => setIsPwdModalOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">当前密码</label>
                <input type="password" placeholder="请输入当前密码" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">新密码</label>
                <input type="password" placeholder="请输入新密码" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">确认新密码</label>
                <input type="password" placeholder="请再次输入新密码" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
              </div>
            </div>
            <div className="px-6 py-4 bg-neutral-50 flex justify-end gap-3 border-t border-neutral-100">
              <Button onClick={() => setIsPwdModalOpen(false)} variant="outline" className="rounded-full px-5 font-bold text-[13px]">取消</Button>
              <Button onClick={() => { showToast('密码修改成功'); setIsPwdModalOpen(false); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 font-bold text-[13px]">确认修改</Button>
            </div>
          </div>
        </div>
      )}

      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-neutral-800">更换绑定手机</h3>
              <button onClick={() => setIsPhoneModalOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">新手机号码</label>
                <input type="text" placeholder="请输入新的手机号" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">验证码</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="短信验证码" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
                  <Button variant="outline" className="px-4 rounded-xl text-[13px] font-bold text-[#fa541c] border-[#fa541c] hover:bg-orange-50 shrink-0">获取验证码</Button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-neutral-50 flex justify-end gap-3 border-t border-neutral-100">
              <Button onClick={() => setIsPhoneModalOpen(false)} variant="outline" className="rounded-full px-5 font-bold text-[13px]">取消</Button>
              <Button onClick={() => { showToast('手机号更换成功'); setIsPhoneModalOpen(false); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 font-bold text-[13px]">确认更换</Button>
            </div>
          </div>
        </div>
      )}

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-neutral-800">更换绑定邮箱</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">新邮箱地址</label>
                <input type="email" placeholder="请输入新的邮箱地址" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 mb-2">验证码</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="邮箱验证码" className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] text-[14px]" />
                  <Button variant="outline" className="px-4 rounded-xl text-[13px] font-bold text-[#fa541c] border-[#fa541c] hover:bg-orange-50 shrink-0">获取验证码</Button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-neutral-50 flex justify-end gap-3 border-t border-neutral-100">
              <Button onClick={() => setIsEmailModalOpen(false)} variant="outline" className="rounded-full px-5 font-bold text-[13px]">取消</Button>
              <Button onClick={() => { showToast('邮箱更换成功'); setIsEmailModalOpen(false); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 font-bold text-[13px]">确认更换</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full w-full bg-white overflow-hidden shadow-sm">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-xl animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-[14px] font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-[200px] border-r border-neutral-200 flex-shrink-0 flex flex-col bg-white">
        <div className="p-5 border-b border-neutral-100">
          <h2 className="text-[16px] font-bold text-neutral-900">个人中心</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-colors",
                  isActive 
                    ? "bg-[#fff2e8] text-[#fa541c]" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-[#fa541c]" : "text-neutral-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-6">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'quota' && renderQuota()}
        {activeTab === 'api' && renderApi()}
        {activeTab === 'security' && renderSecurity()}
      </div>
    </div>
  );
}
