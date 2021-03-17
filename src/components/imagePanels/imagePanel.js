import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from '../Link';

const ImagePanel = ({ linkTo, hoverAnimation, imageSrc }) => {
  const Img = linkTo ? (
    <Link to={linkTo}>
      <img src={imageSrc} alt="Product" />
    </Link>
  ) : (
    <img src={imageSrc} alt="Product" />
  );

  return <div className={cx({ 'side-banner': hoverAnimation })} style={{ textAlign: 'center' }}>{Img}</div>;
};

ImagePanel.propTypes = {
  hoverAnimation: PropTypes.bool,
  linkTo: PropTypes.string,
  imageSrc: PropTypes.string.isRequired,
};

export default ImagePanel;
