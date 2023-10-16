import { FaSign, FaUser } from "react-icons/fa";
import Field from "../components/blocks/Field";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatabaseAPI from "../api/DatabaseAPI";
import Navbar from "../components/blocks/Navbar";

function Profile() {
  useEffect(() => {
    DatabaseAPI.verifyToken()
      .then((el) => el.json())
      .then((el) => {
        if (!el) {
          navigate("/");
          return;
        }
        DatabaseAPI.getUser(el.username)
          .then((el) => el.json())
          .then((el) =>
            setFormData({ username: el[0].username, name: el[0].name })
          );
      });
  }, []);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
  });
  const { username, name } = formData;

  const navigate = useNavigate();

  return (
    <div className="bg-secondary h-screen">
      <Navbar />
      <div className="static rounded-2xl bg-[#2c2e30] pt-6 px-3 pb-10 w-[90%] md:w-[55%] m-auto   shadow-xl shadow-[#00000047] mt-4rem">
        <div className="absolute bg-primary py-2  text-sm uppercase font-bold px-4 rounded-md top-[6.75rem] left-[50%] ml-[-60.5px] md:top-[9.25rem]  text-black flex gap-3 ">
          <FaUser className="my-auto text-lg" />
          Профиль
        </div>
        <Field
          icon={<FaSign className="text-primary text-4xl my-auto" />}
          placeholder={"Логин"}
          disabled={true}
          text={username}
        ></Field>
        <Field
          icon={<FaSign className="text-primary text-4xl my-auto" />}
          placeholder={"Имя"}
          disabled={true}
          text={name}
        ></Field>
      </div>
      <div className=" text-center mt-9 font-bold cursor-pointer md:mt-14 ">
        <Link to="/" className="text-red-500">
          Выйти
        </Link>
      </div>
    </div>
  );
}

export default Profile;
