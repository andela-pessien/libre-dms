/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Pagination from '../../../components/common/Pagination';

const checkPagination = (pagination) => {
  const { currentPage, pages } = pagination.props().metadata;
  // Should show all pages if there are less than 5 pages
  if (pages <= 5) {
    for (let i = 1; i <= pages; i += 1) {
      expect(pagination.find('.pagination > li')
        .filterWhere(item => (item.prop('name') === i))
        .length).toBe(1);
    }
  // Should show first five pages if there are more than 5 pages and the current
  // page is one of the first three pages
  } else if (currentPage <= 3) {
    for (let i = 1; i <= 5; i += 1) {
      expect(pagination.find('.pagination > li')
        .filterWhere(item => (item.prop('name') === i))
        .length).toBe(1);
    }
  // Should show last five pages if there are more than 5 pages and the current
  // page is one of the last three pages
  } else if (currentPage > pages - 3) {
    for (let i = pages; i > pages - 5; i -= 1) {
      expect(pagination.find('.pagination > li')
        .filterWhere(item => (item.prop('name') === i))
        .length).toBe(1);
    }
  // Should show two pages before and two pages after the current pages in all
  // other scenarios
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
      expect(pagination.find('.pagination > li')
        .filterWhere(item => (item.prop('name') === i))
        .length).toBe(1);
    }
  }
  // Should disable page left button if current page is the first page
  if (currentPage === 1) {
    expect(pagination.find('#page-left').hasClass('disabled')).toBe(true);
  }
  // Should disable page right button if current page is the last page
  if (currentPage === pages) {
    expect(pagination.find('#page-right').hasClass('disabled')).toBe(true);
  }
  // Should highlight only the current page as active
  expect(pagination.find('.active').length).toBe(1);
  expect(pagination.find('.pagination > li')
    .filterWhere(item => (item.prop('name') === currentPage))
    .hasClass('active'))
    .toBe(true);
};

describe('Pagination component', () => {
  let pagination;
  const div = global.document.createElement('div');
  const props = {
    metadata: {
      total: 40,
      pages: 4,
      currentPage: 1,
      pageSize: 10
    },
    loadList: sinon.spy(() => {})
  };

  beforeEach(() => {
    global.document.body.appendChild(div);
    pagination = mount(<Pagination {...props} />, { attachTo: div });
  });

  afterEach(() => {
    pagination.detach();
    global.document.body.removeChild(div);
  });

  it('renders without crashing', () => {
    expect(pagination.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(pagination.find('ul').hasClass('pagination')).toBe(true);
  });

  it('has the right action buttons', () => {
    expect(pagination.find('#page-left > a > i').text()).toEqual('chevron_left');
    expect(pagination.find('#page-right > a > i').text()).toEqual('chevron_right');
  });

  it('displays pagination state correctly', () => {
    expect(pagination.find('li').length).toEqual(6);
    checkPagination(pagination);
    pagination.setProps({
      metadata: {
        total: 120,
        pages: 12,
        currentPage: 12,
        pageSize: 10
      }
    });
    pagination.instance().forceUpdate();
    expect(pagination.find('li').length).toEqual(7);
    checkPagination(pagination);
    pagination.setProps({
      metadata: {
        total: 200,
        pages: 20,
        currentPage: 2,
        pageSize: 10
      }
    });
    pagination.instance().forceUpdate();
    expect(pagination.find('li').length).toEqual(7);
    checkPagination(pagination);
    pagination.setProps({
      metadata: {
        total: 340,
        pages: 17,
        currentPage: 16,
        pageSize: 20
      }
    });
    pagination.instance().forceUpdate();
    expect(pagination.find('li').length).toEqual(7);
    checkPagination(pagination);
    pagination.setProps({
      metadata: {
        total: 80,
        pages: 8,
        currentPage: 5,
        pageSize: 10
      }
    });
    pagination.instance().forceUpdate();
    expect(pagination.find('li').length).toEqual(7);
    checkPagination(pagination);
  });

  it('does not display pagination if paginated list is empty', () => {
    pagination.setProps({
      metadata: {
        total: 0,
        pages: 0,
        currentPage: 0,
        pageSize: 10
      }
    });
    pagination.instance().forceUpdate();
    expect(pagination.find('div').length).toBe(0);
    expect(pagination.find('ul').length).toBe(0);
    expect(pagination.find('li').length).toBe(0);
  });

  it('calls the onLeftClick handler when left button is clicked', () => {
    pagination.setProps({
      metadata: {
        total: 80,
        pages: 8,
        currentPage: 5,
        pageSize: 10
      }
    });
    pagination.instance().forceUpdate();
    pagination.find('#page-left').simulate('click');
    expect(pagination.props().loadList.callCount).toBe(1);
    expect(pagination.props().loadList.getCall(0).args[0]).toEqual(10);
    expect(pagination.props().loadList.getCall(0).args[1]).toEqual(30);
  });

  it('calls the onPageClick handler when a page button is clicked', () => {
    pagination.find('.pagination > li')
      .filterWhere(item => (item.prop('name') === 3))
      .simulate('click', {
        target: {
          name: 3
        }
      });
    expect(pagination.props().loadList.callCount).toBe(2);
    expect(pagination.props().loadList.getCall(1).args[0]).toEqual(10);
    expect(pagination.props().loadList.getCall(1).args[1]).toEqual(20);
  });

  it('calls the onRightClick handler when right button is clicked', () => {
    pagination.find('#page-right').simulate('click');
    expect(pagination.props().loadList.callCount).toBe(3);
    expect(pagination.props().loadList.getCall(2).args[0]).toEqual(10);
    expect(pagination.props().loadList.getCall(2).args[1]).toEqual(10);
  });
});
