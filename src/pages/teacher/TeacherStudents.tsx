import React, { useState } from 'react';
import { Search, ChevronDown, UserPlus, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherStudents() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [courseFilter, setCourseFilter] = useState('all');

  // 模拟基于上下文的学生数据
  const allStudents = [
    {
      id: '2026744501',
      name: '王小明',
      course: '人工智能基础与实践',
      className: 'AI-2601班',
      progress: 85,
      assignments: '12/15',
      score: 92,
      status: '正常'
    },
    {
      id: '2026744502',
      name: '李华',
      course: '人工智能基础与实践',
      className: 'AI-2601班',
      progress: 100,
      assignments: '15/15',
      score: 95,
      status: '正常'
    },
    {
      id: '2026744503',
      name: '张伟',
      course: '深度学习进阶',
      className: 'DL-2602班',
      progress: 45,
      assignments: '5/12',
      score: 78,
      status: '预警'
    },
    {
      id: '2026744504',
      name: '陈芳',
      course: 'Python数据分析',
      className: 'DA-2501班',
      progress: 100,
      assignments: '20/20',
      score: 88,
      status: '正常'
    },
    {
      id: '2026744505',
      name: '刘洋',
      course: '深度学习进阶',
      className: 'DL-2602班',
      progress: 10,
      assignments: '1/12',
      score: 45,
      status: '预警'
    }
  ];

  const filteredStudents = courseFilter === 'all' 
    ? allStudents 
    : allStudents.filter(s => s.course === courseFilter);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sId => sId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-neutral-500 mb-6">
        学生管理 / <span className="text-neutral-900">班级学生</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">学生管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">查看学生课程学习进度，管理班级成员与成绩报告</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1.5 h-9 bg-white border-neutral-200 text-neutral-600 rounded shadow-sm hover:text-[#fa541c] hover:border-[#fa541c]">
            <Download className="w-4 h-4" /> 导出成绩
          </Button>
          <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 rounded">
            <UserPlus className="w-4 h-4" /> 导入学生
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 py-4 border-b border-neutral-100">
        <div className="relative w-64">
          <select 
            className="w-full text-sm border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-700 font-medium"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">所有课程</option>
            <option value="人工智能基础与实践">人工智能基础与实践</option>
            <option value="深度学习进阶">深度学习进阶</option>
            <option value="Python数据分析">Python数据分析</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="搜索学生姓名或学号" 
            className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-full transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                <th className="p-4 font-medium w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-4 font-medium">学生信息</th>
                <th className="p-4 font-medium">课程名称</th>
                <th className="p-4 font-medium">班级</th>
                <th className="p-4 font-medium">学习进度</th>
                <th className="p-4 font-medium">作业完成度</th>
                <th className="p-4 font-medium">综合成绩</th>
                <th className="p-4 font-medium">学习状态</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-800">{s.name}</div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">{s.id}</div>
                    </td>
                    <td className="p-4 text-neutral-700">{s.course}</td>
                    <td className="p-4 text-neutral-700">{s.className}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              s.progress === 100 ? "bg-green-500" : s.progress < 50 ? "bg-red-500" : "bg-[#fa541c]"
                            )}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-neutral-600">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-700 font-mono">{s.assignments}</td>
                    <td className="p-4">
                      <span className={cn(
                        "font-bold",
                        s.score >= 90 ? "text-green-600" : s.score < 60 ? "text-red-500" : "text-neutral-800"
                      )}>{s.score}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[12px] rounded border", 
                        s.status === '正常' ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"
                      )}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> 学习报告
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-neutral-400">暂无符合条件的学生</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-end p-4 border-t border-neutral-100 gap-4 mt-2">
            <span className="text-[13px] text-neutral-500">共 {filteredStudents.length} 名学生</span>
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
        )}
      </div>
    </div>
  );
}
