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
    this.onLeftClick = this.onLeftClick.bind(this);
    this.onPageClick = this.onPageClick.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.setPages(this.props);
  }

  /**
   * Runs when the Pagination component has mounted
   * @returns {undefined}
   */
  componentDidMount() {
    this.setUpPagination();
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
    this.setUpPagination();
  }

  /**
   * Click event handler for loading page to the left of current page.
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onLeftClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.props.metadata;
    this.props.loadList(
      pageSize,
      (currentPage - 2) * pageSize);
  }

  /**
   * Click event handler for loading a selected page
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPageClick(event) {
    event.preventDefault();
    const { pageSize } = this.props.metadata;
    this.props.loadList(
      pageSize,
      (event.target.name - 1) * pageSize);
  }

  /**
   * Click event handler for loading page to the right of current page.
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onRightClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.props.metadata;
    this.props.loadList(
      pageSize,
      currentPage * pageSize);
  }

  /**
   * Sets the pages for pagination
   * @returns {undefined}
   */
  setPages({ metadata }) {
    this.pages = Array.from(Array(metadata.pages).keys());
    if (metadata.pages > 5) {
      if (metadata.currentPage <= 3) {
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
  setUpPagination() {
    const { currentPage, pages } = this.props.metadata;
    $('#page-left').removeClass('disabled');
    $('#page-right').removeClass('disabled');
    if (currentPage === 1) {
      $('#page-left').addClass('disabled');
    }
    if (currentPage === pages) {
      $('#page-right').addClass('disabled');
    }
    $('.pagination > li').removeClass('active');
    $(`.pagination > [name='${currentPage}']`).addClass('active');
  }

  /**
   * Renders the Pagination component
   * @returns {String} JSX markup for the Pagination component
   */
  render() {
    return (this.props.metadata.total > 0) && (
      <ul className="pagination">
        <li id="page-left" onClick={this.onLeftClick} role="button">
          <a className="no-padding">
            <i className="material-icons">chevron_left</i>
          </a>
        </li>
        {this.pages.map(page =>
          <li key={page + 1} name={page + 1} onClick={this.onPageClick} role="button">
            <a name={page + 1} onClick={this.onPageClick} role="button">{page + 1}</a>
          </li>)}
        <li id="page-right" onClick={this.onRightClick} role="button">
          <a className="no-padding">
            <i className="material-icons">chevron_right</i>
          </a>
        </li>
      </ul>
    );
  }
}

Pagination.propTypes = {
  metadata: PropTypes.shape({
    total: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }).isRequired,
  loadList: PropTypes.func.isRequired
};

export default Pagination;
