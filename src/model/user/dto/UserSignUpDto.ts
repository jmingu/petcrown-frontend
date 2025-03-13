import IUserSignUp from '@/model/user/interface/IUserSignUp';

export default class UserSignUp implements IUserSignUp {
  constructor(
    public emailId: string = '',
    public emailDomain: string = '',
    public name: string = '',
    public nickname: string = '',
    public gender: string = '',
    public birthDate: string = '',
    public phone1: string = '',
    public phone2: string = '',
    public phone3: string = '',
    public password: string = '',
    public confirmPassword: string = '',
    public profileImageUrl: string = '' // 기본 프로필 이미지 URL 추가 가능
  ) {}
}
