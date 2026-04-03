import React, { useState } from "react";
import { ChevronRight, Bell, Check, Trash2, CheckCircle2, MessageSquare, BookOpen, Calendar, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserCenterMessages() {
  const [activeTab, setActiveTab] = useState("system");

  const tabs = [
    { id: "system", label: "系统通知", icon: MessageSquare },
    { id: "course", label: "课程更新通知", icon: BookOpen },
    { id: "exam", label: "考试提醒", icon: Calendar },
    { id: "event", label: "活动通知", icon: Gift },
  ];

  const notifications = [
    { id: 1, type: "system", title: "系统升级通知", content: "实训平台将于本周日凌晨2点进行系统升级，届时将暂停服务2小时，请合理安排学习时间。", time: "2小时前", isRead: false },
    { id: 2, type: "system", title: "实名认证成功", content: "您的实名认证已通过审核，现在可以使用所有平台功能。", time: "1天前", isRead: true },
    { id: 3, type: "course", title: "《Python高级编程》课程上新", content: "您关注的课程已更新第8章内容：并发编程实战，快去看看吧！", time: "3天前", isRead: false },
    { id: 4, type: "exam", title: "期中考试提醒", content: "《机器学习基础》期中考试将于明天上午10:00开始，请提前准备好考试环境。", time: "12小时前", isRead: false },
    { id: 5, type: "event", title: "AI创新挑战赛报名开启", content: "2025年度AI大模型应用创新挑战赛正式开启报名，丰厚奖金等你拿！", time: "5天前", isRead: true },
  ];

  const filteredNotifs = notifications.filter(n => n.type === activeTab);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex flex-shrink-0 items-center justify-between">
        <div className="flex items-center text-sm text-neutral-caption">
          <Link to="/user" className="hover:text-primary cursor-pointer transition-colors">首页</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/user/center" className="hover:text-primary cursor-pointer transition-colors">个人中心</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-neutral-title font-medium">消息中心</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white text-neutral-body hover:text-primary hover:border-primary/30">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            全部已读
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-neutral-border">
        {/* Left Tabs */}
        <div className="w-[180px] border-r border-neutral-border bg-neutral-bg/30 p-3 flex flex-col gap-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-sm border border-neutral-border/50" 
                  : "text-neutral-body hover:bg-neutral-bg hover:text-neutral-title"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-neutral-caption")} />
              {tab.label}
              {tab.id === "system" && <span className="ml-auto bg-semantic-error text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">1</span>}
              {tab.id === "course" && <span className="ml-auto bg-semantic-error text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">1</span>}
              {tab.id === "exam" && <span className="ml-auto bg-semantic-error text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">1</span>}
            </button>
          ))}
        </div>

        {/* Notifs Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {filteredNotifs.length > 0 ? (
            <div className="divide-y divide-neutral-border">
              {filteredNotifs.map(notif => (
                <div key={notif.id} className={cn(
                  "p-5 hover:bg-neutral-bg/50 transition-colors group relative",
                  !notif.isRead ? "bg-[#fff2e8]/30" : ""
                )}>
                  {!notif.isRead && (
                    <div className="absolute top-6 left-3 w-2 h-2 rounded-full bg-semantic-error" />
                  )}
                  <div className="flex items-start justify-between pl-4">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={cn(
                          "text-[15px] font-medium",
                          notif.isRead ? "text-neutral-title" : "text-neutral-title font-bold"
                        )}>{notif.title}</h4>
                        <span className="text-xs text-neutral-caption">{notif.time}</span>
                      </div>
                      <p className="text-sm text-neutral-body leading-relaxed">{notif.content}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button className="p-1.5 text-neutral-caption hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="标记已读">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-neutral-caption hover:text-semantic-error hover:bg-semantic-error/10 rounded-md transition-colors" title="删除通知">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-caption">
              <Bell className="w-12 h-12 mb-3 text-neutral-border" />
              <p>暂无此类通知</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
