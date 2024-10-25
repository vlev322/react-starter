import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface StarWarsPerson {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
}

export interface StarWarsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarWarsPerson[];
}

export const starWarsApiSlice = createApi({
  reducerPath: "starWars",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://swapi.dev/api",
  }),
  endpoints: (builder) => ({
    getPeople: builder.query<StarWarsResponse, { page: number }>({
      query: ({ page }) => `/people/?page=${page}`,
    }),
  }),
});

export const { useGetPeopleQuery } = starWarsApiSlice;
