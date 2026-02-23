import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AnswerInput {
    @Field()
    questionId!: string;

    @Field({ nullable: true })
    value?: string;

    @Field(() => [String], { nullable: true })
    values?: string[];
}