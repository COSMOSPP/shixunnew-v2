import React, { useState } from 'react';
import { ShieldAlert, Monitor, Settings, AlertOctagon, History, Camera, User, Search, Filter, AlertTriangle, Shield, Laptop, Copy, Smartphone, Globe, UploadCloud, Video, Download, Trash2, Edit3, Plus, Check, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---

const ongoingExams = [
  { id: 1, name: '2026春季人工智能期中考试', time: '10:00 - 12:00', students: 120 },
  { id: 2, name: '深度学习上机竞赛', time: '14:00 - 16:30', students: 85 },
];

const mockStudents = [
  { id: 101, name: '张伟', no: '2023001', status: '正常', switches: 0, multiLogin: false, ip: '192.168.1.10', alert: false, image: 'https://picsum.photos/seed/s1/400/300' },
  { id: 102, name: '李娜', no: '2023002', status: '警告', switches: 3, multiLogin: false, ip: '192.168.1.12', alert: true, image: 'https://picsum.photos/seed/s2/400/300' },
  { id: 103, name: '王强', no: '2023003', status: '正常', switches: 1, multiLogin: false, ip: '192.168.1.15', alert: false, image: 'https://picsum.photos/seed/s3/400/300' },
  { id: 104, name: '赵静', no: '2023004', status: '严重', switches: 5, multiLogin: true, ip: '10.0.0.5', alert: true, image: 'https://picsum.photos/seed/s4/400/300' },
  { id: 105, name: '陈杰', no: '2023005', status: '正常', switches: 0, multiLogin: false, ip: '192.168.1.20', alert: false, image: 'https://picsum.photos/seed/s5/400/300' },
  { id: 106, name: '刘洋', no: '2023006', status: '正常', switches: 0, multiLogin: false, ip: '192.168.1.25', alert: false, image: 'https://picsum.photos/seed/s6/400/300' },
  { id: 107, name: '杨光', no: '2023007', status: '异常', switches: 0, multiLogin: false, ip: '202.114.0.1 (异地)', alert: true, image: 'https://picsum.photos/seed/s7/400/300' },
  { id: 108, name: '周梅', no: '2023008', status: '正常', switches: 0, multiLogin: false, ip: '192.168.1.30', alert: false, image: 'https://picsum.photos/seed/s8/400/300' },
];

const cheatLogs = [
  { id: 1, time: '2026-05-25 10:15:32', student: '李娜 (2023002)', exam: '2026春季人工智能期中考试', type: '切屏检测', detail: '离开考试页面超过10秒 (切换至百度网页)', penalty: '系统警告', status: '已处理' },
  { id: 2, time: '2026-05-25 10:42:11', student: '赵静 (2023004)', exam: '2026春季人工智能期中考试', type: '多端登录', detail: '同时在Windows和Mac设备登录该账号', penalty: '强制登出异地设备', status: '已处理' },
  { id: 3, time: '2026-05-25 11:05:45', student: '赵静 (2023004)', exam: '2026春季人工智能期中考试', type: '复制粘贴', detail: '尝试复制第5题题干内容', penalty: '操作拦截并警告', status: '已处理' },
  { id: 4, time: '2026-05-25 14:15:20', student: '杨光 (2023007)', exam: '深度学习上机竞赛', type: 'IP异常', detail: '检测到非校内IP地址登录 (202.114.0.1)', penalty: '人工复核', status: '待处理' },
];

export default function TeacherAntiCheat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'monitor' | 'policy' | 'penalty' | 'reports'>('monitor');
  const [selectedExam, setSelectedExam] = useState(ongoingExams[0].id);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Policy States
  const [policyConfig, setPolicyConfig] = useState({
    screenSwitch: true,
    copyPaste: true,
    multiLogin: true,
    ipMonitor: false,
    photoMonitor: true,
    photoInterval: '5',
    faceRec: false
  });

  // Penalty States
  const [penaltyRules, setPenaltyRules] = useState([
    { id: 1, condition: '切屏次数达到 3 次', action: '系统自动发送警告' },
    { id: 2, condition: '切屏次数达到 5 次', action: '强制交卷' },
    { id: 3, condition: '检测到多端同时在线', action: '踢出其他设备并记录异常' },
    { id: 4, condition: '人脸识别不匹配', action: '标记严重异常，请求人工介入' }
  ]);

  const renderMonitor = () => {
    return (
      <div className="animate-fade-in space-y-6">
        {/* Optimized Session Selector - flat, clean style referencing TeacherQuestions */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">选择监控场次</span>
            <div className="relative">
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(Number(e.target.value))}
                className="appearance-none border border-neutral-200 hover:border-[#fa541c] rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-neutral-800 bg-white focus:outline-none transition-all cursor-pointer shadow-sm min-w-[260px]"
              >
                {ongoingExams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            
            {/* Live Indicator */}
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              实时监测中
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-neutral-400 font-bold">在线考生</div>
                <div className="text-[16px] font-black text-neutral-800">120 <span className="text-xs font-normal text-neutral-400">/ 122人</span></div>
              </div>
            </div>
            
            <div className="w-px h-8 bg-neutral-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-neutral-400 font-bold">异常报警</div>
                <div className="text-[16px] font-black text-red-500 animate-pulse">3 <span className="text-xs font-normal text-neutral-400">起</span></div>
              </div>
            </div>
            
            <div className="w-px h-8 bg-neutral-200 hidden sm:block"></div>
            
            <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-xl px-5 h-9 shadow-md shadow-orange-500/10 font-bold text-xs">
              发送群组通知
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {mockStudents.map(student => (
            <div key={student.id} className={cn(
              "bg-white rounded-2xl overflow-hidden border shadow-sm transition-all relative group",
              student.alert ? "border-orange-300 ring-2 ring-orange-100" : "border-neutral-200"
            )}>
              {/* Camera Feed Mock */}
              <div className="aspect-[4/3] bg-neutral-900 relative">
                <img src={student.image} alt="cam feed" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
                {student.alert && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse shadow-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 行为异常
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  {student.name} ({student.no})
                </div>
              </div>
              
              {/* Status Details */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-neutral-500 flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5"/> 切屏次数</span>
                  <span className={cn("font-bold", student.switches > 0 ? "text-orange-500" : "text-neutral-800")}>{student.switches} 次</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-neutral-500 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5"/> 多端登录</span>
                  <span className={cn("font-bold", student.multiLogin ? "text-red-500" : "text-neutral-800")}>{student.multiLogin ? '是' : '否'}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-neutral-500 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5"/> IP地址</span>
                  <span className={cn("font-bold", student.ip.includes('异地') ? "text-red-500" : "text-neutral-800")}>{student.ip}</span>
                </div>
              </div>

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <Button variant="outline" className="w-32 rounded-full border-[#fa541c] text-[#fa541c] hover:bg-orange-50 font-bold text-[13px]">
                  <AlertCircle className="w-4 h-4 mr-1.5" /> 发送警告
                </Button>
                <Button variant="outline" className="w-32 rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-bold text-[13px]">
                  <Camera className="w-4 h-4 mr-1.5" /> 立即截图
                </Button>
                <Button variant="ghost" className="w-32 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-[13px]">
                   强制交卷
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPolicy = () => {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
        <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-[#fa541c] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[15px] font-bold text-neutral-900">防作弊策略配置</h3>
            <p className="text-[13px] text-neutral-600 mt-1.5 leading-relaxed">
              在这里开启或关闭各类防作弊检测手段。策略修改后，对于新加入考试或刷新页面的考生将立刻生效。推荐在考试开始前完成所有配置。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Setting Item */}
            <div className="flex items-start justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shrink-0">
                  <Laptop className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-neutral-900 mb-1">切屏检测</h4>
                  <p className="text-[13px] text-neutral-500 max-w-lg">监控考生离开考试页面的行为，记录切屏次数、持续时间以及可能切换到的其他应用（若浏览器允许）。</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPolicyConfig({...policyConfig, screenSwitch: !policyConfig.screenSwitch})}
                  className={cn("relative w-12 h-6 rounded-full transition-colors", policyConfig.screenSwitch ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.screenSwitch ? "left-7" : "left-1")}></span>
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shrink-0">
                  <Copy className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-neutral-900 mb-1">复制粘贴限制</h4>
                  <p className="text-[13px] text-neutral-500 max-w-lg">禁止考生在考试页面使用快捷键或右键菜单复制题目、粘贴答案，阻断外部搜题路径。</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPolicyConfig({...policyConfig, copyPaste: !policyConfig.copyPaste})}
                  className={cn("relative w-12 h-6 rounded-full transition-colors", policyConfig.copyPaste ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.copyPaste ? "left-7" : "left-1")}></span>
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shrink-0">
                  <Smartphone className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-neutral-900 mb-1">多端登录检测</h4>
                  <p className="text-[13px] text-neutral-500 max-w-lg">限制同一账号在多个设备或多个浏览器同时登录。若检测到新登录，可设定强制下线旧设备或拦截新登录。</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPolicyConfig({...policyConfig, multiLogin: !policyConfig.multiLogin})}
                  className={cn("relative w-12 h-6 rounded-full transition-colors", policyConfig.multiLogin ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.multiLogin ? "left-7" : "left-1")}></span>
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 pb-6 border-b border-neutral-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shrink-0">
                  <Globe className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-neutral-900 mb-1">IP地址监控</h4>
                  <p className="text-[13px] text-neutral-500 max-w-lg">实时监控考生IP，检测跳板机、代理IP或与常驻IP不符的异地登录，并进行高危预警。</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPolicyConfig({...policyConfig, ipMonitor: !policyConfig.ipMonitor})}
                  className={cn("relative w-12 h-6 rounded-full transition-colors", policyConfig.ipMonitor ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.ipMonitor ? "left-7" : "left-1")}></span>
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shrink-0">
                  <Camera className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-neutral-900 mb-1">拍照监控</h4>
                  <p className="text-[13px] text-neutral-500 max-w-lg">开启后，系统将请求考生的摄像头权限。若未授予权限将无法进入考试。</p>
                  
                  {policyConfig.photoMonitor && (
                    <div className="mt-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-neutral-700">定时截图间隔 (分钟)</span>
                        <input 
                          type="number" 
                          value={policyConfig.photoInterval}
                          onChange={(e) => setPolicyConfig({...policyConfig, photoInterval: e.target.value})}
                          className="w-20 px-3 py-1.5 border border-neutral-200 rounded-lg text-[13px] text-center focus:outline-none focus:border-[#fa541c]"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-neutral-700">开启人脸识别比对</span>
                        <button 
                          onClick={() => setPolicyConfig({...policyConfig, faceRec: !policyConfig.faceRec})}
                          className={cn("relative w-10 h-5 rounded-full transition-colors", policyConfig.faceRec ? "bg-[#fa541c]" : "bg-neutral-200")}
                        >
                          <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.faceRec ? "left-5" : "left-0.5")}></span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPolicyConfig({...policyConfig, photoMonitor: !policyConfig.photoMonitor})}
                  className={cn("relative w-12 h-6 rounded-full transition-colors", policyConfig.photoMonitor ? "bg-[#fa541c]" : "bg-neutral-200")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", policyConfig.photoMonitor ? "left-7" : "left-1")}></span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 flex justify-end gap-3">
            <Button variant="outline" className="rounded-full px-6 text-[13px] font-bold">恢复默认</Button>
            <Button onClick={() => showToast('防作弊策略保存成功')} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-8 text-[13px] font-bold shadow-sm">
              保存策略应用
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPenalty = () => {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-neutral-900">自动处罚规则</h3>
            <p className="text-[13px] text-neutral-500 mt-1">设置触发条件与对应处罚，系统将在满足条件时自动执行。</p>
          </div>
          <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-6 h-9 text-[13px] shadow-sm font-bold">
            <Plus className="w-4 h-4 mr-1.5" /> 添加新规则
          </Button>
        </div>

        <div className="space-y-4">
          {penaltyRules.map((rule, idx) => (
            <div key={rule.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400 text-[13px]">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-neutral-400 mb-1">触发条件</span>
                    <span className="text-[14px] font-bold text-neutral-800 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">{rule.condition}</span>
                  </div>
                  <div className="w-8 flex items-center justify-center text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-neutral-400 mb-1">执行动作</span>
                    <span className="text-[14px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{rule.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => {
                  if(confirm('确定删除该规则吗？')) {
                    setPenaltyRules(penaltyRules.filter(r => r.id !== rule.id));
                    showToast('删除成功');
                  }
                }} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <select className="border border-neutral-200 rounded-full px-4 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] bg-white w-48">
              <option value="all">所有场次</option>
              <option value="1">2026春季人工智能期中考试</option>
              <option value="2">深度学习上机竞赛</option>
            </select>
            <select className="border border-neutral-200 rounded-full px-4 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] bg-white w-40">
              <option value="all">所有异常类型</option>
              <option value="switch">切屏检测</option>
              <option value="multi">多端登录</option>
              <option value="ip">IP异常</option>
              <option value="copy">复制粘贴</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="搜索考生姓名或学号" className="pl-9 pr-4 py-2 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64" />
            </div>
            <Button variant="outline" className="rounded-full px-4 text-[13px] font-bold border-neutral-200 text-neutral-600">
              <Download className="w-4 h-4 mr-1.5" /> 导出报告
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200">
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[180px]">触发时间</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[180px]">考生信息</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[200px]">考试场次</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[120px]">异常类型</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500">行为描述</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[140px]">处罚结果</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[100px]">状态</th>
                <th className="py-4 px-6 text-[13px] font-bold text-neutral-500 w-[100px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {cheatLogs.map((log, index) => (
                <tr key={log.id} className={cn("border-b border-neutral-100 hover:bg-orange-50/30 transition-colors", index === cheatLogs.length - 1 && "border-b-0")}>
                  <td className="py-4 px-6 text-[13px] text-neutral-500 font-mono">{log.time}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-neutral-800">{log.student}</td>
                  <td className="py-4 px-6 text-[13px] text-neutral-600">{log.exam}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] text-neutral-600">{log.detail}</td>
                  <td className="py-4 px-6 text-[13px] text-[#fa541c] font-bold">{log.penalty}</td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit",
                      log.status === '已处理' ? "text-emerald-600 bg-emerald-50" : "text-orange-500 bg-orange-50"
                    )}>
                      {log.status === '已处理' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Button variant="ghost" className="h-8 px-3 text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 relative">
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


      {/* Header Section - styled exactly like TeacherQuestions.tsx */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            防作弊管理
          </h1>
          <p className="text-sm text-neutral-500 mb-0.5">考试/竞赛期间的防作弊监控与自动化策略执行</p>
        </div>
        
        {/* Tab switchers in flat button pill style - matches TeacherQuestions page controls */}
        <div className="flex bg-white border border-neutral-200/80 p-1 rounded-xl shadow-sm self-start sm:self-center">
          {(['monitor', 'policy', 'penalty', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === tab 
                  ? "bg-[#fa541c] text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
              )}
            >
              {tab === 'monitor' ? '实时监控' : tab === 'policy' ? '策略配置' : tab === 'penalty' ? '处罚设置' : '行为汇总'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'monitor' && renderMonitor()}
        {activeTab === 'policy' && renderPolicy()}
        {activeTab === 'penalty' && renderPenalty()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
}
