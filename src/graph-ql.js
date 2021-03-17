import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';
import { WSClient, HttpLink } from './gql-client';

// handling graphql and network errors
const ErrorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      // store.dispatch(AppActions.api_error_response());
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
  if (networkError) {
    // store.dispatch(AppActions.api_network_error());
    console.log(`[Network error]: ${networkError}`);
  }
});

const linkingOption = process.env.REACT_APP_USE_HTTP ? HttpLink : WSClient;
export const GraphQLClient = new ApolloClient({
  link: ApolloLink.from([ErrorHandler, linkingOption]),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || {}),
});

const mutationFields = `
error
message
`;

const productFields = `
_id
nameEn
nameRu
nameAm
unit
price
discount
maxOrder
minOrder
category {
  _id
  nameEn
  nameRu
  nameAm
  slug
  order
  productCount
  created_at
}
photo
descriptionAm
descriptionRu
descriptionEn
`;

export const LOGIN_OR_REGISTER = gql`
  mutation LoginOrRegister($phoneNumber: String!, $lang: String!) {
    loginOrRegister(phoneNumber: $phoneNumber, lang: $lang) {
      error
      message
    }
  }
`;

export const REGISTER_WITH_EMAIL = gql`
  mutation EmailRegistration($email: String!, $first_name: String!, $last_name: String!, $password: String!, $phoneNumber: String!, $lang: String!) {
    emailRegistration(email: $email, first_name: $first_name, last_name: $last_name, password: $password, phoneNumber: $phoneNumber, lang: $lang) {
      error
      message
    }
  }
`;

export const VERIFY_CODE = gql`
  mutation VerifyCode($phoneNumber: String, $verifyCode: String) {
    verifyCode(phoneNumber: $phoneNumber, verifyCode: $verifyCode) {
      token
      ${mutationFields}
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation EmailVerifyCode($verifyCode: String) {
    emailVerifyCode(verifyCode: $verifyCode) {
      token
      ${mutationFields}
    }
  }
`;

export const RESET_EMAIL = gql`
  mutation EmailResetPassword($login: String!, $lang: String!) {
    emailResetPassword(login: $login, lang: $lang) {
      ${mutationFields}
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($verifyCode: String!, $password: String!, $lang: String!) {
    resetPassword(verifyCode: $verifyCode, password: $password, lang: $lang) {
      ${mutationFields}
    }
  }
`;

export const EMAIL_LOGIN = gql`
  mutation EmailLogin($email: String!, $password: String!) {
    emailLogin(email: $email, password: $password) {
      token
      ${mutationFields}
    }
  }
`;

export const FULL_ME = gql`
  {
    me {
      _id
      first_name
      last_name
      username
      photo
      email
      phoneNumber
      created_at
      bonus
      addresses {
        address
        notes
        orderCount
      }
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  {
    categories {
      _id
      nameEn
      nameRu
      nameAm
      slug
      order
      productCount
      created_at
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  query Products($category: String, $query: String, $featured: Boolean) {
    products (category: $category, query: $query, featured: $featured) {
      ${productFields}
    }
  }
`;

export const PRODUCT_QUERY = gql`
  query Product($product_id: String!) {
    product(product_id: $product_id) {
      ${productFields}
    }
  }
`;

export const PRODUCTS_ORDERED_WITH_QUERY = gql`
  query ProductsOrderedWith($product_id: String!) {
    productsOrderedWith(product_id: $product_id) {
      ${productFields}
    }
  }
`;

export const BASKET_PRODUCTS_QUERY = gql`
  query BasketProducts($basket_id: String!) {
    basketProducts(basket_id: $basket_id) {
      ${productFields}
      quantity
    }
  }
`;

export const UPDATE_ME = gql`
  mutation UpdateMe($first_name: String!, $last_name: String!, $email: String) {
    updateMe(first_name: $first_name, last_name: $last_name, email: $email) {
      ${mutationFields}
    }
  }
`;

export const ADD_USER_ADDRESS = gql`
  mutation AddUserAddress($address: String!, $notes: String) {
    addAddressForMe(address: $address, notes: $notes) {
      ${mutationFields}
    }
  }
`;

export const REMOVE_USER_ADDRESS = gql`
  mutation RemoveUserAddress($address: String!) {
    removeAddressForMe(address: $address) {
      ${mutationFields}
    }
  }
`;

export const SHOP_ORDERS = gql`
  {
    shopOrders {
      _id
      phoneNumber
      address
      price
      deliveryTime
      status
      created_at
      products {
        ${productFields}
        quantity
      }
    }
  }
`;

export const SET_ORDER = gql`
  mutation SetOrder(
    $lang: String!,
    $phoneNumber: String!,
    $address: String!,
    $deliveryTime: String!,
    $deliveryDate: String!,
    $products: String!,
    $verifyCode: String,
    $notes: String,
    $paymentMethod: String
    ) {
    setOrder(
      lang: $lang,
      phoneNumber: $phoneNumber,
      address: $address,
      deliveryTime: $deliveryTime,
      deliveryDate: $deliveryDate,
      products: $products,
      verifyCode: $verifyCode,
      notes: $notes,
      paymentMethod: $paymentMethod,
    ) {
      token
      orderId
      paymentId
      idramForm
      formUrl
      ${mutationFields}
    }
  }
`;

export const GET_PAYMENT_INFO = gql`
  query PaymentInfo($paymentId: String!) {
    paymentInfo(paymentId: $paymentId) {
      _id
      state
      created_at
      amount
      shopOrder {
        price
        address
        phoneNumber
        deliveryTime
        products {
          ${productFields}
          quantity
        }
      }
    }
  }
`;

export const SEND_IDRAM_REPORT = gql`
  mutation SendIdramReport($EDP_BILL_NO: String){
     sendIdramReport(EDP_BILL_NO: $EDP_BILL_NO){
       ${mutationFields}
     }
  }
`;
