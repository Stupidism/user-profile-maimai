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

  const ME = 0;
  const nodes = _.fill(Array(100), 0).map((v, index) => ({
    id: index,
    count: 0,
  }));

  const edges = [];

  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (target.id <= source.id) return;

      if (source.id === ME || Math.random() > 0.99) {
        edges.push({
          source: source.id,
          target: target.id,
        });

        source.count += 1;
        target.count += 1;
      }
    });
  });

  nodes.forEach((node) => {
    node.image = 'https://unsplash.it/100/100';
    if (node.id === ME) {
      node.name = '我';
      node.category = '我';
    } else {
      node.name = `关注${node.id}`;
      node.category = '关注对象';
    }
  });

  return { nodes, edges, topics };
}