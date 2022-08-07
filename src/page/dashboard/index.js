import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Loader } from "rsuite";

import { Logo } from '@/components/logo';
import { Node } from '@/components/node';
import { ModalInput } from '@/components/modal';
import { IconBell, IconNode, IconAdd } from '@/icons';

function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoadding] = useState(true);
  const [parentPath, setParentPath] = useState('/dashboard');
  const [statusNode, setStatusNode] = useState('disconnected');
  const [nodeList, setNodelist] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNodelist([
        {
          id: '1659837240870',
          name: "Khu A",
          path: "area-a",
          status: 'disconnected',
        },
        {
          id: '1659837268292',
          name: "Khu B",
          path: "area-b",
          status: 'connected',
        },
        {
          id: '1659837283701',
          name: "Khu C",
          path: "area-c",
          status: 'disconnected',
        },
        {
          id: '1659837275707',
          name: "Khu D",
          path: "area-d",
          status: 'connected',
        },
      ]);
      setIsLoadding(false);
    }, 0);
  }, [])

  return (
    <>
      <ModalInput toggle={toggle} changeToggle={() => { setToggle(false) }} />
      {isLoading ? (
        <Loader
          size="md"
          className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"
          content="Loading..."
        />
      ) : (
        <div className="container grid grid-cols-12 mx-auto px-4 mt-4 ">
          <div className="lg:col-span-2 md:col-span-3 sm:block hidden mr-4">
            <Logo onClick={() => { navigate(`/`) }} />
            <div className="mt-5 bg-blue-500 py-2.5 rounded-lg">
              {nodeList.map(({ path, name }, index) => {
                return (
                  <div key={path} onClick={() => { navigate(`${parentPath}/${path}`) }} className={`cursor-pointer hover:text-slate-300 flex items-center justify-center relative ${ index > 0 ? `before:content-[''] before:absolute before:w-4/5 before:h-px before:bg-white before:top-[-1px]` : '' }`}>
                    <IconNode />
                    <p className="text-inherit text-center p-3.5" >
                      {name}
                    </p>
                  </div>
                );
              })}
              <div onClick={() => { setToggle(true) }} className="cursor-pointer hover:text-slate-300 flex items-center justify-center relative before:content-[''] before:absolute before:w-4/5 before:h-px before:bg-white before:top-[-1px]">
                <IconAdd />
                <p className="text-inherit p-3.5 ">
                  Add Node
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-10 md:col-span-9">
            <div className="flex justify-between	">
              <div className={`cursor-pointer h-fit px-2.5 py-1 flex items-center justify-between rounded-full ${statusNode === 'connected' ? 'bg-green-500 shadow-green-300/50' : 'bg-gray-500 shadow-gray-300/50'} shadow-md`}>
                <span className="mr-2">{ statusNode === 'connected' ? 'Đã kết nối' : 'Ngắt kết nối'}</span>
                <p className="w-2 h-2 bg-white rounded-full"></p>
              </div>
              <div className="flex items-center">
                <IconBell className="mr-5" />
                <div className="w-10 h-10 shadow-md rounded-full shadow-gray-500/50">
                  <img className="w-full h-full object-cover rounded-full" src="https://tophinhanh.com/wp-content/uploads/2021/12/hinh-anime-nu-sieu-de-thuong.jpg" alt="avatar" />
                </div>
              </div>
            </div>
            <div className="">
              <Routes>
                {nodeList.map(node => {
                  return <Route key={node.path} path={`${node.path}`} element={<Node node-payload={node} modifyStatus={(status) => { setStatusNode(status) }} />} />;
                })}
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
