import * as actionTypes from '../action/actionTypes';
import { getCache, setCache } from '../../helpers';

const initialState = {
  activeLanguage: getCache('lang') || 'am',
  fixCategories: false,
  globalSpinner: false,
  categories: [],
  user: {},
  shouldFetchUser: false,
};

const common = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_LANGUAGE: {
      setCache('lang', action.language);
      return {
        ...state,
        activeLanguage: action.language,
      };
    }
    case actionTypes.FIX_CATEGORIES_OPEN:
      return { ...state, fixCategories: action.payload };
    case actionTypes.SHOW_GLOBAL_PAGE_SPINNER:
      return { ...state, globalSpinner: true };
    case actionTypes.HIDE_GLOBAL_PAGE_SPINNER:
      return { ...state, globalSpinner: false };
    case actionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case actionTypes.SET_USER_INFO:
      return { ...state, user: action.payload };
    case actionTypes.REFETCH_USER_INFO:
      return { ...state, shouldFetchUser: action.payload };
    default:
      return state;
  }
};
export default common;
