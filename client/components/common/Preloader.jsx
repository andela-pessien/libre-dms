import React from 'react';
import PropTypes from 'prop-types';

/**
 * Preloader (spinner) component to be displayed during long resource loads.
 * @param {Object} props The props for the component.
 * @returns {String} The HTML markup for the Preloader component
 */
const Preloader = props => (
  <div
    className={`preloader-wrapper ${props.size} ${props.classNames} active`}
  >
    <div className="spinner-layer">
      <div className="circle-clipper left">
        <div className="circle" />
      </div>
      <div className="gap-patch">
        <div className="circle" />
      </div>
      <div className="circle-clipper right">
        <div className="circle" />
      </div>
    </div>
  </div>
);

Preloader.propTypes = {
  size: PropTypes.string,
  classNames: PropTypes.string
};

Preloader.defaultProps = {
  size: 'big',
  classNames: ''
};

export default Preloader;
