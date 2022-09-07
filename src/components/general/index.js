import { useState, useEffect, useRef } from "react";
import api from "@/api/index.js";
import { useDispatch, useSelector } from "react-redux";
import { removeNode } from "@/store/nodeSlice";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

import { MaterialDefaultModal } from "@/components/modal";
import MenuPopover from '@/components/popover';
import Hidden from '@/components/hidden';

const removeNodeByID_PATH = 'api/node/remove';
const dataDropDown = [
  {
    eventKey: 'settings',
    name: 'Cài đặt',
    Icon: <SettingsIcon />,
  },
  {
    eventKey: 'delete',
    name: 'Xóa node',
    Icon: <DeleteIcon />,
  },
  {
    eventKey: 'about',
    name: 'Thông tin node',
    Icon: <InfoIcon />,
  },
]

const ModelDefault = [
  'esp8266',
  'esp32',
  'arduino-wifi',
]

function General({ nodeList }) {

  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [modalNode, setModalNode] = useState(false);
  const [optionsNode, setOptionsNode] = useState(() => ({ model: ModelDefault[0] }));
  const [chooseNode, setChooseNode] = useState('');
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const [nodeID, setNodeID] = useState(() => nodeList.map(node => node._id));
  const eleRefs = useRef({});

  useEffect(() => {
    if(isAll) {
      for(const checkbox in eleRefs.current) {
        eleRefs.current[checkbox].checked = statusCheckAll;
      }
    }
  }, [statusCheckAll])

  useEffect(() => {
    if(checked.length === nodeID.length) {
      if(!statusCheckAll) {
        setStatusCheckAll(true);
        setIsAll(true);
      }
    }else {
      if(statusCheckAll) {
        setStatusCheckAll(false);
        setIsAll(false);
        eleRefs.current['all'].checked = false;
      }
    }
  }, [checked])

  function handleCheckAll(ele) {
    if(ele.target.checked) {
      setChecked(nodeID);
      setStatusCheckAll(true);
    }else {
      setChecked([]);
      setStatusCheckAll(false);
    }
    if(!isAll) {
      setIsAll(true);
    }
  }

  function handleCheckSingle(ele) {
    const type = ele.target.checked;
    const value = ele.target.value;
    if(type) {
      setChecked([...checked, value]);
    }else {
      if(checked.includes(value)) {
        setChecked(() => {
          return checked.filter(target => target !== value);
        });
      }
    }
    if(isAll) {
      setIsAll(false);
    }
  }

  function handleSelectMenu({ eventKey, actions, target }) {
    if(eventKey === 'delete') {
      api.delete(`${removeNodeByID_PATH}/${target.id}`).then(res => {
        const { idNode, message } = res.data;
        if(idNode && message === 'remove node successfull!') {
          dispatch(removeNode({ id: idNode }));
        }
      });
    }else if(eventKey === 'settings') {
      setChooseNode(target.id);
      setModalNode(true);
    }
    actions.close();
  }

  function handleChangeOptionsNode() {

  }

  return (
    <>
      {/* modal setting node */}
      {/* modalNode */}
      <MaterialDefaultModal open={ true } handleClose={ () => { setModalNode(false) } }>
        <h5>Cài đặt node: { chooseNode }</h5>
        <div className="lg:min-w-[500px]">
          <Grid sx={{ marginY: '0.5rem' }} container spacing={2}>
            <Grid xs={7}>
              <TextField size="small" id={`name-node-${chooseNode}`} label="Tên node" variant="outlined" />
            </Grid>
            <Grid xs={5}>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={ModelDefault[0]}
                  label="Model"
                  onChange={handleChangeOptionsNode}
                >
                  {
                    ModelDefault.map(model => {
                      return (
                        <MenuItem key={model} value={model}>{ model }</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </MaterialDefaultModal>
      <div className="w-full bg-[#1A1D27] shadow-lg rounded-md border border-gray-200 animate-[load-smooth_200ms_ease-in-out_alternate]">
        <header className="px-5 pt-4 border-b border-gray-100">
          <div className="font-semibold text-white">Quản lí Node</div>
        </header>

        <div className="overflow-x-auto p-3">
          <table className="table-auto w-full overflow-hidden rounded-md">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-[#1F2937]">
              <tr>
                <th className="p-2 text-left">
                  <input ref={(ele) => { eleRefs.current['all'] = ele }} type={'checkbox'} onChange={handleCheckAll} />
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
                  <div className="font-semibold text-center">chỉnh sửa</div>
                </th>
              </tr>
            </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {
                  nodeList.length > 0 ?
                    nodeList.map((node, index) => {
                      return (
                        <tr
                          className={`p-2 ${
                            index % 2 === 0 ? `bg-[#384152]` : `bg-[#1F2937]`
                          }`}
                          key={node._id}
                        >
                          <td className="p-2">
                            <input ref={(ele) => { eleRefs.current[node._id] = ele }} type={'checkbox'} value={node._id} onChange={handleCheckSingle} />
                          </td>
                          <td className="p-2">
                            <Hidden payload={node._id} />
                          </td>
                          <td className="p-2">
                            <div className="font-medium text-white">{node.name}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center text-xs bg-[#A6F4D0] p-1 rounded-full text-[#225945]">
                              {node.typeModal}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex justify-center relative">
                              <MenuPopover
                                id={node._id}
                                target={{ id: node._id }}
                                dataDropDown={dataDropDown}
                                handleSelect={handleSelectMenu}
                              >
                                <MoreVertIcon className="cursor-pointer" />
                              </MenuPopover>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 bg-[#384152]">
                        Bạn chưa đăng ký node nào cả!
                      </td>
                    </tr>
                  )
                }
              </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default General;
