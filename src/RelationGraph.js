import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';
import { SegmentedControl } from 'antd-mobile';

const unilateralFollow = '关注';
const mutualFollow = '互相关注';
const followCount = '关注数量';
const fansCount = '粉丝数量';
const edgeMeanings = [unilateralFollow, mutualFollow];
const nodeSizeMeanings = [followCount, fansCount];

const RelationGraph = ({ getOption, setEdgeFor, setSizeFor, edgeFor, sizeFor }) => (
  <div style={{ padding: 10 }}>
    <ReactEcharts
      option={getOption()}
      style={{ height: '700px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
    <p className="sub-title">关系线表示:</p>
    <SegmentedControl
      values={edgeMeanings}
      selectedIndex={edgeFor}
      onChange={setEdgeFor}
    />
    <p className="sub-title">球大小表示:</p>
    <SegmentedControl
      values={nodeSizeMeanings}
      selectedIndex={sizeFor}
      onChange={setSizeFor}
    />
  </div>
);

const getOption = ({ nodes, categories, edges, edgeFor, sizeFor }) => () => {
  const wantMutual = edgeMeanings[edgeFor] === mutualFollow;
  const wantFollowCount = nodeSizeMeanings[sizeFor] === followCount;

  return {
    title: {
      text: '人脉关系图',
    },
    legend: [{
      // selectedMode: 'single',
      data: categories.map(function (a) {
        return a.name;
      })
    }],
    tooltip: {},
    series: {
      type: 'graph',
      layout: 'force',
      animation: false,
      data: nodes.map(({ sourceCount, targetCount, ...node }) => ({
        ...node,
        symbolSize: Math.round(Math.log(wantFollowCount ? targetCount : sourceCount)) * 10 + 10,
      })),
      edges: edges.filter(({ mutual }) =>  wantMutual? mutual : !mutual),
      categories,
      roam: true,
      edgeSymbol: [wantMutual ? 'arrow' : 'none', 'arrow'],
      edgeSymbolSize: 5,
      force: {
        repulsion: 200
      }
    },
  };
};

export default compose(
  withStateHandlers({
    edgeFor: 0,
    sizeFor: 0,
  }, {
    setEdgeFor: () => e => ({
      edgeFor: e.nativeEvent.selectedSegmentIndex,
    }),
    setSizeFor: () => e => ({
      sizeFor: e.nativeEvent.selectedSegmentIndex,
    }),
  }),
  withHandlers({ getOption }),
)(RelationGraph);
