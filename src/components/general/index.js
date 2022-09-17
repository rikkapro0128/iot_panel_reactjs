import { useState, useEffect, useRef, useCallback } from "react";

import api from "@/api/index.js";
import { Toast } from "@/instance/toast.js";

import { useDispatch, useSelector } from "react-redux";
import { removeNode, updateNode } from "@/store/nodeSlice";
import DialogMui from "@/components/dialog";

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
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import TableNodes from "@/components/table/nodes.js";
import { MaterialDefaultModal } from "@/components/modal";
import { MuiMenu } from "@/components/popover";
import Hidden from "@/components/hidden";
import { Typography } from "@mui/material";

const removeNodeByID_PATH = "api/node/remove";
const updateNodeByID_PATH = "api/node/update";

const ModelDefault = ["esp8266", "esp32", "arduino-wifi"];

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

function General({ nodeList }) {
  const dispatch = useDispatch();
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [checked, setChecked] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [selectNodeID, setSelectNodeID] = useState(undefined);
  const [typeUpdate, setTypeUpdate] = useState("single");
  const [dialogRemoveNode, setDialogRemoveNode] = useState(false);
  const [dialogUpdateNode, setDialogUpdateNode] = useState(false);
  const [modalNode, setModalNode] = useState(false);
  const [valueUpdateNode, setValueUpdateNode] = useState({});
  const [chooseNode, setChooseNode] = useState([]);
  const nodeInfo = useSelector((state) =>
    state.nodes.value.find((device) => device._id === selectNodeID)
  );
  const [statusCheckAll, setStatusCheckAll] = useState(false);
  const [nodeID, setNodeID] = useState(() => nodeList.map((node) => node._id));
  const eleRefs = useRef({});
  const handleTableChangeNodes = useCallback(({ type, ids }) => {
    setChooseNode(ids);
    if (type === "remove") {
      setDialogRemoveNode(true);
    } else if (type === "update") {
      setTypeUpdate("muti");
      setModalNode(true);
    }
    console.log({ type, ids });
  }, []);

  // console.log(valueUpdateNode);

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
    if (chooseNode.length > 0) {
      setSelectNodeID(chooseNode[0]);
    }
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

  async function hanldeRemoveNode({ ids }) {
    const res = await api.delete(removeNodeByID_PATH, {
      data: { nodeIDs: ids },
    });
    const { nodeIDs, message } = res.data;
    if (nodeIDs && message === "remove node successfull!") {
      const count = nodeIDs.reduce(
        (hold, node) => (node.statusRemove === "done" ? ++hold : hold),
        0
      );
      dispatch(removeNode({ ids: nodeIDs.map((node) => node.id) }));
      Toast({
        type: "success",
        message: `${count} node đã được xoá thành công!`,
      });
    }
  }

  function handleSelectMenu({ eventKey, target }) {
    if (eventKey === "delete") {
      // handle remove node
      setDialogRemoveNode(true);
    } else if (eventKey === "about") {
      setModalNode(true);
    }
  }

  function handleUpdateInfoNode() {
    if (Object.keys(valueUpdateNode).length > 0) {
      api
        .patch(updateNodeByID_PATH, {
          nodesUpdate: valueUpdateNode,
        })
        .then((res) => {
          const { message, resultUpdateNodes } = res.data;
          if (message === "update node done!") {
            const nodeUpdated = resultUpdateNodes
              .map((temp) => (temp.status === "done" ? temp.node : null))
              .filter((value) => value !== null);
            dispatch(updateNode({ nodes: nodeUpdated }));
            Toast({
              type: "success",
              message: "Node đã được cập nhật thông tin!",
            });
            setModalNode(false);
          }
        })
        .catch((error) => {
          Toast({ type: "error", message: "Opp, Không thể cập nhật node!" });
        });
    }
  }

  return (
    <>
      {/* menu on mobile */}
      <MuiMenu
        id="account"
        anchorEl={anchorMenu}
        payload={dataDropDown}
        onEventKey={handleSelectMenu}
        onClose={() => {
          setAnchorMenu(null);
        }}
        onClick={() => {
          setAnchorMenu(null);
        }}
      />
      {/* dialog remove node */}
      <DialogMui
        open={dialogRemoveNode}
        title={"Xác nhận xoá"}
        message={`Bạn có chắc xoá ${chooseNode?.length} node đã chọn?`}
        handleClose={() => {
          setDialogRemoveNode(false);
        }}
        handleAccept={() => {
          hanldeRemoveNode({ ids: chooseNode });
          setDialogRemoveNode(false);
        }}
      />
      {/* dialog update node */}
      <DialogMui
        open={dialogUpdateNode}
        title={"Xác nhận cập nhật"}
        message={"Bạn có chắc cập nhật node này?"}
        handleClose={() => {
          setDialogUpdateNode(false);
        }}
        handleAccept={() => {
          handleUpdateInfoNode();
          setDialogUpdateNode(false);
        }}
      />
      {/* modal information node */}
      <MaterialDefaultModal
        open={modalNode}
        handleClose={() => {
          setModalNode(false);
        }}
      >
        <div>
          {typeUpdate === "single" ? (
            <>
              <h5>Thông tin node</h5>
              <p>{chooseNode?.[0]}</p>
            </>
          ) : (
            <>
              <h5 className="mb-5">Cập nhật các node:</h5>
              <FormControl size="small" fullWidth>
                <InputLabel id="model-select-label">Chọn node</InputLabel>
                <Select
                  id="model-select"
                  value={selectNodeID || chooseNode?.[0]}
                  label="Chọn node"
                  onChange={(event) => {
                    setSelectNodeID(event.target.value);
                  }}
                >
                  {chooseNode.map((node) => {
                    return (
                      <MenuItem key={node} value={node}>
                        {node}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
          )}
        </div>
        <div className="lg:min-w-[500px]">
          <Grid sx={{ marginY: "0.5rem" }} container spacing={2}>
            <Grid xs={7}>
              <TextField
                onChange={(event) => {
                  setValueUpdateNode((state) => ({
                    ...state,
                    [selectNodeID]: state?.[selectNodeID]
                      ? { ...state[selectNodeID], name: event.target.value }
                      : { name: event.target.value },
                  }));
                }}
                fullWidth
                size="small"
                id={`name-node-${chooseNode}`}
                value={
                  valueUpdateNode?.[selectNodeID]?.name ||
                  nodeInfo?.name ||
                  "{ Không có tên }"
                }
                label="Tên node"
                variant="outlined"
              />
            </Grid>
            <Grid xs={5}>
              <FormControl size="small" fullWidth>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  id="model-select"
                  value={valueUpdateNode?.model || ModelDefault[0]}
                  label="Model"
                  disabled={true}
                >
                  {/* setSelectNodeID(chooseNode[0]) */}
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
                  valueUpdateNode?.[selectNodeID]?.desc ||
                  nodeInfo?.desc ||
                  "{ Không có mô tả }"
                }
                onChange={(event) => {
                  setValueUpdateNode((state) => ({
                    ...state,
                    [selectNodeID]: state?.[selectNodeID]
                      ? { ...state[selectNodeID], desc: event.target.value }
                      : { desc: event.target.value },
                  }));
                }}
              />
            </Grid>
          </Grid>
          <Button
            onClick={() => {
              setDialogUpdateNode(true);
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
        {/* NEW TABLE BY MUI */}

        <TableNodes
          payload={nodeList}
          onTableChangeNodes={handleTableChangeNodes}
        />

        {/* NEW TABLE BY MUI */}
      </div>
    </>
  );
}

export default General;
