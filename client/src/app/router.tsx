// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { CreateFormPage } from "../pages/CreateFormPage/CreateFormPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/forms/new",
        element: <CreateFormPage />
    }
]);