import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Quill from 'quill';
import { isEqual } from 'underscore';
import EditorMenuBar from './EditorMenuBar';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  clearNewDocumentStore
} from '../../actions/documentActions';

const Delta = Quill.import('delta');
const fullToolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean']
];
const mobileToolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['clean'],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
];
const titlePlaceholder = 'Untitled Document';
const contentPlaceholder = 'Put down your ideas';

/**
 * Component that wraps a Quill instance for document editing.
 * @author Princess-Jewel Essien
 */
class DocumentEditor extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.modules = {};
    this.setupComponent = this.setupComponent.bind(this);
    this.setupEditor = this.setupEditor.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.setupComponent(this.props);
  }

  /**
   * Runs when the DocumentEditor component has mounted.
   * Initializes necessary Materialize jQuery plugins, instantiates the Quill
   * editor, loads available document contents and creates handlers for
   * registering changes and autosaving.
   * @returns {undefined}
   */
  componentDidMount() {
    $('.dropdown-button').dropdown();
    this.setupEditor();
  }

  /**
   * Runs when the DocumentEditor's props have changed.
   * Updates editor status to reflect successful/failed actions.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { id, documents, newDocument } = nextProps;
    if (id !== this.id && documents[id]) {
      /** Do nothing */
    } else if (
    documents[this.id] &&
    documents[this.id].error) {
      this.setState({ status: documents[this.id].error.message });
    } else if (
    documents[this.id] &&
    documents[this.id].document &&
    !isEqual(documents[this.id].document, this.container.document)) {
      this.setState({ status: 'All changes saved to cloud' });
    } else if (newDocument && newDocument.id && !this.id) {
      this.id = newDocument.id;
      this.container = documents[this.id];
      this.props.clearNewDocumentStore();
      this.setState({ status: 'All changes saved to cloud' });
    } else if (newDocument && newDocument.error && !this.id) {
      this.setState({ status: newDocument.error.message });
      this.props.clearNewDocumentStore();
    }
  }

  /**
   * Runs when the DocumentEditor component will update
   * @returns {undefined}
   */
  componentWillUpdate() {
    if (this.props.id && this.props.id !== this.id) {
      this.setupComponent(this.props);
      this.setupEditor();
    }
  }

  /**
   * Runs when the DocumentEditor component is to unmount.
   * Stops the background autosave process.
   * @returns {undefined}
   */
  componentWillUnmount() {
    clearInterval(this.saveInterval);
  }

  /**
   * Event listener/handler for changes to the document's title.
   * @param {Object} e The input change event
   * @returns {undefined}
   */
  onTitleChange(e) {
    this.setState({
      attributes: {
        ...this.state.attributes,
        title: e.target.value
      }
    });
  }

  /**
   * Event listener/handler for clicking on the delete menu option.
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onDeleteClick(e) {
    e.preventDefault();
    if (this.id) {
      this.props.deleteDocument(this.id);
    }
  }

  /**
   * Sets up the DocumentEditor component
   * @param {Object} props The component's props
   * @returns {undefined}
   */
  setupComponent(props) {
    this.id = props.id;
    this.container = props.documents[this.id];
    this.modules.toolbar = this.props.isMobile ? [...mobileToolbar] : [...fullToolbar];
    this.readOnly = false;
    const state = {
      attributes: {
        title: this.container ? this.container.document.title : '',
        access: this.container ? this.container.document.access : 'private',
        accesslevel: this.container ?
          this.container.document.accesslevel : 'view'
      },
      status: ''
    };
    if (this.state) {
      this.setState({ ...state });
    } else {
      this.state = { ...state };
    }
    this.initialState = Object.assign({}, state.attributes);
    if (
    this.container &&
    props.ownId !== this.container.document.userId) {
      this.modules.toolbar = false;
      this.readOnly = true;
    } else {
      this.contentChanges = new Delta();
    }
  }

  /**
   * Sets up the Quill editor
   * @returns {undefined}
   */
  setupEditor() {
    $(`#${this.state.attributes.access}`).addClass('active');
    $(`#${this.state.attributes.accesslevel}`).addClass('active');
    $('.ql-toolbar').remove();
    this.contentEditor = new Quill('.content-editor', {
      modules: this.modules,
      placeholder: contentPlaceholder,
      theme: this.props.isMobile ? 'bubble' : 'snow',
      readOnly: this.readOnly
    });
    if (this.container && this.container.document) {
      if (this.container.document.type === 'quill') {
        this.contentEditor.setContents(
          JSON.parse(this.container.document.content), 'silent');
      } else {
        this.contentEditor.setText(this.container.document.content, 'silent');
      }
    }
    if (!this.readOnly) {
      this.contentEditor.on('text-change', (delta) => {
        this.contentChanges = this.contentChanges.compose(delta);
      });
      this.saveInterval = setInterval(this.saveChanges, 5000);
    }
  }

  /**
   * Method that updates an attribute of the document
   * Called from the menu bar
   * @param {String} attribute The attribute to be changed
   * @param {String} value The attribute's new value
   * @returns {undefined}
   */
  updateAttribute(attribute, value) {
    $(`#${this.state.attributes[attribute]}`).removeClass('active');
    this.setState({ attributes: {
      ...this.state.attributes, [attribute]: value
    } }, () => {
      $(`#${value}`).addClass('active');
    });
  }

  /**
   * Method that autosaves document changes if any.
   * @returns {undefined}
   */
  saveChanges() {
    if (!this.state.attributes.title) {
      const autoTitle = this.contentEditor.getText(0, 25).replace(/\s+/g, ' ');
      if (autoTitle.replace(/\s+/g, '')) {
        this.setState({
          attributes: {
            ...this.state.attributes,
            title: autoTitle
          }
        });
      }
    }
    if ((this.state.attributes.title) && (!isEqual(this.state.attributes, this.initialState) ||
    this.contentChanges.length() > 0)) {
      this.setState({ status: 'Saving changes...' });
      if (!this.id) {
        this.props.createDocument({
          title: this.state.attributes.title,
          content: JSON.stringify(this.contentEditor.getContents()),
          type: 'quill',
          access: this.state.attributes.access,
          accesslevel: this.state.attributes.accesslevel
        });
      } else {
        const patch = {};
        if (this.state.attributes.title !== this.initialState.title) {
          patch.title = this.state.attributes.title;
        }
        if (this.state.attributes.access !== this.initialState.access) {
          patch.access = this.state.attributes.access;
        }
        if (this.state.attributes.accesslevel !==
        this.initialState.accesslevel) {
          patch.accesslevel = this.state.attributes.accesslevel;
        }
        if (this.contentChanges.length() > 0) {
          patch.content = JSON.stringify(this.contentEditor.getContents());
        }
        patch.type = 'quill';
        this.props.updateDocument(this.id, patch);
      }
      this.initialState = Object.assign({}, this.state.attributes);
      this.contentChanges = new Delta();
    }
  }

  /**
   * Renders the DocumentEditor component.
   * @returns {String} - HTML markup for DocumentEditor component
   */
  render() {
    return (
      <div className="document-editor">
        <input
          type="text"
          className="title-editor"
          placeholder={titlePlaceholder}
          value={this.state.attributes.title}
          onChange={this.onTitleChange}
          readOnly={this.readOnly}
        />
        {(this.readOnly)
          ? <EditorMenuBar
            access={this.state.attributes.access}
            status={this.state.status}
            onDeleteClick={this.onDeleteClick}
          />
          : <EditorMenuBar
            access={this.state.attributes.access}
            status={this.state.status}
            full
            onDeleteClick={this.onDeleteClick}
            updateAttribute={this.updateAttribute}
          />}
        <div className="content-editor" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ownId: state.authReducer.currentUser,
  newDocument: state.documentReducer.new,
  documents: state.documentReducer
});

const mapDispatchToProps = dispatch => ({
  createDocument: newDocument => dispatch(createDocument(newDocument)),
  updateDocument: (id, patch) => dispatch(updateDocument(id, patch)),
  deleteDocument: id => dispatch(deleteDocument(id)),
  clearNewDocumentStore: () => dispatch(clearNewDocumentStore())
});

DocumentEditor.propTypes = {
  id: PropTypes.string,
  ownId: PropTypes.string.isRequired,
  documents: PropTypes.object,
  newDocument: PropTypes.object,
  createDocument: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  clearNewDocumentStore: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

DocumentEditor.defaultProps = {
  id: '',
  documents: {},
  newDocument: {},
  isMobile: false
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentEditor);
