import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  X, 
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamRule {
  id: number;
  name: string;
  status: '已应用' | '未应用';
  time: string;
  submitMethod: '整体提交';
  submitLimit: '仅一次' | '多次';
  submitLimitCount?: string;
  viewRecords: '展示' | '不展示';
  scoreMethod: '最后一次提交记录' | '最高分提交记录';
  gradingMethod: '提交后批阅' | '结束考试后批阅';
}

export default function TeacherExamRules() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rules State
  const [rulesList, setRulesList] = useState<ExamRule[]>([
    { id: 1, name: '人工智能期末考防作弊策略组', status: '已应用', time: '2026/06/12 10:30', submitMethod: '整体提交', submitLimit: '仅一次', viewRecords: '展示', scoreMethod: '最后一次提交记录', gradingMethod: '结束考试后批阅' },
    { id: 2, name: '随堂测试常规监控规则模板', status: '未应用', time: '2026/06/18 14:15', submitMethod: '整体提交', submitLimit: '仅一次', viewRecords: '不展示', scoreMethod: '最后一次提交记录', gradingMethod: '结束考试后批阅' },
    { id: 3, name: '编程算法竞赛严格反切屏限流规则', status: '已应用', time: '2026/06/25 09:00', submitMethod: '整体提交', submitLimit: '多次', submitLimitCount: '3次', viewRecords: '展示', scoreMethod: '最高分提交记录', gradingMethod: '结束考试后批阅' }
  ]);

  // Drawer states
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ExamRule | null>(null);
  
  // Form fields states
  const [ruleFormName, setRuleFormName] = useState('');
  const [ruleFormStatus, setRuleFormStatus] = useState<'已应用' | '未应用'>('未应用');
  const [ruleFormSubmitMethod, setRuleFormSubmitMethod] = useState<'整体提交'>('整体提交');
  const [ruleFormSubmitLimit, setRuleFormSubmitLimit] = useState<'仅一次' | '多次'>('仅一次');
  const [ruleFormSubmitLimitCount, setRuleFormSubmitLimitCount] = useState<string>('2次');
  const [ruleFormSubmitTimesVal, setRuleFormSubmitTimesVal] = useState<number>(2);
  const [ruleFormViewRecords, setRuleFormViewRecords] = useState<'展示' | '不展示'>('展示');
  const [ruleFormScoreMethod, setRuleFormScoreMethod] = useState<'最后一次提交记录' | '最高分提交记录'>('最后一次提交记录');
  const [ruleFormGradingMethod, setRuleFormGradingMethod] = useState<'提交后批阅' | '结束考试后批阅'>('结束考试后批阅');

  // Conditional form fields sync
  React.useEffect(() => {
    if (ruleFormSubmitLimit === '多次') {
      setRuleFormGradingMethod('结束考试后批阅');
    }
    if (ruleFormSubmitLimit === '仅一次') {
      setRuleFormScoreMethod('最后一次提交记录');
    }
  }, [ruleFormSubmitLimit]);

  // Confirmation Modal states
  const [confirmDeleteRule, setConfirmDeleteRule] = useState<ExamRule | null>(null);

  // Toast Notification states
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Add Rule
  const handleOpenAdd = () => {
    setEditingRule(null);
    setRuleFormName('');
    setRuleFormStatus('未应用');
    setRuleFormSubmitMethod('整体提交');
    setRuleFormSubmitLimit('仅一次');
    setRuleFormSubmitLimitCount('2次');
    setRuleFormSubmitTimesVal(2);
    setRuleFormViewRecords('展示');
    setRuleFormScoreMethod('最后一次提交记录');
    setRuleFormGradingMethod('结束考试后批阅');
    setIsRuleModalOpen(true);
  };

  // Open Edit Rule
  const handleOpenEdit = (rule: ExamRule) => {
    setEditingRule(rule);
    setRuleFormName(rule.name);
    setRuleFormStatus(rule.status);
    setRuleFormSubmitMethod(rule.submitMethod);
    setRuleFormSubmitLimit(rule.submitLimit);
    setRuleFormSubmitLimitCount(rule.submitLimitCount || '2次');
    if (rule.submitLimitCount) {
      const num = parseInt(rule.submitLimitCount);
      setRuleFormSubmitTimesVal(isNaN(num) ? 2 : num);
    } else {
      setRuleFormSubmitTimesVal(2);
    }
    setRuleFormViewRecords(rule.viewRecords);
    setRuleFormScoreMethod(rule.scoreMethod);
    setRuleFormGradingMethod(rule.gradingMethod);
    setIsRuleModalOpen(true);
  };

  // Save Rule (Create/Update)
  const handleSaveRule = () => {
    if (!ruleFormName.trim()) {
      showToast('请输入规则名称', 'error');
      return;
    }
    const finalSubmitCount = ruleFormSubmitLimit === '多次' ? `${ruleFormSubmitTimesVal}次` : undefined;
    if (editingRule) {
      // Update
      setRulesList(rulesList.map(r => r.id === editingRule.id ? { 
        ...r, 
        name: ruleFormName, 
        status: ruleFormStatus,
        submitMethod: ruleFormSubmitMethod,
        submitLimit: ruleFormSubmitLimit,
        submitLimitCount: finalSubmitCount,
        viewRecords: ruleFormViewRecords,
        scoreMethod: ruleFormScoreMethod,
        gradingMethod: ruleFormGradingMethod
      } : r));
      showToast('更新考试规则成功', 'success');
    } else {
      // Create
      const newRule: ExamRule = {
        id: Date.now(),
        name: ruleFormName,
        status: ruleFormStatus,
        time: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '/'),
        submitMethod: ruleFormSubmitMethod,
        submitLimit: ruleFormSubmitLimit,
        submitLimitCount: finalSubmitCount,
        viewRecords: ruleFormViewRecords,
        scoreMethod: ruleFormScoreMethod,
        gradingMethod: ruleFormGradingMethod
      };
      setRulesList([...rulesList, newRule]);
      showToast('创建考试规则成功', 'success');
    }
    setIsRuleModalOpen(false);
  };

  // Confirm and Execute Delete
  const handleDeleteRule = (rule: ExamRule) => {
    setRulesList(rulesList.filter(r => r.id !== rule.id));
    showToast('删除考试规则成功', 'success');
  };

  // Filtering
  const filteredRules = rulesList.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom Radio Button Renderer matching screenshot
  const renderRadio = <T extends string>(
    label: T, 
    value: T, 
    currentValue: T, 
    onChange: (val: T) => void
  ) => {
    const isSelected = value === currentValue;
    return (
      <div 
        className="flex items-center gap-2.5 cursor-pointer select-none" 
        onClick={() => onChange(value)}
      >
        <div className={cn(
          "w-4 h-4 rounded-full border flex items-center justify-center bg-white transition-all",
          isSelected ? "border-[#fa541c]" : "border-neutral-300"
        )}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-[#fa541c]"></div>}
        </div>
        <span className={cn("text-[13px] font-bold", isSelected ? "text-[#fa541c]" : "text-neutral-600")}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-white border border-neutral-100 shadow-xl rounded-lg px-4 py-3 flex items-center gap-2 animate-bounce-short">
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
          <h1 className="text-xl font-bold text-neutral-900">考试规则</h1>
          <p className="text-sm text-neutral-500 mb-0.5">配置防作弊策略与考试纪律模态规则模块</p>
        </div>
      </div>

      {/* Table and Toolbar unified module */}
      <div className="bg-white rounded-[8px] border border-neutral-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 animate-none" />
              <input
                type="text"
                placeholder="请输入要搜索的内容"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button 
              onClick={handleOpenAdd} 
              className="bg-[#fa541c] hover:bg-[#e84a15] text-white flex items-center gap-1.5 shadow-sm h-9 px-4 rounded-[4px] text-xs font-semibold cursor-pointer border-0"
            >
              <Plus className="w-3.5 h-3.5" /> 新建规则
            </Button>
          </div>
        </div>

        {/* Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
            <thead>
              <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-semibold select-none">
                <th className="pl-6 pr-3 py-3.5 font-medium text-left bg-transparent">规则名称</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">规则状态</th>
                <th className="px-3 py-3.5 font-medium text-left bg-transparent">创建时间</th>
                <th className="pl-3 pr-6 py-3.5 font-medium text-center bg-transparent w-32">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[13px] text-neutral-700 bg-white">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule, idx) => (
                  <tr 
                    key={rule.id} 
                    className={cn(
                      "border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]",
                      idx === filteredRules.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="pl-6 pr-3 py-3.5 font-medium text-neutral-850 max-w-[300px] truncate" title={rule.name}>
                      {rule.name}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-medium inline-block border",
                        rule.status === '已应用'
                          ? "text-[#52c41a] bg-[#f6ffed] border-[#d9f7be]"
                          : "text-neutral-500 bg-neutral-50 border-neutral-200"
                      )}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-neutral-500 font-mono">
                      {rule.time}
                    </td>
                    <td className="pl-3 pr-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleOpenEdit(rule)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => setConfirmDeleteRule(rule)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold whitespace-nowrap"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-450 bg-white select-none">
                    暂无考试规则模版
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Drawer Modal (Right Drawer) */}
      {isRuleModalOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] flex justify-end animate-fade-in text-left text-[13px]"
          onClick={() => setIsRuleModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-100 animate-in slide-in-from-right duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626] flex items-center gap-2">
                {editingRule ? <Edit className="w-5 h-5 text-[#fa541c]" /> : <Plus className="w-5 h-5 text-[#fa541c]" />}
                {editingRule ? '编辑考试规则' : '新建考试规则'}
              </h2>
              <button 
                onClick={() => setIsRuleModalOpen(false)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body - Content Styled to match target screenshot */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white custom-scrollbar">
              
              {/* 规则名称 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  规则名称 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ruleFormName}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setRuleFormName(e.target.value);
                      }
                    }}
                    placeholder="请输入规则名称"
                    className="w-full border border-neutral-200 rounded px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#fa541c] transition-all text-[#262626] h-9 pr-20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 select-none pointer-events-none font-mono">
                    {ruleFormName.length} / 100
                  </div>
                </div>
              </div>

              {/* 考试配置 Divider */}
              <div className="flex items-center gap-4 py-2 select-none w-full">
                <span className="text-neutral-200">——</span>
                <span className="text-[14px] font-bold text-neutral-400">考试配置</span>
                <div className="flex-1 h-[1px] bg-neutral-100"></div>
              </div>

              {/* 提交方式 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  提交方式 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {renderRadio('整体提交', '整体提交', ruleFormSubmitMethod, setRuleFormSubmitMethod)}
                </div>
              </div>

              {/* 交卷次数 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  交卷次数 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-6">
                    {renderRadio('仅一次', '仅一次', ruleFormSubmitLimit, setRuleFormSubmitLimit)}
                    {renderRadio('多次', '多次', ruleFormSubmitLimit, setRuleFormSubmitLimit)}
                  </div>
                  {ruleFormSubmitLimit === '多次' && (
                    <div className="flex items-center gap-2 animate-fade-in select-none">
                      {/* Custom Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-[4px] bg-white h-7 overflow-hidden">
                        {/* Minus */}
                        <button
                          type="button"
                          onClick={() => setRuleFormSubmitTimesVal(v => Math.max(2, v - 1))}
                          className="w-7 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 border-0 border-r border-neutral-200 text-neutral-500 font-medium cursor-pointer transition-colors text-[10px]"
                        >
                          —
                        </button>
                        {/* Number & Check Circle */}
                        <div className="w-14 h-full flex items-center justify-center gap-1 bg-white px-2">
                          <span className="text-[13px] font-medium text-neutral-700">{ruleFormSubmitTimesVal}</span>
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400">
                            <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                        </div>
                        {/* Plus */}
                        <button
                          type="button"
                          onClick={() => setRuleFormSubmitTimesVal(v => Math.min(100, v + 1))}
                          className="w-7 h-full flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 border-0 border-l border-neutral-200 text-neutral-500 font-medium cursor-pointer transition-colors text-[12px]"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[13px] text-neutral-450 font-bold">次</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 查看提交记录 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  查看提交记录 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {renderRadio('展示', '展示', ruleFormViewRecords, setRuleFormViewRecords)}
                  {renderRadio('不展示', '不展示', ruleFormViewRecords, setRuleFormViewRecords)}
                </div>
              </div>

              {/* 评分配置 Divider */}
              <div className="flex items-center gap-4 py-2 select-none w-full">
                <span className="text-neutral-200">——</span>
                <span className="text-[14px] font-bold text-neutral-400">评分配置</span>
                <div className="flex-1 h-[1px] bg-neutral-100"></div>
              </div>

              {/* 分数取值 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  分数取值 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {ruleFormSubmitLimit === '仅一次' ? (
                    renderRadio('最后一次提交记录', '最后一次提交记录', ruleFormScoreMethod, setRuleFormScoreMethod)
                  ) : (
                    <>
                      {renderRadio('最后一次提交记录', '最后一次提交记录', ruleFormScoreMethod, setRuleFormScoreMethod)}
                      {renderRadio('最高分提交记录', '最高分提交记录', ruleFormScoreMethod, setRuleFormScoreMethod)}
                    </>
                  )}
                </div>
              </div>

              {/* 批阅设置 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 animate-fade-in">
                <label className="text-[13px] font-bold text-[#262626] text-right select-none">
                  批阅设置 <span className="text-[#fa541c]">*</span>
                </label>
                <div className="flex items-center gap-6">
                  {ruleFormSubmitLimit === '仅一次' ? (
                    <>
                      {renderRadio('提交后批阅', '提交后批阅', ruleFormGradingMethod, setRuleFormGradingMethod)}
                      {renderRadio('结束考试后批阅', '结束考试后批阅', ruleFormGradingMethod, setRuleFormGradingMethod)}
                    </>
                  ) : (
                    renderRadio('结束考试后批阅', '结束考试后批阅', ruleFormGradingMethod, setRuleFormGradingMethod)
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setIsRuleModalOpen(false)} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-xs hover:bg-neutral-100 transition-all rounded-[4px] cursor-pointer bg-white"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveRule}
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-6 text-xs transition-all rounded-[4px] shadow-sm border-0 cursor-pointer"
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Course delete style) */}
      {confirmDeleteRule && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-fade-in text-left">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-neutral-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <h2 className="text-[16px] font-bold text-[#262626]">
                确认删除规则
              </h2>
              <button 
                onClick={() => setConfirmDeleteRule(null)} 
                className="text-neutral-400 hover:text-[#fa541c] p-1.5 hover:bg-neutral-100 rounded-[4px] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-white flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#fa541c] text-white flex items-center justify-center font-bold text-[13px] shrink-0 select-none mt-0.5">!</div>
              <div className="text-[14px] text-neutral-750 leading-normal">
                确定要删除考试规则 "{confirmDeleteRule.name}" 吗？该操作不可撤销。
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 shrink-0">
              <Button 
                onClick={() => setConfirmDeleteRule(null)} 
                variant="outline"
                className="border-neutral-200 text-neutral-600 font-bold h-9 px-5 text-[13px] rounded-[4px] transition-colors bg-white cursor-pointer"
              >
                取消
              </Button>
              <Button 
                onClick={() => {
                  handleDeleteRule(confirmDeleteRule);
                  setConfirmDeleteRule(null);
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
