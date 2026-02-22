import { Module } from "@nestjs/common";
import { FormsResolver } from "./forms.resolver";

@Module({
    providers: [FormsResolver],
})
export class FormsModule {}