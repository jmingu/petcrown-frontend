import IUserSignUp from "@/model/user/interface/IUserSignUp";

export default class UserSignUp implements IUserSignUp{

  constructor(
    public id: number,
    public name: string,
    public email: string,
    public gender: string,
    public birthdate: string,
    public profileImageUrl: string
  ) {
  }
}
