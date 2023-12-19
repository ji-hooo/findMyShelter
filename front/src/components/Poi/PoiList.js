import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getData } from '../../apis/api';

import PoiItem from './PoiItem'
import DistrictPoiDataContext from '../../contexts/DistrictPoiDataContext';

// PoiPage로부터 전달받은 handleState를 PoiItem까지 prop drilling 합니다.

const PoiList = ({handleState}) => {

  return (
    <DistrictPoiDataContext.Consumer>
      {poiData =>
        poiData.map(item => (
         <PoiItem key={item.id} poiData={item} handleState={handleState} />
        ))
      }
    </DistrictPoiDataContext.Consumer>
  );
};

export default PoiList;