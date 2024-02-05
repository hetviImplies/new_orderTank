import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import Config from 'react-native-config';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/categories`,
    prepareHeaders,
  }),
  tagTypes: ['categories'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getCategory: builder.query({
      query: params => {
        return {
          url: '',
          method: 'GET',
          params
        };
      },
      providesTags: ['categories'],
    }),
  }),
});

export const {useGetCategoryQuery} = categoryApi;
