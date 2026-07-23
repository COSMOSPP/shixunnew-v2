import React, { useState } from "react";
import { 
  BookOpen, FolderKanban, FileQuestion, Cpu, Building, CheckCircle, 
  Clock, Search, Filter, Check, Shield, AlertCircle, Sparkles, X, 
  FileText, ClipboardCheck, ThumbsUp, User, ChevronRight, Database,
  ChevronDown, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Mock Data ---

interface AuditResource {
  id: string;
  name: string;
  creator: string;
  tenant: string;
  submitTime: string;
  status: "待审核" | "审核中" | "已通过" | "已驳回";
  auditType?: "公开" | "下架";
  rejectionReason?: string;
  details: {
    meta: string; // e.g. "32课时 | 2学分"
    content: string; // long summary
    outline: string[]; // key sub-items
  };
}

const initialResources: Record<"course" | "project" | "question" | "ai_capacity" | "practice" | "dataset", AuditResource[]> = {
  course: [
    {
      id: "AUD-CRS-001",
      name: "大语言模型工程应用与LoRA微调技术",
      creator: "张旭东 教授",
      tenant: "北京大学信息学院",
      submitTime: "2026-05-26 11:30",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "32 课时 | 2.0 学分 | RAG 与 LoRA 核心方向",
        content: "本课程专注大模型应用落地，涵盖 Prompt Engineering 最佳编写规范、语义向量数据库融合、RAG 混合召回系统搭建，以及利用 LoRA 算法针对垂直行业私有数据集进行高效微调部署。",
        outline: [
          "第一章: 生成式 AI 与大模型产业背景 (4课时)",
          "第二章: 向量检索与 RAG 融合系统架构 (8课时)",
          "第三章: 参数高效微调 (PEFT) 与 LoRA 实战 (12课时)",
          "第四章: 大模型安全合规性与企业级沙箱部署 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-002",
      name: "Python数据分析与多维科学计算实训",
      creator: "陈明 助教",
      tenant: "复旦大学软件学院",
      submitTime: "2026-05-25 10:15",
      status: "审核中",
      auditType: "公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 数据分析与建模方向",
        content: "实战向数据科学基石课，针对高校学生定制，主攻 Numpy 多维数值计算、Pandas 多维表格数据操作清洗、Matplotlib & Seaborn 数据智能分析呈现以及 Scikit-learn 基本经典算法训练。",
        outline: [
          "第一章: Python 编程基础与科学计算环境搭建 (6课时)",
          "第二章: Numpy 矩阵操作与向量运算加速 (10课时)",
          "第三章: Pandas 高维数据清洗、聚合与时序操作 (16课时)",
          "第四章: 经典机器学习回归、分类及特征工程实战 (16课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-003",
      name: "计算机视觉与OpenCV图像处理实践",
      creator: "黄建华 教授",
      tenant: "浙江大学计算机学院",
      submitTime: "2026-05-27 09:10",
      status: "待审核",
      auditType: "下架",
      details: {
        meta: "36 课时 | 2.5 学分 | 图像算法方向",
        content: "该课程由教师提请申请下架，因课程教材版本升级且部分依赖库已被淘汰，需暂时从公共目录中下架该课程资源。",
        outline: [
          "下架申请原因: 教学大纲与OpenCV 4.0标准不符合，课程技术栈过时需更新",
          "后续安排: 预计下个学期完成新版大纲重构后再重新申请公开"
        ]
      }
    },
    {
      id: "AUD-CRS-004",
      name: "深度学习原理与PyTorch神经网络实战",
      creator: "李国强 副教授",
      tenant: "上海交通大学电子信息学院",
      submitTime: "2026-05-24 16:45",
      status: "已通过",
      auditType: "公开",
      details: {
        meta: "64 课时 | 4.0 学分 | 深度学习算法方向",
        content: "从神经网络感知机模型推导开始，涵盖 CNN、RNN、LSTM 及 Attention 机制原理，并在 PyTorch 框架下完成图像分类与自动文本生成项目搭建。",
        outline: [
          "第一章: 前向传播与反向传播算法推导 (12课时)",
          "第二章: 卷积神经网络 (CNN) 架构演进与 ImageNet 竞赛模型 (18课时)",
          "第三章: 循环神经网络与 Sequence-to-Sequence 模型 (18课时)",
          "第四章: PyTorch 模型分布式多卡训练实践 (16课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-005",
      name: "商业智能分析与Spark大数据处理大纲",
      creator: "王敏 讲师",
      tenant: "南京大学管理学院",
      submitTime: "2026-05-27 11:20",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "32 课时 | 2.0 学分 | 大数据处理方向",
        content: "讲解 Spark 核心数据结构 RDD、DataFrame 及 Spark SQL 查询优化器原理，配套千亿级电商日志离线清洗与实时流计算实训任务。",
        outline: [
          "第一章: 大数据生态与 HDFS 分布式存储 (6课时)",
          "第二章: Spark 算子转换与内存计算架构 (10课时)",
          "第三章: Spark SQL 与数据仓库 Hive 整合实践 (10课时)",
          "第四章: 实时流计算 Spark Streaming 项目实训 (6课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-006",
      name: "强化学习与自动驾驶决策规划算法",
      creator: "赵云 教授",
      tenant: "同济大学汽车学院",
      submitTime: "2026-05-23 14:00",
      status: "已通过",
      auditType: "下架",
      details: {
        meta: "40 课时 | 2.5 学分 | 智能驾驶方向",
        content: "教师申请将老版 DQ-Network 课程下架，更新为 PPO 与 SAC 连续动作空间决策算法。",
        outline: [
          "下架申请原因: 旧版 DQN 算法例程无法接入 Carla 0.9.15 新版仿真引擎",
          "后续安排: 替换为现代连续控制 SAC 策略梯度课程后重提交"
        ]
      }
    },
    {
      id: "AUD-CRS-007",
      name: "企业级微服务架构与K8s容器化部署",
      creator: "周建军 专家",
      tenant: "东南大学软件学院",
      submitTime: "2026-05-26 17:30",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 云原生方向",
        content: "覆盖 Docker 容器化构建、Spring Cloud 微服务组件拆分、Istio 服务网格与 Kubernetes Horizontal Pod Autoscaler 弹性扩缩容部署。",
        outline: [
          "第一章: 容器化演进与 Dockerfile 最佳实践 (10课时)",
          "第二章: Spring Cloud Alibaba 服务发现与配置中心 (14课时)",
          "第三章: Kubernetes 资源调度与 Helm 编排实战 (16课时)",
          "第四章: 云原生 DevOps 持续集成与发布 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-008",
      name: "前沿推荐系统算法与多路召回排序实践",
      creator: "孙艺 助教",
      tenant: "华中科技大学电信学院",
      submitTime: "2026-05-22 08:30",
      status: "已驳回",
      auditType: "公开",
      rejectionReason: "实验数据集中缺少脱敏处理说明，且第二章算法推理细则缺少配套练习答案。",
      details: {
        meta: "32 课时 | 2.0 学分 | 推荐算法方向",
        content: "讲解协同过滤、FM 因子分解机、DeepFM 及向量化双塔召回算法，结合真实流媒体点播场景进行 CTCVR 多目标拟合。",
        outline: [
          "第一章: 协同过滤与矩阵分解 (8课时)",
          "第二章: 深度学习推荐模型 DeepFM / DIN (10课时)",
          "第三章: 多路召回与向量数据库近似最近邻检索 (8课时)",
          "第四章: 多目标排序与重排策略 (6课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-009",
      name: "嵌入式AI与Edge Impulse边缘计算实训",
      creator: "宋华 教授",
      tenant: "西安交通大学微电子学院",
      submitTime: "2026-05-27 13:50",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "24 课时 | 1.5 学分 | 边缘计算方向",
        content: "结合 STM32F4 / ESP32 硬件板卡，讲授轻量化神经网络剪枝、8-bit 定点量化，并在 MCU 资源受限微控制器上运行 TinyML 实时姿态识别。",
        outline: [
          "第一章: 边缘计算与 TinyML 架构概论 (4课时)",
          "第二章: 神经网络参数剪枝与 INT8 量化算法 (8课时)",
          "第三章: 在 STM32 目标板上部署 TensorFLow Lite for Microcontrollers (12课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-010",
      name: "Web3智能合约开发与区块链安全审计",
      creator: "徐洋 讲师",
      tenant: "哈尔滨工业大学计算学部",
      submitTime: "2026-05-25 19:10",
      status: "待审核",
      auditType: "下架",
      details: {
        meta: "32 课时 | 2.0 学分 | 区块链方向",
        content: "申请下架包含已有重入攻击缺陷案例的实验项目，更新为 OpenZeppelin 5.0 安全库标准。",
        outline: [
          "下架申请原因: Solidity 0.8.20 语法更新，原以太坊硬分叉测试网 Goerli 已停用",
          "后续安排: 升级至 Sepolia 测试网后重新提交公开审核"
        ]
      }
    },
    {
      id: "AUD-CRS-011",
      name: "自然语言处理与BERT/GPT大模型理论",
      creator: "钱峰 教授",
      tenant: "中山大学计算机学院",
      submitTime: "2026-05-21 15:20",
      status: "已通过",
      auditType: "公开",
      details: {
        meta: "40 课时 | 2.5 学分 | NLP 方向",
        content: "从 Word2Vec 词向量表征、Seq2Seq 语法树解析，到 Transformer Encoder-Decoder 结构，系统剖析 BERT 预训练语言模型与 GPT 自回归生成模型原理。",
        outline: [
          "第一章: 传统文本表征与 N-gram 语言模型 (8课时)",
          "第二章: BERT 掩码语言模型与下游任务微调 (14课时)",
          "第三章: GPT 系列模型自回归解码策略 (18课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-012",
      name: "工业级RAG检索增强生成与知识图谱融合",
      creator: "韩梅 副教授",
      tenant: "天津大学智能与计算学部",
      submitTime: "2026-05-27 15:00",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "36 课时 | 2.5 学分 | 知识图谱方向",
        content: "围绕企业私有知识库问答痛点，融合 Neo4j 图数据库实体关系检索与 Milvus 向量数据库相似度召回，实现 GraphRAG 混合增强系统。",
        outline: [
          "第一章: 知识图谱构建与实体关系抽取 (10课时)",
          "第二章: 混合召回 RAG 架构与重排序 Rerank 模型 (12课时)",
          "第三章: GraphRAG 工业级知识库系统搭建实训 (14课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-013",
      name: "软件质量保证与自动化测试框架设计",
      creator: "彭亮 助教",
      tenant: "北京邮电大学软件学院",
      submitTime: "2026-05-20 11:00",
      status: "已驳回",
      auditType: "下架",
      rejectionReason: "下架申请理由阐述不清，且该课程尚在校内公开选课阶段，需先协调教务部门。",
      details: {
        meta: "32 课时 | 2.0 学分 | 软件测试方向",
        content: "涵盖 JUnit 5 单元测试、Selenium 网页 UI 自动化测试、JMeter 性能压力测试及 CI/CD 测试管线搭建。",
        outline: [
          "申请说明: 申请下架老版测试大纲",
          "驳回说明: 需提供教务处变更审批件"
        ]
      }
    },
    {
      id: "AUD-CRS-014",
      name: "智能语音识别与Whisper模型落地实践",
      creator: "郑浩 教授",
      tenant: "电子科技大学信息与通信工程学院",
      submitTime: "2026-05-27 16:30",
      status: "待审核",
      auditType: "公开",
      details: {
        meta: "24 课时 | 1.5 学分 | 语音处理方向",
        content: "介绍梅尔倒谱系数 (MFCC) 提取、CTC 损失函数原理，并基于 OpenAI Whisper 开展长音频字幕时间戳自动对齐实训。",
        outline: [
          "第一章: 声学信号处理与梅尔频谱图转换 (6课时)",
          "第二章: Whisper 语音模型架构与多语言转写 (10课时)",
          "第三章: 实时流式语音识别 API 部署 (8课时)"
        ]
      }
    },
    {
      id: "AUD-CRS-015",
      name: "算法高阶推导与LeetCode百题通关指南",
      creator: "马远 讲师",
      tenant: "中国科学技术大学计算机学院",
      submitTime: "2026-05-19 10:00",
      status: "已通过",
      auditType: "公开",
      details: {
        meta: "48 课时 | 3.0 学分 | 算法设计方向",
        content: "主攻高阶数据结构与动态规划，包含线段树、并查集、单调栈、Dijkstra 最短路径及背包问题推导解析。",
        outline: [
          "第一章: 复杂数据结构高级应用 (12课时)",
          "第二章: 图论算法与最短路径/最小生成树 (14课时)",
          "第三章: 动态规划状态转移方程构建精讲 (22课时)"
        ]
      }
    }
  ],
  project: [
    {
      id: "AUD-PRJ-001",
      name: "云原生微服务高并发电商实训项目",
      creator: "王强 教授",
      tenant: "清华大学计算机系",
      submitTime: "2026-05-26 14:00",
      status: "待审核",
      details: {
        meta: "大型分布式实训项目 | 建议耗时 2-3 周",
        content: "本实训模拟企业级超高并发电商结算场景，要求学生使用 Spring Cloud Alibaba 进行微服务治理，整合 Kubernetes 自动化容器调度、Sentinel 限流熔断防护，以及 Redis 哨兵多级缓存及秒杀库存一致性问题解决。",
        outline: [
          "环节一: 系统模块微服务架构拆分与 Eureka 注册中心注册",
          "环节二: 使用 Redis 乐观锁 + Lua 脚本实现超卖防御与一致性",
          "环节三: 编写 Dockerfile 并使用 Jenkins 流水线自动推送 Harbor",
          "环节四: 在 K8s 上编写 Deployment 与 Service 文件进行水平扩缩容部署"
        ]
      }
    },
    {
      id: "AUD-PRJ-002",
      name: "ResNet50医学影像病灶智能分割项目",
      creator: "徐教授",
      tenant: "上海交通大学医学院",
      submitTime: "2026-05-24 09:00",
      status: "已通过",
      details: {
        meta: "深度学习医学影像实训 | 建议耗时 1-2 周",
        content: "跨学科前沿 AI 实验。学生需要使用 PyTorch 加载预训练 ResNet50/UNet 模型，针对脱敏公开的肺部 CT/脑部 MRI 影像进行边缘检测与图像分割处理，使用 Dice 相似系数评估病灶捕捉效果。",
        outline: [
          "环节一: 医学 DICOM 图像格式转换及 CLAHE 对比度受限自适应直方图均衡化",
          "环节二: 使用 PyTorch 构建包含 Skip Connection 的 UNet 核心网络",
          "环节三: 采用 CrossEntropy 与 Dice Loss 混合损失函数进行迭代寻优",
          "环节四: 通过 Confusion Matrix 计算 Precision、Recall 和 F1-score 指标"
        ]
      }
    }
  ],
  question: [
    {
      id: "AUD-QUE-001",
      name: "Transformer自注意力机制物理意义考核题",
      creator: "刘博士",
      tenant: "浙江大学控制系",
      submitTime: "2026-05-26 15:30",
      status: "待审核",
      details: {
        meta: "大模型理论主观思考题 | 标签: 深度学习, Transformer",
        content: "简答题：请写出 Transformer 核心架构中 Self-Attention (自注意力机制) 的数学计算公式，并分别详细阐述公式中查询矩阵 (Q)、键矩阵 (K)、值矩阵 (V) 的物理含义。最后说明为什么在计算内积后需要除以根号下 dk 缩放因子？",
        outline: [
          "考察知识点: Transformer 架构, QKV 矩阵投影, 梯度消失预防机制",
          "评分标准一: 完整写出 Self-Attention 公式: Softmax(Q K^T / sqrt(d_k)) * V 占 30% 分数",
          "评分标准二: 阐明 Q-查询, K-被查询键值, V-内容信息的表征占 40% 分数",
          "评分标准三: 解释除以缩放因子是为了防止 dk 维度过大时内积结果过大，Softmax 进入饱和区导致梯度消失占 30% 分数"
        ]
      }
    },
    {
      id: "AUD-QUE-002",
      name: "Kubernetes就绪与存活探针机制单选题",
      creator: "赵讲师",
      tenant: "武汉大学软件学院",
      submitTime: "2026-05-25 16:00",
      status: "已通过",
      details: {
        meta: "云原生容器单选题 | 标签: K8s, 运维监控",
        content: "单选题：在 Kubernetes 的 Pod 生命周期管理中，如果希望评估容器内服务是否已经初始化完成，能正常承接外部网关 Service 流量，应该优选配置哪种机制？\n选项：\nA. Liveness Probe (存活探针)\nB. Readiness Probe (就绪探针)\nC. Startup Probe (启动探针)\nD. PostStart Hook (后置启动钩子)",
        outline: [
          "正确答案: B. Readiness Probe (就绪探针)",
          "解析: Readiness Probe 就绪探针用来确定容器是否准备好接受网络服务流量。若就绪探针失败，Endpoint 控制器会将该 Pod 的 IP 从 Service 对应的主机列表中移除，不予转发网络请求；而 Liveness Probe 失败时会自动重启容器，不属于纯粹的外部流量准入控制。"
        ]
      }
    }
  ],
  ai_capacity: [
    {
      id: "AUD-AIC-001",
      name: "智能中英文口语流畅度及发音评测能力",
      creator: "吴教授",
      tenant: "南京大学外国语学院",
      submitTime: "2026-05-26 17:00",
      status: "待审核",
      details: {
        meta: "音频评测 API 能力 | 平均响应 SLA 150ms",
        content: "提供一键式流式音频口语发音评估 API。支持录入 mp3/wav 音频与标准文本对比，智能识别学生读音中的音素错漏、重音偏移、语流卡顿及流畅度得分，完美贴合英语人机口语实训教学。",
        outline: [
          "接口规格: POST /api/v1/speech/eval (Payload: audio_file, target_text)",
          "吞吐量限制: 单租户默认并发数 50 QPS, 可按需配额扩增",
          "底层模型: 基于 Whisper-v3 音素对齐优化模型"
        ]
      }
    }
  ],
  practice: [
    {
      id: "AUD-PRC-001",
      name: "大规模预训练大模型分布式微调最佳实践",
      creator: "陈博士",
      tenant: "复旦大学计算机学院",
      submitTime: "2026-05-27 10:20",
      status: "待审核",
      details: {
        meta: "分布式微调实践 | 推荐星级 5 星",
        content: "本实践介绍如何使用 DeepSpeed 和 Megatron-LM 在多机多卡 GPU 环境下进行 70B 参数规模 LLM 的 3D 并行（张量并行、流水线并行、数据并行）的高效分布式微调与优化。",
        outline: [
          "第一阶段: 分布式环境初始化与无缝集群连接配置",
          "第二阶段: Megatron-LM 与 DeepSpeed 混合配置文件的精细调优",
          "第三阶段: 针对大模型吞吐与显存占用的量化微调技术 (FP16/BF16)",
          "第四阶段: 故障自动恢复与多节点网络通信拥堵排除实践"
        ]
      }
    }
  ],
  dataset: [
    {
      id: "AUD-DTS-001",
      name: "多模态中文医疗问答微调高质量数据集",
      creator: "李教授",
      tenant: "浙江大学医学院",
      submitTime: "2026-05-26 09:40",
      status: "待审核",
      details: {
        meta: "医疗问答数据集 | 100万条高质量对话",
        content: "本数据集专为医疗行业多模态大模型定制，包含100万条经过医学专家脱敏与多轮校验的高质量中文医疗问答对与对应诊断 CT 图片，数据格式完全契合 JSON-L 及 WebDataset 规范。",
        outline: [
          "格式标准: JSON Lines 纯文本 + 图像 Base64 字典",
          "数据清洗: 已使用过滤规则对病患姓名、证件、病历号等敏感隐私数据进行脱敏",
          "适用方向: 医疗垂直行业大模型指令微调、评测与 RAG 知识库检索"
        ]
      }
    }
  ]
};

export default function AdminAudit() {
  const [activeMenu, setActiveMenu] = useState<"course" | "project" | "question" | "ai_capacity" | "practice" | "dataset">("course");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"全部" | "待审核" | "已通过" | "已驳回">("全部");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states (Ref TeacherQuestions)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const toggleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedItemIds(paginatedResources.map(r => r.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [resources, setResources] = useState<Record<string, AuditResource[]>>(initialResources);
  const activeList = resources[activeMenu] || [];

  // Review Drawer state
  const [reviewingItem, setReviewingItem] = useState<AuditResource | null>(null);
  const [rejectionInput, setRejectionInput] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Scorecards toggles
  const [checkQuality, setCheckQuality] = useState(true);
  const [checkOriginality, setCheckOriginality] = useState(true);
  const [checkStandard, setCheckStandard] = useState(true);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id: string) => {
    const targetItem = activeList.find(item => item.id === id);
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已通过" as const };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    if (targetItem?.auditType === "下架") {
      triggerToast("审核通过！该资源已从平台公共目录成功下架。");
    } else {
      triggerToast("审核通过！资源已正式升级为平台公共资源，全网租户可见可用。");
    }
  };

  const handleReject = (id: string) => {
    if (!rejectionInput.trim()) {
      triggerToast("请填写具体的驳回意见，告知教师需要调整的格式或缺陷！");
      return;
    }
    const updated = activeList.map(item => {
      if (item.id === id) {
        return { ...item, status: "已驳回" as const, rejectionReason: rejectionInput };
      }
      return item;
    });
    setResources({ ...resources, [activeMenu]: updated });
    setReviewingItem(null);
    setShowRejectForm(false);
    setRejectionInput("");
    triggerToast("已驳回申请，审核意见已安全投递到该校教师工作台。");
  };

  // Counting pending requests for left badges
  const getPendingCount = (key: "course" | "project" | "question" | "ai_capacity" | "practice" | "dataset") => {
    return (resources[key] || []).filter(item => item.status === "待审核").length;
  };

  const filteredResources = activeList.filter(item => {
    const matchesStatus = activeStatusFilter === "全部" || item.status === activeStatusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredResources.length / pageSize) || 1;
  const paginatedResources = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-neutral-800">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[14px] font-medium text-neutral-800">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Menu */}
      <div className="w-[240px] border-r border-neutral-border flex-shrink-0 flex flex-col bg-white h-full">
        <div className="p-5 border-b border-neutral-border shrink-0">
          <h2 className="text-lg font-semibold text-neutral-title">审核中心</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Menu Item 1: Course */}
          <button 
            onClick={() => { setActiveMenu("course"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "course" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>课程审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("project"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "project" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span>项目审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("practice"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "practice" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <ThumbsUp className="w-4 h-4 shrink-0" />
            <span>最佳实践审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("dataset"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "dataset" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>数据集审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("question"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "question" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>试题审核</span>
          </button>
          <button 
            onClick={() => { setActiveMenu("ai_capacity"); setActiveStatusFilter("全部"); setCurrentPage(1); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[14px] font-medium transition-all duration-200 cursor-pointer text-left border-0 bg-transparent",
              activeMenu === "ai_capacity" 
                ? "bg-[#fff2e8] text-[#fa541c] font-semibold" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>AI能力审核</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto bg-[#f5f6f8] p-8 flex flex-col min-h-0 space-y-4">
        {/* Header Title Section (Styled exact matching TeacherQuestions) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
          <div className="flex items-end gap-4">
            <h1 className="text-xl font-bold text-neutral-900">
              {activeMenu === "course" && "课程审核"}
              {activeMenu === "project" && "项目审核"}
              {activeMenu === "question" && "试题审核"}
              {activeMenu === "ai_capacity" && "AI能力审核"}
              {activeMenu === "practice" && "最佳实践审核"}
              {activeMenu === "dataset" && "数据集审核"}
            </h1>
            <p className="text-sm text-neutral-500 mb-0.5">
              {activeMenu === "course" && "审核各高校教师提请公开与下架的实训课程大纲，审核通过后同步更新公共课程资源库状态"}
              {activeMenu === "project" && "评估企业级及学术性前沿实训项目案例，通过后在全网范围提供秒级沙箱环境部署"}
              {activeMenu === "question" && "严控试卷试题的知识点覆盖度、科学性及格式标准，确保高价值考核资源的入库品质"}
              {activeMenu === "ai_capacity" && "测试和校验教师研发定制的高性能AI大模型API接口、离线推理实例以及流畅度评测能力"}
              {activeMenu === "practice" && "审核教师及专家提请公开的优质企业级与学术前沿最佳实践方案，核准后上架公共目录"}
              {activeMenu === "dataset" && "严加甄别与审计共享数据集的合规度、隐私脱敏及标注规范性，确保高质量科学研究数据的开放安全"}
            </p>
          </div>

          {/* Quick Statistics Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded border border-neutral-border text-xs flex items-center gap-2">
              <span className="text-neutral-500 font-medium">总数:</span>
              <span className="font-bold text-neutral-800">{activeList.length}</span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded border border-neutral-border text-xs flex items-center gap-2">
              <span className="text-neutral-500 font-medium">待审核:</span>
              <span className="font-bold text-[#fa541c]">{getPendingCount(activeMenu)}</span>
            </div>
          </div>
        </div>

        {/* Table and Toolbar Unified Module (Ref TeacherQuestions Style) */}
        <div className="bg-white rounded border border-neutral-border overflow-hidden flex-1 flex flex-col">
          {/* Integrated Toolbar Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-neutral-border/50 bg-white shrink-0">
            {/* Search Input bar & Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text"
                  placeholder="请输入要搜索的内容"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-neutral-border rounded-full text-sm focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] text-neutral-800 transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Right: Actions & Status Pill Selectors */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex bg-neutral-100 rounded-full p-1 border border-neutral-200/50">
                {(["全部", "待审核", "已通过", "已驳回"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setActiveStatusFilter(f); setCurrentPage(1); setSelectedItemIds([]); }}
                    className={cn(
                      "px-4 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer border-0 bg-transparent",
                      activeStatusFilter === f 
                        ? "bg-white text-[#fa541c] font-bold shadow-sm" 
                        : "text-neutral-body hover:text-neutral-title"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {selectedItemIds.length > 0 && (
                <Button 
                  onClick={() => {
                    triggerToast(`已为选中的 ${selectedItemIds.length} 项资源发起批量处理`);
                    setSelectedItemIds([]);
                  }}
                  className="bg-[#fff2e8] text-[#fa541c] hover:bg-[#ffe8d6] border border-[#ffbb96]/50 h-8 px-3 rounded-[4px] text-xs font-semibold cursor-pointer shadow-2xs transition-all"
                >
                  批量审核 ({selectedItemIds.length})
                </Button>
              )}
            </div>
          </div>

          {/* Main Table Content - Natural height without vertical scrollbar */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-border/50 bg-neutral-50/50 text-[13px] text-neutral-600 font-medium">
                  <th className="pl-6 pr-3 py-3.5 font-medium w-12 text-left">
                    <button 
                      type="button"
                      onClick={() => toggleSelectAll(selectedItemIds.length !== paginatedResources.length || paginatedResources.length === 0)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                        selectedItemIds.length === paginatedResources.length && paginatedResources.length > 0
                          ? "bg-[#fa541c] border-[#fa541c] text-white"
                          : "border-neutral-300 hover:border-[#fa541c] bg-white"
                      )}
                    >
                      {selectedItemIds.length === paginatedResources.length && paginatedResources.length > 0 && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                  </th>
                  <th className="px-3 py-3.5 font-medium text-left">资源名称</th>
                  <th className="px-3 py-3.5 font-medium text-left">
                    <div className="flex items-center gap-1">类型 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="px-3 py-3.5 font-medium text-left">提交教师</th>
                  <th className="px-3 py-3.5 font-medium text-left">
                    <div className="flex items-center gap-1">申请时间 <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="px-3 py-3.5 font-medium text-left">
                    <div className="flex items-center gap-1">审核状态 <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /></div>
                  </th>
                  <th className="pl-3 pr-6 py-3.5 font-medium text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResources.map((item, index) => (
                  <tr key={item.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors group text-[13px]", index === paginatedResources.length - 1 && "border-b-0")}>
                    <td className="pl-6 pr-3 py-3 text-left">
                      <button 
                        type="button"
                        onClick={() => toggleSelectItem(item.id)}
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer",
                          selectedItemIds.includes(item.id)
                            ? "bg-[#fa541c] border-[#fa541c] text-white"
                            : "border-neutral-300 hover:border-[#fa541c] bg-white"
                        )}
                      >
                        {selectedItemIds.includes(item.id) && <span className="text-[10px] font-bold">✓</span>}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-left">
                      <div className="font-medium text-neutral-800 group-hover:text-[#fa541c] transition-colors cursor-pointer truncate max-w-[340px]" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">{item.id}</div>
                    </td>
                    <td className="px-3 py-3 text-left">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[12px] rounded font-medium border",
                        (item.auditType || "公开") === "公开" 
                          ? "bg-blue-50 text-blue-600 border-blue-200" 
                          : "bg-orange-50 text-[#fa541c] border-[#ffbb96]"
                      )}>
                        {item.auditType || "公开"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-600">
                      <div className="text-neutral-800 font-medium">{item.creator}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{item.tenant}</div>
                    </td>
                    <td className="px-3 py-3 text-left text-neutral-500 font-mono">{item.submitTime}</td>
                    <td className="px-3 py-3 text-left">
                      {item.status === "已通过" && (
                        <span className="text-emerald-600 font-medium">已通过</span>
                      )}
                      {item.status === "待审核" && (
                        <span className="text-[#fa541c] font-medium">待审核</span>
                      )}
                      {item.status === "已驳回" && (
                        <span className="text-rose-600 font-medium">已驳回</span>
                      )}
                      {item.status === "审核中" && (
                        <span className="text-blue-600 font-medium">审核中</span>
                      )}
                    </td>
                    <td className="pl-3 pr-6 py-3 text-left">
                      {item.status === "待审核" || item.status === "审核中" ? (
                        <button 
                          onClick={() => setReviewingItem(item)}
                          className="text-[#fa541c] hover:text-[#e84a15] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-semibold"
                        >
                          审核
                        </button>
                      ) : (
                        <button 
                          onClick={() => setReviewingItem(item)}
                          className="text-neutral-500 hover:text-[#fa541c] transition-colors bg-transparent border-0 cursor-pointer p-0 text-[13px] font-medium"
                        >
                          查看
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredResources.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-16 text-center text-xs text-neutral-caption italic">
                      暂无符合条件的审核记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component - Ref TeacherQuestions */}
          <div className="flex items-center justify-end px-6 py-4 gap-4 border-t border-neutral-border/30 bg-white">
            <span className="text-[13px] text-neutral-500">共 {filteredResources.length} 条</span>
            <div className="flex items-center gap-2">
              <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-sm cursor-pointer border-neutral-200 text-neutral-600 disabled:opacity-40" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page} 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "h-7 w-7 p-0 rounded-sm text-xs font-semibold cursor-pointer transition-colors border",
                      currentPage === page 
                        ? "bg-[#fa541c] text-white border-[#fa541c] hover:bg-[#e84a15]" 
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-sm cursor-pointer border-neutral-200 text-neutral-600 disabled:opacity-40"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages || filteredResources.length === 0}
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
                className="text-[13px] border border-neutral-200 rounded-sm px-2.5 py-1 focus:outline-none focus:border-[#fa541c] text-neutral-600 bg-white cursor-pointer"
              >
                <option value={5}>5 条/页</option>
                <option value={10}>10 条/页</option>
                <option value={20}>20 条/页</option>
              </select>
          </div>
        </div>
      </div>

      {/* Audit Evaluation Drawer Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-[620px] h-screen flex flex-col shadow-2xl border-l border-neutral-border animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-neutral-border flex justify-between items-center bg-neutral-50/50 shrink-0">
              <h3 className="text-sm font-bold text-neutral-title flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#fa541c]" />
                <span className="text-[15px]">审核</span>
              </h3>
              <button 
                onClick={() => setReviewingItem(null)} 
                className="text-neutral-caption hover:text-neutral-title transition-colors p-1 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Basic Details Box */}
              <div className="space-y-3 bg-[#fff2e8]/10 p-5 rounded-xl border border-[#ffbb96]/30">
                <h4 className="text-[15px] font-bold text-neutral-title leading-snug">{reviewingItem.name}</h4>
                <div className="h-[1px] bg-neutral-border/60"></div>
                <p className="text-[12px] text-neutral-body flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>提请教师:</strong> {reviewingItem.creator}</span>
                  <span><strong>提交时间:</strong> {reviewingItem.submitTime}</span>
                </p>
              </div>

              {/* Resource Core details / 说明 */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-caption uppercase tracking-wider block">说明</span>
                <div className="p-5 border border-neutral-border rounded-xl bg-white space-y-4 shadow-3xs">
                  <p className="text-xs text-neutral-body leading-relaxed font-medium bg-neutral-50 p-3 rounded-lg border border-neutral-100">{reviewingItem.details.content}</p>
                  
                  <div className="border-t border-neutral-200/50"></div>
                  
                  <span className="text-[10px] font-bold text-neutral-caption block uppercase tracking-wider">大纲结构/核心章节/评分细则:</span>
                  <div className="space-y-2 pt-1">
                    {reviewingItem.details.outline.map((line, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-neutral-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa541c] mt-1.5 shrink-0" />
                        <span className="leading-relaxed font-medium">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rejection input area */}
              {showRejectForm && (
                <div className="space-y-2 pt-2 animate-slide-up">
                  <label className="text-[11px] font-bold text-rose-600 block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>驳回审核具体意见 (必填)</span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="请输入对该教学资源调整修改的细则说明，协助教师进行补充重构..."
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    className="w-full border border-neutral-border rounded-lg p-3 text-xs focus:outline-none focus:border-[#fa541c] focus:ring-1 focus:ring-[#fa541c] bg-white text-neutral-title resize-none font-medium leading-normal shadow-3xs"
                  />
                </div>
              )}

            </div>

            {/* Drawer Footer actions */}
            <div className="px-6 py-4 border-t border-neutral-border bg-neutral-50/50 flex justify-end gap-3 shrink-0">
              {showRejectForm ? (
                <>
                  <button onClick={() => setShowRejectForm(false)} className="px-4 py-2.5 border border-neutral-border text-neutral-body rounded-lg text-xs font-bold hover:bg-neutral-100 cursor-pointer transition-colors">返回</button>
                  <button onClick={() => handleReject(reviewingItem.id)} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">确认驳回</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowRejectForm(true)} className="px-4 py-2.5 border border-neutral-border text-neutral-body rounded-lg text-xs font-bold hover:bg-neutral-100 cursor-pointer transition-colors">驳回并通知</button>
                  <button onClick={() => handleApprove(reviewingItem.id)} className="px-5 py-2.5 bg-[#fa541c] hover:bg-[#e84a15] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">
                    审核通过
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
