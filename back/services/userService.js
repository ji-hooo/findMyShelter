import { UserModel } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
class UserService {
  /** 프로필 사진 업로드 */
  static async uploadProfile({ id, profile_image }) {
    const user = await UserModel.findById(id);
    return UserModel.update({
      _id: id,
      fieldToUpdate: "profile_image",
      newValue: profile_image,
    });
  }
  /** 신규 유저 생성 함수*/
  static async addUser({
    name,
    nickname,
    email,
    password,
    description,
    profile_image,
  }) {
    const user_email = await UserModel.findByEmail({ email });
    const user_nickname = await UserModel.findByNickname({ nickname });
    if (user_email) {
      const errorMessage =
        "해당 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요";
      return errorMessage;
    }

    if (user_nickname) {
      const errorMessage =
        "해당 닉네임은 현재 사용중입니다. 다른 닉네임을 입력해 주세요";
      return errorMessage;
    }
    // brypt를 활용한 패스워드 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      nickname,
      email,
      password: hashedPassword,
      description,
      profile_image,
    };

    const createdNewUser = await UserModel.create({ newUser });
    return createdNewUser;
  }
  /** 유저 로그인 함수*/
  static async getUser({ email, password }) {
    const user = await UserModel.findByEmail({ email });
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return errorMessage;
    }
    // bcrypt로 해쉬화하여 db에 저장된 패스워드와 입력된 패스워드의 비교(유효성 검증)
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return errorMessage;
    }
    // 입력 정보를 바탕으로 token 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      algorithm: process.env.JWT_ALG,
      expiresIn: process.env.JWT_EXP,
    });

    const id = user._id;
    const name = user.name;
    const nickname = user.nickname;
    const count_visit = user.count_visit;
    const profile_image = user.profile_image;

    const file_path = path.join(__dirname, profile_image);
    console.log("----------login file path----------");
    console.log(file_path);
    const loginUser = {
      token,
      id,
      name,
      nickname,
      count_visit,
      profile_image: file_path,
    };

    return loginUser;
  }

  /** 유저 마이페이지 함수*/
  static async detailUser({ id }) {
    const user = await UserModel.findById({ id });

    const name = user.name;
    const user_id = user._id;
    const nickname = user.nickname;
    const address = user.address;
    const count_visit = user.count_visit;
    const description = user.description;
    const profile_image = user.profile_image;
    const file_path = path.join(profile_image);
    const userInfo = {
      user_id,
      name,
      nickname,
      address,
      count_visit,
      description,
      profile_image: file_path,
    };

    return userInfo;
  }

  /** 유저 정보 수정*/
  static async setUser({ id, toUpdate }) {
    let user = await UserModel.findById(id);

    if (toUpdate.name) {
      const fieldToUpdate = "name";
      const newValue = toUpdate.name;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.nickname) {
      const fieldToUpdate = "nickname";
      const newValue = toUpdate.nickname;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.email) {
      const fieldToUpdate = "email";
      const newValue = toUpdate.email;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.password) {
      const fieldToUpdate = "password";
      const newValue = await bcrypt.hash(toUpdate.password, 10);
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.count_visit) {
      const fieldToUpdate = "count_visit";
      const newValue = toUpdate.count_visit;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.address) {
      const fieldToUpdate = "address";
      const newValue = toUpdate.address;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.description) {
      const fieldToUpdate = "description";
      const newValue = toUpdate.description;
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    if (toUpdate.profile_image) {
      const fieldToUpdate = "profile_image";
      const newValue = toUpdate.profile_image;
      console.log("이미지 수정");
      console.log(toUpdate.profile_image);
      user = await UserModel.update({ _id: id, fieldToUpdate, newValue });
    }

    return user;
  }

  /** 회원탈퇴 함수*/
  static async deleteUser({ id }) {
    const deletedUser = await UserModel.deleteById({ id });
    return deletedUser;
  }

  /** 소셜 로그인 함수*/
  static async getAuthUser({ email, nickname }) {
    const user = await UserModel.findByEmail({ email });
    const randomString = Math.random().toString(36).slice(2);
    if (!user) {
      const newUser = { nickname, email, password: randomString };

      await UserModel.create({ newUser });
    }
    const reSearchUser = await UserModel.findByEmail({ email });
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ user_id: reSearchUser._id }, secretKey, {
      algorithm: process.env.JWT_ALG,
      expiresIn: process.env.JWT_EXP,
    });

    const id = reSearchUser._id;
    const name = reSearchUser.name;
    const nick_name = reSearchUser.nickname;
    const count_visit = reSearchUser.count_visit;
    const profile_image = reSearchUser.profile_image;

    const loginUser = {
      token,
      id,
      name,
      nickname: nick_name,
      count_visit,
      profile_image,
    };

    return loginUser;
  }

  /**비밀번호 초기화 함수 */
  static async resetPassword({ email }) {
    const user = await UserModel.findByEmail({ email });
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return errorMessage;
    } else {
      // 랜덤문자열 생성 함수
      const randomString = Math.random().toString(36).slice(2);
      const fieldToUpdate = "email";
      user = await UserModel.update({ email, fieldToUpdate, randomString });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: "gmail email 추가 필요",
          pass: "gmail password 추가 필요",
        },
      });

      const emailOptions = {
        from: "gmail email 추가 필요",
        to: email,
        subject: "무한쉼터에서 임시 비밀번호를 발급해드립니다.",
        html:
          "<h1 >무한쉼터에서 임시 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " +
          randomString +
          "</h2>" +
          '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>',
      };
      transporter.sendMail(emailOptions.res);

      return user;
    }
  }
}

export default UserService;
