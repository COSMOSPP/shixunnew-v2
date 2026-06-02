import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Type, Bold, Italic, Strikethrough, Link, 
  List, ListOrdered, CheckSquare, AlignLeft, AlignCenter, AlignRight,
  PlaySquare, Code, Image as ImageIcon, Video, FileText, ChevronDown,
  MoreHorizontal, ChevronRight, File, Settings, Bot, ChevronLeft, Save, Play, Send,
  MessageSquare, Cpu, BarChart, PlusCircle, X, Info, Plus, MonitorPlay
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const getSlidesForLesson = (lessonTitle: string) => {
  switch (lessonTitle) {
    case '职业简介':
      return [
        { id: 1, title: '第一页：课程封面', heading: '第一页：课程封面', content: '同学们，大家好！今天我们要一起探索一个超级有趣的话题——大模型应用概述。可能有的同学会问：“老师，什么是大模型？”别着急，我会用最简单的语言，带大家一起认识这些正在改变我们生活的AI工具。', subHeading: '课程引言与概览', slideTitle: '大模型应用概述', slideSub: '课程引言与概览' },
        { id: 2, title: '第二页：课程大纲', heading: '第二页：课程大纲', content: '我们将从大模型基本概念入手，探讨它的历史发展、核心算法以及目前在各行各业的成功应用，让大家对当前最前沿的AI能力有一个全局的认识。', subHeading: '大语言模型极简史', slideTitle: '课程大纲', slideSub: '课程结构与核心模块' },
        { id: 3, title: '第三页：大模型工具时代的到来', heading: '第三页：大模型工具时代的到来', content: '在当今时代，大模型工具已经成为各行各业必不可少的效率神器。无论是写作、翻译、编码还是策划，都能看到大模型的身影。', subHeading: '工具时代的生产力变革', slideTitle: '工具时代的到来', slideSub: '生产力与效率跃升' },
        { id: 4, title: '第四页：AI工具带来的效率革命', heading: '第四页：AI工具带来的效率革命', content: '使用AI工具可以将常规工作效率提升数倍，这使得职场人能将更多精力放在创意和策略层面，完成更高价值的工作。', subHeading: '效率提升与思维重塑', slideTitle: '效率革命', slideSub: '智能化工具提效' },
        { id: 5, title: '第五页：大模型的9大应用领域...', heading: '第五页：大模型的应用领域', content: '大模型在自然语言处理、计算机视觉、生物信息、药物研发、金融风控等九大核心领域发挥着不可磨灭的作用，并持续向其他垂直领域渗透。', subHeading: '九大应用场景解析', slideTitle: '9大应用领域', slideSub: '多行业深度赋能' },
        { id: 6, title: '第六页：思考与讨论', heading: '第六页：思考与讨论', content: '在AI飞速发展的今天，我们应该如何提升自己的核心竞争力？作为人类，我们有哪些能力是AI短期内无法取代的？', subHeading: '人机协同与未来职场', slideTitle: '思考与讨论', slideSub: '探寻人类的独特价值' },
        { id: 7, title: '第七页：1.1 内容问答 - 有问必...', heading: '第七页：内容问答场景', content: '通过大模型可以实现极高精度的知识检索与语义问答，为客服、知识库管理等业务提供强有力的底层支持。', subHeading: '内容问答 - 有问必答', slideTitle: '1.1 内容问答', slideSub: '智能知识库与智能客服' },
        { id: 8, title: '第八页：1.2 内容分析 - 快速理...', heading: '第八页：内容分析场景', content: '海量非结构化文本的提取、摘要生成、情感倾向分析，都能在数秒内由大语言模型自动完成，为决策提供数据支撑。', subHeading: '内容分析 - 快速理解', slideTitle: '1.2 内容分析', slideSub: '智能文本提取与洞察' },
        { id: 9, title: '第九页：1.3 内容生成 - 自动创...', heading: '第九页：内容生成场景', content: '一键生成新闻稿、营销文案、工作总结甚至专业代码，大幅降低创作门槛，让人人都可以成为高效的创作者。', subHeading: '内容生成 - 自动创作', slideTitle: '1.3 内容生成', slideSub: '文案与创意智能创作' },
        { id: 10, title: '第十页：1.4 艺术创作 - 文字变...', heading: '第十页：艺术创作场景', content: '基于文本提示词直接生成极具艺术感的高清图片、三维模型或背景音乐，开启全新的交互式生成艺术时代。', subHeading: '艺术创作 - 文字变画面', slideTitle: '1.4 艺术创作', slideSub: '多模态AI艺术生成' }
      ];
    case '认定方案':
      return [
        { id: 1, title: '封面与认定概述', heading: '人工智能训练师：职业技能认定方案', content: '本认定方案旨在规范人工智能训练师的职业技能等级认定工作，确保认定过程的公平、公正、公开。本方案详细规定了各等级的申报条件、考核方式、考核内容及权重。人工智能训练师是随着人工智能技术广泛应用产生的新兴职业。他们主要负责使用智能训练软件，在人工智能产品实际使用过程中进行数据库管理、算法参数设置、人机交互设计、性能测试跟踪及其他辅助作业。', alert: '在授课时，建议结合行业内最新的大语言模型（如 ChatGPT、文心一言）的训练过程作为实际案例，以增强学员的代入感。可以强调 RLHF（基于人类反馈的强化学习）环节中“标注员”角色的重要性。' },
        { id: 2, title: '考核方式与标准', heading: '第一节：考核方式与基本标准', content: '认定考核分为理论知识考试 and 技能操作考核。理论知识考试主要采用笔试或机考方式；技能操作考核主要采用实际操作、模拟操作等方式进行。考核标准严格按照国家职业技能标准执行。', points: [
            "理论知识考试：满分为100分，60分及以上为合格。",
            "技能操作考核：满分为100分，60分及以上为合格。",
            "考核期限：理论考试为90分钟，技能考核为120分钟。"
          ] },
        { id: 3, title: '理论知识考试要求', heading: '第二节：理论知识考试细则', content: '主要考查职业道德、基础知识，包括计算机基础、人工智能基础知识、相关法律法规及安全管理知识等。题型以单选、多选和判断题为主。以下是重点考核大纲：', points: [
            "职业道德与守法合规：考查诚信执业、数据隐私保护意识。",
            "人工智能基础理论：神经网络基础、机器学习基本原理、数据标注分类。",
            "法律法规知识：数据安全法、网络安全法、个人信息保护法等。"
          ] },
        { id: 4, title: '技能考核关键模块', heading: '第三节：技能操作考核细则', content: '主要考查数据采集与标注、模型训练与部署、智能系统运维等实际动手能力。考核需要在真实的实操平台中进行，并根据最终产出和日志进行评分。具体模块如下：', points: [
            "数据标注技能：包含图像包围框标注、文本分类标注、语音切分标注等。",
            "模型微调与参数设置：评估在特定数据集下调整模型参数、运行训练任务的能力。",
            "系统部署与测试：测试将训练好的模型打包部署并编写测试用例的完整流程。"
          ], alert: '请务必提醒学员注意报考条件的学历与工作年限要求，尤其是跨专业报考的学员，需要提供相关培训结业证书。' },
        { id: 5, title: '综合评审要求', heading: '第四节：高级技师综合评审', content: '针对高级工、技师及高级技师，增设综合评审环节。通常包括技术工作总结撰写、论文答辩或项目成果汇报，由专家委员会进行综合评定。评审包含以下方向：', points: [
            "工作成果总结：撰写一份反映本人在人工智能训练领域工作成就的总结报告。",
            "现场论文答辩：阐述自己在算法标注优化或团队管理中的创新实践并回答评委提问。",
            "专家组打分：根据技术先进性、实用性以及现场表达能力进行综合评分。"
          ] },
        { id: 6, title: '讲师备课注意事项', heading: '教案附录：讲师授课与备课建议', content: '讲师在准备本节课程时，需要指导学生理清报考流程和认定标准。由于认定考核更加注重实际动手能力，建议在日常授课中加大实训课程的比重，确保每个学生都能熟练掌握实操平台的使用。', alert: '讲师可根据学校或实训基地的实际硬件配置，提前调整分配的虚拟算力环境，确保在考试高峰期网络和算力服务器的绝对稳定。' }
      ];
    case '实操平台演示':
      return [
        { id: 1, title: '第一页：实操演示封面', heading: '实操平台全流程演示', content: '通过高度集成的云端IDE与实操测试环境，为学生提供零配置、一键启动的开发体验。我们将以图像分类任务为例演示全流程。', subHeading: '一键启动，零配置开发体验', slideTitle: '实操平台全流程演示', slideSub: '一键启动，零配置开发体验' },
        { id: 2, title: '第二页：开发环境与工具链', heading: '平台底层开发工具链', content: '内置 JupyterLab、VSCode 等主流网页端编辑器，预装 PyTorch、TensorFlow 以及常用的机器学习及数据科学依赖包。', subHeading: '主流AI框架原生支持', slideTitle: '开发环境与工具链', slideSub: '主流AI框架原生支持' },
        { id: 3, title: '第三页：一键启动与零配置', heading: '零部署的极速开箱体验', content: '学生无需在个人电脑上安装庞大的显卡驱动或Python环境，点击“进入实操”即可在云端分配的GPU/CPU算力节点上直接运行代码。', subHeading: '算力按需分配，环境瞬间就绪', slideTitle: '一键启动与零配置', slideSub: '算力按需分配，环境就绪' },
        { id: 4, title: '第四页：实训平台核心功能', heading: '丰富的互动与自动评测', content: '支持代码自动检查、运行结果实时可视化、自动评分系统以及详细的运行报告生成，帮助教师快速评估学生的动手实践能力。', subHeading: '交互式评测与即时反馈', slideTitle: '实训平台核心功能', slideSub: '互动评测与智能反馈' },
        { id: 5, title: '第五页：常见问题与排障', heading: '实操常见报错与解决方法', content: '汇总了内存溢出 (OOM)、第三方依赖包冲突、文件读写权限等高频问题，并提供了一键重置环境和系统日志下载功能。', subHeading: '常见问题与排查指南', slideTitle: '常见问题与排查', slideSub: '多维排障与环境重置' }
      ];
    case '代码复习讲义':
      return [
        { id: 1, title: '第一页：Python 进阶封面', heading: 'Python 进阶与代码复习', content: '本章主要复习Python高级编程特性，包括闭包、装饰器、生成器以及面向对象编程，为后续编写自定义大模型训练逻辑打下扎实基础。', subHeading: '夯实基础，迎接项目实战', slideTitle: 'Python 进阶与代码复习', slideSub: '夯实基础，迎接项目实战' },
        { id: 2, title: '第二页：函数与闭包', heading: '第一节：高级函数与闭包', content: '理解作用域、自由变量以及闭包的形成条件。掌握如何使用闭包来保存函数状态，并为后续装饰器的学习做铺垫。', subHeading: '函数是一等公民', slideTitle: '高级函数与闭包', slideSub: '理解Python一等公民特征' },
        { id: 3, title: '第三页：面向对象编程 (OOP)', heading: '第二节：类、继承与多态', content: '深入理解Python中的面向对象机制，包括构造函数__init__、属性描述符、特殊魔术方法以及多重继承的MRO顺序。', subHeading: '万物皆对象', slideTitle: '面向对象编程 (OOP)', slideSub: '多态、继承与深层机制' },
        { id: 4, title: '第四页：高阶函数与 Lambda', heading: '第三节：函数式编程特性', content: '熟练掌握 map、filter、reduce 等高阶函数，以及匿名函数 lambda 的应用场景，编写更加简洁优雅的Pythonic代码。', subHeading: '简洁高效的函数式编程', slideTitle: '高阶函数与 Lambda', slideSub: '函数式特性与匿名函数' },
        { id: 5, title: '第五页：Python 常用库与模块', heading: '第四节：数据科学核心库', content: '重点复习 NumPy 数组运算、Pandas 数据清洗与分析，以及 Matplotlib/Seaborn 的数据可视化操作，这些是AI数据标注与处理的必备基石。', subHeading: '数据科学核心库', slideTitle: 'Python 常用库与模块', slideSub: 'NumPy/Pandas 数据分析' },
        { id: 6, title: '第六页：代码实战演练', heading: '实战演练：简易文本清洗器', content: '结合所学知识，编写一个高效的文本正则表达式清洗与分词工具类，体验从需求分析到代码实现与调试的完整闭环。', subHeading: '动手编写你的第一个AI工具', slideTitle: '代码实战演练', slideSub: '简易文本清洗器开发' }
      ];
    default:
      return [
        { id: 1, title: '第一页：章节内容封面', heading: `${lessonTitle} - 备课内容`, content: '在这里您可以输入本节课时的具体备课大纲、发言稿或课件内容。可以通过上方的工具栏进行排版，也可以借助 AI 备课功能一键生成核心提纲。', subHeading: '一键备课与内容编写', slideTitle: lessonTitle, slideSub: '教学课件大纲' }
      ];
  }
};

