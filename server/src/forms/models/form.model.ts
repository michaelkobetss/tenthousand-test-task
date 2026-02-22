import { Field, ObjectType } from "@nestjs/graphql";
import { Question } from "./question.model";

@ObjectType()
export class Form {
    @Field()
    id!: string;

    @Field()
    title!: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => [Question])
    questions!: Question[];
}
