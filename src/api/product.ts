import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import queryString from 'query-string';
import Config from 'react-native-config';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/product`,
    prepareHeaders,
    paramsSerializer: function (params: any) {
      return queryString.stringify(params, {arrayFormat: 'index'});
    },
  }),
  tagTypes: ['products'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getAllProducts: builder.query({
      query: ((params) => {
        // const {brands, category} = params;
        return {
          url: '/',
          method: 'GET',
          params
        };
      }),
      providesTags: ['products'],
    }),
    getOneProduct: builder.query({
      query: ((params) => {
        // const {brands, category} = params;
        return {
          url: params?.id,
          method: 'GET',
          params
        };
      }),
      providesTags: ['products'],
    }),
  }),
});

export const {useGetAllProductsQuery, useGetOneProductQuery} = productApi;
