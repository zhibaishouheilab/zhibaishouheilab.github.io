import type { RouteName } from "../i18n/routes";

export const researchDetails = [
  {
    projectId: "cervical-spine-ai",
    slug: "cervical-spine-imaging",
    routeName: "researchCervical" as RouteName,
    title_en: "Cervical Spine Imaging",
    title_zh: "颈椎影像分析",
    challenge_en: [
      "Cervical MRI combines multiple small anatomical structures with heterogeneous degenerative changes.",
      "Signal abnormalities may be sparse, while scanner and acquisition differences alter normal appearance.",
      "Routine anisotropic scans limit reformatted views and three-dimensional quantitative assessment.",
    ],
    challenge_zh: [
      "颈椎MRI包含多种细小解剖结构，并伴随异质性的退变表现。",
      "信号异常可能十分稀少，而扫描设备与采集协议差异会改变正常外观。",
      "临床常规各向异性扫描限制了重建视图和三维定量评估。",
    ],
    progression_en: [
      "Pathology-guided segmentation and automated cervical imaging indicators",
      "Uncertainty-aware detection of spinal-cord T2 hyperintensity",
      "Isotropic 3D cervical MRI reconstruction from routine scans",
      "Systematic synthesis of artificial-intelligence tasks and modalities in degenerative cervical myelopathy imaging",
    ],
    progression_zh: [
      "病理引导的解剖分割与颈椎影像指标自动计算",
      "脊髓T2高信号的不确定性感知检测",
      "由临床常规扫描重建各向同性三维颈椎MRI",
      "系统梳理退行性颈脊髓病影像人工智能中的任务与模态",
    ],
    directions_en: [
      "Multimodal cervical imaging and structured quantitative analysis",
      "External validation across acquisition settings",
      "Uncertainty-aware review of automated measurements",
    ],
    directions_zh: [
      "多模态颈椎影像与结构化定量分析",
      "跨采集条件的外部验证",
      "面向自动测量的不确定性感知复核",
    ],
  },
  {
    projectId: "vertebral-fracture-assessment",
    slug: "vertebral-fracture-assessment",
    routeName: "researchVertebral" as RouteName,
    title_en: "Interpretable Vertebral Fracture Assessment",
    title_zh: "可解释椎体骨折评估",
    challenge_en: [
      "A pre-fracture CT reference is normally unavailable for an injured vertebra.",
      "Compression can differ across anterior, middle, and posterior regions of the vertebral body.",
      "A grading result is more useful when it can be traced to measurable shape change.",
    ],
    challenge_zh: [
      "受伤椎体通常缺少骨折前CT作为个体参照。",
      "椎体前部、中部与后部的压缩程度可能不同。",
      "若分级结果能够追溯到可测量的形态变化，其解释性更强。",
    ],
    progression_en: [
      "Coarse-to-fine pseudo-healthy vertebral synthesis",
      "Anatomy-informed restoration using adjacent vertebrae",
      "Relative height-loss mapping and compression-fracture grading",
    ],
    progression_zh: [
      "由粗到细的伪健康椎体合成",
      "利用相邻椎体信息进行解剖约束恢复",
      "相对高度丢失映射与压缩性骨折分级",
    ],
    directions_en: [
      "Robust height-loss measurement across CT acquisition settings",
      "Closer alignment between quantitative maps and clinical review",
      "Evaluation of model failure cases and anatomical plausibility",
    ],
    directions_zh: [
      "跨CT采集条件的稳健高度丢失测量",
      "定量图谱与临床复核的进一步衔接",
      "模型失败案例与解剖合理性评估",
    ],
  },
  {
    projectId: "medical-anomaly-detection",
    slug: "medical-anomaly-detection",
    routeName: "researchAnomaly" as RouteName,
    title_en: "Generalizable Medical Anomaly Detection",
    title_zh: "可泛化医学异常检测",
    challenge_en: [
      "Rare and heterogeneous lesions make exhaustive pixel-level annotation difficult.",
      "Reconstruction can reproduce an anomaly or generate errors in complex normal anatomy.",
      "MRI sequences and available inputs differ across datasets and clinical settings.",
    ],
    challenge_zh: [
      "病灶稀少且异质，难以获得穷尽的像素级标注。",
      "重建模型可能同时复现异常，也可能在复杂正常解剖处产生误差。",
      "不同数据集和临床场景中的MRI序列与可用输入并不一致。",
    ],
    progression_en: [
      "Cross-sequence translation with disentangled representations in MultiTransAD",
      "Dual-uncertainty guidance for spinal-cord T2 hyperintensity detection in U2AD",
      "Unified cyclic translation and dual-level evidence across brain diseases and sequences in UniTransAD",
    ],
    progression_zh: [
      "MultiTransAD中的解耦表征与跨序列翻译",
      "U2AD中用于脊髓T2高信号检测的双重不确定性引导",
      "UniTransAD中面向多种脑部疾病与序列的统一循环翻译和双层证据",
    ],
    directions_en: [
      "Generalization under sequence and acquisition changes",
      "Combining pixel-level and feature-level anomaly evidence",
      "Evaluation protocols for heterogeneous public datasets",
    ],
    directions_zh: [
      "序列与采集条件变化下的泛化能力",
      "像素层与特征层异常证据的结合",
      "面向异质公开数据集的评价协议",
    ],
  },
] as const;
