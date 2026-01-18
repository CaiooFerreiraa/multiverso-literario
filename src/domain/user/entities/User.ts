export class User {
  constructor(
    public fullName: String,
    public birthday: Date,
    public email: String,
    public phoneNumber: String,
    public city: String,
    public password: String
  ) {
    if (!email.includes("@")) throw new Error("Email inválido");
  }
}