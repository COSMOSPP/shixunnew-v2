import React, { useState } from 'react';
import { 
  CreditCard, Search, ChevronDown, Download, Users, Plus, Shield, Check, X, 
  Cpu, Eye, FileSpreadsheet, RotateCcw, AlertTriangle, HelpCircle, Activity, 
  Info, TrendingUp, Calendar, ArrowUpRight, DollarSign, Wallet, FileText, 
  BellRing, Sparkles, Receipt, RefreshCw, Send, CheckCircle2, QrCode 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BillItem {
  id: string;
  month: string;
  cycle: string;
  amount: number;
  status: '已结清' | '待支付' | '已逾期';
  paymentDate: string;
  invoiceStatus: '已开票' | '未开票';
  usageData: {
    resourceType: string;
    usage: string;
    unitPrice: string;
    amount: number;
    trend: 'up' | 'down' | 'stable';
    percent: string;
  }[];
}

export default function TeacherBilling() {
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [payMethod, setPayMethod] = useState<'alipay' | 'wechat' | 'bank'>('alipay');
  const [paySuccess, setPaySuccess] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('5000');
  const [customRecharge, setCustomRecharge] = useState('');
  
  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock Tenant Information
  const tenantInfo = {
    name: '知云AI智谷实训租户',
    id: 'TEN-8943-2026',
    balance: 1250.00,
    creditLimit: 10000.00,
    status: '正常',
    admin: '张旭东 教授',
  };

  // Mock Billing Database
  const billingData: Record<string, BillItem> = {
    '2026-05': {
      id: 'BILL-202605-001',
      month: '2026年05月',
      cycle: '2026-05-01 至 2026-05-25',
      amount: 9130.00,
      status: '待支付',
      paymentDate: '--',
      invoiceStatus: '未开票',
      usageData: [
        { resourceType: '大语言模型（LLM API Tokens）', usage: '650 M Tokens', unitPrice: '￥10.00 / M', amount: 6500.00, trend: 'up', percent: '71.2%' },
        { resourceType: 'GPU 算力服务（A100-Hours）', usage: '120 Hours', unitPrice: '￥15.00 / Hour', amount: 1800.00, trend: 'up', percent: '19.7%' },
        { resourceType: '云端分布式存储（Object Storage）', usage: '1,500 GB-Month', unitPrice: '￥0.15 / GB', amount: 225.00, trend: 'stable', percent: '2.5%' },
        { resourceType: '极速实训公网带宽（Network Bandwidth）', usage: '3,025 GB', unitPrice: '￥0.20 / GB', amount: 605.00, trend: 'down', percent: '6.6%' }
      ]
    },
    '2026-04': {
      id: 'BILL-202604-001',
      month: '2026年04月',
      cycle: '2026-04-01 至 2026-04-30',
      amount: 11480.00,
      status: '已结清',
      paymentDate: '2026-05-05 10:22',
      invoiceStatus: '已开票',
      usageData: [
        { resourceType: '大语言模型（LLM API Tokens）', usage: '820 M Tokens', unitPrice: '￥10.00 / M', amount: 8200.00, trend: 'up', percent: '71.4%' },
        { resourceType: 'GPU 算力服务（A100-Hours）', usage: '160 Hours', unitPrice: '￥15.00 / Hour', amount: 2400.00, trend: 'up', percent: '20.9%' },
        { resourceType: '云端分布式存储（Object Storage）', usage: '1,480 GB-Month', unitPrice: '￥0.15 / GB', amount: 222.00, trend: 'stable', percent: '1.9%' },
        { resourceType: '极速实训公网带宽（Network Bandwidth）', usage: '3,290 GB', unitPrice: '￥0.20 / GB', amount: 658.00, trend: 'up', percent: '5.8%' }
      ]
    },
    '2026-03': {
      id: 'BILL-202603-001',
      month: '2026年03月',
      cycle: '2026-03-01 至 2026-03-31',
      amount: 8312.00,
      status: '已结清',
      paymentDate: '2026-04-03 15:40',
      invoiceStatus: '已开票',
      usageData: [
        { resourceType: '大语言模型（LLM API Tokens）', usage: '580 M Tokens', unitPrice: '￥10.00 / M', amount: 5800.00, trend: 'down', percent: '69.8%' },
        { resourceType: 'GPU 算力服务（A100-Hours）', usage: '110 Hours', unitPrice: '￥15.00 / Hour', amount: 1650.00, trend: 'down', percent: '19.8%' },
        { resourceType: '云端分布式存储（Object Storage）', usage: '1,450 GB-Month', unitPrice: '￥0.15 / GB', amount: 217.50, trend: 'stable', percent: '2.6%' },
        { resourceType: '极速实训公网带宽（Network Bandwidth）', usage: '3,222 GB', unitPrice: '￥0.20 / GB', amount: 644.50, trend: 'up', percent: '7.8%' }
      ]
    },
    '2026-02': {
      id: 'BILL-202602-001',
      month: '2026年02月',
      cycle: '2026-02-01 至 2026-02-28',
      amount: 4210.00,
      status: '已结清',
      paymentDate: '2026-03-02 09:12',
      invoiceStatus: '已开票',
      usageData: [
        { resourceType: '大语言模型（LLM API Tokens）', usage: '280 M Tokens', unitPrice: '￥10.00 / M', amount: 2800.00, trend: 'down', percent: '66.5%' },
        { resourceType: 'GPU 算力服务（A100-Hours）', usage: '65 Hours', unitPrice: '￥15.00 / Hour', amount: 975.00, trend: 'down', percent: '23.2%' },
        { resourceType: '云端分布式存储（Object Storage）', usage: '1,200 GB-Month', unitPrice: '￥0.15 / GB', amount: 180.00, trend: 'down', percent: '4.3%' },
        { resourceType: '极速实训公网带宽（Network Bandwidth）', usage: '1,275 GB', unitPrice: '￥0.20 / GB', amount: 255.00, trend: 'down', percent: '6.0%' }
      ]
    }
  };

  const historyBillsList: BillItem[] = Object.values(billingData);

  // Active Billing selected Month
  const currentBill = billingData[selectedMonth] || billingData['2026-05'];

  // Handle Export Simulation
  const triggerExport = (type: 'pdf' | 'excel') => {
    setExportType(type);
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            showToast(`${type === 'pdf' ? 'PDF 账单报表' : 'Excel 资源使用明细表'} 导出成功，已开始自动下载！`);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Handle Payment/Recharge Simulation
  const executeRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customRecharge ? Number(customRecharge) : Number(rechargeAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('请输入有效的充值金额', 'error');
      return;
    }

    setPaySuccess(true);
    setTimeout(() => {
      tenantInfo.balance += finalAmount;
      setIsPayOpen(false);
      setPaySuccess(false);
      setCustomRecharge('');
      showToast(`成功充值 ￥${finalAmount.toFixed(2)}，账户余额已实时更新！`, 'success');
    }, 1800);
  };

  // View Bill Details Popup
  const openBillDetail = (bill: BillItem) => {
    setSelectedBill(bill);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 relative animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-xl animate-in slide-in-from-top-4">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
          {toast.type === 'warning' && <Info className="w-5 h-5 text-amber-500" />}
          <span className="text-sm font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            计费账单与资源大盘
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            监控知云租户底层大模型API tokens、GPU算力容器以及分布式存储的账期资源消耗，支持月度自动账单审计及快捷结清
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            onClick={() => triggerExport('excel')}
            variant="outline" 
            className="flex items-center gap-1.5 h-9 bg-white border-neutral-200 text-neutral-600 rounded-lg shadow-sm hover:text-[#fa541c] hover:border-[#fa541c] text-xs font-bold px-4 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> 导出使用明细 (.xlsx)
          </Button>
          <Button 
            onClick={() => triggerExport('pdf')}
            variant="outline" 
            className="flex items-center gap-1.5 h-9 bg-white border-neutral-200 text-neutral-600 rounded-lg shadow-sm hover:text-[#fa541c] hover:border-[#fa541c] text-xs font-bold px-4 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-red-500" /> 导出PDF对账单
          </Button>
        </div>
      </div>

      {/* Overdue Warning & Newly Generated notification banners */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-gradient-to-r from-red-50 via-rose-50/30 to-white border border-red-200/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 rounded-full bg-red-100/30 blur-md"></div>
          <div className="p-2.5 bg-red-100 rounded-xl text-red-600 shrink-0 shadow-sm shadow-red-200/20">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-red-900 flex items-center gap-1.5">
                租户欠费风险警告
                <span className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-wider">临界告警</span>
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">2026-05-26 更新</span>
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed font-medium">
              您的租户账号已处于欠费临界点（当前可用余额 <strong className="text-red-900 font-black">￥{tenantInfo.balance.toFixed(2)}</strong>，本期账单估算值 <strong className="text-red-900 font-black">￥{currentBill.amount.toFixed(2)}</strong>）。为避免大模型实训API被冻结、影响学生实验的连续性，建议您在5月30日前及时充值。
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button 
                onClick={() => setIsPayOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-black px-3.5 py-1.5 rounded-lg shadow-sm shadow-red-500/10 cursor-pointer transition-all hover:scale-102 flex items-center gap-1"
              >
                <Wallet className="w-3 h-3" /> 立即充值结清
              </button>
              <button 
                onClick={() => showToast('欠费规则详情：信用额度 ￥10,000.00，当欠费额度超过信用额度时，GPU资源将被限额。', 'warning')}
                className="text-[11px] font-bold text-neutral-500 hover:text-neutral-800 px-2 py-1.5 hover:underline"
              >
                欠费细则说明
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-fuchsia-50 via-pink-50/20 to-white border border-fuchsia-200/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm relative overflow-hidden">
          <div className="p-2.5 bg-fuchsia-100 rounded-xl text-fuchsia-600 shrink-0 shadow-sm">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-fuchsia-950">新生成账单通知</h3>
              <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-ping"></span>
            </div>
            <p className="text-[11px] text-fuchsia-800 leading-relaxed font-medium">
              5月份半期账单 <strong className="text-fuchsia-950 font-black">￥{currentBill.amount.toFixed(2)}</strong> 已由系统财务引擎于今日 08:00 自动结算生成。
            </p>
            <div className="pt-2">
              <button 
                onClick={() => openBillDetail(currentBill)}
                className="text-[11px] font-black text-fuchsia-700 hover:text-fuchsia-900 border border-fuchsia-200 bg-white hover:bg-fuchsia-50 px-2.5 py-1 rounded-lg transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> 审查本期使用明细
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">租户可用余额</span>
            <strong className="text-2xl font-black text-neutral-800 block tracking-tight">￥{tenantInfo.balance.toFixed(2)}</strong>
            <span className="text-[10px] text-neutral-500 block flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 正常可用
            </span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">企业级信用额度</span>
            <strong className="text-2xl font-black text-neutral-800 block tracking-tight">￥{tenantInfo.creditLimit.toFixed(2)}</strong>
            <span className="text-[10px] text-neutral-400 block">垫付上限 (支持透支实训)</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">本月预估总消费</span>
            <strong className="text-2xl font-black text-[#fa541c] block tracking-tight">￥{currentBill.amount.toFixed(2)}</strong>
            <span className="text-[10px] text-[#fa541c] font-black block flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 较上月环比上升 12.8%
            </span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center justify-between group hover:border-[#fa541c]/40 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">租户管理员</span>
            <strong className="text-lg font-black text-neutral-800 block truncate max-w-[140px]">{tenantInfo.admin}</strong>
            <span className="text-[10px] text-neutral-400 block font-mono">编号: {tenantInfo.id}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-2xl text-neutral-400 group-hover:bg-[#fff2e8] group-hover:text-[#fa541c] transition-all">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Monthly breakdown details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Monthly Resource Usage Statistics */}
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-[15px] font-black text-neutral-800 flex items-center gap-1.5">
                  <Receipt className="w-5 h-5 text-[#fa541c]" /> 
                  月度资源用量与账单拆分
                </h2>
                <p className="text-[10px] text-neutral-400">大模型Tokens消耗、GPU调度机时、共享云存储等多维度开销的月度账期归集核对</p>
              </div>

              {/* Month selector dropdown */}
              <div className="relative self-start sm:self-center">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs font-bold border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] bg-white text-neutral-700 cursor-pointer appearance-none"
                >
                  <option value="2026-05">2026年05月（本月）</option>
                  <option value="2026-04">2026年04月</option>
                  <option value="2026-03">2026年03月</option>
                  <option value="2026-02">2026年02月</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Bill Summary Alert Header inside table */}
            <div className="px-5 py-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-orange-50/15">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-600">
                  账期范围：<strong className="text-neutral-800 font-bold">{currentBill.cycle}</strong>
                </span>
                <span className="text-xs text-neutral-300">|</span>
                <span className="text-xs text-neutral-600">
                  账单流水号：<span className="text-neutral-500 font-mono font-medium">{currentBill.id}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-black rounded-md border",
                  currentBill.status === '已结清' ? "bg-green-50 text-green-600 border-green-200" : 
                  currentBill.status === '待支付' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"
                )}>
                  {currentBill.status}
                </span>
                <strong className="text-sm font-black text-neutral-800">￥{currentBill.amount.toFixed(2)}</strong>
              </div>
            </div>

            {/* Resource Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/20 text-[11px] text-neutral-500 font-black uppercase tracking-wider">
                    <th className="p-4 pl-5">资源类型与开销维度</th>
                    <th className="p-4 text-right">账期使用量</th>
                    <th className="p-4 text-right">单价标准</th>
                    <th className="p-4 text-right">开销占比</th>
                    <th className="p-4 text-right pr-5">金额 (元)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBill.usageData.map((item, index) => (
                    <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px] text-neutral-700">
                      <td className="p-4 pl-5 font-bold text-neutral-800">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            index === 0 ? "bg-blue-500" :
                            index === 1 ? "bg-purple-500" :
                            index === 2 ? "bg-amber-500" : "bg-teal-500"
                          )}></div>
                          {item.resourceType}
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-neutral-800">{item.usage}</td>
                      <td className="p-4 text-right font-mono text-neutral-500">{item.unitPrice}</td>
                      <td className="p-4 text-right font-mono text-xs font-bold text-neutral-400">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="w-12 text-right">{item.percent}</span>
                          <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                index === 0 ? "bg-blue-500" :
                                index === 1 ? "bg-purple-500" :
                                index === 2 ? "bg-amber-500" : "bg-teal-500"
                              )}
                              style={{ width: item.percent }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-black text-neutral-800 pr-5">￥{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            <div className="p-5 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/10">
              <span className="text-xs font-bold text-neutral-500">累计四项核心算力资源合计</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] text-neutral-400 font-bold">小计（含税价）：</span>
                <strong className="text-xl font-black text-[#fa541c] font-mono">￥{currentBill.amount.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Graphical Resource Trend Visualization using Native SVG */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-800 text-[14px] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-fuchsia-500" />
                  大模型与GPU算力最近账期开销趋势
                </h3>
                <p className="text-[10px] text-neutral-400">租户算力额度消耗周期性的财务曲线数据模型</p>
              </div>
              <span className="text-[11px] text-neutral-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                模型负载峰值通常分布于月中考评期
              </span>
            </div>

            <div className="relative pt-4">
              {/* Native SVG Curve chart */}
              <svg viewBox="0 0 600 160" className="w-full h-36 overflow-visible">
                <defs>
                  <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fa541c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#fa541c" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f857a6" />
                    <stop offset="100%" stopColor="#fa541c" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f1f1" strokeDasharray="3,3" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#f1f1f1" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f1f1" strokeDasharray="3,3" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#eaeaea" />

                {/* Gradient Fill under Path */}
                <path 
                  d="M 50 140 L 50 102 C 120 90, 180 30, 250 50 C 320 70, 380 120, 450 110 C 520 100, 550 40, 580 46 L 580 140 Z" 
                  fill="url(#chart-area)"
                />

                {/* Smooth Curve Path */}
                <path 
                  d="M 50 102 C 120 90, 180 30, 250 50 C 320 70, 380 120, 450 110 C 520 100, 550 40, 580 46" 
                  fill="none" 
                  stroke="url(#chart-line)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Chart Dots & Tooltips */}
                <circle cx="50" cy="102" r="4.5" fill="#f857a6" stroke="#fff" strokeWidth="1.5" className="hover:scale-125 transition-transform" />
                <circle cx="250" cy="50" r="4.5" fill="#f97316" stroke="#fff" strokeWidth="1.5" className="hover:scale-125 transition-transform" />
                <circle cx="450" cy="110" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5" className="hover:scale-125 transition-transform" />
                <circle cx="580" cy="46" r="5" fill="#fa541c" stroke="#fff" strokeWidth="2" className="hover:scale-125 transition-transform animate-ping" />
                <circle cx="580" cy="46" r="4.5" fill="#fa541c" stroke="#fff" strokeWidth="1.5" className="hover:scale-125 transition-transform" />

                {/* X Axis Labels */}
                <text x="50" y="156" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">02月账期</text>
                <text x="250" y="156" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">03月账期</text>
                <text x="450" y="156" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">04月账期</text>
                <text x="580" y="156" fill="#888" fontSize="10" textAnchor="end" fontWeight="bold">05月当前账期</text>
              </svg>

              {/* Float popovers simulating hover detail values */}
              <div className="absolute top-2 left-6 bg-white border border-neutral-100 shadow-sm rounded-lg px-2 py-1 text-[9px] font-bold text-neutral-500 pointer-events-none">
                02月: ￥4,210
              </div>
              <div className="absolute top-5 left-1/3 bg-white border border-neutral-100 shadow-sm rounded-lg px-2 py-1 text-[9px] font-bold text-neutral-500 pointer-events-none">
                03月: ￥8,312
              </div>
              <div className="absolute top-24 left-2/3 bg-white border border-neutral-100 shadow-sm rounded-lg px-2 py-1 text-[9px] font-bold text-neutral-500 pointer-events-none">
                04月: ￥11,480
              </div>
              <div className="absolute -top-1 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm rounded-lg px-2.5 py-1 text-[10px] font-black pointer-events-none animate-bounce">
                本月预估: ￥9,130
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: History bills & Billing rules */}
        <div className="space-y-6">
          
          {/* History Bills List */}
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-neutral-500" />
                <h3 className="font-bold text-neutral-800 text-[13px]">往期历史账单归档</h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold">近半年对账单</span>
            </div>

            <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto">
              {historyBillsList.map((bill) => (
                <div key={bill.id} className="p-4 hover:bg-neutral-50/50 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-black text-neutral-800">{bill.month}</strong>
                      <span className={cn(
                        "px-1.5 py-0.5 text-[9px] font-bold rounded",
                        bill.status === '已结清' ? "bg-green-50 text-green-600 border border-green-200" : 
                        bill.status === '待支付' ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-red-50 text-red-600 border border-red-200"
                      )}>
                        {bill.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">账期单号: {bill.id}</div>
                    <div className="text-[10px] text-neutral-500">账期范围：{bill.cycle}</div>
                  </div>
                  <div className="text-right shrink-0 space-y-1.5">
                    <strong className="text-xs font-black text-neutral-800 block font-mono">￥{bill.amount.toFixed(2)}</strong>
                    <button 
                      onClick={() => openBillDetail(bill)}
                      className="text-[10px] font-bold text-[#fa541c] hover:text-[#e84a15] hover:underline cursor-pointer block text-right w-full"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Standards Details */}
          <div className="bg-gradient-to-br from-indigo-50/50 via-slate-50/10 to-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/50">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-neutral-800 text-[13px]">实训算力资源资费收费标准</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-neutral-200">
                <span className="text-neutral-500">大语言模型 LLM Tokens</span>
                <strong className="text-neutral-800">￥10.00 / 百万 Tokens</strong>
              </div>
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-neutral-200">
                <span className="text-neutral-500">GPU A100 独占容器算力</span>
                <strong className="text-neutral-800">￥15.00 / 容器-小时</strong>
              </div>
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-neutral-200">
                <span className="text-neutral-500">共享分布式文件存储容量</span>
                <strong className="text-neutral-800">￥0.15 / GB-账月</strong>
              </div>
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-dashed border-neutral-200">
                <span className="text-neutral-500">高吞吐实训网络出口流量</span>
                <strong className="text-neutral-800">￥0.20 / 独立-GB</strong>
              </div>
            </div>

            <div className="p-3 bg-neutral-100/50 border border-neutral-200/50 rounded-xl text-[10px] text-neutral-500 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                <strong>资费约定：</strong> 账期采用先实训、后按月结算模式。租户充值资金永久有效，月度账单自动从租户余额扣划，余额不足时自动扣划信用额度。
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Exporting Animation Overlay */}
      {isExporting && exportType && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[360px] p-6 text-center space-y-4 border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="relative w-16 h-16 mx-auto">
              {/* Outer spin spinner */}
              <div className="w-16 h-16 rounded-full border-4 border-[#fa541c]/20 border-t-[#fa541c] animate-spin"></div>
              {/* Inner Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {exportType === 'pdf' ? (
                  <FileText className="w-6 h-6 text-red-500 animate-pulse" />
                ) : (
                  <FileSpreadsheet className="w-6 h-6 text-green-600 animate-pulse" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-neutral-800">
                {exportType === 'pdf' ? '正在为您组装 PDF 电子账单对账报告...' : '正在汇编 Excel 月度消费消耗明细清单...'}
              </h3>
              <p className="text-[10px] text-neutral-400">正在打包大模型接口调用记录、防作弊场次机时财务数据...</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-100" 
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-bold text-neutral-500 font-mono text-right">{exportProgress}% 已就绪</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Bill Invoice Details Drawer popup */}
      {isDetailOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[620px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#fa541c]" /> 电子账单明细发票
              </h2>
              <button 
                onClick={() => { setIsDetailOpen(false); setSelectedBill(null); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[500px]">
              
              {/* Invoice Banner Layout */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 rounded-xl text-white flex items-center justify-between shadow-md">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 block uppercase tracking-wider">知云财务系统官方认证书</span>
                  <strong className="text-lg font-black block tracking-tight">{selectedBill.month} 月度财务账单</strong>
                  <span className="text-[10px] text-neutral-300 font-mono block">账单唯一哈希: {selectedBill.id}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className={cn(
                    "px-2.5 py-0.5 text-[10px] font-black rounded-lg border inline-block text-center",
                    selectedBill.status === '已结清' ? "bg-green-600/30 text-green-300 border-green-500/40" :
                    selectedBill.status === '待支付' ? "bg-amber-600/30 text-amber-300 border-amber-500/40" : "bg-red-600/30 text-red-300 border-red-500/40"
                  )}>
                    {selectedBill.status}
                  </span>
                  <strong className="text-xl font-black block font-mono text-orange-400">￥{selectedBill.amount.toFixed(2)}</strong>
                </div>
              </div>

              {/* Tenant Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-neutral-400 block mb-0.5">租户全称</span>
                  <span className="text-neutral-800 font-bold">{tenantInfo.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">租户编号</span>
                  <span className="text-neutral-800 font-bold font-mono">{tenantInfo.id}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">结算账期周期</span>
                  <span className="text-neutral-800 font-bold">{selectedBill.cycle}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">开票状态 / 支付时间</span>
                  <span className="text-neutral-800 font-bold">
                    [{selectedBill.invoiceStatus}] · {selectedBill.paymentDate}
                  </span>
                </div>
              </div>

              {/* Breakdown detail list */}
              <div className="space-y-3">
                <h4 className="font-black text-neutral-800 text-xs flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  大额资源科目归集明细
                </h4>
                <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/80 border-b border-neutral-200 font-bold text-neutral-600">
                        <th className="p-3">消费科目</th>
                        <th className="p-3 text-right">用量</th>
                        <th className="p-3 text-right">结算标准</th>
                        <th className="p-3 text-right">金额 (元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {selectedBill.usageData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50">
                          <td className="p-3 font-bold text-neutral-800">{item.resourceType}</td>
                          <td className="p-3 text-right font-mono font-medium">{item.usage}</td>
                          <td className="p-3 text-right font-mono text-neutral-500">{item.unitPrice}</td>
                          <td className="p-3 text-right font-mono font-black text-neutral-800">￥{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note information */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[10px] text-neutral-500 leading-relaxed">
                <strong>📝 财务说明：</strong>
                <span className="block mt-1">1. 本发票账单根据知云实训算力资源统计模块自动收集得出，精度为毫秒级/Token级核减。</span>
                <span className="block mt-0.5">2. 如对账目开销有任何异议，请在账期出账后7个工作日内提交工单联系知云平台运维中心（010-88889999）进行申诉。</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => triggerExport('pdf')}
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 rounded-lg h-9 text-xs font-bold px-3 bg-white hover:text-[#fa541c]"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" /> 导出本期 PDF
                </Button>
                <Button 
                  onClick={() => showToast('已成功向您的注册邮箱发送电子票据PDF包！')}
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 rounded-lg h-9 text-xs font-bold px-3 bg-white"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> 发送电子账单至邮箱
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  onClick={() => { setIsDetailOpen(false); setSelectedBill(null); }} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
                >
                  关闭对账
                </Button>
                {selectedBill.status !== '已结清' && (
                  <Button 
                    onClick={() => { setIsPayOpen(true); setIsDetailOpen(false); }}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg shadow-md shadow-orange-500/10 text-xs cursor-pointer"
                  >
                    立即结清此账单
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Payment/Recharge Modal dialog */}
      {isPayOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#fa541c]" /> 租户账户充值与结清中心
              </h2>
              <button 
                onClick={() => { setIsPayOpen(false); setPaySuccess(false); }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {paySuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
                  <Check className="w-7 h-7" strokeWidth={3} />
                </div>
                <h3 className="text-base font-black text-neutral-800">租户账户划转充值成功！</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  系统已安全收到您的资金支付。这笔资金已瞬间注入您的租户可用余额中，大语言模型Tokens调用通道将持续处于最高优可用状态。
                </p>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs max-w-xs mx-auto">
                  本次交易流水号：<span className="font-mono text-neutral-600 font-bold">TX-{Math.floor(1000000 + Math.random() * 9000000)}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={executeRecharge} className="p-6 space-y-5">
                
                {/* Current outstanding alert */}
                <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4" /> 5月未付账单待清算额：￥{currentBill.amount.toFixed(2)}
                  </div>
                  <p className="text-[10px] leading-relaxed">可直接充值大于待付账单的金额，系统将在出账扣款日自动为您做月度合并结清扣划。</p>
                </div>

                {/* Amount presets Selector */}
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-neutral-700 block">选择快速充值面额 (元)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '2000', label: '￥2,000' },
                      { value: '5000', label: '￥5,000' },
                      { value: '10000', label: '￥10,000' },
                      { value: '20000', label: '￥20,000' },
                      { value: '50000', label: '￥50,000' }
                    ].map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => { setRechargeAmount(preset.value); setCustomRecharge(''); }}
                        className={cn(
                          "py-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all",
                          rechargeAmount === preset.value && !customRecharge
                            ? "bg-[#fa541c] border-[#fa541c] text-white shadow-md shadow-orange-500/10"
                            : "border-neutral-200 text-neutral-600 bg-white hover:border-[#fa541c] hover:text-[#fa541c]"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom recharge amount input */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-neutral-700 block">自定义其它面值额度 (元)</label>
                  <input
                    type="number"
                    value={customRecharge}
                    onChange={(e) => { setCustomRecharge(e.target.value); setRechargeAmount(''); }}
                    placeholder="输入需要充值的精确金额值"
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] text-neutral-800 bg-white"
                  />
                </div>

                {/* Payment channel methods */}
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-neutral-700 block">选择支付与转账渠道</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'alipay', name: '支付宝在线', icon: QrCode },
                      { id: 'wechat', name: '微信支付', icon: QrCode },
                      { id: 'bank', name: '对公网银划转', icon: Send }
                    ].map(channel => {
                      const Icon = channel.icon;
                      const isSelected = payMethod === channel.id;
                      return (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => setPayMethod(channel.id as any)}
                          className={cn(
                            "py-3.5 rounded-xl border text-xs font-bold text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all",
                            isSelected
                              ? "bg-slate-50 border-neutral-800 text-neutral-900 shadow-sm"
                              : "border-neutral-200 text-neutral-500 bg-white hover:border-neutral-400"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isSelected ? "text-neutral-800" : "text-neutral-400")} />
                          {channel.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated payment detail display */}
                {payMethod !== 'bank' ? (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block">知云安全财务结算代付</span>
                      <strong className="text-[15px] text-neutral-800 block">微信/支付宝聚合扫码支付</strong>
                      <span className="text-[9px] text-[#fa541c] font-bold block">支持学校公务卡扫码对公报销入账</span>
                    </div>
                    <div className="w-16 h-16 bg-white border border-neutral-200 rounded-lg p-1 shrink-0 flex items-center justify-center relative group">
                      <QrCode className="w-14 h-14 text-neutral-800" />
                      <div className="absolute inset-0 bg-black/60 text-white text-[8px] font-black rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        扫码对账
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl text-[10px] text-blue-800 space-y-1 leading-relaxed">
                    <strong>🏦 知云对公汇款账号：</strong>
                    <div className="font-bold">收款单位：北京知云智谷教育科技有限公司</div>
                    <div>开户银行：中国建设银行北京中关村分行营业部</div>
                    <div className="font-mono">对公账户：1105 0163 3600 0000 8943</div>
                    <div className="text-[9px] text-neutral-400 mt-1">汇款时请务必备注您的租户唯一编号: <strong className="font-mono text-neutral-600">{tenantInfo.id}</strong>，款项将在到账后2小时内自动完成核销充值。</div>
                  </div>
                )}

                {/* Form Footer buttons */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-3">
                  <Button 
                    type="button" 
                    onClick={() => setIsPayOpen(false)} 
                    variant="outline" 
                    className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-lg text-xs"
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-8 rounded-lg shadow-md shadow-orange-500/10 text-xs"
                  >
                    模拟确认已扫码支付/已汇款
                  </Button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
