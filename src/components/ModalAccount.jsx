import Spinner from "./blocks/Spinner";
import { useState } from "react";

export default function ModalAccount({ setSession, setShowModal }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [phone, setPhone] = useState("");
  const [confirm, setConfirm] = useState(false);
  const startSession = (phone) => {
    console.log(phone);
    return fetch(`http://89.111.131.15/api/sessions/start`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      // make sure to serialize your JSON body
      body: JSON.stringify({
        name: phone,
        config: {
          proxy: null,
          webhooks: [
            {
              url: "http://89.111.131.15/post",
              events: ["message"],
              hmac: null,
              retries: null,
              customHeaders: null,
            },
          ],
        },
      }),
    });
  };
  const getQR = (session) => {
    return fetch(`http://89.111.131.15/api/${session}/auth/qr`);
  };
  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#1c1d1f] outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-[#2a2a2a] rounded-t ">
            <h3 className="text-3xl font-bold text-white m-auto">
              Добавить новый аккаунт
            </h3>
          </div>
          {showSpinner ? (
            <Spinner />
          ) : (
            <div className="relative p-2 ml-2 flex-auto text-center">
              <label className="block text-white text-md font-bold mb-1 ">
                Номер телефона
              </label>
              <input
                className=" bg-[#1c1d1f] text-white rounded-l-xl    p-2 px-4 h-[45px]  relative  block w-[6rem] m-auto  outline-none "
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
          )}
          <div className="flex items-center justify-end py-[1rem] px-2 border-t border-solid border-[#2a2a2a] rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Отменить
            </button>
            {confirm || (
              <button
                className="text-white bg-[#44a0ff]  font-bold uppercase text-sm px-6 py-3 rounded-[5px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => {
                  setShowSpinner(true);
                  startSession(phone).then((resp, status) => {
                    console.log(resp, resp.json(), status);
                    getQR(phone).then((data) => {
                      console.log(data, data.json());
                      setConfirm(true);
                    });
                  });
                }}
              >
                Далее
              </button>
            )}
            {confirm && (
              <button
                className="text-white bg-[#44a0ff]  font-bold uppercase text-sm px-6 py-3 rounded-[5px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                onClick={() => {
                  setShowSpinner(true);
                  getQR().then(() => {
                    setConfirm(false);
                  });
                }}
              >
                Добавить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}