interface TeacherPPTEditorProps {
  onClose: () => void;
  courseSyllabus: any[];
  initialLesson?: { title: string, type: string } | null;
  onSyllabusChange?: (syllabus: any[]) => void;
  onActiveLessonChange?: (title: string) => void;
}

export default function TeacherPPTEditor({ onClose, courseSyllabus, initialLesson, onSyllabusChange, onActiveLessonChange }: TeacherPPTEditorProps) {
  const navigate = useNavigate();
  const [activeLessonTitle, setActiveLessonTitle] = useState(initialLesson?.title || "职业简介");
  const [activeSlideId, setActiveSlideId] = useState<number>(1);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Syllabus state for dynamic updates
  const [syllabus, setSyllabus] = useState(courseSyllabus);

  React.useEffect(() => {
    onSyllabusChange?.(syllabus);
  }, [syllabus, onSyllabusChange]);

  React.useEffect(() => {
    onActiveLessonChange?.(activeLessonTitle);
  }, [activeLessonTitle, onActiveLessonChange]);
  
  // Modals and drop-downs states
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [newLessonName, setNewLessonName] = useState("");
  const [activeLessonMenu, setActiveLessonMenu] = useState<{ cIdx: number, lIdx: number } | null>(null);
  
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [editLessonName, setEditLessonName] = useState("");
  const [lessonToEdit, setLessonToEdit] = useState<{ cIdx: number, lIdx: number } | null>(null);
  
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<{ cIdx: number, lIdx: number } | null>(null);

  const [addChapterMenuOpenIndex, setAddChapterMenuOpenIndex] = useState<number | null>(null);
  const [chapterActionMenuOpenIndex, setChapterActionMenuOpenIndex] = useState<number | null>(null);
  
  const [newLessonType, setNewLessonType] = useState('doc');
  
  const [showEditChapterModal, setShowEditChapterModal] = useState(false);
  const [editChapterName, setEditChapterName] = useState("");
  const [editChapterTitle, setEditChapterTitle] = useState("");
  const [chapterToEdit, setChapterToEdit] = useState<number | null>(null);
  
  const [showDeleteChapterModal, setShowDeleteChapterModal] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);
  
  // Smartly determine active chapter index
  const activeChapterIdx = syllabus.findIndex((ch: any) => 
    ch.lessons.some((l: any) => l.title === activeLessonTitle)
  ) !== -1 ? syllabus.findIndex((ch: any) => 
    ch.lessons.some((l: any) => l.title === activeLessonTitle)
  ) : 0;

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonName.trim()) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[activeChapterIdx];
    if (targetChapter) {
      const sectionNum = `课时${targetChapter.lessons.length + 1}:`;
      targetChapter.lessons = [
        ...targetChapter.lessons,
        {
          section: sectionNum,
          title: newLessonName,
          locked: false,
          status: "未学习",
          type: newLessonType
        }
      ];
      setSyllabus(updatedSyllabus);
      setActiveLessonTitle(newLessonName);
    }
    setNewLessonName("");
    setShowCreateLessonModal(false);
  };

  const handleOpenEditModal = (cIdx: number, lIdx: number, currentTitle: string) => {
    setLessonToEdit({ cIdx, lIdx });
    setEditLessonName(currentTitle);
    setShowEditLessonModal(true);
  };

  const handleEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLessonName.trim() || !lessonToEdit) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[lessonToEdit.cIdx];
    if (targetChapter && targetChapter.lessons[lessonToEdit.lIdx]) {
      const oldTitle = targetChapter.lessons[lessonToEdit.lIdx].title;
      targetChapter.lessons[lessonToEdit.lIdx].title = editLessonName;
      setSyllabus(updatedSyllabus);
      
      if (activeLessonTitle === oldTitle) {
        setActiveLessonTitle(editLessonName);
      }
    }
    setShowEditLessonModal(false);
    setLessonToEdit(null);
  };

  const handleOpenDeleteModal = (cIdx: number, lIdx: number) => {
    setLessonToDelete({ cIdx, lIdx });
    setShowDeleteLessonModal(true);
  };

  const handleDeleteLesson = () => {
    if (!lessonToDelete) return;
    
    const updatedSyllabus = [...syllabus];
    const targetChapter = updatedSyllabus[lessonToDelete.cIdx];
    if (targetChapter) {
      const deletedTitle = targetChapter.lessons[lessonToDelete.lIdx].title;
      
      targetChapter.lessons = targetChapter.lessons.filter((_, idx) => idx !== lessonToDelete.lIdx);
      targetChapter.lessons = targetChapter.lessons.map((lesson: any, idx: number) => ({
        ...lesson,
        section: `课时${idx + 1}:`
      }));
      
      setSyllabus(updatedSyllabus);
      
      if (activeLessonTitle === deletedTitle) {
        let foundNewActive = false;
        for (const ch of updatedSyllabus) {
          if (ch.lessons.length > 0) {
            setActiveLessonTitle(ch.lessons[0].title);
            foundNewActive = true;
            break;
          }
        }
        if (!foundNewActive) {
          setActiveLessonTitle("");
        }
      }
    }
    setShowDeleteLessonModal(false);
    setLessonToDelete(null);
  };

  return (
    <div className="w-full h-full bg-[#f5f6f8] relative flex font-sans animation-fade-in text-left">
      {/* PPT Editor container */}
      <div className="flex-1 flex flex-col h-full bg-[#f5f6f8] relative">
        {/* Editor Header */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={isPreviewMode ? () => setIsPreviewMode(false) : onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-neutral-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-neutral-200"></div>
            <div className="flex flex-col">
              {isPreviewMode ? (
                <span className="text-[14px] font-bold text-neutral-800">预览模式</span>
              ) : (
                <>
                  <span className="text-[14px] font-bold text-neutral-800">备课模式 &middot; 教学课件编辑</span>
                  <span className="text-[11px] text-neutral-400">正在编辑课程的备课讲义与演示文稿</span>
                </>
              )}
            </div>
          </div>
          {!isPreviewMode ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert("保存成功！")} 
                className="bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 px-5 h-9 rounded text-[14px] font-medium transition-colors"
              >
                保存
              </button>
              {activeLessonTitle === '线性回归实训：预测考试分数' ? (
                <button 
                  onClick={() => setIsPreviewMode(!isPreviewMode)} 
                  className={cn(
                    "px-5 h-9 rounded text-[14px] font-medium transition-all",
                    isPreviewMode 
                      ? "bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-600" 
                      : "bg-white border border-[#fa541c] text-[#fa541c] hover:bg-orange-50"
                  )}
                >
                  {isPreviewMode ? '返回编辑' : '预览'}
                </button>
              ) : (
                <button 
                  onClick={() => alert("正在进入课件预览...")} 
                  className="bg-white border border-[#fa541c] text-[#fa541c] hover:bg-orange-50 px-5 h-9 rounded text-[14px] font-medium transition-colors"
                >
                  预览
                </button>
              )}
              <button 
                onClick={() => {
                  alert("课件提交并发布成功！");
                  onClose();
                }} 
                className="bg-[#fa541c] hover:bg-[#e84a15] text-white border border-transparent px-5 h-9 rounded text-[14px] font-medium transition-colors shadow-sm shadow-orange-500/10"
              >
                提交
              </button>
            </div>
          ) : null}
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Outline Panel */}
          <div className="w-64 border-r border-neutral-200 bg-white flex flex-col h-full shrink-0">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
              <span className="text-[14px] font-bold text-neutral-800">课程目录结构</span>
              <button 
                onClick={() => {
                  setNewLessonType('doc');
                  setNewLessonName("");
                  setShowCreateLessonModal(true);
                }}
                className="text-[11px] bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe4d3] border border-[#ffbb96] px-2 py-0.5 rounded font-bold flex items-center gap-0.5 transition-colors"
              >
                <Plus className="w-3 h-3" /> 新建课节
              </button>
            </div>
            
            {/* Outline list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {syllabus.map((chapter: any, cIdx: number) => (
                <div key={chapter.id} className="space-y-1">
                  <div className="flex items-center justify-between group/chapter px-2 py-1 select-none hover:bg-neutral-50 rounded-lg transition-colors relative">
                    <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">
                      {chapter.chapter}
                    </span>
                    
                    {/* Chapter action buttons - visible on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                      {/* Plus button */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddChapterMenuOpenIndex(addChapterMenuOpenIndex === cIdx ? null : cIdx);
                            setChapterActionMenuOpenIndex(null);
                          }}
                          className="p-0.5 text-neutral-400 hover:text-[#fa541c] hover:bg-neutral-100 rounded transition-colors"
                          title="新建课件"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        
                        {addChapterMenuOpenIndex === cIdx && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setAddChapterMenuOpenIndex(null); }}></div>
                            <div className="absolute left-6 top-6 w-72 bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl z-30 p-3 select-none flex flex-col gap-1.5 animation-slide-up">
                              {[
                                { title: '教学课件', desc: '支持图文、PPT 文档、视频等', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', type: 'doc' },
                                { title: '实验课件', desc: '通过 notebook 制作实训课件', icon: Code, color: 'text-orange-500', bg: 'bg-orange-50', type: 'experiment' },
                                { title: '互动学习课件', desc: '知识点分段讲解视频融合实操', icon: MonitorPlay, color: 'text-blue-500', bg: 'bg-blue-50', type: 'split_doc' }
                              ].map((item, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewLessonType(item.type);
                                    setNewLessonName("");
                                    setAddChapterMenuOpenIndex(null);
                                    setShowCreateLessonModal(true);
                                  }} 
                                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group/item"
                                >
                                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors", item.bg, item.color)}>
                                    <item.icon className="w-4.5 h-4.5" />
                                  </div>
                                  <div className="text-left">
                                    <div className="text-[13px] font-bold text-neutral-800 mb-0.5 group-hover/item:text-[#fa541c] transition-colors">{item.title}</div>
                                    <div className="text-[11px] text-neutral-400 leading-normal">{item.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Three dots button */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setChapterActionMenuOpenIndex(chapterActionMenuOpenIndex === cIdx ? null : cIdx);
                            setAddChapterMenuOpenIndex(null);
                          }}
                          className="p-0.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                          title="更多操作"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        
                        {chapterActionMenuOpenIndex === cIdx && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setChapterActionMenuOpenIndex(null); }}></div>
                            <div className="absolute left-6 top-6 w-28 bg-white border border-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-lg z-30 py-1 overflow-hidden flex flex-col gap-0.5 animation-slide-up">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChapterToEdit(cIdx);
                                  setEditChapterName(chapter.chapter);
                                  setEditChapterTitle(chapter.title || "");
                                  setChapterActionMenuOpenIndex(null);
                                  setShowEditChapterModal(true);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 font-medium transition-colors"
                              >
                                编辑章节
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChapterToDelete(cIdx);
                                  setChapterActionMenuOpenIndex(null);
                                  setShowDeleteChapterModal(true);
                                }}
                                className="w-full text-left px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50 font-medium transition-colors"
                              >
                                删除章节
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {chapter.lessons.map((lesson: any, lIdx: number) => {
                      const isActive = activeLessonTitle === lesson.title;
                      return (
                        <div 
                          key={lIdx}
                          onClick={() => {
                            setActiveLessonTitle(lesson.title);
                            // Auto select the first slide when changing lesson
                            const slides = getSlidesForLesson(lesson.title);
                            if (slides.length > 0) {
                              setActiveSlideId(slides[0].id);
                            }
                          }}
                          className={cn(
                            "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border",
                            isActive 
                              ? "bg-orange-50 border-orange-100 text-[#fa541c]" 
                              : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className={cn("w-4 h-4 shrink-0", isActive ? "text-[#fa541c]" : "text-neutral-400")} />
                            <span className="text-[13px] font-medium truncate">{lesson.title}</span>
                          </div>
                          
                          {/* Lesson actions dropdown menu */}
                          <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLessonMenu(activeLessonMenu?.cIdx === cIdx && activeLessonMenu?.lIdx === lIdx ? null : { cIdx, lIdx });
                              }}
                              className="p-1 hover:bg-neutral-200/50 rounded text-neutral-400 hover:text-neutral-700"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                            {activeLessonMenu?.cIdx === cIdx && activeLessonMenu?.lIdx === lIdx && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setActiveLessonMenu(null); }}></div>
                                <div className="absolute top-6 right-0 w-24 bg-white border border-neutral-100 shadow-lg rounded-md z-30 py-1 overflow-hidden">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditModal(cIdx, lIdx, lesson.title);
                                      setActiveLessonMenu(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                                  >
                                    重命名
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDeleteModal(cIdx, lIdx);
                                      setActiveLessonMenu(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50"
                                  >
                                    删除课节
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions inside Sidebar (Added New Lesson) */}
            <div className="p-4 border-t border-neutral-100 shrink-0">
              <Button 
                onClick={() => {
                  setNewLessonName("");
                  setShowCreateLessonModal(true);
                }}
                className="w-full border border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-[#fa541c] hover:border-[#fa541c] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[13px] transition-all h-10"
              >
                <PlusCircle className="w-4 h-4" /> 新建课时
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-[#f5f6f8] flex flex-col items-center">
            {activeLessonTitle === '线性回归实训：预测考试分数' ? (
              <div className="flex-1 w-full bg-white flex flex-col overflow-hidden">
                {/* Editor Title */}
                {isPreviewMode ? (
                  <div className="px-6 py-3 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0 h-16 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="flex-1 flex justify-start items-center">
                      <div className="flex flex-col items-center relative">
                        <div className="border border-[#fa541c] text-[#fa541c] px-6 py-1.5 text-[13px] font-bold rounded-full bg-[#fff7f2] shadow-sm select-none">
                          线性回归实训-预测考试分数
                        </div>
                        {/* caret below the tab */}
                        <div className="absolute -bottom-2 text-[#fa541c] select-none text-[8px]">
                          ▲
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Info className="w-5 h-5 text-neutral-400 cursor-pointer hover:text-[#fa541c] transition-colors" />
                      <button 
                        onClick={() => navigate("/teacher/course/1/experiment/3.1.1")}
                        className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-9 px-5 rounded-lg flex items-center gap-1.5 shadow-md shadow-orange-500/10 text-[13px] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> 进入实训
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
                    <h2 className="text-[16px] font-bold text-neutral-800">线性回归实训：预测考试分数</h2>
                  </div>
                )}

                <div className="flex-1 flex overflow-hidden">
                  {/* Left Sidebar (custom single active item) */}
                  {!isPreviewMode && (
                    <div className="w-56 border-r border-neutral-100 flex flex-col bg-white">
                      <div className="py-2.5 px-4 text-[13px] font-bold text-[#fa541c] bg-[#fff7f2] relative border-r-2 border-r-[#fa541c] cursor-pointer h-11 flex items-center">
                        线性回归实训-预测考试分数
                      </div>
                    </div>
                  )}

                  {/* Right Content */}
                  <div className="flex-1 overflow-y-auto p-10 bg-white">
                    <div className="max-w-3xl mx-auto space-y-8 text-left">
                      <h1 className="text-3xl font-bold text-neutral-900 leading-tight">线性回归实训：预测考试分数</h1>
                      
                      <div className="space-y-4 text-[14px] text-neutral-700 leading-relaxed">
                        <p>本实训通过构建一个从学习时间预测考试分数的线性回归模型来展示数据的可视化。</p>
                        <p>假设我们收集了8位同学的学习时间与考试分数，如下。如何构建一个从学习时间预测考试分数的模型呢？</p>
                      </div>

                      <div className="overflow-x-auto py-2">
                        <table className="min-w-full border-collapse text-[13px] text-neutral-800">
                          <tbody>
                            <tr className="border-t border-b border-neutral-200">
                              <td className="py-3 px-4 bg-neutral-50 font-bold border-r border-neutral-200 w-24">学习时间</td>
                              {[2, 3, 4, 6, 7, 5, 8, 1].map((val, idx) => (
                                <td key={idx} className="py-3 px-4 text-center border-r border-neutral-200 font-medium">{val}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-neutral-200">
                              <td className="py-3 px-4 bg-neutral-50 font-bold border-r border-neutral-200 w-24">考试分数</td>
                              {[50, 55, 65, 70, 72, 80, 85, 88].map((val, idx) => (
                                <td key={idx} className="py-3 px-4 text-center border-r border-neutral-200 font-medium">{val}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="text-[14px] text-neutral-700 space-y-2">
                        <div className="font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span> 思考1:
                        </div>
                        <ul className="pl-6 space-y-1.5 list-disc text-neutral-600">
                          <li>是否可以通过线性回归模型求解？</li>
                          <li>如何判断？</li>
                        </ul>
                      </div>

                      <div className="py-4 flex flex-col items-center">
                        <div className="w-full max-w-[620px] bg-white border border-neutral-100 rounded-xl p-6 shadow-sm flex flex-col items-center">
                          <span className="text-[16px] font-bold text-neutral-800 mb-6">考试分数</span>
                          <div className="w-full aspect-[1.8/1] relative">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
                              {[0, 20, 40, 60, 80, 100].map((tick) => {
                                const y = 280 - (tick / 100) * 240;
                                return (
                                  <g key={tick}>
                                    <line x1="45" y1={y} x2="560" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                                    <text x="35" y={y + 4} textAnchor="end" className="text-[11px] fill-neutral-400 font-medium">{tick}</text>
                                  </g>
                                );
                              })}
                              
                              {[0, 2, 4, 6, 8, 10].map((tick) => {
                                const x = 50 + (tick / 10) * 500;
                                return (
                                  <g key={tick}>
                                    <text x={x} y="302" textAnchor="middle" className="text-[11px] fill-neutral-400 font-medium">{tick}</text>
                                  </g>
                                );
                              })}

                              <line x1="50" y1="210" x2="560" y2="78" stroke="#fa541c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                              {[
                                { x: 1, y: 88 },
                                { x: 2, y: 50 },
                                { x: 3, y: 55 },
                                { x: 4, y: 65 },
                                { x: 5, y: 80 },
                                { x: 6, y: 70 },
                                { x: 7, y: 72 },
                                { x: 8, y: 85 }
                              ].map((pt, idx) => {
                                const cx = 50 + (pt.x / 10) * 500;
                                const cy = 280 - (pt.y / 100) * 240;
                                return (
                                  <g key={idx} className="group cursor-pointer">
                                    <circle 
                                      cx={cx} 
                                      cy={cy} 
                                      r="5" 
                                      fill="#4096ff" 
                                      className="stroke-white stroke-2 drop-shadow-sm hover:scale-125 transition-transform" 
                                    />
                                    <text x={cx} y={cy - 10} textAnchor="middle" className="text-[11px] font-bold fill-neutral-700">{pt.y}</text>
                                  </g>
                                );
                              })}

                              <line x1="48" y1="40" x2="48" y2="280" stroke="#d9d9d9" strokeWidth="1" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-neutral-100 space-y-4">
                        <h2 className="text-xl font-bold text-neutral-800">1. 导入所需库</h2>
                        <div className="text-[14px] text-neutral-700 space-y-2">
                          <div className="font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span> 首先需要导入所需的库：
                          </div>
                          <ul className="pl-6 space-y-1.5 list-disc text-neutral-600">
                            <li>numpy是用来做数值计算的基础库；</li>
                            <li>sklearn.linear_model引入LinearRegression模型</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="h-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : ['职业简介', '认定方案', '代码复习讲义', '实操平台演示'].includes(activeLessonTitle) || syllabus.some((ch: any) => ch.lessons.some((l: any) => l.title === activeLessonTitle)) ? (
              <div className="flex-1 w-full bg-white flex flex-col overflow-hidden">
                {/* Editor Title */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-neutral-800">{activeLessonTitle}</h2>
                  <span className="text-[12px] bg-orange-50 text-[#fa541c] px-2 py-0.5 rounded font-medium">
                    {activeLessonTitle === '认定方案' ? '教学大纲' : '演示文稿'}
                  </span>
                </div>
                
                {/* Editor Toolbar (Moved inside the editor card) */}
                <div className="h-12 bg-[#F6F8FA] border-b border-neutral-100 flex items-center px-4 gap-1 overflow-x-auto shrink-0 scrollbar-hide">
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><Type className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors font-serif font-bold text-[14px]">B</button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors italic font-serif text-[14px]">I</button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors line-through font-serif text-[14px]">S</button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><Link className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-neutral-200 mx-2"></div>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><List className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><CheckSquare className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-neutral-200 mx-2"></div>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-neutral-200 mx-2"></div>
                  <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <button className="p-1.5 text-purple-500 hover:bg-purple-50 rounded transition-colors"><PlaySquare className="w-4 h-4" /></button>
                  <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition-colors"><FileText className="w-4 h-4" /></button>
                  
                  <div className="w-px h-4 bg-neutral-200 mx-2"></div>
                  
                  {/* AI Menu (Interactive) */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowAiMenu(!showAiMenu)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-bold transition-all",
                        showAiMenu 
                          ? "bg-[#fa541c] text-white border-[#fa541c]" 
                          : "border-orange-200 text-[#fa541c] bg-orange-50 hover:bg-orange-100"
                      )}
                    >
                      <Bot className="w-3.5 h-3.5" /> AI 备课 <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {showAiMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowAiMenu(false)}></div>
                        <div className="absolute top-10 left-0 w-48 bg-white border border-neutral-100 shadow-xl rounded-lg z-20 overflow-hidden py-1">
                          {[
                            { icon: FileText, label: '一键生成大纲' },
                            { icon: ImageIcon, label: '智能配图' },
                            { icon: Type, label: '润色文案' },
                            { icon: List, label: '提取核心要点' }
                          ].map((item, i) => (
                            <button 
                              key={i} 
                              onClick={() => setShowAiMenu(false)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-neutral-700 hover:bg-orange-50 hover:text-[#fa541c] transition-colors"
                            >
                              <item.icon className="w-3.5 h-3.5" /> {item.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="w-px h-4 bg-neutral-200 mx-2"></div>
                  
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><Settings className="w-4 h-4" /></button>
                  <button className="p-1.5 text-neutral-500 hover:text-[#fa541c] hover:bg-orange-50 rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                </div>

                {/* Inner Split Layout */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Inner Left Outline */}
                  <div className="w-56 border-r border-neutral-100 flex flex-col bg-[#fafafa]">
                    <div className="px-3 py-2 text-[12px] text-neutral-400 font-medium border-b border-neutral-100">大纲</div>
                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                      <div className="px-2">
                        <div className="flex items-center gap-1.5 px-2 py-1.5 cursor-pointer text-neutral-800 hover:bg-neutral-50 rounded group">
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-[12px] font-bold truncate">
                            {activeLessonTitle === '认定方案' ? '方案大纲' : '讲师发言稿'}
                          </span>
                        </div>
                        <div className="pl-6 mt-1 space-y-0.5 border-l border-neutral-200 ml-3">
                          {getSlidesForLesson(activeLessonTitle).map(slide => (
                            <div 
                              key={slide.id}
                              onClick={() => setActiveSlideId(slide.id)}
                              className={cn(
                                "px-3 py-1.5 text-[12px] rounded cursor-pointer transition-colors truncate select-none -ml-[1px] border-l-2",
                                slide.id === activeSlideId 
                                  ? "bg-orange-50 text-[#fa541c] border-[#fa541c] font-medium" 
                                  : "text-neutral-500 hover:bg-neutral-50 border-transparent hover:text-neutral-900"
                              )}
                            >
                              {slide.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inner Right Content */}
                  {(() => {
                    const lessonSlides = getSlidesForLesson(activeLessonTitle);
                    const currentSlide = (lessonSlides.find(s => s.id === activeSlideId) || lessonSlides[0] || { id: 1, title: '', heading: '', content: '' }) as any;
                    
                    if (activeLessonTitle === '认定方案') {
                      // Document Style for 认定方案
                      return (
                        <div className="flex-1 overflow-y-auto p-10 bg-white">
                          <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                              <span className="text-neutral-300 font-mono text-xl">H2</span>
                              <h1 className="text-2xl font-bold text-neutral-800">{currentSlide.heading}</h1>
                            </div>
                            
                            <div className="space-y-6 text-[15px] text-neutral-700 leading-relaxed mb-10">
                              <p className="text-justify">{currentSlide.content}</p>
                              
                              {currentSlide.points && (
                                <ul className="list-disc pl-6 space-y-3 text-neutral-700 text-[15px]">
                                  {currentSlide.points.map((pt: string, idx: number) => (
                                    <li key={idx}>
                                      {pt.includes('：') ? (
                                        <>
                                          <strong className="text-neutral-900">{pt.split('：')[0]}：</strong>
                                          {pt.split('：')[1]}
                                        </>
                                      ) : pt}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {currentSlide.alert && (
                              <div className="mt-10 p-5 bg-orange-50 border border-orange-100 rounded-lg text-[14px] text-orange-900 leading-relaxed flex items-start gap-3">
                                <div className="text-xl">💡</div>
                                <div>
                                  <strong className="block mb-1 font-bold">讲师教案批注：</strong>
                                  {currentSlide.alert}
                                </div>
                              </div>
                            )}
                            <div className="h-20"></div>
                          </div>
                        </div>
                      );
                    } else {
                      // Slide style for 职业简介, 实操平台演示, 代码复习讲义 or Custom newly created lesson
                      const isCodeReview = activeLessonTitle === '代码复习讲义';
                      const isPlatformDemo = activeLessonTitle === '实操平台演示';
                      
                      return (
                        <div className="flex-1 overflow-y-auto p-10 bg-white">
                          <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                              <span className="text-neutral-300 font-mono text-xl">H2</span>
                              <h1 className="text-2xl font-bold text-neutral-800">{currentSlide.heading}</h1>
                            </div>
                            
                            <div className="space-y-6 text-[15px] text-neutral-700 leading-relaxed mb-10">
                              <p>{currentSlide.content}</p>
                            </div>

                            {/* Embedded Beautiful Dynamic Slide Mock */}
                            {isPlatformDemo ? (
                              <div className="w-full aspect-[16/9] bg-[#f0f4fa] border border-[#dce4ec] rounded-lg relative overflow-hidden shadow-sm flex flex-col justify-end p-12">
                                <div className="absolute top-0 left-0 right-0 h-3 bg-neutral-900"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-3 bg-neutral-900"></div>
                                <div className="absolute top-12 left-0 w-3/4 h-12 bg-[#5b7eb3] clip-path-slant-right opacity-80"></div>
                                <div className="absolute bottom-12 left-10 w-24 h-8 bg-[#5b7eb3] clip-path-slant-left opacity-80"></div>
                                <div className="absolute bottom-10 right-10 flex gap-2">
                                   <div className="w-16 h-16 bg-blue-100 rounded-lg transform rotate-12 flex items-center justify-center text-blue-500 opacity-80"><Cpu className="w-8 h-8" /></div>
                                   <div className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center text-white"><PlaySquare className="w-8 h-8" /></div>
                                </div>
                                <h1 className="text-3xl font-black text-[#1a365d] mb-3 z-10">
                                  {currentSlide.slideTitle || currentSlide.heading}
                                </h1>
                                <h2 className="text-lg text-[#5b7eb3] font-light z-10">
                                  {currentSlide.slideSub || currentSlide.subHeading}
                                </h2>
                              </div>
                            ) : isCodeReview ? (
                              <div className="w-full aspect-[16/9] bg-[#f8f5ff] border border-[#ebe0ff] rounded-lg relative overflow-hidden shadow-sm flex flex-col justify-end p-12">
                                <div className="absolute top-0 left-0 right-0 h-3 bg-neutral-900"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-3 bg-neutral-900"></div>
                                <div className="absolute top-12 left-0 w-3/4 h-12 bg-[#8c52ff] clip-path-slant-right opacity-80"></div>
                                <div className="absolute bottom-10 right-10 flex gap-2">
                                   <div className="w-16 h-16 bg-purple-100 rounded-lg transform -rotate-12 flex items-center justify-center text-purple-600 opacity-80"><Code className="w-8 h-8" /></div>
                                   <div className="w-16 h-16 bg-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white"><Bot className="w-8 h-8" /></div>
                                </div>
                                <h1 className="text-3xl font-black text-[#3c1e80] mb-3 z-10">
                                  {currentSlide.slideTitle || currentSlide.heading}
                                </h1>
                                <h2 className="text-lg text-[#8c52ff] font-light z-10">
                                  {currentSlide.slideSub || currentSlide.subHeading}
                                </h2>
                              </div>
                            ) : (
                              // Default Slide Style (includes 职业简介)
                              <div className="w-full aspect-[16/9] bg-[#f8fbff] border border-blue-100 rounded-lg relative overflow-hidden shadow-sm flex flex-col justify-end p-12">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-bl-[100px]"></div>
                                <div className="absolute bottom-10 right-10 flex gap-2">
                                   <div className="w-16 h-16 bg-blue-100 rounded-lg transform rotate-12"></div>
                                   <div className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg"></div>
                                </div>
                                <h1 className="text-4xl font-black text-[#1a365d] mb-4 z-10">
                                  {currentSlide.slideTitle || (currentSlide.heading.includes('：') ? currentSlide.heading.split('：')[1] : currentSlide.heading)}
                                </h1>
                                <h2 className="text-xl text-[#5b7eb3] z-10">
                                  {currentSlide.slideSub || currentSlide.subHeading || '人工智能训练师实训课程'}
                                </h2>
                              </div>
                            )}
                            <div className="h-20"></div>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            ) : (
              // Blank State Mock
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-300 w-full animation-fade-in bg-white border-l border-neutral-200">
                 <FileText className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-[14px]">在这里输入课时内容或使用 AI 备课功能...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新建课节 Modal */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#fa541c]" /> 新建课节
              </h2>
              <button onClick={() => setShowCreateLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLesson}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课节名称
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入课节名称" 
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
                    autoFocus 
                    required
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
                <Button type="button" onClick={() => setShowCreateLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">添加</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 修改课节 Modal */}
      {showEditLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#fa541c]" /> 修改课节
              </h2>
              <button onClick={() => setShowEditLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditLesson}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 课节名称
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入课节名称" 
                    value={editLessonName}
                    onChange={(e) => setEditLessonName(e.target.value)}
                    autoFocus 
                    required
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
                <Button type="button" onClick={() => setShowEditLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除课节确认 Modal */}
      {showDeleteLessonModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-red-600 flex items-center gap-2">
                提示
              </h2>
              <button onClick={() => setShowDeleteLessonModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-neutral-700 font-medium">确定要删除该课节吗？删除后不可恢复。</p>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setShowDeleteLessonModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button type="button" onClick={handleDeleteLesson} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-8 shadow-md shadow-red-500/20">确定删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑章节 Modal */}
      {showEditChapterModal && chapterToEdit !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#fa541c] rounded-full shrink-0"></div>
                编辑章节
              </h2>
              <button onClick={() => setShowEditChapterModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editChapterName.trim()) return;
              const updatedSyllabus = [...syllabus];
              updatedSyllabus[chapterToEdit] = {
                ...updatedSyllabus[chapterToEdit],
                chapter: editChapterName,
                title: editChapterTitle
              };
              setSyllabus(updatedSyllabus);
              setShowEditChapterModal(false);
              setChapterToEdit(null);
            }}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 章节序号
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="例如：第一课" 
                    value={editChapterName}
                    onChange={(e) => setEditChapterName(e.target.value)}
                    autoFocus 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-800 flex items-center gap-1">
                    <span className="text-[#fa541c]">*</span> 章节标题
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c]" 
                    placeholder="请输入章节标题" 
                    value={editChapterTitle}
                    onChange={(e) => setEditChapterTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
                <Button type="button" onClick={() => setShowEditChapterModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
                <Button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white font-bold h-10 px-8 shadow-md shadow-orange-500/20">保存</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除章节确认 Modal */}
      {showDeleteChapterModal && chapterToDelete !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xs animation-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden border border-neutral-200 flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-[16px] font-bold text-red-600 flex items-center gap-2">
                提示
              </h2>
              <button onClick={() => setShowDeleteChapterModal(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-neutral-700 font-medium leading-relaxed">
                确定要删除这一整章吗？删除后，本章下的所有课节也将一并删除，此操作不可恢复。
              </p>
            </div>
            <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-end gap-3">
              <Button type="button" onClick={() => setShowDeleteChapterModal(false)} variant="outline" className="border-neutral-200 text-neutral-600 font-bold h-10 px-6">取消</Button>
              <Button type="button" onClick={() => {
                const updatedSyllabus = syllabus.filter((_, idx) => idx !== chapterToDelete);
                setSyllabus(updatedSyllabus);
                setShowDeleteChapterModal(false);
                setChapterToDelete(null);
              }} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-8 shadow-md shadow-red-500/20">确定删除</Button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .clip-path-slant-right {
          clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
        }
        .clip-path-slant-left {
          clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
}
