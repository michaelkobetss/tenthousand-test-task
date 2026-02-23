import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { Form } from "./models/form.model";
import { CreateFormInput } from "./inputs/create-form.input";
import { randomUUID } from "crypto";
import { Response } from "./models/response.model";
import { AnswerInput } from "./models/answer.input";
import { QuestionType } from "./question-type.enum";

@Resolver(() => Form)
export class FormsResolver {
    private formsStore: Form[] = [];
    private responsesStore: Response[] = [];

    @Query(() => [Form])
    forms(): Form[] {
        return this.formsStore;
    }

    @Query(() => Form, { nullable: true })
    form(@Args("id", { type: () => ID }) id: string): Form | undefined {
        return this.formsStore.find((f) => f.id === id);
    }

    @Query(() => [Response])
    responses(@Args("formId", { type: () => ID }) formId: string): Response[] {
        return this.responsesStore.filter((r) => r.formId === formId);
    }

    @Mutation(() => Form)
    createForm(@Args("input") input: CreateFormInput): Form {
        const form: Form = {
            id: randomUUID(),
            title: input.title,
            description: input.description,
            questions: input.questions.map((q) => ({
                id: randomUUID(),
                title: q.title,
                type: q.type,
                options:
                    q.type === QuestionType.TEXT || q.type === QuestionType.DATE
                        ? undefined
                        : q.options ?? [],
            })),
        };

        this.formsStore.push(form);
        return form;
    }

    @Mutation(() => Response)
    submitResponse(
        @Args("formId", { type: () => ID }) formId: string,
        @Args("answers", { type: () => [AnswerInput] }) answers: AnswerInput[]
    ): Response {
        const form = this.formsStore.find((f) => f.id === formId);
        if (!form) {
            throw new Error("Form not found");
        }

        // Минимальная нормализация по типам вопросов
        const normalizedAnswers = answers.map((a) => {
            const q = form.questions.find((qq) => qq.id === a.questionId);

            if (q?.type === QuestionType.CHECKBOX) {
                return {
                    questionId: a.questionId,
                    values: a.values ?? [],
                    value: undefined,
                };
            }

            return {
                questionId: a.questionId,
                value: a.value ?? "",
                values: undefined,
            };
        });

        const response: Response = {
            id: randomUUID(),
            formId,
            answers: normalizedAnswers,
        };

        this.responsesStore.push(response);
        return response;
    }
}