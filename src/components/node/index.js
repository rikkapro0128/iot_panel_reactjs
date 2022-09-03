import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "rsuite";
import { setProviderSensors, setProviderDevices, updateSensor, setStatusNode } from "@/store/nodeSlice";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toast } from '@/instance/toast.js';

import { SensorDefault } from "@/components/sensor";
import { ButtonPush, Slider, ColorPicker } from "@/components/devices";
import { MaterialDefaultModal } from "@/components/modal";
import { Status } from "@/components/status";
import { ChartSensor } from '@/components/charts/sensor.js';

import { cacheImage } from '@/utils';


import api from "@/api/index.js";

const getPayloadChartSensor_PATH = (id, options) => `api/node/sensor/${id}/chart?${options.reduce((present, option, index) => index ? `${present}&${option.field}=${option.value}` : `${option.field}=${option.value}`, '')}`;
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

const theme = createTheme({
  components: {
    // Name of the component
    MuiListItemText: {
      styleOverrides: {
        // Name of the slot
        secondary: {
          // Some CSS
          color: '#ccc',
        },
      },
    },
  },
});

const fakeDataDescSensor = {
  'DHT21-temperature': {
    name: 'Cảm biến nhiệt độ',
    image: 'https://cdn.shopify.com/s/files/1/0595/4132/3926/products/SMSTemperaturesensorforS270_S272_large.png?v=1636581113',
    desc: [
      'Model: AM2301',
      'Độ phân giải chính xác: 0.1',
      'Khoảng đo: 0-100% RH',
      'Đo lường chính xác nhiệt độ: ± 0.5 ℃'
    ]
  },
  'DHT21-humidity': {
    name: 'Cảm biến độ ẩm',
    image: 'https://cdn.shopify.com/s/files/1/0595/4132/3926/products/SMSTemperaturesensorforS270_S272_large.png?v=1636581113',
    desc: [
      'Model: AM2301',
      'Độ phân giải chính xác: 0.1',
      'Khoảng đo: 0-100% RH',
      'Đo lường chính xác độ ẩm: ± 3% RH'
    ]
  },
  'MQ2': {
    name: 'Cảm biến khí gas MQ2',
    image: 'https://cdn-reichelt.de/bilder/web/xxl_ws/A300/MQ2-1.png',
    desc: [
      'Điện áp hoạt động +5V',
      'Điện áp đầu ra tuần tự: 0V đến 5V',
      'Điện áp đầu ra kỹ thuật số: 0V hoặc 5V (TTL Logic)',
      'Thời gian làm nóng 20 giây',
      'Trọng lượng: 10 g'
    ]
  }
}

