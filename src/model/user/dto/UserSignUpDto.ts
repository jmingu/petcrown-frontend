import IUserSignUp from '@/model/user/interface/IUserSignUp';

export default class UserSignUp implements IUserSignUp {
  constructor(
    public email: string = '',
    public name: string = '',
    public nickname: string = '',
    public gender: string = '',
    public birthDate: string = '',
    public phoneNumber: string = '',
    public password: string = '',
    public confirmPassword: string = '',
    public profileImage: string = ''
  ) {}
}
