import { React, useState, useEffect, useContext } from "react";

import PoiReview from "./PoiReview";

import useApi from "../../hooks/useApi";

import * as Api from "../../apis/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PoiDetails = ({ handleState, selectedPoi }) => {
  function handleClick() {
    // PoiPage에서의 selectedPoi 상태값을 소거해서, PoiPage에서 쉼터 상세정보 컴포넌트 대신에 쉼터 목록 컴포넌트를 보여주도록 합니다.
    // 쉼터 상세정보 창을 꺼버리는 기능으로써 작동합니다.
    handleState();
  }

  // 사용자가 선택한 특정 쉼터의 상세정보를 백엔드로부터 받아 상태값으로써 저장합니다.
  const [selectedPoiData, setSelectedPoiData] = useState();

  // 백엔드로부터 데이터를 받아오고 있는지를 체크하는 상태값입니다.
  const [isFetching, setIsFetching] = useState();

  // 백엔드로부터 데이터를 받아오다가 오류가 발생했는지를 체크하는 상태값입니다.
  const [error, setError] = useState();

  // API 요청에 사용되는 endpoint를 지정해줍니다.
  const endpoint = "/shelters";

  // 사용자가 선택한 행정구역 정보를 담고 있는 district 상태값을 라우팅 파라미터인 params로써 API 요청에 반영합니다.
  const params = `/${selectedPoi}`;

  useEffect(() => {
    const fetchSelectedPoiData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.getData(endpoint, params);
        setSelectedPoiData(res.data);
      } catch (err) {
        // 만약에 에러가 발생하게 되면 데이터 로딩 상황을 알려주는 placeholder 아래에 에러 메세지가 추가됩니다.
        setError(`${err.name} : ${err.message}`);
        alert(`데이터를 가져오는 도중 에러가 발생했습니다: ${error}`);
        return;
      } finally {
        setIsFetching(false);
      }
    };

    fetchSelectedPoiData();
  }, [error, selectedPoi]);

  if (isFetching || !selectedPoiData) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <p className="font-bold text-lg">데이터를 가져오는 중입니다...</p>
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button className="relative z-20 mx-6 left-0" onClick={handleClick}>
        <BackButton />
      </button>
      <div className="flex flex-col relative">
        <div className="flex flex-col m-7">
          <h1 className="font-bold text-xl">{selectedPoiData.name}</h1>
          <h2 className="font-bold text-lg mt-3">장소 정보</h2>
          <div className="ml-2">
            <p>
              <span className="mr-2">주소:</span>
              <span>{selectedPoiData.address}</span>
            </p>
            <p>
              <span className="mr-2">유형:</span>
              <span>{selectedPoiData.shelter_type}</span>
            </p>
            <p>
              <span className="mr-2">면적:</span>
              <span>{selectedPoiData.area}</span>
              <span>㎡</span>
            </p>
            <p>
              <span className="mr-2">최대 인원:</span>
              <span>{selectedPoiData.capacity}</span>
              <span>명</span>
            </p>
          </div>
          <h2 className="font-bold text-lg mt-3">개방 정보</h2>
          <div className="ml-2">
            <p>
              <span className="mr-2">야간 개방 여부:</span>
              <span>{selectedPoiData.open_at_night}</span>
            </p>
            <p>
              <span className="mr-2">주말 개방 여부:</span>
              <span>{selectedPoiData.open_on_weekends}</span>
            </p>
            <p>
              <span className="mr-2">숙박 가능 여부:</span>
              <span>{selectedPoiData.overnight_stay}</span>
            </p>
          </div>
          <h2 className="font-bold text-lg mt-3">운영 정보</h2>
          <div className="ml-2">
            <p>
              <span className="mr-2">운영 개시 시기:</span>
              <span>{selectedPoiData.season_start_date.slice(0, 10)}</span>
            </p>
            <p>
              <span className="mr-2">운영 종료 시기:</span>
              <span>{selectedPoiData.season_end_date.slice(0, 10)}</span>
            </p>
            <p>
              <span className="mr-2">담당 기관:</span>
              <span>{selectedPoiData.authority_name}</span>
            </p>
            <p>
              <span className="mr-2">담당 기관 전화번호:</span>
              <span>{selectedPoiData.authority_contact}</span>
            </p>
          </div>
          <h2 className="font-bold text-lg mt-3">냉난방 기구 정보</h2>
          <div className="ml-2">
            <p>
              <span className="mr-2">선풍기 보유 대수:</span>
              <span>{selectedPoiData.fan_count}</span>
            </p>
            <p>
              <span className="mr-2">에어컨 보유 대수:</span>
              <span>{selectedPoiData.ac_count}</span>
            </p>
            <p>
              <span className="mr-2">난방기구 보유 대수:</span>
              <span>{selectedPoiData.heater_count}</span>
            </p>
          </div>
          <h2 className="font-bold text-lg my-3">방문 후기를 확인해보세요!</h2>
          <div className="">
            <PoiReview selectedPoiId={selectedPoiData.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

function BackButton() {
  return <div className="text-[3rem] font-bold">⭠</div>;
}
export default PoiDetails;
