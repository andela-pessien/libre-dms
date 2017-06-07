import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Quill from 'quill';
import { isEqual } from 'underscore';
import EditorMenuBar from './EditorMenuBar';
import {
  createDocument,
  updateDocument,
  deleteDocument
} from '../../actions/documentActions';

const Delta = Quill.import('delta');
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean']
  ]
};
const titlePlaceholder = 'Untitled Document';
const contentPlaceholder = 'Put down your ideas';
const theme = 'snow';

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
    this.setupComponent = this.setupComponent.bind(this);
    this.setupEditor = this.setupEditor.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.id = props.id;
    this.container = props.documents[this.id];
    this.state = {
      attributes: {
        title: this.container ? this.container.document.title : '',
        access: this.container ? this.container.document.access : 'private',
        accesslevel: this.container ?
          this.container.document.accesslevel : 'view'
      },
      status: ''
    };
    this.initialState = Object.assign({}, this.state.attributes);
    if (
    this.container &&
    props.userId !== this.container.document.userId) {
      modules.toolbar = false;
      this.readOnly = true;
    }
    this.contentChanges = new Delta();
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
    if (nextProps.id !== this.id && nextProps.documents[nextProps.id]) {
      return undefined;
    } else if (
    nextProps.documents[this.id] &&
    nextProps.documents[this.id].document &&
    !isEqual(nextProps.documents[this.id], this.container.document)) {
      this.setState({ status: 'All changes saved to cloud' });
    } else if (nextProps.newDocument.id && !this.id) {
      this.id = nextProps.newDocument.id;
      this.container = nextProps.documents[this.id];
      this.setState({ status: 'All changes saved to cloud' });
    }
  }

  /**
   * Runs when the DocumentEditor component will update
   * @returns {undefined}
   */
  componentWillUpdate() {
    if (this.props.id !== this.id && this.props.documents[this.props.id]) {
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
    this.setState({
      attributes: {
        title: this.container ? this.container.document.title : '',
        access: this.container ? this.container.document.access : 'private',
        accesslevel: this.container ?
          this.container.document.accesslevel : 'view'
      },
      status: ''
    }, () => {
      this.initialState = Object.assign({}, this.state.attributes);
    });
    if (
    this.container &&
    props.userId !== this.container.document.userId) {
      modules.toolbar = false;
      this.readOnly = true;
    }
    this.contentChanges = new Delta();
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
      modules,
      placeholder: contentPlaceholder,
      theme,
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
    this.contentEditor.on('text-change', (delta) => {
      this.contentChanges = this.contentChanges.compose(delta);
    });
    this.saveInterval = setInterval(this.saveChanges, 10000);
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
    if (!isEqual(this.state.attributes, this.initialState) ||
    this.contentChanges.length() > 0) {
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
      <div>
        <input
          type="text"
          className="title-editor"
          placeholder={titlePlaceholder}
          value={this.state.attributes.title}
          onChange={this.onTitleChange}
          readOnly={this.readOnly}
        />
        {!this.readOnly && <EditorMenuBar
          status={this.state.status}
          onDeleteClick={this.onDeleteClick}
          updateAttribute={this.updateAttribute}
        />}
        <div className="content-editor" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.authReducer.currentUser,
  newDocument: state.documentReducer.new,
  documents: state.documentReducer
});

const mapDispatchToProps = dispatch => ({
  createDocument: newDocument => dispatch(createDocument(newDocument)),
  updateDocument: (id, patch) => dispatch(updateDocument(id, patch)),
  deleteDocument: id => dispatch(deleteDocument(id))
});

DocumentEditor.propTypes = {
  id: PropTypes.string,
  userId: PropTypes.string.isRequired,
  documents: PropTypes.object,
  newDocument: PropTypes.object,
  createDocument: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired
};

DocumentEditor.defaultProps = {
  id: '',
  documents: {},
  newDocument: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentEditor);
