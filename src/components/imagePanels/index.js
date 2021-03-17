import React from 'react';
import PropTypes from 'prop-types';
import ImagePanel from './imagePanel';

const ImagePanels = ({ images, hoverAnimation }) => (
  <div>
    {images &&
      images.map((image, i) => (
        <ImagePanel
          key={i}
          imageSrc={image.src}
          linkTo={image.linkTo}
          hoverAnimation={hoverAnimation}
        />
      ))}
  </div>
);

ImagePanels.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  hoverAnimation: PropTypes.bool,
};

export default ImagePanels;
