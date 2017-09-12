import React, { Component } from 'react';
import { Button } from 'antd';

import logo from './logo-maimai.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>我的人脉有多强?</h2>
        </div>
        <div>
          <Button type="primary">Button</Button>
        </div>
        <p className="App-intro">
          脉脉用户画像-DoraHacks-xxxx团队倾情奉献
        </p>
      </div>
    );
  }
}

export default App;
