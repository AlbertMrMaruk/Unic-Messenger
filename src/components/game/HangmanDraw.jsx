const HEAD = (
  <div
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "100%",
      border: "7px solid black",
      position: "absolute",
      top: "45px",
      right: "-13px",
    }}
  />
);

const BODY = (
  <div
    style={{
      width: "10px",
      height: "50px",
      background: "black",
      position: "absolute",
      top: "77px",
      right: "0",
    }}
  />
);

const RIGHT_ARM = (
  <div
    style={{
      width: "39px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "98px",
      right: "-38px",
      rotate: "-30deg",
      transformOrigin: "left bottom",
      borderRadius: "12px",
    }}
  />
);

const LEFT_ARM = (
  <div
    style={{
      width: "39px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "98px",
      right: "10px",
      rotate: "30deg",
      transformOrigin: "right bottom",
      borderRadius: "12px",
    }}
  />
);

const RIGHT_LEG = (
  <div
    style={{
      width: "45px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "112px",
      right: "-33px",
      rotate: "40deg",
      transformOrigin: "left bottom",
      borderRadius: "12px",
    }}
  />
);

const LEFT_LEG = (
  <div
    style={{
      width: "45px",
      height: "10px",
      background: "black",
      position: "absolute",
      top: "132px",
      right: 0,
      rotate: "-40deg",
      transformOrigin: "right bottom",
      borderRadius: "12px",
    }}
  />
);

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

const HangmanDraw = ({ numberOfGuess }) => {
  return (
    <div style={{ position: "relative" }}>
      {BODY_PARTS.slice(0, numberOfGuess)}
      <div
        style={{
          height: "50px",
          width: "10px",
          background: "black",
          position: "absolute",
          top: "0",
          right: "0",
          borderRadius: "12px",
        }}
      />

      <div
        style={{
          height: "10px",
          width: "100px",
          background: "black",
          marginLeft: "95px",
        }}
      />

      <div
        style={{
          height: "150px",
          width: "10px",
          background: "black",
          marginLeft: "95px",
        }}
      />

      <div
        style={{
          height: "10px",
          width: "150px",
          background: "black",
          borderRadius: "12px",
          marginLeft: "25px",
        }}
      />
    </div>
  );
};

export default HangmanDraw;
