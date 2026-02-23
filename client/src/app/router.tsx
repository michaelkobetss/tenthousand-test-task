import { createBrowserRouter } from "react-router-dom";
import { CreateFormPage } from "../pages/CreateFormPage/CreateFormPage.tsx";
import { HomePage } from "../pages/HomePage/HomePage";
import { FillFormPage } from "../pages/FillFormPage/FillFormPage";
import { FormResponsesPage } from "../pages/FormResponsesPage/FormResponsesPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/forms/new",
        element: <CreateFormPage />,
    },
    {
        path: "/forms/:id/fill",
        element: <FillFormPage />,
    },
    {
        path: "/forms/:id/responses",
        element: <FormResponsesPage />,
    },
]);