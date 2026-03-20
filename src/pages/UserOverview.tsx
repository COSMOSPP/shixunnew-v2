import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Activity, Star, TrendingUp, Clock, PlayCircle, ArrowRight, Sparkles, Flame } from "lucide-react";
import KnowledgeTree from "@/components/KnowledgeTree";

export default function UserOverview() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[16px] p-8 md:p-10 overflow-hidden shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fa541c] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-3xl translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#fa541c]" />
              <span className="text-[#fa541c] font-medium text-sm tracking-wide">AI 实训专区</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">欢迎回来，探索前沿 AI 技术</h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              您目前正在学习 <span className="text-white font-medium">《DeepSeek 大模型私有化部署实战》</span>，已完成 65%。继续保持，掌握企业级 AI 工程化落地能力！
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button className="bg-[#fa541c] hover:bg-[#ff7a45] text-white px-8 py-6 rounded-xl text-base shadow-lg shadow-[#fa541c]/20 transition-all hover:scale-105 hover:-translate-y-1">
              <PlayCircle className="w-5 h-5 mr-2" />
              继续学习
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "累计学习", value: "128", unit: "小时", icon: Clock, color: "text-blue-500", bg: "bg-blue-50", trend: "+12h 本周" },
          { title: "完成课程", value: "12", unit: "门", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", trend: "+2 本月" },
          { title: "完成实验", value: "34", unit: "个", icon: Activity, color: "text-[#fa541c]", bg: "bg-[#fff2e8]", trend: "+5 本月" },
          { title: "获得成就", value: "5", unit: "项", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50", trend: "击败 85% 学员" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[16px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{stat.trend}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                <span className="text-sm text-slate-500 font-medium">{stat.unit}</span>
              </div>
              <div className="text-sm text-slate-500 mt-1">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Tree Module */}
      <KnowledgeTree />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Best Practices */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#fa541c]" />
                热门最佳实践
              </h2>
              <Button variant="ghost" className="text-slate-500 hover:text-[#fa541c] hover:bg-[#fff2e8]">
                查看全部 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "DeepSeek R1 本地私有化部署指南", image: "https://picsum.photos/seed/prac1/400/225", type: "部署实战", views: "12.5k", time: "2小时前更新" },
                { title: "基于 Dify 搭建企业级智能知识库", image: "https://picsum.photos/seed/prac2/400/225", type: "应用开发", views: "8.2k", time: "昨天更新" },
                { title: "大模型微调 (LoRA) 性能优化技巧", image: "https://picsum.photos/seed/prac3/400/225", type: "模型调优", views: "6.4k", time: "3天前更新" },
                { title: "AI Agent 智能体开发从入门到精通", image: "https://picsum.photos/seed/prac4/400/225", type: "前沿技术", views: "5.1k", time: "1周前更新" },
              ].map((item, i) => (
                <div key={i} className="group bg-white rounded-[16px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1.5 cursor-pointer flex flex-col">
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-[#fa541c] transition-colors leading-snug">{item.title}</h3>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-50">
                      <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {item.views} 浏览</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 1/3 width */}
        <div className="space-y-8">
          {/* Leaderboard */}
          <div className="bg-white rounded-[16px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                学习达人榜
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { name: "张三", score: 9850, rank: 1, avatar: "https://i.pravatar.cc/150?u=1" },
                { name: "李四", score: 8720, rank: 2, avatar: "https://i.pravatar.cc/150?u=2" },
                { name: "王五", score: 8100, rank: 3, avatar: "https://i.pravatar.cc/150?u=3" },
                { name: "赵六", score: 7650, rank: 4, avatar: "https://i.pravatar.cc/150?u=4" },
                { name: "陈七", score: 7200, rank: 5, avatar: "https://i.pravatar.cc/150?u=5" },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-amber-100 text-amber-600" : 
                    i === 1 ? "bg-slate-200 text-slate-600" : 
                    i === 2 ? "bg-orange-100 text-orange-600" : 
                    "text-slate-400"
                  }`}>
                    {user.rank}
                  </div>
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.score} 积分</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
