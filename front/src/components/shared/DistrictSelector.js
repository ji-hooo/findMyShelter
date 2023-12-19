import { React, useState } from 'react';

const DistrictSelector = ({handleState, currentDistrict}) => {

  const handleChange = (event) => {
    // [주의] useState는 비동기적입니다. 따라서 setState는 즉시 반환하게 됩니다. 상태값인 city는 다음 재렌더링때 바뀌게 됩니다.
    //       따라서 그 전에 이렇게 별도의 변수로 먼저 저장해주면 사용자가 선택한 바로 그 순간의 값을 있는 그대로 백엔드에 전달해줄 수 있습니다.
    
    // 자식 컴포넌트인 DistrictSelector에서 사용자로부터 얻은 행정구역 변수값을,
    const selectedDistrict = event.target.value;

    // 부모 컴포넌트인 PoiPage로부터 전달받은 handleState 함수를 사용해서,
    // 부모 컴포넌트의 district와 districtLabel 상태로써 갱신합니다.
    handleState(selectedDistrict);
  }

  // Warning: Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.
  return (
    <div className="flex flex-row items-center">
      <label className="mr-3">지역:</label>
      <select className="mr-3 rounded-lg p-1 bg-white" name="city-selector">
        <option value="seoul">서울특별시</option>
        <option value="gyeonggi" disabled>경기도</option>
        <option value="incheon" disabled>인천광역시</option>
        <option value="gangwon" disabled>강원도</option>
        <option value="chungbuk" disabled>충청북도</option>
        <option value="chungnam" disabled>충청남도</option>
        <option value="jeonbuk" disabled>전라북도</option>
        <option value="jeonnam" disabled>전라남도</option>
        <option value="gyeongbuk" disabled>경상북도</option>
        <option value="gyeongnam" disabled>경상남도</option>
        <option value="jeju" disabled>제주도</option>
      </select>
      <select name="district-selector" className="rounded-lg p-1 bg-white" onChange={handleChange} value={currentDistrict}>
        <option disabled>선택하세요</option>
          <optgroup label="서울특별시">
            <option value="gangnam">강남구</option>
            <option value="gangdong">강동구</option>
            <option value="gangbuk">강북구</option>
            <option value="gangseo">강서구</option>
            <option value="gwanak">관악구</option>
            <option value="gwangjin">광진구</option>
            <option value="guro">구로구</option>
            <option value="geumcheon">금천구</option>
            <option value="nowon">노원구</option>
            <option value="dobong">도봉구</option>
            <option value="dongdaemun">동대문구</option>
            <option value="dongjak">동작구</option>
            <option value="mapo">마포구</option>
            <option value="seodaemun">서대문구</option>
            <option value="seocho">서초구</option>
            <option value="seongdong">성동구</option>
            <option value="seongbuk">성북구</option>
            <option value="songpa">송파구</option>
            <option value="yangcheon">양천구</option>
            <option value="yeongdeungpo">영등포구</option>
            <option value="yongsan">용산구</option>
            <option value="eunpyeong">은평구</option>
            <option value="jongno">종로구</option>
            <option value="jung">중구</option>
            <option value="jungnang">중랑구</option>
          </optgroup>
      </select>
    </div>
  )
}

export default DistrictSelector;