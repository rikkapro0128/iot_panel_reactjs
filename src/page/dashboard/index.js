import { useEffect, useState } from "react";
import { Checkbox, Whisper } from 'rsuite';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Loader } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, removeNode } from "@/store/nodeSlice";

import { Logo } from "@/components/logo";
import { Node } from "@/components/node";
import { ModalInput } from "@/components/modal";
import { MenuPopover } from '@/components/popover';
import { IconBell, IconNode, IconAdd, IconMoreVertical } from "@/icons";
import api from "@/api/index.js";

const getListNode_PATH = "api/node/list";
const removeNodeByID_PATH = 'api/node/remove';

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

  function handleSelectMenu({ eventKey, actions, target }) {
    if(eventKey === 'delete') {
      api.delete(`${removeNodeByID_PATH}/${target.id}`).then(res => {
        const { idNode, message } = res.data;
        if(idNode && message === 'remove node successfull!') {
          dispatch(removeNode({ id: idNode }));
        }
      });
      actions.close();
    } 
  }

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
              {/* {nodeList.map(({ path, name }, index) => {
                return (
                  <div key={path} onClick={() => { navigate(`${parentPath}/${path}`) }} className={`cursor-pointer hover:text-slate-300 flex items-center justify-center relative ${ index > 0 ? `before:content-[''] before:absolute before:w-4/5 before:h-px before:bg-white before:top-[-1px]` : '' }`}>
                    <IconNode />
                    <p className="text-inherit text-center p-3.5" >
                      {name}
                    </p>
                  </div>
                );
              })} */}
              <div
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="cursor-pointer hover:text-slate-300 flex items-center justify-center relative"
              >
                <IconAdd />
                <p className="text-inherit p-3.5 ">Tổng quan</p>
              </div>
              <div
                onClick={() => {
                  setToggle(true);
                }}
                className="cursor-pointer hover:text-slate-300 flex items-center justify-center relative"
              >
                <IconAdd />
                <p className="text-inherit p-3.5 ">Add Node</p>
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
            {/* <Routes>
              {nodeList.map(node => {
                return <Route key={node.path} path={`${node.path}`} element={<Node node-payload={node} modifyStatus={(status) => { setStatusNode(status) }} />} />;
              })}
            </Routes> */}
            <div className="w-full bg-[#1A1D27] shadow-lg rounded-md border border-gray-200 mt-3.5">
              <header className="px-5 pt-4 border-b border-gray-100">
                <div className="font-semibold text-white">Quản lí Node</div>
              </header>

              <div className="overflow-x-auto p-3">
                <table className="table-auto w-full overflow-hidden rounded-md">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-[#1F2937]">
                    <tr>
                      <th className="p-2 text-left">
                        <Checkbox />
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">ID Node</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold  text-center">Tên Node</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold  text-center">Loại Modal</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-center">Cài đặt</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {
                      nodeList.length > 0
                        ? nodeList.map((node, index) => {
                            return (
                              <tr className={`p-2 ${index % 2 == 0 ? `bg-[#384152]` : `bg-[#1F2937]`}`} key={node._id}>
                                <td className="p-2">
                                  <Checkbox />
                                </td>
                                <td className="p-2">
                                  <div className="font-medium text-slate-400">
                                    {node._id}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="font-medium text-white">
                                    {node.name}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="text-center text-xs bg-[#A6F4D0] p-1 rounded-full text-[#225945]">
                                    {node.typeModal}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="flex justify-center relative">
                                    <MenuPopover id={ node._id } target={ { id: node._id } } handleSelect={ handleSelectMenu }>
                                      <IconMoreVertical className='cursor-pointer' />
                                    </MenuPopover>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      : <tr>
                          <td colspan="5" className="text-center p-4 bg-[#384152]">
                            Bạn chưa đăng ký node nào cả!
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
