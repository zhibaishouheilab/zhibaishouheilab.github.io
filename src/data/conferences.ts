export const conferences = [
  {
    id: "csrs-ap-2026",
    name_en: "16th CSRS-AP Annual Meeting",
    name_zh: "第16届颈椎研究学会亚太年会（CSRS-AP）",
    dates_en: "11-13 March 2026",
    dates_zh: "2026年3月11-13日",
    location_en: "Shanghai, China",
    location_zh: "中国上海",
    summary_en:
      "The annual Asia-Pacific meeting of the Cervical Spine Research Society brings together clinical and scientific work on cervical-spine disorders.",
    summary_zh:
      "颈椎研究学会亚太年会集中交流颈椎疾病相关的临床实践与科学研究。",
    formats_en: ["Oral presentation"],
    formats_zh: ["口头汇报"],
    presentation_en:
      "Reconstructing Isotropic 3D Cervical MRI from Anisotropic Routine Scans — Boosting Clinical Diagnostic Accuracy",
    presentation_zh:
      "从各向异性常规扫描重建各向同性三维颈椎MRI——提升临床诊断准确性",
    award_en: "Best Oral Presentation Award",
    award_zh: "最佳口头汇报奖",
    image: {
      src: "/assets/conferences/csrs-ap-2026.webp",
      alt_en: "Title slide of the CSRS-AP 2026 oral presentation",
      alt_zh: "CSRS-AP 2026口头汇报标题页",
    },
    official_url: null,
  },
  {
    id: "miccai-2025",
    name_en: "28th International Conference on MICCAI",
    name_zh: "第28届医学图像计算与计算机辅助干预国际会议（MICCAI）",
    dates_en: "23-27 September 2025",
    dates_zh: "2025年9月23-27日",
    location_en: "Daejeon, Republic of Korea",
    location_zh: "韩国大田",
    summary_en:
      "MICCAI is an international conference covering medical image computing, computer-assisted intervention, and related clinical translation.",
    summary_zh:
      "MICCAI 是医学图像计算、计算机辅助干预及相关临床转化领域的国际会议。",
    formats_en: ["Poster"],
    formats_zh: ["海报"],
    presentation_en:
      "MultiTransAD: Cross-Sequence Translation-Driven Anomaly Detection in Multi-Sequence Brain MRI",
    presentation_zh: "MultiTransAD：跨序列翻译驱动的多序列脑MRI异常检测",
    award_en: null,
    award_zh: null,
    image: {
      src: "/assets/conferences/miccai-2025.webp",
      alt_en: "MultiTransAD poster presented at MICCAI 2025",
      alt_zh: "MICCAI 2025展示的MultiTransAD海报",
    },
    official_url: "https://conferences.miccai.org/2025/",
  },
  {
    id: "ismrm-2025",
    name_en: "2025 ISMRM & ISMRT Annual Meeting & Exhibition",
    name_zh: "2025年 ISMRM & ISMRT 年会暨展览",
    dates_en: "10-15 May 2025",
    dates_zh: "2025年5月10-15日",
    location_en: "Honolulu, Hawai‘i, USA",
    location_zh: "美国夏威夷檀香山",
    summary_en:
      "The ISMRM annual meeting is a major international forum for magnetic-resonance research, technology, and clinical applications.",
    summary_zh: "ISMRM年会是磁共振研究、技术与临床应用领域的重要国际学术会议。",
    formats_en: ["Oral presentation", "Traditional poster", "Digital poster"],
    formats_zh: ["口头汇报", "传统海报", "数字海报"],
    presentation_en:
      "Pathology-Guided AI System for Accurate Segmentation and Diagnosis of Cervical Spondylosis (oral and traditional poster); U2AD for spinal-cord T2 hyperintensity detection (digital poster)",
    presentation_zh:
      "病理引导的颈椎病精准分割与诊断系统（口头汇报与传统海报）；用于脊髓T2高信号检测的U2AD（数字海报）",
    award_en: "AMPC Highlight for the traditional-poster abstract (top 1%)",
    award_zh: "传统海报摘要获AMPC Highlight（前1%）",
    image: {
      src: "/assets/conferences/ismrm-2025.webp",
      alt_en: "Traditional poster presented at ISMRM 2025",
      alt_zh: "ISMRM 2025展示的传统海报",
    },
    official_url: "https://www.ismrm.org/25m/",
  },
] as const;
