import { FaBullseye, FaLock, FaUser, FaSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/blocks/Field";
import DatabaseAPI from "../api/DatabaseAPI";
import Navbar from "../components/blocks/Navbar";

function SignUp() {
  useEffect(() => {
    DatabaseAPI.verifyToken()
      .then((el) => el.json())
      .then((el) => {
        if (el) {
          navigate("/");
          return;
        }
      });
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate("");

  const { name, username, password } = formData;
  const onSubmit = async (e) => {
    e.preventDefault();
    DatabaseAPI.createUser(formData)
      .then((el) => el.json)
      .then((el) => {
        console.log(el);
        navigate("/sign-in");
      });
  };
  return (
    <div className="bg-secondary h-[100vh]">
      <Navbar />
      <div className="static rounded-2xl bg-[#2c2e30] pt-6 px-3 pb-10 w-[90%] md:w-[55%] m-auto  shadow-xl shadow-[#00000047]  mt-[10rem] md:mt-[5rem]">
        <Field
          icon={<FaUser className="text-primary text-4xl my-auto" />}
          placeholder={"Имя"}
          setText={(e) => setFormData({ ...formData, name: e })}
          text={name}
        ></Field>
        <Field
          icon={<FaSign className="text-primary text-4xl my-auto" />}
          placeholder={"Логин"}
          setText={(e) => setFormData({ ...formData, username: e })}
          text={username}
        ></Field>
        <Field
          icon={<FaLock className="text-primary text-4xl my-auto" />}
          placeholder={"Пароль"}
          setText={(e) => setFormData({ ...formData, password: e })}
          type={"password"}
          text={password}
        ></Field>
        <div
          className="absolute bg-primary py-3  text-md uppercase font-bold px-4 rounded-full left-[50%] ml-[-112px] top-[31.5rem] md:top-[26.5rem] cursor-pointer text-black flex gap-2 hover:scale-110 duration-100 ease-in "
          onClick={onSubmit}
        >
          <FaBullseye className="my-auto text-2xl" />
          Создать аккаунт
        </div>
      </div>
      <div className=" text-center mt-12 font-bold cursor-pointer md:mt-16 ">
        <Link to="/sign-in" className="  text-primary">
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
