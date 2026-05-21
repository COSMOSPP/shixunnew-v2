import React, { useState } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherResources() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const students = [
    {
      id: '202674454205',
      name: '示例学生五',
      grade: '2026',
      college: '软件学院',
      major: '软件工程',
      class: '1班',
      gpuHours: 2,
      projects: 10,
      datasets: 5
    },
    {
      id: '202674454204',
      name: '示例学生四',
      grade: '2026',
      college: '软件学院',
      major: '软件工程',
      class: '1班',
      gpuHours: 2,
      projects: 10,
      datasets: 5
    },
    {
      id: '202674454203',
      name: '示例学生三',
      grade: '2026',
      college: '软件学院',
      major: '软件工程',
      class: '1班',
      gpuHours: 2,
      projects: 10,
      datasets: 5
    },
    {
      id: '202674454202',
      name: '示例学生二',
      grade: '2026',
      college: '软件学院',
      major: '软件工程',
      class: '1班',
      gpuHours: 2,
      projects: 10,
      datasets: 5
    },
    {
      id: '202674454201',
      name: '示例学生一',
      grade: '2026',
      college: '软件学院',
      major: '软件工程',
      class: '1班',
      gpuHours: 2,
      projects: 10,
      datasets: 5
    }
  ];

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
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
    <div className="space-y-6">
      <div className="flex items-center gap-4 py-4 border-b border-neutral-100">
        <label className="text-[14px] font-bold text-neutral-800">课程名称：</label>
        <div className="relative w-72">
          <select className="w-full text-sm border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-500">
            <option value="">请输入课程名称或编号</option>
            <option value="cs101">计算机科学导论</option>
            <option value="ai201">人工智能基础</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-neutral-900">学生资源</h2>
          <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm rounded h-9">
            <Plus className="w-4 h-4" /> 批量增配
          </Button>
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
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">学生姓名 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">学号 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" /></div>
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">学年 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">学院 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">专业 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center gap-1.5">班级 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="p-4 font-medium">GPU 小时数</th>
                  <th className="p-4 font-medium">项目数量</th>
                  <th className="p-4 font-medium">数据集数量</th>
                  <th className="p-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c]" 
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td className="p-4 text-neutral-800">{s.name}</td>
                    <td className="p-4 text-neutral-600">{s.id}</td>
                    <td className="p-4 text-neutral-600">{s.grade}</td>
                    <td className="p-4 text-neutral-600">{s.college}</td>
                    <td className="p-4 text-neutral-600">{s.major}</td>
                    <td className="p-4 text-neutral-600">{s.class}</td>
                    <td className="p-4 text-neutral-800">{s.gpuHours}</td>
                    <td className="p-4 text-neutral-800">{s.projects}</td>
                    <td className="p-4 text-neutral-800">{s.datasets}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">编辑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-end p-4 gap-4 mt-2">
            <span className="text-[13px] text-neutral-500">共 {students.length} 条</span>
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
    </div>
  );
}
