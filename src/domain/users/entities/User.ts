import { CreateUserDTO } from "../../../application/users/dtos/CreateUserDTO"

export class User {
  public fullName: string;
  public birthday: Date;
  public email: string;
  public phoneNumber: string;
  public city: string;
  public password: string;
  public image?: string;

  constructor(data: any) {
    this.fullName = data.fullname;
    this.birthday = data.birthday;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.city = data.city;
    this.password = data.password;
    this.image = data.image;
  }
}