import React, { Component } from 'react';
import _ from 'lodash';
import { NavBar } from 'antd-mobile';

import logo from './logo-maimai.png';
import './App.css';
import RelationGraph from './RelationGraph';

const ME = 0;
const nodes = _.fill(Array(100), 0).map((v, index) => ({
  id: index,
  draggable: true,
  targetCount: 0,
  sourceCount: 0,
}));

const categories = [{ name: '我' }, { name: '关注对象' }];

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

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar
          iconName={null}
          mode="light"
          leftContent={<img src={logo} className="App-logo" alt="logo" />}
        >
          我的人脉有多强?
        </NavBar>
        <RelationGraph nodes={nodes} edges={edges} categories={categories} />
        <p className="App-intro">
          脉脉用户画像-DoraHacks-xxxx团队倾情奉献
        </p>
      </div>
    );
  }
}

export default App;
