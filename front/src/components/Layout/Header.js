import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonShelter } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Link to="/">
      <div className="flex flex-row w-full h-20 rounded-tl-2xl rounded-tr-2xl items-center justify-between bg-[#0d8571]">
        <div className="flex items-center">
          <div className="ml-6">
            <FontAwesomeIcon icon={faPersonShelter} size="2x" color="white"/>
          </div>
          <h1 className="flex items-center font-bold ml-4 text-lg font-serif text-white">무한쉼터,</h1>
          <div className="flex items-center ml-4 text-white font-mono">
            Find my shelter💜
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Header;