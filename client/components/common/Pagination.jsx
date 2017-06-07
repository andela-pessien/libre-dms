import React, { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.setPages = this.setPages.bind(this);
    this.setUpPagination = this.setUpPagination.bind(this);
    this.setPages(this.props);
  }

  componentDidMount() {
    this.setUpPagination(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPages(nextProps);
  }

  componentDidUpdate() {
    this.setUpPagination(this.props);
  }

  setPages({ metadata }) {
    this.pages = Array.from(Array(metadata.pages).keys())
      .slice(metadata.currentPage - 1, metadata.currentPage + 3);
  }

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

  render() {
    return (
      <ul className="pagination">
        <li id="page-left" onClick={this.props.onLeftClick}>
          <a>
            <i className="material-icons">chevron_left</i>
          </a>
        </li>
        {this.pages.map(page =>
          <li key={page + 1} name={page + 1} onClick={this.props.onPageClick}>
            <a name={page + 1} onClick={this.props.onPageClick}>{page + 1}</a>
          </li>)}
        <li id="page-right" onClick={this.props.onRightClick}>
          <a>
            <i className="material-icons">chevron_right</i>
          </a>
        </li>
      </ul>
    );
  }
}

export default Pagination;
