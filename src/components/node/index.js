import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "rsuite";
import { SensorDefault } from "@/components/sensor";
import { ButtonPush, Slider, ColorPicker } from "@/components/devices";
import { setProvider, updateSensor } from "@/store/nodeSlice";

import api from "@/api/index.js";

const getListDeviceAndSensor_PATH = (id) =>
  `api/node/${id}?sensors=true&devices=true`;
const pathConnectSocketServer = `${process.env.REACT_APP_SOCKET_SERVER_API_HOST}:${process.env.REACT_APP_SOCKET_SERVER_API_PORT}`;
const reverseColor = {
  'DHT21-temperature': true,
}
const rgbDeviceList = {
  'RGB-CHAIN-CIRCLE': true,
  'RGB-CHAIN-STRAIGHT': true,
}

function Node(props) {
  const dispatch = useDispatch();
  const idUser = useSelector((state) => state.user.idUser);
  const sensors = useSelector((state) => state.nodes.provider.sensors);
  const devices = useSelector((state) => state.nodes.provider.devices);
  const [stateConnect, setStateConnect] = useState(false);
  const [responseSocket, setResponseSocket] = useState(undefined);
  const [ws, setWs] = useState(
    () => new WebSocket(`${pathConnectSocketServer}?id-client=${idUser}`)
  );

  // console.log(idUser)
  // console.log(devices)
  // console.log(sensors)

  useEffect(() => {
    api.get(`${getListDeviceAndSensor_PATH(props["node-id"])}`).then((res) => {
      dispatch(setProvider({
        sensors: res.data.responseData.sensors,
        devices: res.data.responseData.devices,
      }));
    });
  }, [props["node-id"]]);

  useEffect(() => {
    // console.log("Server send message!");
    if(responseSocket?.type === '$payload_sensor') {
      dispatch(updateSensor(responseSocket.payload));
    }
  }, [responseSocket]);

  useEffect(() => {
    ws.onopen = () => {
      // console.log("Connected to Sever Socket!");
      setStateConnect(true);
    };

    ws.onmessage = ({ data }) => {
      setResponseSocket(JSON.parse(data));
    };

    ws.onerror = function (err) {
      setStateConnect(false);
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
        );
        ws.close();
    };

    ws.onclose = () => {
      setStateConnect(false);
      console.log("Lost Connection to Server Socket!");
      setTimeout(() => {
        setWs(
          () => new WebSocket(`${pathConnectSocketServer}?id-client=${idUser}`)
        );
      }, 1000);
    };
  }, [ws]);

  function changeValueDevice(device) {
    if(stateConnect) {
      device.type = 'controll';
      device.idNode = props["node-id"];
      // console.log(device);
      ws.send(JSON.stringify(device));
    }
  }

  return (
    <div>
      <h5>Thông số cảm biến</h5>
      <div className="grid md:grid-cols-3	lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2.5">
        {
          sensors.map(sensor => {
            return (
              <SensorDefault
                key={sensor.model}
                reverseColor={reverseColor[sensor.model]}
                ladder={100}
                size={150}
                value={typeof sensor.value === 'number' ? sensor.value.toFixed(1) : 0}
                unit={sensor.unit}
                title={sensor.name}
              />
            )
          })
        }
      </div>
      <h5 className="mt-2.5">Điều khiển thiết bị</h5>
      <div className="grid md:grid-cols-3	lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2.5">
        {
          devices.map(device => {
            if(device.model === 'RELAY') {
              return (
                <ButtonPush btnClick={changeValueDevice} idDevice={device.id} status={device.status} key={device.name + device.model} model={device.model} val={device.val} gpio={device.gpio} title={device.name} />
              )
            }else if(rgbDeviceList[device.model]) {
              return (
                <ColorPicker pickColor={changeValueDevice} idDevice={device.id} mode={device.mode} color={device.payload} key={device.name + device.model} val={device.val} gpio={device.gpio} title={device.name} />
              )
            }
          })
        }
        {/* <ButtonPush title="Đèn trần" />
        <Slider title="Đèn bếp" />
        <ColorPicker title="Led Strip" /> */}
      </div>
    </div>
  );
}

export { Node };
