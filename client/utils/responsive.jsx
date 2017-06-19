import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

export const Desktop = ({ children, className }) =>
  <MediaQuery minWidth={993} orientation="landscape" className={className}>{children}</MediaQuery>;

export const Small = ({ children, className }) =>
  <MediaQuery maxWidth={993} orientation="landscape" className={className}>{children}</MediaQuery>;

export const Mobile = ({ children, className }) =>
  <MediaQuery orientation="portrait" className={className}>{children}</MediaQuery>;

Desktop.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  className: PropTypes.string
};

Desktop.defaultProps = {
  className: ''
};

Small.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  className: PropTypes.string
};

Small.defaultProps = {
  className: ''
};

Mobile.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  className: PropTypes.string
};

Mobile.defaultProps = {
  className: ''
};
