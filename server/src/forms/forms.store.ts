import { Form } from "./models/form.model";
import { QuestionType } from "./question-type.enum";

export const formsStore: Form[] = [
    {
        id: "1",
        title: "Feedback Form",
        description: "Simple feedback form",
        questions: [
            {
                id: "q1",
                title: "Your name",
                type: QuestionType.TEXT,
            },
            {
                id: "q2",
                title: "Rate our product",
                type: QuestionType.MULTIPLE_CHOICE,
                options: ["Good", "Average", "Bad"],
            },
        ],
    },
];