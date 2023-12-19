import { React, useState } from 'react';

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import { Map, Marker, Popup } from "react-leaflet";
import L, { MarkerCluster } from 'leaflet'
// import MarkerClusterGroup from 'react-leaflet-cluster'
// import 'leaflet/dist/leaflet.css'

import DistrictPoiDataContext from '../../contexts/DistrictPoiDataContext';
import CurrentPositionContext from "../../contexts/CurrentPositionContext";

// [참고사항] React-leaflet으로 바인딩된 Leaflet.js에서 필수적으로 요구하는 CSS 스타일은 Tailwind CSS가 아닌 /public/index.html를 통해서 가져옵니다.
function PoiMap() {

  /*
  leaflet-react-cluster를 사용한 클러스터링 코드입니다.

  const customIcon = new L.Icon({
    iconUrl: require('../images/location.svg').default,
    iconSize: new L.Point(40, 47),
  })
  
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(33, 33, true),
    })
  }
  */


  const newicon = new L.icon({
    iconUrl: require("../../assets/my-location.png"),
    iconSize: [30, 30]
  });

  return(
    <DistrictPoiDataContext.Consumer>
      {PoiData => 
        <div id="map" className="flex flex-row items-center justify-center">

          {/* 지도를 처음 로딩하는 지역은 서울시입니다. */}
          <MapContainer center={[37.5663, 126.9779]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* 마커가 많을 때 발생하는 퍼포먼스 이슈를 해결하기 위해서 react-leaflet-cluster 플러그인을 활용합니다. */}
            
            {/* <MarkerClusterGroup 
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}> */}

              {/* 백엔드로부터 받아온 쉼터 위치정보를 지도상에 마커로 표시합니다. */}
              {PoiData.map(item => (
                <Marker 
                  key={item.id} 
                  position={[item.latitude, item.longitude]}
                  eventHandlers={{
                    click: (event) => {
                      // [참고] 지도 위에 표시된 마커를 클릭하면, 해당 마커에 해당하는 POI를 목록의 최상단으로 올려줍니다. PoiItem.js를 참고하세요.
                      window.location = `#${item.id}`
                    },
                  }}
                >
                  <Popup>
                    <h1 className="font-bold">{item.name}</h1>
                    <p>{`${item.address.split(' ')[0]} ${item.address.split(' ')[1]} ${item.address.split(' ')[2]}`}</p>
                    <p>{item.shelter_type}</p>
                  </Popup>
                </Marker>
              ))}

            {/* </MarkerClusterGroup> */}

            {/* 현재 위치를 지도상에 마커로 표시해줍니다. */}
            <CurrentPositionContext.Consumer>
              {coordinate =>
                <Marker position={[coordinate[0], coordinate[1]]} icon={newicon}>
                  <Popup>
                    <h1 className="font-bold">마지막으로 파악된 현재 위치</h1>
                    <p>위도: {coordinate[0]}</p>
                    <p>경도: {coordinate[1]}</p>
                  </Popup>
                </Marker>
              }
            </CurrentPositionContext.Consumer>

          </MapContainer>
        </div>
      }
    </DistrictPoiDataContext.Consumer>
  )
}

export default PoiMap;