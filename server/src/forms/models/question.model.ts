import { Field, ObjectType } from "@nestjs/graphql";
import { QuestionType } from "../question-type.enum";

@ObjectType()
export class Question {
    @Field()
    id!: string;

    @Field()
    title!: string;

    @Field(() => QuestionType)
    type!: QuestionType;

    @Field(() => [String], { nullable: true })
    options?: string[];
}