import { useMemo, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useCreateFormMutation } from "../../features/forms/formsApi";
import { QuestionType } from "../../../../shared/types/form";
import type { QuestionDraft, CreateFormInput } from "../../../../shared/types/form";
import styles from "./CreateFormPage.module.css";

export function CreateFormPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<QuestionDraft[]>([]);

    const [createForm, { isLoading }] = useCreateFormMutation();

    function addQuestion(type: QuestionDraft["type"]) {
        setQuestions((prev) => [
            ...prev,
            {
                id: nanoid(),
                title: "",
                type,
                options:
                    type === QuestionType.TEXT || type === QuestionType.DATE
                        ? undefined
                        : [""],
            },
        ]);
    }

    function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    }

    function removeQuestion(id: string) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    }

    const canSubmit = useMemo(() => {
        if (!title.trim()) return false;
        // простая валидация: если есть вопросы — у них должен быть title
        if (questions.some((q) => !q.title.trim())) return false;
        // если тип с опциями — хотя бы 1 непустая опция
        if (
            questions.some(
                (q) =>
                    (q.type === QuestionType.CHECKBOX || q.type === QuestionType.MULTIPLE_CHOICE) &&
                    (!q.options?.length || q.options.every((o) => !o.trim()))
            )
        ) {
            return false;
        }
        return true;
    }, [title, questions]);

    async function handleSubmit() {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        const input: CreateFormInput = {
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            questions: questions.map((q) => ({
                title: q.title.trim(),
                type: q.type,
                options:
                    q.type === QuestionType.TEXT || q.type === QuestionType.DATE
                        ? undefined
                        : (q.options ?? []).map((o) => o.trim()).filter(Boolean),
            })),
        };

        await createForm(input).unwrap();

        alert("Form created");
        setTitle("");
        setDescription("");
        setQuestions([]);
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

            <hr />

            <div className={styles.toolbar}>
                <button className={styles.smallButton} type="button" onClick={() => addQuestion(QuestionType.TEXT)}>
                    Text
                </button>
                <button className={styles.smallButton} type="button" onClick={() => addQuestion(QuestionType.DATE)}>
                    Date
                </button>
                <button className={styles.smallButton} type="button" onClick={() => addQuestion(QuestionType.CHECKBOX)}>
                    Checkbox
                </button>
                <button
                    className={styles.smallButton}
                    type="button"
                    onClick={() => addQuestion(QuestionType.MULTIPLE_CHOICE)}
                >
                    Multiple
                </button>
            </div>

            <div className={styles.questions}>
                {questions.map((q, index) => (
                    <div key={q.id} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                            <div className={styles.questionIndex}>Q{index + 1}</div>

                            <button
                                className={styles.dangerButton}
                                type="button"
                                onClick={() => removeQuestion(q.id)}
                                aria-label="Remove question"
                                title="Remove question"
                            >
                                Remove
                            </button>
                        </div>

                        <input
                            className={styles.input}
                            placeholder="Question title"
                            value={q.title}
                            onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                        />

                        {/* Preview/Editor by type */}
                        {(q.type === QuestionType.TEXT) && (
                            <div className={styles.preview}>
                                <input className={styles.input} placeholder="User will type text here" disabled />
                            </div>
                        )}

                        {(q.type === QuestionType.DATE) && (
                            <div className={styles.preview}>
                                <input className={styles.input} type="date" disabled />
                            </div>
                        )}

                        {(q.type === QuestionType.MULTIPLE_CHOICE) && (
                            <div className={styles.preview}>
                                {(q.options ?? []).map((opt, i) => (
                                    <label key={i} className={styles.optionRow}>
                                        <input type="radio" disabled />
                                        <input
                                            className={styles.optionInput}
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const options = [...(q.options ?? [])];
                                                options[i] = e.target.value;
                                                updateQuestion(q.id, { options });
                                            }}
                                        />
                                    </label>
                                ))}

                                <button
                                    className={styles.smallButton}
                                    type="button"
                                    onClick={() =>
                                        updateQuestion(q.id, { options: [...(q.options ?? []), ""] })
                                    }
                                >
                                    + option
                                </button>
                            </div>
                        )}

                        {(q.type === QuestionType.CHECKBOX) && (
                            <div className={styles.preview}>
                                {(q.options ?? []).map((opt, i) => (
                                    <label key={i} className={styles.optionRow}>
                                        <input type="checkbox" disabled />
                                        <input
                                            className={styles.optionInput}
                                            placeholder={`Option ${i + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const options = [...(q.options ?? [])];
                                                options[i] = e.target.value;
                                                updateQuestion(q.id, { options });
                                            }}
                                        />
                                    </label>
                                ))}

                                <button
                                    className={styles.smallButton}
                                    type="button"
                                    onClick={() =>
                                        updateQuestion(q.id, { options: [...(q.options ?? []), ""] })
                                    }
                                >
                                    + option
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={styles.submit}
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !canSubmit}
                title={!canSubmit ? "Fill title and questions first" : undefined}
            >
                {isLoading ? "Saving..." : "Save form"}
            </button>
        </div>
    );
}