import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Pagination component for application
 * @author Princess-Jewel Essien
 */
class Pagination extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.setPages = this.setPages.bind(this);
    this.setUpPagination = this.setUpPagination.bind(this);
    this.setPages(this.props);
  }

  /**
   * Runs when the Pagination component has mounted
   * @returns {undefined}
   */
  componentDidMount() {
    this.setUpPagination(this.props);
  }

  /**
   * Runs when the Pagination component will receive new props
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    this.setPages(nextProps);
  }

  /**
   * Runs when the Pagination component has updated
   * @returns {undefined}
   */
  componentDidUpdate() {
    this.setUpPagination(this.props);
  }

  /**
   * Sets the pages for pagination
   * @returns {undefined}
   */
  setPages({ metadata }) {
    this.pages = Array.from(Array(metadata.pages).keys());
    if (metadata.pages > 5) {
      if (metadata.currentPage < 3) {
        this.pages = this.pages.slice(0, 5);
      } else if (metadata.currentPage > metadata.pages - 3) {
        this.pages = this.pages.slice(metadata.pages - 5);
      } else {
        this.pages = this.pages.slice(metadata.currentPage - 3, metadata.currentPage + 2);
      }
    }
  }

  /**
   * Sets up the active elements for pagination
   * @returns {undefined}
   */
  setUpPagination({ metadata }) {
    $(`.${this.props.className} > .pagination > #page-left`)
      .removeClass('disabled');
    $(`.${this.props.className} > .pagination > #page-right`)
      .removeClass('disabled');
    if (metadata.currentPage === 1) {
      $(`.${this.props.className} > .pagination > #page-left`)
        .addClass('disabled');
    }
    if (metadata.currentPage === metadata.pages) {
      $(`.${this.props.className} > .pagination > #page-right`)
        .addClass('disabled');
    }
    $(`.${this.props.className} > .pagination > li`)
      .removeClass('active');
    $(`.${this.props.className} > .pagination > [name='${metadata.currentPage}']`)
      .addClass('active');
  }

  /**
   * Renders the Pagination component
   * @returns {String} JSX markup for the Pagination component
   */
  render() {
    return (this.props.metadata.total > 0) && (<ul className="pagination">
      <li id="page-left" onClick={this.props.onLeftClick} role="button">
        <a className="no-padding">
          <i className="material-icons">chevron_left</i>
        </a>
      </li>
      {this.pages.map(page =>
        <li key={page + 1} name={page + 1} onClick={this.props.onPageClick} role="button">
          <a name={page + 1} onClick={this.props.onPageClick} role="button">{page + 1}</a>
        </li>)}
      <li id="page-right" onClick={this.props.onRightClick} role="button">
        <a className="no-padding">
          <i className="material-icons">chevron_right</i>
        </a>
      </li>
    </ul>);
  }
}

Pagination.propTypes = {
  className: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    total: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }).isRequired,
  onLeftClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onRightClick: PropTypes.func.isRequired
};

export default Pagination;
