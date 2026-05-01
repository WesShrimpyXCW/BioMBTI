const questions = [
  // 1. Abstract / Concrete
  {
    question: "我对抽象概念的理解能力很强。",
    axis: "Abstract",
    direction: 1,
    weight: 1
  },
  {
    question: "阅读有大量专有名词和字母简写的内容不会让我感到过分的乏味。",
    axis: "Abstract",
    direction: 1,
    weight: 1
  },
  {
    question: '相比"蛋白激酶利用SH2/SH3结构域介导信号转导网络"，我更喜欢"动物依靠文化传承的行为传统来维持特定种群的觅食策略"这样的研究内容。',
    axis: "Abstract",
    direction: -1,
    weight: 1
  },
  {
    question: "在高中时期，相比起数学/物理，化学/生物是我绝对的优势科目。",
    axis: "Abstract",
    direction: -1,
    weight: 1
  },

  // 2. Theory / Application
  {
    question: "在我看来，基础理论研究比应用更加重要和高级。",
    axis: "Theory",
    direction: 1,
    weight: 1
  },
  {
    question: "即使没有明确应用前景，我也愿意深入研究一个科学问题。",
    axis: "Theory",
    direction: 1,
    weight: 1
  },
  {
    question: "我之所以想要做生物研究，是因为我想要找到一个治疗疾病/改善世界/增强国家实力的方法。",
    axis: "Theory",
    direction: -1,
    weight: 1
  },
  {
    question: "相比起那些两百年之后才能被人们理解的超前研究，一个在近几年就能产生广泛影响的研究才是更好的。",
    axis: "Theory",
    direction: -1,
    weight: 1
  },

  // 3. Structure / Exploration
  {
    question: "我总是喜欢把我的日程安排得井井有条。",
    axis: "Structure",
    direction: 1,
    weight: 1
  },
  {
    question: "我喜欢遵照一份无比详细的实验操作流程来进行实验。",
    axis: "Structure",
    direction: 1,
    weight: 1
  },
  {
    question: "我喜欢探索不同的实验方法，甚至于开发新的实验方法。",
    axis: "Structure",
    direction: -1,
    weight: 1
  },
  {
    question: "相比起一周六天，每天六小时的工作，我更喜欢连续熬三天的大夜，然后放四天假。",
    axis: "Structure",
    direction: -1,
    weight: 1
  },

  // 4. Independent / Collaborative
  {
    question: "我更喜欢独立完成任务，而不是依赖团队合作。",
    axis: "Independent",
    direction: 1,
    weight: 1
  },
  {
    question: "科学家应该专注于科研，而不是社交和处理人际关系。",
    axis: "Independent",
    direction: 1,
    weight: 1
  },
  {
    question: "我相信我能够在职场中主动地/被迫地成为一个E人。",
    axis: "Independent",
    direction: -1,
    weight: 1
  },
  {
    question: "我是一个情商很高的人，而不是一个理工科直男/直女。",
    axis: "Independent",
    direction: -1,
    weight: 1
  },

  // 5. Delayed / Immediate
  {
    question: "我愿意为最终的成功付出长期的、耐心的等待。",
    axis: "Delayed",
    direction: 1,
    weight: 1
  },
  {
    question: "即使有一段时间没有任何人夸奖我/赞许我/支持我，我仍然能够对一项长期目标（如高考）充满热情。",
    axis: "Delayed",
    direction: 1,
    weight: 1
  },
  {
    question: "长时间无法取得进展的科研是无法忍受的。",
    axis: "Delayed",
    direction: -1,
    weight: 1
  },
  {
    question: "相比起事业有成的晚年，我更在意风华正茂的青春。",
    axis: "Delayed",
    direction: -1,
    weight: 1
  },

  // 6. Prestige / Income
  {
    question: "我更看重研究的学术价值，而不是收入水平。",
    axis: "Prestige",
    direction: 1,
    weight: 1
  },
  {
    question: "如果可能，我想做那个把伟大科研成果献给全世界的朴实科学家，而不是那个和垄断公司合作的富豪科学家。",
    axis: "Prestige",
    direction: 1,
    weight: 1
  },
  {
    question: "我接受做生物研究的前提是我的收入能够满足我的大部分物质需求。",
    axis: "Prestige",
    direction: -1,
    weight: 1
  },
  {
    question: "如果一个我不太喜欢的研究方向可以赚大钱，我会愿意选择这个方向。",
    axis: "Prestige",
    direction: -1,
    weight: 1
  },

  // 7. Precision / Tolerance
  {
    question: "我在做实验或任务时非常在意每一个细节是否准确。",
    axis: "Precision",
    direction: 1,
    weight: 1
  },
  {
    question: "我希望我的研究成果足够的精确、严密和严谨。",
    axis: "Precision",
    direction: 1,
    weight: 1
  },
  {
    question: '我可以接受"差不多正确"的实验结果。',
    axis: "Precision",
    direction: -1,
    weight: 1
  },
  {
    question: "我不时因为粗心而犯下一些小小的错误。",
    axis: "Precision",
    direction: -1,
    weight: 1
  },

  // 8. Stability / Risk
  {
    question: "我对科研工作的主要要求是一份只需要安安静静做科研，然后就能领工资的工作。",
    axis: "Stability",
    direction: 1,
    weight: 1
  },
  {
    question: "我希望我可以一辈子都只研究一个方向。",
    axis: "Stability",
    direction: 1,
    weight: 1
  },
  {
    question: "对于那些不确定是否正确的新兴方向，我很愿意去尝试。",
    axis: "Stability",
    direction: -1,
    weight: 1
  },
  {
    question: "我觉得我很有探险家精神。",
    axis: "Stability",
    direction: -1,
    weight: 1
  },

  // 9. Dry / Wet
  {
    question: "现在是计算机时代了，亲手做实验是一件老得掉牙的事情。",
    axis: "Dry",
    direction: 1,
    weight: 1
  },
  {
    question: "我无法忍受做实验时的无趣和忙碌。",
    axis: "Dry",
    direction: 1,
    weight: 1
  },
  {
    question: "我喜欢烘焙/烹饪/做手工/缝纫/打毛线/栽种花草，这些爱好能给我带来成就感。",
    axis: "Dry",
    direction: -1,
    weight: 1
  },
  {
    question: "我对于代码/数学公式不太感兴趣。",
    axis: "Dry",
    direction: -1,
    weight: 1
  }
];

// 选项配置
const optionConfig = [
  { label: "非常不同意", value: 1 },
  { label: "不同意", value: 2.5 },
  { label: "有点不同意", value: 4 },
  { label: "中立", value: 5.5 },
  { label: "有点同意", value: 7 },
  { label: "同意", value: 8.5 },
  { label: "非常同意", value: 10 }
];
