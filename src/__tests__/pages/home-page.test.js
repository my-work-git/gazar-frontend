import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";
import { expect } from 'chai';

import Main from '../../pages/main';
import { MockedProvider } from 'react-apollo/test-utils';
import store from '../../store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PRODUCTS_QUERY } from '../../graph-ql';

Enzyme.configure({ adapter: new Adapter() });

describe('Home page tests', () => {

  let mocks;
  let mocksWithoutFeaturedProducts;
  let mocksWithoutProperties;
  beforeEach(() => {
    mocksWithoutProperties = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
            category: 'top-products',
          },
        },
        result: {
          "data": {
            "products": [
              {
                "nameEn": "Lemon",
                "nameRu": "Лимон",
                "unit": "item",
                "price": 160,
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 1,
                "category": {
                  "_id": "5b9126518c34dd8c53c33f00",
                  "nameEn": "Tropical Fruits",
                  "nameRu": "Тропические Фрукты",
                  "nameAm": "Արևադարձային մրգեր",
                  "slug": "arevadardzayin",
                  "order": 8,
                  "productCount": null,
                  "created_at": "Sun Mar 04 2018 07:49:57 GMT+0000 (UTC)",
                  "__typename": "CategoryType"
                },
                "descriptionAm": "",
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType"
              },
            ]
          },
        },
      },
      {
        request: { query: PRODUCTS_QUERY, variables: {
            featured: true,
          },
        },
        result: {
          "data": {
            "products": [
              {
                "_id": "5b9126868c34dd8c53c33f2c",
                "nameEn": "Apple \"Golden\"",
                "nameRu": "Яблоко \"Голден\"",
                "nameAm": "Խնձոր Գոլդեն",
                "unit": "kg",
                "price": 530,
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 0.5,
                "category": {
                  "_id": "5b9126508c34dd8c53c33eff",
                  "nameEn": "Fruits",
                  "nameRu": "Фрукты",
                  "nameAm": "Մրգեր",
                  "slug": "mrger",
                  "order": 1,
                  "productCount": null,
                  "created_at": "Sun Mar 04 2018 07:59:44 GMT+0000 (UTC)",
                  "__typename": "CategoryType"
                },
                "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126868c34dd8c53c33f2c.png",
                "descriptionAm": null,
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType"
              },
            ]
          },
        },
      },
    ];
    mocksWithoutFeaturedProducts = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
            category: 'top-products',
          },
        },
        result: {
          "data": {
            "products": [
              {
                "_id": "5b9126548c34dd8c53c33f06",
                "nameEn": "Lemon",
                "nameRu": "Лимон",
                "nameAm": "Լիմոն",
                "unit": "item",
                "price": 160,
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 1,
                "category": {
                  "_id": "5b9126518c34dd8c53c33f00",
                  "nameEn": "Tropical Fruits",
                  "nameRu": "Тропические Фрукты",
                  "nameAm": "Արևադարձային մրգեր",
                  "slug": "arevadardzayin",
                  "order": 8,
                  "productCount": null,
                  "created_at": "Sun Mar 04 2018 07:49:57 GMT+0000 (UTC)",
                  "__typename": "CategoryType"
                },
                "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126548c34dd8c53c33f06.png",
                "descriptionAm": "",
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType"
              },
            ]
          },
        },
      },
      {
        request: { query: PRODUCTS_QUERY, variables: {
            featured: true,
          },
        },
        result: {
          "data": {
            "products": []
          },
        },
      },
    ];
    mocks = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
            category: 'top-products',
          },
        },
        result: {
          "data": {
            "products": []
          },
        },
      },
      {
        request: { query: PRODUCTS_QUERY, variables: {
            featured: true,
          },
        },
        result: {
          "data": {
            "products": [
              {
                "_id": "5b9126868c34dd8c53c33f2c",
                "nameEn": "Apple \"Golden\"",
                "nameRu": "Яблоко \"Голден\"",
                "nameAm": "Խնձոր Գոլդեն",
                "unit": "kg",
                "price": 530,
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 0.5,
                "category": {
                  "_id": "5b9126508c34dd8c53c33eff",
                  "nameEn": "Fruits",
                  "nameRu": "Фрукты",
                  "nameAm": "Մրգեր",
                  "slug": "mrger",
                  "order": 1,
                  "productCount": null,
                  "created_at": "Sun Mar 04 2018 07:59:44 GMT+0000 (UTC)",
                  "__typename": "CategoryType"
                },
                "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126868c34dd8c53c33f2c.png",
                "descriptionAm": null,
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType"
              },
            ]
          },
        },
      },
    ];
  });
  test('"Featured products" panel should despair when featuredQuery.products is an empty array.', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutFeaturedProducts}>
        <Provider store={store}>
          <Router>
            <Main/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await wrapper.update();
    expect(wrapper.find('.featured-products-section')).to.not.have.lengthOf(1);
  });

  test('Home page render not failing when there is no response from server side, which means PRODUCTS_QUERY responding with an empty array.', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <Router>
            <Main/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await wrapper.update();
    expect(wrapper.isEmptyRender()).to.equal(false);
  });

  test('Rendering should not fail, but throws an error if we are providing productsQuery.products where each item contains only few fields that is required to render. For example before running render, remove nameAm, photo, _id from each product', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutProperties}>
        <Provider store={store}>
          <Router>
            <Main/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await wrapper.update();
    expect(() => {
      throw new Error();
    }).throw();
    expect(wrapper.isEmptyRender()).to.equal(false);
  });
});
