import { FaBullseye, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/blocks/Field";
import DatabaseAPI from "../api/DatabaseAPI";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate("");

  const { name, username, password } = formData;
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // DatabaseAPI.createUser()
      console.log(formData);
      //  navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#050505] h-screen pt-[10rem]">
      <div className="static rounded-2xl bg-[#2c2e30] pt-6 px-3 pb-10 w-[90%] md:w-[55%] m-auto  shadow-xl shadow-[#00000047] ">
        <div className="absolute bg-[#38dbe0] py-2  text-sm uppercase font-bold px-4 rounded-md top-[6.75rem] left-[50%] ml-[-60.5px] md:top-[9.25rem]  text-black flex gap-3 ">
          <FaUser className="my-auto text-lg" />
          Профиль
        </div>
        <Field
          icon={<FaUser className="text-[#38dbe0] text-4xl my-auto" />}
          placeholder={"Имя"}
          setText={(e) => setFormData({ ...formData, name: e })}
          text={name}
        ></Field>
        <Field
          icon={<FaEnvelope className="text-[#38dbe0] text-4xl my-auto" />}
          placeholder={"Логин"}
          setText={(e) => setFormData({ ...formData, username: e })}
          text={username}
        ></Field>
        <Field
          icon={<FaLock className="text-[#38dbe0] text-4xl my-auto" />}
          placeholder={"Пароль"}
          setText={(e) => setFormData({ ...formData, password: e })}
          text={password}
        ></Field>
        <div
          className="absolute bg-[#38dbe0] py-3  text-md uppercase font-bold px-4 rounded-full left-[50%] ml-[-65px] top-[24rem] md:top-[26.5rem] cursor-pointer text-black flex gap-2 hover:scale-110 duration-100 ease-in "
          onClick={onSubmit}
        >
          <FaBullseye className="my-auto text-2xl" />
          Создать аккаунт
        </div>
      </div>
      <div className=" text-center mt-9 font-bold cursor-pointer md:mt-12 ">
        <Link to="/sign-in" className="  text-[#1ad6dd]">
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
