import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart2, BookOpen, Users, 
  Download, Plus, Search, FileText, CheckCircle, 
  Clock, MoreVertical, Settings, BarChart, Copy,
  ChevronDown, ChevronUp, PlusCircle, Paperclip, MonitorPlay, Code, CheckSquare, Calendar, TrendingUp, PieChart, Edit, Award, ChevronRight, X, Trash2, Info, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CourseDetail from '@/components/CourseDetail';
import TeacherPPTEditor from '@/components/TeacherPPTEditor';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as BarChartRecharts, Bar } from 'recharts';

const COURSE_SYLLABUS = [
  {
    chapter: "第一课",
    title: "人工智能训练师三级考试内容指导",
    lessons: [
      { section: "课时1:", title: "职业简介", type: "doc" },
      { section: "课时2:", title: "认定方案", type: "doc" },
      { section: "课时3:", title: "认定要素细目表", type: "doc" },
      { section: "课时4:", title: "实操平台演示", type: "doc" },
      { section: "课时5:", title: "代码复习讲义", type: "doc" }
    ]
  },
  {
    chapter: "第二课",
    title: "培训与指导",
    lessons: [
      { section: "课时1:", title: "线性回归实训：预测考试分数", type: "experiment" },
      { section: "课时2:", title: "互动学习课件案例演示demo", type: "split_doc" },
      { section: "课时3:", title: "智能健康手环的数据分析与优化[3.1.3]", type: "experiment" },
      { section: "课时4:", title: "智能健康监测系统的数据分析与优化[3.1.4]", type: "experiment" },
      { section: "课时5:", title: "智能家居环境控制系统的数据分析与优化[3.1.5]", type: "experiment" }
    ]
  }
];

const activityData = [
  { day: '周一', active: 420 },
  { day: '周二', active: 580 },
  { day: '周三', active: 510 },
  { day: '周四', active: 680 },
  { day: '周五', active: 850 },
  { day: '周六', active: 1020 },
  { day: '周日', active: 940 },
];

const scoreData = [
  { range: '<60', count: 12 },
  { range: '60-70', count: 35 },
  { range: '70-80', count: 85 },
  { range: '80-90', count: 120 },
  { range: '90-100', count: 48 },
];