function Node(props) {
  const dispatch = useDispatch();
  const [openModalDetailsSensor, setOpenModalDetailsSensor] = useState(false);
  const [openModalChartsSensor, setOpenModalChartsSensor] = useState(false);
  const [payloadChartSensor, setPayloadChartSensor] = useState(undefined);
  const [dense, setDense] = useState(false);
  const [loadImageModal, setLoadImageModal] = useState(true); // true is loading
  const [payloadModal, setPayloadModal] = useState(undefined);
  const [statusProviderSensor, setStatusProviderSensor] = useState(false);
  const [statusProviderDevice, setStatusProviderDevice] = useState(false);
  const idUser = useSelector((state) => state.user.idUser);
  const statusNode = useSelector((state) => state.nodes.status);
  const sensors = useSelector((state) => state.nodes.provider.sensors);
  const devices = useSelector((state) => state.nodes.provider.devices);
  const [loading, setLoading] = useState(true);
  const [stateConnect, setStateConnect] = useState(false);
  const [responseSocket, setResponseSocket] = useState(undefined);
  const [ws, setWs] = useState(
    () => new WebSocket(`${pathConnectSocketServer}?id-client=${idUser}`)
  );

  // console.log(payloadChartSensor)
  // console.log(devices)
  // console.log(statusProviderSensor, statusProviderDevice)
  useEffect(() => {
    window.document.title = 'Miru | Node Page';
  }, [])

  useEffect(() => {
    if(!loading) { setLoading(true) };
    api.get(`${getListDeviceAndSensor_PATH(props["node-id"])}`).then((res) => {
      const { sensors, devices } = res.data.responseData;
      if(sensors.length > 0) { 
        setStatusProviderSensor(true);
        dispatch(setProviderSensors(sensors));
      }
      if(devices.length > 0) { 
        setStatusProviderDevice(true);
        dispatch(setProviderDevices(devices));
      }
      setLoading(false);
      dispatch(setStatusNode(res.data.responseData.socketStatus));
    });
  }, [props["node-id"]]);

  useEffect(() => {
    // console.log("Server send message!");
    if(responseSocket?.type === '$payload_sensor') {
      dispatch(updateSensor(responseSocket.payload));
    }else if(responseSocket?.type === '$status_node' && responseSocket?.id === props['node-id']) {
      dispatch(setStatusNode(responseSocket.status));
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

  function handleOptionsBySensor({ eventKey, actions }, sensor) {
    // console.log(eventKey, sensor);
    if(eventKey === 'detail-sensor') {
      setPayloadModal(fakeDataDescSensor[sensor.model]);
      setOpenModalDetailsSensor(true);
      // console.log(fakeDataDescSensor[sensor.model].image);
      cacheImage(fakeDataDescSensor[sensor.model].image, (status) => {
        setLoadImageModal(status);
      })
    }else if(eventKey === 'view-chart') {
      setOpenModalChartsSensor(true);
      setPayloadChartSensor(undefined);
      api.get(getPayloadChartSensor_PATH(sensor.id, [{ field: 'timeline', value: 'hour'}, { field: 'sort', value: 'asc' }])).then(response => {
        setPayloadChartSensor({ payload: response.data.payload, ...sensor });
      })
    }else {
      Toast({ message: 'Chức năng hiện chưa có!' });
    }
    actions.close();
  }

  return (
    <div>
      <MaterialDefaultModal open={openModalChartsSensor} handleClose={() => { setOpenModalChartsSensor(false) }}>
        <ChartSensor sensor={payloadChartSensor} label={payloadChartSensor?.name} />
      </MaterialDefaultModal>
      <MaterialDefaultModal open={openModalDetailsSensor} handleClose={() => { setOpenModalDetailsSensor(false) }}>
        <div className="flex">
          <div className="max-w-[190px] w-[190px] pt-16 text-center">
            {
              loadImageModal 
                ?
                  (<Loader
                    size="md"
                    className="col-span-full text-center"
                    content="Loading..."
                  />)
                :
                  <img className='w-full animate-[load-smooth_200ms_ease-in-out_alternate]'  src={payloadModal?.image} alt="sensor" />
            }
          </div>
          <List className='select-none' dense={dense}>
            <ListItem>
              <LabelImportantIcon  sx={{ mx: 2 }} className='text-white' />
              <ThemeProvider theme={theme}>
                <ListItemText
                  primary="Tên Sensor"
                  secondary={payloadModal?.name}
                  color={'#fff'}
                />
              </ThemeProvider>
            </ListItem>
              {
                payloadModal?.desc.map(desc => {
                  return (
                    <ListItem key={desc}>
                      <LabelImportantIcon sx={{ mx: 2 }} className='text-white' />
                      <ListItemText
                        primary={desc}
                        color={'#fff'}
                      />
                    </ListItem>
                  )
                })
              }
          </List>
        </div>
      </MaterialDefaultModal>
      <Status name={`node ${props['node-id']}`} status={statusNode} />
      <h5 className="mt-2.5">Thông số cảm biến</h5>
      <div className="grid md:grid-cols-3	lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2.5">
      {
        loading
          ? 
          (<Loader
            size="md"
            className="col-span-full text-center"
            content="Loading..."
          />)
          :
          (statusProviderSensor 
            ?
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
                    handleOptions={(ref) => { handleOptionsBySensor(ref, sensor) }}
                  />
                )
              })
            :
              <p>Không tìm thấy sensor nào cả!</p>
          )
        }
      </div>
      <h5 className="mt-2.5">Điều khiển thiết bị</h5>
      <div className="grid md:grid-cols-3	lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2.5">
        {
          loading
          ? 
            (<Loader
              size="md"
              className="col-span-full text-center"
              content="Loading..."
            />)
          : 
           (
            statusProviderDevice
              ?
                devices.map(device => {
                  if(device?.model === 'RELAY') {
                    return (
                      <ButtonPush btnClick={changeValueDevice} idDevice={device?.id} status={device?.status} key={device._id || device.id} model={device?.model} val={device?.val} gpio={device?.gpio} title={device?.name} />
                    )
                  }else if(rgbDeviceList[device?.model]) {
                    return (
                      <ColorPicker pickColor={changeValueDevice} idDevice={device?.id} mode={device?.mode} color={device?.payload} key={device._id || device.id} val={device?.val} gpio={device?.gpio} title={device?.name} />
                    )
                  }
                })
              :
                <p>Không tìm thấy device nào cả!</p>
            )
        }
        {/* <ButtonPush title="Đèn trần" />
        <Slider title="Đèn bếp" />
        <ColorPicker title="Led Strip" /> */}
      </div>
    </div>
  );
}

export { Node };
