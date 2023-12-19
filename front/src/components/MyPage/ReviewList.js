const ReviewList = props => {
  return (
    <div className="w-full h-full">
      {props.list.map(item => (
        <div key={item.shelter_id} className="flex flex-col my-2">
          <p className="font-bold">{item.shelter.name}</p>
          <p className="">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
