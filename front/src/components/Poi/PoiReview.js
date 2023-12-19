import { React, useState, useEffect, useContext } from "react";

import * as Api from "../../apis/api";

import UserStateContext from "../../contexts/UserStateContext";
import DispatchContext from "../../contexts/DispatchContext";

const ReviewInputForm = props => {
  const dispatch = useContext(DispatchContext);
  const userState = useContext(UserStateContext);

  // 사용자가 선택한 행정구역 정보를 담고 있는 district 상태값을 라우팅 파라미터인 params로써 API 요청에 반영합니다.
  const params = `/${props.selectedPoiId}`;

  // 사용자가 선택한 특정 쉼터의 상세정보를 백엔드로부터 받아 상태값으로써 저장합니다.
  const [selectedPoiData, setSelectedPoiData] = useState();

  // 백엔드로부터 데이터를 받아오고 있는지를 체크하는 상태값입니다.
  const [isFetching, setIsFetching] = useState();

  // 백엔드로부터 데이터를 받아오다가 오류가 발생했는지를 체크하는 상태값입니다.
  const [error, setError] = useState();

  // API 요청에 사용되는 endpoint를 지정해줍니다.
  const endpoint2 = "/shelters";

  // 사용자가 선택한 행정구역 정보를 담고 있는 district 상태값을 라우팅 파라미터인 params로써 API 요청에 반영합니다.

  useEffect(() => {
    const fetchSelectedPoiData = async () => {
      try {
        setIsFetching(true);
        const res = await Api.getData(endpoint2, params);
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
  }, [error]);

  if (isFetching || !selectedPoiData) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <p className="font-bold text-lg">데이터를 가져오는 중입니다...</p>
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  // API 요청에 사용되는 endpoint를 지정해줍니다.
  const endpoint = "/review";

  const HandleSubmit = async event => {
    // onSubmit과 함께 기본적으로 작동하는 브라우저 새로고침을 차단해줍니다.
    event.preventDefault();

    // 사용자가 입력한 리뷰값을 data 변수에 대입합니다.
    const data = {
      user_id: userState.user.id,
      nickname: userState.user.nickname,
      shelter_id: props.selectedPoiId,
      description: event.target.input.value,
      name: selectedPoiData.name,
    };

    // 화면에 내용을 표시해야하는 GET 요청이 아니라 POST 요청이므로 굳이 useEffect를 사용할 필요 없이 event handler를 통해서 직접 실행합니다.
    try {
      const res = await Api.postData(data, endpoint, params);

      if (!res.data.errorMessage) {
        alert(`리뷰를 성공적으로 추가했습니다.`);

        // 추가된 리뷰를 리뷰 목록에 표시해주는 방법

        // 프론트엔드에서 POST/PUT/DELETE를 요청하면, 백엔드에서 다음과 같이 처리해 응답으로써 보내줄 수 있습니다.
        // 1. 프론트엔드에 성공 실패 여부만 알려주는 경우
        // 2. 프론트엔드에 CRUD 작업을 요청한 내용을 그대로 응답으로 돌려주는 경우
        // 3. 프론트엔드에 CRUD 작업 이후 변경된 객체나 배열을 보내주는 경우

        // 여기서는 1번에 가까우며, 두가지 방법이 있습니다.
        // 1. GET 요청으로 fetch를 다시 해와서
        // 2. 사용자가 POST/PUT/DELETE를 수행한 데이터 및 요소를 프론트엔드 차원에서만 부분 렌더링으로 추가해주거나 제외해주는 방법

        // 여기서는 props로써 전달받은 리뷰 목록 fetch 함수를 다시 실행시켜주는 방법을 사용하도록 하겠습니다.

        // 리뷰 목록을 다시한번 불러와서 갱신된 상태로 렌더링합니다.
        props.refresh();
        return;
      }
      if (res.data.errorMessage) {
        alert(`리뷰를 추가하는 도중 오류가 발생했습니다: ${res.data.errorMessage}`);
        return;
      }
    } catch (err) {
      alert(`리뷰를 추가하는 도중 오류가 발생했습니다: ${err}`);
      return;
    }
  };

  return (
    <div className="flex my-4">
      <form className="flex flex-row justify-between w-full" onSubmit={HandleSubmit} type="submit">
        <input className="flex-1 w-full bg-slate-100 rounded-lg p-3" type="text" name="input"></input>
        <button className="flex-none bg-green-400 rounded-lg ml-4 p-4">작성</button>
      </form>
    </div>
  );
};

const PoiReview = props => {
  const dispatch = useContext(DispatchContext);
  const userState = useContext(UserStateContext);

  // 사용자가 선택한 특정 쉼터에 작성된 리뷰 목록을 백엔드로부터 받아와서 상태값으로써 저장합니다.
  const [poiReviewData, setPoiReviewData] = useState();

  // 백엔드로부터 데이터를 받아오고 있는지를 체크하는 상태값입니다.
  const [isFetching, setIsFetching] = useState(true);

  // 백엔드로부터 데이터를 받아오다가 오류가 발생했는지를 체크하는 상태값입니다.
  const [error, setError] = useState("");

  const fetchPoiReviewData = async () => {
    try {
      // API 요청에 사용되는 endpoint를 지정해줍니다.
      const endpoint = "/review";

      // 사용자가 선택한 특정 쉼터의 id값을 라우팅 파라미터인 params로써 API 요청에 반영합니다.
      const params = `/${props.selectedPoiId}`;

      setIsFetching(true);
      const res = await Api.getData(endpoint, params);
      setPoiReviewData(res.data);
    } catch (err) {
      // 만약에 에러가 발생하게 되면 데이터 로딩 상황을 알려주는 placeholder 아래에 에러 메세지가 추가됩니다.
      setError(`${err.name} : ${err.message}`);
      alert(`데이터를 가져오는 도중 에러가 발생했습니다: ${err}`);
      return;
    } finally {
      setIsFetching(false);
    }
  };

  async function handleClick(event) {
    event.preventDefault();
    const reviewId = event.target.id;

    alert(`리뷰를 정말로 삭제하시겠습니까?`);

    try {
      const endpoint = "/review";
      const params = `/${reviewId}`;
      const res = await Api.deleteData(endpoint, params);
      if (!res.status == 204) {
        alert(`리뷰를 삭제하는 도중 오류가 발생했습니다.: ${res.data}`);
      }
      if (res.status == 204) {
        alert(`리뷰를 성공적으로 삭제했습니다.`);

        // 삭제된 리뷰를 리뷰 목록에서 제거하는 방법

        // 프론트엔드에서 POST/PUT/DELETE를 요청하면, 백엔드에서 다음과 같이 처리해 응답으로써 보내줄 수 있습니다.
        // 1. 프론트엔드에 성공 실패 여부만 알려주는 경우
        // 2. 프론트엔드에 CRUD 작업을 요청한 내용을 그대로 응답으로 돌려주는 경우
        // 3. 프론트엔드에 CRUD 작업 이후 변경된 객체나 배열을 보내주는 경우

        // 여기서는 1번에 가까우며, 두가지 방법이 있습니다.
        // 1. GET 요청으로 fetch를 다시 해와서
        // 2. 사용자가 POST/PUT/DELETE를 수행한 데이터 및 요소를 프론트엔드 차원에서만 부분 렌더링으로 추가해주거나 제외해주는 방법

        // 여기서는 리뷰 목록 fetch 함수를 다시 실행시켜주는 방법을 사용하도록 하겠습니다.
        // 리뷰 목록을 다시한번 불러와서 갱신된 상태로 렌더링합니다.
        fetchPoiReviewData();
      }
    } catch (err) {
      // 만약에 에러가 발생하게 되면 데이터 로딩 상황을 알려주는 placeholder 아래에 에러 메세지가 추가됩니다.
      setError(`${err.name} : ${err.message}`);
      alert(`데이터를 가져오는 도중 에러가 발생했습니다: ${err}`);
      return;
    }
  }

  useEffect(() => {
    console.log("----------review state---------");
    console.log(userState);
    console.log("----------review state---------");
  }, [userState]);

  useEffect(() => {
    fetchPoiReviewData();
  }, [error, props.selectedPoiId]);

  if (isFetching || !poiReviewData) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <p className="font-bold text-lg">데이터를 가져오는 중입니다...</p>
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col bg-slate-100 rounded-xl overflow-y-scroll h-[30vh] p-2">
        {poiReviewData.map(item => (
          <div key={item.id} className="flex flex-col my-2">
            <div className="flex flex-row justify-between">
              <span className="font-bold">{item.nickname}님</span>
              {/* 현재 로그인한 사용자의 id와 리뷰를 작성한 사용자의 id가 일치하는 경우에만 삭제 버튼을 표시합니다. */}
              {/* [TO-DO][REFACTOR] 로그인 시 백엔드에서는 사용자의 고유 _id를 다른 사용자 정보들과 함께 담아 프론트엔드에 넘겨주고, 
                                    프론트엔드는 그걸 받아서 사용자 계정 정보를 담고있는 전역 상태값 userState에 저장해서 사용자의 고유 _id를 사용하는 지금 방식 대신,
                                    사용자의 고유 _id를 파악할 필요가 있을때마다, 백엔드로 JWT 토큰을 보내고 그걸 백엔드에서 받아 사용자의 고유 _id를 반환하는 방식의
                                    별도의 API를 구축하고 사용하는 것을 보안 측면에서 고려해볼 수 있습니다.*/}
              {userState?.user?.user_id != null ? (
                item.user_id === userState.user.user_id ? (
                  <button key={item.id} id={item.id} onClick={handleClick} className="text-slate-500 underline">
                    리뷰 삭제
                  </button>
                ) : (
                  <span></span>
                )
              ) : (
                <span></span>
              )}
            </div>
            <p className="">{item.description}</p>
          </div>
        ))}
      </div>
      {userState?.user?.user_id ? <ReviewInputForm refresh={fetchPoiReviewData} selectedPoiId={props.selectedPoiId} /> : <span></span>}
    </div>
  );
};

export default PoiReview;
