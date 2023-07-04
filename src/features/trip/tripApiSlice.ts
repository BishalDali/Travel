import { apiSlice } from "../app/appSlice";


export const tripApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTrips: builder.query({
            query: () => ({
                url: "trips",
                method: "GET",
            }),
        }),
        getTrip: builder.query({
            query: (id) => ({
                url: `trips/${id}`,
                method: "GET",
            }),
        }),
        createTrip: builder.mutation({
            query: (trip) => ({
                url: "trips",
                method: "POST",
                body: trip,
            }),
        }),
        addToFavourites: builder.mutation({
            query: (id) => ({
                url: `trips/${id}/favorites`,
                method: "POST",
            }),
        }),
        removeFromFavourites: builder.mutation({
            query: (id) => ({
                url: `trips/${id}/favorites`,
                method: "DELETE",
            }),
        })
    }),

});


export const {
    useGetTripsQuery,
    useGetTripQuery,
    useCreateTripMutation,
    useAddToFavouritesMutation,
    useRemoveFromFavouritesMutation,
} = tripApiSlice;
