import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    QuestionType,
    useGetFormQuery,
    useSubmitResponseMutation,
} from "../../shared/graphql/generated";
import type { AnswerInput, GetFormQuery } from "../../shared/graphql/generated";
import styles from "./FillFormPage.module.css";

export function FillFormPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    if (!id) throw new Error("Route param id is required");
    const formId: string = id;

    const { data, isLoading, isError } = useGetFormQuery({ id: formId });
    const form: GetFormQuery["form"] = data?.form ?? null;

    const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();

    const [textValues, setTextValues] = useState<Record<string, string>>({});
    const [radioValues, setRadioValues] = useState<Record<string, string>>({});
    const [checkboxValues, setCheckboxValues] = useState<Record<string, string[]>>({});
    const [dateValues, setDateValues] = useState<Record<string, string>>({});

    const answers = useMemo((): AnswerInput[] => {
        if (!form) return [];

        return form.questions.map((q) => {
            if (q.type === QuestionType.Checkbox) {
                return { questionId: q.id, values: checkboxValues[q.id] ?? [] };
            }
            if (q.type === QuestionType.MultipleChoice) {
                return { questionId: q.id, value: radioValues[q.id] ?? "" };
            }
            if (q.type === QuestionType.Date) {
                return { questionId: q.id, value: dateValues[q.id] ?? "" };
            }
            return { questionId: q.id, value: textValues[q.id] ?? "" };
        });
    }, [form, checkboxValues, radioValues, dateValues, textValues]);

    async function onSubmit() {
        await submitResponse({ formId, answers }).unwrap();
        alert("Form submitted successfully!");
    }

    if (isLoading) return <div className={styles.page}>Loading...</div>;
    if (isError || !form) return <div className={styles.page}>Failed to load form</div>;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link className={styles.link} to="/">← Back</Link>
                <Link className={styles.link} to={`/forms/${formId}/responses`}>View responses</Link>
            </div>

            <h1 className={styles.title}>{form.title}</h1>
            {form.description && <div className={styles.description}>{form.description}</div>}

            <div className={styles.questions}>
                {form.questions.map((q) => {
                    const options: string[] = (q.options ?? []) as string[];

                    return (
                        <div key={q.id} className={styles.card}>
                            <div className={styles.qTitle}>{q.title}</div>

                            {q.type === QuestionType.Text && (
                                <input
                                    className={styles.input}
                                    value={textValues[q.id] ?? ""}
                                    onChange={(e) =>
                                        setTextValues((p) => ({ ...p, [q.id]: e.target.value }))
                                    }
                                    placeholder="Your answer"
                                />
                            )}

                            {q.type === QuestionType.Date && (
                                <input
                                    className={styles.input}
                                    type="date"
                                    value={dateValues[q.id] ?? ""}
                                    onChange={(e) =>
                                        setDateValues((p) => ({ ...p, [q.id]: e.target.value }))
                                    }
                                />
                            )}

                            {q.type === QuestionType.MultipleChoice && (
                                <div className={styles.options}>
                                    {options.map((opt, idx) => (
                                        <label key={idx} className={styles.optionRow}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                checked={(radioValues[q.id] ?? "") === opt}
                                                onChange={() =>
                                                    setRadioValues((p) => ({ ...p, [q.id]: opt }))
                                                }
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {q.type === QuestionType.Checkbox && (
                                <div className={styles.options}>
                                    {options.map((opt, idx) => {
                                        const current = checkboxValues[q.id] ?? [];
                                        const checked = current.includes(opt);

                                        return (
                                            <label key={idx} className={styles.optionRow}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => {
                                                        const next = checked
                                                            ? current.filter((v) => v !== opt)
                                                            : [...current, opt];
                                                        setCheckboxValues((p) => ({ ...p, [q.id]: next }));
                                                    }}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button className={styles.submit} type="button" onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
}