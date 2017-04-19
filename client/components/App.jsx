import React, { Component } from 'react';
import logo from '../images/labeledlogo-white.png';
import '../styles/App.scss';

/**
 * Main wrapping component for application.
 * @author Princess-Jewel Essien
 */
class App extends Component {
  /**
   * Renders the App component.
   * @returns {String} - HTML markup for App component
   */
  render() {
    return (
      <div className="center">
        <img src={logo} className="logo-image" alt="logo" />
        <h5>Awaiting development</h5>
        <h6>Princess-Jewel Essien</h6>
      </div>
    );
  }
}

export default App;
