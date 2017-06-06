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
   * Runs when the DocumentView component is about to mount.
   * Dispatches an action to get the document that corresponds to the passed ID
   * prop.
   * @returns {undefined}
   */
  componentWillMount() {
    if (this.props.id !== 'new') {
      this.props.getDocument(this.props.id);
    }
  }

  /**
   * Runs when the DocumentView's props have changed.
   * Redirects to the specified target if document has been deleted.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      this.props.getDocument(nextProps.id);
    }
  }

  /**
   * Renders the DocumentView component.
   * @returns {String} The HTML markup for the DocumentView component.
   */
  render() {
    return (
      <div className="view-wrapper document-wrapper z-index-3">
        {(this.props.id === 'new')
          ? <DocumentEditor />
          : (this.props.container.document)
            ? <DocumentEditor id={this.props.id} />
            : <Preloader className="middle" />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  container: state.documentReducer[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  getDocument: id => dispatch(getDocument(id))
});

DocumentView.propTypes = {
  id: PropTypes.string.isRequired,
  container: PropTypes.shape({
    document: PropTypes.object,
    error: PropTypes.string
  }),
  getDocument: PropTypes.func.isRequired
};

DocumentView.defaultProps = {
  deleteTarget: '/',
  container: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
