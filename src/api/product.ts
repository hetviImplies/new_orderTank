import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import queryString from 'query-string';
import { BASE_URL } from '../types/data';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/product`,
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
        console.log('params', params)
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
