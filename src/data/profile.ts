export const profile = {
  name: "Qi Zhang",
  chineseName: "张琦",
  position: "PhD Student",
  positionZh: "博士研究生",
  institution: "Shanghai Jiao Tong University",
  institutionZh: "上海交通大学",
  department: "School of Biomedical Engineering",
  departmentZh: "生物医学工程学院",
  location: "Shanghai, China",
  locationZh: "中国上海",
  institutionUrl: "https://en.sjtu.edu.cn/",
  departmentUrl: "https://en.bme.sjtu.edu.cn/",
  email: "zhi-bai-shou-hei@sjtu.edu.cn",
  alternativeEmail: "906866373@qq.com",
  avatar: "/assets/avatar/qi-zhang.webp",
  avatarAlt: "Formal portrait of Qi Zhang",
  avatarAltZh: "张琦的正式个人肖像",
} as const;

export const supervisors = [
  {
    name: "Prof. Jianqi Sun",
    nameZh: "孙建奇教授",
    url: "https://en.bme.sjtu.edu.cn/show-33-143.html",
    urlZh: "https://en.bme.sjtu.edu.cn/show-33-143.html",
  },
  {
    name: "Associate Professor Xia Li",
    nameZh: "李夏副教授",
    url: "https://en.bme.sjtu.edu.cn/show-33-211.html",
    urlZh: "https://bme.sjtu.edu.cn/Web/FacultyDetail/977",
  },
] as const;

export const biography = {
  shortEn:
    "My research focuses on cervical spine and brain MRI, including quantitative analysis, anomaly detection, multimodal learning, and image reconstruction. I work with clinical teams to study the reliability and interpretability of these methods.",
  shortZh:
    "我的研究围绕颈椎与脑 MRI 展开，涉及定量分析、异常检测、多模态学习与图像重建。我与临床团队合作，关注这些方法的可靠性与可解释性。",
  longEn: `I am a PhD student in Biomedical Engineering at Shanghai Jiao Tong University, jointly supervised by Prof. Jianqi Sun and Associate Professor Xia Li. I began the direct-entry doctoral programme in 2023 after completing my undergraduate degree in biomedical engineering at the same school. My work sits at the intersection of medical-image computing and clinically grounded quantitative analysis.

My main research concerns cervical spine imaging. I study pathology-guided segmentation and measurement in cervical MRI, uncertainty-aware detection of spinal-cord T2 hyperintensity, and reconstruction of isotropic three-dimensional cervical MRI from anisotropic routine scans. In CT, I have worked on pseudo-healthy vertebral synthesis and relative height-loss measurement for interpretable assessment of compression fractures. Across these projects, anatomical structure is not merely an input: it also provides a way to inspect model outputs and relate them to quantitative imaging indicators.

I also develop unsupervised anomaly-detection methods for settings in which lesion annotations are scarce or incomplete. This research has progressed from cross-sequence translation to a unified framework designed for varied brain diseases, MRI sequences, and missing-input settings. The methods combine content–style disentanglement, image translation, reconstruction evidence, feature-level comparison, and uncertainty estimation. I am particularly interested in how these components behave under changes in scanners, acquisition protocols, and clinical populations.

Clinical collaboration shapes the questions I choose and the way I evaluate a method. I currently work with teams in spine surgery, orthopaedics, and radiology, including Renji Hospital, Shanghai Sixth People’s Hospital, and Ruijin Hospital. My aim is to develop methods that are evaluated beyond a single development dataset and whose results can be reviewed through anatomy, uncertainty, and measurable imaging evidence.`,
  longZh:
    "我是上海交通大学生物医学工程博士研究生，由孙建奇教授和李夏副教授共同指导。2019年至2023年在上海交通大学生物医学工程学院完成本科阶段学习，2023年进入本科直博项目。我的研究位于医学图像计算与临床定量分析的交叉位置，关注如何从常规医学影像中获得稳定、可复核且具有明确解剖意义的信息。\n\n我的主要研究方向是颈椎影像分析，包括病理引导的颈椎MRI分割与定量测量、脊髓T2高信号的不确定性感知检测，以及由临床各向异性扫描重建各向同性三维颈椎MRI。在CT研究中，我开展了伪健康椎体合成与相对高度丢失测量，用于椎体压缩性骨折的可解释评估。这些工作不仅把解剖结构作为模型输入，也将其作为检查输出、连接影像指标与临床判断的依据。\n\n我同时研究病灶标注稀缺或不完整条件下的无监督异常检测。相关工作从跨MRI序列翻译逐步拓展到面向多种脑部疾病、多种序列及输入缺失场景的统一框架，涉及内容—风格解耦、图像翻译、重建证据、特征层比较与不确定性估计。我尤其关注模型在扫描设备、采集协议和临床人群变化时的表现，以及不同证据能否帮助识别误报与漏报。\n\n临床合作影响着我选择问题和设计评价的方式。目前我与仁济医院脊柱外科、上海市第六人民医院骨科、瑞金医院影像科和仁济医院影像科等团队保持合作。我希望研究方法不仅在单一开发数据集上取得结果，还能通过外部验证、解剖结构、不确定性与可量化影像证据进行审查，为可信的医学影像工作流程提供技术支持。",
} as const;
