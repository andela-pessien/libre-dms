import React, { Component } from 'react';
import { Desktop, Small, Mobile } from '../../utils/responsive';
import SinglePageView from './SinglePageView';
import MobileView from './MobileView';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOwnFeed: true,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false,
      showDocumentId: '',
      showProfileId: '',
      showSettings: false
    };
    this.changeView = this.changeView.bind(this);
    this.changeFeedView = this.changeFeedView.bind(this);
  }

  changeView(selectedView, value) {
    this.setState({
      showDocumentId: '',
      showProfileId: '',
      showSettings: false
    }, () => {
      if (selectedView && value) {
        this.setState({
          [selectedView]: value
        });
      }
    });
  }

  /**
   * Switches the feed view.
   * @param {String} selectedView The view to change to
   * @returns {undefined}
   */
  changeFeedView(selectedView) {
    this.setState({
      showOwnFeed: false,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false
    }, () => {
      this.setState({ [selectedView]: true });
    });
  }

  render() {
    return (
      <div className="main-wrapper">
        <Desktop>
          <SinglePageView
            {...this.props}
            {...this.state}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Desktop>
        <Small>
          <MobileView
            {...this.props}
            {...this.state}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Small>
        <Mobile>
          <MobileView
            {...this.props}
            {...this.state}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Mobile>
      </div>
    );
  }
}

export default Main;
