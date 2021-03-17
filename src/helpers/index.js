import Store from 'store';
import ExpirePlugin from 'store/plugins/expire';
import queryString from './query-string';
import moment from 'moment'



Store.addPlugin(ExpirePlugin);


const date =new Date().getHours()




export const DELIVERY_TIMES = [
  { value: '10-11am', text: '10-11am' },
  { value: '13-14pm', text: '13-14pm' },
  { value: '16-17pm', text: '16-17pm' },
  { value: '19-20pm', text: '19-20pm' },
  {value:'ORDER_NOW', text:`${date}-${date+1}pm` }, 
];

export const DELIVERY_TIME_MAX_HOURS = {
  '10-11am': 9,
  '13-14pm': 12,
  '16-17pm': 15,
  '19-20pm': 18,
  "ORDER_NOW":22
 
};

export const MIN_ORDER_LIMIT = 100;

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};
export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }
  if (rules.isPassword) {
    const pattern = /^.*(?=.{8,20})(?=.*\d)(?=.*[a-zA-Z]).*$/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
};

export const isDesktop = () => window && window.innerWidth > 991;

export const calcPrices = (price, discount, quantity) => ({
  price: Math.round(((price - (price * (discount || 0)) / 100) * quantity) * 10) / 10,
  discount: Math.round((price * quantity) * 10) / 10,
});

export const getTotalPrice = products => {
  let totalPrice = 0;
  if (products) {
    // eslint-disable-next-line
    products.map(p => {
      const { price } = calcPrices(p.price, p.discount, p.quantity);
      if (price) {
        totalPrice += price;
      }
    });
  }
  return totalPrice;
};

export const setCache = (key, obj) => Store.set(key, obj, new Date().getTime() + 2592000000);
export const getCache = key => Store.get(key);
export const setToken = token => token ? setCache('token', token) : Store.remove('token');
export const getToken = () => getCache('token');

export const getCachedBasket = () => getCache('basket_data');
export const setCachedBasket = shop_data => setCache('basket_data', shop_data);

export const getUrlCategories = locationQuery => {
  if (typeof locationQuery !== 'string') return [];
  const queryParams = queryString.parse(locationQuery);
  return queryParams.cat ? queryParams.cat.split(',') : [];
};

export const getKeyQuery = locationQuery => queryString.parse(locationQuery).q;

export const strigifyCategories = categories => queryString.stringify({ cat: categories.join(',') });

export const DeliveryTimeIsToday = (deliveryTime, deliveryDate) => {
  const hour = deliveryDate.getHours();
  const deliveryTimeHour = DELIVERY_TIME_MAX_HOURS[deliveryTime];
  if (!deliveryTimeHour) return false;
  return deliveryTimeHour > hour;
};

export const deliveryDateHandler = deliveryDate => {
  
  if (deliveryDate < new Date()) {
    return new Date();
  } else {
    deliveryDate.setHours(0,0,0,0);
    return deliveryDate;
  }
};

export const currentDeliveryTime = date => {
  for (let i = 0; i < DELIVERY_TIMES.length; i++) {
    const dtName = DELIVERY_TIMES[i].value;
    if (DeliveryTimeIsToday(dtName, date)) {
      return dtName;
    }
  }

  return DELIVERY_TIMES[0].value;
};
