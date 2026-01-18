import type { Request, Response } from "express";
import type { UserRegister } from "../../../application/User/usecases/UserRegister";

export default class RegisterController {
  constructor(private useCase: UserRegister) {};

  register(req: Request, res: Response) {
    this.useCase.execute()
  }
}