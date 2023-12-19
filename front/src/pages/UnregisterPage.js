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
    if (!userState.user) {
      navigate("/", { replace: true });
      return;
    }
  }, [userState.user, navigate]);


  const handleSubmit = async (event) => {
    
    event.preventDefault();

    const endpoint = '/user';

    const params = '/delete';

    try {
      const res = await Api.deleteData(endpoint, params);

      if(res.status == 200){        
        // sessionStorage에 저장되어있던 JWT Token을 삭제합니다.
        sessionStorage.removeItem("userToken");
        
        // dispatch 함수를 사용해 userState를 로그아웃 상태로 바꿔줍니다.
        dispatch({ type: "LOGOUT" });

        alert("회원 탈퇴가 성공적으로 처리되었습니다.");

        navigate("/", { replace: true });
      }

      if(!res.status == 200){
        alert("사용자 계정을 삭제하는 도중 오류가 발생했습니다.");
        console.log("사용자 계정을 삭제하는 도중 오류가 발생했습니다.", res.data);
        navigate("/register", { replace: true });
      }
      
    } catch (err) {
      alert("사용자 계정을 삭제하는 도중 오류가 발생했습니다.", err);
      console.log("사용자 계정을 삭제하는 도중 오류가 발생했습니다.", err);
      navigate("/register", { replace: true });
      return;
    }
  };

  // [TO-DO] 비밀번호 확인 입력값이 비밀번호와 동일한지 검증하는 로직을 작성해야 합니다.
  
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-[50%] h-[80%] bg-slate-100 rounded-xl items-center justify-center">
        <form className="flex flex-col h-[70%] items-center justify-evenly" onSubmit={handleSubmit}>
          <h1 className="font-bold text-xl">회원 탈퇴</h1>
          <div className="flex flex-row h-48">
            <div className="flex flex-col justify-evenly text-right mr-5">
              <h1>정말로 탈퇴하시겠습니까?</h1>
            </div>
          </div>
          <button className="bg-green-400 p-3 rounded-xl">회원탈퇴</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