export default function TeacherCourseManage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('editor');
  const [perspective, setPerspective] = useState<'teacher' | 'student'>('teacher');
  const [showPerspectiveDropdown, setShowPerspectiveDropdown] = useState(false);
  const [editorSubTab, setEditorSubTab] = useState<'directory' | 'assignments'>('directory');
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{title: string, type: string} | null>(null);
  const [showGrading, setShowGrading] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showSelectPaperModal, setShowSelectPaperModal] = useState(false);
  const [selectedPaperName, setSelectedPaperName] = useState("");
  const [expandedPaper, setExpandedPaper] = useState<string | null>("人工智能通讯课-期末考试");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showScoringRulesModal, setShowScoringRulesModal] = useState(false);
  const [showCreateChapterDrawer, setShowCreateChapterDrawer] = useState(false);
  const [addMenuOpenIndex, setAddMenuOpenIndex] = useState<number | null>(null);
  const [showTeachingMaterialModal, setShowTeachingMaterialModal] = useState(false);
  const [showExperimentMaterialModal, setShowExperimentMaterialModal] = useState(false);
  const [showInteractiveMaterialModal, setShowInteractiveMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedExperimentIndex, setSelectedExperimentIndex] = useState<number | null>(null);
  const [isSearchingExperiment, setIsSearchingExperiment] = useState(false);
  const [chapterMenuOpenIndex, setChapterMenuOpenIndex] = useState<number | null>(null);
  const [showEditChapterDrawer, setShowEditChapterDrawer] = useState(false);
  const [showDeleteChapterModal, setShowDeleteChapterModal] = useState(false);
  const [lessonMenuOpenIndex, setLessonMenuOpenIndex] = useState<string | null>(null);
  const [showEditLessonDrawer, setShowEditLessonDrawer] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedEditLesson, setSelectedEditLesson] = useState<{ chapterIndex: number, lessonIndex: number, title: string, section: string } | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(true);
  // Members Management states
  const [studentList, setStudentList] = useState([
    { username: 'lilun1982', nickname: '理论1982', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1983', nickname: '理论1983', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1984', nickname: '理论1984', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1985', nickname: '理论1985', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1986', nickname: '理论1986', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1987', nickname: '理论1987', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1988', nickname: '理论1988', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1989', nickname: '理论1989', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1990', nickname: '理论1990', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1991', nickname: '理论1991', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1992', nickname: '理论1992', group: '0523', authTime: '2026-06-11 16:23:12' },
    { username: 'lilun1993', nickname: '理论1993', group: '0523', authTime: '2026-06-11 16:23:12' }
  ]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteActiveTab, setInviteActiveTab] = useState<'link' | 'manual'>('link');

  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [importSelectedFile, setImportSelectedFile] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Export Analytics Report states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDimension, setExportDimension] = useState("all");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportCompleted, setExportCompleted] = useState(false);

  const [exportColumns, setExportColumns] = useState({
    info: true,
    progress: true,
    scores: true,
    active: true
  });

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    showCancel: boolean;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    showCancel: true,
    onConfirm: () => {}
  });

  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState('');
  const [assignments, setAssignments] = useState([
    { id: 1, title: '模块 1 综合测验：Python 基础', paperName: 'Python 基础语法与核心库测试', publishTime: '2026-05-10 12:00', deadline: '2026-05-20 23:59', submitCount: 45, totalCount: 50, avgScore: 88.5, toGrade: 12, rejected: 2 },
    { id: 2, title: '模块 2 实战作业：爬虫数据分析', paperName: '爬虫与 Pandas 数据处理大作业', publishTime: '2026-05-25 08:30', deadline: '2026-06-05 23:59', submitCount: 15, totalCount: 50, avgScore: '-', toGrade: 15, rejected: 0 },
    { id: 3, title: '模块 3 实战作业：搭建 AI 聊天助手智能体', paperName: 'AI 聊天助手开发与集成测验', publishTime: '2026-06-01 09:00', deadline: '2026-06-15 23:59', submitCount: 38, totalCount: 50, avgScore: 92.0, toGrade: 0, rejected: 1 },
    { id: 4, title: '模块 4 综合大作业：基于 ANN 算法的图像分类实践', paperName: '人工神经网络与图像分类期末考核', publishTime: '2026-06-10 10:00', deadline: '2026-06-25 23:59', submitCount: 12, totalCount: 50, avgScore: '-', toGrade: 12, rejected: 0 },
    { id: 5, title: '模块 5 实战作业：机器学习预测房价', paperName: '线性回归与房价预测实训考核', publishTime: '2026-06-12 14:00', deadline: '2026-06-20 23:59', submitCount: 42, totalCount: 50, avgScore: 85.6, toGrade: 0, rejected: 0 }
  ]);
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPublishTime, setTaskPublishTime] = useState('2026-05-21T14:29');
  const [taskDeadline, setTaskDeadline] = useState('');
  
  const [assignmentPage, setAssignmentPage] = useState(1);
  const [assignmentPageSize, setAssignmentPageSize] = useState(5); // default 5 items per page so pagination is visible
  const [isPageSizeDropdownOpen, setIsPageSizeDropdownOpen] = useState(false);

  const [showBulkRevokeModal, setShowBulkRevokeModal] = useState(false);
  const [showBulkAuthModal, setShowBulkAuthModal] = useState(false);

  React.useEffect(() => {
    if (selectedPaperName && !editingAssignmentId) {
      setTaskTitle(selectedPaperName);
    }
  }, [selectedPaperName, editingAssignmentId]);

  React.useEffect(() => {
    setAssignmentPage(1);
  }, [assignmentSearchQuery]);

  const filteredAssignments = assignments.filter(task => 
    task.title.toLowerCase().includes(assignmentSearchQuery.toLowerCase()) ||
    task.paperName.toLowerCase().includes(assignmentSearchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAssignments.length / assignmentPageSize) || 1;
  const paginatedAssignments = filteredAssignments.slice(
    (assignmentPage - 1) * assignmentPageSize,
    assignmentPage * assignmentPageSize
  );

  const handleBatchAuthorize = () => {
    setShowBulkAuthModal(true);
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportCompleted(false);

    // Simulate progress counting up
    let current = 0;
    const timer = setInterval(() => {
      current += 10;
      setExportProgress(current);
      if (current >= 100) {
        clearInterval(timer);
        setIsExporting(false);
        setExportCompleted(true);
      }
    }, 200);
  };

  const handleRevokeAuth = (username: string) => {
    setConfirmModal({
      show: true,
      title: '提示',
      message: `确定要解除对用户 "${username}" 的授权吗？`,
      showCancel: true,
      onConfirm: () => {
        setStudentList(studentList.filter(s => s.username !== username));
        setSelectedStudents(selectedStudents.filter(uname => uname !== username));
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  };

  const handleBatchRevokeAuth = () => {
    if (selectedStudents.length === 0) {
      setConfirmModal({
        show: true,
        title: '提示',
        message: '请先选择要解除授权的用户！',
        showCancel: false,
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      });
      return;
    }
    setShowBulkRevokeModal(true);
  };

  const toggleSelectStudent = (username: string) => {
    if (selectedStudents.includes(username)) {
      setSelectedStudents(selectedStudents.filter(uname => uname !== username));
    } else {
      setSelectedStudents([...selectedStudents, username]);
    }
  };

  const toggleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(studentList.map(s => s.username));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSendInvite = () => {
    if (!inviteInput.trim()) return;
    const newStudent = { username: 'sunshen', nickname: '孙晨 (已邀请)', group: '0523', authTime: '2026-06-11 16:45:00' };
    setStudentList([...studentList, newStudent]);
    setShowInviteModal(false);
    setInviteInput("");
    alert("邀请发送成功！已将孙晨加入邀请列表。");
  };

  const handleMockUploadFile = () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportSelectedFile("2026级AI实训班名单.xlsx");
    
    // Simulate progression
    let current = 0;
    const timer = setInterval(() => {
      current += 20;
      setImportProgress(current);
      if (current >= 100) {
        clearInterval(timer);
        setIsImporting(false);
      }
    }, 150);
  };

  const handleConfirmBatchAuthorize = () => {
    const newStudents = [
      { username: 'lilun1994', nickname: '理论1994', group: '0523', authTime: '2026-06-11 16:45:00' },
      { username: 'lilun1995', nickname: '理论1995', group: '0523', authTime: '2026-06-11 16:45:00' },
      { username: 'lilun1996', nickname: '理论1996', group: '0523', authTime: '2026-06-11 16:45:00' }
    ];
    setStudentList([...studentList, ...newStudents]);
    setShowBatchImportModal(false);
    setImportSelectedFile(null);
    setImportProgress(0);
    alert("成功批量授权 3 名用户！");
  };

  const tabs = [
    { id: 'editor', label: '课程章节', icon: BookOpen },
    { id: 'assignments', label: '作业配置', icon: FileText },
    { id: 'members', label: '成员管理', icon: Users },
    { id: 'analytics', label: '学情数据', icon: BarChart2 },
  ];

  if (showCourseDetail) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#f5f6f8] -mt-6 -mx-6 md:-mx-8 overflow-hidden">
        <TeacherPPTEditor courseSyllabus={COURSE_SYLLABUS} initialLesson={selectedLesson} onClose={() => setShowCourseDetail(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f5f7fa] -mt-6 -mx-6 md:-mx-8 overflow-hidden">
      {/* Top Header */}
      <div className="h-14 bg-white flex items-center justify-between px-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative z-30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[#262626] font-medium hover:text-[#fa541c] transition-colors rounded-[4px]">
          <ArrowLeft className="w-4 h-4" /> 人工智能基础与实践
        </button>

        {/* Perspective Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <span className="text-[14px]">视角:</span>
            <HelpCircle className="w-4 h-4 cursor-pointer hover:text-neutral-700 transition-colors" title="切换视角可以预览不同角色下的页面展示效果" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowPerspectiveDropdown(!showPerspectiveDropdown)}
              className={cn(
                "h-9 px-3 w-[120px] bg-white border rounded-[4px] flex items-center justify-between transition-all duration-150 text-[14px] text-neutral-700 font-medium select-none",
                showPerspectiveDropdown 
                  ? "border-[#fa541c] shadow-[0_0_0_2px_rgba(250,84,28,0.15)] text-[#fa541c]" 
                  : "border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c]"
              )}
            >
              <span>{perspective === 'teacher' ? '开课老师' : '学生'}</span>
              {showPerspectiveDropdown ? (
                <ChevronUp className="w-4 h-4 text-[#fa541c]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            
            {showPerspectiveDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPerspectiveDropdown(false)}></div>
                <div className="absolute right-0 top-full mt-1.5 w-[120px] bg-white rounded-lg border border-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div 
                    onClick={() => {
                      setPerspective('teacher');
                      setShowPerspectiveDropdown(false);
                    }}
                    className={cn(
                      "px-3 py-2 text-[14px] cursor-pointer transition-colors font-medium text-left",
                      perspective === 'teacher' 
                        ? "bg-[#fff2e8] text-[#fa541c]" 
                        : "text-neutral-700 hover:bg-[#fff2e8] hover:text-[#fa541c]"
                    )}
                  >
                    开课老师
                  </div>
                  <div 
                    onClick={() => {
                      setPerspective('student');
                      setActiveTab('editor');
                      setShowPerspectiveDropdown(false);
                    }}
                    className={cn(
                      "px-3 py-2 text-[14px] cursor-pointer transition-colors font-medium text-left",
                      perspective === 'student' 
                        ? "bg-[#fff2e8] text-[#fa541c]" 
                        : "text-neutral-700 hover:bg-[#fff2e8] hover:text-[#fa541c]"
                    )}
                  >
                    学生
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {perspective === 'student' && (
        <div className="mx-6 mt-4 bg-orange-50 border border-orange-200 text-[#fa541c] px-4 py-3 rounded-lg flex items-center gap-3 text-[14px] font-medium shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 relative z-20">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>您当前正在以「学生视角」预览此页面。页面中的所有编辑、删除、课件添加及管理操作已自动隐藏。</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar Menu */}
        {perspective === 'teacher' && (
          <div className="w-[100px] bg-white border-r border-neutral-border/60 flex flex-col py-4 flex-shrink-0 z-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-4 w-full transition-colors relative rounded-[4px]",
                  activeTab === tab.id 
                    ? "text-[#fa541c]" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-title"
                )}
              >
                {activeTab === tab.id && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fa541c]"></div>
                )}
                <tab.icon className="w-6 h-6 mb-2" strokeWidth={1.5} />
                <span className="text-[13px] font-medium tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          
          {/* Hero Header Area */}
          {activeTab === 'editor' && (
            <div className="bg-gradient-to-r from-[#fff2e8] via-[#fff7f2] to-blue-50/50 h-[300px] w-full pt-10 px-6 lg:px-10">
              <div className="flex items-center gap-10 w-full">
                {/* Course Cover Card */}
                <div className="w-[360px] h-[200px] bg-gradient-to-br from-[#40a9ff] to-[#096dd9] rounded-xl shadow-lg relative overflow-hidden flex flex-col items-center justify-center group">
                   {/* This makes the cover match the image reference (blue card), but we can make it orange if preferred. 
                       The prompt says "主题色为橙色" (Theme color is orange), so let's make the card orange. */}
                   <div className="absolute inset-0 bg-gradient-to-br from-[#fa541c] to-[#ff7a45]"></div>
                   
                   <div className="absolute top-0 right-0 bg-[#52c41a] text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-20">
                     教学实训
                   </div>
                   
                   {/* decorative hexes background */}
                   <div className="absolute right-[-30px] bottom-[-30px] opacity-20 z-10 group-hover:scale-110 transition-transform duration-700">
                     <svg width="150" height="150" viewBox="0 0 100 100">
                       <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="1.5"/>
                       <polygon points="50 20 75 35 75 65 50 80 25 65 25 35" fill="none" stroke="white" strokeWidth="1"/>
                     </svg>
                   </div>
                   <div className="absolute left-[-20px] top-[-20px] opacity-10 z-10">
                     <svg width="100" height="100" viewBox="0 0 100 100">
                       <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="2"/>
                     </svg>
                   </div>
                   
                   <h2 className="text-3xl font-bold text-white tracking-widest relative z-20 drop-shadow-md">人工智能基础与实践</h2>
                </div>
                
                {/* Course Info */}
                <div>
                  <h1 className="text-3xl font-bold text-neutral-title mb-4">人工智能基础与实践</h1>
                  <div className="flex items-center gap-3 text-[13px] text-neutral-500 mb-6 font-medium">
                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-white/40 shadow-sm text-neutral-600">
                      <BookOpen className="w-3.5 h-3.5 text-[#fa541c]"/> 4 章节 | 18 课节
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-white/40 shadow-sm text-neutral-600">
                      课程编号: AI20261014 <Copy className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-[#fa541c] transition-colors"/>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Main Content Card */}
          <div className={cn("w-full relative z-20 pb-8 px-4", activeTab === 'editor' ? "-mt-8" : "pt-4")}>
            <div className={cn("bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border border-neutral-border/50 min-h-[500px]", activeTab === 'editor' ? "rounded-t-[24px]" : "rounded-[24px]")}>
              
              {/* 1. 课程章节 (Course Chapters - like the screenshot) */}
              {activeTab === 'editor' && (
                <div className="animate-in fade-in duration-500">
                  {/* Top Inner Tabs */}
                  <div className="flex items-center justify-between border-b border-neutral-border px-8 pt-4">
                     <div className="flex gap-8">
                       <button onClick={() => setEditorSubTab('directory')} className={cn("pb-4 text-[15px] relative bottom-[-1px] rounded-[4px]", editorSubTab === 'directory' ? "font-bold text-[#fa541c] border-b-2 border-[#fa541c]" : "font-medium text-neutral-500 hover:text-neutral-title transition-colors border-b-2 border-transparent")}>课程目录</button>
                       <button onClick={() => setEditorSubTab('assignments')} className={cn("pb-4 text-[15px] relative bottom-[-1px] rounded-[4px]", editorSubTab === 'assignments' ? "font-bold text-[#fa541c] border-b-2 border-[#fa541c]" : "font-medium text-neutral-500 hover:text-neutral-title transition-colors border-b-2 border-transparent")}>课程作业</button>
                     </div>
                     <div className="flex items-center gap-4 pb-3">
                       <Button variant="outline" size="sm" onClick={() => setShowCreateChapterDrawer(true)} className="h-8 text-[#fa541c] border-[#fa541c] bg-transparent hover:bg-[#fa541c] hover:text-white rounded-[4px] flex items-center gap-1.5 transition-colors">
                         <PlusCircle className="w-3.5 h-3.5" /> 新建章节
                       </Button>
                        <button 
                          onClick={() => {
                            const nextState = !allExpanded;
                            setAllExpanded(nextState);
                            const nextCollapsed: Record<number, boolean> = {};
                            COURSE_SYLLABUS.forEach((_, idx) => {
                              nextCollapsed[idx] = !nextState;
                            });
                            setCollapsedChapters(nextCollapsed);
                          }}
                          className="text-sm text-[#fa541c] flex items-center gap-1 hover:opacity-80 font-bold transition-opacity rounded-[4px]"
                        >
                          {allExpanded ? '收起' : '展开'}
                          {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>

                  {/* Chapter List Area */}
                  <div className={cn("p-6 space-y-4", editorSubTab === 'directory' ? "block" : "hidden")}>
                    {COURSE_SYLLABUS.map((chapter, i) => {
                      const isCollapsed = collapsedChapters[i];
                      const hasMenuOpen = addMenuOpenIndex === i || chapterMenuOpenIndex === i || (lessonMenuOpenIndex ? lessonMenuOpenIndex.startsWith(`${i}-`) : false);
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            "rounded-[4px] bg-neutral-50 border border-neutral-100 relative transition-all duration-200",
                            hasMenuOpen ? "z-20 shadow-md" : "z-10"
                          )}
                        >
                          <div 
                            onClick={() => setCollapsedChapters(prev => ({ ...prev, [i]: !prev[i] }))}
                            className={cn(
                              "flex items-center justify-between px-6 py-4 bg-neutral-100/50 cursor-pointer select-none hover:bg-neutral-100/70 transition-colors",
                              isCollapsed ? "rounded-[4px]" : "rounded-t-lg"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-bold text-neutral-title">{chapter.chapter} {chapter.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                              {perspective === 'teacher' && (
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                  <PlusCircle 
                                    className="w-5 h-5 cursor-pointer hover:text-[#fa541c] transition-colors" 
                                    onClick={() => setAddMenuOpenIndex(addMenuOpenIndex === i ? null : i)}
                                  />
                                  {addMenuOpenIndex === i && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={() => setAddMenuOpenIndex(null)}></div>
                                      <div className="absolute right-0 top-8 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up">
                                        {[
                                          { title: '教学课件', desc: '支持图文、PPT 文档、视频等', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', action: () => {setShowTeachingMaterialModal(true); setAddMenuOpenIndex(null);} },
                                          { title: '实验课件', desc: '通过 notebook 制作实训课件', icon: Code, color: 'text-orange-500', bg: 'bg-orange-50', action: () => {setShowExperimentMaterialModal(true); setAddMenuOpenIndex(null);} },
                                          { title: '互动学习课件', desc: '知识点分段讲解视频融合实操', icon: MonitorPlay, color: 'text-blue-500', bg: 'bg-blue-50', action: () => {setShowInteractiveMaterialModal(true); setAddMenuOpenIndex(null);} }
                                        ].map((item, idx) => (
                                          <div key={idx} onClick={item.action} className="flex items-start gap-3 p-2.5 rounded-[4px] hover:bg-neutral-50 cursor-pointer transition-colors group">
                                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", item.bg, item.color)}>
                                              <item.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                              <div className="text-[14px] font-bold text-neutral-800 mb-0.5 group-hover:text-[#fa541c] transition-colors text-left">{item.title}</div>
                                              <div className="text-[11px] text-neutral-400 text-left">{item.desc}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {perspective === 'teacher' && (
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical 
                                    className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setChapterMenuOpenIndex(chapterMenuOpenIndex === i ? null : i);
                                    }}
                                  />
                                  {chapterMenuOpenIndex === i && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setChapterMenuOpenIndex(null); }}></div>
                                      <div className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up flex flex-col gap-1">
                                        <div 
                                          className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-[4px] text-center transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowEditChapterDrawer(true);
                                            setChapterMenuOpenIndex(null);
                                          }}
                                        >编辑</div>
                                        <div 
                                          className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-[4px] text-center transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteChapterModal(true);
                                            setChapterMenuOpenIndex(null);
                                          }}
                                        >删除</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              {isCollapsed ? <ChevronDown className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" /> : <ChevronUp className="w-5 h-5 cursor-pointer hover:text-neutral-600 transition-colors" />}
                            </div>
                          </div>
                          {!isCollapsed && (
                            <div className="bg-white rounded-b-lg">
                              {chapter.lessons.map((lesson, idx) => {
                                const isLast = idx === chapter.lessons.length - 1;
                                return (
                                  <div 
                                    key={idx} 
                                    onClick={() => {
                                      setSelectedLesson({ title: lesson.title, type: lesson.type });
                                      setShowCourseDetail(true);
                                    }} 
                                    className={cn(
                                      "cursor-pointer flex items-center justify-between px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50 group border-l-2 border-l-transparent hover:border-l-[#fa541c] transition-colors",
                                      isLast && "rounded-b-lg border-b-0"
                                    )}
                                  >
                                    <div className="flex items-center gap-6">
                                      <span className="text-[14px] text-neutral-body w-12">{lesson.section}</span>
                                      <div className="flex items-center gap-3">
                                        <div className={cn(
                                          "w-6 h-6 rounded flex items-center justify-center",
                                          lesson.type === 'split_doc' ? "bg-blue-50 text-blue-500" : 
                                          lesson.type === 'experiment' ? "bg-orange-50 text-[#fa541c]" :
                                          lesson.type === 'assignment' ? "bg-rose-50 text-rose-500" :
                                          "bg-emerald-50 text-emerald-500"
                                        )}>
                                          {lesson.type === 'split_doc' ? <MonitorPlay className="w-3.5 h-3.5" /> : 
                                           lesson.type === 'experiment' ? <Code className="w-3.5 h-3.5" /> :
                                           lesson.type === 'assignment' ? <CheckSquare className="w-3.5 h-3.5" /> :
                                           <FileText className="w-3.5 h-3.5" />
                                          }
                                        </div>
                                        <span className="text-sm font-medium text-neutral-title group-hover:text-[#fa541c] transition-colors">{lesson.title}</span>
                                      </div>
                                    </div>
                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                      {perspective === 'teacher' && (
                                        <>
                                          <MoreVertical 
                                            className={cn(
                                              "w-4 h-4 cursor-pointer transition-all", 
                                              lessonMenuOpenIndex === `${i}-${idx}` 
                                                ? "text-[#fa541c] opacity-100 scale-110" 
                                                : "text-neutral-300 group-hover:text-neutral-500 opacity-0 group-hover:opacity-100"
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setLessonMenuOpenIndex(lessonMenuOpenIndex === `${i}-${idx}` ? null : `${i}-${idx}`);
                                            }}
                                          />
                                          {lessonMenuOpenIndex === `${i}-${idx}` && (
                                            <>
                                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setLessonMenuOpenIndex(null); }}></div>
                                              <div className="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 z-50 p-2 animation-slide-up flex flex-col gap-1">
                                                <div 
                                                  className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-[4px] text-center transition-colors"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEditLesson({ chapterIndex: i, lessonIndex: idx, title: lesson.title, section: lesson.section });
                                                    setShowEditLessonDrawer(true);
                                                    setLessonMenuOpenIndex(null);
                                                  }}
                                                >编辑</div>
                                                <div 
                                                  className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[#fa541c] cursor-pointer rounded-[4px] text-center transition-colors"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEditLesson({ chapterIndex: i, lessonIndex: idx, title: lesson.title, section: lesson.section });
                                                    setShowDeleteLessonModal(true);
                                                    setLessonMenuOpenIndex(null);
                                                  }}
                                                >删除</div>
                                              </div>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Assignment List Area */}
                  <div className={cn("p-6 space-y-6", editorSubTab === 'assignments' ? "block" : "hidden")}>
                    {/* Assignment 1 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 bg-neutral-100/50 border-b border-neutral-100">
                        <h3 className="text-[16px] font-bold text-neutral-800">1. 人工智能通讯作业</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-6">
                          <FileText className="w-5 h-5 text-[#fa541c] mt-0.5" />
                          <h4 className="text-[15px] font-bold text-neutral-900">客观题</h4>
                        </div>
                        
                        <div className="pl-8 space-y-6">
                          <div>
                            <h5 className="text-[14px] font-bold text-neutral-800 mb-2">1. 客观题 18 道，共 100 分</h5>
                            <p className="text-[12px] text-neutral-400">客观题包括单选题、多选题、判断题、填空题、简答题、思考题、编程题</p>
                          </div>
                          
                          <div>
                            <h5 className="text-[14px] font-bold text-neutral-800 mb-2">2. 答题限时: 90 分钟</h5>
                            <p className="text-[12px] text-neutral-400">客观题需在 90 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</p>
                          </div>
                          
                          <Button onClick={() => navigate(`/teacher/course/${id}/assignment-preview`)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm shadow-orange-500/20 px-6 h-9 font-bold mt-2">
                            预览作业
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Assignment 2 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-5 bg-neutral-100/50">
                        <h3 className="text-[15px] font-bold text-neutral-700">2. 搭建 AI 聊天助手智能体作业</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                    </div>
                    
                    {/* Assignment 3 */}
                    <div className="rounded-xl bg-neutral-50/50 border border-neutral-100 overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-5 bg-neutral-100/50">
                        <h3 className="text-[15px] font-bold text-neutral-700">3. 实验报告 (理工类): 基于人工神经网络算法的图像分类实践</h3>
                        <span className="text-[13px] text-neutral-400">截止时间: 2099/02/28 00:00:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 作业配置 (Assignments) */}
              {activeTab === 'assignments' && (
                <div className="p-6 lg:p-8 animate-in fade-in duration-500 bg-neutral-50/30 rounded-b-[24px]">
                  {!showGrading ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-neutral-title">作业配置</h2>
                      </div>

                      {/* Search & Buttons Toolbar */}
                      <div className="flex items-center justify-between mb-6 gap-4">
                        {/* Search Input on Left (matching Members page style) */}
                        <div className="flex items-center relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input 
                            type="text" 
                            placeholder="搜索作业名称或试卷名称..." 
                            className="pl-9 pr-4 py-2 w-[300px] text-sm border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-colors bg-white text-[#262626]" 
                            value={assignmentSearchQuery}
                            onChange={(e) => setAssignmentSearchQuery(e.target.value)}
                          />
                        </div>
                        
                        {/* Buttons on Right */}
                        <div className="flex items-center gap-3">
                          <Button 
                            onClick={() => navigate('/teacher/questions')} 
                            variant="outline" 
                            className="h-9 px-4 border-neutral-200 text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 hover:bg-orange-50 font-bold text-[13px] rounded-[4px] flex items-center gap-1.5 transition-all bg-white"
                          >
                            题目管理
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditingAssignmentId(null);
                              setSelectedPaperName('');
                              setTaskTitle('');
                              setTaskPublishTime('2026-05-21T14:29');
                              setTaskDeadline('');
                              setShowCreateTaskModal(true);
                            }} 
                            className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-4 shadow-sm shadow-orange-500/20 font-bold text-[13px] flex items-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> 新建作业
                          </Button>
                        </div>
                      </div>

                      {/* Assignments Table (matching Members page style) */}
                      <div className="bg-white rounded overflow-hidden border border-neutral-200 mb-6">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                                <th className="p-4 font-medium">作业名称</th>
                                <th className="p-4 font-medium">试卷名称</th>
                                <th className="p-4 font-medium">发布时间</th>
                                <th className="p-4 font-medium">截止时间</th>
                                <th className="p-4 font-medium text-left">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedAssignments.map((task) => (
                                <tr key={task.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                                  <td className="p-4 text-neutral-800">
                                    <div className="font-bold">{task.title}</div>
                                    <div className="text-[11px] text-neutral-400 mt-0.5">满分: 100</div>
                                  </td>
                                  <td className="p-4 text-neutral-600 font-medium">{task.paperName}</td>
                                  <td className="p-4 text-neutral-500">{task.publishTime}</td>
                                  <td className="p-4 text-neutral-500">{task.deadline}</td>
                                  <td className="p-4 text-left">
                                    <div className="flex items-center gap-3.5">
                                      <button 
                                        onClick={() => navigate(`/teacher/course/${id}/assignment-preview`)}
                                        className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors hover:underline cursor-pointer bg-transparent border-0"
                                      >
                                        详情
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setEditingAssignmentId(task.id);
                                          setSelectedPaperName(task.paperName);
                                          setTaskTitle(task.title);
                                          setTaskPublishTime(task.publishTime.replace(' ', 'T'));
                                          setTaskDeadline(task.deadline.replace(' ', 'T'));
                                          setShowEditTaskModal(true);
                                        }}
                                        className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors hover:underline cursor-pointer bg-transparent border-0"
                                      >
                                        编辑
                                      </button>
                                      <button 
                                        onClick={() => setShowGrading(true)}
                                        className="text-[#fa541c] hover:text-[#e84a15] font-semibold transition-colors hover:underline cursor-pointer bg-transparent border-0"
                                      >
                                        完成情况
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setConfirmModal({
                                            show: true,
                                            title: '提示',
                                            message: `确定要删除作业 "${task.title}" 吗？删除后不可恢复。`,
                                            showCancel: true,
                                            onConfirm: () => {
                                              setAssignments(prev => prev.filter(a => a.id !== task.id));
                                              setConfirmModal(prev => ({ ...prev, show: false }));
                                            }
                                          });
                                        }}
                                        className="text-red-500 hover:text-red-700 font-semibold transition-colors hover:underline cursor-pointer bg-transparent border-0"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {filteredAssignments.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-[13px] text-neutral-400">
                                    暂无匹配的作业数据
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pagination (matching TeacherHome course module style) */}
                      <div className="flex items-center justify-end p-4 gap-4 bg-transparent mt-2">
                          <span className="text-[13px] text-neutral-500">共 {filteredAssignments.length} 条</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 w-7 p-0 rounded-sm bg-white" 
                              disabled={assignmentPage === 1}
                              onClick={() => setAssignmentPage(prev => Math.max(prev - 1, 1))}
                            >
                              &lt;
                            </Button>
                            {Array.from({ length: totalPages }).map((_, index) => {
                              const pageNum = index + 1;
                              const isCurrent = pageNum === assignmentPage;
                              return (
                                <Button 
                                  key={pageNum}
                                  variant="outline" 
                                  size="sm" 
                                  className={cn(
                                    "h-7 w-7 p-0 rounded-sm font-semibold transition-colors",
                                    isCurrent 
                                      ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#e84a15] hover:text-white" 
                                      : "bg-white text-neutral-600 hover:text-[#fa541c] hover:border-orange-200"
                                  )}
                                  onClick={() => setAssignmentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 w-7 p-0 rounded-sm bg-white" 
                              disabled={assignmentPage === totalPages}
                              onClick={() => setAssignmentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                              &gt;
                            </Button>
                          </div>
                          <div className="relative">
                            <button 
                              type="button"
                              onClick={() => setIsPageSizeDropdownOpen(!isPageSizeDropdownOpen)}
                              className="appearance-none text-[13px] border border-neutral-200 rounded-[8px] pl-3 pr-8 py-1 bg-white focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/25 text-black cursor-pointer transition-all h-7 flex items-center gap-1.5 select-none text-left min-w-[76px] relative"
                            >
                              <span>{assignmentPageSize} 条/页</span>
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </button>
                            
                            {isPageSizeDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPageSizeDropdownOpen(false)}></div>
                                <div className="absolute right-0 bottom-8 z-50 w-24 bg-white border border-neutral-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[8px] py-1 overflow-hidden animation-slide-up flex flex-col">
                                  {[5, 10, 20, 50].map((size) => (
                                    <div
                                      key={size}
                                      onClick={() => {
                                        setAssignmentPageSize(size);
                                        setAssignmentPage(1);
                                        setIsPageSizeDropdownOpen(false);
                                      }}
                                      className={cn(
                                        "px-3 py-2 text-[13px] transition-colors cursor-pointer text-left font-medium",
                                        assignmentPageSize === size 
                                          ? "bg-orange-50 text-[#fa541c] font-bold" 
                                          : "bg-white text-black hover:bg-neutral-50"
                                      )}
                                    >
                                      {size} 条/页
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                  ) : (
                    /* 批阅模式 (Grading Dashboard) */
                    <div className="flex flex-col h-full animation-slide-up">
                      <div className="flex items-center justify-between mb-6 pb-5 border-b border-neutral-100">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setShowGrading(false)} className="w-8 h-8 rounded-[4px] hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-[#fa541c] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <div>
                            <h2 className="text-[18px] font-black text-neutral-900 tracking-tight">模块 1 综合测验：Python 基础</h2>
                            <p className="text-[12px] text-neutral-500 font-medium">共 50 人 · 已交 45 人 · 待批改 12 人</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="border-orange-200 text-[#fa541c] bg-orange-50 h-9 font-bold text-[13px] rounded-[4px]">
                            处理延期申请 (3)
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-1 gap-6 min-h-[600px]">
                        {/* Left: Student List */}
                        <div className="w-[280px] bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col overflow-hidden shrink-0">
                          <div className="flex items-center p-2 border-b border-neutral-100 bg-neutral-50 text-[13px] font-bold text-neutral-500">
                            <button className="flex-1 py-1.5 text-center bg-white rounded-[4px] shadow-sm text-[#fa541c]">待批改(12)</button>
                            <button className="flex-1 py-1.5 text-center hover:text-neutral-700 transition-colors rounded-[4px]">已批改(31)</button>
                            <button className="flex-1 py-1.5 text-center hover:text-neutral-700 transition-colors rounded-[4px]">已打回(2)</button>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {['刘晓明', '张伟', '陈静', '王芳'].map((name, i) => (
                              <div key={i} className={cn("p-3 rounded-xl cursor-pointer transition-colors border", i === 0 ? "bg-orange-50/50 border-[#fa541c]/30" : "border-transparent hover:bg-neutral-50")}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className={cn("text-[14px] font-bold", i === 0 ? "text-[#fa541c]" : "text-neutral-800")}>{name}</span>
                                  <span className="text-[11px] text-neutral-400">10分钟前提交</span>
                                </div>
                                <div className="text-[12px] text-neutral-500">学号: 2026{1000+i}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Grading Area */}
                        <div className="flex-1 flex flex-col gap-6">
                          {/* Submission Content */}
                          <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 overflow-y-auto custom-scrollbar relative">
                            <div className="absolute top-4 right-4 flex gap-2">
                              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-[4px] text-[12px] font-bold border border-blue-100 flex items-center gap-1.5">
                                <Code className="w-3.5 h-3.5" /> 代码查重率: 5% (安全)
                              </span>
                            </div>
                            <h3 className="text-[16px] font-bold text-neutral-900 mb-4 pb-4 border-b border-neutral-100">学生解答与附件</h3>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                <h4 className="text-[13px] font-bold text-neutral-700 mb-2">代码文件</h4>
                                <div className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-[4px] max-w-sm">
                                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-[4px] flex items-center justify-center">
                                    <Code className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="text-[14px] font-bold text-neutral-800 hover:text-[#fa541c] cursor-pointer">spider_main.py</div>
                                    <div className="text-[12px] text-neutral-400">2.4 KB</div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl relative group">
                                <h4 className="text-[13px] font-bold text-neutral-700 mb-2">在线解答</h4>
                                <div className="bg-white p-4 border border-neutral-200 rounded-[4px] text-[14px] text-neutral-700 font-mono leading-relaxed">
                                  # 核心解析代码实现<br/>
                                  def parse_page(html):<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;soup = BeautifulSoup(html, 'lxml')<br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;items = soup.find_all('div', class_='item')<br/>
                                  <span className="bg-orange-100 border-b-2 border-[#fa541c] cursor-pointer" title="点击添加批注">&nbsp;&nbsp;&nbsp;&nbsp;# 老师批注：这里没有考虑反爬虫策略，建议加入随机 User-Agent</span><br/>
                                  &nbsp;&nbsp;&nbsp;&nbsp;...
                                </div>
                                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="outline" size="sm" className="h-8 text-[12px] bg-white shadow-sm rounded-[4px]"><Edit className="w-3.5 h-3.5 mr-1" /> 添加在线批注</Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Scoring & Action Area */}
                          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 shrink-0">
                            <div className="flex gap-8">
                              <div className="flex-1 space-y-4">
                                <div>
                                  <label className="text-[14px] font-bold text-neutral-800 flex items-center gap-1.5 mb-2">
                                    <Edit className="w-4 h-4 text-[#fa541c]" /> 教师评语
                                  </label>
                                  <textarea 
                                    className="w-full h-20 p-3 text-[14px] rounded-xl border border-neutral-200 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] resize-none" 
                                    placeholder="请输入评语，指导学生..."
                                    defaultValue="代码结构很清晰，基本逻辑正确。但在解析页面时没有考虑常见的反爬机制，建议在实际项目中加入请求头伪装。继续努力！"
                                  ></textarea>
                                </div>
                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-[#fa541c] focus:ring-[#fa541c] cursor-pointer" defaultChecked />
                                    <span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900 flex items-center gap-1"><Award className="w-4 h-4 text-amber-500" /> 标记为优秀作业</span>
                                  </label>
                                </div>
                              </div>

                              <div className="w-[300px] flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                  <span className="text-[14px] font-bold text-neutral-800">最终评分 (满分 100)</span>
                                  <input type="number" className="w-20 text-center text-[24px] font-black text-[#fa541c] bg-white border border-neutral-200 rounded-[4px] py-1 focus:outline-none focus:border-[#fa541c]" defaultValue={92} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 font-bold h-10 rounded-[4px]">打回重做</Button>
                                  <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-10 shadow-md shadow-orange-500/20">提交评分并继续</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. 成员管理 (Members) */}
              {activeTab === 'members' && (
                <div className="p-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-neutral-title">班级成员</h2>
                  </div>

                  <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="text" placeholder="搜索用户名或学号..." className="pl-9 pr-4 py-2 w-[300px] text-sm border border-neutral-border rounded-full focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-colors bg-white" />
                    </div>
                    {perspective === 'teacher' && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleBatchAuthorize}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] shadow-sm rounded-[4px]"
                        >
                          批量授权
                        </Button>
                        <Button 
                          onClick={handleBatchRevokeAuth}
                          className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] shadow-sm rounded-[4px]"
                        >
                          批量解除授权
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded overflow-hidden border border-neutral-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600">
                            {perspective === 'teacher' && (
                              <th className="p-4 font-medium w-12 text-center">
                                <button 
                                  type="button"
                                  onClick={() => toggleSelectAllStudents(selectedStudents.length !== studentList.length || studentList.length === 0)}
                                  className={cn(
                                    "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer mx-auto",
                                    selectedStudents.length === studentList.length && studentList.length > 0
                                      ? "bg-[#fa541c] border-[#fa541c] text-white"
                                      : "border-neutral-300 hover:border-[#fa541c] bg-white"
                                  )}
                                >
                                  {selectedStudents.length === studentList.length && studentList.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                                </button>
                              </th>
                            )}
                            <th className="p-4 font-medium">用户账号</th>
                            <th className="p-4 font-medium">用户名</th>
                            <th className="p-4 font-medium">用户组</th>
                            <th className="p-4 font-medium">授权时间</th>
                            {perspective === 'teacher' && <th className="p-4 font-medium text-left">操作</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {studentList.map((student, i) => (
                            <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]">
                              <td className="p-4 text-center">
                                <button 
                                  type="button"
                                  onClick={() => toggleSelectStudent(student.username)}
                                  className={cn(
                                    "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer mx-auto",
                                    selectedStudents.includes(student.username)
                                      ? "bg-[#fa541c] border-[#fa541c] text-white"
                                      : "border-neutral-300 hover:border-[#fa541c] bg-white"
                                  )}
                                >
                                  {selectedStudents.includes(student.username) && <span className="text-[10px] font-bold">✓</span>}
                                </button>
                              </td>
                              <td className="p-4 text-neutral-800">{student.username}</td>
                              <td className="p-4 text-neutral-600">{student.nickname}</td>
                              <td className="p-4 text-neutral-600">{student.group}</td>
                              <td className="p-4 text-neutral-500">{student.authTime}</td>
                              <td className="p-4 text-left">
                                <button 
                                  onClick={() => handleRevokeAuth(student.username)}
                                  className="text-red-500 hover:text-red-600 bg-transparent border-0 cursor-pointer font-bold rounded-[4px]"
                                >
                                  解除授权
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-end p-4 gap-4 bg-transparent mt-4">
                    <span className="text-[13px] text-neutral-500 font-medium">共 {studentList.length} 条</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-white" disabled>&lt;</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-[#fa541c] text-white border-[#fa541c]">1</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-[4px] bg-white">&gt;</Button>
                    </div>
                    <select className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:border-[#fa541c] text-neutral-600">
                      <option>10 条/页</option>
                      <option>20 条/页</option>
                      <option>50 条/页</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 4. 学情数据 (Analytics) */}
              {activeTab === 'analytics' && (
                <div className="p-6 lg:p-8 animate-in fade-in duration-500 bg-neutral-50/30 rounded-b-[24px]">
                  <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-[#fa541c]" /> 整体学情全景报告
                      </h2>
                      <p className="text-[13px] text-neutral-500 mt-1">实时统计所有选课学生的学习进度与考核数据，数据每 15 分钟刷新一次。</p>
                    </div>
                    {perspective === 'teacher' && (
                      <Button 
                        onClick={() => {
                          setShowExportModal(true);
                          setExportProgress(0);
                          setIsExporting(false);
                          setExportCompleted(false);
                        }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-10 px-6 shadow-md shadow-orange-500/20 font-bold transition-all"
                      >
                        <Download className="w-4 h-4 mr-2" /> 导出详细数据报告
                      </Button>
                    )}
                  </div>
                  
                  {/* Top Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: '作业平均提交率', value: '92.0', unit: '%', desc: '本周新增提交 45 份', icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: '考试及格率', value: '88.3', unit: '%', desc: '', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
                      { label: '周活跃学生', value: '1,245', unit: '人', desc: '占总人数 78%', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map((stat, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-[13px] text-neutral-500 font-bold mb-1">{stat.label}</div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-3xl font-black text-neutral-900 tracking-tight">{stat.value}</span>
                          <span className="text-[14px] font-bold text-neutral-400">{stat.unit}</span>
                        </div>
                        {stat.desc && <div className="text-[11px] font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded inline-block">{stat.desc}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Trend */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 text-[15px] flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-[#fa541c]" /> 学生活跃度趋势 (近7天)
                        </h3>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#fa541c" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#fa541c" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} />
                              <CartesianGrid vertical={false} stroke="#f0f0f0" />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                              <Area type="monotone" dataKey="active" stroke="#fa541c" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Score Distribution */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 text-[15px] flex items-center gap-2">
                           <BarChart className="w-4 h-4 text-blue-500" /> 考试成绩分布
                        </h3>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChartRecharts data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={36}>
                              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8c8c8c' }} />
                              <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="3 3" />
                              <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                              <Bar dataKey="count" fill="#40a9ff" radius={[6, 6, 0, 0]} />
                            </BarChartRecharts>
                         </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Progress */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
                    <h3 className="font-bold text-neutral-900 text-[16px] flex items-center gap-2 mb-8 border-b border-neutral-100 pb-4">
                       <BookOpen className="w-5 h-5 text-emerald-500" /> 各章节学习进度全景
                    </h3>
                    <div className="space-y-6">
                       {[
                         { title: '第一课：人工智能训练师三级考试内容指导', progress: 95, studentCount: 1200 },
                         { title: '第二课：培训与指导', progress: 82, studentCount: 1150 },
                         { title: '第三课：数据标注核心技术与实战', progress: 68, studentCount: 980 },
                         { title: '第四课：模型部署与性能优化', progress: 45, studentCount: 850 },
                       ].map((chap, i) => (
                         <div key={i}>
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               <span className="w-6 h-6 rounded-[4px] bg-neutral-100 text-neutral-500 flex items-center justify-center text-[12px] font-bold">{i+1}</span>
                               <span className="text-[14px] font-bold text-neutral-800">{chap.title}</span>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className="text-[12px] text-neutral-400 font-medium">{chap.studentCount} 人已学</span>
                               <span className="text-[14px] font-black text-neutral-900 min-w-[36px] text-right">{chap.progress}%</span>
                             </div>
                           </div>
                           <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                             <div 
                               className={cn("h-full rounded-full transition-all duration-1000", chap.progress > 80 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : chap.progress > 50 ? "bg-gradient-to-r from-orange-400 to-[#fa541c]" : "bg-gradient-to-r from-neutral-300 to-neutral-400")}
                               style={{ width: `${chap.progress}%` }}
                             />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>

                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* 新建作业 Modal (Figure 1 Design) */}
      {(showCreateTaskModal || showEditTaskModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animation-fade-in pr-0">
          <div className="bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] w-full max-w-[600px] h-full flex flex-col animation-slide-left">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-neutral-900">{editingAssignmentId ? "编辑作业" : "新建作业"}</h2>
              <button 
                onClick={() => { 
                  setShowCreateTaskModal(false); 
                  setShowEditTaskModal(false); 
                  setEditingAssignmentId(null);
                  setSelectedPaperName('');
                  setTaskTitle('');
                  setTaskPublishTime('2026-05-21T14:29');
                  setTaskDeadline('');
                }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-[4px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* 基础信息 */}
              <div className="space-y-6">
                <h3 className="text-[15px] font-bold text-neutral-900">基础信息</h3>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 选择试卷：</label>
                  <div className="text-[14px] flex items-center gap-3">
                    <span className={selectedPaperName ? "text-neutral-900 font-medium" : "text-neutral-400"}>
                      {selectedPaperName || "未选择"}
                    </span>
                    <span 
                      onClick={() => setShowSelectPaperModal(true)} 
                      className="text-[#fa541c] hover:text-[#e84a15] cursor-pointer font-medium"
                    >
                      {selectedPaperName ? "重新选择" : "请选择"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 作业名称：</label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-[4px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入" 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 发布时间：</label>
                  <div className="relative">
                    <input 
                      type="datetime-local" 
                      className="w-full border border-neutral-200 rounded-[4px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-600" 
                      value={taskPublishTime}
                      onChange={(e) => setTaskPublishTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right"><span className="text-[#fa541c]">*</span> 截止时间：</label>
                  <div className="relative">
                    <input 
                      type="datetime-local" 
                      className="w-full border border-neutral-200 rounded-[4px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-600" 
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 分配人员 */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[15px] font-bold text-neutral-900">分配人员</h3>
                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[14px] text-neutral-700 text-right mt-1"><span className="text-[#fa541c]">*</span> 分配至：</label>
                  <div className="space-y-4 text-[14px] text-neutral-700">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="assign" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" defaultChecked />
                      <span>全部学生</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="assign" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" />
                        <span>部分学生</span>
                      </label>
                      <span className="text-neutral-400">未选择</span>
                      <span className="text-[#fa541c] cursor-pointer hover:text-[#e84a15]">添加</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 通知提醒 */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[15px] font-bold text-neutral-900">通知提醒</h3>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[14px] text-neutral-700 text-right">站内通知：</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 bg-[#fa541c] rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                    <span className="text-[14px] text-neutral-600">推送相关学生和教师</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-white shrink-0 flex justify-end gap-3">
              <Button 
                onClick={() => { 
                  setShowCreateTaskModal(false); 
                  setShowEditTaskModal(false); 
                  setEditingAssignmentId(null);
                  setSelectedPaperName('');
                  setTaskTitle('');
                  setTaskPublishTime('2026-05-21T14:29');
                  setTaskDeadline('');
                }} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-6 rounded-[4px]"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  if (!selectedPaperName || !taskTitle) return;

                  const formattedPublish = taskPublishTime.replace('T', ' ');
                  const formattedDeadline = taskDeadline ? taskDeadline.replace('T', ' ') : '2099-02-28 00:00';

                  if (editingAssignmentId !== null) {
                    // Edit Mode
                    setAssignments(prev => prev.map(a => a.id === editingAssignmentId ? {
                      ...a,
                      title: taskTitle,
                      paperName: selectedPaperName,
                      publishTime: formattedPublish,
                      deadline: formattedDeadline,
                    } : a));
                  } else {
                    // Add Mode
                    const newId = Math.max(...assignments.map(a => a.id), 0) + 1;
                    setAssignments(prev => [
                      ...prev,
                      {
                        id: newId,
                        title: taskTitle,
                        paperName: selectedPaperName,
                        publishTime: formattedPublish,
                        deadline: formattedDeadline,
                        submitCount: 0,
                        totalCount: 50,
                        avgScore: '-',
                        toGrade: 0,
                        rejected: 0
                      }
                    ]);
                  }

                  // Close modals & Reset states
                  setShowCreateTaskModal(false);
                  setShowEditTaskModal(false);
                  setEditingAssignmentId(null);
                  setSelectedPaperName('');
                  setTaskTitle('');
                  setTaskPublishTime('2026-05-21T14:29');
                  setTaskDeadline('');
                }} 
                className={cn("text-white font-bold h-9 px-6 rounded-[4px]", (selectedPaperName && taskTitle) ? "bg-[#fa541c] hover:bg-[#e84a15]" : "bg-neutral-200 cursor-not-allowed")}
              >
                {editingAssignmentId ? "保存作业" : "发布作业"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择试卷 Modal (Figure 2 Design) */}
      {showSelectPaperModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">选择试卷</h2>
              <button 
                onClick={() => setShowSelectPaperModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 pb-0 flex justify-end shrink-0 bg-white">
               <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm font-bold h-9 px-5">
                 <Plus className="w-4 h-4 mr-1.5" /> 新建试卷
               </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-[13px] text-neutral-900 font-bold bg-white">
                    <th className="py-3 px-2 w-12 text-center"></th>
                    <th className="py-3 px-2 w-[220px]">
                      <div className="flex items-center gap-1">试卷名称 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" /></div>
                    </th>
                    <th className="py-3 px-2">试卷描述</th>
                    <th className="py-3 px-2">题目数量</th>
                    <th className="py-3 px-2 w-[220px] relative">
                      <div className="flex items-center justify-between w-full p-1 -m-1 rounded cursor-pointer hover:bg-neutral-50 transition-colors" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                        <span>包含题型</span>
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      </div>
                      {showFilterDropdown && (
                        <>
                          <div className="fixed inset-0 z-[65]" onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(false); }}></div>
                          <div className="absolute left-0 top-10 z-[70] w-[200px] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[4px] overflow-hidden animation-slide-up" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-neutral-100">
                              <div className="font-bold text-[13px] mb-3 text-neutral-800">搜索包含题型</div>
                              <div className="space-y-2.5">
                                {['选择全部', '单选题', '多选题', '判断题', '填空题', '简答题', '思考题', '实训题', '编程题'].map((t) => (
                                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-3.5 h-3.5 text-[#fa541c] focus:ring-[#fa541c] rounded border-neutral-300 cursor-pointer" />
                                    <span className="text-[13px] text-neutral-600 group-hover:text-neutral-900 transition-colors">{t}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="flex text-[13px]">
                              <button className="flex-1 py-2.5 text-neutral-500 hover:text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-[4px]">重置</button>
                              <button className="flex-1 py-2.5 text-[#fa541c] font-bold hover:bg-orange-50 transition-colors rounded-[4px]" onClick={() => setShowFilterDropdown(false)}>确认</button>
                            </div>
                          </div>
                        </>
                      )}
                    </th>
                    <th className="py-3 px-2 w-[120px]">
                       <div className="flex items-center gap-1">创建人 <Search className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '人工智能通讯课-期末考试', desc: '', count: 40, types: '单选题、填空题、多选题、简答题、判断题', creator: 'Momode l' },
                    { name: '实验报告（理工类）：基于人工神经网...', desc: '该试卷用于「Mo 体验课程」理工类作业使...', count: 1, types: '实训题', creator: '孙昕' },
                    { name: '搭建 AI 聊天助手智能体作业', desc: '该试卷用于「Mo 体验课程」作业使用', count: 1, types: '实训题', creator: '孙昕' },
                    { name: '人工智能通讯作业', desc: '用于「Mo 体验课程」的作业试卷', count: 18, types: '单选题、填空题、多选题、简答题、编程题、思考题、判断题', creator: '孙昕' },
                    { name: 'Python基础编程', desc: 'Python基础编程', count: 7, types: '编程题', creator: 'Momode l' },
                    { name: '生成式AI与大模型', desc: '面向课程生成式AI与大模型的试题', count: 30, types: '单选题、填空题、简答题、思考题、判断题', creator: 'Momode l' },
                    { name: '人工智能通讯课', desc: '面向人工智能通讯课的试题', count: 31, types: '单选题、填空题、简答题、编程题、思考题、判断题', creator: 'Momode l' }
                  ].map((paper, i) => {
                    const isExpanded = expandedPaper === paper.name;
                    return (
                    <React.Fragment key={i}>
                      <tr 
                        className={cn("border-b border-neutral-100 hover:bg-orange-50/50 cursor-pointer transition-colors", isExpanded ? "bg-orange-50/20" : "")}
                        onClick={() => setSelectedPaperName(paper.name)}
                      >
                        <td className="py-4 px-2 text-center relative">
                           <div className="flex items-center gap-3">
                             <div 
                               className="w-4 h-4 border border-neutral-300 hover:border-[#fa541c] hover:text-[#fa541c] rounded text-neutral-400 flex items-center justify-center text-[10px] bg-neutral-50 transition-colors cursor-pointer"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setExpandedPaper(isExpanded ? null : paper.name);
                               }}
                             >
                               {isExpanded ? '-' : '+'}
                             </div>
                             <input type="radio" name="paperSelect" className="w-4 h-4 text-[#fa541c] focus:ring-[#fa541c] border-neutral-300 cursor-pointer" checked={selectedPaperName === paper.name} readOnly />
                           </div>
                        </td>
                        <td className="py-4 px-2 text-[14px] text-neutral-700 font-medium">{paper.name}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500 max-w-[200px] truncate">{paper.desc}</td>
                        <td className="py-4 px-2 text-[14px] text-neutral-700">{paper.count}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500 max-w-[200px] truncate">{paper.types}</td>
                        <td className="py-4 px-2 text-[13px] text-neutral-500">{paper.creator}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-neutral-100 bg-neutral-50/30">
                          <td colSpan={6} className="py-6 px-12">
                            <div className="flex items-center gap-2 text-neutral-900 font-bold mb-5">
                               <FileText className="w-5 h-5 text-[#fa541c]" /> 客观题
                            </div>
                            <div className="space-y-5 pl-7">
                               <div>
                                  <div className="font-bold text-[14px] text-neutral-900 mb-2">1. 客观题 {paper.count} 道，共 100 分</div>
                                  <div className="text-[12px] text-neutral-500">{paper.types.includes('单选') ? `客观题包括${paper.types}` : `题型包括${paper.types}`}</div>
                               </div>
                               <div>
                                  <div className="font-bold text-[14px] text-neutral-900 mb-2">2. 答题限时: 3600 分钟</div>
                                  <div className="text-[12px] text-neutral-500">客观题需在 3600 分钟内完成答题，过程中无法暂停，仅支持提交一次答案，请提前合理安排时间</div>
                               </div>
                               <Button className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] shadow-sm shadow-orange-500/20 font-bold h-8 px-5 mt-2">
                                  预览客观题
                               </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
               <Button 
                 onClick={() => setShowSelectPaperModal(false)} 
                 variant="outline" 
                 className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
               >
                 取消
               </Button>
               <Button 
                 onClick={() => setShowSelectPaperModal(false)} 
                 className={cn("text-white h-9 px-6 rounded-[4px] text-[13px] shadow-sm cursor-pointer transition-colors font-semibold", selectedPaperName ? "bg-[#fa541c] hover:bg-[#e84a15]" : "bg-neutral-200 cursor-not-allowed")}
               >
                 确定
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* 评分规则 Modal */}
      {showScoringRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] overflow-hidden border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#fa541c]" /> 配置评分维度
              </h2>
              <button 
                onClick={() => setShowScoringRulesModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 space-y-6 bg-white text-[13px]">
               <div className="bg-orange-50 border border-orange-100 p-3 rounded-[4px] flex items-start gap-2 mb-2">
                 <div className="text-orange-600 mt-0.5"><Award className="w-4 h-4" /></div>
                 <p className="text-[12px] text-orange-800 leading-relaxed">设置多个评分维度，方便批阅时打分。各个维度的分值总和应等于该任务的满分（100分）。</p>
               </div>
 
               <div className="space-y-3">
                 {[
                   { name: '代码功能完整性', desc: '实现所有要求的功能，能正常运行', score: 40 },
                   { name: '代码规范与风格', desc: '遵守 PEP8，变量命名清晰', score: 30 },
                   { name: '算法效率优化', desc: '时间与空间复杂度达标', score: 30 },
                 ].map((rule, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xl bg-white group hover:border-[#fa541c] transition-colors relative">
                     <div className="flex-1">
                       <input type="text" className="font-bold text-[14px] text-neutral-900 bg-transparent outline-none w-full mb-1" defaultValue={rule.name} />
                       <input type="text" className="text-[12px] text-neutral-500 bg-transparent outline-none w-full" defaultValue={rule.desc} />
                     </div>
                     <div className="flex items-center gap-1 border border-neutral-200 rounded px-2 py-1 bg-neutral-50">
                       <input type="number" className="w-10 text-center font-bold text-[#fa541c] bg-transparent outline-none" defaultValue={rule.score} />
                       <span className="text-[12px] text-neutral-500 font-bold">分</span>
                     </div>
                     <button className="absolute -right-3 -top-3 w-6 h-6 bg-white border border-neutral-200 rounded-[4px] flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 ))}
               </div>
 
               <Button variant="outline" className="w-full border-dashed border-neutral-300 text-neutral-600 hover:text-[#fa541c] hover:border-orange-300 bg-neutral-50 hover:bg-orange-50 h-10 rounded-[4px]">
                 <Plus className="w-4 h-4 mr-2" /> 新增评分维度
               </Button>
            </div>
 
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 shrink-0 flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-neutral-600">当前总分：<span className="text-[#fa541c] text-[16px]">100</span> 分</span>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowScoringRulesModal(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => setShowScoringRulesModal(false)} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                >
                  保存规则
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建章节 Drawer */}
      {showCreateChapterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowCreateChapterDrawer(false)}>
          <div 
            className="bg-white w-full max-w-[480px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#fa541c]" /> 新建章节
              </h2>
              <button 
                onClick={() => setShowCreateChapterDrawer(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6 bg-white text-[13px] flex-1 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 章节名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  placeholder="请输入章节名称" 
                  autoFocus 
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowCreateChapterDrawer(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowCreateChapterDrawer(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 新建教学课件 Drawer */}
      {showTeachingMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowTeachingMaterialModal(false)}>
          <div 
            className="bg-white w-full max-w-[480px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 新建教学课件
              </h2>
              <button 
                onClick={() => setShowTeachingMaterialModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6 bg-white text-[13px] flex-1 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 课件名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  placeholder="请输入教学课件名称" 
                  autoFocus 
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowTeachingMaterialModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowTeachingMaterialModal(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择实验课件 Drawer */}
      {showExperimentMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowExperimentMaterialModal(false)}>
          <div 
            className="bg-white w-full max-w-[540px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div> 选择实验课件 <span className="text-[13px] text-blue-500 font-normal cursor-pointer hover:underline ml-2">帮助教程 <Info className="w-3.5 h-3.5 inline mb-0.5" /></span>
              </h2>
              <button 
                onClick={() => setShowExperimentMaterialModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white text-[13px]">
              {/* 课件名称 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 课件名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  placeholder="请输入课件名称" 
                />
              </div>

              {/* Selection Section */}
              <div className="border-t border-neutral-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="text-[14px] font-bold text-neutral-700">我创建的</div>
                   <div className="flex items-center gap-3">
                     {isSearchingExperiment ? (
                       <div className="flex items-center border border-[#fa541c] rounded-full px-3 h-8 overflow-hidden bg-white animation-slide-left">
                         <Search className="w-3.5 h-3.5 text-[#fa541c] mr-2 shrink-0" />
                         <input type="text" className="w-32 text-[13px] outline-none text-neutral-800 placeholder-neutral-400" placeholder="搜索课件..." autoFocus onBlur={() => setIsSearchingExperiment(false)} />
                       </div>
                     ) : (
                       <div onClick={() => setIsSearchingExperiment(true)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-100 text-neutral-400 hover:text-[#fa541c] transition-colors">
                         <Search className="w-4 h-4" />
                       </div>
                     )}
                     <Button 
                       onClick={() => navigate('/teacher', { state: { activeSubTab: 'project', openCreate: true } })} 
                       variant="outline" 
                       className="h-8 border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:text-[#fa541c] font-bold px-3 transition-colors rounded-[4px]"
                     >
                       <Plus className="w-3.5 h-3.5 mr-1" /> 新建
                     </Button>
                   </div>
                </div>
                
                <div className="space-y-1">
                   {[
                     { id: 'IL511779172854', subtitle: '人工智能' },
                     { id: 'IL511779173126', subtitle: '人工智能' }
                   ].map((item, idx) => (
                     <div 
                       key={idx} 
                       onClick={() => setSelectedExperimentIndex(idx)}
                       className={cn(
                         "flex items-center justify-between p-4 border border-b cursor-pointer group transition-all rounded-[4px] mb-1",
                         selectedExperimentIndex === idx ? "bg-orange-50 border-orange-100 shadow-[0_2px_10px_rgba(250,84,28,0.05)]" : "hover:bg-neutral-50 border-neutral-50"
                       )}
                     >
                       <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                           selectedExperimentIndex === idx ? "bg-[#fa541c] text-white" : "bg-orange-100 text-[#fa541c] group-hover:bg-[#fa541c] group-hover:text-white"
                         )}>
                           <Code className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="text-[15px] font-bold text-neutral-800 mb-1 group-hover:text-[#fa541c] transition-colors">{item.id}</div>
                           <div className="text-[12px] text-neutral-400 flex items-center gap-1"><Paperclip className="w-3 h-3" /> {item.subtitle}</div>
                         </div>
                       </div>
                       <div className={cn(
                         "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                         selectedExperimentIndex === idx ? "border-[#fa541c] bg-[#fa541c]" : "border-neutral-300 group-hover:border-[#fa541c]"
                       )}>
                         {selectedExperimentIndex === idx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between shrink-0">
              <div className="text-[13px] text-neutral-505 font-medium">已选 <span className="text-[#fa541c] font-bold">{selectedExperimentIndex !== null ? 1 : 0}</span> 项</div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowExperimentMaterialModal(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => setShowExperimentMaterialModal(false)} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                >
                  确认
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建互动学习课件 Drawer */}
      {showInteractiveMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowInteractiveMaterialModal(false)}>
          <div 
            className="bg-white w-full max-w-[480px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 新建互动学习课件
              </h2>
              <button 
                onClick={() => setShowInteractiveMaterialModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6 bg-white text-[13px] flex-1 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 课件名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  placeholder="请输入课件名称" 
                  autoFocus 
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowInteractiveMaterialModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowInteractiveMaterialModal(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 选择随堂作业 Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] overflow-hidden border border-neutral-100 flex flex-col h-[560px] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 <div className="w-1 h-4 bg-[#fa541c] rounded-full"></div> 选择随堂作业
              </h2>
              <button 
                onClick={() => setShowAssignmentModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 border-b border-neutral-100 flex items-center justify-between">
               <div className="flex items-center gap-8">
                 <div className="py-3 text-[14px] font-bold text-[#fa541c] border-b-2 border-[#fa541c] cursor-pointer">个人</div>
                 <div className="py-3 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer border-b-2 border-transparent transition-colors">公开</div>
               </div>
               <Search className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors" />
            </div>

            <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
               <div className="text-[13px] text-neutral-500">列表</div>
               <Button variant="outline" className="h-8 border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:text-[#fa541c] font-bold px-3 transition-colors rounded-[4px]">
                 <Plus className="w-3.5 h-3.5 mr-1" /> 新建
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
               {[
                 { title: '大模型应用测验', subtitle: '用于「Mo 体验课程」大模型应用测验试卷' },
                 { title: 'Python编程测验', subtitle: '用于「Mo 体验课程」的Python编程测验试卷' },
                 { title: 'AI 通识第一课测验', subtitle: '用于「Mo 体验课程」的“AI 通识第一课”章节测验试卷' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 hover:bg-neutral-50 border-b border-neutral-50 cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                       <FileText className="w-5 h-5" />
                     </div>
                     <div>
                       <div className="text-[15px] font-bold text-neutral-800 mb-1">{item.title}</div>
                       <div className="text-[12px] text-neutral-400">{item.subtitle}</div>
                     </div>
                   </div>
                   <div className="w-4 h-4 rounded-full border border-neutral-300 group-hover:border-[#fa541c] shrink-0 ml-4 transition-colors"></div>
                 </div>
               ))}
            </div>

            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
              <div className="text-[13px] text-neutral-500">已选 <span className="text-[#fa541c] font-bold">0</span> 项</div>
              <div className="flex gap-3">
                <Button onClick={() => setShowAssignmentModal(false)} variant="outline" className="border-neutral-200 text-[#fa541c] font-bold h-9 px-6 hover:bg-orange-50 hover:text-[#fa541c] rounded-[4px]">取消</Button>
                <Button onClick={() => setShowAssignmentModal(false)} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-9 px-8 shadow-sm shadow-orange-500/20">确认</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑章节 Drawer */}
      {showEditChapterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowEditChapterDrawer(false)}>
          <div 
            className="bg-white w-full max-w-[480px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 编辑章节
              </h2>
              <button 
                onClick={() => setShowEditChapterDrawer(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6 bg-white text-[13px] flex-1 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  defaultValue="第一课" 
                  autoFocus 
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowEditChapterDrawer(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowEditChapterDrawer(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 Modal */}
      {showDeleteChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Body */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-5 bg-[#fa541c] rounded-full mt-1 shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-neutral-900">删除确认</h2>
                    <button 
                      onClick={() => setShowDeleteChapterModal(false)} 
                      className="text-neutral-400 hover:text-[#fa541c] transition-colors rounded-[4px] border-0 bg-transparent cursor-pointer p-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[14px] text-neutral-600 mb-2">
                    确定要删除这个章吗？删除后将无法恢复
                  </p>
                  <p className="text-[13px] text-[#fa541c] font-medium">
                    若该目录下存在子目录或学生学习数据将一并删除
                  </p>
                </div>
              </div>
              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  onClick={() => setShowDeleteChapterModal(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => setShowDeleteChapterModal(false)} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-6 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑课时 Drawer */}
      {showEditLessonDrawer && selectedEditLesson && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in" onClick={() => setShowEditLessonDrawer(false)}>
          <div 
            className="bg-white w-full max-w-[480px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                 编辑课时
              </h2>
              <button 
                onClick={() => setShowEditLessonDrawer(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6 bg-white text-[13px] flex-1 overflow-y-auto">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right flex items-center justify-end gap-1">
                  <span className="text-[#fa541c]">*</span> 名称
                </label>
                <input 
                  type="text" 
                  className="w-full border border-neutral-200 rounded-[4px] px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 transition-all text-[#262626]" 
                  defaultValue={selectedEditLesson.title} 
                  autoFocus 
                />
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowEditLessonDrawer(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={() => setShowEditLessonDrawer(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-8 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 删除课时确认 Modal */}
      {showDeleteLessonModal && selectedEditLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Body */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-5 bg-[#fa541c] rounded-full mt-1 shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-neutral-900">删除课时确认</h2>
                    <button 
                      onClick={() => setShowDeleteLessonModal(false)} 
                      className="text-neutral-400 hover:text-[#fa541c] transition-colors rounded-[4px] border-0 bg-transparent cursor-pointer p-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[14px] text-neutral-600 mb-2">
                    确定要删除 <strong>{selectedEditLesson.section} {selectedEditLesson.title}</strong> 吗？删除后将无法恢复。
                  </p>
                  <p className="text-[13px] text-[#fa541c] font-medium">
                    该课时关联的学习数据与学生记录将一并删除。
                  </p>
                </div>
              </div>
              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  onClick={() => setShowDeleteLessonModal(false)} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => setShowDeleteLessonModal(false)} 
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] h-9 px-6 shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 邀请学生 Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#fa541c]" /> 邀请学生入班
              </h2>
              <button 
                onClick={() => setShowInviteModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-neutral-100 px-6 bg-neutral-50/20 shrink-0">
              <button 
                onClick={() => setInviteActiveTab('link')}
                className={cn(
                  "py-3 text-[13px] font-bold border-b-2 transition-all mr-6 rounded-[4px] border-0 bg-transparent cursor-pointer",
                  inviteActiveTab === 'link' 
                    ? "border-b-[#fa541c] text-[#fa541c]" 
                    : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
              >
                邀请链接/邀请码
              </button>
              <button 
                onClick={() => setInviteActiveTab('manual')}
                className={cn(
                  "py-3 text-[13px] font-bold border-b-2 transition-all rounded-[4px] border-0 bg-transparent cursor-pointer",
                  inviteActiveTab === 'manual' 
                    ? "border-b-[#fa541c] text-[#fa541c]" 
                    : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
              >
                手机号/邮箱邀请
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1">
              {inviteActiveTab === 'link' ? (
                <div className="space-y-4">
                  <p className="text-[12px] text-neutral-500">将下方邀请码或专属邀请链接发送给学生，学生在实操平台中输入或访问即可直接加入该实训班级：</p>
                  
                  {/* Invite Code */}
                  <div className="bg-neutral-50 rounded-[4px] p-4 border border-neutral-150 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mb-1">班级专属邀请码</div>
                      <div className="text-xl font-mono font-bold text-neutral-800 tracking-wider">X8J9K2</div>
                    </div>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText("X8J9K2");
                        alert("邀请码复制成功！");
                      }}
                      className="bg-white border border-[#fa541c] text-[#fa541c] hover:bg-orange-50 font-bold text-[12px] px-3.5 h-9 rounded-[4px] transition-colors"
                    >
                      复制邀请码
                    </Button>
                  </div>

                  {/* Invite Link */}
                  <div className="bg-neutral-50 rounded-[4px] p-4 border border-neutral-150 space-y-2">
                    <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">班级邀请链接</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://platform.cosmos.com/join/course/1/X8J9K2" 
                        className="flex-1 bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 text-[11px] text-neutral-600 focus:outline-none font-mono font-bold"
                      />
                      <Button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://platform.cosmos.com/join/course/1/X8J9K2");
                          alert("邀请链接复制成功！");
                        }}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold text-[12px] px-3.5 h-9 rounded-[4px] transition-colors shrink-0"
                      >
                        复制链接
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-neutral-700">手机号/邮箱列表</label>
                    <textarea 
                      placeholder="请输入学生的手机号或邮箱，多个成员请用逗号或换行分隔..." 
                      rows={4}
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                      className="w-full border border-neutral-200 rounded-[4px] px-4 py-3 text-[13px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white resize-none"
                    />
                    <div className="text-[11px] text-neutral-400">系统将自动向上述联系方式发送包含入班链接的短信或邮件通知。</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowInviteModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px]"
              >
                关闭
              </Button>
              {inviteActiveTab === 'manual' && (
                <Button 
                  onClick={handleSendInvite}
                  disabled={!inviteInput.trim()}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-9 px-6 text-[13px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送邀请
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 批量授权 Modal */}
      {showBatchImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-[#fa541c]" /> 批量授权用户名单
              </h2>
              <button 
                onClick={() => {
                  setShowBatchImportModal(false);
                  setImportSelectedFile(null);
                  setImportProgress(0);
                }} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[460px] custom-scrollbar flex-1">
              {/* Step 1: Download Template */}
              <div className="space-y-2">
                <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-50 text-[#fa541c] flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                  下载Excel授权模板
                </div>
                <div className="pl-7 flex items-center justify-between">
                  <span className="text-[12px] text-neutral-500">请使用我们预设的模板列属性格式，以避免解析错误。</span>
                  <Button 
                    onClick={() => alert("用户授权模版已下载到您的系统默认下载文件夹！")}
                    className="bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-bold text-[12px] px-3.5 h-9 rounded-[4px] transition-colors shadow-sm"
                  >
                    下载授权模板
                  </Button>
                </div>
              </div>

              <div className="border-t border-neutral-100"></div>

              {/* Step 2: Upload File */}
              <div className="space-y-3">
                <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-50 text-[#fa541c] flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                  上传已填写的用户授权表
                </div>
                <div className="pl-7 space-y-3">
                  {!importSelectedFile ? (
                    <div 
                      onClick={handleMockUploadFile}
                      className="border-2 border-dashed border-neutral-200 rounded-[4px] p-6 flex flex-col items-center justify-center bg-neutral-50/50 hover:bg-orange-50/10 hover:border-orange-200 cursor-pointer transition-all group"
                    >
                      <Paperclip className="w-8 h-8 text-neutral-300 group-hover:text-[#fa541c] transition-colors mb-2" />
                      <div className="text-[13px] font-bold text-neutral-700 mb-1 group-hover:text-[#fa541c] transition-colors">
                        点击这里上传或将 Excel 文件拖拽到此处
                      </div>
                      <div className="text-[11px] text-neutral-400">仅支持 .xlsx, .xls 格式文件，文件不超过 10 MB</div>
                    </div>
                  ) : (
                    <div className="border border-neutral-200 rounded-[4px] p-4 bg-white space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[4px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="text-[13px] font-bold text-neutral-800">{importSelectedFile}</div>
                            <div className="text-[11px] text-neutral-400">18.4 KB &middot; {importProgress === 100 ? "文件解析完毕" : "正在上传解析..."}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setImportSelectedFile(null);
                            setImportProgress(0);
                          }}
                          className="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-neutral-100 rounded-[4px]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold font-mono">
                          <span>{importProgress === 100 ? "UPLOAD COMPLETED" : "UPLOADING FILE"}</span>
                          <span>{importProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#fa541c] rounded-full transition-all duration-150" 
                            style={{ width: `${importProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Mock Data Preview */}
              {importSelectedFile && importProgress === 100 && (
                <>
                  <div className="border-t border-neutral-100"></div>
                  <div className="space-y-3">
                    <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-50 text-[#fa541c] flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                      预授权数据预览
                    </div>
                    <div className="pl-7 space-y-2">
                      <div className="text-[12px] text-neutral-500 mb-1">系统已成功解析出表格内的 3 位用户，请确认是否授权：</div>
                      <div className="border border-neutral-150 rounded-[4px] overflow-hidden bg-neutral-50/30">
                        <table className="w-full text-left text-[12px] border-collapse bg-white">
                          <thead>
                            <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-550 font-bold">
                              <th className="py-2.5 px-4">序号</th>
                              <th className="py-2.5 px-4">用户账号</th>
                              <th className="py-2.5 px-4">用户名</th>
                              <th className="py-2.5 px-4">用户组</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: 1, username: "lilun1994", nickname: "理论1994", group: "0523" },
                              { id: 2, username: "lilun1995", nickname: "理论1995", group: "0523" },
                              { id: 3, username: "lilun1996", nickname: "理论1996", group: "0523" }
                            ].map((row) => (
                              <tr key={row.id} className="border-b border-neutral-100">
                                <td className="py-2.5 px-4 font-mono text-neutral-400">{row.id}</td>
                                <td className="py-2.5 px-4 font-bold text-neutral-850">{row.username}</td>
                                <td className="py-2.5 px-4 text-neutral-800">{row.nickname}</td>
                                <td className="py-2.5 px-4 text-neutral-550">{row.group}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => {
                  setShowBatchImportModal(false);
                  setImportSelectedFile(null);
                  setImportProgress(0);
                }} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px]"
              >
                取消
              </Button>
              {importSelectedFile && importProgress === 100 && (
                <Button 
                  onClick={handleConfirmBatchAuthorize}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-9 px-6 text-[13px] shadow-sm"
                >
                  确认授权 (3名用户)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 导出学情数据报告 Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Download className="w-5 h-5 text-[#fa541c]" /> 导出学情数据报告
              </h2>
              <button 
                onClick={() => setShowExportModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[460px] custom-scrollbar flex-1">
              {!isExporting && !exportCompleted ? (
                <>
                  {/* Configuration Form */}
                  <div className="space-y-4">
                    {/* Dimension Selection */}
                    <div className="space-y-2 text-left">
                      <label className="text-[12px] font-bold text-neutral-700">导出数据维度</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "all", title: "全班学生综合学情", desc: "汇总基础、进度与各科成绩" },
                          { id: "lessons", title: "章节课节进度细化表", desc: "细化到各课时的学习细节" }
                        ].map((dim) => (
                          <div 
                            key={dim.id}
                            onClick={() => setExportDimension(dim.id)}
                            className={cn(
                              "border-2 rounded-[4px] p-3.5 cursor-pointer transition-all hover:bg-neutral-50/50 flex flex-col text-left",
                              exportDimension === dim.id 
                                ? "border-[#fa541c] bg-orange-50/10" 
                                : "border-neutral-200 bg-white"
                            )}
                          >
                            <span className="text-[13px] font-bold text-neutral-855 mb-0.5">{dim.title}</span>
                            <span className="text-[10px] text-neutral-400 leading-normal">{dim.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Columns Checkboxes */}
                    <div className="space-y-2 text-left">
                      <label className="text-[12px] font-bold text-neutral-700">包含数据指标段</label>
                      <div className="grid grid-cols-2 gap-3 bg-neutral-50/50 border border-neutral-200 rounded-[4px] p-3.5">
                        {[
                          { key: "info", label: "学生基本信息 (学号/联系方式)" },
                          { key: "progress", label: "课时完成进度 (视频完播率/时长)" },
                          { key: "scores", label: "平时作业与测验评分汇总" },
                          { key: "active", label: "最近活跃状态与交互日志" }
                        ].map((col) => (
                          <label key={col.key} className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={(exportColumns as any)[col.key]}
                              onChange={(e) => setExportColumns({ ...exportColumns, [col.key]: e.target.checked })}
                              className="w-3.5 h-3.5 accent-[#fa541c]"
                            />
                            <span className="text-[12px] text-neutral-600 font-medium">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Format Selector */}
                    <div className="space-y-2 text-left">
                      <label className="text-[12px] font-bold text-neutral-700">文件格式</label>
                      <div className="flex gap-4">
                        {[
                          { id: "xlsx", label: "Excel 报表数据表 (.xlsx)" },
                          { id: "pdf", label: "PDF 打印版统计图表 (.pdf)" }
                        ].map((fmt) => (
                          <label key={fmt.id} className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio" 
                              name="exportFormat"
                              checked={exportFormat === fmt.id}
                              onChange={() => setExportFormat(fmt.id)}
                              className="w-3.5 h-3.5 accent-[#fa541c]"
                            />
                            <span className="text-[12px] text-neutral-700 font-bold">{fmt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : isExporting ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-[#fa541c] animate-spin"></div>
                  <div className="text-center space-y-2">
                    <div className="text-[14px] font-bold text-neutral-800">正在打包生成高精学情数据报告...</div>
                    <div className="text-[11px] text-neutral-450 font-bold font-mono">EXPORTING PROGRESS: {exportProgress}%</div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full max-w-[320px] h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#fa541c] rounded-full transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-neutral-450 font-medium italic">
                    {exportProgress < 30 ? "正在提取学生大纲及视频学习时长指标..." :
                     exportProgress < 75 ? "正在汇总课后作业及平时成绩权重..." :
                     "正在渲染离线 Excel 图表单元格结构并打包压缩..."}
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-[15px] font-black text-neutral-900">学情数据报告导出成功！</div>
                    <div className="text-[12px] text-neutral-400">报表已成功下载至您的本地文件系统。</div>
                  </div>

                  {/* Mock File Card */}
                  <div className="w-full max-w-[380px] border border-neutral-200 rounded-[4px] p-4 bg-neutral-50/50 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-[4px] bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-neutral-800 truncate">
                        人工智能基础与实践_整体学情报告.{exportFormat}
                      </div>
                      <div className="text-[11px] text-neutral-450 font-medium">134.5 KB &middot; 本地磁盘文件 &middot; 解析完毕</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {!isExporting && !exportCompleted ? (
                <>
                  <Button 
                    onClick={() => setShowExportModal(false)}
                    variant="outline"
                    className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px]"
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleStartExport}
                    className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-9 px-6 text-[13px] shadow-sm"
                  >
                    开始生成报告
                  </Button>
                </>
              ) : exportCompleted ? (
                <Button 
                  onClick={() => setShowExportModal(false)}
                  className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] font-bold h-9 px-8 text-[13px]"
                >
                  完成
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 提示 Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                {confirmModal.title}
              </h2>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex items-start gap-3 bg-white">
              <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              <div className="text-[14px] text-neutral-750 leading-normal">
                {confirmModal.message}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              {confirmModal.showCancel && (
                <Button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} 
                  variant="outline" 
                  className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
                >
                  取消
                </Button>
              )}
              <Button 
                onClick={() => {
                  confirmModal.onConfirm();
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批量解除授权 Modal */}
      {showBulkRevokeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                批量解除授权
              </h2>
              <button 
                onClick={() => setShowBulkRevokeModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col bg-white">
              <div className="border border-neutral-200 rounded-[4px] overflow-hidden bg-white">
                <div className="overflow-y-auto max-h-[240px]">
                  <table className="w-full text-left text-[12px] border-collapse bg-white">
                    <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200 z-10">
                      <tr className="text-neutral-550 font-bold">
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户账号</th>
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户名</th>
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户组</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.filter(s => selectedStudents.includes(s.username)).map((student, i) => (
                        <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-neutral-750 font-mono">{student.username}</td>
                          <td className="py-2.5 px-4 text-neutral-800">{student.nickname}</td>
                          <td className="py-2.5 px-4 text-neutral-550">{student.group}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-[14px] text-neutral-800 font-medium">是否对以上用户解除授权</div>
                <div className="text-[13px] text-neutral-400 font-medium">共 {selectedStudents.length} 条</div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowBulkRevokeModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  setStudentList(studentList.filter(s => !selectedStudents.includes(s.username)));
                  setSelectedStudents([]);
                  setShowBulkRevokeModal(false);
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 批量授权 Modal */}
      {showBulkAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[640px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                批量授权
              </h2>
              <button 
                onClick={() => setShowBulkAuthModal(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col bg-white">
              <div className="border border-neutral-200 rounded-[4px] overflow-hidden bg-white">
                <div className="overflow-y-auto max-h-[240px]">
                  <table className="w-full text-left text-[12px] border-collapse bg-white">
                    <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200 z-10">
                      <tr className="text-neutral-550 font-bold">
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户账号</th>
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户名</th>
                        <th className="py-2.5 px-4 font-bold text-neutral-700">用户组</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { username: 'lilun1994', nickname: '理论1994', group: '0523' },
                        { username: 'lilun1995', nickname: '理论1995', group: '0523' },
                        { username: 'lilun1996', nickname: '理论1996', group: '0523' }
                      ].map((student, i) => (
                        <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-neutral-750 font-mono">{student.username}</td>
                          <td className="py-2.5 px-4 text-neutral-800">{student.nickname}</td>
                          <td className="py-2.5 px-4 text-neutral-550">{student.group}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-[14px] text-neutral-800 font-medium">是否对以上用户进行授权</div>
                <div className="text-[13px] text-neutral-400 font-medium">共 3 条</div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setShowBulkAuthModal(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  const newStudents = [
                    { username: 'lilun1994', nickname: '理论1994', group: '0523', authTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') },
                    { username: 'lilun1995', nickname: '理论1995', group: '0523', authTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') },
                    { username: 'lilun1996', nickname: '理论1996', group: '0523', authTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') }
                  ];
                  setStudentList([...studentList, ...newStudents]);
                  setShowBulkAuthModal(false);
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Add MonitorPlay import at the top
