import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import Divider from "@mui/material/Divider";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { IconWave } from "@/icons";

const sever = process.env.REACT_APP_SERVER_API_HOST;
const logoMobile = `${sever}/static/common/iot.svg`;

const payloadLandingPage = {
  intro: "Giải pháp hệ thống quản lí các thiết bị phần cứng IOT từ xa",
  decription:
    "Hệ thống sử dụng giao tiếp WebSocket cho khả năng giám sát các cảm biến và điều khiển thời gian thực các thiết bị phần cứng",
  module: [
    {
      img: `${sever}/static/chip/esp01.svg`,
      title: "ESP-01",
    },
    {
      img: `${sever}/static/chip/esp8266.svg`,
      title: "ESP8266",
    },
    {
      img: `${sever}/static/chip/esp12e.svg`,
      title: "ESP-12E",
    },
    {
      img: `${sever}/static/chip/esp201.svg`,
      title: "ESP-201",
    },
  ],
  realtime: {
    title: "Xử lí dữ liệu realtime",
    sub: "Tối ưu trải nghiệm người dùng",
    items: [
      {
        title: 'Gửi yêu cầu',
        img: `${sever}/static/common/realtime1.svg`
      },
      {
        title: 'Tính toán dữ liệu',
        img: `${sever}/static/common/realtime2.svg`
      },
      {
        title: 'Trả kết quả',
        img: `${sever}/static/common/realtime3.svg`
      },
    ],
  },
};

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.document.title = "Miru | Home Page";
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4 mt-4">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-6">
          <Logo className="max-sm:hidden" />
          {/* Menu list */}
          <div className="flex space-x-6 max-sm:hidden">
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">
              Tổng quan
            </div>
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">
              Sản phẩm
            </div>
            <div className="text-sky-500 cursor-pointer hover:text-sky-400">
              Về chúng tôi
            </div>
            <div
              onClick={() => {
                navigate("/dashboard/general");
              }}
              className="text-sky-500 cursor-pointer hover:text-sky-400"
            >
              Dashboard
            </div>
            <div
              onClick={() => {
                navigate("/sign/login");
              }}
              className="text-sky-500 cursor-pointer hover:text-sky-400"
            >
              Đăng nhập
            </div>
          </div>
          {/* bg surface by logo */}
          <div className="w-full h-40 hidden max-sm:block bg-green-400 scale-[1.7] rounded-b-full mb-20">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <p className="text-center text-gray-900 mb-2.5 font-bold">
                Quản lí phần cứng <br /> IOT của bạn
              </p>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <img className="w-12 h-auto" src={logoMobile} alt="logo" />
              </div>
            </div>
          </div>
        </div>
        {/* Introduce moblie */}
        <div className="hidden max-sm:block grid grid-cols-2 my-16 mt-6">
          <div className="col-span-full">
            <h3 className="text-center">{payloadLandingPage.intro}</h3>
            <h5 className="text-gray-500 mt-5 text-sm text-center">
              {payloadLandingPage.decription}
            </h5>
          </div>
          <Divider sx={{ marginY: "1.5rem" }} light={true}>
            CÓ GÌ HOT
          </Divider>
          {/* surport module */}
          <h5 className="text-center mb-6">Hỗ trợ các MCU adafruit</h5>
          <ImageList
            sx={{ width: "100%", height: "auto" }}
            variant="masonry"
            cols={2}
            gap={5}
          >
            {payloadLandingPage.module.map((item) => (
              <ImageListItem
                key={item.img}
                cols={item.cols || 1}
                rows={item.rows || 1}
              >
                <img
                  className="animate-[load-smooth_200ms_ease-in-out_alternate]"
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar title={item.title} />
              </ImageListItem>
            ))}
          </ImageList>
          {/* surport realtime */}
          <h5 className="text-center mb-6">
            {payloadLandingPage.realtime.title}
          </h5>
          <div className="w-screen my-14 -mx-4 bg-green-400">
            <IconWave className={"waves -translate-y-full"} />
            <div className="flex whitespace-nowrap">
              {payloadLandingPage.realtime.items.map((item) => {
                return (
                  <div className="w-1/3">
                    <img
                      className="w-4/6 aspect-square object-cover m-auto block"
                      src={item.img}
                      alt="realtime"
                      loading="lazy"
                    />
                    <p className="text-center text-gray-50 mt-2">{ item.title }</p>
                  </div>
                );
              })}
            </div>
            <IconWave
              className={"waves translate-y-full rotate-180 relative bottom-2"}
            />
          </div>
          <button
            onClick={() => {
              navigate("/sign/register");
            }}
            className="text-white bg-blue-500 p-3 rounded-full mt-5 text-md"
          >
            Đăng ký trải nghiệm
          </button>
          {/* <div className="bg-hero-pattern bg-contain bg-no-repeat bg-top h-80"></div> */}
        </div>
        {/* Introduce moblie desktop */}
        <div className="hidden min-md:grid grid-cols-2 my-16">
          <div className="mr-5">
            <h3 className="">{payloadLandingPage.intro}</h3>
            <h5 className="text-gray-500 mt-5 text-sm text-center">
              {payloadLandingPage.decription}
            </h5>
            <button
              onClick={() => {
                navigate("/sign/register");
              }}
              className="text-white bg-blue-500 p-3 rounded-full mt-5 text-md"
            >
              Đăng ký trải nghiệm
            </button>
          </div>
          <div className="bg-hero-pattern bg-contain bg-no-repeat bg-top h-80"></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
