
import UserSignUpDto from "@/model/user/dto/UserSignUpDto";

export default class UserService {

  // 이메일 중복검사사
  async checkEmailDuplicate(email: string): Promise<boolean> {

		// !email =>  Falsy 값 false, 0, "", null, undefined, NaN 일때 true
    if (!email) {
			return false;
		}
		
    // API 연동
    console.log("이메일 중복 확인 요청:", email);
    return true; 
  }

  // 닉네임 중복 검사
  async checkNicknameDuplicate(nickname: string): Promise<boolean> {

		// !email =>  Falsy 값 false, 0, "", null, undefined, NaN 일때 true
    if (!nickname) {
			return false;
		}
		
    // API 연동
    console.log("닉네임임 중복 확인 요청:", nickname);
    return true; 
  }

}
