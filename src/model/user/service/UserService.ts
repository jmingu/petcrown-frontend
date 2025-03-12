
import UserSignUpDto from "@/model/user/dto/UserSignUpDto";

export default class UserService {

  async checkEmailDuplicate(email: string): Promise<boolean> {

		// !email =>  Falsy 값 false, 0, "", null, undefined, NaN 일때 true
    if (!email) {
			return false;
		}
		
    // API 연동
    console.log("이메일 중복 확인 요청:", email);
    return true; 
  }

}
