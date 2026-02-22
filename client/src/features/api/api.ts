// src/features/api/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Form = {
    id: string;
    title: string;
    description?: string;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/graphql",
        headers: {
            "Content-Type": "application/json",
        },
    }),
    endpoints: (builder) => ({
        getForms: builder.query<Form[], void>({
            query: () => ({
                url: "", // 👈 ОБОВʼЯЗКОВО, навіть якщо endpoint той самий
                method: "POST",
                body: {
                    query: `
            query {
              forms {
                id
                title
                description
              }
            }
          `,
                },
            }),
            transformResponse: (response: { data: { forms: Form[] } }) =>
                response.data.forms,
        }),
    }),
});

export const { useGetFormsQuery } = api;