import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import { BASE_URL } from '../types/data';

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/brand`,
    // prepareHeaders,
  }),
  tagTypes: ['brands'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getbrand: builder.query({
      query: () => {
        return {
          url: 'get-all-brand',
          method: 'GET',
        };
      },
      providesTags: ['brands'],
    }),
  }),
});

export const {useGetbrandQuery} = brandApi;
