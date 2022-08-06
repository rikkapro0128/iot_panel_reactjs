import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container mx-auto px-4">
        {/* Navbar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img className="object-cover w-9" src="https://www.iotforall.com/wp-content/uploads/2017/05/IoT-For-All-Logo.png" alt="logo" />
            <h3 className="text-lg whitespace-nowrap ml-2 capitalize">manga node</h3>
          </div>
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
            <h5 className="text-gray-500 mt-5 text-sm">Với giao tiếp WebSocket cho khả năng giám sát, điều khiển realtime các thiết bị phần cứng</h5>
            <button onClick={() => { navigate('/sign/register') }} className="text-white bg-blue-500 p-3 rounded-full mt-5 text-md">Đăng ký trải nghiệm</button>
          </div>
          <div className="bg-hero-pattern bg-contain bg-no-repeat   bg-top h-80"></div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
