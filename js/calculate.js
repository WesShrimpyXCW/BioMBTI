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
  // 维度权重：某些维度对特定专业更重要
  const axisWeights = {
    "Abstract": 1.0,
    "Theory": 1.0,
    "Structure": 1.0,
    "Independent": 1.0,
    "Delayed": 1.0,
    "Prestige": 1.0,
    "Precision": 1.0,
    "Stability": 1.0,
    "Dry": 1.0
  };
  
  let sumWeightedDiff = 0;
  let uniquenessBonus = 0;
  let extremeMatchCount = 0;
  
  for (const axis in userScores) {
    const userScore = userScores[axis];
    const resultScore = resultScores[axis];
    const diff = userScore - resultScore;
    
    // 加权欧氏距离
    sumWeightedDiff += axisWeights[axis] * diff * diff;
    
    // 独特性奖励：如果用户在某个维度得分极端（<=2或>=9）
    // 且该专业在该维度也有极端分数（<=3或>=8）
    const userExtreme = userScore <= 2 || userScore >= 9;
    const resultExtreme = resultScore <= 3 || resultScore >= 8;
    
    if (userExtreme && resultExtreme) {
      // 检查是否同向极端（都低或都高）
      const userHigh = userScore >= 9;
      const resultHigh = resultScore >= 8;
      const userLow = userScore <= 2;
      const resultLow = resultScore <= 3;
      
      if ((userHigh && resultHigh) || (userLow && resultLow)) {
        extremeMatchCount++;
      }
    }
  }
  
  // 独特性奖励：每个匹配的极端维度降低距离
  // 这样可以提高独特专业的匹配度
  uniquenessBonus = extremeMatchCount * 1.5;
  
  // 惩罚过于"中间"的专业（所有维度都在4-6之间）
  let isMiddleResult = true;
  for (const axis in resultScores) {
    if (resultScores[axis] < 4 || resultScores[axis] > 6) {
      isMiddleResult = false;
      break;
    }
  }
  
  let middlePenalty = 0;
  if (isMiddleResult) {
    // 如果用户有极端分数，惩罚中间专业
    let userHasExtreme = false;
    for (const axis in userScores) {
      if (userScores[axis] <= 3 || userScores[axis] >= 8) {
        userHasExtreme = true;
        break;
      }
    }
    if (userHasExtreme) {
      middlePenalty = 2.0;  // 增加距离，降低匹配度
    }
  }
  
  return Math.sqrt(sumWeightedDiff) - uniquenessBonus + middlePenalty;
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
