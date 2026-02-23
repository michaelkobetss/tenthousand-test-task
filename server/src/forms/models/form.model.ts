import { Field, ObjectType, ID } from "@nestjs/graphql";
import { Question } from "./question.model";

@ObjectType()
export class Form {
    @Field(() => ID)
    id!: string;

    @Field()
    title!: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [Question])
    questions!: Question[];
}