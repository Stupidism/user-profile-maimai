import React, { Component } from 'react';
import { NavBar, WhiteSpace, WingBlank, Button } from 'antd-mobile';

import logo from './logo-maimai.png';
import './App.css';
import generateFakeData from './utils/generateData';
import RelationGraph from './components/RelationGraph';
import ScoreRadar from './components/ScoreRadar';
import Login from './components/Login';
import WordCloud from './components/WordCloud';

class App extends Component {
  state = {
    authenticated: false,
    dataFetching: false,
    dataFetched: false,
    data: {
      topics: [],
      nodes: [],
      edges: [],
      groups: [],
      scores: [],
    }
  };

  constructor() {
    super();
    this.onAuthenticated = this.onAuthenticated.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    if (!this.state.dataFetched && !this.state.dataFetching) {
      this.fetchData();
    }
  }

  componentDidUpdate() {
    if (!this.state.dataFetched && !this.state.dataFetching) {
      this.fetchData();
    }
  }

  fetchData() {
    this.setState({ dataFetching: true });
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const data = generateFakeData();
        this.setState({ data, dataFetched: true, dataFetching: false, error: '' });
      } else {
        this.setState({ dataFetched: true, error: '百分之五十加载失败', dataFetching: false });
      }
    }, 1000);
  }

  renderContent() {
    const { data: { topics, nodes, edges, groups, level, scores }, dataFetching, error } = this.state;

    if (dataFetching) {
      return <span>正在加载数据...</span>;
    }

    if (error) {
      return (
        <span>
          数据加载失败<br/>
          原因:{error}
          <Button onClick={this.fetchData}>重新加载</Button>
        </span>
      );
    }

    return (
      <WingBlank>
        <RelationGraph users={nodes} relationships={edges} groups={groups} />
        <WordCloud topics={topics} />
        <ScoreRadar level={level} scores={scores} />
        <p className="App-intro">
          脉脉用户画像-DoraHacks-董先sēng倾情奉献
        </p>
      </WingBlank>
    );
  }

  onAuthenticated() {
    this.setState({ authenticated: true });
  }

  render() {
    const { authenticated } = this.state;

    return (
      <div className="App">
        <NavBar
          iconName={null}
          mode="light"
          leftContent={<img src={logo} className="App-logo" alt="logo" />}
        >
          我的人脉有多强?
        </NavBar>
        <WhiteSpace />
        {!authenticated ? this.renderContent() : <Login onAuthenticated={this.onAuthenticated} />}
      </div>
    );
  }
}

export default App;
