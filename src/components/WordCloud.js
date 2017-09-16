import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Import styles
 */
import 'normalize.css';
import './WordCloud.css';

/**
 * Import Elements
 */
import Cloud from './Cloud';

/**
 * Compose individual components
 */
export default class WordCloud extends Component {

  /**
   * Set initial state of component
   * @param  {Object} props Props of component
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedTopic: null,
    };
    this.onSelectTopic = this.onSelectTopic.bind(this);
  }

  /**
   * Click handler
   * @param  {String} topic Whole topic object
   * @return {void}
   */
  onSelectTopic(topic) {
    this.setState({
      selectedTopic: topic,
    });
  }

  /**
   * Compose components
   * @return {ReactElement} [description]
   */
  render() {
    const {
      fontName,
      fontSizes,
      height,
      topics,
      width,
    } = this.props;

    if (topics.length === 0) {
      return (<span>No topics available.</span>);
    }

    return (
      <div>
        <div className='wordcloud__title'>标签云</div>
        <Cloud
          fontName={fontName}
          fontSizes={fontSizes}
          height={height}
          onSelectTopic={this.onSelectTopic}
          selectedTopic={this.state.selectedTopic}
          topics={topics}
          width={width}
          maxWidth='100%'
        />
      </div>
    );
  }
}

WordCloud.propTypes = {
  fontName: PropTypes.string,
  fontSizes: PropTypes.array,
  height: PropTypes.number,
  topics: PropTypes.array,
  width: PropTypes.number,
};

WordCloud.defaultProps = {
  fontName: 'Sans-Serif',
  fontSizes: [13, 16, 20, 26, 35, 49],
  height: 800,
  topics: [],
  width: 1000,
};
