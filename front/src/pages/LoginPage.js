import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as Api from "../apis/api";

import UserStateContext from "../contexts/UserStateContext";
import DispatchContext from "../contexts/DispatchContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 사용자 정보를 담고 있는 전역 context를 dispatch로 사용합니다.
  const dispatch = useContext(DispatchContext);
  const userState = useContext(UserStateContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userState.user) {
      console.log(userState.user);
      navigate("/", { replace: true });
      return;
    }
  }, [userState.user, navigate]);

  const handleSubmit = async event => {
    event.preventDefault();

    const endpoint = "/user/login";

    try {
      const res = await Api.postData(
        {
          email,
          password,
        },
        endpoint
      );

      if (res.status === 200) {
        // 서버로부터 전달받은 사용자 정보에 있는 JWT 토큰 정보를 클라이언트측에서 사용하고자 합니다.
        const jwtToken = res.data.token;

        if (jwtToken) {
          // sessionStorage에 "userToken"이라는 이름으로 JWT 토큰을 저장합니다.
          sessionStorage.setItem("userToken", jwtToken);

          await fetchUserInfo();
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);

          // 로그인이 완료되면 마이페이지 경로로 이동합니다.
          navigate("/", { replace: true });
        }
      } else {
        alert("로그인을 시도하다가 오류가 발생했습니다. 입력하신 정보를 가진 회원이 없습니다.");
        console.log("로그인을 시도하다가 오류가 발생했습니다. 입력하신 정보를 가진 회원이 없습니다.");
      }
      // 백엔드에서 보내주는 응답이 정상적인 사용자 정보인지 (로그인 성공) 아니면 에러 메세지인지 (로그인 실패) 알 수 없으므로,
      // 응답에 jwtToken이 들어있는지 아닌지의 여부로 로그인 성공/실패를 판별합니다.

      // [TO-DO][REFACTOR] 처음부터 백엔드에서 data와 함께 성공/실패 여부를 (예를 들면 boolean 값으로) 객체에 담아 보내주고,
      //                   프론트엔드에서 그것을 캐치하는 것이 바람직합니다.
    } catch (err) {
      alert("로그인을 시도하다가 오류가 발생했습니다.", err);
      console.log("로그인을 시도하다가 오류가 발생했습니다.", err);
      return;
    }
  };

  /** 유저 정보를 받아오는 목업 API입니다.*/
  const fetchUserInfo = async () => {
    try {
      // 프론트엔드에서 보내주는 헤더에 있는 JWT 값으로 사용자를 판별합니다.
      const endpoint = "/user/mypage";
      const res = await Api.getData(endpoint);
      if (res.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data,
        });
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if (email && password) {
      setEmail(email);
      setPassword(password);
    }
  }, []);
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-[50%] h-[80%] bg-slate-100 rounded-xl items-center justify-center">
        <form className="flex flex-col h-[50%] items-center justify-evenly" onSubmit={handleSubmit}>
          <h1 className="font-bold text-xl">로그인을 해주세요!</h1>
          <div className="flex flex-row h-32">
            <div className="flex flex-col justify-evenly text-right mr-5">
              <p>이메일:</p>
              <p>비밀번호:</p>
            </div>
            <div className="flex flex-col justify-evenly">
              <input className="p-2 rounded-xl" type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} required></input>
              <input
                className="p-2 rounded-xl"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              ></input>
            </div>
          </div>
          <button className="bg-green-400 p-3 mx-5 rounded-xl">로그인</button>
        </form>
        <div className="flex flex-row w-full items-center justify-center">
          <span>소셜 로그인:</span>
          {/* API Key를 env 파일로 별도로 분리할 것 */}
          <a href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a270999471ec06e899cd039af9e316f0&redirect_uri=http://34.64.160.14:5002/user/auth/kakao">
            <img src="/images/kakao-oauth.png" alt="카카오계정 OAuth 로그인 버튼" className="w-8 h-8 mx-4"></img>
          </a>
        </div>
        <Link to="/register" className="font-bold mt-10 underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
