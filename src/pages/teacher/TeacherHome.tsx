import React, { useState } from 'react';
import { Plus, FolderKanban, HelpCircle, FileQuestion, FileText, Database, BookOpen, Copy, Eye, User, Calendar, Clock, Search, Trash2, Edit, Check, X, Users, CreditCard, Cpu, ShieldCheck, AlertCircle, CheckCircle, ShieldAlert, BarChart3, School } from 'lucide-react';
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

  // Initial course data setup
  const [coursesList, setCoursesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('zhiyun_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultList = [
      {
        id: 1,
        name: '人工智能基础与实践',
        code: 'AI-101-2026',
        desc: '本课程旨在介绍人工智能的基本概念、算法原理及实际应用。',
        teacher: '张老师',
        ta: '李助教',
        scope: '平台',
        status: '已发布',
        auditStatus: '已通过',
        image: 'https://picsum.photos/seed/ai/400/200',
        state: 'active',
        major: '人工智能',
        tags: '必修, 核心课程'
      },
      {
        id: 2,
        name: '深度学习进阶',
        code: 'DL-201-2026',
        desc: '深入探讨神经网络、CNN、RNN等高级深度学习模型。',
        teacher: '张老师',
        ta: '王助教',
        scope: '私有',
        status: '草稿',
        auditStatus: '待审核',
        image: 'https://picsum.photos/seed/dl/400/200',
        state: 'active',
        major: '人工智能',
        tags: '必修'
      },
      {
        id: 3,
        name: 'Python数据分析',
        code: 'PY-301-2025',
        desc: '使用Python进行数据清洗、处理、分析和可视化。',
        teacher: '张老师',
        ta: '-',
        scope: '租户',
        status: '已发布',
        auditStatus: '已通过',
        image: 'https://picsum.photos/seed/data/400/200',
        state: 'ended',
        major: '计算机科学',
        tags: '选修'
      }
    ];
    localStorage.setItem('zhiyun_courses', JSON.stringify(defaultList));
    return defaultList;
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'create' | 'edit'>('create');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCover, setSelectedCover] = useState('');
  
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [applyPublicCourse, setApplyPublicCourse] = useState<any>(null);
  const [applyReason, setApplyReason] = useState('');
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseFormName, setCourseFormName] = useState('');
  const [courseFormMajor, setCourseFormMajor] = useState('');
  const [courseFormTags, setCourseFormTags] = useState('');
  const [courseFormDesc, setCourseFormDesc] = useState('');

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
    { icon: FileQuestion, title: '试题管理', desc: '试题库录入与智能标签', bgGradient: 'bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white hover:from-blue-100/50 hover:to-indigo-50/60', borderClass: 'border-blue-100/70 hover:border-blue-200/80', titleColor: 'text-blue-950', descColor: 'text-neutral-500', iconBg: 'bg-blue-600', iconTextColor: 'text-blue-600', shadowColor: 'hover:shadow-blue-500/5 hover:shadow-md', path: '/teacher/questions' },
    { icon: FileText, title: '试卷管理', desc: '智能组卷与作业分发', bgGradient: 'bg-gradient-to-br from-violet-50/60 via-purple-50/30 to-white hover:from-violet-100/50 hover:to-purple-50/60', borderClass: 'border-violet-100/70 hover:border-violet-200/80', titleColor: 'text-violet-950', descColor: 'text-neutral-500', iconBg: 'bg-violet-600', iconTextColor: 'text-violet-600', shadowColor: 'hover:shadow-violet-500/5 hover:shadow-md', path: '/teacher/papers' },
    { icon: ShieldAlert, title: '防作弊管理', desc: '考试竞赛过程监控策略', bgGradient: 'bg-gradient-to-br from-rose-50/60 via-red-50/30 to-white hover:from-rose-100/50 hover:to-red-50/60', borderClass: 'border-rose-100/70 hover:border-rose-200/80', titleColor: 'text-rose-950', descColor: 'text-neutral-500', iconBg: 'bg-rose-600', iconTextColor: 'text-rose-600', shadowColor: 'hover:shadow-rose-500/5 hover:shadow-md', path: '/teacher/anticheat' },
    { icon: Database, title: '资源分配', desc: '实训算力资源配置', bgGradient: 'bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white hover:from-emerald-100/50 hover:to-emerald-50/60', borderClass: 'border-emerald-100/70 hover:border-emerald-200/80', titleColor: 'text-emerald-950', descColor: 'text-neutral-500', iconBg: 'bg-emerald-600', iconTextColor: 'text-emerald-600', shadowColor: 'hover:shadow-emerald-500/5 hover:shadow-md', path: '/teacher/resources' },
    { icon: Users, title: '用户管理', desc: '学生与协作教师团队管理', bgGradient: 'bg-gradient-to-br from-cyan-50/60 via-blue-50/30 to-white hover:from-cyan-100/50 hover:to-blue-50/60', borderClass: 'border-cyan-100/70 hover:border-cyan-200/80', titleColor: 'text-cyan-950', descColor: 'text-neutral-500', iconBg: 'bg-cyan-600', iconTextColor: 'text-cyan-600', shadowColor: 'hover:shadow-cyan-500/5 hover:shadow-md', path: '/teacher/students' },
    { icon: BarChart3, title: '学习数据统计', desc: '学生学习曲线进度大盘', bgGradient: 'bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-white hover:from-amber-100/50 hover:to-orange-50/60', borderClass: 'border-amber-100/70 hover:border-amber-200/80', titleColor: 'text-amber-950', descColor: 'text-neutral-500', iconBg: 'bg-amber-600', iconTextColor: 'text-amber-600', shadowColor: 'hover:shadow-amber-500/5 hover:shadow-md', path: '/teacher/statistics' },
    { icon: CreditCard, title: '计费账单', desc: '查看算力与存储消费', bgGradient: 'bg-gradient-to-br from-fuchsia-50/60 via-pink-50/30 to-white hover:from-fuchsia-100/50 hover:to-pink-50/60', borderClass: 'border-fuchsia-100/70 hover:border-fuchsia-200/80', titleColor: 'text-fuchsia-950', descColor: 'text-neutral-500', iconBg: 'bg-fuchsia-600', iconTextColor: 'text-fuchsia-600', shadowColor: 'hover:shadow-fuchsia-500/5 hover:shadow-md', path: '/teacher/billing' },
    { icon: Cpu, title: 'AI配额管理', desc: '大模型GPU算力配额设置', bgGradient: 'bg-gradient-to-br from-indigo-50/60 via-violet-50/30 to-white hover:from-indigo-100/50 hover:to-violet-50/60', borderClass: 'border-indigo-100/70 hover:border-indigo-200/80', titleColor: 'text-indigo-950', descColor: 'text-neutral-500', iconBg: 'bg-indigo-600', iconTextColor: 'text-indigo-600', shadowColor: 'hover:shadow-indigo-500/5 hover:shadow-md', path: '/teacher/aiquota' },
    { icon: ShieldCheck, title: '审核中心', desc: '自建课程项目上架审核', bgGradient: 'bg-gradient-to-br from-pink-50/60 via-rose-50/30 to-white hover:from-pink-100/50 hover:to-rose-50/60', borderClass: 'border-pink-100/70 hover:border-pink-200/80', titleColor: 'text-pink-950', descColor: 'text-neutral-500', iconBg: 'bg-pink-600', iconTextColor: 'text-pink-600', shadowColor: 'hover:shadow-pink-500/5 hover:shadow-md', path: '/teacher/audit' },
  ];

  const handlePublishCourse = (id: number) => {
    const updated = coursesList.map(c => c.id === id ? { ...c, status: '已发布' } : c);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('课程已发布');
  };

  const handleCancelPublishCourse = (id: number) => {
    const updated = coursesList.map(c => c.id === id ? { ...c, status: '草稿' } : c);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('已取消发布课程');
  };

  const handleDeleteCourse = (id: number) => {
    const updated = coursesList.filter(c => c.id !== id);
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('删除课程成功');
  };

  const handleCopyCourse = (course: any) => {
    const newCourse = {
      ...course,
      id: Date.now(),
      name: `${course.name} (复制)`,
      code: `AI-${Math.floor(100 + Math.random() * 900)}-2026`,
      scope: '私有',
      status: '草稿',
      auditStatus: '待审核',
    };
    const updated = [newCourse, ...coursesList];
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('复制课程成功');
  };

  const handleSaveCourse = () => {
    if (!courseFormName.trim()) {
      showToast('请输入课程名称', 'error');
      return;
    }
    if (courseModalMode === 'create') {
      const newCourse = {
        id: Date.now(),
        name: courseFormName,
        code: `AI-${Math.floor(100 + Math.random() * 900)}-2026`,
        desc: courseFormDesc,
        teacher: '张老师',
        ta: '-',
        scope: '私有',
        status: '草稿',
        auditStatus: '待审核',
        image: selectedCover || defaultCovers[0],
        state: 'active',
        major: courseFormMajor || '人工智能',
        tags: courseFormTags || '必修, 核心课程'
      };
      const updated = [newCourse, ...coursesList];
      setCoursesList(updated);
      localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
      showToast('创建课程成功');
    } else {
      const updated = coursesList.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            name: courseFormName,
            desc: courseFormDesc,
            image: selectedCover,
            major: courseFormMajor,
            tags: courseFormTags
          };
        }
        return c;
      });
      setCoursesList(updated);
      localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
      showToast('修改课程成功');
    }
    setIsCourseModalOpen(false);
  };

  const handleApplyPublic = () => {
    if (!applyReason.trim()) {
      showToast('请填写申请说明', 'error');
      return;
    }
    const updated = coursesList.map(c => {
      if (c.id === applyPublicCourse.id) {
        return {
          ...c,
          scope: applyRange,
          auditStatus: '待审核'
        };
      }
      return c;
    });
    setCoursesList(updated);
    localStorage.setItem('zhiyun_courses', JSON.stringify(updated));
    showToast('提交申请成功，等待超管审核');
    setIsApplyPublicModalOpen(false);
  };

  const filteredCourses = coursesList.filter(c => {
    const query = courseSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
  });

  return (
    <div className="-m-6 p-6 bg-gradient-to-b from-[#ffe2d1] via-[#fff8f5] to-[#ffffff] min-h-full space-y-8 pb-12 relative flex-1">
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
      <div className="relative bg-gradient-to-r from-[#fa541c] via-[#ff7a45] to-[#fa541c] rounded-2xl overflow-hidden shadow-lg group h-auto md:h-[165px]">
        
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
          <div className="p-5 md:py-6 md:pl-10 w-full flex flex-col justify-center">
            {/* Bold slanted Title */}
            <div className="transform -skew-x-12 origin-left mb-2 flex flex-wrap items-end gap-3 md:gap-5">
              <h1 className="text-2xl md:text-[30px] font-black text-white leading-none drop-shadow-[2px_3px_0px_rgba(212,56,13,0.5)] italic tracking-wider">
                欢迎回来，张老师
              </h1>
              <h2 className="text-lg md:text-[22px] font-bold text-white/90 leading-none drop-shadow-[1px_2px_0px_rgba(212,56,13,0.5)] italic tracking-wide">
                智云实战教学空间
              </h2>
            </div>
            
            {/* White highlighted Subtitle */}
            <div className="transform -skew-x-12 origin-left mb-2 inline-block max-w-max">
              <div className="bg-gradient-to-r from-white via-white to-transparent text-[#fa541c] text-xs md:text-sm font-black pl-6 pr-12 py-1 md:py-1.5">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {teachingTools.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (tool.path !== '#') {
                  navigate(tool.path);
                } else {
                  showToast(`"${tool.title}" 功能模块正在升级配置中...`);
                }
              }}
              className={cn(
                "p-5 rounded-2xl border flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group bg-white",
                tool.bgGradient,
                tool.borderClass,
                tool.shadowColor
              )}
            >
              {/* Microsoft Glassmorphism Icon container */}
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-white/90 border border-white shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.85)] overflow-hidden group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {/* Visual refraction element - blurry backing sphere */}
                <div className={cn("absolute inset-2 blur-[3px] rounded-full opacity-20 pointer-events-none", tool.iconBg)}></div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/60 blur-[1px] pointer-events-none"></div>
                <tool.icon className={cn("w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.08)] relative z-10", tool.iconTextColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-bold text-sm tracking-wide truncate group-hover:text-[#fa541c] transition-colors", tool.titleColor)}>{tool.title}</h4>
                <p className={cn("text-[11px] mt-0.5 leading-tight truncate", tool.descColor)}>{tool.desc}</p>
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
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  value={courseSearchQuery}
                  onChange={(e) => setCourseSearchQuery(e.target.value)}
                  placeholder="搜索课程名称/代码" 
                  className="pl-9 pr-4 py-2 text-sm border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] w-64 transition-all"
                />
              </div>
              <Button 
                onClick={() => { 
                  setEditingCourse(null); 
                  setCourseFormName('');
                  setCourseFormMajor('');
                  setCourseFormTags('');
                  setCourseFormDesc('');
                  setSelectedCover(defaultCovers[0]); 
                  setCourseModalMode('create'); 
                  setIsCourseModalOpen(true); 
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> 新建课程
              </Button>
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
                        {course.scope === '平台' ? (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[12px] border border-orange-200 font-medium">{course.scope}</span>
                        ) : course.scope === '租户' ? (
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[12px] border border-indigo-200 font-medium">{course.scope}</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[12px] border border-neutral-200 font-medium">{course.scope}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-0.5 text-[12px] rounded border font-medium", course.status === '已发布' ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-rose-50 text-rose-600 border-rose-200")}>
                          {course.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {course.auditStatus === '已通过' && (
                          <span className="text-emerald-600 font-medium">已通过</span>
                        )}
                        {course.auditStatus === '待审核' && (
                          <span className="text-[#fa541c] font-medium">待审核</span>
                        )}
                        {course.auditStatus === '已驳回' && (
                          <span className="text-rose-600 font-medium">已驳回</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => navigate(`/teacher/course/${course.id}`)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">查看</button>
                          <button 
                            onClick={() => {
                              if (course.scope === '租户' || course.scope === '平台') return;
                              setEditingCourse(course);
                              setCourseFormName(course.name);
                              setCourseFormMajor(course.major || '人工智能');
                              setCourseFormTags(course.tags || '必修, 核心课程');
                              setCourseFormDesc(course.desc);
                              setSelectedCover(course.image);
                              setCourseModalMode('edit');
                              setIsCourseModalOpen(true);
                            }} 
                            disabled={course.scope === '租户' || course.scope === '平台'}
                            className={cn(
                              "transition-colors",
                              (course.scope === '租户' || course.scope === '平台') 
                                ? "text-neutral-400 cursor-not-allowed" 
                                : "text-[#fa541c] hover:text-[#e84a15]"
                            )}
                          >
                            编辑
                          </button>
                          {course.status === '草稿' ? (
                            <button onClick={() => handlePublishCourse(course.id)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">发布</button>
                          ) : (
                            <button onClick={() => handleCancelPublishCourse(course.id)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">取消发布</button>
                          )}
                          {course.scope === '私有' && (
                            <button 
                              onClick={() => {
                                setApplyPublicCourse(course);
                                setApplyReason('');
                                setApplyRange('租户');
                                setIsApplyPublicModalOpen(true);
                              }} 
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors"
                            >
                              申请公开
                            </button>
                          )}
                          <button onClick={() => handleCopyCourse(course)} className="text-[#fa541c] hover:text-[#e84a15] transition-colors">复制</button>
                          <button 
                            onClick={() => {
                              if (course.scope === '租户' || course.scope === '平台') return;
                              if (confirm(`确定要删除课程 "${course.name}" 吗？`)) {
                                handleDeleteCourse(course.id);
                              }
                            }}
                            disabled={course.scope === '租户' || course.scope === '平台'}
                            className={cn(
                              "transition-colors",
                              (course.scope === '租户' || course.scope === '平台') 
                                ? "text-neutral-400 cursor-not-allowed" 
                                : "text-[#fa541c] hover:text-[#e84a15]"
                            )}
                          >
                            删除
                          </button>
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
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    value={courseFormName}
                    onChange={(e) => setCourseFormName(e.target.value)}
                    placeholder="请输入课程名称" 
                    autoFocus={courseModalMode === 'create'} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 专业方向
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    value={courseFormMajor}
                    onChange={(e) => setCourseFormMajor(e.target.value)}
                    placeholder="请输入专业方向" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 标签
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                  value={courseFormTags}
                  onChange={(e) => setCourseFormTags(e.target.value)}
                  placeholder="请输入标签，用逗号分隔" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                  <span className="text-[#fa541c]">*</span> 课程简介
                </label>
                <textarea 
                  className="w-full min-h-[80px] border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none" 
                  value={courseFormDesc}
                  onChange={(e) => setCourseFormDesc(e.target.value)}
                  placeholder="请输入课程简介"
                ></textarea>
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
              <Button onClick={handleSaveCourse} className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">
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
                <span>申请公开后，课程需经过超管审核。审核通过将加入对应范围的公共课程库，相应师生可见可用。</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700 block mb-2">
                  <span className="text-[#fa541c]">*</span> 申请范围
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setApplyRange('租户')}
                    className={cn(
                      "flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all text-[14px]",
                      applyRange === '租户' 
                        ? "border-[#fa541c] bg-orange-50/30 text-[#fa541c] font-bold" 
                        : "border-neutral-200 hover:border-[#fa541c]/30 text-neutral-600 bg-white"
                    )}
                  >
                    租户
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyRange('平台')}
                    className={cn(
                      "flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all text-[14px]",
                      applyRange === '平台' 
                        ? "border-[#fa541c] bg-orange-50/30 text-[#fa541c] font-bold" 
                        : "border-neutral-200 hover:border-[#fa541c]/30 text-neutral-600 bg-white"
                    )}
                  >
                    平台
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-bold text-neutral-700 block mb-2">
                  <span className="text-[#fa541c]">*</span> 申请说明
                </label>
                <textarea 
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                  placeholder="请简述申请公开该课程的理由或推荐使用场景..." 
                  className="w-full h-28 border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-end gap-3">
              <Button onClick={() => setIsApplyPublicModalOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 rounded-full text-[13px]">
                取消
              </Button>
              <Button 
                onClick={handleApplyPublic} 
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
