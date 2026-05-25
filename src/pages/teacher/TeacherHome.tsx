import React, { useState } from 'react';
import { Plus, FolderKanban, HelpCircle, FileQuestion, FileText, Database, BookOpen, Copy, Eye, User, Calendar, Clock, Search, Trash2, Edit, Check, X, Users, CreditCard, Cpu, ShieldCheck, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import TeacherProjects from './TeacherProjects';
import TeacherExams from './TeacherExams';
import TeacherDatasets from './TeacherDatasets';
import TeacherPractices from './TeacherPractices';
import TeacherAICenter from './TeacherAICenter';

export default function TeacherHome() {
  const [activeSubTab, setActiveSubTab] = useState<'course' | 'project' | 'dataset' | 'exam' | 'practice' | 'aicenter'>('course');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);

  const [courseTab, setCourseTab] = useState('all'); // all, active, ended
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'create' | 'edit'>('create');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCover, setSelectedCover] = useState('');
  
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [applyPublicCourse, setApplyPublicCourse] = useState<any>(null);
  const [applyReason, setApplyReason] = useState('');
  const [applyTarget, setApplyTarget] = useState('');
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const navigate = useNavigate();

  const defaultCovers = [
    '/shixunnew-v2/images/covers/microsoft_tech_ai_1779333317936.png',
    '/shixunnew-v2/images/covers/microsoft_tech_data_1779333332856.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cloud_1779333396845.png',
    '/shixunnew-v2/images/covers/microsoft_tech_cyber_1779333412582.png',
    '/shixunnew-v2/images/covers/microsoft_tech_dev_1779333430898.png',
    '/shixunnew-v2/images/covers/microsoft_tech_ml_1779333449102.png',
  ];

  const teachingTools = [
    { icon: FileQuestion, title: '试题管理', desc: '进入试题管理页面', bgColor: 'bg-blue-50', textColor: 'text-blue-600', path: '/teacher/questions' },
    { icon: FileText, title: '试卷管理', desc: '进入试卷管理页面', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', path: '/teacher/papers' },
    { icon: ShieldAlert, title: '防作弊管理', desc: '考试竞赛过程监控与策略', bgColor: 'bg-red-50', textColor: 'text-red-600', path: '/teacher/anticheat' },
    { icon: Database, title: '资源分配', desc: '进入学生资源分配页面', bgColor: 'bg-purple-50', textColor: 'text-purple-600', path: '/teacher/resources' },
    { icon: User, title: '学生管理', desc: '学生信息与成绩管理', bgColor: 'bg-teal-50', textColor: 'text-teal-600', path: '/teacher/students' },
    { icon: Users, title: '教师管理', desc: '教师团队与权限管理', bgColor: 'bg-orange-50', textColor: 'text-orange-600', path: '#' },
    { icon: CreditCard, title: '计费账单', desc: '查看平台资源消费情况', bgColor: 'bg-green-50', textColor: 'text-green-600', path: '#' },
    { icon: Cpu, title: 'AI配额管理', desc: '设置与分配AI使用配额', bgColor: 'bg-sky-50', textColor: 'text-sky-600', path: '#' },
    { icon: ShieldCheck, title: '审核中心', desc: '课程与项目上架审核', bgColor: 'bg-rose-50', textColor: 'text-rose-600', path: '#' },
  ];

  const courses = [
    {
      id: 1,
      name: '人工智能基础与实践',
      code: 'AI-101-2026',
      desc: '本课程旨在介绍人工智能的基本概念、算法原理及实际应用。',
      teacher: '张老师',
      ta: '李助教',
      scope: '公开',
      status: '已上线',
      auditStatus: '审核通过',
      image: 'https://picsum.photos/seed/ai/400/200',
      state: 'active'
    },
    {
      id: 2,
      name: '深度学习进阶',
      code: 'DL-201-2026',
      desc: '深入探讨神经网络、CNN、RNN等高级深度学习模型。',
      teacher: '张老师',
      ta: '王助教',
      scope: '私有',
      status: '未上线',
      auditStatus: '待审核',
      image: 'https://picsum.photos/seed/dl/400/200',
      state: 'active'
    },
    {
      id: 3,
      name: 'Python数据分析',
      code: 'PY-301-2025',
      desc: '使用Python进行数据清洗、处理、分析和可视化。',
      teacher: '张老师',
      ta: '-',
      scope: '公开',
      status: '已上线',
      auditStatus: '审核通过',
      image: 'https://picsum.photos/seed/data/400/200',
      state: 'ended'
    }
  ];

  const filteredCourses = courses.filter(c => courseTab === 'all' || c.state === courseTab);

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-[14px] font-medium text-neutral-800">{toast.message}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] rounded-2xl overflow-hidden shadow-lg group h-auto md:h-[240px]">
        
        {/* Diagonal light rays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
           <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,#ffffff_40px,#ffffff_80px)]"></div>
        </div>
        
        {/* Background Arrows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -bottom-20 left-[25%] w-[450px] h-[450px] opacity-10 transform rotate-45 text-white" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 100,50 70,50 70,100 30,100 30,50 0,50" />
          </svg>
          <svg className="absolute top-[10%] left-[50%] w-[250px] h-[250px] opacity-[0.08] transform rotate-45 text-white" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 100,50 70,50 70,100 30,100 30,50 0,50" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row h-full">
          <div className="p-6 md:p-8 md:pl-12 w-full flex flex-col justify-center">
            {/* Bold slanted Title */}
            <div className="transform -skew-x-12 origin-left mb-5 flex flex-wrap items-end gap-3 md:gap-5">
              <h1 className="text-3xl md:text-[36px] font-black text-white leading-none drop-shadow-[2px_3px_0px_rgba(212,56,13,0.5)] italic tracking-wider">
                欢迎回来，张老师
              </h1>
              <h2 className="text-xl md:text-[26px] font-bold text-white/90 leading-none drop-shadow-[1px_2px_0px_rgba(212,56,13,0.5)] italic tracking-wide md:pb-0.5">
                智云实战教学空间
              </h2>
            </div>
            
            {/* White highlighted Subtitle */}
            <div className="transform -skew-x-12 origin-left mb-6 inline-block max-w-max">
              <div className="bg-gradient-to-r from-white via-white to-transparent text-[#fa541c] text-base md:text-lg font-black pl-8 pr-16 py-1.5 md:py-2">
                <span className="transform skew-x-12 block italic tracking-wide">带你轻松管理今日教学任务</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>



      {/* Teaching Tools */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-neutral-title flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#fa541c] rounded-full"></div>
            教学利器
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {teachingTools.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(tool.path)}
              className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-[#fa541c]/30 transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", tool.bgColor, tool.textColor)}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-title group-hover:text-[#fa541c] transition-colors">{tool.title}</h4>
                <p className="text-xs text-neutral-caption mt-0.5">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Management - Table Layout */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
        <div className="border-b border-neutral-border/50 px-6 pt-4 flex gap-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveSubTab('course')}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'course' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            课程
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('project');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'project' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            项目
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('dataset');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'dataset' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            数据集
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('exam');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'exam' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            考试
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('practice');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'practice' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            最佳实践
          </button>
          <button 
            onClick={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('aicenter');
            }}
            className={cn(
              "pb-3 font-bold border-b-2 whitespace-nowrap relative bottom-[-1px] transition-all text-[13px]",
              activeSubTab === 'aicenter' ? "text-[#fa541c] border-[#fa541c]" : "text-neutral-body border-transparent hover:text-[#fa541c]"
            )}
          >
            ai能力中心
          </button>
        </div>
        {activeSubTab === 'course' ? (
          <>
            <div className="p-5 flex items-center justify-between">
              <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-border/50">
                <button 
                  className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", courseTab === 'all' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-body hover:text-neutral-title")}
                  onClick={() => setCourseTab('all')}
                >
                  全部
                </button>
                <button 
                  className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", courseTab === 'active' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-body hover:text-neutral-title")}
                  onClick={() => setCourseTab('active')}
                >
                  进行中
                </button>
                <button 
                  className={cn("px-6 py-1.5 text-sm rounded-full transition-all duration-200", courseTab === 'ended' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-body hover:text-neutral-title")}
                  onClick={() => setCourseTab('ended')}
                >
                  已结束
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="搜索课程名称/代码" 
                    className="pl-9 pr-4 py-2 text-sm border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-64 transition-all"
                  />
                </div>
                <Button onClick={() => { setEditingCourse(null); setSelectedCover(defaultCovers[0]); setCourseModalMode('create'); setIsCourseModalOpen(true); }} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 shadow-sm">
                  <Plus className="w-4 h-4 mr-1" /> 新建课程
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                    <th className="p-4 font-medium w-[35%]">课程信息</th>
                    <th className="p-4 font-medium">授课教师</th>
                    <th className="p-4 font-medium">课程范围</th>
                    <th className="p-4 font-medium">状态</th>
                    <th className="p-4 font-medium">审核状态</th>
                    <th className="p-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={course.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-neutral-border/50 shadow-sm relative">
                            <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer">{course.name}</div>
                            <div className="text-xs text-neutral-500 font-mono mt-0.5">{course.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600">
                        <div className="text-neutral-800 font-medium">{course.teacher}</div>
                      </td>
                      <td className="p-4">
                        {course.scope === '公开' ? (
                          <span className="px-2 py-0.5 bg-[#fff2e8] text-[#fa541c] rounded text-[12px] border border-[#ffbb96]">{course.scope}</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[12px] border border-neutral-200">{course.scope}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-0.5 text-[12px] rounded border", course.status === '已上线' ? "bg-green-50 text-green-600 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>
                          {course.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn("font-medium", course.auditStatus === '审核通过' ? "text-green-600" : "text-[#fa541c]")}>
                          {course.auditStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => navigate(`/teacher/course/${course.id}`)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">查看</button>
                          <button onClick={() => {
                            setEditingCourse(course);
                            setSelectedCover(course.image);
                            setCourseModalMode('edit');
                            setIsCourseModalOpen(true);
                          }} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">编辑</button>
                          {course.scope === '私有' && (
                            <button 
                              onClick={() => {
                                setApplyPublicCourse(course);
                                setApplyReason('');
                                setApplyTarget('');
                                setIsApplyPublicModalOpen(true);
                              }} 
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors"
                            >
                              申请公开
                            </button>
                          )}
                          <button className="text-[#fa541c] hover:text-[#e84a15] transition-colors">复制</button>
                          {index === 1 && (
                            <button className="text-neutral-400 hover:text-neutral-600 transition-colors">删除</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCourses.length === 0 && (
                <div className="p-12 text-center text-neutral-caption">
                  暂无符合条件的课程
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-end p-4 gap-4 mt-2 border-t border-neutral-100">
              <span className="text-[13px] text-neutral-500">共 {filteredCourses.length} 条</span>
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
          </>
        ) : activeSubTab === 'project' ? (
          <TeacherProjects 
            embedded={true} 
            defaultCourseId={selectedCourseId} 
            defaultCourseName={selectedCourseName}
            onBackToCourses={() => {
              setSelectedCourseId(null);
              setSelectedCourseName(null);
              setActiveSubTab('course');
            }}
          />
        ) : activeSubTab === 'dataset' ? (
          <TeacherDatasets 
            embedded={true} 
            defaultCourseId={selectedCourseId}
            defaultCourseName={selectedCourseName}
          />
        ) : activeSubTab === 'practice' ? (
          <TeacherPractices embedded={true} />
        ) : activeSubTab === 'aicenter' ? (
          <TeacherAICenter />
        ) : (
          <TeacherExams embedded={true} />
        )}
      </div>

      {/* Course Dialog (Create/Edit) */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div key={courseModalMode + (editingCourse?.id || '')} className="bg-white rounded-2xl shadow-xl w-full max-w-[640px] overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                {courseModalMode === 'create' ? <Plus className="w-5 h-5 text-[#fa541c]" /> : <Edit className="w-5 h-5 text-[#fa541c]" />} 
                {courseModalMode === 'create' ? '新建课程' : '编辑课程'}
              </h2>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课程名称
                  </label>
                  <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" defaultValue={editingCourse?.name || ''} placeholder="请输入课程名称" autoFocus={courseModalMode === 'create'} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 专业方向
                  </label>
                  <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" defaultValue={courseModalMode === 'edit' ? "人工智能" : ""} placeholder="请输入专业方向" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 标签
                </label>
                <input type="text" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" defaultValue={courseModalMode === 'edit' ? "必修, 核心课程" : ""} placeholder="请输入标签，用逗号分隔" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 课程简介
                </label>
                <textarea className="w-full min-h-[80px] border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none" defaultValue={editingCourse?.desc || ''} placeholder="请输入课程简介"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 课程图片
                </label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {defaultCovers.map((cover, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedCover(cover)}
                      className={cn(
                        "h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative",
                        selectedCover === cover ? "border-[#fa541c] shadow-md scale-[1.02]" : "border-transparent hover:border-[#fa541c]/50 hover:scale-[1.02]"
                      )}
                    >
                      <img src={cover} alt={`cover-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {selectedCover === cover && (
                        <div className="absolute top-1.5 right-1.5 bg-[#fa541c] text-white rounded-full p-0.5 shadow-sm">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button onClick={() => setIsCourseModalOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">
                取消
              </Button>
              <Button onClick={() => setIsCourseModalOpen(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Apply for Public Modal */}
      {isApplyPublicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900">
                申请公开课程资源
              </h2>
              <button onClick={() => setIsApplyPublicModalOpen(false)} className="text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-[13px] flex items-start gap-2 border border-orange-100">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>申请公开后，课程需经过超管审核。审核通过将加入平台公共课程库，全平台师生可见可用。</span>
              </div>
              
              <div>
                <label className="text-[13px] font-bold text-neutral-700 block mb-2">
                  <span className="text-[#fa541c]">*</span> 公开说明（适用对象）
                </label>
                <input 
                  type="text" 
                  value={applyTarget}
                  onChange={(e) => setApplyTarget(e.target.value)}
                  placeholder="例如：适用于计算机类专业本科二、三年级学生..." 
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] font-bold text-neutral-700 block mb-2">
                  <span className="text-[#fa541c]">*</span> 推荐使用建议
                </label>
                <textarea 
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  placeholder="请简述该课程的亮点或推荐使用的场景..." 
                  className="w-full h-28 border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-end gap-3">
              <Button onClick={() => setIsApplyPublicModalOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 rounded-full text-[13px]">
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!applyTarget || !applyReason) {
                    showToast('请填写所有的公开说明与建议', 'error');
                    return;
                  }
                  showToast('申请提交成功，等待超管审核');
                  setIsApplyPublicModalOpen(false);
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-8 rounded-full shadow-sm text-[13px]"
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
