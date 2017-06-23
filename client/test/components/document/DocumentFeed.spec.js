/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import DocumentFeed from '../../../components/document/DocumentFeed';

describe('DocumentFeed component', () => {
  let documentFeed;
  const props = {
    documents: {},
    documentClickAction: sinon.spy(() => {}),
    profileClickAction: sinon.spy(() => {})
  };

  beforeEach(() => {
    documentFeed = mount(<DocumentFeed {...props} />);
  });

  it('renders without crashing', () => {
    expect(documentFeed.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(documentFeed.find('.feed').length).toBe(1);
  });

  it('displays preloader if documents have not yet loaded', () => {
    expect(documentFeed.find('.preloader-wrapper').length).toBe(1);
    expect(documentFeed.find('h5').length).toBe(0);
    expect(documentFeed.find('ul').length).toBe(0);
  });

  it('displays error message if there was an error retrieving documents', () => {
    documentFeed.setProps({
      documents: {
        error: {
          message: 'Connection failed'
        }
      }
    });
    expect(documentFeed.find('.preloader-wrapper').length).toBe(0);
    expect(documentFeed.find('h5').length).toBe(1);
    expect(documentFeed.find('ul').length).toBe(0);
    expect(documentFeed.find('h5').text()).toBe('Connection failed');
  });

  it('informs user if there are no documents to display', () => {
    documentFeed.setProps({
      documents: {
        list: []
      }
    });
    expect(documentFeed.find('.preloader-wrapper').length).toBe(0);
    expect(documentFeed.find('h5').length).toBe(1);
    expect(documentFeed.find('ul').length).toBe(0);
    expect(documentFeed.find('h5').text()).toBe('No documents to display');
  });

  it('displays list of documents if present', () => {
    const creationDate = new Date();
    while ((new Date()) - creationDate <= 1000) { /* Wait */ }
    const updateDate = new Date();
    documentFeed.setProps({
      documents: {
        list: [
          {
            title: 'Test Document',
            id: '7ec48f91-6ddd-475c-b534-adf194fea4bb',
            access: 'private',
            createdAt: creationDate,
            updatedAt: updateDate,
            User: {
              id: '4ad0a7de-99bf-47b1-afa3-aa0b8b9d3f9f',
              name: 'Test User'
            }
          },
          {
            title: 'Another Test Document',
            id: '76e75e53-ef30-401b-9a60-d05be8bd4270',
            access: 'public',
            createdAt: creationDate,
            updatedAt: creationDate
          }
        ]
      }
    });
    expect(documentFeed.find('.preloader-wrapper').length).toBe(0);
    expect(documentFeed.find('h5.middle').length).toBe(0);
    expect(documentFeed.find('ul').length).toBe(1);
    expect(documentFeed.find('li').length).toBe(3);
    expect(documentFeed.find('.divider').length).toBe(1);
    expect(documentFeed.find('li > h5 > a.truncate').length).toBe(2);
    expect(documentFeed.find('li > h5 > a')
      .filterWhere(item => (item.prop('name') === '7ec48f91-6ddd-475c-b534-adf194fea4bb'))
      .text()).toEqual('Test Document');
    expect(documentFeed.find('li > a').length).toBe(1);
    expect(documentFeed.find('li > a').text()).toEqual('Test User');
    expect(documentFeed.find('li > div > p').first().text())
      .toEqual(`Last edited: ${updateDate.toLocaleTimeString()}`);
    expect(documentFeed.find('li > div > p').at(1).text()).toEqual('PRIVATE');
    expect(documentFeed.find('li > h5 > a')
      .filterWhere(item => (item.prop('name') === '76e75e53-ef30-401b-9a60-d05be8bd4270'))
      .text()).toEqual('Another Test Document');
    expect(documentFeed.find('li > div > p').at(2).text())
      .toEqual(`Last edited: ${creationDate.toLocaleTimeString()}`);
    expect(documentFeed.find('li > div > p').at(3).text()).toEqual('PUBLIC');
  });

  it('calls the appropriate click action props when links are clicked', () => {
    const creationDate = new Date();
    while ((new Date()) - creationDate <= 1000) { /* Wait */ }
    const updateDate = new Date();
    documentFeed.setProps({
      documents: {
        list: [
          {
            title: 'Test Document',
            id: '7ec48f91-6ddd-475c-b534-adf194fea4bb',
            access: 'private',
            createdAt: creationDate,
            updatedAt: updateDate,
            User: {
              id: '4ad0a7de-99bf-47b1-afa3-aa0b8b9d3f9f',
              name: 'Test User'
            }
          }
        ]
      }
    });
    expect(documentFeed.props().documentClickAction.calledOnce).toBe(false);
    expect(documentFeed.props().profileClickAction.calledOnce).toBe(false);
    documentFeed.find('a')
      .filterWhere(item => (item.prop('name') === '7ec48f91-6ddd-475c-b534-adf194fea4bb'))
      .simulate('click');
    expect(documentFeed.props().documentClickAction.calledOnce).toBe(true);
    expect(documentFeed.props().profileClickAction.calledOnce).toBe(false);
    documentFeed.find('a')
      .filterWhere(item => (item.prop('name') === '4ad0a7de-99bf-47b1-afa3-aa0b8b9d3f9f'))
      .simulate('click');
    expect(documentFeed.props().documentClickAction.calledOnce).toBe(true);
    expect(documentFeed.props().profileClickAction.calledOnce).toBe(true);
  });
});
