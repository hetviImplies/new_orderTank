import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import { BASE_URL } from '../types/data';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/notification`,
    prepareHeaders,
  }),
  tagTypes: ['notification'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getNotification: builder.query({
      query: () => {
        return {
          url: 'get-all-user-notification',
          method: 'GET',
        };
      },
      providesTags: ['notification'],
    }),
    readNotification: builder.query({
      query: () => {
        return {
          url: 'read-notification',
          method: 'GET',
        };
      },
      providesTags: ['notification'],
    }),
  }),
});

export const {useGetNotificationQuery, useReadNotificationQuery} = notificationApi;
