import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

type GraphqlArgs = {
    document: string;
    variables?: unknown; // <-- было Record<string, unknown>
};

type GraphqlError = FetchBaseQueryError | { status: "GRAPHQL_ERROR"; data: unknown };

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/graphql",
    headers: { "Content-Type": "application/json" },
});

const graphqlBaseQuery: BaseQueryFn<GraphqlArgs, unknown, GraphqlError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(
        {
            url: "",
            method: "POST",
            body: {
                query: args.document,
                variables: args.variables ?? undefined, // <-- чтобы void/null не улетали странно
            },
        } satisfies FetchArgs,
        api,
        extraOptions
    );

    if (result.error) return { error: result.error };

    const data = result.data as { data?: unknown; errors?: unknown };

    if (data?.errors) {
        return { error: { status: "GRAPHQL_ERROR", data: data.errors } };
    }

    return { data: data?.data };
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: graphqlBaseQuery,
    tagTypes: ["Form", "Response"],
    endpoints: () => ({}),
});