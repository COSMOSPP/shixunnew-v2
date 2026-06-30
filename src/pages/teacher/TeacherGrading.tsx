import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  FileText,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradingTask {
  id: number;
  examName: string;
  sessionName: string;
  roomName: string;
  time: string;
  gradedCount: number;
  pendingCount: number;
}

interface StudentSubmission {
  id: number;
  name: string;
  account: string;
  status: '已交卷' | '未交卷' | '进行中';
  gradedStatus: '已批阅' | '待批阅';
  score: number | null;
}

export default function TeacherGrading() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Candidates search query inside drawer
  const [candQuery, setCandQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Candidates drawer pagination states
  const [drawerPage, setDrawerPage] = useState(1);
  const [drawerPageSize, setDrawerPageSize] = useState(5);

  // Mock Grading Tasks Data
  const [tasksList, setTasksList] = useState<GradingTask[]>([
    { id: 1, examName: '2026年春季学期人工智能导论期末考', sessionName: 'AI导论-A班场', roomName: '博学楼计算中心301', time: '2026/06/12 10:00 - 12:00', gradedCount: 42, pendingCount: 3 },
    { id: 2, examName: '机器学习核心算法阶段性测验', sessionName: '机器学习-随堂测', roomName: '线上考场-防作弊监考', time: '2026/06/18 14:00 - 15:30', gradedCount: 28, pendingCount: 0 },
    { id: 3, examName: '大语言模型应用开发实训赛', sessionName: 'LLM应用开发竞赛场', roomName: '天翼云虚拟算力中心', time: '2026/06/25 09:00 - 11:30', gradedCount: 15, pendingCount: 12 },
    { id: 4, examName: '深度学习神经网络架构随堂考', sessionName: '深度学习-B班场', roomName: '求是楼402多媒体教室', time: '2026/06/28 16:00 - 17:30', gradedCount: 0, pendingCount: 35 },
    { id: 5, examName: 'Python数据分析实训考查', sessionName: '数据分析-重修场', roomName: '实验楼501机房', time: '2026/06/29 19:00 - 21:00', gradedCount: 8, pendingCount: 2 }
  ]);

  // Drawer details state for "批阅"
  const [selectedTask, setSelectedTask] = useState<GradingTask | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Sub-Drawer states for single student grading
  const [gradingStudent, setGradingStudent] = useState<StudentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  // Toast Notification states
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Tasks
  const filteredTasks = tasksList.filter(t => 
    t.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Candidates inside drawer
  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(candQuery.toLowerCase()) ||
    sub.account.toLowerCase().includes(candQuery.toLowerCase())
  );

  // Pagination calculations
  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / pageSize) || 1;
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Candidates pagination calculations
  const totalDrawerItems = filteredSubmissions.length;
  const totalDrawerPages = Math.ceil(totalDrawerItems / drawerPageSize) || 1;
  const paginatedSubmissions = filteredSubmissions.slice((drawerPage - 1) * drawerPageSize, drawerPage * drawerPageSize);

  // Handle open grading drawer
  const handleOpenGrading = (task: GradingTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
    setCandQuery('');
    setDrawerPage(1);
    showToast(`已拉起「${task.examName}」批阅工作台`, 'success');
    
    // Generate mock submissions for the selected task matching target screenshots
    const mockSubs: StudentSubmission[] = [
      { id: 101, name: '2', account: 't********j', status: '已交卷', gradedStatus: '待批阅', score: 0 },
      { id: 102, name: '陈小明', account: 't2026010045a', status: '已交卷', gradedStatus: '已批阅', score: 4 },
      { id: 103, name: '林静媛', account: 't2026010067b', status: '已交卷', gradedStatus: '待批阅', score: 0 },
      { id: 104, name: '王志军', account: 't2026010082c', status: '已交卷', gradedStatus: '待批阅', score: 0 },
      { id: 105, name: '李瑞杰', account: 't2026010103d', status: '已交卷', gradedStatus: '已批阅', score: 3 }
    ];
    setSubmissions(mockSubs);
  };

  // Open single student grading dialog
  const handleStartGrade = (student: StudentSubmission) => {
    if (student.status !== '已交卷') {
      showToast('该考生尚未交卷，无法批阅', 'error');
      return;
    }
    setGradingStudent(student);
    setScoreInput(student.score !== null ? student.score.toString() : '0');
    setCommentInput('');
  };

  // Refresh candidates handler
  const handleRefreshCandidates = () => {
    setCandQuery('');
    showToast('已刷新数据', 'success');
  };

  // View exam handler
  const handleViewExam = (sub: StudentSubmission) => {
    showToast(`正在打开考生 ${sub.name} 的答卷详情...`, 'info');
  };

  // Save single student score
  const handleSaveScore = () => {
    if (!scoreInput.trim() || isNaN(Number(scoreInput))) {
      showToast('请输入有效的分数', 'error');
      return;
    }
    const scoreVal = Number(scoreInput);
    if (scoreVal < 0 || scoreVal > 4) {
      showToast('分数必须在 0 到 4 之间', 'error');
      return;
    }

    // Update submissions list
    const updatedSubs = submissions.map(sub => 
      sub.id === gradingStudent!.id 
        ? { ...sub, gradedStatus: '已批阅' as const, score: scoreVal } 
        : sub
    );
    setSubmissions(updatedSubs);

    // Update parent tasks counters
    if (selectedTask) {
      const isNewlyGraded = gradingStudent!.gradedStatus === '待批阅';
      setTasksList(tasksList.map(t => 
        t.id === selectedTask.id 
          ? { 
              ...t, 
              gradedCount: isNewlyGraded ? t.gradedCount + 1 : t.gradedCount,
              pendingCount: isNewlyGraded ? Math.max(0, t.pendingCount - 1) : t.pendingCount
            } 
          : t
      ));
      
      // Sync selected task counter
      setSelectedTask({
        ...selectedTask,
        gradedCount: isNewlyGraded ? selectedTask.gradedCount + 1 : selectedTask.gradedCount,
        pendingCount: isNewlyGraded ? Math.max(0, selectedTask.pendingCount - 1) : selectedTask.pendingCount
      });
    }

    showToast(`已成功录入考生 ${gradingStudent!.name} 的成绩：${scoreVal}分`, 'success');
    setGradingStudent(null);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-white border border-neutral-100 shadow-xl rounded-lg px-4 py-3 flex items-center gap-2 animate-bounce-short text-left">
          <div className={cn(
            "w-2 h-2 rounded-full",
            toastMessage.type === 'success' ? "bg-green-500" : toastMessage.type === 'error' ? "bg-red-500" : "bg-blue-500"
          )}></div>
          <span className="text-sm font-bold text-neutral-800">{toastMessage.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4 text-left">
        <div className="flex items-end gap-4">
          <h1 className="text-xl font-bold text-neutral-900">批阅管理</h1>
          <p className="text-sm text-neutral-500 mb-0.5">主客观题人工批改与反馈进度管理</p>
        </div>
      </div>

      {/* Table and Toolbar unified module */}
      <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden text-left">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="请输入要搜索的考试/场次"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
            <thead>
              <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none">
                <th className="pl-6 pr-3 py-3.5 font-medium text-left bg-transparent">考试名称</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">场次名称</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">考场</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">考试时间</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">已批阅人数</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">待批阅人数</th>
                <th className="pl-3 pr-6 py-3.5 font-medium text-center bg-transparent w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task, idx) => (
                  <tr 
                    key={task.id} 
                    className={cn(
                      "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                      idx === paginatedTasks.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="pl-6 pr-3 py-3.5 font-medium text-neutral-850 max-w-[220px] truncate" title={task.examName}>
                      {task.examName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-650 max-w-[150px] truncate" title={task.sessionName}>
                      {task.sessionName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-550 max-w-[150px] truncate" title={task.roomName}>
                      {task.roomName}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-500 font-mono">
                      {task.time}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-neutral-700">
                      <span className="text-[#52c41a]">{task.gradedCount}</span>
                    </td>
                    <td className="px-3 py-3.5 font-medium">
                      {task.pendingCount > 0 ? (
                        <span className="text-[#fa541c] font-bold">{task.pendingCount}</span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>
                    <td className="pl-3 pr-6 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenGrading(task)}
                        className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap"
                      >
                        批阅
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 bg-white select-none">
                    暂无待批阅的考试场次
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar matching Course management list styles */}
        {totalTasks > 0 && (
          <div className="flex items-center justify-end px-6 py-4 border-t border-neutral-border/30 select-none bg-neutral-50/20 gap-4">
            <span className="text-[13px] text-neutral-500">
              共 {totalTasks} 条
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                &lt;
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button 
                  key={pageNum}
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-7 w-7 p-0 rounded-sm font-bold text-[12px] cursor-pointer",
                    currentPage === pageNum 
                      ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#fa541c] hover:text-white" 
                      : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                  )}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                &gt;
              </Button>
            </div>
            <select 
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>{size} 条/页</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grading Workspace Drawer (Right Side) */}
      {isDrawerOpen && selectedTask && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[720px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#fa541c]" /> 
                  批阅控制台 - {selectedTask.examName}
                </h2>
                <p className="text-[11px] text-neutral-400">场次：{selectedTask.sessionName} | 考场：{selectedTask.roomName}</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Candidates Submission List - Styled to match main page table and pagination */}
            <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4 custom-scrollbar flex flex-col">
              {/* Filter row */}
              <div className="flex justify-between items-center select-none gap-4">
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    value={candQuery}
                    onChange={(e) => {
                      setCandQuery(e.target.value);
                      setDrawerPage(1);
                    }}
                    className="pl-9 pr-4 py-1.5 w-full bg-white border border-neutral-border rounded-full text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400 h-8"
                  />
                </div>
                <Button
                  onClick={handleRefreshCandidates}
                  variant="outline"
                  className="border border-neutral-200 text-neutral-500 rounded-[4px] h-8 w-8 p-0 flex items-center justify-center bg-white hover:bg-neutral-50 cursor-pointer shrink-0"
                  title="刷新"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                  <thead>
                    <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none">
                      <th className="pl-6 pr-3 py-3.5 font-medium text-left bg-transparent">账号</th>
                      <th className="px-3 py-3.5 font-medium text-left bg-transparent">姓名</th>
                      <th className="px-3 py-3.5 font-medium text-left bg-transparent">批阅状态</th>
                      <th className="px-3 py-3.5 font-medium text-left bg-transparent">得分 / 总分</th>
                      <th className="pl-3 pr-6 py-3.5 font-medium text-center bg-transparent w-36">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
                    {paginatedSubmissions.length > 0 ? (
                      paginatedSubmissions.map((sub, idx) => (
                        <tr 
                          key={sub.id} 
                          className={cn(
                            "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                            idx === paginatedSubmissions.length - 1 && "border-b-0"
                          )}
                        >
                          <td className="pl-6 pr-3 py-3.5 text-neutral-850 font-mono">{sub.account}</td>
                          <td className="px-3 py-3.5 font-medium text-[#262626]">{sub.name}</td>
                          <td className="px-3 py-3.5">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium border select-none",
                              sub.gradedStatus === '已批阅' 
                                ? "text-[#52c41a] bg-[#f6ffed] border-[#d9f7be]" 
                                : "text-neutral-500 bg-neutral-50 border-neutral-200/60"
                            )}>
                              {sub.gradedStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 font-mono text-neutral-500">
                            {sub.score !== null ? `${sub.score} / 4` : '0 / 4'}
                          </td>
                          <td className="pl-3 pr-6 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2 text-neutral-300 select-none">
                              <button
                                onClick={() => handleViewExam(sub)}
                                className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 text-[11px] font-semibold transition-colors"
                              >
                                查看试卷
                              </button>
                              <span>|</span>
                              <button
                                onClick={() => handleStartGrade(sub)}
                                className="text-[#fa541c] hover:text-[#e84a15] bg-transparent border-0 cursor-pointer p-0 text-[11px] font-semibold transition-colors"
                              >
                                变更批阅状态
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-400 bg-white select-none">
                          没有找到符合条件的考生
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Drawer Pagination matching main list page pagination */}
              {totalDrawerItems > 0 && (
                <div className="flex items-center justify-end px-6 py-4 border-t border-neutral-border/30 select-none bg-neutral-50/20 gap-4 mt-2 rounded-[8px]">
                  <span className="text-[13px] text-neutral-500">
                    共 {totalDrawerItems} 条
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={drawerPage === 1}
                      onClick={() => setDrawerPage(p => Math.max(1, p - 1))}
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalDrawerPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button 
                        key={pageNum}
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "h-7 w-7 p-0 rounded-sm font-bold text-[12px] cursor-pointer",
                          drawerPage === pageNum 
                            ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#fa541c] hover:text-white" 
                            : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200"
                        )}
                        onClick={() => setDrawerPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0 rounded-sm bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" 
                      disabled={drawerPage === totalDrawerPages}
                      onClick={() => setDrawerPage(p => Math.min(totalDrawerPages, p + 1))}
                    >
                      &gt;
                    </Button>
                  </div>
                  <select 
                    value={drawerPageSize}
                    onChange={(e) => {
                      setDrawerPageSize(Number(e.target.value));
                      setDrawerPage(1);
                    }}
                    className="text-[13px] border border-neutral-200 rounded-sm px-2 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white"
                  >
                    {[5, 10, 20].map(size => (
                      <option key={size} value={size}>{size} 条/页</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end shrink-0">
              <Button 
                onClick={() => setIsDrawerOpen(false)} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                关闭工作台
              </Button>
            </div>

            {/* Inner Sub-Drawer for Student Grading Panel */}
            {gradingStudent && (
              <div className="absolute inset-0 z-50 bg-black/45 flex justify-end animate-fade-in">
                <div className="bg-white w-full max-w-[460px] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
                    <h3 className="text-[15px] font-bold text-neutral-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#fa541c]" />
                      批阅：{gradingStudent.name} ({gradingStudent.account})
                    </h3>
                    <button 
                      onClick={() => setGradingStudent(null)} 
                      className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <div className="p-6 flex-1 space-y-5 overflow-y-auto">
                    <div className="bg-[#fff7e6] border border-[#ffd591] text-[#d4380d] p-3.5 rounded-[4px] text-xs font-semibold">
                      请仔细核对该考生的实训云端运行状态与提交的代码包，确认无误后输入评分。
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1 select-none">
                        打分 (满分 4 分) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        placeholder="请输入考生成绩分数"
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-neutral-700 flex items-center gap-1 select-none">
                        评语与反馈建议
                      </label>
                      <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="请输入对考生的主观评语或修改建议..."
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
                    <Button 
                      onClick={() => setGradingStudent(null)} 
                      variant="outline"
                      className="border-neutral-200 text-neutral-600 font-bold h-9 px-4 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handleSaveScore}
                      className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
                    >
                      保存评分
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
