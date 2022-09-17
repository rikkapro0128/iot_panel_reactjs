import toast from "react-hot-toast";

const baseOptions = {
  position: "bottom-right",
  style: {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  },
}

const blankOptions = {
  duration: 5000,
  icon: '🦊',
}

const successOptions = {
  duration: 5000,
  icon: '🎉',
}

const errorOptions = {
  duration: 3000,
  icon: '🐧',
}

const promiseOptions = {
  ...baseOptions,
  success: successOptions,
  error: errorOptions,
}

export function Toast({ type = undefined, message = 'không có thông báo!', promise, payloadMessage }) {
  if(type === 'promise') {
    toast[type](promise, payloadMessage, promiseOptions);
  }else if(type === undefined) {
    toast(message, { ...baseOptions, ...blankOptions });
  }else {
    const optionsType = type === 'success' ? successOptions : errorOptions;
    toast[type](message, { ...baseOptions, ...optionsType });
  }
}
