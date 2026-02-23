import { nanoid } from "@reduxjs/toolkit";
import { QuestionType } from "../../../../shared/types/form";
import type { QuestionDraft } from "../../../../shared/types/form";
import styles from "./QuestionEditor.module.css";

/* ================= PROPS ================= */

interface Props {
    questions: QuestionDraft[];
    onChange: (questions: QuestionDraft[]) => void;
}

/* ================= COMPONENT ================= */

export function QuestionEditor({ questions, onChange }: Props) {

    function addQuestion(type: QuestionDraft["type"]) {
        onChange([
            ...questions,
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
        onChange(
            questions.map((q: QuestionDraft) =>
                q.id === id ? { ...q, ...patch } : q
            )
        );
    }

    return (
        <div className={styles.editor}>
            <h3>Questions</h3>

            {questions.map((q: QuestionDraft) => (
                <div key={q.id} className={styles.card}>
                    <input
                        placeholder="Question title"
                        value={q.title}
                        onChange={(e) =>
                            updateQuestion(q.id, { title: e.target.value })
                        }
                    />

                    {(q.type === QuestionType.CHECKBOX ||
                            q.type === QuestionType.MULTIPLE_CHOICE) &&
                        q.options?.map((opt: string, i: number) => (
                            <input
                                key={i}
                                placeholder={`Option ${i + 1}`}
                                value={opt}
                                onChange={(e) => {
                                    const options = [...q.options!];
                                    options[i] = e.target.value;
                                    updateQuestion(q.id, { options });
                                }}
                            />
                        ))}

                    {(q.type === QuestionType.CHECKBOX ||
                        q.type === QuestionType.MULTIPLE_CHOICE) && (
                        <button
                            type="button"
                            onClick={() =>
                                updateQuestion(q.id, {
                                    options: [...(q.options ?? []), ""],
                                })
                            }
                        >
                            + option
                        </button>
                    )}
                </div>
            ))}

            <div className={styles.actions}>
                <button onClick={() => addQuestion(QuestionType.TEXT)}>Text</button>
                <button onClick={() => addQuestion(QuestionType.DATE)}>Date</button>
                <button onClick={() => addQuestion(QuestionType.CHECKBOX)}>Checkbox</button>
                <button onClick={() => addQuestion(QuestionType.MULTIPLE_CHOICE)}>
                    Multiple
                </button>
            </div>
        </div>
    );
}