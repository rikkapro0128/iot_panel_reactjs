/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Loader } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { setNodes } from "@/store/nodeSlice";

import { Logo } from "@/components/logo";
import { Node } from "@/components/node";
import General from '@/components/general';
import { ModalInput } from "@/components/modal";
import { IconBell, IconNode, IconAdd, IconGeneral } from "@/icons";
import api from "@/api/index.js";

const getListNode_PATH = "api/node/list";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [parentPath, setParentPath] = useState("/dashboard");
  const [statusNode, setStatusNode] = useState("disconnected");
  const nodeList = useSelector((state) => state.nodes.value);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    api.get(getListNode_PATH).then((res) => {
      dispatch(setNodes(res.data.node_list));
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <ModalInput
        toggle={toggle}
        changeToggle={() => {
          setToggle(false);
        }}
      />
      {isLoading ? (
        <Loader
          size="md"
          className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"
          content="Loading..."
        />
      ) : (
        <div className="container grid grid-cols-12 mx-auto px-4 mt-4 ">
          <div className="lg:col-span-3 md:col-span-3 sm:block hidden mr-4">
            <Logo
              onClick={() => {
                navigate(`/`);
              }}
            />
            <div className="mt-5 bg-[#292d33] py-2.5 rounded-lg">
              <div
                onClick={() => {
                  navigate("/dashboard/general");
                }}
                className="cursor-pointer hover:text-slate-300 flex items-center justify-center relative"
              >
                <IconGeneral fill="white" />
                <p className="text-inherit p-3.5 ">Tổng quan</p>
              </div>
              {nodeList.map(({ _id, name }, index) => {
                return (
                  <div key={_id} onClick={() => { navigate(`${parentPath}/node/${_id}`) }} className={`cursor-pointer hover:text-slate-300 flex items-center justify-center relative`}>
                    <IconNode />
                    <p className="text-inherit text-center p-3.5" >
                      {name}
                    </p>
                  </div>
                );
              })}
              <div
                onClick={() => {
                  setToggle(true);
                }}
                className="cursor-pointer hover:text-slate-300 flex items-center justify-center relative"
              >
                <IconAdd />
                <p className="text-inherit p-3.5 ">Thêm Node</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-9 md:col-span-9">
            <div className="flex justify-between	">
              <div
                className={`cursor-pointer h-fit px-2.5 py-1 flex items-center justify-between rounded-full ${
                  statusNode === "connected"
                    ? "bg-green-500 shadow-green-300/50"
                    : "bg-gray-500 shadow-gray-300/50"
                } shadow-md`}
              >
                <span className="mr-2">
                  {statusNode === "connected" ? "Đã kết nối" : "Ngắt kết nối"}
                </span>
                <p className="w-2 h-2 bg-white rounded-full"></p>
              </div>
              <div className="flex items-center">
                <IconBell className="mr-5" />
                <div className="w-10 h-10 shadow-md rounded-full shadow-gray-500/50">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src="https://tophinhanh.com/wp-content/uploads/2021/12/hinh-anime-nu-sieu-de-thuong.jpg"
                    alt="avatar"
                  />
                </div>
              </div>
            </div>
            <Routes>
              <Route path={`general`} element={<General nodeList={nodeList}/> }/>
              {
                nodeList.map(({ _id }) => {
                  return <Route key={_id} path={`node/${_id}`} element={<Node node-id={_id} modifyStatus={(status) => { setStatusNode(status) }} />} />;
                })
              }
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
