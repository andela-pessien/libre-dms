import React from 'react';
import PropTypes from 'prop-types';

/**
 * Preloader (spinner) component to be displayed during long page loads.
 * @param {Object} props The props for the component.
 * @returns {String} The HTML markup for the Preloader component
 */
function Preloader(props) {
  return (
    <div
      className={`preloader-wrapper ${props.size} ${props.className} active`}
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
}

Preloader.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string
};

Preloader.defaultProps = {
  size: 'big',
  className: ''
};

export default Preloader;
