import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Product from '../../components/products/productItem';
import Adapter from "enzyme-adapter-react-16";
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const product = {
  "price": "180",
  "discount": "12",
  "maxOrder": "20",
  "minOrder": "1",
  "quantity": "14",
  "_id": "5b9126598c34dd8c53c33f0a",
  "nameAm": "Հազար",
  "nameEn": "Lettuce",
  "nameRu": "Салат",
  "unit": "item",
  "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126598c34dd8c53c33f0a.png"
};

const productWithoutQuantity = {
  "price": "180",
  "discount": "12",
  "maxOrder": "20",
  "minOrder": "1",
  "_id": "5b9126598c34dd8c53c33f0a",
  "nameAm": "Հազար",
  "nameEn": "Lettuce",
  "nameRu": "Салат",
  "unit": "item",
  "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126598c34dd8c53c33f0a.png"
};

describe("Products item test", () => {
  test('product data is coming', () => {
    const wrapper = shallow(<Product.WrappedComponent product={product}/>);
    expect(wrapper.instance().props.product).to.be.an('object');
  });

  test('product renders as a basket view when provided basketItem={true} props', () => {
    const wrapper = shallow(<Product.WrappedComponent product={product} basketItem={true}/>);
    expect(wrapper.find('.basket-item-row')).to.have.lengthOf(1);
  });

  test('if no quantity prop in data, than sets state minOrder', () => {
    const wrapper = shallow(<Product.WrappedComponent product={productWithoutQuantity}/>);
    expect(wrapper.state().quantity).to.equal(product.minOrder);
  });

  test('if product is in basket, show check icon', () => {
    const wrapper = shallow(<Product.WrappedComponent product={product} inBasket={true}/>);
    expect(wrapper.find('.fa-check')).to.have.lengthOf(1);
  });
});
