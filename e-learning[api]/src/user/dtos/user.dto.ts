import { Exclude, Transform } from "class-transformer";
import { roles } from "../../common/enum/roles.enum";

export class RequestGetMeBodyDto {
  //! Not implemented
}

export class ResponseUserDto {
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  firstname: string;
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  lastname: string;
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  phone: string;
  @Exclude()
  password: string;
  role: roles;
}
