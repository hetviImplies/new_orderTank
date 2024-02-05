import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import queryString from 'query-string';
import Config from 'react-native-config';

export const companyRelationsApi = createApi({
  reducerPath: 'companyRelationsApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/companyRelations`,
    prepareHeaders,
    paramsSerializer: function (params: any) {
      return queryString.stringify(params, {arrayFormat: 'index'});
    },
  }),
  tagTypes: ['company'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getSupplier: builder.query({
      query: params => {
        return {
          url: 'getRelations',
          method: 'GET',
          params,
        };
      },
      providesTags: ['company'],
    }),
    companyRequest: builder.mutation({
      query: body => {
        return {
          url: 'sendRequest',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['company'],
    }),
  }),
});

export const {useGetSupplierQuery, useCompanyRequestMutation} =
  companyRelationsApi;
