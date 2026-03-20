import { Button } from "@/components/ui/button";
import { Cloud, Trophy, Users, Clock, ArrowRight, Calendar, Server, Activity, Network, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function CloudCompetition() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Hero Section */}
      <div className="bg-[#030712] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6 backdrop-blur-sm">
                <Cloud className="w-4 h-4" />
                <span>公有云方向挑战</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                云原生与架构 <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">实战部署挑战赛</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
                在真实的公有云环境中进行架构设计、高可用部署、Serverless开发与云原生改造。提升云端运维与开发能力，赢取大厂内推机会与丰厚奖金。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 h-12 px-8 rounded-full text-white">
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
                  <h3 className="font-semibold text-lg">云端实战数据</h3>
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">累计参赛队伍</div>
                    <div className="text-3xl font-bold text-white">8,320+</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">总奖金池</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">￥300万+</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">云资源消耗</div>
                    <div className="text-3xl font-bold text-white">50W+ 小时</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">合作云厂商</div>
                    <div className="text-3xl font-bold text-white">8 家</div>
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
            <Button variant="ghost" className="rounded-full text-slate-500">云原生架构</Button>
            <Button variant="ghost" className="rounded-full text-slate-500">Serverless</Button>
            <Button variant="ghost" className="rounded-full text-slate-500">高可用运维</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">高可用运维</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥80,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-cyan-100 transition-colors">千万级并发电商大促架构演练</h3>
                <p className="text-cyan-100 text-sm opacity-80">由 某头部电商 赞助</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                基于公有云平台，设计并部署支持千万级并发的高可用电商架构。包含负载均衡、弹性伸缩、缓存击穿防御及异地多活容灾方案。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 945 队伍</span>
                <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md font-medium"><Clock className="w-4 h-4" /> 剩余 20 天</span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11">报名参赛</Button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">云原生架构</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥50,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-100 transition-colors">传统单体应用微服务容器化改造</h3>
                <p className="text-indigo-100 text-sm opacity-80">由 云原生计算基金会 联合举办</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                将提供的传统Java单体ERP系统，拆分为微服务架构，并使用Docker和Kubernetes(K8s)在公有云上完成容器化编排与自动化部署(CI/CD)。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 1,320 队伍</span>
                <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md font-medium"><Clock className="w-4 h-4" /> 剩余 12 天</span>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11">报名参赛</Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-sky-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">Serverless</span>
                <span className="flex items-center gap-1 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400"/> ￥40,000
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1 group-hover:text-blue-100 transition-colors">全栈无服务器(Serverless)应用开发</h3>
                <p className="text-blue-100 text-sm opacity-80">由 某公有云厂商 赞助</p>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
                利用云函数(FaaS)、API网关、云原生NoSQL数据库及对象存储，零服务器运维开发一款具备实时音视频互动功能的社交小程序后端。
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> 1,850 队伍</span>
                <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium"><Calendar className="w-4 h-4" /> 已结束</span>
              </div>
              <Button className="w-full rounded-xl h-11" variant="outline">查看优秀架构方案</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Path / Resources */}
      <div className="container mx-auto max-w-6xl px-4 mt-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-sm mb-4 font-medium">
              <Network className="w-4 h-4" />
              <span>云端进阶</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">掌握核心云技能</h2>
            <p className="text-slate-600 text-lg mb-6">
              从云服务器基础配置到 Kubernetes 容器编排，再到 Terraform 自动化基础设施即代码(IaC)，构建您的云原生知识体系。
            </p>
            <Button className="rounded-full px-6 bg-cyan-600 hover:bg-cyan-700 text-white">
              探索学习路径 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-colors cursor-pointer">
              <Server className="w-8 h-8 text-cyan-500 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Kubernetes 实战</h4>
              <p className="text-sm text-slate-500">K8s集群搭建与微服务编排</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer">
              <Shield className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">云安全与合规</h4>
              <p className="text-sm text-slate-500">IAM权限管理与网络安全组</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
