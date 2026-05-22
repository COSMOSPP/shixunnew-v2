import React, { useState } from 'react';
import { Plus, Search, HelpCircle, ChevronDown, FileText, FileQuestion, ChevronRight, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherPapers() {
  const [expandedRow, setExpandedRow] = useState<number | null>(1);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);

  const papers = [
    {
      id: 1,
      name: 'AI 通识第一课测验',
      description: '用于「Mo 体验课程」的“AI 通识第一课”章节测验试卷',
      questionCount: 5,
      types: '单选题',
      type: '测验',
      status: '启用',
      creator: '孙昕',
      updateTime: '2026/02/11'
    },
    {
      id: 2,
      name: '机器学习基础期中测验',
      description: '检验学生对线性回归和逻辑回归的掌握',
      questionCount: 20,
      types: '单选题, 简答题',
      type: '考试',
      status: '启用',
      creator: '张老师',
      updateTime: '2026/02/12'
    }
  ];

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPapers(papers.map(p => p.id));
    } else {
      setSelectedPapers([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedPapers.includes(id)) {
      setSelectedPapers(selectedPapers.filter(pId => pId !== id));
    } else {
      setSelectedPapers([...selectedPapers, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">试卷管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">新建试卷前请先创建可用试题，试卷“启用”后即可用于课程作业或章节测验</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedPapers.length > 0 && (
            <Button variant="outline" className="flex items-center gap-1.5 h-9 rounded border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm">
              批量删除 ({selectedPapers.length})
            </Button>
          )}
          <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded">
            <Plus className="w-4 h-4" /> 新建试卷
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
                    checked={selectedPapers.length === papers.length && papers.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-4 font-medium w-10 text-center"></th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">试卷名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                </th>
                <th className="p-4 font-medium">试卷说明</th>
                <th className="p-4 font-medium">题目数量</th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">包含题型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">试卷类型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">创建人 <Search className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">
                  <div className="flex items-center gap-1.5">更新时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                </th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {papers.map(p => (
                <React.Fragment key={p.id}>
                  <tr className={cn(
                    "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors text-[13px] group",
                    expandedRow === p.id ? "bg-neutral-50/30" : ""
                  )}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                        checked={selectedPapers.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleRow(p.id)}
                        className="text-neutral-400 hover:text-[#fa541c] transition-colors p-1"
                      >
                        <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", expandedRow === p.id && "transform rotate-90 text-[#fa541c]")} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="text-neutral-800 max-w-[220px] truncate font-medium" title={p.name}>{p.name}</div>
                    </td>
                    <td className="p-4 text-neutral-500 max-w-[200px] truncate" title={p.description}>{p.description}</td>
                    <td className="p-4 text-neutral-600">{p.questionCount}</td>
                    <td className="p-4 text-neutral-600">{p.types}</td>
                    <td className="p-4 text-neutral-800">{p.type}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border", 
                        p.status === '启用' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                      )}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600">{p.creator}</td>
                    <td className="p-4 text-neutral-500">{p.updateTime}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">编辑</button>
                        <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">复制</button>
                        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">删除</button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandedRow === p.id && (
                    <tr className="bg-neutral-50/30 border-b border-neutral-100">
                      <td colSpan={11} className="p-0">
                        <div className="py-6 pl-[88px] pr-8 animate-in fade-in duration-200">
                          <div className="bg-white border border-neutral-100 rounded-lg p-6 shadow-sm max-w-3xl">
                            <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2 mb-6">
                              <FileText className="w-5 h-5 text-blue-500" /> 客观题
                            </h3>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-[14px] font-bold text-neutral-800 mb-2">1. 客观题 {p.questionCount} 道，共 100 分</h4>
                                <p className="text-[13px] text-neutral-400">客观题包括{p.types}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-[14px] font-bold text-neutral-800 mb-2">2. 答题限时： 分钟</h4>
                                <p className="text-[13px] text-neutral-400">客观题需在 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</p>
                              </div>
                              
                              <div className="pt-2">
                                <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded shadow-sm shadow-[#fa541c]/20">
                                  预览客观题
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2">
          <span className="text-[13px] text-neutral-500">共 {papers.length} 条</span>
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
