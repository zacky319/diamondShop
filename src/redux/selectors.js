// selectors.js
// selectors.js
import { createSelector } from 'reselect';

// Selector to get all products
const selectProductSlice = (state) => state.productSlice;

export const selectAllProducts = createSelector(
  [selectProductSlice],
  (product) => product.products
);

export const selectProductLoading = createSelector(
  [selectProductSlice],
  (product) => product.loading
);

// users
export const getUserLoginSelector = (state) => state.userLogin.userInfo;
export const getUserSelector = (state) => state.userSignUp.users;
export const getLoadingUserSelector = (state) => state.userSignUp.loading;

// Products
export const getAllProductsSelector = (state) => state.product.products;
export const getLoadingProductSelector = (state) => state.product.loading;
