import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRight,
  LayoutTemplate, 
  FileQuestion, 
  BookOpenCheck, 
  Lightbulb, 
  Presentation, 
  BookText, 
  ClipboardCheck, 
  Image as ImageIcon, 
  Video, 
  MessageSquareMore, 
  Network, 
  MonitorPlay 
} from "lucide-react";

const assistants = [
  {
    id: 1,
    title: "AI 可视化助手（推荐）",
    description: "支持输入教学主题，一键生成教学知识并转化为可视化精美网页，还推荐相关学习资料。",
    icon: LayoutTemplate,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "AI 出题助手（推荐）",
    description: "根据输入主题、难度、题型、知识点、题目数量，自动生成题目。",
    icon: FileQuestion,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    id: 3,
    title: "AI 生成教案（推荐）",
    description: "支持根据主题方向、特定需求、参考标准等，一站式生成单元教案及作业。",
    icon: BookOpenCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    id: 4,
    title: "解题助手",
    description: "支持题目截图、文字输入解题等等。",
    icon: Lightbulb,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    id: 5,
    title: "课堂教学设计生成",
    description: "根据输入主题课程内容，自动生成课堂教学设计方案大纲。",
    icon: Presentation,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    id: 6,
    title: "论文速读",
    description: "智能总结论文研究背景、核心方法、主要结论和应用价值等。",
    icon: BookText,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    id: 7,
    title: "作业批改",
    description: "根据输入的作业、试卷，智能生成批改结果、打分、以及评语，为教师提升评阅效率。",
    icon: ClipboardCheck,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    id: 8,
    title: "图片生成",
    description: "根据文案生成不同风格图片。",
    icon: ImageIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    id: 9,
    title: "视频生成",
    description: "根据文本描述的内容快速生成视频，支持根据用户需求调整风格和时长。",
    icon: Video,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: 10,
    title: "多模态聊天助手",
    description: "支持文生文、文生图、文生视频、文档解析的多模态 AI 助手。",
    icon: MessageSquareMore,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
  },
  {
    id: 11,
    title: "AI 知识图谱",
    description: "AI 辅助绘制知识图谱，图谱化数据。",
    icon: Network,
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-500",
  },
  {
    id: 12,
    title: "PPT 制作助手",
    description: "PPT 生成工具，一句话生成完整 PPT 内容。",
    icon: MonitorPlay,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  }
];

export default function UserAIAssistant() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-neutral-caption mb-4">
            <span className="hover:text-primary cursor-pointer transition-colors">首页</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-neutral-title font-medium">AI 助手</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-title">AI 助手</h1>
          <p className="text-sm text-neutral-caption mt-2">
            提供多种场景的 AI 辅助工具，提升教学与学习效率
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assistants.map((assistant) => (
            <Card 
              key={assistant.id} 
              className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-neutral-border/60 hover:border-primary/30 bg-white rounded-2xl overflow-hidden flex flex-col h-full"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${assistant.iconBg} ${assistant.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <assistant.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-bold text-neutral-title mb-3 group-hover:text-primary transition-colors">
                  {assistant.title}
                </h3>
                <p className="text-[13px] text-neutral-caption leading-relaxed flex-1">
                  {assistant.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

