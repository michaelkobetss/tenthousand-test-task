import { api } from "../api/api";
import type { CreateFormInput } from "../../../../shared/types/form";

/* ================= TYPES ================= */

export interface Form {
    id: string;
    title: string;
    description?: string;
}

interface GetFormsResponse {
    data: {
        forms: Form[];
    };
}

interface CreateFormResponse {
    data: {
        createForm: Form;
    };
}

/* ================= API ================= */

export const formsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        /* -------- GET FORMS -------- */

        getForms: builder.query<Form[], void>({
            query: () => ({
                url: "",
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
            transformResponse: (response: GetFormsResponse) => response.data.forms,
        }),

        /* -------- CREATE FORM -------- */

        createForm: builder.mutation<Form, CreateFormInput>({
            query: (input) => ({
                url: "",
                method: "POST",
                body: {
                    query: `
                        mutation CreateForm($input: CreateFormInput!) {
                            createForm(input: $input) {
                                id
                                title
                                description
                            }
                        }
                    `,
                    variables: { input },
                },
            }),
            transformResponse: (response: CreateFormResponse) =>
                response.data.createForm,

            /* optimistic cache update */
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(
                        formsApi.util.updateQueryData(
                            "getForms",
                            undefined,
                            (draft) => {
                                draft.push(data);
                            }
                        )
                    );
                } catch {
                    // ignore
                }
            },
        }),
    }),
});

/* ================= HOOKS ================= */

export const { useGetFormsQuery, useCreateFormMutation } = formsApi;