import spinner from "../../assets/785-4.gif";

function Spinner() {
  return (
    <div className="bg-[#1c1d1f] h-max pb-10 shadow-inner py-[60%] md:py-[20%]">
      <img className="m-auto w-[64px]" alt="Spinner" src={spinner} />
    </div>
  );
}

export default Spinner;
