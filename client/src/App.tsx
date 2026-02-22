import { useGetFormsQuery, useCreateFormMutation } from "./features/forms/formsApi";

function App() {
    const { data, isLoading } = useGetFormsQuery();
    const [createForm, { isLoading: creating }] = useCreateFormMutation();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Forms</h1>

            <button
                disabled={creating}
                onClick={async () => {
                    await createForm({
                        title: "Test form",
                        description: "Created from UI"
                    });
                }}
            >
                Create Form
            </button>

            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default App;