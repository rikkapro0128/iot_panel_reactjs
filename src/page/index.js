import { Link, useNavigate } from "react-router-dom";
import { Logo } from '@/components/logo';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container mx-auto px-4 mt-4">
        {/* Navbar */}
        <div className="flex items-center justify-between">
          <Logo />
          {/* Menu list */}
          <div className="flex space-x-6">
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">Tổng quan</div>
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">Sản phẩm</div>
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">Về chúng tôi</div>
            <div onClick={() => { navigate('/sign/login') }} className="text-sky-500 cursor-pointer hover:text-sky-400">Đăng nhập</div>
          </div>
        </div>
        {/* Introduce */}
        <div className="grid grid-cols-2 my-16">
          <div className="ml-2.5">
            <h3>Giải pháp hệ thống quản lí các thiết bị phần cứng IOT từ xa.</h3>
            <h5 className="text-gray-500 mt-5 text-sm">Hệ thống sử dụng giao tiếp WebSocket cho khả năng giám sát các cảm biến và điều khiển thời gian thực các thiết bị phần cứng</h5>
            <button onClick={() => { navigate('/sign/register') }} className="text-white bg-blue-500 p-3 rounded-full mt-5 text-md">Đăng ký trải nghiệm</button>
          </div>
          <div className="bg-hero-pattern bg-contain bg-no-repeat bg-top h-80 animate-[miru-breathing_2s_ease-in-out_infinite_alternate]"></div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
