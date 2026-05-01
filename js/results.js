document.addEventListener('DOMContentLoaded', () => {
  const scores = JSON.parse(localStorage.getItem('biombti_scores') || '{}');
  
  if (!scores || Object.keys(scores).length === 0) {
    window.location.href = 'quiz.html';
    return;
  }

  displayResults(scores);
  
  // 绑定显示所有按钮
  document.getElementById('toggle-all-btn').addEventListener('click', function() {
    const allMatchesSection = document.getElementById('all-matches-section');
    if (allMatchesSection.style.display === 'none') {
      allMatchesSection.style.display = 'block';
      this.textContent = '隐藏所有方向的匹配度';
    } else {
      allMatchesSection.style.display = 'none';
      this.textContent = '显示所有方向的匹配度';
    }
  });
});

function displayResults(scores) {
  // 获取所有匹配并排序
  const allMatches = getAllMatches(scores, results);
  
  // 显示最佳匹配
  const bestMatch = allMatches[0];
  document.getElementById('best-match-name').textContent = bestMatch.name;
  document.getElementById('best-match-percentage').textContent = `匹配度：${bestMatch.matchPercentage}%`;
  document.getElementById('best-match-quote').innerHTML = bestMatch.quote.replace(/\n/g, '<br>');
  document.getElementById('best-match-intro').textContent = bestMatch.intro;
  
  // 显示其他匹配（第2、3名）
  const otherMatches = allMatches.slice(1, 3);
  const otherMatchesContainer = document.getElementById('other-matches');
  
  otherMatchesContainer.innerHTML = otherMatches.map(match => `
    <div class="other-match-item">
      <div class="other-match-header">
        <span class="other-match-name">${match.name}</span>
        <span class="other-match-percentage">${match.matchPercentage}%</span>
      </div>
      <blockquote class="other-match-quote">${match.quote.replace(/\n/g, '<br>')}</blockquote>
    </div>
  `).join('');
  
  // 显示所有匹配（用于展开查看）
  const allMatchesList = document.getElementById('all-matches-list');
  allMatchesList.innerHTML = allMatches.map((match) => `
    <div class="all-match-item">
      <div class="all-match-header">
        <span class="all-match-name">${match.name}</span>
        <span class="all-match-percentage">${match.matchPercentage}%</span>
      </div>
      <blockquote class="all-match-quote">${match.quote.replace(/\n/g, '<br>')}</blockquote>
    </div>
  `).join('');
  
  // 显示维度得分条
  displayAxesBars(scores);
}

function displayAxesBars(scores) {
  const axesData = [
    { key: 'Abstract', left: '抽象', right: '具体' },
    { key: 'Theory', left: '理论', right: '应用' },
    { key: 'Structure', left: '结构', right: '探索' },
    { key: 'Independent', left: '独立', right: '协作' },
    { key: 'Delayed', left: '延迟', right: '即时' },
    { key: 'Prestige', left: '声望', right: '收入' },
    { key: 'Precision', left: '精确', right: '容错' },
    { key: 'Stability', left: '稳定', right: '冒险' },
    { key: 'Dry', left: '干实验', right: '湿实验' }
  ];
  
  const container = document.getElementById('axes-bars');
  container.innerHTML = axesData.map(axis => {
    const score = scores[axis.key];
    // 将1-10分转换为0-100%位置
    const percentage = ((score - 1) / 9) * 100;
    
    // 判断偏向哪一侧或中立
    let tendency = '';
    if (percentage < 45) {
      tendency = axis.left;
    } else if (percentage > 55) {
      tendency = axis.right;
    } else {
      tendency = '中立';
    }
    
    return `
      <div class="axis-bar-container">
        <div class="axis-labels">
          <span class="axis-label-left">${axis.left}</span>
          <span class="axis-label-right">${axis.right}</span>
        </div>
        <div class="axis-bar-track">
          <div class="axis-marker" style="left: ${percentage}%"></div>
        </div>
        <div class="axis-tendency">${tendency}</div>
      </div>
    `;
  }).join('');
}

