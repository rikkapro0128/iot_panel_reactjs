import { useState, memo } from "react";

function Hidden({ payload }) {
  const [toggle, setToggle] = useState(false);
  
  return (
    <div
      onClick={() => {
        setToggle(!toggle);
      }}
      className="flex items-center"
    >
      {toggle ? (
        <p className="font-medium text-slate-400 ml-4">{ payload }</p>
      ) : (
        <p className="font-medium text-slate-400 ml-4 cursor-help">
          {Array(payload.length).fill("*").join("")}
        </p>
      )}
    </div>
  );
}

export default memo(Hidden);
