function Field({ icon, type, placeholder, text, setText, disabled }) {
  return (
    <div className="flex gap-3 text-2xl border-b-2  border-[#837f79]   hover:border-[#38dbe0] p-3 px-2 mx-3 my-2 ">
      {icon}
      <input
        type={type ? type : "text"}
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className=" border-none outline-none bg-transparent text-white font-bold placeholder:text-[#837f79] placeholder:font-bold focus:outline-none focus:border-none w-[100%]"
      />
    </div>
  );
}

export default Field;
