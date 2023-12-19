import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as Api from "../apis/api";

import UserStateContext from "../contexts/UserStateContext";
import DispatchContext from "../contexts/DispatchContext";

function RegisterPage() {

  // 사용자 정보를 담고 있는 전역 context를 dispatch로 사용합니다.
  const dispatch = useContext(UserStateContext);
  const userState = useContext(UserStateContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userState.user) {
      alert("이미 로그인이 된 상태입니다. 회원가입을 진행하시려면 로그아웃을 먼저 해주세요.");
      navigate("/", { replace: true });
      return;
    }
  }, [userState.user, navigate]);


  const handleSubmit = async (event) => {
    
    event.preventDefault();

    const endpoint = '/user';

    const params = '/register';

    try {
      const res = await Api.postData({
        "name": event.target.name.value,
        "nickname": event.target.nickname.value,
        "email": event.target.email.value,
        "password": event.target.password.value,
        "description": "내용을 입력해주세요",
        "profile_image": null,
        "count_visit": 0,
      }, endpoint, params);

      if(event.target.password.value !== event.target.password_confirm.value){
        alert("입력하신 비밀번호 확인값이 일치하지 않습니다.");
        navigate("/register", { replace: true });
      }

      if(res.status == 200){
        alert("회원 가입이 성공적으로 처리되었습니다.");
        console.log("회원 가입 성공: ", res.data.email);  
        navigate("/login", { replace: true });
      }

      if(res.errorMessage){
        alert("사용자 계정을 만드는 도중 오류가 발생했습니다.");
        console.log("사용자 계정을 만드는 도중 오류가 발생했습니다.", res.errorMessage);
        navigate("/register", { replace: true });
      }
      
    } catch (err) {
      alert("사용자 계정을 만드는 도중 오류가 발생했습니다.", err);
      console.log("사용자 계정을 만드는 도중 오류가 발생했습니다.", err);
      navigate("/register", { replace: true });
      return;
    }
  };

  // [TO-DO] 비밀번호 확인 입력값이 비밀번호와 동일한지 검증하는 로직을 작성해야 합니다.

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-[50%] h-[80%] bg-slate-100 rounded-xl items-center justify-center">
        <form className="flex flex-col h-[70%] items-center justify-evenly" onSubmit={handleSubmit}>
          <h1 className="font-bold text-xl">회원가입</h1>
          <div className="flex flex-row h-full">
            <div className="flex flex-col h-full justify-evenly text-right mr-5">
              <p>이름:</p>
              <p>별명:</p>
              <p>이메일:</p>
              <p>비밀번호:</p>
              <p>비밀번호 확인:</p>
            </div>
            <div className="flex flex-col h-full justify-evenly">
              <input className="p-1 px-2 rounded-xl" type="text" id="name" required></input>
              <input className="p-1 px-2 rounded-xl" type="text" id="nickname" required></input>
              <input className="p-1 px-2 rounded-xl" type="text" id="email" required></input>
              <input className="p-1 px-2 rounded-xl" type="password" id="password" required></input>
              <input className="p-1 px-2 rounded-xl" type="password" id="password_confirm" required></input>
            </div>
          </div>
          <button className="bg-green-400 p-3 rounded-xl">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
