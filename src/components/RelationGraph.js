import React from 'react';
import _ from 'lodash';
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

const getOption = ({ getBaseOption, getChildOption, users }) => () => ({
  baseOption: getBaseOption(),
  options: [10, 35, 70, 90, 100].map(num => num / 100 * users.length).map(getChildOption),
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
        source: relationship.from,
        target: sharedGroup.id,
        value: relationship.from === ME ? 10 : 10,
      });
      edges.push({
        source: sharedGroup.id,
        target: relationship.to,
        value: relationship.to === ME ? 10 : 10,
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

const getChildOption = ({ users, relationships, groups }) => (maxNum) => {
  const curUsers = users.slice(0, maxNum);
  const curUserIds = curUsers.map(u => u.id);
  const usersById = _.keyBy(users, 'id');
  const groupsById = _.keyBy(groups, 'id');

  const edges = [];
  relationships.forEach((relationship) => {
    if (!curUserIds.includes(relationship.from) || !curUserIds.includes(relationship.to)) return;
    const source = usersById[relationship.from].name;
    const target = usersById[relationship.to].name;
    if (!relationship.groups) {
      edges.push({
        source,
        target,
        value: 100,
      });
      return;
    }
    const sharedGroups = relationship.groups.length ? relationship.groups : groups.slice(0, 1);

    sharedGroups.forEach(sharedGroup => {
      if(maxNum < 20) {
        console.log(groupsById, sharedGroup, groupsById[sharedGroup]);
      }
      const groupName = (groupsById[sharedGroup] || {}).name;
      edges.push({
        source,
        target: groupName,
        value: relationship.from === ME ? 10 : 10,
      });
      edges.push({
        source: groupName,
        target,
        value: relationship.to === ME ? 10 : 10,
      });
    });
  });

  return {
    title: {
      subtext: `人脉关系图-${maxNum}`,
    },
    series: {
      data: curUsers.map(({ id, name, size, img, isMe }, index) => ({
        name,
        symbol: `image://${img || `https://unsplash.it/${40 + Math.round(index / 10)}/${40 + index % 10}`}`,
        category: isMe ? '我' : '好友',
        symbolSize: isMe ? 80: 40,
        value: isMe ? 1000 : 50,
      })).concat(groups.map(({ id, size, img, name }, index) => ({
        name,
        symbol: `image://${img || `https://unsplash.it/${50 + Math.round(index / 10)}/${50 + index % 10}`}`,
        category: '分组',
        symbolSize: 60,
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
