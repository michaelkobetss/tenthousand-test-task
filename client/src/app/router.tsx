import { createBrowserRouter } from "react-router-dom";
import { CreateFormPage } from "../pages/CreateFormPage/CreateFormPage.tsx";
import { HomePage } from "../pages/HomePage/HomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/forms/new",
        element: <CreateFormPage />,
    },
]);