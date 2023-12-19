import { React, useState, useEffect, useContext } from 'react';

function ChartItemSelector ({handleState}) {

  const [category, setCategory] = useState('shelter'); 
  
  const handleCategoryChange = (event) => {
    // 사용자가 선택한 카테고리에 맞게 category 상태값을 변화시켜줍니다.
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  }

  const handleChartItemChange = (event) => {

    // 사용자가 선택한 통계 항목을,
    const selectedChartItem = event.target.value;

    // 부모 컴포넌트인 InfographicPage로부터 전달받은 handleState 함수를 사용해서,
    // 부모 컴포넌트의 ChartItem 상태를 갱신합니다.
    handleState(selectedChartItem);
  }

  return(
    <div className="flex flex-row">
      <label className="mr-3 rounded-lg p-1">통계를 선택하세요:</label>
      <select className="mr-3 rounded-lg p-1 bg-white" name="category-selector" onChange={handleCategoryChange}>
        <option value="shelter">쉼터 관련</option>
        <option value="climate">기후 관련</option>
        <option value="energy">에너지 관련</option>
      </select>

      {category == 'shelter' &&
        <select className="rounded-lg p-1 bg-white" onChange={handleChartItemChange} >
          <option disabled selected>선택하세요</option>
            <optgroup label="무더위 쉼터 관련">
              <option value="heatwave_shelter_population_coverage_by_district">행정구역별 인구 대비 무더위 쉼터 수용인원</option>
            </optgroup>
            <optgroup label="한파 쉼터 관련">
              <option value="coldwave_shelter_population_coverage_by_district">행정구역별 인구 대비 한파 쉼터 수용인원</option>
            </optgroup>
        </select>
      } 

      {category == 'climate' &&
        <select className="rounded-lg p-1 bg-white" onChange={handleChartItemChange} >
          <option disabled selected>선택하세요</option>
            <optgroup label="폭염 관련">
              <option value="temp" disabled>준비중입니다</option>
            </optgroup>
            <optgroup label="한파 관련">
              <option value="temp" disabled>준비중입니다</option>
            </optgroup>
        </select>
      } 

      {category == 'energy' &&
        <select className="rounded-lg p-1 bg-white" onChange={handleChartItemChange} >
        <option disabled selected>선택하세요</option>
          <optgroup label="전력 사용량 관련">
            <option value="temp" disabled>준비중입니다</option>
          </optgroup>
          <optgroup label="가스 사용량 관련">
            <option value="temp" disabled>준비중입니다</option>
          </optgroup>
      </select>
      } 
    </div>
  )
}

export default ChartItemSelector;