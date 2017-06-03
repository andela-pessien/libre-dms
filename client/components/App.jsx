import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Main wrapping component for application.
 * @author Princess-Jewel Essien
 */
class App extends Component {
  /**
   * Runs when the App component has mounted.
   * @returns {void}
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      `https://source.unsplash.com/${screen.width}x${screen.height}/?nature`,
      true
    );
    xhr.responseType = 'arraybuffer';
    xhr.onload = function setBackgroundPhoto() {
      const arr = new Uint8Array(this.response);
      let raw = '';
      arr.forEach((charCode) => {
        raw += String.fromCharCode(charCode);
      });
      $('.body-background').css({
        'background-image': `url(data:image/jpeg;base64,${btoa(raw)})`,
        'background-size': 'cover',
        'background-position': '50% 50%'
      });
      $('.body-background').animate({ opacity: 0.75 }, 1500);
    };
    xhr.send();
  }

  /**
   * Renders the App component.
   * @returns {String} - HTML markup for App component
   */
  render() {
    return (
      <div>
        <div className="wrapper">
          {this.props.children}
          <div className="body-background" />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
