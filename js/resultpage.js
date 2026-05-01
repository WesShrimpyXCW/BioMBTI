// BioMBTI 结果页逻辑

document.addEventListener('DOMContentLoaded', () => {
    const result = JSON.parse(localStorage.getItem('biombti_result') || '{}');
    
    if (!result.type) {
        window.location.href = 'quiz.html';
        return;
    }

    displayResult(result);
    bindEvents();
});

function displayResult(result) {
    const typeData = resultsDatabase[result.type];
    const bioType = getBioType(result.type);

    // 显示类型
    document.getElementById('bio-type').textContent = bioType.emoji;
    document.getElementById('type-name').textContent = `${result.type} - ${typeData.bioName}`;
    document.getElementById('type-description').textContent = typeData.description;

    // 显示特征
    const traitsList = document.getElementById('traits-list');
    traitsList.innerHTML = typeData.traits.map(trait => 
        `<div class="trait-item">${trait}</div>`
    ).join('');

    // 显示维度分析
    const dimensionsChart = document.getElementById('dimensions-chart');
    const dimensions = [
        { label: '外向/内向', key: 'EI', left: 'E', right: 'I' },
        { label: '实感/直觉', key: 'SN', left: 'S', right: 'N' },
        { label: '思考/情感', key: 'TF', left: 'T', right: 'F' },
        { label: '判断/感知', key: 'JP', left: 'J', right: 'P' }
    ];

    dimensionsChart.innerHTML = dimensions.map(dim => {
        const percentage = result.percentages[dim.key];
        return `
            <div class="dimension-bar">
                <span class="dimension-label">${dim.left}</span>
                <div class="dimension-track">
                    <div class="dimension-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="dimension-label">${dim.right}</span>
                <span>${percentage}%</span>
            </div>
        `;
    }).join('');

    // 显示适配类型
    const recommendedTypes = getRecommendedTypes(result.type);
    const compatibilityList = document.getElementById('compatibility-list');
    compatibilityList.innerHTML = recommendedTypes.map(item => {
        const bio = getBioType(item.type);
        return `<div class="compatibility-item">${bio.emoji} ${item.type} (${item.score}%)</div>`;
    }).join('');
}

function bindEvents() {
    // 分享按钮
    document.getElementById('share-btn').addEventListener('click', shareResult);
    
    // 重新测试按钮
    document.getElementById('retake-btn').addEventListener('click', () => {
        localStorage.removeItem('biombti_result');
        localStorage.removeItem('biombti_answers');
        window.location.href = 'quiz.html';
    });
}

function shareResult() {
    const result = JSON.parse(localStorage.getItem('biombti_result') || '{}');
    const typeData = resultsDatabase[result.type];
    const bioType = getBioType(result.type);

    const shareText = `我的 BioMBTI 类型是 ${result.type} - ${bioType.emoji}${typeData.bioName}！快来测试你的生物性格类型吧！`;

    if (navigator.share) {
        navigator.share({
            title: '我的 BioMBTI 测试结果',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            alert('结果已复制到剪贴板！');
        });
    }
}

// 辅助函数（从 calculate.js 引入）
function getBioType(mbtiType) {
    const bioMapping = {
        'INTJ': { name: '猫头鹰', emoji: '🦉', element: '智慧', habitat: '森林深处' },
        'INTP': { name: '章鱼', emoji: '🐙', element: '探索', habitat: '深海' },
        'ENTJ': { name: '狮子', emoji: '🦁', element: '领导', habitat: '草原' },
        'ENTP': { name: '狐狸', emoji: '🦊', element: '机智', habitat: '丛林' },
        'INFJ': { name: '白鹿', emoji: '🦌', element: '洞察', habitat: '迷雾森林' },
        'INFP': { name: '蝴蝶', emoji: '🦋', element: '梦想', habitat: '花田' },
        'ENFJ': { name: '大象', emoji: '🐘', element: '共情', habitat: '热带草原' },
        'ENFP': { name: '蜂鸟', emoji: '🐦', element: '热情', habitat: '热带雨林' },
        'ISTJ': { name: '蜜蜂', emoji: '🐝', element: '责任', habitat: '蜂巢' },
        'ISFJ': { name: '企鹅', emoji: '🐧', element: '守护', habitat: '南极' },
        'ESTJ': { name: '狼', emoji: '🐺', element: '秩序', habitat: '雪原' },
        'ESFJ': { name: '海豚', emoji: '🐬', element: '和谐', habitat: '海洋' },
        'ISTP': { name: '猫', emoji: '🐱', element: '独立', habitat: '城市' },
        'ISFP': { name: '熊猫', emoji: '🐼', element: '艺术', habitat: '竹林' },
        'ESTP': { name: '猎豹', emoji: '🐆', element: '行动', habitat: '稀树草原' },
        'ESFP': { name: '鹦鹉', emoji: '🦜', element: '表演', habitat: '热带丛林' }
    };

    return bioMapping[mbtiType] || { name: '神秘生物', emoji: '❓', element: '未知', habitat: '未知领域' };
}

function getRecommendedTypes(type) {
    const allTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    const compatibilities = allTypes
        .filter(t => t !== type)
        .map(t => ({
            type: t,
            score: calculateCompatibility(type, t)
        }))
        .sort((a, b) => b.score - a.score);

    return compatibilities.slice(0, 5);
}

function calculateCompatibility(type1, type2) {
    const cognitiveFunctions = {
        'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
        'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
        'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
        'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
        'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
        'INFP': ['Fi', 'Ne', 'Si', 'Te'],
        'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
        'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
        'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
        'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
        'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
        'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
        'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
        'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
        'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
        'ESFP': ['Se', 'Fi', 'Te', 'Ni']
    };

    const func1 = cognitiveFunctions[type1] || [];
    const func2 = cognitiveFunctions[type2] || [];

    let score = 50;

    if (func1[0] === func2[0]) score += 20;
    if (func1[1] === func2[0] || func2[1] === func1[0]) score += 15;
    if (func1[2] === func2[2]) score += 10;
    if (func1[3] === func2[0] || func2[3] === func1[0]) score += 5;

    let letterMatch = 0;
    for (let i = 0; i < 4; i++) {
        if (type1[i] === type2[i]) letterMatch++;
    }
    score += letterMatch * 5;

    return Math.min(100, Math.max(0, score));
}
