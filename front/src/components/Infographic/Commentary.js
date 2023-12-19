const Commentary = (props) => {
  // JSON 파일에서 문자열은 \n이 줄바꿈 기호로 지정되어 있습니다. 따라서 CSS의 white-space: pre-line 속성을 사용해 줄바꿈을 실제로 적용해줍니다.
  return (
    <div className="flex flex-col w-full h-full whitespace-pre-line break-keep">
      <div className="flex-none">
        <h1 className="font-bold text-2xl">{props.metadata.title}</h1>
      </div>
      <div className="grow overflow-y-auto max-h-[90%]">
        <div className="flex flex-col w-full my-7 p-5 bg-slate-300 rounded-xl">
          <h1 className="font-bold mb-5">요약해서 알려드립니다!</h1>
          {props.metadata.summary}
        </div>
        <div className="">
          {props.metadata.commentary}
        </div>
      </div>
    </div>
  );
};

export default Commentary;