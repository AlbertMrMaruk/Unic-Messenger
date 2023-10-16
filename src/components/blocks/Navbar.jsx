import { Link } from "react-router-dom";
import logo from "../../assets/logoMessenger.png";

function Navbar() {
  return (
    <div className="w-[100%] py-4">
      <Link to="/">
        <img src={logo} className="w-[75px] m-auto" />
      </Link>
    </div>
  );
}

export default Navbar;
