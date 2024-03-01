import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import Config from 'react-native-config';

export const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/systemSetting`,
    prepareHeaders,
  }),
  tagTypes: ['settings'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getSystemSetting: builder.query({
      query: params => {
        return {
          url: '',
          method: 'GET',
          params,
        };
      },
      providesTags: ['settings'],
    }),
  }),
});

export const {useGetSystemSettingQuery} = settingApi;
