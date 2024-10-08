import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import Config from 'react-native-config';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/notification`,
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
    readNotification: builder.mutation({
      query: () => {
        return {
          url: 'read-notification',
          method: 'PUT',
        };
      },
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {useGetNotificationQuery, useReadNotificationMutation} = notificationApi;
