import { Link } from "react-router-dom";
import { useGetFormsQuery } from "../../features/forms/formsApi";
import styles from "./HomePage.module.css";

export function HomePage() {
    const { data: forms, isLoading, isError, refetch } = useGetFormsQuery();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Forms</h1>

                <div className={styles.actions}>
                    <button className={styles.secondaryButton} type="button" onClick={() => refetch()}>
                        Refresh
                    </button>

                    <Link className={styles.primaryButton} to="/forms/new">
                        Create New Form
                    </Link>
                </div>
            </div>

            {isLoading && <div className={styles.info}>Loading...</div>}
            {isError && <div className={styles.error}>Failed to load forms</div>}

            {!isLoading && !isError && (forms?.length ?? 0) === 0 && (
                <div className={styles.info}>
                    No forms yet. Click <b>Create New Form</b>.
                </div>
            )}

            <div className={styles.list}>
                {forms?.map((f) => (
                    <div key={f.id} className={styles.card}>
                        <div className={styles.cardTitle}>{f.title}</div>

                        {f.description ? (
                            <div className={styles.cardDescription}>{f.description}</div>
                        ) : (
                            <div className={styles.cardDescriptionMuted}>No description</div>
                        )}

                        <div className={styles.cardLinks}>
                            <Link className={styles.link} to={`/forms/${f.id}/fill`}>
                                View form
                            </Link>
                            <Link className={styles.link} to={`/forms/${f.id}/responses`}>
                                View responses
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}