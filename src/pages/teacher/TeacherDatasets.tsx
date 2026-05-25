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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Dataset {
  id: number;
  name: string;
  desc: string;
  type: '文本' | '图片' | '视频' | '音频' | '表格' | '混合';
  tags: string[];
  scope: '平台公共' | '我的私有';
  size: string;
  fileCount: number;
  updateTime: string;
  courseId: number | null;
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

  // Mock data
  const initialDatasets: Dataset[] = [
    {
      id: 1,
      name: '医疗诊断对话数据集',
      desc: '包含10万+条医患多轮问答对话记录，经过专业脱敏处理。',
      type: '文本',
      tags: ['医疗', 'NLP', '问答'],
      scope: '平台公共',
      size: '256 MB',
      fileCount: 1,
      updateTime: '2026-05-20',
      courseId: null
    },
    {
      id: 2,
      name: '自动驾驶街景图像库',
      desc: '5000张标注了车辆、行人、交通标志的高清街景图片。',
      type: '图片',
      tags: ['CV', '自动驾驶', '目标检测'],
      scope: '我的私有',
      size: '4.2 GB',
      fileCount: 5000,
      updateTime: '2026-05-21',
      courseId: 1,
      courseName: '人工智能基础与实践'
    },
    {
      id: 3,
      name: '2025全球宏观经济指标',
      desc: '涵盖全球主要经济体过去10年的核心经济指标时间序列数据。',
      type: '表格',
      tags: ['金融', '预测', '时序分析'],
      scope: '平台公共',
      size: '15 MB',
      fileCount: 3,
      updateTime: '2026-05-18',
      courseId: null
    }
  ];

  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);

  // Filters
  const [tabFilter, setTabFilter] = useState<'all' | 'public' | 'my'>('all');
  const [courseFilter, setCourseFilter] = useState<string>(defaultCourseId ? String(defaultCourseId) : 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer / Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

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

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormName('');
    setFormDesc('');
    setFormType('文本');
    setFormTags('');
    setFormScope('我的私有');
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
        scope: formScope,
        updateTime: new Date().toISOString().split('T')[0]
      } : d));
      showToast('数据集更新成功');
    } else {
      const newDataset: Dataset = {
        id: Date.now(),
        name: formName,
        desc: formDesc,
        type: formType,
        tags: tagsArray,
        scope: formScope,
        size: formFile ? `${(formFile.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
        fileCount: formFile ? 1 : 0,
        updateTime: new Date().toISOString().split('T')[0],
        courseId: courseFilter !== 'all' ? Number(courseFilter) : null
      };
      setDatasets([newDataset, ...datasets]);
      showToast('数据集创建成功');
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该数据集吗？删除后将无法恢复。')) {
      setDatasets(datasets.filter(d => d.id !== id));
      showToast('删除成功');
    }
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
    <div className={cn("flex flex-col h-full", embedded ? "p-6" : "p-8")}>
      
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

      {/* Top Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          {/* Tab Filter */}
          <div className="flex bg-neutral-100/80 rounded-full p-1 border border-neutral-200/60">
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'all' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('all')}
            >
              全部
            </button>
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'public' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('public')}
            >
              平台公共
            </button>
            <button 
              className={cn("px-5 py-1.5 text-[13px] rounded-full transition-all duration-200", tabFilter === 'my' ? "bg-white text-[#fa541c] font-bold shadow-sm" : "text-neutral-500 hover:text-neutral-800")}
              onClick={() => setTabFilter('my')}
            >
              我的私有
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Course Filter */}
          <div className="relative">
            <select 
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none border border-neutral-200 rounded-full pl-4 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer h-8"
            >
              <option value="all">所有课程</option>
              <option value="1">人工智能基础与实践</option>
              <option value="2">深度学习进阶</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索数据集名称" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-full focus:outline-none focus:border-[#fa541c] w-64 transition-all h-8"
            />
          </div>
          <Button onClick={handleOpenCreate} className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-full px-5 h-8 text-[13px] shadow-sm shrink-0">
            <Plus className="w-4 h-4 mr-1" /> 新建数据集
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(ds => (
              <div key={ds.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col hover:-translate-y-1">
                <div className="p-6 flex-1 relative">
                  {/* Public Tag */}
                  {ds.scope === '平台公共' && (
                    <div className="absolute top-0 right-0 bg-[#fff2e8] text-[#fa541c] text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      公共资源
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0">
                      {getIconByType(ds.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[15px] text-neutral-800 truncate group-hover:text-[#fa541c] transition-colors">{ds.name}</h3>
                      <p className="text-[12px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{ds.desc}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ds.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-neutral-50 text-neutral-600 rounded text-[11px] border border-neutral-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] bg-neutral-50/50 rounded-lg py-2 border border-neutral-100/50">
                    <div>
                      <div className="text-neutral-400 text-[10px]">类型</div>
                      <div className="font-medium text-neutral-700 mt-0.5">{ds.type}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-[10px]">大小</div>
                      <div className="font-medium text-neutral-700 mt-0.5">{ds.size}</div>
                    </div>
                    <div>
                      <div className="text-neutral-400 text-[10px]">文件数</div>
                      <div className="font-medium text-neutral-700 mt-0.5">{ds.fileCount}</div>
                    </div>
                  </div>
                </div>
                
                {/* Card Footer Actions */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                  <div className="text-[12px] text-neutral-400">更新于 {ds.updateTime}</div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-neutral-400 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors" title="关联课程">
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(ds)}
                      className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors" title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(ds.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <Button onClick={handleOpenCreate} className="bg-white border border-[#fa541c] text-[#fa541c] hover:bg-[#fff2e8] rounded-full px-6">
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
                  <option value="图片">图片数据集</option>
                  <option value="视频">视频数据集</option>
                  <option value="音频">音频数据集</option>
                  <option value="表格">表格数据集</option>
                  <option value="混合">混合数据集</option>
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

              <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-neutral-400 text-right">
                  公开设置 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {['我的私有', '平台公共'].map((scope) => (
                    <label key={scope} className="flex items-center gap-2 cursor-pointer group text-[13px] text-neutral-600 select-none">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="formScope"
                          value={scope}
                          checked={formScope === scope}
                          onChange={() => setFormScope(scope as '我的私有' | '平台公共')}
                          className="sr-only"
                        />
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          formScope === scope 
                            ? "border-neutral-300 bg-white" 
                            : "border-neutral-200 group-hover:border-[#fa541c]"
                        )}>
                          {formScope === scope && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                          )}
                        </span>
                      </span>
                      <span>{scope}</span>
                    </label>
                  ))}
                </div>
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              <Button onClick={() => setIsDrawerOpen(false)} variant="outline" className="border-neutral-200 text-neutral-600 h-9 px-6 rounded-full text-[13px]">
                取消
              </Button>
              <Button onClick={handleSave} className="bg-[#fa541c] hover:bg-[#e84a15] text-white h-9 px-8 rounded-full shadow-sm text-[13px]">
                保存并上传
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
