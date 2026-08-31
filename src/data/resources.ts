export const resourceGroups = [
  {
    id: "code",
    title_en: "Code repositories",
    title_zh: "代码仓库",
    description_en:
      "Public implementations linked from the corresponding publication records.",
    description_zh: "与论文记录对应的公开实现。",
    items: [
      ["JointSR", "https://github.com/zhibaishouheilab/JointSR"],
      ["UniTransAD", "https://github.com/zhibaishouheilab/UniTransAD"],
      ["U2AD", "https://github.com/zhibaishouheilab/U2AD"],
      ["CervAI-X", "https://github.com/zhibaishouheilab/CervAI-X"],
      [
        "HealthiVert-GAN",
        "https://github.com/zhibaishouheilab/HealthiVert-GAN",
      ],
      ["MultiTransAD", "https://github.com/zhibaishouheilab/MT-AD"],
      ["ARDMR", "https://github.com/ybby2020/ARDMR_MIA"],
      ["RDMR", "https://github.com/ybby2020/RDMR"],
    ],
  },
  {
    id: "models",
    title_en: "Pretrained models",
    title_zh: "预训练模型",
    description_en:
      "Model weights that are already available from the public project repositories.",
    description_zh: "已在公开项目中提供的模型权重。",
    items: [
      [
        "UniTransAD checkpoint",
        "https://github.com/zhibaishouheilab/UniTransAD/tree/main/weight/UniTransAD_Run",
      ],
      ["CervAI-X models", "https://huggingface.co/ZhangqiSJTU/CervAI-X"],
    ],
  },
  {
    id: "data",
    title_en: "Data access and evaluation",
    title_zh: "数据访问与评估",
    description_en:
      "Public datasets, examples, preprocessing, inference, and quantitative evaluation resources.",
    description_zh: "公开数据、示例、预处理、推理与定量评估资源。",
    items: [
      [
        "Brain-OmniA dataset",
        "https://huggingface.co/datasets/ZhangqiSJTU/Brain-OmniA",
      ],
      [
        "CervAI-X examples and diagnosis tools",
        "https://github.com/zhibaishouheilab/CervAI-X",
      ],
      [
        "HealthiVert-GAN grading tools",
        "https://github.com/zhibaishouheilab/HealthiVert-GAN",
      ],
      [
        "U2AD training and inference",
        "https://github.com/zhibaishouheilab/U2AD",
      ],
    ],
  },
  {
    id: "citation",
    title_en: "Citation resources",
    title_zh: "引用资源",
    description_en:
      "BibTeX records are generated directly from the structured publication data used on this site.",
    description_zh: "BibTeX由本站结构化论文数据直接生成。",
    items: [
      ["Complete BibTeX file", "/qi-zhang-publications.bib"],
      ["Publication record", "/publications/"],
    ],
  },
] as const;
