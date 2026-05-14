import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Bell, Check, Trash2, CheckCircle2, MessageSquare, BookOpen, Calendar, Gift, FileCheck, SlidersHorizontal, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserCenterMessages() {
  const [activeTab, setActiveTab] = useState("system");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  const tabs = [
    { id: "system", label: "系统通知", icon: MessageSquare },
    { id: "course", label: "课程更新通知", icon: BookOpen },
    { id: "exam", label: "考试提醒", icon: Calendar },
    { id: "event", label: "活动通知", icon: Gift },
    { id: "audit", label: "审核结果通知", icon: FileCheck },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, type: "system", title: "系统升级通知", content: "实训平台将于本周日凌晨2点进行系统升级，届时将暂停服务2小时，请合理安排学习时间。", time: "2小时前", isRead: false },
    { id: 2, type: "system", title: "实名认证成功", content: "您的实名认证已通过审核，现在可以使用所有平台功能。如需了解详细的认证权益，请查看帮助文档。", time: "1天前", isRead: true },
    { id: 3, type: "course", title: "《Python高级编程》课程上新", content: "您关注的课程已更新第8章内容：并发编程实战，快去看看吧！涵盖了多线程、多进程以及异步IO等高级特性，配有大量实战代码。", time: "3天前", isRead: false },
    { id: 4, type: "exam", title: "期中考试提醒", content: "《机器学习基础》期中考试将于明天上午10:00开始，请提前准备好考试环境。", time: "12小时前", isRead: false },
    { id: 5, type: "event", title: "AI创新挑战赛报名开启", content: "2025年度AI大模型应用创新挑战赛正式开启报名，丰厚奖金等你拿！", time: "5天前", isRead: true },
    { id: 6, type: "audit", title: "GPU配额申请已通过", content: "您好，您申请的 100卡时 GPU 资源额度已通过管理员审批，现已发放到您的账户，请前往资源中心查看详情。使用期限至 2026-06-14。", time: "刚刚", isRead: false },
    { id: 7, type: "audit", title: "最佳实践申请被驳回", content: "您的《大模型微调》实践申请被驳回，原因：描述不够详细，缺少核心代码片段。请补充后重新提交。", time: "2天前", isRead: true },
  ]);

  const [preferences, setPreferences] = useState({
    system: true,
    course: true,
    exam: true,
    event: false,
    audit: true,
  });

  const filteredNotifs = notifications.filter(n => n.type === activeTab);

  const markAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotif = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotif?.id === id) setSelectedNotif(null);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const unreadCounts = tabs.reduce((acc, tab) => {
    acc[tab.id] = notifications.filter(n => n.type === tab.id && !n.isRead).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between mb-6">
        <div className="flex items-center text-sm text-neutral-500">
          <Link to="/user" className="hover:text-[#fa541c] cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/user/center" className="hover:text-[#fa541c] cursor-pointer transition-colors">个人中心</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-900 font-bold">消息中心</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-9 text-sm bg-white text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 border-neutral-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            全部已读
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className={cn("h-9 text-sm transition-colors shadow-sm", showSettings ? "bg-orange-50 text-[#fa541c] border-orange-200" : "bg-white text-neutral-600 border-neutral-200 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50")}>
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            接收偏好
          </Button>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200 mb-6 animation-fade-in flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2"><Bell className="w-4 h-4 text-[#fa541c]" /> 通知接收偏好</h3>
            <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-neutral-600 bg-neutral-50 p-1.5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-8 pl-6">
            {tabs.map(tab => (
              <label key={tab.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={preferences[tab.id as keyof typeof preferences]} 
                  onChange={(e) => setPreferences({...preferences, [tab.id]: e.target.checked})}
                  className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer transition-all"
                />
                <span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">{tab.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative">
        {/* Left Tabs Navigation */}
        <div className="w-[240px] border-r border-neutral-100 bg-[#fcfcfd] p-4 flex flex-col gap-1 overflow-y-auto shrink-0 relative z-10">
          <div className="text-[12px] font-black text-neutral-400 uppercase tracking-widest mb-3 px-3 mt-2">消息分类</div>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedNotif(null); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] transition-all w-full text-left relative group",
                  isActive 
                    ? "bg-white shadow-sm border border-neutral-200/60" 
                    : "hover:bg-neutral-100/60 border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#fa541c] rounded-r-md"></div>
                )}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-orange-50 text-[#fa541c]" : "bg-neutral-100 text-neutral-500 group-hover:text-neutral-700 group-hover:bg-neutral-200"
                )}>
                  <tab.icon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "flex-1 font-bold truncate transition-colors text-[13px]",
                  isActive ? "text-[#fa541c]" : "text-neutral-600 group-hover:text-neutral-900"
                )}>
                  {tab.label}
                </span>
                {unreadCounts[tab.id] > 0 && (
                  <span className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-full font-black leading-none",
                    isActive ? "bg-[#fa541c] text-white shadow-sm shadow-orange-500/20" : "bg-neutral-200 text-neutral-500"
                  )}>
                    {unreadCounts[tab.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden relative bg-white">
          {selectedNotif ? (
            /* Selected Message Detail Interface */
            <div className="absolute inset-0 z-20 bg-white overflow-y-auto custom-scrollbar p-6 md:p-8 animation-slide-up flex flex-col">
              <button 
                onClick={() => setSelectedNotif(null)} 
                className="mb-6 w-fit inline-flex items-center gap-1.5 text-[14px] font-bold text-neutral-500 hover:text-[#fa541c] bg-neutral-50 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 返回消息列表
              </button>
              
              {/* Detail Header */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#fa541c] shrink-0 shadow-sm">
                      {(() => {
                        const Icon = tabs.find(t => t.id === selectedNotif.type)?.icon;
                        return Icon ? <Icon className="w-6 h-6" /> : null;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-[20px] font-black text-neutral-900 mb-1.5 tracking-wide leading-tight">{selectedNotif.title}</h2>
                      <div className="flex items-center gap-3">
                        <span className="bg-[#fa541c] text-white px-2 py-0.5 rounded text-[11px] font-bold shadow-sm shadow-orange-500/20">
                          {tabs.find(t => t.id === selectedNotif.type)?.label}
                        </span>
                        <span className="text-neutral-400 font-medium text-[13px] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {selectedNotif.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={(e) => deleteNotif(selectedNotif.id, e as any)} className="border-neutral-200 text-neutral-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm h-8">
                       <Trash2 className="w-3.5 h-3.5 mr-1.5" /> 删除通知
                     </Button>
                  </div>
                </div>
                
                {/* Detail Content Body */}
                <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed text-[14px]">
                  <p>{selectedNotif.content}</p>
                  
                  {selectedNotif.type === 'audit' && (
                    <div className="mt-6 p-5 bg-neutral-50/80 border border-neutral-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-[#fa541c]" />
                        <h4 className="font-bold text-neutral-900 text-[14px] m-0">工单审批摘要</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[13px]">
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-100">
                          <span className="text-neutral-500 font-medium">申请单号</span> 
                          <span className="font-bold text-neutral-900">REQ-20260514-001</span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-100">
                          <span className="text-neutral-500 font-medium">处理人</span> 
                          <span className="font-bold text-neutral-900">系统管理员</span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-100">
                          <span className="text-neutral-500 font-medium">申请时间</span> 
                          <span className="font-bold text-neutral-900">2026-05-13 14:20</span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-100">
                          <span className="text-neutral-500 font-medium">审批时间</span> 
                          <span className="font-bold text-neutral-900">2026-05-14 09:30</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-start">
                        <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 text-[13px] shadow-sm shadow-orange-500/20">前往资源中心查看详情</Button>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          ) : (
            /* Message List Interface */
            <div className="h-full overflow-y-auto custom-scrollbar p-0 animation-fade-in relative z-10">
              {filteredNotifs.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {filteredNotifs.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        setSelectedNotif(notif);
                        if (!notif.isRead) {
                          setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                        }
                      }}
                      className={cn(
                        "p-5 px-6 cursor-pointer transition-colors group relative border-l-4",
                        !notif.isRead ? "border-l-[#fa541c] bg-orange-50/30" : "border-l-transparent hover:bg-neutral-50/80"
                      )}
                    >
                      {!notif.isRead && (
                        <div className="absolute top-8 left-4 w-2 h-2 rounded-full bg-[#fa541c] shadow-sm shadow-orange-500/30" />
                      )}
                      <div className="flex items-start justify-between pl-4">
                        <div className="flex-1 mr-6">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className={cn(
                              "text-[15px] tracking-wide",
                              notif.isRead ? "text-neutral-700 font-bold" : "text-neutral-900 font-black"
                            )}>{notif.title}</h4>
                            <span className="text-[12px] text-neutral-400 font-medium bg-neutral-50 px-2 py-0.5 rounded">{notif.time}</span>
                          </div>
                          <p className="text-[13.5px] text-neutral-500 leading-relaxed line-clamp-1 pr-10 group-hover:text-neutral-600 transition-colors">{notif.content}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.isRead && (
                            <button onClick={(e) => markAsRead(notif.id, e)} className="p-2 text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 rounded-xl transition-colors" title="标记已读">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={(e) => deleteNotif(notif.id, e)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="删除通知">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-5 border border-neutral-100 shadow-sm">
                    <Bell className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="text-[16px] font-bold text-neutral-700 mb-1">暂无新消息</h3>
                  <p className="text-[13px] font-medium text-neutral-400">当前分类下没有通知记录</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
