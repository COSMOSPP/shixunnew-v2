import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, RotateCcw, Send, Play, Square, FastForward,
  Folder, FileText, Database, List, ChevronRight, ChevronDown,
  Terminal, Hash, FileCode, MonitorPlay, ChevronLeft, Plus, Save,
  Users, Check, Search, User, BookOpen, Sparkles, Cpu, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TeacherExperimentIDEProps {
  onBack?: () => void;
}

export default function TeacherExperimentIDE({ onBack }: TeacherExperimentIDEProps = {}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('launcher');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'python': true,
    'numbers': true
  });
  const [showCollaboratorDropdown, setShowCollaboratorDropdown] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showResetFilesModal, setShowResetFilesModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [selectedResetAll, setSelectedResetAll] = useState(false);
  const [selectedResetFile, setSelectedResetFile] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>(['孙昕教师']);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState('course');
  const [activeRightTab, setActiveRightTab] = useState<string | null>('guide');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user', text: string }>>([
    { sender: 'user', text: 'sklearn库怎么导入？' },
    { sender: 'ai', text: '您可以使用 `from sklearn.linear_model import LinearRegression` 来导入线性回归模型。' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [cpuUsage, setCpuUsage] = useState(24.5);
  const [ramUsage, setRamUsage] = useState(3.14);

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    
    setTimeout(() => {
      let aiText = '';
      if (userMsg.includes('报错') || userMsg.includes('error')) {
        aiText = '常见的拟合报错是由于特征维度（X）输入了一维数组。请使用 `X.values.reshape(-1, 1)` 将特征进行升维。';
      } else if (userMsg.includes('销量') || userMsg.includes('回归')) {
        aiText = '智能音箱销量的线性拟合代码为：\n```python\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(model.score(X, y))\n```';
      } else {
        aiText = `收到您的消息！关于“${userMsg}”，请确保您的实训数据集 speaker_test_regression.csv 已经挂载。我可以帮您快速生成回归计算的测试脚本！`;
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 600);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = (Math.random() - 0.5) * 4;
        const next = prev + delta;
        return next < 10 ? 10 : next > 60 ? 45 : next;
      });
      setRamUsage(prev => {
        const delta = (Math.random() - 0.5) * 0.05;
        const next = prev + delta;
        return next < 2.5 ? 2.5 : next > 4.5 ? 3.5 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const candidates = [
    { name: '李明教师', dept: '计算机科学与技术学院', avatar: '👨‍🏫' },
    { name: '王华教师', dept: '人工智能学院', avatar: '👩‍🏫' },
    { name: '赵磊教师', dept: '软件工程系', avatar: '👨‍💻' },
    { name: '陈芳教师', dept: '数据科学系', avatar: '👩‍💻' },
  ].filter(t => 
    !collaborators.includes(t.name) && 
    (t.name.includes(collaboratorSearch) || t.dept.includes(collaboratorSearch))
  );

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 bg-white z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-neutral-500" /> 返回
          </button>
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>
          <h1 className="text-[14px] font-bold text-neutral-800">智能音箱产品的数据分析与优化[3.1.1]</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Avatar with Status and Dropdown */}
          <div className="relative">
            <div 
              onClick={() => setShowCollaboratorDropdown(!showCollaboratorDropdown)}
              className="w-9 h-9 rounded-full bg-[#fa541c]/10 hover:bg-[#fa541c]/20 flex items-center justify-center cursor-pointer border border-[#fa541c]/30 relative shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-[#e8a27c] flex items-center justify-center text-white font-bold select-none">
                <span className="text-xs">🦞</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neutral-300 rounded-full border-2 border-white"></div>
            </div>
            
            {showCollaboratorDropdown && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setShowCollaboratorDropdown(false)}></div>
                <div className="absolute right-0 top-11 w-64 bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg py-3 z-[70] animation-slide-up">
                  <div className="px-4 pb-2 border-b border-neutral-100 flex items-center justify-between text-[13px] text-neutral-500 font-bold">
                    <span>协作成员 (1/{collaborators.length})</span>
                  </div>
                  <div className="pt-2 px-2 max-h-[240px] overflow-y-auto space-y-0.5">
                    {collaborators.map((name, idx) => (
                      <div key={name} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 cursor-default transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center relative",
                              idx === 0 ? "bg-[#e8a27c]" : "bg-neutral-100 text-neutral-600"
                            )}>
                              {idx === 0 ? (
                                <>
                                  <span className="text-xs">🦞</span>
                                  <span className="absolute -top-2.5 -right-0.5 text-xs text-amber-400">👑</span>
                                </>
                              ) : (
                                <span className="text-xs font-bold">{name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-neutral-300 rounded-full border-2 border-white"></div>
                          </div>
                          <span className="text-[13px] font-bold text-neutral-800">{name}</span>
                        </div>
                        {idx !== 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCollaborators(prev => prev.filter(c => c !== name));
                            }}
                            className="text-neutral-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                            title="移除协作者"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Collaborator Member Button */}
          <button 
            onClick={() => setShowAddMemberModal(true)}
            className="w-8 h-8 rounded-full border border-[#fa541c] hover:bg-orange-50 text-[#fa541c] flex items-center justify-center transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-200"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setSelectedResetAll(false);
                setSelectedResetFile(false);
                setShowResetFilesModal(true);
              }}
              variant="outline" 
              className="h-8 border-[#fa541c] text-[#fa541c] hover:bg-orange-50 hover:border-[#fa541c] rounded-md px-4 text-[13px] font-bold bg-transparent transition-all"
            >
              重置文件
            </Button>
            <Button 
              onClick={() => setShowRestartModal(true)}
              className="h-8 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-md px-4 text-[13px] font-bold shadow-sm shadow-orange-500/10"
            >
              重启
            </Button>
          </div>
        </div>
      </header>

      {/* Classic Jupyter Menubar */}
      <div className="h-8 border-b border-neutral-100 bg-[#fbfbfb] flex items-center px-4 gap-4 text-[12px] text-neutral-500 shrink-0 select-none">
        {['File', 'Edit', 'View', 'Run', 'Kernel', 'Tabs', 'Help'].map((menu) => (
          <span key={menu} className="cursor-pointer hover:text-neutral-800 transition-colors font-medium">{menu}</span>
        ))}
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Primary Icons */}
        <div className="w-14 border-r border-neutral-200 bg-neutral-50 flex flex-col items-center py-4 gap-6 shrink-0">
          <button 
            onClick={() => setActiveLeftTab('course')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeLeftTab === 'course' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeLeftTab === 'course' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-r"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeLeftTab === 'course' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] font-bold">课程</span>
          </button>
          
          <button 
            onClick={() => setActiveLeftTab('files')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeLeftTab === 'files' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeLeftTab === 'files' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-r"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeLeftTab === 'files' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">文件</span>
          </button>

          <button 
            onClick={() => setActiveLeftTab('datasets')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeLeftTab === 'datasets' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeLeftTab === 'datasets' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-r"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeLeftTab === 'datasets' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">数据集</span>
          </button>

          <button 
            onClick={() => setActiveLeftTab('outline')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeLeftTab === 'outline' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeLeftTab === 'outline' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-r"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeLeftTab === 'outline' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <List className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">目录</span>
          </button>
        </div>

        {/* Left Sidebar - Secondary Content Panels */}
        {activeLeftTab === 'course' && (
          <div className="w-64 border-r border-neutral-200 bg-white flex flex-col shrink-0">
            <div className="h-10 border-b border-neutral-100 flex items-center px-4">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">智能音箱产品的数据分析与优化[3.1.1].IPYNB</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-neutral-600">
                <ChevronLeftIcon className="w-4 h-4" />
                <Folder className="w-4 h-4 text-blue-400 fill-current" />
                <span className="text-[13px]">M↓</span>
              </div>
              
              <div className="mt-2">
                <div 
                  className="flex items-center gap-1 p-1.5 hover:bg-neutral-100 rounded cursor-pointer"
                  onClick={() => toggleFolder('python')}
                >
                  {expandedFolders['python'] ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                  <span className="text-[13px] font-bold text-neutral-800">Python 基础数据类型</span>
                </div>
                
                {expandedFolders['python'] && (
                  <div className="pl-6 space-y-0.5 mt-1">
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">第一行 Python 代码</div>
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">常用数据类型</div>
                    
                    <div 
                      className="flex items-center gap-1 p-1.5 hover:bg-neutral-100 rounded cursor-pointer mt-1"
                      onClick={() => toggleFolder('numbers')}
                    >
                      {expandedFolders['numbers'] ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                      <span className="text-[13px] font-bold text-neutral-800">数字</span>
                    </div>
                    
                    {expandedFolders['numbers'] && (
                      <div className="pl-5 space-y-0.5">
                        <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">整型</div>
                        <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">浮点数</div>
                        <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">交互计算</div>
                        <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">简单的数学函数</div>
                        <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">其他表示</div>
                      </div>
                    )}
                    
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600 mt-1">布尔型</div>
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">变量赋值</div>
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">字符串</div>
                    <div className="p-1.5 hover:bg-neutral-100 rounded cursor-pointer text-[13px] text-neutral-600">类型转换</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeLeftTab === 'files' && (
          <div className="w-64 border-r border-neutral-200 bg-white flex flex-col shrink-0">
            <div className="h-10 border-b border-neutral-100 flex items-center justify-between px-4 shrink-0">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">项目文件 (WORKSPACE)</span>
              <button 
                onClick={() => triggerToast('正在新建文件...')}
                className="text-neutral-400 hover:text-[#fa541c] p-1 rounded hover:bg-neutral-50"
                title="新建文件"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div>
                <div 
                  onClick={() => setExpandedFolders(prev => ({ ...prev, src: !prev.src }))}
                  className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer select-none"
                >
                  {expandedFolders.src ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                  <Folder className="w-4 h-4 text-orange-400 fill-current" />
                  <span className="text-[13px] font-bold text-neutral-700">src</span>
                </div>
                {expandedFolders.src && (
                  <div className="pl-6 space-y-0.5 mt-0.5">
                    <div className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600">
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <span>main.py</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600">
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <span>utils.py</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div 
                  onClick={() => setExpandedFolders(prev => ({ ...prev, data: !prev.data }))}
                  className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer select-none"
                >
                  {expandedFolders.data ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                  <Folder className="w-4 h-4 text-orange-400 fill-current" />
                  <span className="text-[13px] font-bold text-neutral-700">data</span>
                </div>
                {expandedFolders.data && (
                  <div className="pl-6 space-y-0.5 mt-0.5">
                    <div 
                      onClick={() => triggerToast('已加载并检视 user_feedback_log.csv')}
                      className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>user_feedback_log.csv</span>
                    </div>
                    <div 
                      onClick={() => triggerToast('已加载并检视 speaker_parameters.json')}
                      className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>speaker_parameters.json</span>
                    </div>
                  </div>
                )}
              </div>

              <div 
                onClick={() => setActiveTab('notebook')}
                className={cn(
                  "flex items-center gap-1.5 p-1.5 rounded cursor-pointer select-none border transition-colors",
                  activeTab === 'notebook' 
                    ? "bg-orange-50/50 border-orange-200 text-[#fa541c] font-bold" 
                    : "hover:bg-neutral-50 border-transparent text-neutral-700"
                )}
              >
                <div className="w-4 h-4 rounded border border-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-sm"></div>
                </div>
                <span className="text-[13px] truncate">智能音箱产品的数据分析与优化.ipynb</span>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>requirements.txt</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 hover:bg-neutral-50 rounded cursor-pointer text-[13px] text-neutral-600">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>README.md</span>
              </div>
            </div>
          </div>
        )}

        {activeLeftTab === 'datasets' && (
          <div className="w-64 border-r border-neutral-200 bg-white flex flex-col shrink-0">
            <div className="h-10 border-b border-neutral-100 flex items-center justify-between px-4 shrink-0">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">数据集仓库 (DATASETS)</span>
              <button 
                onClick={() => triggerToast('正在上传数据集...')}
                className="text-neutral-400 hover:text-[#fa541c] p-1 rounded hover:bg-neutral-50"
                title="上传数据集"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-2 border-b border-neutral-100 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="搜索公共/项目数据集..." 
                  className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-neutral-200 rounded-md focus:outline-none focus:border-[#fa541c]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-neutral-400 px-1 uppercase tracking-wider">公共数据集</div>
                {[
                  { name: '智能音箱销量与评分历史数据.csv', rows: '15,200 条数据', size: '1.4 MB' },
                  { name: '用户唤醒与交互对话音频数据.zip', rows: '音频包文件', size: '452 MB' },
                  { name: '音响元器件使用寿命数据.xlsx', rows: '2,500 条数据', size: '85 KB' },
                ].map(d => (
                  <div key={d.name} className="p-2 border border-neutral-100 rounded-lg hover:border-orange-200 hover:bg-orange-50/10 transition-colors group">
                    <div className="text-[12px] font-bold text-neutral-700 truncate">{d.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                      <span>{d.rows} • {d.size}</span>
                      <button 
                        onClick={() => triggerToast(`已成功将 '${d.name}' 导入当前工作区！`)}
                        className="text-[#fa541c] hover:underline font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        导入
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-neutral-400 px-1 uppercase tracking-wider">我的项目数据集</div>
                <div className="p-2 border border-orange-100 bg-orange-50/10 rounded-lg">
                  <div className="text-[12px] font-bold text-[#fa541c] truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#fa541c] rounded-full shrink-0"></span>
                    speaker_test_regression.csv
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                    <span>5,000 条数据 • 1.2 MB</span>
                    <span className="text-orange-400 font-bold">已挂载</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeLeftTab === 'outline' && (
          <div className="w-64 border-r border-neutral-200 bg-white flex flex-col shrink-0">
            <div className="h-10 border-b border-neutral-100 flex items-center px-4">
              <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">文档大纲 (OUTLINE)</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {[
                { id: '1', level: 1, title: '智能音箱数据分析与回归优化' },
                { id: '2', level: 2, title: '1. 数据集准备与清洗' },
                { id: '3', level: 3, title: '1.1 导入第三方依赖包' },
                { id: '4', level: 3, title: '1.2 加载音箱历史销量数据' },
                { id: '5', level: 2, title: '2. 探索性数据分析 (EDA)' },
                { id: '6', level: 3, title: '2.1 销量与评分散点图分布' },
                { id: '7', level: 2, title: '3. 线性回归模型构建' },
                { id: '8', level: 3, title: '3.1 划分训练集与测试集' },
                { id: '9', level: 3, title: '3.2 拟合模型回归线' },
                { id: '10', level: 2, title: '4. 模型评估与预测优化' },
              ].map(h => (
                <div 
                  key={h.id}
                  onClick={() => triggerToast(`定位到章节: ${h.title}`)}
                  className={cn(
                    "p-1.5 hover:bg-neutral-50 rounded cursor-pointer select-none text-[13px] truncate transition-colors",
                    h.level === 1 ? "font-bold text-neutral-800" : h.level === 2 ? "pl-4 text-neutral-700 font-medium" : "pl-8 text-neutral-500"
                  )}
                >
                  {h.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
          {/* Tabs */}
          <div className="flex items-center border-b border-neutral-200 bg-neutral-100 px-2 pt-2 gap-1 shrink-0 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('notebook')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[13px] rounded-t-lg border border-b-0 transition-colors shrink-0",
                activeTab === 'notebook' 
                  ? "bg-white text-neutral-800 border-neutral-200 relative z-10" 
                  : "bg-neutral-100/50 text-neutral-500 border-transparent hover:bg-neutral-200"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-[#fa541c]"></div> 智能音箱产品的数据分析与优化[3.1.1].ipynb <X className="w-3 h-3 ml-2 opacity-50 hover:opacity-100" />
            </button>
            <button 
              onClick={() => setActiveTab('launcher')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[13px] rounded-t-lg border border-b-0 transition-colors shrink-0",
                activeTab === 'launcher' 
                  ? "bg-white text-neutral-800 border-neutral-200 relative z-10" 
                  : "bg-neutral-100/50 text-neutral-500 border-transparent hover:bg-neutral-200"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div> Launcher <X className="w-3 h-3 ml-2 opacity-50 hover:opacity-100" />
            </button>
          </div>

          {/* Launcher Content */}
          <div className="flex-1 bg-white overflow-y-auto p-8 relative">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-neutral-800 mb-8">智能音箱产品的数据分析与优化[3.1.1]</h2>

              {/* Notebook Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <div className="w-6 h-6 rounded bg-[#fa541c] text-white flex items-center justify-center font-bold text-[10px]">&lt;&gt;</div>
                  <h3 className="text-[15px] font-bold text-neutral-800">Notebook</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl font-bold">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Python 3</span>
                  </div>
                </div>
              </div>

              {/* Console Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">&gt;_</div>
                  <h3 className="text-[15px] font-bold text-neutral-800">Console</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl font-bold">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Python 3</span>
                  </div>
                </div>
              </div>

              {/* Other Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-2">
                  <h3 className="text-[15px] font-bold text-neutral-800">Other</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-neutral-800 text-white flex items-center justify-center font-bold text-[14px]">$_</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Terminal</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-neutral-400 text-white flex items-center justify-center font-bold text-[16px]">T</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Text File</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded bg-purple-500 text-white flex items-center justify-center font-bold text-[16px]">M<span className="text-[10px] ml-0.5">↓</span></div>
                    <span className="text-[13px] text-neutral-600 font-medium">Markdown ...</span>
                  </div>
                  <div className="w-32 h-32 border border-neutral-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center bg-white gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-[16px]">P</div>
                    <span className="text-[13px] text-neutral-600 font-medium">Py File</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Collapsible Panel */}
        {activeRightTab && (
          <div className="w-72 border-l border-neutral-200 bg-white flex flex-col shrink-0 z-10 relative animation-slide-left">
            {/* Header */}
            <div className="h-10 border-b border-neutral-100 flex items-center justify-between px-4 shrink-0 bg-neutral-50/50">
              <span className="text-[12px] font-bold text-neutral-700 flex items-center gap-1.5 select-none">
                {activeRightTab === 'guide' && (
                  <>
                    <BookOpen className="w-4 h-4 text-[#fa541c]" />
                    <span>实训指导手册 (GUIDE)</span>
                  </>
                )}
                {activeRightTab === 'chat' && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#fa541c]" />
                    <span>AI 答疑助手 (CO-PILOT)</span>
                  </>
                )}
                {activeRightTab === 'monitor' && (
                  <>
                    <Cpu className="w-4 h-4 text-[#fa541c]" />
                    <span>系统容器监控 (MONITOR)</span>
                  </>
                )}
              </span>
              <button 
                onClick={() => setActiveRightTab(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* Tab 1: Guide */}
              {activeRightTab === 'guide' && (
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50/40 border border-orange-100 rounded-lg">
                    <h4 className="text-[13px] font-bold text-[#fa541c]">任务 1: 拟合智能音箱的回归曲线</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      在此实训中，您需要引导学生理解线性回归在产品优化中的意义。当前目标是预测智能音箱产品在不同评分下的销量表现。
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="text-[12px] font-bold text-neutral-800 uppercase tracking-wider">实训执行步骤</h5>
                    <ol className="space-y-2 text-[12px] text-neutral-600 pl-4 list-decimal leading-relaxed">
                      <li>导入必要的 Python 数据分析和科学计算库。</li>
                      <li>加载 data/speaker_parameters.json 数据文件，检视列分布。</li>
                      <li>利用 sklearn 的 LinearRegression 类拟合销量和评分的线性关系。</li>
                      <li>输出 R² 回归判定系数，并画出回归预测线图表。</li>
                    </ol>
                  </div>

                  <div className="h-px bg-neutral-100"></div>

                  <div className="space-y-2">
                    <h5 className="text-[12px] font-bold text-neutral-800 uppercase tracking-wider">任务进度检视清单</h5>
                    <div className="space-y-2">
                      {[
                        { id: 't1', text: '导入 pandas 与 numpy 数据分析库', completed: true },
                        { id: 't2', text: '清洗并处理评分数据空值', completed: false },
                        { id: 't3', text: '拟合并计算 R² 判定系数', completed: false },
                      ].map(t => (
                        <div 
                          key={t.id}
                          className="flex items-center gap-2 text-[12px] text-neutral-600 select-none cursor-pointer"
                          onClick={() => triggerToast('此为教师课时配置视图')}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                            t.completed ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300"
                          )}>
                            {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={cn(t.completed && "line-through text-neutral-400")}>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Chat */}
              {activeRightTab === 'chat' && (
                <div className="flex flex-col h-full space-y-4">
                  {/* Messages container */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1 text-[12px]">
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs shrink-0 select-none">🤖</div>
                      <div className="bg-neutral-100 p-2.5 rounded-lg rounded-tl-none text-neutral-700 leading-relaxed max-w-[85%]">
                        您好！我是实训 AI 答疑助手。
                        如果您在本次线性回归实训或 sklearn 代码拟合中遇到任何错误，都可以直接发给我，我会全力为您解答！
                      </div>
                    </div>
                    
                    {chatMessages.map((m, idx) => (
                      <div key={idx} className={cn("flex gap-2 items-start", m.sender === 'user' ? "justify-end" : "justify-start")}>
                        {m.sender === 'ai' && <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs shrink-0 select-none">🤖</div>}
                        <div className={cn(
                          "p-2.5 rounded-lg leading-relaxed max-w-[85%]",
                          m.sender === 'user' 
                            ? "bg-[#fa541c] text-white rounded-tr-none" 
                            : "bg-neutral-100 text-neutral-700 rounded-tl-none"
                        )}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input container */}
                  <div className="border-t border-neutral-100 pt-3 flex gap-2">
                    <input 
                      type="text"
                      placeholder="问点什么，比如：导入sklearn报错..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && chatInput.trim()) {
                          handleSendChatMessage();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-[12px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c]"
                    />
                    <button 
                      onClick={handleSendChatMessage}
                      className="w-7 h-7 rounded-full bg-[#fa541c] text-white flex items-center justify-center hover:bg-[#e84a15] transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Monitor */}
              {activeRightTab === 'monitor' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[12px] font-bold text-neutral-700">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        CPU 使用率
                      </span>
                      <span className="text-[#fa541c]">{cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#fa541c] transition-all duration-500" 
                        style={{ width: `${cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[12px] font-bold text-neutral-700">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-orange-500" />
                        内存占用 (RAM)
                      </span>
                      <span>{ramUsage.toFixed(2)} GB / 16.0 GB</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#fa541c] transition-all duration-500" 
                        style={{ width: `${(ramUsage/16.0)*100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 space-y-2 text-[12px] select-none">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">运行环境状态</span>
                      <span className="font-bold text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        运行中 (Active)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">GPU 动态卡片</span>
                      <span className="font-medium text-neutral-500">未启用</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">容器 IP 地址</span>
                      <span className="font-medium text-neutral-600">172.18.0.4</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => triggerToast('正在导出系统运行日志...')}
                    className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-lg text-[12px] font-bold transition-all"
                  >
                    导出系统日志
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Right Sidebar - Primary Strip Triggers */}
        <div className="w-14 border-l border-neutral-200 bg-neutral-50 flex flex-col items-center py-4 gap-6 shrink-0">
          <button 
            onClick={() => setActiveRightTab(activeRightTab === 'guide' ? null : 'guide')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeRightTab === 'guide' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeRightTab === 'guide' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-l"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeRightTab === 'guide' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">指导</span>
          </button>

          <button 
            onClick={() => setActiveRightTab(activeRightTab === 'chat' ? null : 'chat')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeRightTab === 'chat' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeRightTab === 'chat' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-l"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeRightTab === 'chat' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">助手</span>
          </button>

          <button 
            onClick={() => setActiveRightTab(activeRightTab === 'monitor' ? null : 'monitor')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all group relative w-full py-1",
              activeRightTab === 'monitor' ? "text-[#fa541c]" : "text-neutral-500 hover:text-[#fa541c]"
            )}
          >
            {activeRightTab === 'monitor' && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#fa541c] rounded-l"></div>}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              activeRightTab === 'monitor' ? "bg-orange-100" : "group-hover:bg-neutral-100"
            )}>
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">监控</span>
          </button>
        </div>
      </div>

      {/* 添加协作成员 Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden border border-neutral-100 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#fa541c] rounded-full shrink-0"></div>
                添加协作成员
              </h2>
              <button 
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedTeachers([]);
                  setCollaboratorSearch('');
                }} 
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input 
                  type="text"
                  placeholder="搜索教师姓名或专业部门..."
                  value={collaboratorSearch}
                  onChange={(e) => setCollaboratorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-[13px] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] transition-all bg-neutral-50/35"
                />
              </div>

              <div className="max-h-[220px] overflow-y-auto pr-1 space-y-1.5 min-h-[120px]">
                {candidates.length > 0 ? (
                  candidates.map((teacher) => {
                    const isChecked = selectedTeachers.includes(teacher.name);
                    return (
                      <div 
                        key={teacher.name}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedTeachers(prev => prev.filter(name => name !== teacher.name));
                          } else {
                            setSelectedTeachers(prev => [...prev, teacher.name]);
                          }
                        }}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-all",
                          isChecked 
                            ? "border-orange-200 bg-orange-50/40" 
                            : "border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm border border-neutral-200/50 select-none">
                            {teacher.avatar}
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-neutral-800">{teacher.name}</div>
                            <div className="text-[11px] text-neutral-400">{teacher.dept}</div>
                          </div>
                        </div>
                        
                        <div className={cn(
                          "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors",
                          isChecked ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300 bg-white"
                        )}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-neutral-400 gap-2">
                    <Users className="w-8 h-8 text-neutral-300 stroke-[1.5]" />
                    <span className="text-[12px]">暂无符合条件的可用协作教师</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button 
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSelectedTeachers([]);
                    setCollaboratorSearch('');
                  }}
                  className="px-5 py-1.5 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-full text-[13px] font-bold transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (selectedTeachers.length > 0) {
                      setCollaborators(prev => [...prev, ...selectedTeachers]);
                      setShowAddMemberModal(false);
                      triggerToast(`成功添加 ${selectedTeachers.length} 位协作成员`);
                      setSelectedTeachers([]);
                      setCollaboratorSearch('');
                    }
                  }}
                  disabled={selectedTeachers.length === 0}
                  className={cn(
                    "px-5 py-1.5 rounded-full text-[13px] font-bold transition-all shadow-sm",
                    selectedTeachers.length > 0 
                      ? "bg-[#fa541c] hover:bg-[#e84a15] text-white cursor-pointer shadow-orange-500/10" 
                      : "bg-neutral-50 text-neutral-300 cursor-not-allowed border border-neutral-200"
                  )}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 重置文件 Modal */}
      {showResetFilesModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] overflow-hidden p-8 flex flex-col gap-6">
            <div className="flex items-start gap-3">
              {/* Thick vertical orange bar as requested */}
              <div className="w-[5px] h-7 bg-[#fa541c] rounded-full shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <h2 className="text-[20px] font-bold text-neutral-800 tracking-wide leading-7">重置文件</h2>
                <p className="text-[13px] text-neutral-400 mt-1">所选文件重置后将恢复到初始状态，可提前复制备份。</p>
              </div>
            </div>

            <div className="space-y-1">
              {/* Select All Checkbox */}
              <div 
                className="flex items-center gap-3 py-3 border-b border-neutral-100 cursor-pointer select-none" 
                onClick={() => {
                  const nextVal = !selectedResetAll;
                  setSelectedResetAll(nextVal);
                  setSelectedResetFile(nextVal);
                }}
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors",
                  selectedResetAll ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300 bg-white"
                )}>
                  {selectedResetAll && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-[14px] text-neutral-600 font-medium">全选</span>
              </div>

              {/* Jupyter File Checkbox */}
              <div 
                className="flex items-center gap-3 py-4 cursor-pointer select-none" 
                onClick={() => {
                  const nextVal = !selectedResetFile;
                  setSelectedResetFile(nextVal);
                  if (!nextVal) {
                    setSelectedResetAll(false);
                  } else {
                    setSelectedResetAll(true);
                  }
                }}
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors",
                  selectedResetFile ? "border-[#fa541c] bg-[#fa541c] text-white" : "border-neutral-300 bg-white"
                )}>
                  {selectedResetFile && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                
                {/* File Details: Notebook Orange Icon & Text */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-orange-500 bg-orange-50 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-sm"></div>
                  </div>
                  <span className="text-[14px] text-neutral-700 font-medium">线性回归实训-预测考试分数.ipynb</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowResetFilesModal(false)}
                className="px-6 py-1.5 border border-[#fa541c] text-[#fa541c] hover:bg-orange-50 rounded-full text-[14px] font-bold transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (selectedResetFile) {
                    setShowResetFilesModal(false);
                    triggerToast('所选文件已成功重置至初始状态');
                  }
                }}
                disabled={!selectedResetFile}
                className={cn(
                  "px-6 py-1.5 rounded-full text-[14px] font-bold transition-all shadow-sm",
                  selectedResetFile 
                    ? "bg-[#fa541c] hover:bg-[#e84a15] text-white cursor-pointer shadow-orange-500/10" 
                    : "bg-[#f5f5f5] text-neutral-300 cursor-not-allowed border border-neutral-200"
                )}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重启确认 Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden border border-neutral-100 flex flex-col p-6 gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-[#fa541c]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-neutral-800">确认重启</h3>
                <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
                  确定要重启实验环境吗？重启后，当前运行的内核以及未保存的数据将会丢失，环境将恢复至本次实训的初始状态。
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowRestartModal(false)}
                className="px-5 py-1.5 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-full text-[13px] font-bold transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setShowRestartModal(false);
                  triggerToast('环境重启中，请稍候...');
                }}
                className="px-5 py-1.5 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full text-[13px] font-bold transition-all shadow-sm shadow-orange-500/10"
              >
                确认重启
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900/90 backdrop-blur-md text-white text-[13px] font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-800 animation-slide-up">
          <div className="w-2 h-2 rounded-full bg-[#fa541c] animate-pulse"></div>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// Internal components to avoid missing imports
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
