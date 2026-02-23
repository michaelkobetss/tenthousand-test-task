// client/src/shared/types/form.ts

export const QuestionType = {
    TEXT: "TEXT",
    MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
    CHECKBOX: "CHECKBOX",
    DATE: "DATE",
} as const;

export type QuestionType =
    typeof QuestionType[keyof typeof QuestionType];

export interface QuestionDraft {
    id: string;
    title: string;
    type: QuestionType;
    options?: string[];
}

export interface CreateFormInput {
    title: string;
    description?: string;
    questions: {
        title: string;
        type: QuestionType;
        options?: string[];
    }[];
}