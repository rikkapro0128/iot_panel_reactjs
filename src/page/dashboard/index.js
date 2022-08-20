/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Loader, Steps, Avatar, Badge, Whisper, Popover } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { setNodes } from "@/store/nodeSlice";

import { Logo } from "@/components/logo";
import { Node } from "@/components/node";
import General from '@/components/general';
import { ModalInputNode, ModalDynamic } from "@/components/modal";
import MenuPopover from '@/components/popover';
import { IconBell, IconNode, IconAdd, IconGeneral, IconUser, IconPassword, IconLogout } from "@/icons";
import api from "@/api/index.js";

const getListNode_PATH = "api/node/list";
const getInfoUser_PATH = "api/user/info";
const dataDropDown = [
  {
    eventKey: 'info',
    name: 'Thông tin của bạn',
    Icon: IconUser,
  },
  {
    eventKey: 'change-password',
    name: 'Đổi mật khẩu',
    Icon: IconPassword,
  },
  {
    eventKey: 'logout',
    name: 'Đăng xuất',
    Icon: IconLogout,
  },
]

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [parentPath, setParentPath] = useState("/dashboard");
  const [statusNode, setStatusNode] = useState("disconnected");
  const nodeList = useSelector((state) => state.nodes.value);
  const [toggle, setToggle] = useState(false);
  const [toggleModalUser, setToggleModalUser] = useState(false);
  const [infoUser, setInfoUser] = useState(undefined);
  const refMenuUser = useRef();

  useEffect(() => {
    api.get(getListNode_PATH).then((res) => {
      dispatch(setNodes(res.data.node_list));
      setIsLoading(false);
    });
  }, []);

  function handleSelectMenu({ eventKey, actions, target }) {
    if(eventKey === 'info') {
      setToggleModalUser(true);
      // call API get user info
      actions.close();
      api.get(getInfoUser_PATH).then((res) => {
        setInfoUser(res.data.user);
      });
    }
  }

  function hanldeModalInfoClose() {
    setToggleModalUser(false);
    if(infoUser) {
      setInfoUser(undefined);
    }
  }

  return (
    <>
      <ModalDynamic size="xs" title={dataDropDown[0].name} isControll={false} open={toggleModalUser} handleClose={hanldeModalInfoClose}>
        {
          infoUser
            && 
          <div className='flex justify-start'>
            <div className="mr-5">
              <Avatar
                size="lg"
                circle
                src="https://avatars.githubusercontent.com/u/12592949"
                alt="@SevenOutman"
              />
            </div>
            <div className="miru--info">
              <Steps vertical small>
                <Steps.Item status={'finish'} title="ID tài khoản" description={infoUser?._id || 'Chưa có id' } />
                <Steps.Item status={'finish'} title="Tên tài khoản" description={ infoUser?.name || 'Chưa có tên' } />
                <Steps.Item status={'finish'} title="Email" description={ infoUser?.email || 'Chưa có email' } />
              </Steps>
            </div>
          </div>
        }
      </ModalDynamic>
      <ModalInputNode
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
        <div className="lg:max-w-7xl mx-auto px-4 mt-4 ">
          <div className="flex justify-between mb-5">
            <Logo />
            <div className="grid grid-cols-2 gap-x-6 items-center">
              <Badge className="cursor-pointer flex justify-center items-center" content="99+" color="blue">
                <IconBell />
              </Badge>
              <MenuPopover
                id={'controll-id-user-dropdown'}
                target={'user-dropdown'}
                placement={'bottomEnd'}
                dataDropDown={dataDropDown}
                handleSelect={handleSelectMenu}
              >
                <Avatar circle className="cursor-pointer" size="sm" src="https://avatars.githubusercontent.com/u/12592949" alt="@superman66" />
              </MenuPopover>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="lg:col-span-3 md:col-span-3 xl:col-span-2 md:block hidden mr-4">
              <div className="bg-[#1A1D27] py-2.5 rounded-lg">
                <div
                  onClick={() => {
                    navigate("/dashboard/general");
                  }}
                  className="cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative"
                >
                  <IconGeneral fill="white" />
                  <p className="text-inherit p-3.5 ">Tổng quan</p>
                </div>
                {nodeList.map(({ _id, name }, index) => {
                  return (
                    <div key={_id} onClick={() => { navigate(`${parentPath}/node/${_id}`) }} className={`cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative whitespace-nowrap	`}>
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
                  className="cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative"
                >
                  <IconAdd />
                  <p className="text-inherit p-3.5 ">Thêm Node</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-9 md:col-span-9 xl:col-span-10 col-span-12">
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
        </div>
      )}
    </>
  );
}

export default Dashboard;
