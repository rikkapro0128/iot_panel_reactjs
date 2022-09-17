import { useEffect } from 'react';
import { Toast } from '@/instance/toast.js' ;
import toast from "react-hot-toast";

function Status({ name, status }) {

  useEffect(() => {
    if(status === 'offline') {
      Toast({ type: 'error', message: 'Node bị ngắt kết nối!' });
    }else {
      toast.dismiss();
      Toast({ type: 'success', message: 'Node đã kết nối!' });
    }
  }, [status])

  return (
    <div className="flex items-center py-2 px-4 rounded-full bg-[#1A1D27] w-fit">
      <p className="mr-2.5 whitespace-nowrap">Trạng thái { name }</p>
      <div className={`w-2 h-2 rounded-full ${ status === 'online' ? 'bg-green-400' : 'bg-gray-300' }`}></div>
    </div>
  )
}

export {
  Status,
}
