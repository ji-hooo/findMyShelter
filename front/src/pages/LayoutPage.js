import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Layout/Header";
import Navbar from "../components/Layout/Navbar";
import { useEffect } from "react";

const LayoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // [참고] 자동 숨김 주소창 등의 기능으로 인해 뷰포트가 고정되지 않는 모바일 환경에서, 뷰포트의 높이를 브라우저의 실제 innerHeight로 강제해주는 코드입니다.
  //       이 코드가 없으면 footer라던가 navbar 등의 컴포넌트가 하단에 있는 경우, 주소창이 보이거나 숨겨지면서 컴포넌트를 덮어버리게 됩니다.

  useEffect(() => {
    // 1. 모바일 브라우저 내부의 실제 innerHeight를 뷰포트의 높이로 정의해줍니다.
    const mobileDocumentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };

    // 2. 주소창이 자동으로 숨겨졌다가 표시되거나 하면서 모바일 브라우저 내부 영역에 리사이즈가 일어날때마다, 뷰포트의 높이도 그에 맞게 맞춰줍니다.
    window.addEventListener("resize", mobileDocumentHeight);
    mobileDocumentHeight();
  }, []);

  useEffect(() => {
    if (location.pathname === "/") navigate("/poi");
  }, [location]);

  return (
    <div className="flex place-content-center w-screen h-screen bg-slate-100">
      <div className="flex flex-col w-9/12 max-h-[calc(100vh)] mt-6 bg-[#d3eeea]">
        <header className="flex-none">
          <Header />
        </header>
        <nav className="flex-none">
          <Navbar />
        </nav>
        <main className="grow overflow-y-auto max-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;
