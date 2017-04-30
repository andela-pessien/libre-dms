import React, { Component, PropTypes } from 'react';
import axios from 'axios';

/**
 * Main wrapping component for application.
 * @author Princess-Jewel Essien
 */
class App extends Component {
  /**
   * Runs when the App component is going to be mounted.
   * @returns {void}
   */
  componentWillMount() {
    // window.addEventListener('resize', () => {
    //   $('#body-background-image').attr('height', window.innerHeight);
    // });
    axios.get(`/api/photo?width=${screen.width}&height=${screen.height}`)
    .then((res) => {
      $('.body-background').css({
        'background-image': `url(${res.data.url})`,
        'background-size': 'cover',
        'background-position': '50% 50%'
      });
      $('.body-background').animate({ opacity: 0.75 }, 1500);
    }, (err) => {
      console.log(err.message);
      console.log(err.error);
    });
  }
  /**
   * Renders the App component.
   * @returns {String} - HTML markup for App component
   */
  render() {
    return (
      <div>
        {this.props.children}
        <div className="body-background" />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
