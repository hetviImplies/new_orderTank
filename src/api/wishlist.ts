import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/wishlist/`,
    prepareHeaders,
  }),
  tagTypes: ['wishlists'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getWishlists: builder.query({
      query: () => {
        return {
          url: 'get-all-user-wishlist',
          method: 'GET',
        };
      },
      providesTags: ['wishlists'],
    }),
    addWishlists: builder.mutation({
      query: body => {
        return {
          url: 'add-wish',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['wishlists'],
    }),
    removeWishlists: builder.mutation({
      query: body => {
        return {
          url: 'remove-wish',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['wishlists'],
    }),
  }),
});

export const {
  useGetWishlistsQuery,
  useAddWishlistsMutation,
  useRemoveWishlistsMutation,
} = wishlistApi;
