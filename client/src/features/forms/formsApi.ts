import {api} from "../api/api.ts";

export interface Form {
    id: string;
    title: string;
    description?: string;
}

interface FormsResponse {
    data: {
        forms: Form[];
    };
}

export const formsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getForms: builder.query<Form[], void>({
            query: () => ({
                url: "/graphql",
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
            transformResponse: (response: FormsResponse) => response.data.forms,
        }),
    }),
});

export const {useGetFormsQuery} = formsApi;