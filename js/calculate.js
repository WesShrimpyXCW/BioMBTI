function calculateScores(questions, answers) {
  const axes = {
    Abstract: 0,
    Theory: 0,
    Structure: 0,
    Independent: 0,
    Delayed: 0,
    Prestige: 0,
    Precision: 0,
    Stability: 0,
    Dry: 0
  };

  const counts = { ...axes };

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let score = answers[i];

    // direction: 1 表示正向问题（非常同意=1分）
    // direction: -1 表示反向问题（非常同意=10分）
    if (q.direction === 1) {
      score = 11 - score;  // 正向问题：10分->1分，1分->10分
    }
    // 反向问题保持原分数：非常同意=10分，非常不同意=1分

    score = score * (q.weight || 1);

    axes[q.axis] += score;
    counts[q.axis] += 1;
  }

  // average
  for (let key in axes) {
    axes[key] = axes[key] / (counts[key] || 1);
  }

  return axes;
}

function calculateDistance(userScores, resultScores) {
  let sumSquaredDiff = 0;
  let count = 0;
  
  for (const axis in userScores) {
    const diff = userScores[axis] - resultScores[axis];
    sumSquaredDiff += diff * diff;
    count++;
  }
  
  // 使用欧氏距离，但加大权重让差距更明显
  return Math.sqrt(sumSquaredDiff);
}

function calculateMatchPercentage(distance) {
  // 使用指数函数让差距拉开
  // 最大可能距离约为 27 (9个维度 * 3分最大差)
  const maxDistance = 27;
  
  // 使用指数衰减：距离越小，匹配度越高，且差距更明显
  // 公式：匹配度 = 100 * exp(-distance^2 / (2 * sigma^2))
  // sigma 控制衰减速度，越小差距越大
  const sigma = 8;
  const normalizedDistance = distance / maxDistance;
  const percentage = 100 * Math.exp(-(normalizedDistance * normalizedDistance) / (2 * (sigma/maxDistance) * (sigma/maxDistance)));
  
  return Math.round(percentage);
}

function getTopMatches(userScores, results, count = 3) {
  const matches = results.map(result => {
    const distance = calculateDistance(userScores, result.scores);
    const matchPercentage = calculateMatchPercentage(distance);
    return { 
      ...result, 
      distance, 
      matchPercentage 
    };
  });

  matches.sort((a, b) => a.distance - b.distance);
  return matches.slice(0, count);
}

function getAllMatches(userScores, results) {
  const matches = results.map(result => {
    const distance = calculateDistance(userScores, result.scores);
    const matchPercentage = calculateMatchPercentage(distance);
    return { 
      ...result, 
      distance, 
      matchPercentage 
    };
  });

  matches.sort((a, b) => a.distance - b.distance);
  return matches;
}
