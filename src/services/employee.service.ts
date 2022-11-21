import { UserRegisterDTO } from '@DTO/user/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { compare, generateToken, hash, verifyToken } from 'utils/crypt';
import { IUserService } from './interfaces';
import { ValueAlreadyInUse } from 'errors/ValueAlreadyInUse';
import { UserEditDTO } from '@DTO/user/user-edit.dto';
import { UserLoginResponseDTO } from '@DTO/user/user-login-response.dto';
import { config } from 'utils/config';
import { Unauthorized } from 'errors/Unauthorized';
import { UserLoginDTO } from '@DTO/user/user-login.dto';
import { IEmployeeService } from './interfaces/employee.interface';
import { EmployeeInfoEditDTO } from '@DTO/user/employee/info/employee.info-edit.dto';
import { EmployeeInfoModel } from '@Database/mongo/models/employee-info.model';

@injectable()
export class EmployeeService implements IEmployeeService {

    public async editInfo(employeeEditDTO: EmployeeInfoEditDTO): Promise<void> {
        const editInfo = await EmployeeInfoModel.findOne({userID: employeeEditDTO.userID})
        if (editInfo?._id) {
            await EmployeeInfoModel.updateOne({userID: employeeEditDTO.userID}, {
                firstname: employeeEditDTO.firstname,
                lastname: employeeEditDTO.lastname,
                experience: employeeEditDTO.experience,
                position: employeeEditDTO.position,
            });
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