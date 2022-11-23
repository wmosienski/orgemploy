import { injectable } from 'inversify';
import 'reflect-metadata';
import { IEmployeeService } from './interfaces/employee.interface';
import { EmployeeInfoEditDTO } from '@DTO/user/employee/info/employee.info-edit.dto';
import { EmployeeInfoModel } from '@Database/mongo/models/employee-info.model';
import { SomethingWentWrong } from 'errors/SomethingWentWrong';

@injectable()
export class EmployeeService implements IEmployeeService {

    public async editInfo(employeeEditDTO: EmployeeInfoEditDTO): Promise<void> {
        const editInfo = await EmployeeInfoModel.findOne({userID: employeeEditDTO.userID})
        if (editInfo?._id) {
            const updateResult = await EmployeeInfoModel.updateOne({userID: employeeEditDTO.userID}, {
                firstname: employeeEditDTO.firstname,
                lastname: employeeEditDTO.lastname,
                experience: employeeEditDTO.experience,
                position: employeeEditDTO.position,
            });

            if (updateResult?.modifiedCount !== 1 && updateResult?.modifiedCount !== 0) {
                throw new SomethingWentWrong(JSON.stringify(updateResult));
            }
        }
        else {
            await EmployeeInfoModel.insertMany([{
                userID: employeeEditDTO.userID, 
                firstname: employeeEditDTO.firstname,
                lastname: employeeEditDTO.lastname,
                experience: employeeEditDTO.experience,
                position: employeeEditDTO.position,
            }]);
        }
    }

}