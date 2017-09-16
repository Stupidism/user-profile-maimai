import React from 'react';
import { compose, withHandlers } from 'recompose';

import ReactEcharts from 'echarts-for-react';

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

const getOption = ({ nodes, categories, edges, edgeFor, sizeFor }) => () => {

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
      animation: true,
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      data: nodes.map(({ count, image, ...node }) => ({
        ...node,
        symbol: `image://${image}`,
        symbolSize: Math.round(Math.log(count)) * 10 + 40,
      })),
      edges,
      label: { normal: { show: true, position: 'bottom' } },
      categories,
      roam: true,
      force: {
        repulsion: 900,
      },
    },
  };
};

export default compose(
  withHandlers({ getOption }),
)(RelationGraph);
