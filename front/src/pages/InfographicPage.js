import { React, useState, useEffect, useContext } from 'react';

import ChartItemSelector from "../components/Infographic/ChartItemSelector";
import Graph from "../components/Infographic/Graph";
import Commentary from "../components/Infographic/Commentary";
import elice from "../assets/staticDB/elice.png"

const InfographicPage = () => {
 
  const [currentChartItem, setCurrentChartItem] = useState();
  const [currentChartData, setCurrentChartData] = useState();
  const [currentChartType, setCurrentChartType] = useState();

  function handleCurrentChartItemState(chartItem) {
    const chartData = require(`../assets/staticDB/${chartItem}.json`);
    setCurrentChartItem(chartItem);
    setCurrentChartData(chartData);
    setCurrentChartType(chartData.metadata.type);
  }
  
  return (
    <div className="flex flex-col w-full h-full">
      <div id="infographic-toolbar" className="flex flex-row justify-between items-center h-8 px-8 mb-3">
        <ChartItemSelector handleState={handleCurrentChartItemState} />
      </div>
      {currentChartItem
        ? <div className="flex flex-row grow w-full max-h-[calc(100vh-19rem)]">
            <div className="w-[50vw] h-full my-5 ml-10 mr-5 p-10 bg-slate-100 rounded-xl">
              {/* 사용자가 선택한 통계 항목명에 대한 상태값을 Graph 컴포넌트의 key로 지정해서, 사용자가 다른 항목을 선택할 때 그래프 컴포넌트 전체를 다시 렌더링하도록 합니다. */}
              {/* 이렇게 하지 않으면 react-chartjs-2가 chart.js 캔버스를 부분적으로만 렌더링하려는 버그가 발생합니다. */}
              <Graph key={currentChartData.metadata.title} chartData={currentChartData} chartType={currentChartType} />
            </div>
            <div className="w-[50vw] h-full my-5 mr-10 ml-5 p-10 bg-slate-100 rounded-xl">
              <Commentary metadata={currentChartData.metadata}/>
            </div>
          </div>
        : <div className="flex flex-col w-11/12 h-full items-center justify-center p-10 m-10 bg-slate-100 rounded-xl">
            {/* <img className="w-[20%]" src="images/infographic-placeholder.svg" 
                                     alt="인포그래픽 메뉴의 대기 화면입니다."
                                     style={{opacity: 0.5, filter: 'grayscale(1)'}}/> */}
            <img src={elice} art="엘리스 토끼" style={{width:"16rem", height: "15rem"}}/>
            <h1 className="ml-8 mt-6 font-bold text-xl text-slate-500">화면에 표시할 통계 항목을 선택해주세요.</h1>
            <div className="flex items-center mt-16">
            <div className="">
            <div className="flex flex-col justify-center bg-white mr-4 p-10 shadow-md border border-dotted border-teal-600 rounded-2xl">
            <a href ="https://www.weather.go.kr/w/index.do">
                <img className="w-28" alt="기상청 로고"
                    // style={{backgroundColor: 'white'}}
                    src="https://www.kma.go.kr/kma/resources/images/sub/sig5.png"/></a>
            </div>
        </div>
        <div className="">
            <div className="flex flex-col justify-center bg-white mr-4 p-10 shadow-md border border-dotted border-teal-600 rounded-2xl">
            <a href="https://www.mois.go.kr/frt/a01/frtMain.do">
                <img className="w-28" alt="행정안전부 로고"
                    src="https://www.mois.go.kr/frt2022/main/img/common/logo4.png"/></a>
            </div>
        </div>
        <div className="">
            <div className="flex flex-col justify-center bg-white p-10 shadow-md border border-dotted border-teal-600 rounded-2xl">
            <a href="https://www.safekorea.go.kr/idsiSFK/neo/main/main.html">
                <img className="w-28 h-8" alt="국민재난안전포털 로고"
                     style={{backgroundColor: 'white'}}
                    src="https://www.safekorea.go.kr/idsiSFK/neo/ext/img/main/main_logo_img.png"/></a>
            </div>
        </div>
              </div>
              
          </div>
      }
    </div>
  );
};

export default InfographicPage;