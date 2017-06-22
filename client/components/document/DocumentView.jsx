import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentEditor from './DocumentEditor';
import Preloader from '../common/Preloader';
import { getDocument } from '../../actions/documentActions';

/**
 * Component that displays a single document.
 * It wraps a DocumentEditor.
 * @author Princess-Jewel Essien
 */
class DocumentView extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
  }

  /**
   * Runs when the DocumentView component is about to mount.
   * Dispatches an action to get the document that corresponds to the passed ID
   * prop.
   * @returns {undefined}
   */
  componentWillMount() {
    if (this.state.id !== 'new') {
      this.props.getDocument(this.state.id);
    }
  }

  /**
   * Runs when the DocumentView's props have changed.
   * Redirects to the specified target if document has been deleted.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { id, documents } = nextProps;
    if (
    (id !== 'new' && id === this.state.id && !documents[id]) ||
    (id === 'new' && documents.new && documents.new.id && !documents[documents.new.id])) {
      this.props.close();
    }
    if (id && id !== this.state.id && id !== 'new') {
      this.props.getDocument(nextProps.id);
    }
    this.setState({ id });
  }

  /**
   * Renders the DocumentView component.
   * @returns {String} The HTML markup for the DocumentView component.
   */
  render() {
    return (
      <div className="view-wrapper">
        {(this.state.id === 'new') && <DocumentEditor isMobile={this.props.isMobile} />}
        {(this.state.id !== 'new' && this.props.container.document) &&
          <DocumentEditor id={this.state.id} isMobile={this.props.isMobile} />}
        {(this.state.id !== 'new' &&
        !this.props.container.document &&
        !this.props.container.error) &&
          <Preloader classNames="middle" />}
        {(this.state.id !== 'new' &&
        !this.props.container.document &&
        this.props.container.error) &&
          <h5 className="middle">{this.props.container.error.message}</h5>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  documents: state.documentReducer,
  container: state.documentReducer[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  getDocument: id => dispatch(getDocument(id))
});

DocumentView.propTypes = {
  id: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  container: PropTypes.shape({
    document: PropTypes.object,
    error: PropTypes.shape({
      message: PropTypes.string
    })
  }),
  documents: PropTypes.object.isRequired,
  getDocument: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

DocumentView.defaultProps = {
  container: {},
  isMobile: false
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
