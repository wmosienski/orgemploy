import mongoose from 'mongoose';
import { EmployeeInfoDTO } from '@DTO/user/employee/info/employee.info.dto';
import { EmployeeInfoSchema } from '../schemas/employee-info.schema';

export const EmployeeInfoModel = mongoose.model<EmployeeInfoDTO & mongoose.Document>('EmployeeInfo', EmployeeInfoSchema);