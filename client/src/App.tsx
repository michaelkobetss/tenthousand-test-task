import { useGetFormsQuery } from "./features/forms/formsApi";

function App() {
    const { data, isLoading, error } = useGetFormsQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <div>
            <h1>Forms</h1>
            <ul>
                {data?.map((form) => (
                    <li key={form.id}>
                        <strong>{form.title}</strong>
                        <div>{form.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;