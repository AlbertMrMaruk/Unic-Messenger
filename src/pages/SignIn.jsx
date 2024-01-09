import { FaBullseye, FaSign, FaLock, FaUser } from "react-icons/fa";
import Field from "../components/blocks/Field";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatabaseAPI from "../api/DatabaseAPI";
import Navbar from "../components/blocks/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
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
    username: "",
    password: "",
  });
  const { username, password } = formData;
  const onSubmit = async (e) => {
    if (formData.password.length === 0) {
      toast.error("Заполните поле для ввода пароля", {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    e.preventDefault();
    console.log(formData);
    DatabaseAPI.signInUser(formData)
      .then((res) => res.json())
      .then((el) => {
        if (el) {
          navigate("/");
        }
      });
  };

  const navigate = useNavigate();

  return (
    <div className="bg-secondary h-[100vh] ">
      <ToastContainer />
      <Navbar />
      <div className="static rounded-2xl bg-[#2c2e30] pt-6 px-3 pb-10 w-[90%] md:w-[55%] m-auto   shadow-xl shadow-[#00000047] mt-[10rem] md:mt-[5rem]">
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
          text={password}
        ></Field>
        <div
          className="absolute bg-primary py-3  text-md uppercase font-bold px-4 rounded-full left-[50%] ml-[-61.85px] top-[27.5rem] md:top-[22.5rem] cursor-pointer text-black flex gap-2 hover:scale-110 duration-100 ease-in"
          onClick={onSubmit}
        >
          <FaBullseye className="my-auto text-2xl" />
          Войти
        </div>
      </div>
      <div className=" text-center mt-12 font-bold cursor-pointer md:mt-16 ">
        <Link to="/sign-up" className="  text-primary">
          Создать новый аккаунт
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
