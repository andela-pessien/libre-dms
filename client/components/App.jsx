import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import requireAuth from './authentication/requireAuth';
import AuthPage from './authentication/AuthPage';
import Dashboard from './dashboard/Dashboard';

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
      `https://source.unsplash.com/${screen.width}x${screen.height}/?trees`,
      true
    );
    xhr.responseType = 'arraybuffer';
    xhr.onload = function setBackgroundPhoto() {
      const arr = new Uint8Array(this.response);
      let raw = '';
      arr.forEach((charCode) => {
        raw += String.fromCharCode(charCode);
      });
      $('.app-background').css({
        'background-image': `url(data:image/jpeg;base64,${btoa(raw)})`,
        'background-size': 'cover',
        'background-position': '50% 50%',
        'background-attachment': 'fixed'
      });
      $('.app-background').animate({ opacity: 0.75 }, 1500);
    };
    xhr.send();
  }

  /**
   * Renders the App component.
   * @returns {String} - HTML markup for App component
   */
  render() {
    return (
      <div className="app-wrapper">
        <Navbar className="app-navbar" />
        <div className="main-wrapper">
          <Switch>
            <Route
              exact
              path="/"
              component={requireAuth(Dashboard, AuthPage, true)}
            />
          </Switch>
        </div>
        <div className="app-background" />
      </div>
    );
  }
}

export default App;
