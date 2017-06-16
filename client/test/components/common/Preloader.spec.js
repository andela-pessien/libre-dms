import React from 'react';
import { shallow } from 'enzyme';
import Preloader from '../../../components/common/Preloader';

describe('Preloader component', () => {
  let preloader;
  const props = {
    size: 'small',
    classNames: 'middle one two'
  };

  beforeEach(() => {
    preloader = shallow(<Preloader {...props} />);
  });

  it('renders without crashing', () => {
    expect(preloader.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(preloader.find('.preloader-wrapper').length).toBe(1);
    expect(preloader.find('.spinner-layer').length).toBe(1);
    expect(preloader.find('.circle-clipper').length).toBe(2);
    expect(preloader.find('.circle-clipper.left').length).toBe(1);
    expect(preloader.find('.circle-clipper.right').length).toBe(1);
    expect(preloader.find('.gap-patch').length).toBe(1);
    expect(preloader.find('.circle').length).toBe(3);
  });

  it('should add the provided props as CSS classes', () => {
    expect(preloader.find(`.${props.size}`).length).toBe(1);
    props.classNames.split(' ').forEach((className) => {
      expect(preloader.find(`.${className}`).length).toBe(1);
    });
  });
});
