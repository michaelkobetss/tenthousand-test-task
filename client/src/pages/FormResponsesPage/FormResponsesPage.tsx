import { Link, useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../../shared/graphql/generated";
import type { GetFormQuery, GetResponsesQuery } from "../../shared/graphql/generated";
import styles from "./FormResponsesPage.module.css";

export function FormResponsesPage() {
    const { id } = useParams<{ id: string }>();
    if (!id) throw new Error("Route param id is required");

    const { data: formData } = useGetFormQuery({ id });
    const form: GetFormQuery["form"] = formData?.form ?? null;

    const { data, isLoading, isError } = useGetResponsesQuery({ formId: id });
    const responses: GetResponsesQuery["responses"] = data?.responses ?? [];

    if (isLoading) return <div className={styles.page}>Loading...</div>;
    if (isError) return <div className={styles.page}>Failed to load responses</div>;

    const questionTitleById = new Map(form?.questions.map((q) => [q.id, q.title]));

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link className={styles.link} to="/">← Back</Link>
                <Link className={styles.link} to={`/forms/${id}/fill`}>Open form</Link>
            </div>

            <h1 className={styles.title}>Responses</h1>

            {responses.length === 0 && <div className={styles.info}>No responses yet.</div>}

            <div className={styles.list}>
                {responses.map((r, idx) => (
                    <div key={r.id} className={styles.card}>
                        <div className={styles.cardTitle}>Response #{idx + 1}</div>

                        <div className={styles.answers}>
                            {r.answers.map((a, aIdx) => {
                                const qTitle = questionTitleById.get(a.questionId) ?? a.questionId;

                                const value = a.values?.length
                                    ? a.values.join(", ")
                                    : (a.value ?? "");

                                return (
                                    <div key={aIdx} className={styles.answerRow}>
                                        <div className={styles.q}>{qTitle}</div>
                                        <div className={styles.a}>
                                            {value || <span className={styles.muted}>(empty)</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}