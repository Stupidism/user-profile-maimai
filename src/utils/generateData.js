import _ from 'lodash';

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function makeName(len) {
  let text = '';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export default function() {
  const topics = _.fill(Array(1000), 0).map((v, index) => {
    const positive = Math.round(Math.random() * 500);
    const negative = Math.round(Math.random() * 300);
    const neutral = Math.round(Math.random() * 200);
    const volume = negative + neutral + positive;

    return {
      id: index,
      label: makeName(Math.round(Math.random() * 10) + 3),
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
    draggable: true,
    targetCount: 0,
    sourceCount: 0,
  }));

  const edges = [];

  function createEdge(source, target) {
    source.targetCount += 1;
    target.sourceCount += 1;
    return {
      source: source.id,
      target: target.id,
    };
  }

  nodes.forEach((source) => {
    nodes.forEach((target) => {
      if (target.id <= source.id) return;

      if (source.id === ME || Math.random() > 0.99) {
        const mutual = Math.random() < 0.5;
        const reverse = Math.random() < 0.5;
        if (mutual) {
          edges.push(createEdge(source, target));
          edges.push(createEdge(target, source));
          edges.push({
            source: source.id,
            target: target.id,
            mutual: true,
          });
        } else if (reverse) {
          edges.push(createEdge(target, source));
        } else {
          edges.push(createEdge(source, target));
        }
      }
    });
  });

  nodes.forEach((node) => {
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