import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Server, Database, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: '1日', users: 4000 },
  { name: '5日', users: 3000 },
  { name: '10日', users: 2000 },
  { name: '15日', users: 2780 },
  { name: '20日', users: 1890 },
  { name: '25日', users: 2390 },
  { name: '30日', users: 3490 },
];

const pieData = [
  { name: '人工智能', value: 400 },
  { name: '安全运维', value: 300 },
  { name: '云计算', value: 300 },
  { name: '其他', value: 200 },
];
const COLORS = ['#fa541c', '#1890ff', '#52c41a', '#faad14'];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "平台总用户数", value: "12,345", icon: Users, color: "text-semantic-link" },
          { title: "今日日活 (DAU)", value: "1,234", icon: Activity, color: "text-semantic-success" },
          { title: "当前并发实训环境数", value: "456", icon: Server, color: "text-semantic-warning" },
          { title: "累计消耗算力资源 (核时)", value: "89,012", icon: Database, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[14px] font-medium text-neutral-body">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-[24px] font-bold text-neutral-title">{stat.value}</div>
              <p className="text-[12px] text-neutral-caption mt-1">
                较昨日 <span className="text-semantic-success">+12%</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>近 30 天用户增长曲线</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fa541c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fa541c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#8c8c8c" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8c8c8c" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9d9d9" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #d9d9d9' }}
                    itemStyle={{ color: '#1f1f1f' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#fa541c" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>各实训场景活跃度占比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #d9d9d9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-[12px] text-neutral-body">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-semantic-error" />
            安全与合规（数据零出域监控）
          </CardTitle>
          <div className="text-[12px] text-semantic-link cursor-pointer">查看全部日志</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "2026-03-17 10:23:45", user: "user_789 (张三)", action: "尝试下载实训环境内敏感数据", status: "已拦截", level: "高危" },
              { time: "2026-03-17 09:15:22", user: "user_456 (李四)", action: "异常 IP 登录控制台", status: "需确认", level: "中危" },
              { time: "2026-03-17 08:30:00", user: "system", action: "防火墙规则自动更新", status: "成功", level: "低危" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-[6px] bg-neutral-bg border border-neutral-border">
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 rounded-[4px] text-[12px] font-medium ${
                    log.level === '高危' ? 'bg-semantic-error/10 text-semantic-error' :
                    log.level === '中危' ? 'bg-semantic-warning/10 text-semantic-warning' :
                    'bg-semantic-success/10 text-semantic-success'
                  }`}>
                    {log.level}
                  </div>
                  <div className="text-[14px] text-neutral-title font-medium">{log.action}</div>
                  <div className="text-[12px] text-neutral-caption hidden md:block">操作人: {log.user}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[12px] text-neutral-caption">{log.time}</div>
                  <div className={`text-[12px] font-medium ${
                    log.status === '已拦截' ? 'text-semantic-error' :
                    log.status === '需确认' ? 'text-semantic-warning' :
                    'text-semantic-success'
                  }`}>
                    {log.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
