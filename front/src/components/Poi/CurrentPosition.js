import { React, useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const CurrentPosition = ({handleState}) => {

  // 좌표값을 전역변수로 지정하는것은 안티패턴이므로 사용을 자제해야 합니다.
  // [REFACTORED] 좌표를 state로 저장합니다.
  const [receivedLatitude, setReceivedLatitude] = useState('');
  const [receivedLongitude, setReceivedLongitude] = useState('');

  const [isActive, setIsActive] = useState(false);
  
  // Geolocation API를 사용해서 현재 위치 좌표를 가져오는데 필요한 변수, 옵션, 콜백함수를 정의합니다.
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
  
  function success(position) {
    setReceivedLatitude(position.coords.latitude);
    setReceivedLongitude(position.coords.longitude);

    // alert(`위도: ${position.coords.latitude} /` + ` 경도: ${position.coords.longitude} /` + ` 정확도: 약 ${position.coords.accuracy} 미터`);
  }
  
  function error(err) {
    const errMsg = ["zero-filler", "PERMISSION_DENIED", "POSITION_UNAVAILABLE", "TIMEOUT"];
    alert("현재 위치를 가져올 수 없습니다.\nERROR: " + errMsg[err.code]);
    setIsActive(false);
  }
  
  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  useEffect(() => {
    if (isActive) {
      getCurrentPosition()
      
      // 현재 위치 찾기 버튼이 활성화 상태라면 getCurrentPosition() 함수를 5초마다 호출합니다.
      // useEffect의 dependency인 isActive의 상태값이 false가 되면 clearInterval 처리를 해주기 위해서 setInterval() 함수를 변수에 담아줍니다.
      const interval = setInterval(getCurrentPosition, 5000);
      
      return() => {
        clearInterval(interval);
      }
    }
  }, [isActive])

  useEffect(() => {
    if (receivedLatitude && receivedLongitude) {

      // 부모 컴포넌트인 PoiPage로부터 전달받은 handleState 함수를 사용해서,
      // 부모 컴포넌트인 PoiPage 및 자식 컴포넌트의 PoiMap의 latitude와 longitude 상태값을 갱신시켜 줍니다.
      // [주의] state handler가 setState가 있는 success() 내부에 있게 되면, 최초로 현재 위치를 파악시 새로 얻은 좌표값이 아닌 기본값(빈값)을 참조하게 되므로,
      //       별도의 useEffect를 사용해주어야 합니다.
      handleState(receivedLatitude, receivedLongitude);
    }
  }, [receivedLatitude, receivedLongitude, handleState])

  //
  function HandleToggle() {
    // setState() 함수에서는 이전 값을 참조할 수 있으므로, if 구문 없이도 한 줄의 코드로 이전의 boolean 상태값을 토글해줄 수 있습니다.
    setIsActive(prev => !prev)
  }

  // 현재 위치정보를 얻는 함수를, 지도상에 주기적으로 갱신하는데 사용할 수 있도록 useEffect 안에 넣어줍니다.
  return (
    <div>
      <button id="current-position-btn" 
              className={isActive ? `bg-green-400 px-3 py-1 rounded-xl` : `bg-white px-3 py-1 rounded-xl absolute right-4 bottom-0`}
              onClick={HandleToggle}>
        {isActive ? `위치 표시 중...` : `현재 위치`}
      </button>
    </div>
  )
}

export default CurrentPosition;