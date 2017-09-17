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
  const nodes = _.fill(Array(100), 0).map((v, index) => ({
    id: index.toString(),
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
    } else {
      node.name = `关注${node.id}`;
    }
  });

  const level = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
  const scores = ['人脉宽度', '人脉高度', '人脉深度', '教育', '工作', '影响力']
    .map(name => ({ name, value: Math.floor(Math.random() * 5) }));

  return { friends: nodes, relationships: edges, groups, topics, level, scores };
}