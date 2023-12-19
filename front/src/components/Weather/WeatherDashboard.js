import { React, useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHalf } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import { faPersonShelter } from "@fortawesome/free-solid-svg-icons";

import * as WeatherApi from "../../apis/weatherApi";

function WeatherDashboard (props) {

  // 현재 시간을 나타내는 타임스탬프를 정의합니다.
  // [참고] YYYY-MM-DD HH-mm-ss 포맷을 사용하는 남아프리카공화국 로케일을 임시로 사용합니다.
  const now = new Date();
  const timestamp = now.toLocaleString('af-ZA');

  // 사용자가 선택한 특정 지역의 기상정보 데이터를 백엔드로부터 받아와서 상태값으로써 저장합니다.
  const [districtCurrentData, setDistrictCurrentData] = useState();
  const [districtForecastData, setDistrictForecastData] = useState();

  // 날씨 위젯에 사용할 기본 Tailwind CSS 클래스들을 지정해줍니다.
  const baseStyle = "flex flex-row items-center justify-between w-full h-full p-10 rounded-2xl ";

  // 기상 상황이 건강에 미치는 영향을 나타내는 정보들을 지정해줍니다.
  const [dynamicWidget, setDynamicWidget] = useState({style: 'bg-lime-500',
                                                      message: '건강에 악영향이 없는 체감기온입니다.',
                                                      iconUrl: 'https://openweathermap.org/img/wn/10d@2x.png'});

  // 백엔드로부터 데이터를 받아오고 있는지를 체크하는 상태값입니다.
  const [isFetching, setIsFetching] = useState(true);

  // 백엔드로부터 데이터를 받아오다가 오류가 발생했는지를 체크하는 상태값입니다.
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDistrictWeatherData = async () => {
      try{
        setIsFetching(true);
        // OpenWeatherMap에서는 시/군/구별 기상정보를 제공하지 않으므로 지금은 요청이 '서울특별시'로 hardcoded 된 상태입니다.
        const resCurrent = await WeatherApi.getCurrentData('Seoul');
        setDistrictCurrentData(resCurrent.data);
        const resForecast = await WeatherApi.getForecastData('Seoul');
        setDistrictForecastData(resForecast.data);

        // 현재 날씨 위젯에 표시할 OpenWeatherMap 아이콘 Url을 상태값으로 지정합니다.
        setDynamicWidget({iconUrl: `https://openweathermap.org/img/wn/${resCurrent.data.weather[0].icon}@2x.png`});

        if(resCurrent.data.main.feels_like > 33){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-red-500',
                                        message: '현재 체감기온이 매우 높습니다.\n폭염 상황이니 가까운 폭염 쉼터를 찾아 건강을 지키세요!'}))
        }  
        if(resCurrent.data.main.feels_like > 30 && resCurrent.data.main.feels_like <= 33 ){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-orange-500',
                                        message: '현재 체감기온이 상당히 높습니다.\n폭염이 우려되니 수분을 보충하고 휴식을 취하세요!'}))
        }
        if(resCurrent.data.main.feels_like > 27 && resCurrent.data.main.feels_like <= 30){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-yellow-400',
                                        message: '현재 체감기온이 높은 상황입니다.\n기상 정보를 자주 확인하세요!'}))
        }
        if(resCurrent.data.main.feels_like > 7  && resCurrent.data.main.feels_like <= 27){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-lime-500',
                                        message: '건강에 악영향이 없는 체감기온입니다.'}))
        }
        if(resCurrent.data.main.feels_like > -3  && resCurrent.data.main.feels_like <= 7){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-sky-300',
                                        message: '현재 체감기온이 낮은 상황입니다.\n기상 정보를 자주 확인하세요!'}))
        }
        if(resCurrent.data.main.feels_like > -7  && resCurrent.data.main.feels_like <= -3){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-sky-400',
                                        message: '현재 체감기온이 상당히 낮습니다.\n한파가 우려되니 난방기구를 사용하세요!'}))
        }
        if(resCurrent.data.main.feels_like <= -7){
          setDynamicWidget(prev => ({...prev, 
                                        style: baseStyle + 'bg-sky-500',
                                        message: '현재 체감기온이 매우 낮습니다.\n한파 상황이니 가까운 한파 쉼터를 찾아 건강을 지키세요!'}))
        }

      } catch (err) {
        // 만약에 에러가 발생하게 되면 데이터 로딩 상황을 알려주는 placeholder 아래에 에러 메세지가 추가됩니다.
        setError(`${err.name} : ${err.message}`);
        alert(`데이터를 가져오는 도중 에러가 발생했습니다: ${err}`);
        return;
      } finally {
        setIsFetching(false);
      }
    }
    fetchDistrictWeatherData();

  }, [error, props.currentDistrict]);

  if (isFetching || !districtCurrentData || !districtForecastData) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <p className="font-bold text-lg">데이터를 가져오는 중입니다...</p>
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
      <div id="weather-dashboard-content" className="grow overflow-y-auto h-full grid grid-cols-5 grid-rows-3 gap-5 p-5">
        
        <div className="col-start-1 col-end-3 row-start-1 row-end-2">
          <div className="flex flex-row items-center justify-between w-full h-full p-10 rounded-2xl bg-[#57b198]">
            <div className="flex flex-col text-white justify-center">
              <h2 className="font-bold text-lg">현재 날씨</h2>
              <h1 className="font-bold text-2xl">{districtCurrentData.weather[0].description}</h1>
            </div>
            <img src={dynamicWidget.iconUrl} alt="현재 날씨를 상징하는 아이콘입니다."></img>
          </div>
        </div>

        <div className="col-start-3 col-end-6 row-start-1 row-end-2 flex flex-row">
          <div className={dynamicWidget.style}>
            <div className="flex flex-col text-white justify-center">
              <h2 className="font-bold text-lg">극한날씨 체크</h2>
              <h1 className="font-bold text-2xl whitespace-pre-line">{dynamicWidget.message}</h1>
            </div>
            <FontAwesomeIcon icon={faPersonShelter} size="3x" />
          </div>
        </div>

        <div className="col-start-1 col-end-2 row-start-2 row-end-3">
          <div className={dynamicWidget.style}>
            <div className="flex flex-col text-white justify-center">
              <h2 className="font-bold text-lg">현재 체감기온</h2>
              <h1 className="font-bold text-3xl">{districtCurrentData.main.feels_like}°C</h1>
            </div>
          </div>
        </div>

        {/* OpenWeatherMap에서 제공하는 3시간 단위의 5일치 예보 중에서, 현재 시간에 가장 가까운 3시간 예보의 차순 인덱스인 1을 사용합니다. */}
        {/* OpenWeatherMap에서는 타임스탬프에 UTC+0 시간대를 사용하고 있습니다. */}

        <div className="col-start-2 col-end-4 row-start-2 row-end-3 flex flex-row items-center bg-slate-500 p-10 rounded-2xl">
          <div className="flex flex-row w-full text-white items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">현재 기온</h2>
              <h1 className="font-bold text-3xl">{districtCurrentData.main.temp}°C</h1>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white/70">3시간 이후</h2>
              <h1 className="font-bold text-3xl text-white/70">{districtForecastData.list[1].main.temp}°C</h1>
            </div>
            <FontAwesomeIcon icon={faTemperatureHalf} size="3x" />
          </div>
        </div>

        <div className="col-start-4 col-end-6 row-start-2 row-end-3 flex flex-row items-center bg-[#3d5c99] p-10 rounded-2xl">
          <div className="flex flex-row w-full text-white items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">현재 습도</h2>
              <h1 className="font-bold text-3xl">{districtCurrentData.main.humidity}%</h1>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white/70">3시간 이후</h2>
              <h1 className="font-bold text-3xl text-white/70">{districtForecastData.list[1].main.humidity}%</h1>
            </div>
            <FontAwesomeIcon icon={faDroplet} size="3x" />
          </div>
        </div>

        <div className="col-start-1 col-end-3 row-start-3 row-end-4 flex flex-row items-center bg-[#6686c5] p-10 rounded-2xl">
          <div className="flex flex-row w-full text-white items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">비/눈 올 확률</h2>
              <h1 className="font-bold text-3xl">{districtForecastData.list[1].pop * 100}%</h1>
            </div>
          </div>
          <FontAwesomeIcon icon={faUmbrella} size="3x" />
        </div>

        <div className="col-start-3 col-end-5 row-start-3 row-end-4 flex flex-row items-center bg-[#3C82A1] p-10 rounded-2xl">
          <div className="flex flex-row w-full text-white items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">풍속</h2>
              <h1 className="font-bold text-3xl">{districtCurrentData.wind.speed}m/s</h1>
            </div>
          </div>
          <FontAwesomeIcon icon={faWind} size="3x" />
        </div>

        <div className="col-start-5 col-end-6 row-start-3 row-end-4 flex flex-row items-center bg-[#213d4c] p-10 rounded-2xl">
          <div className="flex flex-col w-full text-white justify-center">
            <p className="font-bold">{timestamp}</p>
            <p className="">OpenWeatherMap 제공</p>
          </div>
        </div>

      </div>
  )
}

export default WeatherDashboard;