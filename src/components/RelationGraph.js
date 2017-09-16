import React from 'react';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';

const categories = [{ name: '我' }, { name: '好友' }, { name: '分组' }];

const RelationGraph = ({ getOption }) => (
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

const getOption = ({ getBaseOption, getChildOption }) => () => ({
  baseOption: getBaseOption(),
  options: [10, 35, 70, 90, 100].map(getChildOption),
  ...console.log(getChildOption(10)),
});

const getBaseOption = ({ users, relationships, groups }) => () => {

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
      text: '人脉关系',
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
      animationDuration: 5000,
      animationEasingUpdate: 'quinticInOut',
      label: { normal: { show: true, position: 'bottom' } },
      categories,
      roam: true,
      hoverAnimation: true,
      focusNodeAdjacency: true,
      force: {
        repulsion: 1000,
        gravity: 0.01,
      },
    },

    timeline: {
      axisType: 'category',
      playInterval: 5000,
      // controlStyle: {
      //     position: 'left'
      // },
      data: [1,2,3,4,5],
    },
  };
};

const getChildOption = ({ users, relationships, groups }) => (maxId) => {

  const edges = [];
  relationships.forEach((relationship) => {
    if (relationship.source >= maxId || relationship.target >= maxId) return;
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
        target: sharedGroup.id - 100 + maxId,
        value: relationship.source === ME ? 10 : 10,
      });
      edges.push({
        source: sharedGroup.id - 100 + maxId,
        target: relationship.target,
        value: relationship.target === ME ? 10 : 10,
      });
    });
  });

  return {
    title: {
      subtext: `人脉关系图-${maxId}`,
    },
    series: {
      data: users.slice(0, maxId).map(({ size, image, isMe, ...node }) => ({
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
      categories,
    },
  };
};


export default compose(
  withHandlers({ getBaseOption, getChildOption }),
  withHandlers({ getOption }),
)(RelationGraph);
