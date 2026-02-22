import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Form } from "./models/form.model";
import { CreateFormInput } from "./inputs/create-form.input";
import { randomUUID } from "crypto";

@Resolver(() => Form)
export class FormsResolver {
    private formsStore: Form[] = [];

    @Query(() => [Form])
    forms(): Form[] {
        return this.formsStore;
    }

    @Query(() => Form, { nullable: true })
    form(@Args("id") id: string): Form | undefined {
        return this.formsStore.find((f) => f.id === id);
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
                options: q.options,
            })),
        };

        this.formsStore.push(form);
        return form;
    }
}