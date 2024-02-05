import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import Config from 'react-native-config';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/order`,
    prepareHeaders,
  }),
  tagTypes: ['orders'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getOrders: builder.query({
      query: params => {
        return {
          url: '',
          method: 'GET',
          params,
        };
      },
      providesTags: ['orders'],
    }),
    addOrder: builder.mutation({
      query: body => {
        return {
          url: '/',
          method: 'POST',
          body,
        };
      },
      // invalidatesTags: ['orders'],
    }),
    updateOrder: builder.mutation({
      query: body => {
        return {
          url: `${body.id}`,
          method: 'PUT',
          body: body.data,
        };
      },
      invalidatesTags: ['orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: body => {
        return {
          url: `${body.id}/status`,
          method: 'PUT',
          body: body.data,
        };
      },
      invalidatesTags: ['orders'],
    }),
    deleteOrder: builder.mutation({
      query: id => {
        return {
          url: `${id}/cancle`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['orders'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useAddOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
