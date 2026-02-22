import { useGetFormsQuery } from "./features/api/api";

function App() {
    const { data, isLoading, error } = useGetFormsQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <div>
            <h1>Forms</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default App;