import { Button } from "@/components/ui/button";
import { Brain, Trophy, Users, Clock, ArrowRight, Calendar, Star, ChevronRight, Activity, Code } from "lucide-react";
import { Link } from "react-router-dom";

export default function AICompetition() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Hero Section */}
      <div className="bg-[#030712] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6 backdrop-blur-sm">
                <Brain className="w-4 h-4" />
                <span>AI方向实战</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                人工智能 <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">实战算法挑战赛</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
                参与真实业务场景下的AI算法挑战，涵盖计算机视觉、自然语言处理、大模型微调等前沿领域。提升实战能力，赢取丰厚奖励，与顶尖开发者同台竞技。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-full">
                  查看最新赛事
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-full backdrop-blur-sm">
                  了解竞赛规则
                </Button>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">赛季数据概览</h3>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">累计参赛队伍</div>
                    <div className="text-3xl font-bold text-white">12,450+</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">总奖金池</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">￥500万+</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">开源算法模型</div>
                    <div className="text-3xl font-bold text-white">850+</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">合作企业</div>
                    <div className="text-3xl font-bold text-white">120+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitions List */}
      <div className="container mx-auto max-w-6xl px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">热门赛事</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">全部</Button>
            <Button variant="ghost" className="rounded-full text-slate-500">计算机视觉</Button>
            <Button variant="ghost" className="rounded-full text-slate-500">自然语言处理</Button>
            <Button variant="ghost" className="rounded-full text-slate-500">大模型</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">计算机视觉</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥50,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-blue-100 transition-colors">自动驾驶场景下的目标检测</h3>
                <p className="text-blue-100 text-sm opacity-80">由 智行科技 赞助</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                基于真实的自动驾驶车载摄像头数据，训练高精度的目标检测模型，识别行人、车辆、交通标志等复杂路况元素。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 1,204 队伍</span>
                <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md font-medium"><Clock className="w-4 h-4" /> 剩余 15 天</span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11">报名参赛</Button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">大语言模型</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥100,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-purple-100 transition-colors">医疗垂直领域大模型微调挑战</h3>
                <p className="text-purple-100 text-sm opacity-80">由 康健医疗数据 赞助</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                使用提供的脱敏医疗问答数据集，对开源大模型进行微调，提升模型在医疗咨询场景下的准确性和专业度。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 856 队伍</span>
                <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md font-medium"><Clock className="w-4 h-4" /> 剩余 30 天</span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11">报名参赛</Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">智能推荐</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥30,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-emerald-100 transition-colors">电商短视频点击率预估</h3>
                <p className="text-emerald-100 text-sm opacity-80">由 优购电商 赞助</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                基于海量用户行为日志和视频特征，构建精准的CTR预估模型，优化电商平台的短视频推荐分发效率。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 2,103 队伍</span>
                <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium"><Calendar className="w-4 h-4" /> 已结束</span>
              </div>
              <Button className="w-full rounded-xl h-11" variant="outline">查看榜单与开源方案</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Path / Resources */}
      <div className="container mx-auto max-w-6xl px-4 mt-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm mb-4 font-medium">
              <Code className="w-4 h-4" />
              <span>新手入门</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">不知道从何开始？</h2>
            <p className="text-slate-600 text-lg mb-6">
              我们为您准备了从零基础到实战的AI算法学习路径，包含基础理论、框架使用、经典模型复现等丰富课程。
            </p>
            <Button className="rounded-full px-6">
              探索学习路径 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer">
              <Brain className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">深度学习基础</h4>
              <p className="text-sm text-slate-500">神经网络原理与PyTorch实战</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors cursor-pointer">
              <Star className="w-8 h-8 text-purple-500 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">大模型微调指南</h4>
              <p className="text-sm text-slate-500">LoRA/QLoRA高效微调技术</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
