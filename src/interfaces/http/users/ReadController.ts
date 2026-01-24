import type { Request, Response } from "express";
import { UserRead } from "../../../application/users/usecases/UserRead";
import { ReadUserDTO, ReadUserSchema } from "../../../application/users/dtos/ReadUserDTO";

export class ReadController {
  constructor(private useCase: UserRead){}

  execute = async (req: Request, res: Response) => {
    try {
      const useData: ReadUserDTO = ReadUserSchema.parse(req.body);
      const user = await this.useCase.execute(useData)
      res.status(200).json(user)
    } catch (error) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(404).json(error);
    }    
  }
}