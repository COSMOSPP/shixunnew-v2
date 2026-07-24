import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Database,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Table,
  Edit,
  Trash2,
  Link as LinkIcon,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Layers,
  Info,
  ArrowDownCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Dataset {
  id: number;
  name: string;
  subtitle?: string;
  desc: string;
  creator: string;
  type: '文本' | '图像' | '视频' | '音频' | '表格' | '其他' | '混合';
  isAvailable: boolean;
  scope: '私有' | '公共' | '租户';
  auditStatus?: '待审核' | '审核通过' | '已下架' | '--';
  tags: string[];
  size?: string;
  fileCount?: number;
  updateTime: string;
  courseId?: number | null;
  courseName?: string;
}

interface TeacherDatasetsProps {
  embedded?: boolean;
  defaultCourseId?: number | null;
  defaultCourseName?: string | null;
}

export default function TeacherDatasets({
  embedded = false,
  defaultCourseId = null,
  defaultCourseName = null,
}: TeacherDatasetsProps) {

  // Mock data matching exact user screenshot
  const initialDatasets: Dataset[] = [
    {
      id: 1,
      name: '111',
      subtitle: '11',
      desc: '11',
      creator: 'liuwei01',
      type: '文本',
      isAvailable: false,
      scope: '私有',
      auditStatus: '--',
      tags: ['tag-bbb'],
      updateTime: '2026-07-23'
    },
    {
      id: 2,
      name: 'test2',
      subtitle: '图像分类标注数据集',
      desc: '涵盖多类型高分辨率图像标注与特征向量',
      creator: 'liuwei01',
      type: '图像',
      isAvailable: true,
      scope: '私有',
      auditStatus: '待审核',
      tags: ['公有云', '私有云'],
      updateTime: '2026-07-15'
    },
    {
      id: 3,
      name: 'test111',
      subtitle: '大模型私有数据预处理包',
      desc: '提供底层数据格式转换与预处理工具集',
      creator: 'liuwei01',
      type: '其他',
      isAvailable: true,
      scope: '私有',
      auditStatus: '待审核',
      tags: ['私有云'],
      updateTime: '2026-07-14'
    }
  ];

  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);

  // Filters
  const [tabFilter, setTabFilter] = useState<'all' | 'public' | 'my'>('all');
  const [courseFilter, setCourseFilter] = useState<string>(defaultCourseId ? String(defaultCourseId) : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = React.useRef<HTMLDivElement>(null);
  
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const actionDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Drawer / Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Off-shelf State
  const [isOffShelfModalOpen, setIsOffShelfModalOpen] = useState(false);
  const [datasetToOffShelf, setDatasetToOffShelf] = useState<Dataset | null>(null);
  const [offShelfReason, setOffShelfReason] = useState('');

  // Apply Public State (Course Module Style)
  const [isApplyPublicModalOpen, setIsApplyPublicModalOpen] = useState(false);
  const [datasetToApply, setDatasetToApply] = useState<Dataset | null>(null);
  const [applyRange, setApplyRange] = useState<'租户' | '平台'>('租户');
  const [applyReason, setApplyReason] = useState('');

  const handleOpenApplyPublic = (ds: Dataset) => {
    setDatasetToApply(ds);
    setApplyRange('租户');
    setApplyReason('');
    setIsApplyPublicModalOpen(true);
  };

  const handleConfirmApplyPublic = () => {
    if (!applyReason.trim()) {
      showToast('请填写申请说明', 'error');
      return;
    }
    if (!datasetToApply) return;

    setDatasets(prev => prev.map(d => {
      if (d.id === datasetToApply.id) {
        return {
          ...d,
          auditStatus: '待审核',
          scope: applyRange === '平台' ? '公共' : '租户'
        };
      }
      return d;
    }));
    showToast(`数据集「${datasetToApply.name}」已提交公开申请`);
    setIsApplyPublicModalOpen(false);
    setDatasetToApply(null);
    setApplyReason('');
  };

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleOffShelfDataset = () => {
    if (!offShelfReason.trim()) {
      showToast('请填写下架说明', 'error');
      return;
    }
    if (!datasetToOffShelf) return;

    setDatasets(prev => prev.map(d => {
      if (d.id === datasetToOffShelf.id) {
        return {
          ...d,
          status: '已下架',
        };
      }
      return d;
    }));
    showToast(`数据集「${datasetToOffShelf.name}」已成功下架`);
    setIsOffShelfModalOpen(false);
    setDatasetToOffShelf(null);
    setOffShelfReason('');
  };

  const handleReShelfDataset = (ds: Dataset) => {
    setDatasets(prev => prev.map(d => {
      if (d.id === ds.id) {
        return {
          ...d,
          status: '已发布',
        };
      }
      return d;
    }));
    showToast(`数据集「${ds.name}」已重新上架`);
  };

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<Dataset['type']>('文本');
  const [formTags, setFormTags] = useState('');
  const [formScope, setFormScope] = useState<'平台公共' | '我的私有'>('我的私有');
  const [formFile, setFormFile] = useState<File | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getIconByType = (type: string) => {
    switch(type) {
      case '文本': return <FileText className="w-5 h-5 text-blue-500" />;
      case '图片': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case '视频': return <Video className="w-5 h-5 text-purple-500" />;
      case '音频': return <Music className="w-5 h-5 text-orange-500" />;
      case '表格': return <Table className="w-5 h-5 text-teal-500" />;
      default: return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleApplyPublic = (ds: Dataset) => {
    setDatasets(prev => prev.map(d => d.id === ds.id ? { ...d, auditStatus: '待审核' } : d));
    showToast(`数据集「${ds.name}」已提交公开审核`);
  };

  const toggleAvailability = (ds: Dataset) => {
    setDatasets(prev => prev.map(d => d.id === ds.id ? { ...d, isAvailable: !d.isAvailable } : d));
    showToast(`数据集「${ds.name}」已${!ds.isAvailable ? '启用' : '禁用'}`);
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormName('');
    setFormDesc('');
    setFormType('文本');
    setFormTags('');
    setFormScope('私有');
    setFormFile(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ds: Dataset) => {
    setIsEditMode(true);
    setCurrentId(ds.id);
    setFormName(ds.name);
    setFormDesc(ds.desc);
    setFormType(ds.type);
    setFormTags(ds.tags.join(', '));
    setFormScope(ds.scope);
    setFormFile(null);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      showToast('数据集名称不能为空', 'error');
      return;
    }
    
    const tagsArray = formTags.split(/[,，]/).map(t => t.trim()).filter(Boolean);

    if (isEditMode && currentId !== null) {
      setDatasets(datasets.map(d => d.id === currentId ? {
        ...d,
        name: formName,
        desc: formDesc,
        type: formType,
        tags: tagsArray,
        updateTime: new Date().toISOString().split('T')[0]
      } : d));
      showToast('数据集更新成功');
    } else {
      const newDataset: Dataset = {
        id: Date.now(),
        name: formName,
        subtitle: formDesc || formName,
        desc: formDesc,
        creator: 'liuwei01',
        type: formType,
        tags: tagsArray,
        isAvailable: true,
        scope: '私有',
        auditStatus: '--',
        size: formFile ? `${(formFile.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
        fileCount: formFile ? 1 : 0,
        updateTime: new Date().toISOString().split('T')[0]
      };
      setDatasets([newDataset, ...datasets]);
      showToast('数据集创建成功');
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (ds: Dataset) => {
    setConfirmDialog({
      show: true,
      title: '确认删除数据集',
      message: `确定要删除数据集 "${ds.name}" 吗？该操作不可撤销。`,
      onConfirm: () => {
        setDatasets(prev => prev.filter(d => d.id !== ds.id));
        showToast('删除数据集成功');
      }
    });
  };

  const filteredData = datasets.filter(d => {
    // Tab filter
    if (tabFilter === 'public' && d.scope !== '平台公共') return false;
    if (tabFilter === 'my' && d.scope !== '我的私有') return false;
    // Course filter
    if (courseFilter !== 'all' && d.courseId !== Number(courseFilter)) return false;
    // Search
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={cn("flex flex-col h-full text-left", embedded ? "p-5" : "p-6")}>
      
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

      {/* Top Actions - Spacing matching TeacherProjects */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索数据集名称" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-9 bg-white"
            />
          </div>
          
          {/* Scope Dropdown */}
          <div ref={filterDropdownRef} className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-[128px] border border-neutral-200 rounded-full px-3.5 h-9 flex items-center justify-between text-[13px] text-neutral-700 bg-white hover:border-[#fa541c] hover:text-[#fa541c] transition-colors cursor-pointer font-medium"
            >
              <span className="truncate">
                {tabFilter === 'all' ? '全部' : tabFilter === 'public' ? '平台公共' : '我的私有'}
              </span>
              <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200", isFilterDropdownOpen && "rotate-180 text-[#fa541c]")} />
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 bg-white border border-neutral-200 rounded shadow-lg py-1 z-40 w-[128px] text-left animate-in fade-in slide-in-from-top-1 duration-150">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'public', label: '平台公共' },
                  { key: 'my', label: '我的私有' }
                ].map(opt => (
                  <button 
                    key={opt.key}
                    onClick={() => {
                      setTabFilter(opt.key as any);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all font-medium",
                      tabFilter === opt.key 
                        ? "text-[#fa541c] bg-orange-50 font-bold" 
                        : "text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleOpenCreate} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-5 h-9 text-[13px] shadow-sm shrink-0 border-0 cursor-pointer font-bold flex items-center">
            <Plus className="w-4 h-4 mr-1" /> 新建数据集
          </Button>
        </div>
      </div>

      {/* Content Area - Table Layout matching course table style in TeacherHome */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        {filteredData.length > 0 ? (
          <div className="flex flex-col flex-1 justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                    <th className="px-4 py-3 pl-6 text-left">数据集信息</th>
                    <th className="px-4 py-3 text-left">创建人</th>
                    <th className="px-4 py-3 text-left">类型</th>
                    <th className="px-4 py-3 text-left">是否可用</th>
                    <th className="px-4 py-3 text-left">范围</th>
                    <th className="px-4 py-3 text-left">审核状态</th>
                    <th className="px-4 py-3 text-left">更新时间</th>
                    <th className="px-4 py-3 pr-6 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((ds, index) => (
                    <tr key={ds.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === filteredData.length - 1 && "border-b-0")}>
                      {/* 数据集信息 */}
                      <td className="px-4 py-3 pl-6 text-left">
                        <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer">{ds.name}</div>
                        {ds.subtitle && (
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">{ds.subtitle}</div>
                        )}
                        {ds.tags && ds.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ds.tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200/80 text-[11px] rounded font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* 创建人 */}
                      <td className="px-4 py-3 text-left text-neutral-600 font-medium">
                        {ds.creator}
                      </td>

                      {/* 类型 */}
                      <td className="px-4 py-3 text-left">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          ds.type === '文本' ? "bg-blue-50 text-blue-600 border-blue-200" :
                          (ds.type === '图像' || ds.type === '图片') ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-neutral-100 text-neutral-600 border-neutral-200"
                        )}>
                          {ds.type}
                        </span>
                      </td>

                      {/* 是否可用 */}
                      <td className="px-4 py-3 text-left">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          ds.isAvailable ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"
                        )}>
                          {ds.isAvailable ? '可用' : '不可用'}
                        </span>
                      </td>

                      {/* 范围 */}
                      <td className="px-4 py-3 text-left">
                        <span className={cn(
                          "px-2 py-0.5 text-[12px] rounded border font-medium",
                          ds.scope === '公共' || ds.scope === '平台公共' ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                        )}>
                          {ds.scope === '平台公共' ? '公共' : ds.scope}
                        </span>
                      </td>

                      {/* 审核状态 */}
                      <td className="px-4 py-3 text-left">
                        {ds.auditStatus === '待审核' ? (
                          <span className="text-[#fa541c] font-medium">待审核</span>
                        ) : ds.auditStatus === '审核通过' || ds.auditStatus === '已发布' ? (
                          <span className="text-emerald-600 font-medium">已通过</span>
                        ) : (
                          <span className="text-neutral-400 font-normal">--</span>
                        )}
                      </td>

                      {/* 更新时间 */}
                      <td className="px-4 py-3 text-left text-neutral-500 font-mono text-[12px]">
                        {ds.updateTime}
                      </td>

                      {/* 操作: 默认展示高频两个 (编辑, 公开), 其他放到"更多"下拉菜单 (包含下架) */}
                      <td className="px-4 py-3 pr-6 text-left">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleOpenEdit(ds)} 
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => handleOpenApplyPublic(ds)} 
                            className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                          >
                            公开
                          </button>

                          {/* 下拉菜单: 更多 */}
                          <div className="relative" ref={activeDropdownId === ds.id ? actionDropdownRef : null}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === ds.id ? null : ds.id);
                              }}
                              className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold flex items-center gap-0.5"
                            >
                              更多 <ChevronDown className="w-3 h-3" />
                            </button>
                            {activeDropdownId === ds.id && (
                              <div className="absolute right-0 mt-1.5 bg-white border border-neutral-200 rounded-[4px] shadow-lg py-1 z-30 min-w-[100px] text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAvailability(ds);
                                    setActiveDropdownId(null);
                                  }} 
                                  className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                >
                                  {ds.isAvailable ? '禁用' : '启用'}
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDatasetToOffShelf(ds);
                                    setOffShelfReason('');
                                    setIsOffShelfModalOpen(true);
                                    setActiveDropdownId(null);
                                  }} 
                                  className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                >
                                  下架
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(ds);
                                    setActiveDropdownId(null);
                                  }} 
                                  className="w-full text-left px-3.5 py-1.5 text-[12px] bg-transparent border-0 cursor-pointer block transition-all text-neutral-900 hover:text-[#fa541c] hover:bg-orange-50 font-medium"
                                >
                                  删除
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-white flex items-center justify-end gap-3 text-xs text-neutral-500">
              <span>共 {filteredData.length} 条</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center hover:bg-neutral-50 cursor-pointer bg-white text-neutral-600">
                  &lt;
                </button>
                <button className="w-7 h-7 bg-[#fa541c] text-white rounded font-bold flex items-center justify-center shadow-xs">
                  1
                </button>
                <button className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center hover:bg-neutral-50 cursor-pointer bg-white text-neutral-600">
                  &gt;
                </button>
              </div>
              <select className="border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-600 bg-white focus:outline-none focus:border-[#fa541c]">
                <option value="10">10 条/页</option>
                <option value="20">20 条/页</option>
                <option value="50">50 条/页</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center pb-20">
            <div className="w-32 h-32 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Database className="w-12 h-12 text-neutral-300" />
            </div>
            <h3 className="text-[16px] font-bold text-neutral-800 mb-2">未找到数据集</h3>
            <p className="text-[13px] text-neutral-500 mb-6 max-w-sm">
              当前分类下暂无数据集记录。您可以新建数据集或调整过滤条件。
            </p>
            <Button onClick={handleOpenCreate} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-[4px] px-6 text-[13px] border-0 cursor-pointer">
              新建数据集
            </Button>
          </div>
        )}
      </div>

      {/* Drawer: Create / Edit */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[600px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-neutral-800">
                {isEditMode ? '编辑数据集' : '新建数据集'}
              </h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right">
                  名称 <span className="text-[#fa541c]">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入数据集名称"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right pt-2">
                  描述
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="描述数据集的内容、用途及注意事项..."
                  className="w-full h-24 border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right">
                  类型 <span className="text-[#fa541c]">*</span>
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as Dataset['type'])}
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800 bg-white"
                >
                  <option value="文本">文本数据集</option>
                  <option value="图像">图像数据集</option>
                  <option value="视频">视频数据集</option>
                  <option value="音频">音频数据集</option>
                  <option value="表格">表格数据集</option>
                  <option value="混合">混合数据集</option>
                  <option value="其他">其他数据集</option>
                </select>
              </div>

              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right">
                  标签
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="输入标签，用逗号分隔（如：医疗, CV, 问答）"
                  className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-neutral-800"
                />
              </div>

              {/* Upload Area */}
              <div className="grid grid-cols-[80px_1fr] items-start gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right pt-2">
                  文件上传
                </label>
                <div className="border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 p-6 flex flex-col items-center justify-center text-center group hover:border-[#fa541c] hover:bg-[#fff2e8]/30 transition-all cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFormFile(e.target.files[0]);
                      }
                    }}
                  />
                  {formFile ? (
                    <>
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <p className="text-[13px] font-bold text-neutral-800">{formFile.name}</p>
                      <p className="text-[12px] text-neutral-500 mt-1">{(formFile.size / 1024 / 1024).toFixed(2)} MB • 点击重新上传</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-3 group-hover:text-[#fa541c] group-hover:scale-110 transition-all">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-[13px] font-bold text-neutral-800">点击上传或将文件拖拽到这里</p>
                      <p className="text-[12px] text-neutral-500 mt-1">支持 zip, tar, csv, json, txt 等格式，单个文件不超过 5GB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer - matching 新建课程 buttons style */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsDrawerOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Public Drawer (Ref Course Module Style in TeacherHome) */}
      {isApplyPublicModalOpen && datasetToApply && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => setIsApplyPublicModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                申请公开数据集资源
              </h2>
              <button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">公开后平台师生可见可用</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    申请公开后，数据集需经过超管审核。审核通过将加入对应范围的公共数据集库，相应师生可见可用。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">数据集名称</label>
                  <input 
                    type="text" 
                    value={datasetToApply.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-[4px] px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2.5">
                    公开范围 <span className="text-[#fa541c]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: '租户', label: '租户级公开', desc: '本机构/租户内所有班级与教师可见' },
                      { key: '平台', label: '平台级公开', desc: '全平台所有院校与租户可见' }
                    ].map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => setApplyRange(opt.key as any)}
                        className={cn(
                          "border p-4 rounded-[4px] cursor-pointer transition-all select-none flex flex-col gap-1",
                          applyRange === opt.key 
                            ? "border-[#fa541c] bg-[#fff5f0]/30 font-bold"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <span className={cn("font-bold text-[13px]", applyRange === opt.key ? "text-[#fa541c]" : "text-[#262626]")}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 leading-normal">{opt.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    申请说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={applyReason}
                    onChange={(e) => setApplyReason(e.target.value)}
                    placeholder="请简述申请公开该数据集的理由或适用实验场景..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsApplyPublicModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmApplyPublic} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Off-Shelf Drawer (Ref Course Module Style in TeacherHome) */}
      {isOffShelfModalOpen && datasetToOffShelf && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left"
          onClick={() => setIsOffShelfModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[680px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#fa541c]" />
                下架数据集资源
              </h2>
              <button 
                onClick={() => setIsOffShelfModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-[13px]">
              {/* Info Alert */}
              <div className="bg-[#fff5f0] border border-[#ffbb96] rounded-[4px] p-4 flex gap-3 text-sm text-[#d4380d]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#fa541c]" />
                <div>
                  <p className="font-bold mb-1 text-[13px] text-[#fa541c]">下架后数据集将暂不对平台师生公开</p>
                  <p className="text-xs text-[#d4380d] opacity-90 leading-relaxed">
                    下架数据集后，该数据资源将从公共数据集列表与课程绑定中隐藏。历史关联的项目仍保留缓存数据，但无法发起新的数据下载或调用。
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right">数据集名称</label>
                  <input 
                    type="text" 
                    value={datasetToOffShelf.name} 
                    disabled 
                    className="w-full text-[13px] text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-[4px] px-3.5 py-2 cursor-not-allowed select-none"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                  <label className="text-[13px] font-bold text-[#262626] text-right pt-2">
                    下架说明 <span className="text-[#fa541c]">*</span>
                  </label>
                  <textarea
                    value={offShelfReason}
                    onChange={(e) => setOffShelfReason(e.target.value)}
                    placeholder="请简述下架该数据集的具体原因及后续安排..."
                    className="w-full text-[13px] text-[#262626] border border-neutral-200 rounded-[4px] px-3.5 py-2.5 focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]/20 bg-white transition-all resize-none h-28"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsOffShelfModalOpen(false)} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-[4px] text-[13px] bg-white cursor-pointer hover:bg-neutral-50 transition-colors font-semibold"
              >
                取消
              </Button>
              <Button 
                onClick={handleOffShelfDataset} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-[4px] shadow-sm text-[13px] border-0 cursor-pointer transition-colors font-semibold"
              >
                确认下架
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal (Ref Course Module) */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                {confirmDialog.title}
              </h2>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, show: false }))} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex items-start gap-3 bg-white">
              <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              <div className="text-[14px] text-neutral-750 leading-normal">
                {confirmDialog.message}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, show: false }))} 
                variant="outline" 
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(prev => ({ ...prev, show: false }));
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 text-[13px] rounded-[4px] shadow-sm transition-colors border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
