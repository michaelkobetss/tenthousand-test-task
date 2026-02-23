import { useState } from "react";
import { QuestionEditor } from "../../Components/QuestionEditor/QuestionEditor";
import type { QuestionDraft } from "../../../../shared/types/form";
import styles from "./CreateFormPage.module.css";

export function CreateFormPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<QuestionDraft[]>([]);

    function handleSubmit() {
        if (!title.trim()) {
            alert("Title required");
            return;
        }

        // Stage 3 — тільки перевіряємо UI
        console.log({
            title,
            description,
            questions,
        });
    }

    return (
        <div className={styles.page}>
            <h1>Create form</h1>

            <input
                className={styles.input}
                placeholder="Form title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className={styles.textarea}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <QuestionEditor
                questions={questions}
                onChange={setQuestions}
            />

            <button
                className={styles.submit}
                onClick={handleSubmit}
            >
                Save form
            </button>
        </div>
    );
}