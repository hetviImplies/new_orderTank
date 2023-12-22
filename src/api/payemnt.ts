import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/payment`,
    prepareHeaders,
  }),
  tagTypes: ['payments'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    completePayment: builder.mutation({
      query: body => {
        return {
          url: 'complete-payment',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['payments'],
    }),
    cancelPayment: builder.mutation({
      query: body => {
        return {
          url: 'cancle-payment',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['payments'],
    }),
  }),
});

export const {useCompletePaymentMutation, useCancelPaymentMutation} =
  paymentApi;
