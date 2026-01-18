import type { Request, Response } from "express";
import type { UserRegister } from "../../../application/User/usecases/UserRegister";
import { CreateUserDTO, CreateUserSchema } from "../../../application/User/dtos/CreateUserDTO";

export class RegisterController {
  constructor(private useCase: UserRegister) {};

  async register(req: Request, res: Response) {
    try {
      const useData: CreateUserDTO = CreateUserSchema.parse(req.body);
      const { password, ...user } = await this.useCase.execute(useData)
      res.status(200).json(user);
    } catch (error: unknown) {
      error = error instanceof Error ? error.message : String(error)
      console.log(error)
      res.status(400).json(error)
    }
  }
}