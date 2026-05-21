import React, { useState } from 'react';
import { Plus, Upload, Globe, Search, Brain, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherQuestions() {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const questions = [
    {
      id: 1,
      name: '智能体与传统程序最本质的区别是什么？',
      bank: '人工智能通识D-uni',
      type: '单选题',
      status: '启用',
      source: '人工出题',
      difficulty: '初级',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    },
    {
      id: 2,
      name: '智能体的四个基本组成部分包括哪些？',
      bank: '人工智能通识D-uni',
      type: '多选题',
      status: '启用',
      source: '人工出题',
      difficulty: '初级',
      tags: '智能体',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 14:45',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    },
    {
      id: 3,
      name: '大语言模型是__________是构建生成式各种应用的...',
      bank: '人工智能通识D-uni',
      type: '填空题',
      status: '启用',
      source: '人工出题',
      difficulty: '中级',
      tags: '',
      grading: '自动评分',
      creator: 'Momodel',
      updateTime: '2026/05/15 17:02',
      scope: '已公开',
      auditStatus: '申请公开已通过'
    }
  ];

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(questions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">试题管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">新建试题、仅展示公开或您个人题库内试题，试题“启用”后可用于组卷</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1.5 h-9 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white rounded shadow-sm">
            <Brain className="w-4 h-4" /> 智能出题
          </Button>
          <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded">
            <Plus className="w-4 h-4" /> 新建试题
          </Button>
          <Button variant="outline" className="flex items-center gap-1.5 h-9 rounded border-neutral-200 text-neutral-600">
            批量公开
          </Button>
          <Button variant="outline" className="flex items-center gap-1.5 h-9 rounded border-neutral-200 text-neutral-600">
            导入
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                <th className="p-4 font-medium w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                    checked={selectedQuestions.length === questions.length && questions.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">试题名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">所属试题库 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">来源</th>
                <th className="p-4 font-medium">难度</th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">标签 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">评分方式</th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">创建人 <Search className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">试题范围 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">审核状态 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                      checked={selectedQuestions.includes(q.id)}
                      onChange={() => toggleSelect(q.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="text-neutral-800 max-w-[180px] truncate" title={q.name}>{q.name}</div>
                  </td>
                  <td className="p-4 text-neutral-600">{q.bank}</td>
                  <td className="p-4 text-neutral-800">{q.type}</td>
                  <td className="p-4">
                    <span className={cn("px-2 py-0.5 text-[12px] rounded border", q.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-600">{q.source}</td>
                  <td className="p-4 text-neutral-600">{q.difficulty}</td>
                  <td className="p-4 text-neutral-600">{q.tags || '-'}</td>
                  <td className="p-4 text-neutral-600">{q.grading}</td>
                  <td className="p-4 text-neutral-600">{q.creator}</td>
                  <td className="p-4 text-neutral-500">{q.updateTime}</td>
                  <td className="p-4 text-[#fa541c]">
                    <span className="px-2 py-0.5 bg-[#fff2e8] rounded text-[12px] border border-[#ffbb96]">{q.scope}</span>
                  </td>
                  <td className="p-4 text-[#fa541c]">{q.auditStatus}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">查看</button>
                      <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">复制</button>
                      <button className="text-neutral-400 hover:text-neutral-600 transition-colors">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2">
          <span className="text-[13px] text-neutral-500">共 {questions.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm">&gt;</Button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
