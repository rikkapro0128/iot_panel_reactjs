import toast from "react-hot-toast";

export function Toast({ type = 'success', message = 'không có thông báo!', option = {
  success: {
    duration: 5000,
    icon: "👌",
  },
  error: {
    duration: 2000,
    icon: "🐧",
  },
  position: "bottom-right",
  style: {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  },
}, promise, payloadMessage }) {
  if(type === 'promise') {
    toast[type](promise, payloadMessage, option);
  }else {
    toast[type](message, option);
  }
}
