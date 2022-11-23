import { EmployeeInfoEditDTO } from "@DTO/user/employee/info/employee.info-edit.dto";

export interface IEmployeeService {

    editInfo: (employeeInfoEditDTO: EmployeeInfoEditDTO) => Promise<void>;

}
