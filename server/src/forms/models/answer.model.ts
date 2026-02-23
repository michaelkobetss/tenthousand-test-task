import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Answer {
    @Field()
    questionId!: string;

    // Для TEXT / DATE / MULTIPLE_CHOICE
    @Field({ nullable: true })
    value?: string;

    // Для CHECKBOX
    @Field(() => [String], { nullable: true })
    values?: string[];
}