import { UseRepository } from "../../../domain/user/repositories/UserRepository";
import { ReadUserDTO } from "../dtos/ReadUserDTO";

export class UserRead {
  constructor(private useRepo: UseRepository) {}

  async execute(data: ReadUserDTO) {
    const { email } = data;
    return await this.useRepo.read(email)
  }
}