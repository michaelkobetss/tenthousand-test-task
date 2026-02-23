import { api } from "../api/api";

/* ================= TYPES ================= */

export interface Form {
    id: string;
    title: string;
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

export interface CreateFormArgs {
    title: string;
    description?: string;
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
            transformResponse: (response: GetFormsResponse) =>
                response.data.forms,
        }),

        /* -------- CREATE FORM -------- */

        createForm: builder.mutation<Form, CreateFormArgs>({
            query: ({ title, description }) => ({
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
                    variables: {
                        input: {
                            title,
                            description,
                            questions: []
                        }
                    },
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

export const {
    useGetFormsQuery,
    useCreateFormMutation,
} = formsApi;