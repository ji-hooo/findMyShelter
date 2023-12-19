import { React, useState, useEffect, useContext } from 'react';

import DistrictSelector from "../components/shared/DistrictSelector";
import WeatherDashboard from "../components/Weather/WeatherDashboard";

const WeatherPage = () => {

  // 사용자가 선택한 지역은 자식 컴포넌트인 DistrictSelector를 통해서 처리됩니다.
  // 자식 컴포넌트인 DistrictSelector가 부모 컴포넌트인 PoiPage의 district 상태값을 변경시킬 수 있도록 state handler를 사용합니다.
  // DistrictSelector.js를 참고하세요.
  const [district, setDistrict] = useState("gangnam");

  function handleDistrictState(selectedDistrict) {
    setDistrict(selectedDistrict);
  }

  return (
    <div>
      <div id="weather-toolbar" className="flex flex-row justify-between items-center h-8 px-8 mb-3">
        <DistrictSelector handleState={handleDistrictState} currentDistrict={district}/>
      </div>
      <WeatherDashboard currentDistrict={district}/>
    </div>
  );
};

export default WeatherPage;