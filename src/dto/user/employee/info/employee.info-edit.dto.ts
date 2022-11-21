import { employeePositions } from "@DTO/helpers/employee-positions";
import { Length, IsString, IsIn, IsInt, Min } from "class-validator";

export class EmployeeInfoEditDTO {
    userID: string;

    @IsString()
    @Length(0, 30)
    firstname: string;

    @IsString()
    @Length(0, 30)
    lastname: string;

    @IsInt()
    @Min(0)
    experience: number;

    @IsString()
    @IsIn(employeePositions)
    position: string;
}
