import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "rsuite";
import { setProviderSensors, setProviderDevices, updateSensor, updateDevice, setStatusNode } from "@/store/nodeSlice";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Toast } from '@/instance/toast.js';

import { SensorDefault } from "@/components/sensor";
import { ButtonPush, Slider, ColorPicker } from "@/components/devices";
import { MaterialDefaultModal } from "@/components/modal";
import { Status } from "@/components/status";
import { ChartSensor } from '@/components/charts/sensor.js';

import { cacheImage } from '@/utils';

import api from "@/api/index.js";

const getPayloadChartSensor_PATH = (id, params) => `api/node/sensor/v2/${id}/chart${params}`;
const getListDeviceAndSensor_PATH = (id) =>
  `api/node/${id}?sensors=true&devices=true`;
const pathConnectSocketServer = `${process.env.REACT_APP_SOCKET_SERVER_API_HOST}`;

const reverseColor = {
  'DHT21-temperature': true,
}
const rgbDeviceList = {
  'RGB-CHAIN-CIRCLE': true,
  'RGB-CHAIN-STRAIGHT': true,
}

const InstanceTimeline = [
  {
    key: 'second',
    value: 'Giây'
  },
  {
    key: 'minute',
    value: 'Phút'
  },
  {
    key: 'hour',
    value: 'Giờ'
  },
  {
    key: 'date',
    value: 'Ngày'
  },
  {
    key: 'week',
    value: 'Tuần'
  },
  {
    key: 'month',
    value: 'Tháng'
  },
]

