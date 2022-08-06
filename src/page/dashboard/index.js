import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Loader } from "rsuite";
import { Logo } from '@/components/logo';

function Dashboard() {
  const [isLoading, setIsLoadding] = useState(true);
  const [parentPath, setParentPath] = useState('/dashboard');
  const [nestPath, setNestPath] = useState([]);

  setTimeout(() => {
    setNestPath([
      {
        name: "Khu A",
        path: "area-a",
      },
      {
        name: "Khu B",
        path: "area-b",
      },
      {
        name: "Khu C",
        path: "area-c",
      },
      {
        name: "Khu D",
        path: "area-d",
      },
    ]);
    setIsLoadding(false);
  }, 0);
  return (
    <>
      {isLoading ? (
        <Loader
          size="md"
          className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"
          content="Loading..."
        />
      ) : (
        <div className="container grid grid-cols-12 mx-auto px-4">
          <div className="col-span-2">
            <Logo />
            <div className="mt-2.5 flex flex-col">
              {nestPath.map(({ path, name }) => {
                return (
                  <Link className="ml-5 p-2" key={path} to={`${parentPath}/${path}`}>
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="col-span-10">
            <Routes>
              {nestPath.map(({ path }) => {
                return <Route key={path} path={`${path}`} element={<Node />} />;
              })}
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

function Node() {
  return <h1>node esp8266</h1>;
}

export default Dashboard;
