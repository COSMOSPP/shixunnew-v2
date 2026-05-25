import React, { useState } from 'react';
import { User, Bell, Database, Key, Shield, AlertCircle, CheckCircle, ChevronRight, Clock, Plus, Trash2, Edit, Activity, Copy, Eye, EyeOff, Laptop, Smartphone, FileText, Check, Settings, Globe, Mail, Phone, Building2, Hash, Calendar, X, Lock } from 'lucide-react';
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

  // --- Notification State ---
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notiFilter, setNotiFilter] = useState('所有');
  const [showNotiSettings, setShowNotiSettings] = useState(false);
  const [notiSettings, setNotiSettings] = useState({ sys: true, course: true, exam: true, activity: false, audit: true });

  const filteredNotis = notifications.filter(n => notiFilter === '所有' || n.type === notiFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

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
    <div className="animate-fade-in max-w-4xl space-y-8">
      <div className="bg-white rounded-[24px] border border-neutral-200/80 shadow-sm overflow-hidden relative">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-[#fa541c] via-orange-500 to-amber-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl"></div>
        </div>
        
        {/* Profile Content */}
        <div className="px-10 pb-10">
          <div className="flex justify-between items-end -mt-14 mb-8 relative z-10">
            <div className="flex items-end gap-6">
              <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-lg border border-neutral-100">
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 rounded-[10px] flex items-center justify-center text-[#fa541c] text-4xl font-black">
                  张
                </div>
              </div>
              <div className="mb-2">
                <h2 className="text-[28px] font-black text-neutral-900 tracking-tight leading-none mb-2">张老师</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-[#fa541c] rounded-md text-[13px] font-bold">高级讲师</span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[13px] font-bold">在职状态</span>
                </div>
              </div>
            </div>
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-6 font-bold shadow-sm h-11 mb-2 transition-all hover:shadow-md hover:-translate-y-0.5">
              <Edit className="w-4 h-4 mr-2" /> 编辑资料
            </Button>
          </div>

          <h3 className="text-[16px] font-bold text-neutral-900 mb-5 flex items-center gap-2 ml-1">
            <FileText className="w-5 h-5 text-[#fa541c]" /> 基本信息
          </h3>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-neutral-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-neutral-100/80 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/50 flex gap-5 items-center group">
              <div className="w-14 h-14 rounded-[14px] bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-blue-500 group-hover:scale-110 group-hover:border-blue-200 transition-all duration-300">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[12px] font-bold text-neutral-400 mb-1 uppercase tracking-wider">教工号 ID</div>
                <div className="text-[16px] font-black text-neutral-800">T20150982</div>
              </div>
            </div>
            
            <div className="bg-neutral-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-neutral-100/80 hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50/50 flex gap-5 items-center group">
              <div className="w-14 h-14 rounded-[14px] bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-emerald-500 group-hover:scale-110 group-hover:border-emerald-200 transition-all duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[12px] font-bold text-neutral-400 mb-1 uppercase tracking-wider">所属院系</div>
                <div className="text-[16px] font-black text-neutral-800">计算机科学与技术学院</div>
              </div>
            </div>
            
            <div className="bg-neutral-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-neutral-100/80 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 flex justify-between items-center group cursor-pointer">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-[14px] bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-[#fa541c] group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-neutral-400 mb-1 uppercase tracking-wider">手机号码</div>
                  <div className="text-[16px] font-black text-neutral-800 tracking-wide">138****5678</div>
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-[#fa541c] group-hover:border-orange-200 transition-all duration-300 shadow-sm">
                <Edit className="w-4 h-4" />
              </div>
            </div>
            
            <div className="bg-neutral-50/70 hover:bg-white transition-all duration-300 p-6 rounded-2xl border border-neutral-100/80 hover:border-purple-100 hover:shadow-md hover:shadow-purple-50/50 flex justify-between items-center group cursor-pointer">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-[14px] bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-purple-500 group-hover:scale-110 group-hover:border-purple-200 transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-neutral-400 mb-1 uppercase tracking-wider">绑定邮箱</div>
                  <div className="text-[16px] font-black text-neutral-800">zhang****@university.edu.cn</div>
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:text-purple-500 group-hover:border-purple-200 transition-all duration-300 shadow-sm">
                <Edit className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['所有', '系统通知', '考试提醒', '审核结果通知', '课程更新通知'].map(type => (
            <button
              key={type}
              onClick={() => setNotiFilter(type)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border",
                notiFilter === type ? "bg-[#fa541c] text-white border-[#fa541c] shadow-sm" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button 
              onClick={() => {
                setNotifications(notifications.map(n => ({...n, read: true})));
                showToast('已全部标记为已读');
              }}
              variant="outline" className="h-9 rounded-full px-4 text-[13px] font-bold border-neutral-200 text-neutral-600 hover:bg-neutral-50">
              <Check className="w-4 h-4 mr-1.5" /> 全部已读
            </Button>
          )}
          <Button onClick={() => setShowNotiSettings(true)} variant="outline" className="h-9 rounded-full px-4 text-[13px] font-bold border-neutral-200 text-neutral-600 hover:bg-neutral-50">
            <Settings className="w-4 h-4 mr-1.5" /> 通知设置
          </Button>
        </div>
      </div>

      {showNotiSettings && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mb-6 flex flex-col gap-4 relative">
          <button onClick={() => setShowNotiSettings(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"><Check className="w-5 h-5"/></button>
          <h3 className="text-[15px] font-bold text-neutral-800">接收偏好设置</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries({ sys: '系统通知', course: '课程更新通知', exam: '考试提醒', activity: '活动通知', audit: '审核结果通知' }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100">
                <span className="text-[13px] font-bold text-neutral-700">{label}</span>
                <button 
                  onClick={() => setNotiSettings({...notiSettings, [key]: !notiSettings[key as keyof typeof notiSettings]})}
                  className={cn("relative w-10 h-5 rounded-full transition-colors", notiSettings[key as keyof typeof notiSettings] ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", notiSettings[key as keyof typeof notiSettings] ? "left-5" : "left-0.5")}></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm divide-y divide-neutral-100">
        {filteredNotis.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 text-[14px]">暂无相关通知</div>
        ) : filteredNotis.map(noti => (
          <div key={noti.id} className={cn("p-6 flex gap-4 transition-colors hover:bg-neutral-50/50", !noti.read ? "bg-orange-50/30" : "")}>
            <div className={cn("w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center text-white", noti.type.includes('系统') ? 'bg-blue-500' : noti.type.includes('考试') ? 'bg-red-500' : noti.type.includes('审核') ? 'bg-green-500' : 'bg-purple-500')}>
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn("text-[15px] font-bold", !noti.read ? "text-neutral-900" : "text-neutral-700")}>{noti.title}</h4>
                  {!noti.read && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                </div>
                <span className="text-[12px] text-neutral-400 font-mono">{noti.time}</span>
              </div>
              <p className="text-[13px] text-neutral-500 leading-relaxed max-w-3xl mb-3">{noti.content}</p>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded text-[11px] font-bold">{noti.type}</span>
                {!noti.read && (
                  <button 
                    onClick={() => setNotifications(notifications.map(n => n.id === noti.id ? {...n, read: true} : n))}
                    className="text-[12px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    标记为已读
                  </button>
                )}
                <button 
                  onClick={() => {
                    if(confirm('确认删除该通知吗？')) {
                      setNotifications(notifications.filter(n => n.id !== noti.id));
                    }
                  }}
                  className="text-[12px] font-bold text-red-500 hover:text-red-600 ml-auto"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
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
    <div className="flex flex-1 w-full bg-white overflow-hidden shadow-sm">
      
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
