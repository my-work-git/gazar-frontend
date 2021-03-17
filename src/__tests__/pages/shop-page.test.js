import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";
import { expect } from 'chai';

import ShopPage from '../../pages/shop';
import { MockedProvider } from 'react-apollo/test-utils';
import store from '../../store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PRODUCTS_QUERY } from '../../graph-ql';

Enzyme.configure({ adapter: new Adapter() });

describe('Shop page tests', () => {

  let mocks,
    mocksWithoutSomeProperties,
    mocksWithoutData;
  beforeEach(() => {
    mocks = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
          category: 'Mexr',
          query: undefined,
          }},
        result: {
          "data": {
            "products": [
              {
                "nameEn": "Honey",
                "nameRu": "Мед",
                "nameAm": "Մեղր",
                "unit": "kg",
                "price": 4500,
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 0.5,
                "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126b38c34dd8c53c33f4c.png",
                "category": {
                  "created_at": "Sun Jul 29 2018 10:36:28 GMT+0000 (UTC)",
                  "nameAm": "Մեղր",
                  "nameEn": "Honey",
                  "nameRu": "Мед",
                  "order": 2,
                  "productCount": null,
                  "slug": "Mexr",
                  "__typename": "CategoryType",
                  "_id": "5b9126518c34dd8c53c33f04",
                },
                "descriptionAm": null,
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType",
                "_id": "5b9126b38c34dd8c53c33f4c",
              },
            ]
          },
        },
      },
    ];
    mocksWithoutData = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
            category: 'Mexr',
            query: undefined,
          }},
        result: {
          "data": {
            "products": []
          },
        },
      },
    ];
    mocksWithoutSomeProperties = [
      {
        request: { query: PRODUCTS_QUERY, variables: {
            category: 'Mexr',
            query: undefined,
          }},
        result: {
          "data": {
            "products": [
              {
                "nameEn": "Honey",
                "nameRu": "Мед",
                "nameAm": "Մեղր",
                "unit": "kg",
                "discount": 0,
                "maxOrder": 20,
                "minOrder": 0.5,
                "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126b38c34dd8c53c33f4c.png",
                "category": {
                  "created_at": "Sun Jul 29 2018 10:36:28 GMT+0000 (UTC)",
                  "nameAm": "Մեղր",
                  "nameEn": "Honey",
                  "nameRu": "Мед",
                  "order": 2,
                  "productCount": null,
                  "slug": "Mexr",
                  "__typename": "CategoryType",
                  "_id": "5b9126518c34dd8c53c33f04",
                },
                "descriptionAm": null,
                "descriptionRu": null,
                "descriptionEn": null,
                "__typename": "ProductType",
              },
            ]
          },
        },
      },
    ];
  });
  test('Shop page renders and shows product item.', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <Router>
            <ShopPage location={{ search: '?cat=Mexr' }}/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await new Promise(resolve => setTimeout(resolve));
    await wrapper.update();
    expect(wrapper.find('.product-item')).to.have.lengthOf(1);
    expect(wrapper.isEmptyRender()).to.equal(false);
  });
  test('Shop page render not failing when there is no response from server side, which means PRODUCTS_QUERY responding with an empty array.', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutData}>
        <Provider store={store}>
          <Router>
            <ShopPage location={{ search: '?cat=Mexr' }}/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await wrapper.update();
    expect(wrapper.isEmptyRender()).to.equal(false);
  });

  test('Rendering should not fail, but throws an error if we are providing productsQuery.products where each item contains only few fields that is required to render. For example before running render, remove some properties from product', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutSomeProperties}>
        <Provider store={store}>
          <Router>
            <ShopPage location={{ search: '?cat=Mexr' }}/>
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
