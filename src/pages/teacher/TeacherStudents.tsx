import React, { useState } from 'react';
import { Search, ChevronDown, UserPlus, FileText, Download, Users, User, Plus, Shield, Check, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TeacherStudents() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [courseFilter, setCourseFilter] = useState('all');
  const [teacherRoleFilter, setTeacherRoleFilter] = useState('all');
  
  // Modal states for add teacher
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 模拟基于上下文的学生数据
  const [allStudents, setAllStudents] = useState([
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
  ]);

  // 模拟教师管理数据
  const [allTeachers, setAllTeachers] = useState([
    {
      id: 'T1001',
      name: '张老师',
      email: 'zhang.teacher@zhiyun.edu',
      role: '主讲教师 / 管理员',
      courses: '人工智能基础与实践, 深度学习进阶',
      className: 'AI-2601班, DL-2602班',
      status: '活跃',
      joinedDate: '2023-09-01'
    },
    {
      id: 'T1002',
      name: '李讲师',
      email: 'li.lecturer@zhiyun.edu',
      role: '主讲教师',
      courses: 'Python数据分析',
      className: 'DA-2501班',
      status: '活跃',
      joinedDate: '2024-03-15'
    },
    {
      id: 'TA3001',
      name: '王助教',
      email: 'wang.ta@zhiyun.edu',
      role: '助教',
      courses: '深度学习进阶',
      className: 'DL-2602班',
      status: '活跃',
      joinedDate: '2025-09-10'
    },
    {
      id: 'TA3002',
      name: '李助教',
      email: 'li.ta@zhiyun.edu',
      role: '助教',
      courses: '人工智能基础与实践',
      className: 'AI-2601班',
      status: '离线',
      joinedDate: '2025-09-10'
    }
  ]);

  const filteredStudents = courseFilter === 'all' 
    ? allStudents 
    : allStudents.filter(s => s.course === courseFilter);

  const filteredTeachers = teacherRoleFilter === 'all'
    ? allTeachers
    : allTeachers.filter(t => t.role.includes(teacherRoleFilter));

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
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-lg animate-in slide-in-from-top-4">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            用户管理
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {activeTab === 'student' 
              ? '集中管理和审查选课学生的信息、学习进度、作业交付状态与学术表现' 
              : '管理您的授课团队、助教团队及相应的课程权限分配与协同情况'}
          </p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'teacher' && (
            <Button 
              onClick={() => setIsAddTeacherOpen(true)}
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-md shadow-orange-500/10 h-9 rounded-xl text-xs font-bold px-4"
            >
              <Plus className="w-4 h-4" /> 添加教师/助教
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-200 mt-6">
        <button
          onClick={() => setActiveTab('student')}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'student'
              ? "text-[#fa541c] border-[#fa541c]"
              : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <User className="w-4 h-4" />
          学生管理 ({allStudents.length}人)
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={cn(
            "flex items-center gap-2 px-5 pb-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'teacher'
              ? "text-[#fa541c] border-[#fa541c]"
              : "text-neutral-500 border-transparent hover:text-neutral-800"
          )}
        >
          <Users className="w-4 h-4" />
          教师团队 ({allTeachers.length}人)
        </button>
      </div>

      {/* Filter and Search Bar - transparent, flat style referencing TeacherQuestions */}
      <div className="flex flex-col md:flex-row items-center gap-4 py-2 bg-transparent w-full">
        
        {/* Dropdown Filters based on active Tab */}
        {activeTab === 'student' ? (
          <div className="relative w-full md:w-64">
            <select 
              className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-700 font-bold"
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
        ) : (
          <div className="relative w-full md:w-64">
            <select 
              className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#fa541c] appearance-none bg-white text-neutral-700 font-bold"
              value={teacherRoleFilter}
              onChange={(e) => setTeacherRoleFilter(e.target.value)}
            >
              <option value="all">所有角色类型</option>
              <option value="主讲教师">主讲教师</option>
              <option value="助教">课程助教</option>
              <option value="管理员">系统管理员</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        )}

        {/* Text Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'student' ? "搜索学生姓名或学号" : "搜索教师姓名或邮箱"} 
            className="pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-full transition-all text-neutral-700"
          />
        </div>
      </div>

      {/* Main Lists and Tables - Reference TeacherQuestions flat card style */}
      <div className="bg-white rounded overflow-hidden mt-4">
        {activeTab === 'student' ? (
          /* Student Management Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                  <th className="p-4 w-12 text-center">
                    <button 
                      type="button"
                      onClick={() => toggleSelectAll(selectedStudents.length !== filteredStudents.length || filteredStudents.length === 0)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                        selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
                          ? "bg-[#fa541c] border-[#fa541c] text-white"
                          : "border-neutral-300 hover:border-[#fa541c] bg-white"
                      )}
                    >
                      {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  </th>
                  <th className="p-4">学生基本信息</th>
                  <th className="p-4">所选课程</th>
                  <th className="p-4">负责班级</th>
                  <th className="p-4">实验学习进度</th>
                  <th className="p-4">作业完成度</th>
                  <th className="p-4">综合实训成绩</th>
                  <th className="p-4">账号状态</th>
                  <th className="p-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                      <td className="p-4 text-center">
                        <button 
                          type="button"
                          onClick={() => toggleSelect(s.id)}
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                            selectedStudents.includes(s.id)
                              ? "bg-[#fa541c] border-[#fa541c] text-white"
                              : "border-neutral-300 hover:border-[#fa541c] bg-white"
                          )}
                        >
                          {selectedStudents.includes(s.id) && <span className="text-[10px] font-bold">✓</span>}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-neutral-800">{s.name}</div>
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">{s.id}</div>
                      </td>
                      <td className="p-4 text-neutral-700 font-medium">{s.course}</td>
                      <td className="p-4 text-neutral-600">{s.className}</td>
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
                          <span className="text-[11px] font-bold text-neutral-600">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600 font-mono font-medium">{s.assignments}</td>
                      <td className="p-4">
                        <span className={cn(
                          "font-black text-sm",
                          s.score >= 90 ? "text-green-600" : s.score < 60 ? "text-red-500" : "text-neutral-800"
                        )}>{s.score}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[11px] font-bold rounded border", 
                          s.status === '正常' ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"
                        )}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1 mx-auto text-xs font-bold">
                          <FileText className="w-3.5 h-3.5" /> 学习报告
                        </button>
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
        ) : (
          /* Teacher/TA Management Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                  <th className="p-4">教师基本信息</th>
                  <th className="p-4">所授课程</th>
                  <th className="p-4">协同授课班级</th>
                  <th className="p-4">管理角色与权限</th>
                  <th className="p-4">加入时间</th>
                  <th className="p-4">账号状态</th>
                  <th className="p-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map(t => (
                    <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{t.id} · {t.email}</div>
                      </td>
                      <td className="p-4 text-neutral-700 max-w-[200px] truncate" title={t.courses}>
                        {t.courses}
                      </td>
                      <td className="p-4 text-neutral-600 max-w-[180px] truncate" title={t.className}>
                        {t.className}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-xs font-bold text-neutral-700">
                          <Shield className="w-3.5 h-3.5 text-[#fa541c] flex-shrink-0" />
                          {t.role}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-500 font-mono text-xs">{t.joinedDate}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[11px] font-bold rounded border",
                          t.status === '活跃' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                        )}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors text-xs font-bold">配置权限</button>
                          <button className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs font-bold">解除协同</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-neutral-400">暂无符合条件的教师团队成员</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer/Pagination for active Tab - styled exactly like TeacherQuestions */}
        <div className="flex items-center justify-end p-4 gap-4 mt-2">
          <span className="text-[13px] text-neutral-500">
            共 {activeTab === 'student' ? filteredStudents.length : filteredTeachers.length} 条
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#fa541c] text-white border-[#fa541c]">1</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-sm" disabled>&gt;</Button>
          </div>
          <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
        </div>
      </div>

      {/* Add Teacher Modal Dialog */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[15px] font-black text-neutral-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#fa541c]" /> 添加教师或助教
              </h2>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-800 block">姓名</label>
                <input type="text" placeholder="输入教师或助教姓名" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" id="new-teacher-name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-800 block">邮箱 / 账号</label>
                <input type="email" placeholder="输入教育邮箱，例如 format@zhiyun.edu" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#fa541c]" id="new-teacher-email" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-800 block">角色权限</label>
                <select className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-700" id="new-teacher-role">
                  <option value="助教">班级助教 (TA) - 可辅助批改实验和监考</option>
                  <option value="主讲教师">主讲教师 (Lecturer) - 拥有完整教学与资源分配权限</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-neutral-800 block">分配关联课程</label>
                <select className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#fa541c] bg-white font-bold text-neutral-700" id="new-teacher-course">
                  <option value="人工智能基础与实践">人工智能基础与实践</option>
                  <option value="深度学习进阶">深度学习进阶</option>
                  <option value="Python数据分析">Python数据分析</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/20 flex items-center justify-end gap-3">
              <Button onClick={() => setIsAddTeacherOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 rounded-xl text-xs">
                取消
              </Button>
              <Button 
                onClick={() => {
                  const nameEl = document.getElementById('new-teacher-name') as HTMLInputElement;
                  const emailEl = document.getElementById('new-teacher-email') as HTMLInputElement;
                  const roleEl = document.getElementById('new-teacher-role') as HTMLSelectElement;
                  const courseEl = document.getElementById('new-teacher-course') as HTMLSelectElement;
                  
                  if (!nameEl.value || !emailEl.value) {
                    showToast('请填写完整的姓名与邮箱账号信息', 'error');
                    return;
                  }

                  const newTeacher = {
                    id: 'T' + Math.floor(1000 + Math.random() * 9000),
                    name: nameEl.value,
                    email: emailEl.value,
                    role: roleEl.value,
                    courses: courseEl.value,
                    className: '待分配班级',
                    status: '活跃',
                    joinedDate: new Date().toISOString().split('T')[0]
                  };

                  setAllTeachers([...allTeachers, newTeacher]);
                  setIsAddTeacherOpen(false);
                  showToast('添加团队教师协同成功！');
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 rounded-xl shadow-md shadow-orange-500/10 text-xs"
              >
                确认添加
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