const results = [
  {
    name: "肿瘤生物学",
    scores: { Abstract: 6, Theory: 8, Structure: 3, Independent: 7, Delayed: 4, Prestige: 4, Precision: 3, Stability: 7, Dry: 8 },
    quote: "Cause the hardest part of this is leaving you.\n—— My Chemical Romance《Cancer》",
    intro: "研究正常细胞恶性转化的分子机制，包括原癌基因激活、抑癌基因失活、细胞周期失控、凋亡抵抗及肿瘤微环境重塑。解析肿瘤异质性、转移播散和耐药机制，为开发靶向治疗策略和精准医疗方案提供理论基础，涵盖从基础研究到临床转化的完整链条。"
  },
  {
    name: "免疫学",
    scores: { Abstract: 5, Theory: 8, Structure: 3, Independent: 8, Delayed: 5, Prestige: 4, Precision: 4, Stability: 7, Dry: 8 },
    quote: "Not a force, but a balance.\n—— Niels Jerne",
    intro: "研究免疫系统识别自我与非我的分子机制，包括抗原呈递、淋巴细胞活化、免疫记忆形成及免疫耐受建立。探讨固有免疫与适应性免疫的协同作用，解析自身免疫病、免疫缺陷及肿瘤免疫逃逸机制，为疫苗设计、免疫治疗及移植免疫提供理论支撑。"
  },
  {
    name: "神经生物学",
    scores: { Abstract: 4, Theory: 5, Structure: 5, Independent: 4, Delayed: 2, Prestige: 3, Precision: 2, Stability: 9, Dry: 9 },
    quote: "Fire together, wire together.\n—— Donald Hebb",
    intro: "研究神经系统的结构功能与发育机制，包括神经元电信号产生与传导、突触传递与可塑性、神经环路组装及神经退行性病变。从分子、细胞到系统层面解析感觉知觉、运动控制、学习记忆及情绪行为的神经基础，探索脑疾病干预策略。"
  },
  {
    name: "衰老研究",
    scores: { Abstract: 4, Theory: 6, Structure: 3, Independent: 4, Delayed: 1, Prestige: 5, Precision: 4, Stability: 10, Dry: 8 },
    quote: "遣徐福发童男女数千人，入海求仙人不死药。\n——《史记·秦始皇本纪》",
    intro: "研究生物体随时间推移功能衰退的生物学机制，包括基因组不稳定性、端粒损耗、表观遗传改变、蛋白稳态丧失及线粒体功能障碍。探索衰老相关信号通路和衰老细胞清除机制，为延长健康寿命和防治老年性疾病提供科学依据。"
  },
  {
    name: "发育生物学",
    scores: { Abstract: 5, Theory: 4, Structure: 5, Independent: 4, Delayed: 2, Prestige: 2, Precision: 2, Stability: 8, Dry: 9 },
    quote: "人类的前额叶要到25岁才发育完全，因此在25岁前人类在生物学意义上属于脑残。",
    intro: "研究受精卵经细胞分裂、分化与形态发生形成完整个体的过程。解析胚胎诱导、细胞命运决定、体轴建立及器官发生的分子调控网络，探讨干细胞分化、组织再生及先天性畸形的发育机制，为再生医学提供理论基础。"
  },
  {
    name: "干细胞与再生医学",
    scores: { Abstract: 5, Theory: 8, Structure: 3, Independent: 7, Delayed: 3, Prestige: 6, Precision: 3, Stability: 8, Dry: 9 },
    quote: "From cells to cures.",
    intro: "研究干细胞自我更新与多向分化的调控机制，探索利用干细胞修复损伤组织、重建器官功能的治疗策略。涵盖胚胎干细胞、成体干细胞及诱导多能干细胞的基础研究，以及细胞替代治疗、组织工程和类器官技术的临床转化应用。"
  },
  {
    name: "感染与病原生物学",
    scores: { Abstract: 6, Theory: 8, Structure: 4, Independent: 8, Delayed: 5, Prestige: 4, Precision: 4, Stability: 7, Dry: 9 },
    quote: "瘟疫对贵族与农民一视同仁地降下打击。\n——《十日谈》",
    intro: "研究病毒、细菌、真菌及寄生虫等病原体的致病机制，包括入侵宿主、免疫逃逸、毒素作用及耐药机制。解析宿主先天性与适应性免疫应答，探讨病原体与宿主共进化的分子基础，为传染病防控和抗感染治疗提供理论指导。"
  },
  {
    name: "代谢与代谢疾病",
    scores: { Abstract: 5, Theory: 7, Structure: 5, Independent: 6, Delayed: 4, Prestige: 6, Precision: 4, Stability: 6, Dry: 8 },
    quote: "You are what you eat.",
    intro: "研究生物体能量代谢与物质合成的调控网络，包括糖代谢、脂代谢、氨基酸代谢及线粒体功能。解析代谢综合征、糖尿病、肥胖及非酒精性脂肪肝等代谢性疾病的病理机制，探索代谢重编程在肿瘤和免疫中的调控作用。"
  },
  {
    name: "分子生物学",
    scores: { Abstract: 3, Theory: 4, Structure: 6, Independent: 3, Delayed: 3, Prestige: 3, Precision: 2, Stability: 7, Dry: 8 },
    quote: "We've discovered the secret of life.\n—— Francis Crick",
    intro: "研究遗传信息在DNA、RNA与蛋白质间的传递规律，包括DNA复制修复、转录调控、RNA加工、翻译机制及表观遗传修饰。解析基因表达调控网络和非编码RNA功能，为理解遗传信息流动、基因功能及疾病分子机制提供基础。"
  },
  {
    name: "细胞生物学",
    scores: { Abstract: 4, Theory: 4, Structure: 6, Independent: 3, Delayed: 3, Prestige: 2, Precision: 2, Stability: 7, Dry: 8 },
    quote: "这些小孔，或小室，看起来很像蜂巢。\n—— Robert Hooke",
    intro: "研究细胞作为生命基本单位的结构功能与生命活动规律，包括细胞膜系统、细胞器功能、细胞骨架动态、物质运输及细胞信号转导。探讨细胞增殖、分化、衰老与死亡的调控机制，以及细胞间相互作用和组织稳态维持。"
  },
  {
    name: "生物化学",
    scores: { Abstract: 2, Theory: 3, Structure: 4, Independent: 3, Delayed: 4, Prestige: 2, Precision: 1, Stability: 6, Dry: 7 },
    quote: "Life is chemistry.",
    intro: "研究生物体内化学反应的本质与规律，包括酶催化机制、代谢途径调控、生物能量转换及分子相互作用。从化学角度解析生命活动的基本过程，为理解代谢疾病、开发酶制剂及设计代谢工程策略提供理论基础。"
  },
  {
    name: "结构生物学",
    scores: { Abstract: 1, Theory: 2, Structure: 6, Independent: 2, Delayed: 1, Prestige: 1, Precision: 1, Stability: 8, Dry: 6 },
    quote: "我现在每天能睡六个小时，比以前多多了。\n——施一公",
    intro: "利用X射线晶体学、冷冻电镜及核磁共振等技术测定生物大分子三维结构，阐明蛋白质、核酸及其复合物的精细构象。解析结构与功能的对应关系、分子识别机制及构象变化规律，为理性药物设计和蛋白质工程提供结构基础。"
  },
  {
    name: "生物物理学",
    scores: { Abstract: 1, Theory: 2, Structure: 7, Independent: 3, Delayed: 2, Prestige: 2, Precision: 1, Stability: 9, Dry: 4 },
    quote: "只有一门真正的科学，那就是物理学；其他都是社会工作。\n—— James Watson",
    intro: "应用物理学原理和方法研究生物系统，包括生物分子力学特性、膜生物物理、神经生物物理及生物光子学。利用单分子技术和物理建模解析蛋白质折叠、分子马达机制及细胞力学行为，为理解生命过程的物理本质提供视角。"
  },
  {
    name: "组学科学",
    scores: { Abstract: 3, Theory: 7, Structure: 6, Independent: 8, Delayed: 6, Prestige: 5, Precision: 2, Stability: 7, Dry: 4 },
    quote: "我们现在有能力阅读生命之书。\n—— Francis Collins",
    intro: "通过高通量技术系统测定生物分子组成与变化，包括基因组学、转录组学、蛋白质组学、代谢组学及表观基因组学。整合多组学数据构建生物系统全景图，从整体层面理解基因型与表型的关联及生命系统的复杂性。"
  },
  {
    name: "系统生物学",
    scores: { Abstract: 2, Theory: 4, Structure: 8, Independent: 6, Delayed: 3, Prestige: 3, Precision: 3, Stability: 8, Dry: 2 },
    quote: "生物学的未来是预测性的、预防性的、个性化的、参与式的。\n—— Leroy Hood",
    intro: "采用数学建模、计算机模拟和定量实验研究生物系统，整合多层次数据构建分子相互作用网络。研究系统行为的涌现特性，预测扰动响应，为理解复杂疾病机制和优化治疗策略提供系统层面的理论框架。"
  },
  {
    name: "计算药物发现",
    scores: { Abstract: 2, Theory: 9, Structure: 6, Independent: 7, Delayed: 7, Prestige: 8, Precision: 3, Stability: 6, Dry: 1 },
    quote: "神农尝百草之滋味，一日而遇七十毒。\n——《淮南子》",
    intro: "利用分子对接、虚拟筛选、分子动力学模拟及机器学习等方法预测药物靶点相互作用，优化先导化合物结构。通过计算方法减少实验筛选成本，加速药物研发进程，为创新药物设计提供理论指导和工具支撑。"
  },
  {
    name: "演化生物学/群体遗传学",
    scores: { Abstract: 5, Theory: 3, Structure: 8, Independent: 4, Delayed: 4, Prestige: 1, Precision: 3, Stability: 7, Dry: 2 },
    quote: "生存下来的物种，不是最强的，也不是最聪明的，而是对变化最敏感的。",
    intro: "研究生物演化规律与遗传变异在群体中的分布变化，包括自然选择、遗传漂变、基因流及性选择的作用机制。解析适应性演化的分子基础，重建物种演化历史，为理解生物多样性起源和保护遗传学提供理论依据。"
  },
  {
    name: "合成生物学",
    scores: { Abstract: 4, Theory: 9, Structure: 8, Independent: 7, Delayed: 5, Prestige: 7, Precision: 5, Stability: 8, Dry: 7 },
    quote: "耶稣将水变成了酒。\n——《约翰福音 2:9》",
    intro: "设计和构建标准化生物元件、装置及系统，实现对生物体的重新编程。通过工程化方法改造代谢通路、构建人工基因回路及创造新型生物功能，为生物制造、环境修复及生物能源开发提供技术平台。"
  },
  {
    name: "发酵工程",
    scores: { Abstract: 6, Theory: 9, Structure: 3, Independent: 8, Delayed: 8, Prestige: 8, Precision: 5, Stability: 3, Dry: 9 },
    quote: "啊，今夜我们千杯不醉，那么就让我们，为爱情再干一杯。\n——《茶花女》",
    intro: "利用微生物代谢能力规模化生产食品、药物、酶制剂及生物基化学品。优化培养条件、改造菌株代谢通路及设计生物反应器，提高产物得率和生产效率，是工业生物技术的核心应用领域。"
  },
  {
    name: "生物制药",
    scores: { Abstract: 5, Theory: 10, Structure: 4, Independent: 4, Delayed: 6, Prestige: 8, Precision: 3, Stability: 4, Dry: 8 },
    quote: "该药物将在晚期临床成功后向FDA申请上市批准。",
    intro: "利用基因工程、细胞工程及发酵工程技术开发蛋白质药物、抗体药物、疫苗及核酸药物。涵盖从靶点发现、分子设计、生产工艺到质量控制的全流程，为重大疾病治疗提供创新药物解决方案。"
  },
  {
    name: "基因工程",
    scores: { Abstract: 4, Theory: 8, Structure: 5, Independent: 6, Delayed: 5, Prestige: 6, Precision: 4, Stability: 7, Dry: 8 },
    quote: "于是神照着自己的形象造人。\n——《创世纪 1:27》",
    intro: "通过重组DNA技术、基因编辑及基因转移等方法定向改造生物基因组。实现基因插入、敲除、替换及表达调控，用于基因功能研究、遗传改良及基因治疗，是现代生物技术的核心工具。"
  },
  {
    name: "蛋白工程",
    scores: { Abstract: 3, Theory: 8, Structure: 5, Independent: 5, Delayed: 4, Prestige: 6, Precision: 3, Stability: 7, Dry: 7 },
    quote: "上帝不过如此，我来优化一下。",
    intro: "通过定点突变、定向进化及结构域拼接等方法改造蛋白质氨基酸序列。优化蛋白质稳定性、催化活性、底物特异性及结合亲和力，开发工业用酶和治疗性蛋白质，满足特定应用需求。"
  },
  {
    name: "医疗器械",
    scores: { Abstract: 7, Theory: 10, Structure: 4, Independent: 9, Delayed: 8, Prestige: 9, Precision: 4, Stability: 3, Dry: 3 },
    quote: "从核磁共振，到柔情猫娘。",
    intro: "研发用于疾病诊断、治疗及监测的医学仪器设备，包括医学影像设备、体外诊断仪器、植入式器械及康复辅助器具。融合工程技术、材料科学与临床医学，为精准医疗提供硬件支撑。"
  },
  {
    name: "神经工程 / 技术",
    scores: { Abstract: 5, Theory: 9, Structure: 8, Independent: 7, Delayed: 3, Prestige: 8, Precision: 5, Stability: 10, Dry: 4 },
    quote: "感谢Neuralink让我可以继续玩《文明VI》了，而且我可以一连玩8个小时！\n——Arbaugh",
    intro: "研发神经接口、神经调控及神经替代技术，建立神经系统与外部设备的连接。包括脑机接口、深部脑刺激及神经假体，为神经功能障碍患者提供诊断、治疗及功能替代解决方案。"
  },
  {
    name: "医学影像",
    scores: { Abstract: 6, Theory: 9, Structure: 6, Independent: 7, Delayed: 7, Prestige: 8, Precision: 3, Stability: 4, Dry: 2 },
    quote: "阴影从不解释自己。",
    intro: "利用物理技术获取人体内部结构和功能信息，包括X射线、CT、MRI、超声及核医学成像。开发图像重建算法和计算机辅助诊断系统，为疾病早期发现和精准诊断提供可视化手段。"
  },
  {
    name: "生物传感器/生物芯片",
    scores: { Abstract: 5, Theory: 9, Structure: 7, Independent: 7, Delayed: 6, Prestige: 7, Precision: 4, Stability: 7, Dry: 5 },
    quote: "Lab on a chip.",
    intro: "研发将生物识别事件转化为可检测信号的微型器件，包括电化学传感器、光学传感器及微流控芯片。实现对DNA、蛋白质、细胞及小分子的高灵敏、快速检测，应用于医学诊断和环境监测。"
  },
  {
    name: "药物递送/纳米医学",
    scores: { Abstract: 4, Theory: 9, Structure: 6, Independent: 3, Delayed: 4, Prestige: 7, Precision: 3, Stability: 7, Dry: 7 },
    quote: "东风快递，使命必达。",
    intro: "设计药物载体系统和纳米药物制剂，实现药物的靶向输送、控制释放及跨屏障递送。利用纳米材料改善药物溶解性、延长体内循环时间并提高靶组织富集，增强疗效并降低毒副作用。"
  },
  {
    name: "行为/系统神经科学",
    scores: { Abstract: 9, Theory: 6, Structure: 7, Independent: 5, Delayed: 3, Prestige: 4, Precision: 6, Stability: 7, Dry: 8 },
    quote: "我思故我在。",
    intro: "从神经网络和系统层面研究行为的神经机制，整合电生理、成像及光遗传技术研究神经环路功能。解析感觉信息处理、运动控制、决策行为及社会行为的神经基础，探讨神经精神疾病的发病机制。"
  },
  {
    name: "动物行为学",
    scores: { Abstract: 10, Theory: 5, Structure: 9, Independent: 2, Delayed: 4, Prestige: 3, Precision: 8, Stability: 7, Dry: 7 },
    quote: "只有理解，才会关心；只有关心，才会帮助。\n——Jane Goodall",
    intro: "研究动物在自然和实验条件下的行为模式及其生态适应意义，包括觅食行为、繁殖策略、社会结构及通讯行为。结合进化论和生态学原理，探讨行为的遗传基础、学习机制及环境适应价值。"
  },
  {
    name: "植物科学",
    scores: { Abstract: 8, Theory: 5, Structure: 2, Independent: 2, Delayed: 3, Prestige: 2, Precision: 6, Stability: 4, Dry: 8 },
    quote: "一沙一世界，一花一天堂。\n——William Blake",
    intro: "研究植物的生长发育、代谢调控及环境适应机制，包括光合作用、营养吸收、激素信号及抗逆响应。解析植物形态建成和生理过程的分子基础，为作物改良和农业可持续发展提供理论指导。"
  },
  {
    name: "微生物生态/宏基因组",
    scores: { Abstract: 8, Theory: 7, Structure: 4, Independent: 6, Delayed: 3, Prestige: 6, Precision: 7, Stability: 6, Dry: 5 },
    quote: "《通过靶向肠道菌群调控人体的物质需求欲望有望提高廉政文化建设效率》",
    intro: "研究复杂微生物群落结构与功能，通过宏基因组分析揭示其在环境或宿主中的作用。探讨微生物间及微生物与环境的相互作用，为理解生态系统功能和开发微生物应用技术提供基础。"
  },
  {
    name: "生态学",
    scores: { Abstract: 10, Theory: 4, Structure: 8, Independent: 3, Delayed: 2, Prestige: 1, Precision: 8, Stability: 8, Dry: 5 },
    quote: "经费没有，热情管够。",
    intro: "研究生物与环境相互作用的规律，包括种群动态、群落结构、生态系统功能及生物多样性维持机制。探讨能量流动、物质循环及信息传递在生态系统中的组织方式，为生物多样性保护和生态恢复提供科学依据。"
  },
  {
    name: "海洋生物学",
    scores: { Abstract: 9, Theory: 5, Structure: 9, Independent: 2, Delayed: 3, Prestige: 1, Precision: 8, Stability: 8, Dry: 6 },
    quote: "再见了妈妈，今晚我就要远航。\n——《再见了妈妈》",
    intro: "研究海洋环境中的生物多样性、生命过程及生态系统特征，涵盖从浮游生物到海洋哺乳动物的各个类群。探讨海洋生物对极端环境的适应机制、资源分布规律及海洋生态系统的结构与功能。"
  },
  {
    name: "保护生物学",
    scores: { Abstract: 9, Theory: 7, Structure: 9, Independent: 8, Delayed: 3, Prestige: 1, Precision: 8, Stability: 7, Dry: 5 },
    quote: "People protect what they love.\n—— Jacques Cousteau",
    intro: "研究生物多样性丧失的机制与保护策略，评估物种濒危状况和生态系统退化程度。制定保护区规划、濒危物种人工繁育及栖息地恢复方案，为生物多样性保护和可持续利用提供科学指导。"
  },
  {
    name: "生物师范",
    scores: { Abstract: 8, Theory: 7, Structure: 1, Independent: 9, Delayed: 7, Prestige: 5, Precision: 7, Stability: 2, Dry: 5 },
    quote: "如果一个专业最好的出路是教别人，并且让别人选这个专业，那这不是传销吗？",
    intro: "培养具备扎实生物学专业知识和教育学理论的教学人才，研究生物学课程设计、教学方法及科学素养培养。将前沿科学知识转化为教学内容，提升中学生对生命科学的理解和兴趣。"
  },
  {
    name: "科普媒体",
    scores: { Abstract: 9, Theory: 8, Structure: 8, Independent: 10, Delayed: 8, Prestige: 5, Precision: 8, Stability: 6, Dry: 2 },
    quote: "我们在小学二年级就学过，在亿万斯年间……",
    intro: "从事科学内容的创作、编辑与传播工作，将复杂的生物学知识转化为公众可理解的科普作品。通过文字、影像及新媒体平台传播科学思想，提升公众科学素养和科学思辨能力。"
  },
  {
    name: "医学编辑",
    scores: { Abstract: 5, Theory: 7, Structure: 3, Independent: 7, Delayed: 7, Prestige: 5, Precision: 4, Stability: 2, Dry: 1 },
    quote: "我 要 编 辑 你 ！",
    intro: "负责医学学术期刊和出版物的编辑出版工作，包括稿件评审、学术规范审核、语言润色及出版流程管理。连接科研人员与学术出版体系，确保科研成果的准确传播和学术质量。"
  },
  {
    name: "科研管理",
    scores: { Abstract: 5, Theory: 8, Structure: 2, Independent: 10, Delayed: 8, Prestige: 5, Precision: 6, Stability: 1, Dry: 1 },
    quote: "伟大的科研背后，往往站着一个会报销的人。",
    intro: "从事科研项目的规划、组织、协调与管理工作，包括经费预算、进度控制、团队建设及成果转化。优化科研资源配置，保障科研项目顺利实施，促进科研成果产出和应用。"
  },
  {
    name: "考公考编",
    scores: { Abstract: 5, Theory: 6, Structure: 1, Independent: 7, Delayed: 4, Prestige: 4, Precision: 5, Stability: 1, Dry: 3 },
    quote: "稳定的生活才是成年人的浪漫。",
    intro: "通过公务员考试或事业单位招聘进入公共部门，从事科技政策制定、公共卫生管理、教育行政或环境保护等工作。以制度化的方式参与社会治理和公共服务，保障工作的稳定性和社会价值。"
  },
  {
    name: "转专业",
    scores: { Abstract: 5, Theory: 10, Structure: 5, Independent: 5, Delayed: 8, Prestige: 10, Precision: 7, Stability: 4, Dry: 5 },
    quote: "21世纪可能是新能源的世纪，也可能是人工智能的世纪，但总之绝对不是生物的世纪。",
    intro: "将生物学训练获得的科学思维和实验技能迁移至其他学科领域，如医学、法学、计算机科学、金融或工程。利用跨学科背景在新兴交叉领域寻求发展机会，拓展职业选择范围。"
  },
  {
    name: "咨询 / 销售 / 投资",
    scores: { Abstract: 4, Theory: 10, Structure: 8, Independent: 10, Delayed: 9, Prestige: 10, Precision: 8, Stability: 7, Dry: 1 },
    quote: "第一条：永远不要亏钱。第二条：永远不要忘记第一条。\n—— Warren Buffett",
    intro: "为生命科学企业提供市场分析、技术评估、战略规划或投融资服务。基于对生物学和市场的双重理解，促进技术商业化，连接科研创新与市场需求，推动产业发展。"
  },
  {
    name: "创业",
    scores: { Abstract: 6, Theory: 10, Structure: 10, Independent: 10, Delayed: 5, Prestige: 10, Precision: 9, Stability: 10, Dry: 3 },
    quote: "融资就是把故事讲到别人愿意掏钱为止。",
    intro: "识别生物技术领域的商业机会，创建新企业整合技术、人才和资本资源。承担市场风险，将科研成果转化为产品或服务，通过创新商业模式实现技术价值和市场增长。"
  },
  {
    name: "医学遗传学",
    scores: { Abstract: 6, Theory: 8, Structure: 4, Independent: 8, Delayed: 4, Prestige: 4, Precision: 2, Stability: 5, Dry: 5 },
    quote: "我们的命运，在我们的基因之中。\n—— James Watson",
    intro: "研究人类遗传病的分子机制、遗传规律及临床表现，开展基因检测、遗传咨询和产前诊断。解析基因型与表型的关系，为遗传病的预防、诊断和治疗提供理论依据和技术手段。"
  },
  {
    name: "农业遗传学",
    scores: { Abstract: 7, Theory: 9, Structure: 2, Independent: 6, Delayed: 3, Prestige: 5, Precision: 4, Stability: 3, Dry: 8 },
    quote: "我这辈子最大的错误，就是让你们吃得太饱了。",
    intro: "研究作物和畜禽的遗传改良原理与方法，利用杂交育种、分子标记辅助选择及基因编辑技术改良农艺性状。提高产量、品质和抗逆性，保障粮食安全和农业可持续发展。"
  },
  {
    name: "AI for Biology",
    scores: { Abstract: 2, Theory: 8, Structure: 8, Independent: 7, Delayed: 6, Prestige: 8, Precision: 4, Stability: 7, Dry: 1 },
    quote: "Still doesn't work.",
    intro: "开发人工智能算法和计算工具分析生物大数据，包括序列分析、结构预测、图像识别及知识挖掘。加速生物信息处理，辅助科学发现，为生命科学研究提供新的方法论支撑。"
  },
  {
    name: "生物 / 医学统计学",
    scores: { Abstract: 2, Theory: 7, Structure: 6, Independent: 9, Delayed: 7, Prestige: 6, Precision: 1, Stability: 3, Dry: 1 },
    quote: "统计学是科学的语法。\n—— Karl Pearson",
    intro: "发展统计理论和方法用于生物医学研究设计、数据分析和结果推断。包括临床试验设计、生存分析、多组学数据整合及因果推断，为循证医学和精准医疗提供定量工具。"
  },
  {
    name: "类器官",
    scores: { Abstract: 6, Theory: 8, Structure: 4, Independent: 7, Delayed: 2, Prestige: 4, Precision: 2, Stability: 8, Dry: 10 },
    quote: "取莲花七朵，藕为骨，荷叶为衣，莲花为身。\n——《封神演义》",
    intro: "在体外利用干细胞培养具有三维结构和部分生理功能的微型器官，模拟器官发育和疾病过程。用于发育机制研究、疾病建模、药物筛选及个性化医疗，弥补动物模型的局限性。"
  },
  {
    name: "古生物学",
    scores: { Abstract: 8, Theory: 1, Structure: 8, Independent: 6, Delayed: 1, Prestige: 3, Precision: 7, Stability: 6, Dry: 5 },
    quote: "一块骨头，三篇论文，五种解释。",
    intro: "依据化石记录研究地质历史时期生物的形态、分类、分布及演化，重建已灭绝生物的生活方式和古生态环境。探讨重大演化事件和生物多样性的历史动态，为理解生命演化提供时间维度的证据。"
  },
  {
    name: "计算生物学",
    scores: { Abstract: 2, Theory: 7, Structure: 7, Independent: 7, Delayed: 4, Prestige: 6, Precision: 3, Stability: 5, Dry: 1 },
    quote: "人生苦短，我用R。",
    intro: "开发算法、数学模型和计算工具研究生物系统，处理和分析高通量生物数据。通过计算模拟预测生物系统行为，整合多源数据推断分子机制，为实验研究提供理论指导和假设验证。"
  }
];
