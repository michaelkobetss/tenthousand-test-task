import { Field, InputType } from "@nestjs/graphql";
import { QuestionType } from "../question-type.enum";

@InputType()
export class QuestionInput {
    @Field()
    title!: string;

    @Field(() => QuestionType)
    type!: QuestionType;

    @Field(() => [String], { nullable: true })
    options?: string[];
}