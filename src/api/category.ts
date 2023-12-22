import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import { BASE_URL } from '../types/data';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/categories`,
    prepareHeaders,
  }),
  tagTypes: ['categories'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getCategory: builder.query({
      query: params => {
        return {
          url: 'sellers/joined',
          method: 'GET',
          params
        };
      },
      providesTags: ['categories'],
    }),
  }),
});

export const {useGetCategoryQuery} = categoryApi;
