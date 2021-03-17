import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";
import { expect } from 'chai';

import AccountOrders from '../../pages/partials/accountOrders';
import { MockedProvider } from 'react-apollo/test-utils';
import store from '../../store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { SHOP_ORDERS } from '../../graph-ql';

Enzyme.configure({ adapter: new Adapter() });

describe('Account orders page tests', () => {

  let mocks,
  mocksWithoutSomeProperties,
  mocksWithoutData;
  beforeEach(() => {
    mocksWithoutData = [
      {
        request: { query: SHOP_ORDERS },
        result: {
          "data": {
            "shopOrders": []
          },
        },
      },
    ];
    mocksWithoutSomeProperties = [
      {
        request: { query: SHOP_ORDERS },
        result: {
          "data": {
            "shopOrders": [
              {
                "price": 6650,
                "deliveryTime": "15-16pm",
                "status": "pending",
                "created_at": "Wed Sep 19 2018 16:06:07 GMT+0000 (UTC)",
                "products": [
                  {
                    "_id": "5b91268a8c34dd8c53c33f2f",
                    "nameEn": "Coriander",
                    "nameRu": "Кориандр",
                    "nameAm": "Համեմ",
                    "unit": "item",
                    "price": 150,
                    "discount": 0,
                    "maxOrder": 20,
                    "minOrder": 1,
                    "category": null,
                    "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b91268a8c34dd8c53c33f2f.png",
                    "descriptionAm": null,
                    "descriptionRu": null,
                    "descriptionEn": null,
                    "quantity": 7,
                    "__typename": "ProductType"
                  },
                  {
                    "_id": "5b91268d8c34dd8c53c33f31",
                    "nameEn": "Cocount",
                    "nameRu": "Kокос",
                    "nameAm": "Կոկոս",
                    "unit": "item",
                    "price": 700,
                    "discount": 0,
                    "maxOrder": 20,
                    "minOrder": 1,
                    "category": null,
                    "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b91268d8c34dd8c53c33f31.png",
                    "descriptionAm": null,
                    "descriptionRu": null,
                    "descriptionEn": null,
                    "quantity": 8,
                    "__typename": "ProductType"
                  }
                ],
                "__typename": "ShopOrderType"
              },
            ]
          },
        },
      },
    ];

    mocks = [
      {
        request: { query: SHOP_ORDERS },
        result: {
          "data": {
            "shopOrders": [
              {
                "_id": "5b9454902baf3b002c859499",
                "phoneNumber": "+37491989398",
                "address": "14 Mayisyan",
                "price": 5100,
                "deliveryTime": "19-20pm",
                "status": "pending",
                "created_at": "Sat Sep 08 2018 23:00:32 GMT+0000 (UTC)",
                "products": [
                  {
                    "_id": "5b9126968c34dd8c53c33f38",
                    "nameEn": "Carrot",
                    "nameRu": "Морковь",
                    "nameAm": "Գազար",
                    "unit": "kg",
                    "price": 300,
                    "discount": 0,
                    "maxOrder": 20,
                    "minOrder": 0.5,
                    "category": null,
                    "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126968c34dd8c53c33f38.png",
                    "descriptionAm": null,
                    "descriptionRu": null,
                    "descriptionEn": null,
                    "quantity": 4,
                    "__typename": "ProductType"
                  },
                  {
                    "_id": "5b9126db8c34dd8c53c33f68",
                    "nameEn": "Watermelon",
                    "nameRu": "Арбуз",
                    "nameAm": "Ձմերուկ",
                    "unit": "kg",
                    "price": 120,
                    "discount": 0,
                    "maxOrder": 20,
                    "minOrder": 1,
                    "category": null,
                    "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b9126db8c34dd8c53c33f68.png",
                    "descriptionAm": null,
                    "descriptionRu": null,
                    "descriptionEn": null,
                    "quantity": 5,
                    "__typename": "ProductType"
                  },
                  {
                    "_id": "5b91265e8c34dd8c53c33f0e",
                    "nameEn": "Banana",
                    "nameRu": "Банан",
                    "nameAm": "Բանան",
                    "unit": "kg",
                    "price": 600,
                    "discount": 0,
                    "maxOrder": 20,
                    "minOrder": 0.5,
                    "category": null,
                    "photo": "https://storage.googleapis.com/gazar-am.appspot.com/5b91265e8c34dd8c53c33f0e.png",
                    "descriptionAm": null,
                    "descriptionRu": null,
                    "descriptionEn": null,
                    "quantity": 5.5,
                    "__typename": "ProductType"
                  }
                ],
                "__typename": "ShopOrderType"
              },
            ]
          },
        },
      },
    ];
  });
  test('account orders page render not failing when there is no response from server side, which means SHOP_ORDERS responding with an empty array.', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutData}>
        <Provider store={store}>
          <Router>
            <AccountOrders/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await new Promise(resolve => setTimeout(resolve));
    await wrapper.update();
    expect(wrapper.isEmptyRender()).to.equal(false);
    });

  test('When there are no any shop orders, then show DONT_HAVE_ORDERS text', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutData}>
        <Provider store={store}>
          <Router>
            <AccountOrders/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await new Promise(resolve => setTimeout(resolve));
    await wrapper.update();
    expect(wrapper.find('.empty-orders-text')).to.have.lengthOf(1);
  });

  test('orders item block is visible when the orders list is not empty', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocks}>
        <Provider store={store}>
          <Router>
            <AccountOrders/>
          </Router>
        </Provider>
      </MockedProvider>
    ));
    await new Promise(resolve => setTimeout(resolve));
    await wrapper.update();
    expect(wrapper.find('.orders-item')).to.have.lengthOf.above(0);
  });

  test('Rendering should not fail, but throws an error if we are providing shopOrders where each item contains only few fields that is required to render. For example before running render, remove phoneNumber, address, _id for each product', async () => {
    const wrapper = mount((
      <MockedProvider mocks={mocksWithoutSomeProperties}>
        <Provider store={store}>
          <Router>
            <AccountOrders/>
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