const levelTimeline = {
  'minute': 1,
  'hour': 2,
  'date': 3,
  'week': 4,
  'month': 5,
}

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
  const [optionsQueryChart, setOptionsQueryChart] = useState({ timeline: 'hour', sort: 'asc', range: 2 * 60, type: 'second' });
  const [dense, setDense] = useState(false);
  const [loadImageModal, setLoadImageModal] = useState(true); // true is loading
  const [payloadModal, setPayloadModal] = useState(undefined);
  const [pickSensor, setPickSensor] = useState(undefined);
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
  // console.log(sensors)
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
      }else {
        setStatusProviderSensor(false);
        dispatch(setProviderSensors(sensors));
      }
      if(devices.length > 0) { 
        setStatusProviderDevice(true);
        dispatch(setProviderDevices(devices));
      }else {
        setStatusProviderDevice(false);
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
    }else if(responseSocket?.type === '$response_devices') {
      dispatch(updateDevice(responseSocket.payload))
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

  useEffect(() => {
    if(pickSensor) {
      requestChartSensor();
    }
  }, [pickSensor])

  function requestChartSensor() {
    const transformRange = (range, type) => {
      if(type === 'second') {
        return range
      }
      else if(type === 'minute') {
        return range * 60;
      }
      else if(type === 'hour') {
        return range * 3600;
      }
      else if(type === 'date') {
        return range * 86400;
      }
      else if(type === 'week') {
        return range * 86400;
      }
      else if(type === 'month') {
        return range * 604800;
      }
    }
    const params = `?timeline=${optionsQueryChart.timeline}&sort=${optionsQueryChart.sort}&range=${transformRange(optionsQueryChart.range, optionsQueryChart.type)}`
    const url = getPayloadChartSensor_PATH(pickSensor.id, params);
    api.get(url).then(response => {
      // console.log(response.data.payload);
      setPayloadChartSensor({ payload: response.data.payload, ...pickSensor });
    })
  }

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
      if(payloadChartSensor) { setPayloadChartSensor(undefined); }
      setPickSensor(sensor);
    }else {
      Toast({ message: 'Chức năng hiện chưa có!' });
    }
    actions.close();
  }

  function handleChangeChartTimeline(event) {
    setOptionsQueryChart({ ...optionsQueryChart, timeline: event.target.value })
  }

  function handleChangeChartSort(event) {
    setOptionsQueryChart({ ...optionsQueryChart, sort: event.target.value })
  }

  function handleChangeChartRange(event) {
    const range = event.target.value;
    setOptionsQueryChart({ ...optionsQueryChart, range: range ? parseInt(range) : 0 })
  }

  function handleChangeChartType(event) {
    setOptionsQueryChart({ ...optionsQueryChart, type: event.target.value })
  }

  return (
    <div>
      <MaterialDefaultModal open={openModalChartsSensor} handleClose={() => { setOpenModalChartsSensor(false); setPickSensor(undefined); }}>
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
              <InputLabel id="demo-select-small">Hiển thị</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={optionsQueryChart.timeline}
                label="Hiển thị"
                onChange={handleChangeChartTimeline}
              >
                <MenuItem value={'minute'}>1 phút trước</MenuItem>
                <MenuItem selected value={'hour'}>1 giờ trước</MenuItem>
                <MenuItem value={'date'}>1 ngày trước</MenuItem>
                <MenuItem value={'week'}>1 tuần trước</MenuItem>
                <MenuItem value={'month'}>1 tháng trước</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
              <InputLabel id="demo-select-small">Sắp xếp</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={optionsQueryChart.sort}
                label="Sắp xếp"
                onChange={handleChangeChartSort}
              >
                <MenuItem selected value={'asc'}>Tăng dần</MenuItem>
                <MenuItem value={'desc'}>Giảm dần</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ m: 1, width: 100 }}
                id="outlined-error"
                label="Lấy mẫu"
                defaultValue={optionsQueryChart.range}
                size="small"
                type="number"
                onChange={handleChangeChartRange}
            />
            <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
              <InputLabel id="demo-select-small">Đơn vị</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={optionsQueryChart.type}
                label="Đơn vị"
                onChange={handleChangeChartType}
              >
                {
                  Array(levelTimeline[optionsQueryChart.timeline]).fill(0).map((item, index) => {
                    return <MenuItem key={InstanceTimeline[index].key} selected={ index === 0 ? true : false } value={InstanceTimeline[index].key}>Theo { InstanceTimeline[index].value }</MenuItem>
                  })
                }
              </Select>
            </FormControl>
            <Button sx={{ m: 1 }} className="whitespace-nowrap" onClick={requestChartSensor} variant="contained">Áp dụng</Button>
          </Box>
          <div className="w-full relative pt-[100%] text-center mt-8">
            <ChartSensor className={'w-full'} sensor={payloadChartSensor} label={payloadChartSensor?.name} />
          </div>
        </>
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
                <ListItemText
                  primary="Tên Sensor"
                  secondary={payloadModal?.name}
                  color={'#fff'}
                />
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
      <Status name={`node ${props['node-id'].split('').map((char, index, chars) => (index < chars.length / 2) ? '*' : char).join('')}`} status={statusNode} />
      <h5 className="flex items-center my-5">
        <LocalOfferIcon className="mr-2.5"/>
        Thông số cảm biến
      </h5>
      <div className="grid ss:grid-cols-2 sm:grid-cols-3 2md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                    model={sensor.model}
                    handleOptions={(ref) => { handleOptionsBySensor(ref, sensor) }}
                  />
                )
              })
            :
            (
              <div className="col-span-full animate-[load-smooth_200ms_ease-in-out_alternate]">
                <img className="block w-40 h-auto m-auto" src={`${process.env.REACT_APP_SERVER_API_HOST}/static/common/oops.svg`} alt="dragon" />
                <p className="text-lg	text-center mt-5 italic">Không có cảm biến nào được tìm thấy!</p>
              </div>
            )
          )
        }
      </div>
      <h5 className="flex items-center my-5">
        <LocalOfferIcon className="mr-2.5"/>
        Điều khiển thiết bị
      </h5>
      <div className="grid ss:grid-cols-2 sm:grid-cols-3 2md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                      <ButtonPush btnClick={changeValueDevice} idDevice={device?.id} status={device?.status} key={device._id || device.id} model={device?.model} val={device?.val} gpio={device?.gpio} title={device?.softName || device?.val} />
                    )
                  }else if(rgbDeviceList[device?.model]) {
                    return (
                      <ColorPicker pickColor={changeValueDevice} idDevice={device?.id} mode={device?.mode} color={device?.payload} key={device._id || device.id} val={device?.val} gpio={device?.gpio} title={device?.name} />
                    )
                  }
                })
              :
              (
                <div className="col-span-full animate-[load-smooth_200ms_ease-in-out_alternate]">
                  <img className="block w-40 h-auto m-auto" src={`${process.env.REACT_APP_SERVER_API_HOST}/static/common/oops.svg`} alt="dragon" />
                  <p className="text-lg	text-center mt-5 italic">Không có thiết bị nào được tìm thấy!</p>
                </div>
              )
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
