import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

interface AdminStandardPageProps {
  title: string;
  description: string;
  stats: Stat[];
  columns: string[];
  data: any[][];
  primaryAction?: string;
}

export default function AdminStandardPage({ title, description, stats, columns, data, primaryAction = "新建" }: AdminStandardPageProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleSelect = (idx: number) => {
    if (selectedRows.includes(idx)) {
      setSelectedRows(selectedRows.filter(i => i !== idx));
    } else {
      setSelectedRows([...selectedRows, idx]);
    }
  };

  const renderCellContent = (cell: any, colIndex: number) => {
    if (typeof cell === "string") {
      const trimmed = cell.trim();
      // Green active statuses
      if (["运行中", "启用", "启用中", "已公开", "正常", "在线", "成功", "已通过", "已上架"].includes(trimmed)) {
        return (
          <span className="px-2 py-0.5 text-[12px] rounded border bg-green-50 text-green-600 border-green-200 font-medium">
            {cell}
          </span>
        );
      }
      // Orange/Amber warning/pending statuses
      if (["草稿", "中危", "待处理", "筹备中", "报名中", "进行中", "待审核", "已分配", "服务中"].includes(trimmed)) {
        return (
          <span className="px-2 py-0.5 text-[12px] rounded border bg-amber-50 text-amber-600 border-amber-200 font-medium">
            {cell}
          </span>
        );
      }
      // Gray/Disabled statuses
      if (["已停止", "维护中", "已锁定", "已停机", "已过期", "下架中", "已忽略", "已结束", "已缓解", "空闲"].includes(trimmed)) {
        return (
          <span className="px-2 py-0.5 text-[12px] rounded border bg-neutral-50 text-neutral-500 border-neutral-200 font-medium">
            {cell}
          </span>
        );
      }
      // Rose/Critical statuses
      if (["高危", "已拒绝", "高负载"].includes(trimmed)) {
        return (
          <span className="px-2 py-0.5 text-[12px] rounded border bg-rose-50 text-rose-600 border-rose-200 font-medium">
            {cell}
          </span>
        );
      }
      // Special Blue audit label status
      if (trimmed === "申请公开已通过") {
        return (
          <span className="text-blue-600 font-medium text-[13px]">{cell}</span>
        );
      }
      // Main text column (first cell)
      if (colIndex === 0) {
        return <span className="font-semibold text-neutral-800 leading-snug">{cell}</span>;
      }
    }
    return <span className="text-neutral-600 leading-relaxed">{cell}</span>;
  };

  return (
    <div className="space-y-6 min-h-full">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded cursor-pointer transition-all">
          <Plus className="w-4 h-4" /> {primaryAction}
        </Button>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm border-neutral-100 bg-white rounded overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-neutral-500 tracking-wider uppercase">{stat.title}</CardTitle>
              <div className="w-8 h-8 rounded bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
              {stat.trend && (
                <p className={`text-[11px] mt-1 font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trendUp ? '↑' : '↓'} {stat.trend} 较上月
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card with Question-like styling */}
      <div className="bg-white rounded overflow-hidden border border-neutral-100">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-9 pr-4 py-1.5 text-xs border border-neutral-200 rounded focus:outline-none focus:border-[#fa541c] w-64 bg-white text-neutral-800 placeholder-neutral-400 transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-white border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-[#fa541c] hover:bg-[#fff2e8]/30 rounded cursor-pointer transition-all">
              <Filter className="w-3.5 h-3.5" /> 筛选
            </Button>
          </div>
        </div>

        {/* Question-style Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                {/* Select All Checkbox */}
                <th className="p-4 font-medium w-12 text-center">
                  <button 
                    type="button"
                    onClick={() => toggleSelectAll(selectedRows.length !== data.length || data.length === 0)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                      selectedRows.length === data.length && data.length > 0
                        ? "bg-[#fa541c] border-[#fa541c] text-white"
                        : "border-neutral-300 hover:border-[#fa541c] bg-white"
                    )}
                  >
                    {selectedRows.length === data.length && data.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                </th>
                {/* Dynamic Columns Headers */}
                {columns.map((col, i) => (
                  <th key={i} className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      {col}
                      {i === 0 && <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />}
                      {i > 0 && <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
                    </div>
                  </th>
                ))}
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                  {/* Select Row Checkbox */}
                  <td className="p-4 text-center">
                    <button 
                      type="button"
                      onClick={() => toggleSelect(i)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                        selectedRows.includes(i)
                          ? "bg-[#fa541c] border-[#fa541c] text-white"
                          : "border-neutral-300 hover:border-[#fa541c] bg-white"
                      )}
                    >
                      {selectedRows.includes(i) && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  </td>
                  {/* Dynamic Row Data */}
                  {row.map((cell, j) => (
                    <td key={j} className="p-4 whitespace-normal max-w-[240px] truncate" title={typeof cell === "string" ? cell : ""}>
                      {renderCellContent(cell, j)}
                    </td>
                  ))}
                  {/* Operations */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3.5">
                      <button className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">
                        查看
                      </button>
                      <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]">
                        编辑
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors font-medium cursor-pointer bg-transparent border-0 p-0 text-[13px]">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination aligned perfectly with the Teacher side table */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2 border-t border-neutral-100 bg-white">
          <span className="text-[13px] text-neutral-500">共 {data.length} 条</span>
          <div className="flex items-center gap-2">
            <button className="h-7 w-7 p-0 rounded-sm border border-neutral-200 text-neutral-400 cursor-not-allowed bg-transparent text-center leading-7 flex items-center justify-center text-[12px]">&lt;</button>
            <button className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border border-[#fa541c] text-center leading-7 text-[12px] font-bold">1</button>
            <button className="h-7 w-7 p-0 rounded-sm border border-neutral-200 text-neutral-600 hover:border-[#fa541c] hover:text-[#fa541c] cursor-pointer bg-transparent text-center leading-7 flex items-center justify-center text-[12px]">&gt;</button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
