import * as actionTypes from './actionTypes';

export const changeLanguage = language => ({
  type: actionTypes.CHANGE_LANGUAGE,
  language,
});

export const setCategories = categories => ({
  type: actionTypes.SET_CATEGORIES,
  payload: categories,
});

export const fixCategoriesMenu = isFixed => ({
  type: actionTypes.FIX_CATEGORIES_OPEN,
  payload: isFixed,
});

export const showGlobalSpinner = () => ({
  type: actionTypes.SHOW_GLOBAL_PAGE_SPINNER,
});

export const hideGlobalSpinner = () => ({
  type: actionTypes.HIDE_GLOBAL_PAGE_SPINNER,
});

export const addProductToBasket = product => {
  try {
    // Measure adding a product to a shopping cart
    fbq('track', 'AddToCart');

    dataLayer.push({
      'event': 'addToCart',
      'ecommerce': {
        'currencyCode': 'AMD',
        'add': {
          'products': [{
            'name': product.nameAm,
            'id': product._id,
            'price': product.price,
            'quantity': product.quantity,
            'metric1': product.unit, // custom metric 'Unit'
          }],
        }
      }
    });
  } catch(e) {};

  return {
    type: actionTypes.ADD_PRODUCT_TO_BASKET,
    payload: product,
  };
};

export const removeProductFromBasket = id => {
  try {
    // Measure the removal of a product from a shopping cart.
    dataLayer.push({
      'event': 'removeFromCart',
      'ecommerce': {
        'remove': {
          'products': [{ id }],
        }
      }
    });
  } catch(e) {};

  return {
    type: actionTypes.REMOVE_PRODUCT_FROM_BASKET,
    id,
  }
};

export const updateBasketProductQuantity = (id, quantity) => ({
  type: actionTypes.UPDATE_BASKET_PRODUCT_QUANTITY,
  id,
  quantity,
});

export const clearBasket = () => ({
  type: actionTypes.CLEAR_SHOP_BASKET,
});

export const setUserInfo = user => ({
  type: actionTypes.SET_USER_INFO,
  payload: user,
});

export const refetchUser = refetch => ({
  type: actionTypes.REFETCH_USER_INFO,
  payload: refetch,
});
