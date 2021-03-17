import { getCachedBasket, setCachedBasket, DELIVERY_TIMES, currentDeliveryTime } from '../../helpers';
import { actionTypes } from '../action';

const cleanState = {
  products: [],
};

const initialState = getCachedBasket() || cleanState;

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT_TO_BASKET: {
      const { products } = state;
      let exists = false;
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === action.payload._id) {
          products[i] = action.payload;
          exists = true;
          break;
        }
      }
      if (!exists) {
        products.push(action.payload);
      }
      return { ...state, products: [...products] };
    }
    case actionTypes.UPDATE_BASKET_PRODUCT_QUANTITY: {
      const { products } = state;
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === action.id) {
          products[i] = { ...products[i], quantity: action.quantity };
          break;
        }
      }
      return { ...state, products: [...products] };
    }
    case actionTypes.REMOVE_PRODUCT_FROM_BASKET: {
      const { products } = state;
      const res = [];
      products.map(p => p._id !== action.id && res.push(p));
      return { ...state, products: res };
    }
    case actionTypes.CLEAR_SHOP_BASKET:
      return { products: [], deliveryTime: DELIVERY_TIMES[0].value };
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  const s = shopReducer(state, action);
  setCachedBasket(s);
  return s;
};
