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
    "I am a PhD student in the School of Biomedical Engineering at Shanghai Jiao Tong University, supervised by Prof. Jianqi Sun. My research focuses on cervical spine imaging, medical anomaly detection, image reconstruction, and interpretable quantitative analysis.",
  shortZh:
    "我是上海交通大学生物医学工程学院博士研究生，导师为孙建奇教授。我的研究聚焦颈椎影像、医学异常检测、图像重建和可解释定量分析。",
  longEn: `I am a PhD student in the School of Biomedical Engineering at Shanghai Jiao Tong University, supervised by Prof. Jianqi Sun. I entered the direct-entry doctoral programme in 2023 after completing my undergraduate study in biomedical engineering at the same school.

My research focuses on medical image analysis for the spine. Current projects include cervical MRI segmentation and quantitative measurement, spinal-cord T2 hyperintensity detection, isotropic 3D cervical MRI reconstruction, and CT-based assessment of vertebral compression fractures. I am especially interested in methods whose outputs can be understood through anatomical structures and quantitative imaging indicators.

I also study anomaly detection when lesion annotations are scarce. This work explores reconstruction, translation between MRI sequences, uncertainty estimation, and multimodal learning. I work closely with teams in spine surgery, orthopaedics, and radiology to connect technical questions with clinical imaging practice.`,
  longZh:
    "我是上海交通大学生物医学工程学院博士研究生，导师为孙建奇教授。2019年至2023年在同院系完成本科阶段学习，2023年进入本科直博项目。\n\n我的研究主要围绕脊柱医学图像分析展开。目前的工作包括颈椎MRI分割与定量测量、脊髓T2高信号检测、各向同性三维颈椎MRI重建，以及基于CT的椎体压缩性骨折评估。我尤其关注能够通过解剖结构和定量影像指标解释结果的方法。\n\n我也研究病灶标注有限条件下的异常检测，涉及图像重建、MRI序列间翻译、不确定性估计与多模态学习。研究过程中，我与脊柱外科、骨科和影像科团队保持合作，将技术问题与临床影像实践结合起来。",
} as const;
