import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/order/`,
    prepareHeaders,
  }),
  tagTypes: ['orders'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getOrders: builder.query({
      query: () => {
        return {
          url: 'get-all-my-order',
          method: 'GET',
        };
      },
      providesTags: ['orders'],
    }),
    addOrder: builder.mutation({
      query: body => {
        return {
          url: 'add-order',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['orders'],
    }),
    updateOrder: builder.mutation({
      query: body => {
        return {
          url: 'update-order',
          method: 'PUT',
          params: {id : body.id},
          body: body.data,
        };
      },
      invalidatesTags: ['orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: body => {
        return {
          url: 'update-order-status',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['orders'],
    }),
    deleteOrder: builder.mutation({
      query: body => {
        return {
          url: 'delete-order',
          method: 'DELETE',
          params: body,
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
