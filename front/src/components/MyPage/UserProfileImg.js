/**
 * 유저 프로필 이미지 컴포넌트입니다.
 * @param {*} param0
 * @returns
 */
const UserProfileImg = ({ src, alt }) => {
  return (
    <div className="rounded-full w-80 h-80 flex items-center justify-center overflow-hidden mb-8">
      <img src={src} alt={alt} className="w-full h-full" />
    </div>
  );
};

export default UserProfileImg;
