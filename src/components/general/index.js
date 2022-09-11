import { useState, useEffect, useRef } from "react";

import api from "@/api/index.js";
import { Toast } from "@/instance/toast.js";

import { useDispatch, useSelector } from "react-redux";
import { removeNode, updateNode } from "@/store/nodeSlice";
import DialogMui from "@/components/dialog";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

import { MaterialDefaultModal } from "@/components/modal";
import MenuPopover from "@/components/popover";
import Hidden from "@/components/hidden";

const removeNodeByID_PATH = "api/node/remove";
const updateNodeByID_PATH = "api/node/update";

const dataDropDown = [
  {
    eventKey: "settings",
    name: "Cài đặt",
    Icon: <SettingsIcon />,
  },
  {
    eventKey: "delete",
    name: "Xóa node",
    Icon: <DeleteIcon />,
  },
  {
    eventKey: "about",
    name: "Thông tin node",
    Icon: <InfoIcon />,
  },
];

const ModelDefault = ["esp8266", "esp32", "arduino-wifi"];

function General({ nodeList }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [dialogRemoveNode, setDialogRemoveNode] = useState(false);
  const [dialogUpdateNode, setDialogUpdateNode] = useState(false);
  const [modalNode, setModalNode] = useState(false);
  const [optionsNode, setOptionsNode] = useState(() => ({
    model: ModelDefault[0],
  }));
  const [chooseNode, setChooseNode] = useState("");
  const nodeInfo = useSelector((state) =>
    state.nodes.value.find((device) => device._id === chooseNode)
  );
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const [nodeID, setNodeID] = useState(() => nodeList.map((node) => node._id));
  const eleRefs = useRef({});

  useEffect(() => {
    if (isAll) {
      for (const checkbox in eleRefs.current) {
        eleRefs.current[checkbox].checked = statusCheckAll;
      }
    }
  }, [statusCheckAll]);

  useEffect(() => {
    if (checked.length === nodeID.length) {
      if (!statusCheckAll) {
        setStatusCheckAll(true);
        setIsAll(true);
      }
    } else {
      if (statusCheckAll) {
        setStatusCheckAll(false);
        setIsAll(false);
        eleRefs.current["all"].checked = false;
      }
    }
  }, [checked]);

  useEffect(() => {
    setOptionsNode(nodeInfo);
  }, [chooseNode]);

  function handleCheckAll(ele) {
    if (ele.target.checked) {
      setChecked(nodeID);
      setStatusCheckAll(true);
    } else {
      setChecked([]);
      setStatusCheckAll(false);
    }
    if (!isAll) {
      setIsAll(true);
    }
  }

  function handleCheckSingle(ele) {
    const type = ele.target.checked;
    const value = ele.target.value;
    if (type) {
      setChecked([...checked, value]);
    } else {
      if (checked.includes(value)) {
        setChecked(() => {
          return checked.filter((target) => target !== value);
        });
      }
    }
    if (isAll) {
      setIsAll(false);
    }
  }

  async function hanldeRemoveNode({ id }) {
    const res = await api.delete(`${removeNodeByID_PATH}/${id}`);
    const { idNode, message } = res.data;
    if (idNode && message === "remove node successfull!") {
      dispatch(removeNode({ id: idNode }));
      Toast({
        type: "success",
        message: "Node đã được xoá thành công!",
      });
    }
  }

  function handleSelectMenu({ eventKey, actions, target }) {
    if (eventKey === "delete") {
      // handle remove node
      setChooseNode(target.id);
      setDialogRemoveNode(true);
    } else if (eventKey === "about") {
      setChooseNode(target.id);
      setModalNode(true);
    }
    actions.close();
  }

  /* do some thing when model is many, not now */
  // function handleChangeOptionsNode() {
  // }

  function handleUpdateInfoNode() {
    const { name, model, desc } = optionsNode;
    api
      .patch(`${updateNodeByID_PATH}/${chooseNode}`, {
        name,
        typeModal: model,
        desc,
      })
      .then((res) => {
        const { message } = res.data;
        if (message === "update node successfull!") {
          dispatch(updateNode({ id: chooseNode, value: optionsNode }));
          Toast({
            type: "success",
            message: "Node đã được cập nhật thông tin!",
          });
          setModalNode(false);
        }
      })
      .catch((error) => {
        if (
          error.response.data.message === "You not permission update this node!"
        ) {
          Toast({
            type: "error",
            message: "Bạn không có quyền cập nhật node này!",
          });
        } else {
          Toast({ type: "error", message: "Opp, Không thể cập nhật node!" });
        }
      });
  }

  return (
    <>
      {/* dialog remove node */}
      <DialogMui open={ dialogRemoveNode } title={'Xác nhận xoá'} message={'Bạn có chắc xoá node này?'} handleClose={() => { setDialogRemoveNode(false) }} handleAccept={ () => { hanldeRemoveNode({ id: chooseNode }) } } />
      {/* dialog update node */}
      <DialogMui open={ dialogUpdateNode } title={'Xác nhận cập nhật'} message={'Bạn có chắc cập nhật node này?'} handleClose={() => { setDialogUpdateNode(false) }} handleAccept={ () => { handleUpdateInfoNode() } } />
      {/* modal information node */}
      <MaterialDefaultModal
        open={modalNode}
        handleClose={() => {
          setModalNode(false);
        }}
      >
        <h5>
          Thông tin node:{" "}
          {chooseNode
            .split("")
            .map((char, index, chars) =>
              index > chars.length / 2 ? char : "*"
            )
            .join("")}
        </h5>
        <div className="lg:min-w-[500px]">
          <Grid sx={{ marginY: "0.5rem" }} container spacing={2}>
            <Grid xs={7}>
              <TextField
                onChange={(event) => {
                  setOptionsNode((state) => ({
                    ...state,
                    name: event.target.value,
                  }));
                }}
                fullWidth
                size="small"
                id={`name-node-${chooseNode}`}
                value={optionsNode?.name || ""}
                label="Tên node"
                variant="outlined"
              />
            </Grid>
            <Grid xs={5}>
              <FormControl size="small" fullWidth>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  id="model-select"
                  value={optionsNode?.model || ModelDefault[0]}
                  label="Model"
                  // onChange={handleChangeOptionsNode}
                  disabled={true}
                >
                  {ModelDefault.map((model) => {
                    return (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                id={`desc-node-${chooseNode}`}
                label="Mô tả"
                multiline
                rows={4}
                value={
                  optionsNode?.desc
                    ? optionsNode.desc === "no-desc"
                      ? "{ Không có mô tả nào! }"
                      : optionsNode.desc
                    : ""
                }
                onChange={(event) => {
                  setOptionsNode((state) => ({
                    ...state,
                    desc: event.target.value,
                  }));
                }}
              />
            </Grid>
          </Grid>
          <Button
            onClick={() => {
              setDialogUpdateNode(true)
            }}
            sx={{
              marginTop: 0.5,
              position: "relative",
              left: "100%",
              transform: "translateX(-100%)",
            }}
            variant="contained"
          >
            Cập nhật thông tin
          </Button>
        </div>
      </MaterialDefaultModal>
      <div className="w-full bg-[#1A1D27] shadow-lg rounded-md border border-gray-200 animate-[load-smooth_200ms_ease-in-out_alternate]">
        <header className="px-5 pt-4 border-b border-gray-100">
          <div className="font-semibold text-white text-lg">Quản lí Node</div>
        </header>

        <div className="overflow-x-auto p-3">
          <table className="table-auto w-full overflow-hidden rounded-md">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-[#1F2937]">
              <tr>
                <th className="p-2 text-left">
                  <input
                    ref={(ele) => {
                      eleRefs.current["all"] = ele;
                    }}
                    type={"checkbox"}
                    onChange={handleCheckAll}
                  />
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">ID Node</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold  text-center">Tên Node</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold  text-center">Mô tả</div>
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
              {nodeList.length > 0 ? (
                nodeList.map((node, index) => {
                  return (
                    <tr
                      className={`p-2 ${
                        index % 2 === 0 ? `bg-[#384152]` : `bg-[#1F2937]`
                      }`}
                      key={node._id}
                    >
                      <td className="p-2">
                        <input
                          ref={(ele) => {
                            eleRefs.current[node._id] = ele;
                          }}
                          type={"checkbox"}
                          value={node._id}
                          onChange={handleCheckSingle}
                        />
                      </td>
                      <td className="p-2">
                        <Hidden payload={node?._id || ""} />
                      </td>
                      <td className="p-2">
                        <div className="font-medium text-white ">
                          {node.name}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium text-white max-w-[330px] overflow-hidden text-center overflow-ellipsis whitespace-nowrap">
                          {node.desc === 'no-desc' ? 'Chưa có mô tả nào' : node.desc }
                        </div>
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
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 bg-[#384152]">
                    Bạn chưa đăng ký node nào cả!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default General;
