import React from 'react';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';

const categories = [{ name: '我' }, { name: '好友' }, { name: '分组' }];

const RelationGraph = ({ getOption, setEdgeFor, setSizeFor, edgeFor, sizeFor }) => (
  <div style={{ padding: 10 }}>
    <ReactEcharts
      option={getOption()}
      style={{ height: '800px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
  </div>
);

const ME = 0;
const getOption = ({ users, relationships, groups, edgeFor, sizeFor }) => () => {
  console.log('1', relationships);

  const edges = [];
  relationships.forEach((relationship) => {
    if (!relationship.groups) {
      edges.push({
        ...relationship,
        value: 100,
      });
      return;
    }
    const sharedGroups = relationship.groups.length ? relationship.groups : groups.slice(0, 1);
    sharedGroups.forEach(sharedGroup => {
      edges.push({
        source: relationship.source,
        target: sharedGroup.id,
        value: relationship.source === ME ? 10 : 10,
      });
      edges.push({
        source: sharedGroup.id,
        target: relationship.target,
        value: relationship.target === ME ? 10 : 10,
      });
    });
  });

  return {
    title: {
      text: '人脉关系图',
      left: 'center',
    },
    legend: [{
      top: 'bottom',
      left: 'right',
      data: categories.map(function (a) {
        return a.name;
      })
    }],
    tooltip: {},
    series: {
      type: 'graph',
      layout: 'force',
      initLayout: 'circular',
      animation: true,
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      data: users.map(({ size, image, isMe, ...node }) => ({
        ...node,
        symbol: `image://${image}`,
        category: isMe ? '我' : '好友',
        symbolSize: isMe ? 60: 20,
        value: isMe ? 1000 : 50,
      })).concat(groups.map(({ size, image, ...group }) => ({
        ...group,
        symbol: `image://${image}`,
        category: '分组',
        symbolSize: 40,
        value: 500,
      }))),
      edges,
      label: { normal: { show: true, position: 'bottom' } },
      categories,
      roam: true,
      force: {
        repulsion: 1000,
        gravity: 0.01,
      },
    },
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
