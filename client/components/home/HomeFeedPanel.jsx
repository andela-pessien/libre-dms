import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AccountWidget from './AccountWidget';
import DocumentFeed from '../feeds/DocumentFeed';
import {
  getAllDocuments,
  searchDocuments
} from '../../actions/documentActions';

class HomeFeedPanel extends Component {
  constructor(props) {
    super(props);
    this.documents = this.props.documents;
    this.state = {
      keywords: ''
    };
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.props.getAllDocuments(20, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchResults && this.state.keywords.replace(/\s+/g, '') !== '') {
      this.documents = nextProps.searchResults;
    } else if (nextProps.documents) {
      this.documents = nextProps.documents;
    }
  }

  onChange(e) {
    this.setState({ keywords: e.target.value }, () => {
      if (this.state.keywords.replace(/\s+/g, '') !== '') {
        this.props.searchDocuments(this.state.keywords);
      } else {
        this.props.getAllDocuments(20, 0);
      }
    });
  }

  /**
   * Renders the HomeFeedPanel component.
   * @returns {String} - HTML markup for HomeFeedPanel component
   */
  render() {
    return (
      <div className="col l5">
        <AccountWidget user={this.props.user} />
        <div className="card home-feed large white">
          <div className="card home-search indigo darken-4 z-depth-4">
            <div className="home-search-input">
              <input
                onChange={this.onChange}
                type="search"
                placeholder="Search for a document"
              />
            </div>
          </div>
          <DocumentFeed documents={this.documents} />
          <Link to="/document/new">
            <button className="btn-floating btn-large indigo darken-4 home-new z-depth-4">
              <i className="material-icons">add</i>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStoreToProps = (state) => {
  return {
    documents: state.documentReducer.allDocuments,
    metadata: state.documentReducer.allDocsMetadata,
    error: state.documentReducer.getAllDocsError,
    searchResults: state.documentReducer.docSearchResults,
    searchMetadata: state.documentReducer.docSearchMetadata,
    searchError: state.documentReducer.docSearchError,
    user: state.authReducer.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDocuments: (limit, offset) => dispatch(getAllDocuments(limit, offset)),
    searchDocuments: (query, limit, offset) => dispatch(searchDocuments(query, limit, offset))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(HomeFeedPanel);
