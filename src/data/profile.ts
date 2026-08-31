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
  supervisor: "Prof. Jianqi Sun",
  supervisorZh: "孙建奇教授",
  email: "zhi-bai-shou-hei@sjtu.edu.cn",
  alternativeEmail: "906866373@qq.com",
  avatar: "/assets/avatar/qi-zhang.webp",
  avatarAlt: "Formal portrait of Qi Zhang",
  avatarAltZh: "张琦的正式个人肖像",
} as const;

export const biography = {
  shortEn:
    "I am a PhD student in the School of Biomedical Engineering at Shanghai Jiao Tong University, supervised by Prof. Jianqi Sun. My research develops medical image analysis methods for cervical spine imaging, medical anomaly detection, multimodal learning, and clinically reliable AI. I work at the intersection of engineering and clinical questions, with an emphasis on interpretable measurements, robust evaluation, and tools that can support reproducible imaging workflows.",
  shortZh:
    "我是上海交通大学生物医学工程学院博士研究生，导师为孙建奇教授。我的研究聚焦医学图像分析，主要涉及颈椎影像、医学异常检测、多模态学习与临床可靠人工智能。我关注工程方法与临床问题之间的衔接，尤其重视可解释测量、稳健验证，以及能够支持可复现医学影像流程的方法与工具。",
  longEn: `Qi Zhang is a PhD student in the School of Biomedical Engineering at Shanghai Jiao Tong University, supervised by Prof. Jianqi Sun. He entered the direct-entry doctoral programme in 2023 after completing undergraduate study in biomedical engineering at the same school. His research centres on medical image analysis and on the design of computational methods that remain interpretable and useful when applied to clinically complex imaging data.

His current work has two closely connected strands. The first focuses on cervical-spine imaging, including automated analysis of cervical MRI, detection of spinal-cord T2 hyperintensity, and quantitative assessment of vertebral compression fractures from CT. These projects combine anatomical segmentation, anomaly detection, image synthesis, and clinically meaningful measurements. They are developed with collaborators in spine surgery and radiology, so that the technical formulation is informed by the way imaging findings are assessed in practice.

The second strand investigates medical anomaly detection and multimodal learning more broadly. His work explores how translation between MRI sequences, content-style disentanglement, uncertainty estimation, and reconstruction-based learning can help identify abnormalities when exhaustive lesion annotations are unavailable. Related collaborative studies also address multimodal deformable image registration and quantitative MRI analysis.

Across these directions, his main interest is clinically reliable AI: methods that expose interpretable evidence, recognise uncertainty and failure modes, and can be evaluated beyond a single dataset or acquisition setting. His long-term goal is to develop reproducible medical-imaging workflows that connect robust representation learning with measurements and outputs that clinicians can inspect, correct, and use responsibly.`,
  longZh:
    "张琦现为上海交通大学生物医学工程学院博士研究生，导师为孙建奇教授。2019年至2023年，他在同院系完成本科阶段学习，2023年进入本科直博项目。他的研究以医学图像分析为核心，关注如何在复杂临床影像中构建具有可解释性、可复现性与实际使用价值的计算方法。\n\n目前的工作主要沿两条相互关联的主线展开。第一条主线聚焦颈椎影像，包括颈椎MRI自动分析、脊髓T2高信号异常检测，以及基于CT的椎体压缩性骨折定量评估。这些研究结合解剖结构分割、异常检测、图像合成与临床定量指标，并与脊柱外科和放射科团队合作，使技术问题的定义能够贴近实际影像判读与评估流程。\n\n第二条主线面向更广泛的医学异常检测与多模态学习。他探索MRI序列间翻译、内容与风格解耦、不确定性估计和重建学习等方法，研究在缺少大规模病灶标注时如何识别异常。相关合作还涉及多模态医学图像可变形配准与定量MRI分析。\n\n贯穿这些方向的核心关注是临床可靠人工智能：模型不仅要给出结果，还应提供可检查的证据，识别不确定性与失效情形，并在不同数据集和成像条件下接受稳健验证。长期而言，他希望建立连接稳健表征学习与临床可解释测量的医学影像流程，使输出能够被临床人员理解、复核与修正，并在负责任的前提下支持研究和诊疗评价。",
} as const;
