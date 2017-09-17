import _ from 'lodash';

export default function() {
  const topics = _.fill(Array(50), 0).map((v, index) => {
    const positive = Math.round(Math.random() * 500);
    const negative = Math.round(Math.random() * 300);
    const neutral = Math.round(Math.random() * 200);
    const volume = negative + neutral + positive;

    return {
      id: index,
      label: `话题${index}`,
      volume,
      sentimentScore: (positive * 3 + neutral - negative) / volume * 100,
      sentiment: {
        negative,
        neutral,
        positive,
      },
    }
  });

  const ME = '0';
  const nodes = ['魏桦毅', '文庭爽', '周约谷', '高伙灼', '周伟迟', '华添蓝', '吴迅修', '于偌淳', '梁基修', '赵淼国',
    '钱睛开', '韩宁燊', '傅秀爽', '康智熊', '张飞敦', '周翀琛', '曾路骞', '邓会帅', '刘祈贤', '曾永志',
    '文段安', '陈羡之', '龙皓克', '曾庚栾', '柳沧启', '陈庚邦', '刘记名', '黄渔丁', '李帜延', '柯冬邦',
    '萧信军', '孙建海', '林韶壮', '岑易科', '尤稠蔚', '韦泰树', '云滨义', '卢菘然', '邹昌祖', '王沛佩',
    '林诞伍', '刘学献', '蔡裁麒', '钱辰锐', '陈惠洪', '巫斯苞', '王敛帜', '沈锦孝', '甘民涪', '田达冠',
    '夏裕远', '孟道中', '薛乐霖', '邓昱史', '倪好', '宜浩', '江充松', '车偌北', '赖锐良', '王伟', '文伟', '林定昌',
    '胡里立', '雷清健', '谭轩志', '施立万', '岑起顺', '华骏棋', '黎行利', '冯御发', '戚颖舒', '廖京祥',
    '沈澄元', '林羡之', '扁树', '潘以邦', '易壮之', '霍良曼', '赵义', '解义', '刘民涪', '健树', '柯民涪', '湖树', '欧朴泳', '贺茁根',
    '谢培毅', '康道中', '磊轩志', '鲁繁赞', '葛僚勳', '李熙中', '孟绍功', '傅暮加', '尤志漳', '柳边峰', '王稻夏',
    '王础毅', '陆党冰', '陈荐舟', '华伯赣', '孙晶东', '王裕秩', '卢爽时', '丁瑜木', '欧官浩', '连敦锋',
    '卢凛滕', '刘经笛', '薛震攀', '孔烨迪', '罗亭岳', '梁变丁', '陈贤兢', '童国楠', '周鸿雄', '岑奇伟',
    '廖幅弈', '傅宙西', '宁善航', '廖吟淳', '王潮稚', '许南原', '樊琪政', '岑晾进', '乐珐彦', '龚舒尧',
    '王延麒', '骆兴拓', '廖峙澄', '蔡棠笛', '彭海', '廷封', '康若启', '贺龄博', '王华蓝', '朗亚早', '于辉中', '梁伟', '金伟',
    '雷强邦', '程加飞', '伍鸿幼', '梁拥景', '李鹏曦', '曹敞景', '雷贤起', '周佳元', '时启凌', '贺亚早',
    '汤营容', '林琛家', '甘熹昼', '刘健晨', '张胜骞', '欧福舟', '赵拥奇', '周华蓝', '梁封岩', '易羿早']
    .map((name, index) => ({
      id: index.toString(),
      name,
    }));

  const groups = ['纯好友', '河南科技大', '携程', '河南焦作', '聚尚', '宅米'].map((name, index) => ({
    id: (100 + index).toString(),
    name,
    image: 'https://unsplash.it/80/80',
  }));

  const edges = [];

  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (target.id <= source.id) return;

      if (source.id === ME) {
        const edge = {
          from: source.id,
          to: target.id,
          groups: [],
        };

        let groupNum = 0;
        while(Math.random() > (groupNum ? 0.99 : 0.3) && groupNum < groups.length - 1) {
          groupNum += 1;
        }

        const restGroups = groups.slice(1);
        while(edge.groups.length < groupNum) {
          const idx = Math.floor(Math.random() * restGroups.length);
          edge.groups.push(restGroups.splice(idx, 1)[0].id);
        }

        edges.push(edge);
      } else if (Math.random() > 0.98) {
        edges.push({
          from: source.id,
          to: target.id,
        });
      }

    });
  });

  nodes.forEach((node) => {
    if (node.id === ME) {
      node.name = '我';
      node.isMe = true;
      node.img = 'https://unsplash.it/100/100';
    }
  });

  const level = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
  const scores = ['人脉宽度', '人脉高度', '人脉深度', '教育', '工作', '影响力']
    .map(name => ({ name, value: Math.floor(Math.random() * 3) + 2 }));

  return { friends: nodes, relationships: edges, groups, topics, level, scores };
}