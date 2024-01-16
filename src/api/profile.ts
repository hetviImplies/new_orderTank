import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import { BASE_URL } from '../types/data';
import Config from 'react-native-config';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/user`,
    prepareHeaders,
  }),
  tagTypes: ['profiles'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    updateProfile: builder.mutation({
      query: body => {
        return {
          url: 'updateProfile',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['profiles'],
    }),
  }),
});

export const {useUpdateProfileMutation} = profileApi;