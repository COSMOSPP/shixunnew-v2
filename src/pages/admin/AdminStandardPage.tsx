import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ChevronRight } from "lucide-react";

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
  return (
    <div className="space-y-6 min-h-full">
      {/* Breadcrumbs matching Student Personal Center style */}
      <div className="flex items-center text-sm text-neutral-caption mb-4">
        <Link to="/" className="hover:text-[#fa541c] cursor-pointer transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4 mx-1 text-neutral-caption" />
        <Link to="/admin/ai" className="hover:text-[#fa541c] cursor-pointer transition-colors">运营端</Link>
        <ChevronRight className="w-4 h-4 mx-1 text-neutral-caption" />
        <span className="text-neutral-title font-medium">{title}</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-title">{title}</h1>
          <p className="text-neutral-caption mt-1 text-[13px]">{description}</p>
        </div>
        <Button className="bg-[#fa541c] hover:bg-[#d4380d] text-white gap-2 rounded-lg px-4 py-2 font-medium transition-all shadow-md shadow-[#fa541c]/10">
          <Plus className="w-4 h-4" /> {primaryAction}
        </Button>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm border-neutral-border bg-white rounded-xl overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-neutral-caption tracking-wider uppercase">{stat.title}</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#fff2e8] flex items-center justify-center text-[#fa541c]">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-neutral-title">{stat.value}</div>
              {stat.trend && (
                <p className={`text-xs mt-1 font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trendUp ? '↑' : '↓'} {stat.trend} 较上月
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border-neutral-border bg-white rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-border flex justify-between items-center bg-neutral-bg/25">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-caption" />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa541c]/20 focus:border-[#fa541c] w-64 bg-white text-neutral-title placeholder-neutral-caption transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-white border-neutral-border text-neutral-body hover:bg-neutral-bg rounded-lg">
              <Filter className="w-4 h-4" /> 筛选
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-bg/40 hover:bg-neutral-bg/40 border-b border-neutral-border">
                {columns.map((col, i) => (
                  <TableHead key={i} className="font-semibold text-neutral-title text-[13px]">{col}</TableHead>
                ))}
                <TableHead className="text-right font-semibold text-neutral-title text-[13px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} className="hover:bg-neutral-bg/20 border-b border-neutral-border transition-colors">
                  {row.map((cell, j) => (
                    <TableCell key={j} className="text-neutral-body text-[13px] py-3.5">
                      {j === 0 ? <span className="font-semibold text-neutral-title">{cell}</span> : cell}
                    </TableCell>
                  ))}
                  <TableCell className="text-right py-3.5">
                    <Button variant="ghost" size="sm" className="text-[#fa541c] hover:text-[#d4380d] hover:bg-[#fff2e8] rounded-md transition-colors mr-1">编辑</Button>
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors">删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
