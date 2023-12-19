import UserService from "../services/userService";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

class UserController {
  static async uploadProfile(req, res) {
    try {
      const id = req.currentUserId;
      const image = req.file.path;
      if (!image) {
        throw new Error("이미지가 존재하지 않습니다.");
      }
      const uploadProfile = await UserService.uploadProfile({ id, profile_image: image });
      console.log(uploadProfile);
      res.status(200).send(uploadProfile);
    } catch (error) {
      next(error);
    }
  }
  /**회원가입 */
  static async addUser(req, res, next) {
    try {
      const { name, nickname, email, password, description, profile_image } = req.body
  
      // req.body가 빈 객체일 경우, 에러 반환
      if (req.body === {}) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        )
      }
  
      const newUser = await UserService.addUser({
        name,
        nickname,
        email,
        password,
        description,
        profile_image
      })
  
      if (newUser.errorMessage) {
        throw new Error(newUser.errorMessage)
      }
  
      res.status(200).send(newUser)
    } catch (error) {
      next(error)
    }
  }
  /**로그인 */
  static async getUser(req, res, next) {
    try {
      const { email, password } = req.body
  
      const user = await UserService.getUser({ email, password })
  
      if (user.errorMessage) {
        throw new Error(user.errorMessage);
      }
  
      res.status(200).send(user)
  
    } catch (error) {
      next(error)
    }
  }

  /**마이페이지 */
  static async detailUser(req, res, next) {
    try {
      const id = req.currentUserId
      const user = await UserService.detailUser({ id })
  
      res.status(200).send(user)
    } catch (error) {
      next(error)
    }
  }

  /**유저 정보 수정 */
  static async setUser(req, res, next) {
    try {
      // const profile_image_file = req.file.path;
      const id = req.currentUserId;
      const user = await UserService.detailUser({id})
      const profile_image_file = req.file ? req.file.path : user?.profile_image;
      // URI로부터 사용자 id를 추출함.
      // const { name, nickname, email, password, address, count_visit, description } = req.body;
      // const toUpdate = { name, nickname, email, password, address, count_visit, description, profile_image : profile_image_file };
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const {...props } =req.body;
      const toUpdate = { ...props, profile_image: profile_image_file };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await UserService.setUser({ id, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      res.status(200).send('유저 정보가 수정되었습니다.');
    } catch (error) {
      next(error);
    }
  }

  /**회원탈퇴 */
  static async deleteUser(req, res, next) {
    try {
      const user_id = req.currentUserId;
      await UserService.deleteUser({ id: user_id })
  
      res.status(200).send('회원탈퇴가 완료되었습니다.')
    } catch (error) {
      next(error)
    }
  }
  /** 소셜로그인(카카오) */
  static async kakaoLogin(req, res, next) {
    const code = req.query.code
    try {
      const accessTokenGet = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_RESTAPIKEY,
          code,
          redirect_uri: 'http://34.64.160.14:5002/user/auth/kakao'
        }
      })

      const getKakaoUserInfo = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer ' + accessTokenGet.data.access_token
        }
      })

      const kakaoUserInfo = getKakaoUserInfo.data
      const user = await UserService.getAuthUser({ 
        email: kakaoUserInfo.kakao_account.email, 
        nickname: kakaoUserInfo.kakao_account.profile.nickname, 
      })

      res.status(200).send(user)
    } catch (error) {
      next(error)
    }
  }

  /**비밀번호 찾기 */
  static async resetPassword (req, res, next) {
    try {
      const { email } = req.body
      await UserService.resetPassword({ email })
      
      res.status(200).send('입력하신 이메일로 임시 비밀번호가 발송되었습니다.')
    } catch (error) {
      next(error)
    }
  }
}

export default UserController;
