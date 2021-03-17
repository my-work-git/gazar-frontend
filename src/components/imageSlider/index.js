import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import Translate from '../../translate';

const ImageSlider = ({ products, settings }) => (
  <Slider {...settings}>
    {products.map(product => (
      <Link key={product._id} to={`/shop/product/${product._id}`}>
        <img
          src={product.photo}
          alt=""
        />
        <div>
          <h4
            className="cursor-pointer"
            style={{ textAlign: 'center' }}
          >
            <Translate
              object={product}
              keyPrefix="name"
            />
          </h4>
        </div>
      </Link>
    ))}
  </Slider>
);

export default ImageSlider;
