/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Loader, Steps, Button as ButtonRS } from "rsuite";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "universal-cookie";

import { setInfoUser } from "@/store/userSlice";
import { addNotify, setSkipNext } from "@/store/notifySlice";
import { setNodes } from "@/store/nodeSlice";
import { Logo } from "@/components/logo";
import { Node } from "@/components/node";
import General from "@/components/general";
import { ModalInputNode } from "@/components/modal";
import DialogMui from "@/components/dialog";
import { Toast } from "@/instance/toast.js";
import { MuiMenu } from "@/components/popover";
import Notify from "@/components/notify";
import { MaterialDefaultModal } from "@/components/modal";
import { AvatarRipple } from "@/components/avatar";
import GalleryAvatar from "@/components/gallery/avatar.js";
import UploadFile from "@/components/upload";

import { styled } from "@mui/material/styles";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WidgetsIcon from "@mui/icons-material/Widgets";
import MemoryIcon from "@mui/icons-material/Memory";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import api from "@/api/index.js";

const getListNode_PATH = "api/node/list";
const getInfoUser_PATH = "api/user/info";
const getNotifyUser_PATH = "api/user/notify";
const postChangePassword_PATH = "api/user/change-password";
const dataDropDown = [
  {
    eventKey: "info",
    name: "Thông tin của bạn",
    Icon: <PersonIcon />,
  },
  {
    eventKey: "change-password",
    name: "Đổi mật khẩu",
    Icon: <PasswordIcon />,
  },
  {
    eventKey: "logout",
    name: "Đăng xuất",
    Icon: <LogoutIcon />,
  },
];

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const initPasswordModal = {
  oldPassword: {
    payload: "",
    error: "",
  },
  newPassword: {
    payload: "",
    error: "",
  },
  confirmPassword: {
    payload: "",
    error: "",
  },
};

const avatarListDefault = [
  "avatar_01",
  "avatar_02",
  "avatar_03",
  "avatar_04",
  "avatar_05",
  "avatar_06",
  "avatar_07",
  "avatar_08",
  "avatar_09",
  "avatar_10",
  "avatar_11",
  "avatar_12",
  "avatar_13",
  "avatar_14",
  "avatar_15",
];

const actions = [
  { icon: <ViewAgendaIcon />, name: "Tổng quan" },
  { icon: <MemoryIcon />, name: "Xem node" },
];

const cookies = new Cookies();

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [anchorNotify, setAnchorNotify] = useState(null);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [dialogLogout, setDialogLogout] = useState(false);
  const [dial, setDial] = useState(false);
  const [modalChangePass, setModalChangePass] = useState(false);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [password, setPassword] = useState(initPasswordModal);
  const [isLoading, setIsLoading] = useState(true);
  const [parentPath, setParentPath] = useState("/dashboard");
  const [statusNode, setStatusNode] = useState("disconnected");
  const nodeList = useSelector((state) => state.nodes.value);
  const notify = useSelector((state) => state.notify);
  const user = useSelector((state) => state.user.info);
  const [toggle, setToggle] = useState(false);
  const [toggleModalUser, setToggleModalUser] = useState(false);

  useEffect(() => {
    window.document.title = "Miru | Dashboard Page";
    api.get(getListNode_PATH).then((res) => {
      dispatch(setNodes(res.data.node_list));
      setIsLoading(false);
    });
    getInfoUser();
  }, []);

  function requestMoreNotify() {
    if(notify.skipNext >= 0) {
      api
        .get(`${getNotifyUser_PATH}?sort=desc&skip=${notify.skipNext}`)
        .then((res) => {
          dispatch(addNotify(res.data.notifys));
          dispatch(setSkipNext(res.data.skipNext));
        })
        .catch((err) => {
          Toast({
            type: "error",
            message: "Opp, Có lỗi xảy ra khi tìm thêm thông báo!",
          });
        });
    }else {
      setDisableLoadMore(true)
    }
  }

  function getInfoUser() {
    api.get(getInfoUser_PATH).then((res) => {
      dispatch(setInfoUser(res.data.user));
    });
  }

  function hanldeLogout() {
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    Toast({ type: "success", message: "Đăng xuất thành công!" });
    navigate("/");
  }

  function handleSelectMenu({ eventKey }) {
    if (eventKey === "info") {
      // call API get user info
      getInfoUser();
      setToggleModalUser(true);
    } else if (eventKey === "logout") {
      // hanlde logout
      setDialogLogout(true);
    } else if (eventKey === "change-password") {
      setModalChangePass(true);
    } else {
      Toast({ message: "Chức năng hiện chưa có!" });
    }
  }

  function handleDial(event, reason) {
    if (reason === "toggle") {
      setDial((dial) => !dial);
    } else if (reason === "blur") {
      setDial(false);
    }
  }

  function handleChangePassword() {
    let isRequest = true;

    // rule if field empty!
    if (!password.newPassword.payload) {
      // Toast({ type: 'error', message: 'Không được để trống trường!' });
      isRequest = false;
      setPassword((password) => ({
        ...password,
        newPassword: { ...password.newPassword, error: "Bị trống" },
      }));
    } else {
      setPassword((password) => ({
        ...password,
        newPassword: { ...password.newPassword, error: "" },
      }));
    }
    if (!password.oldPassword.payload) {
      isRequest = false;
      setPassword((password) => ({
        ...password,
        oldPassword: { ...password.oldPassword, error: "Bị trống" },
      }));
    } else {
      setPassword((password) => ({
        ...password,
        oldPassword: { ...password.oldPassword, error: "" },
      }));
    }
    if (!password.confirmPassword.payload) {
      isRequest = false;
      setPassword((password) => ({
        ...password,
        confirmPassword: { ...password.confirmPassword, error: "Bị trống" },
      }));
    } else {
      setPassword((password) => ({
        ...password,
        confirmPassword: { ...password.confirmPassword, error: "" },
      }));
    }

    // Rule if newPassword & confirmPassword not as like
    if (password.newPassword.payload !== password.confirmPassword.payload) {
      isRequest = false;
      setPassword((password) => ({
        ...password,
        confirmPassword: { ...password.confirmPassword, error: "Xác nhận sai" },
      }));
    }

    // end check

    if (isRequest) {
      // call api change password
      api
        .post(postChangePassword_PATH, {
          oldPassword: password.oldPassword.payload,
          newPassword: password.newPassword.payload,
        })
        .then((res) => {
          const { message } = res.data;
          // reset modal change password
          if (message === "change pass successful!") {
            Toast({ type: "success", message: "Đổi mật khẩu thành công!" });
            setPassword({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setModalChangePass(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message === "field {oldPassword} is wrong!") {
            setPassword((password) => ({
              ...password,
              oldPassword: {
                ...password.oldPassword,
                error: "Mật khẩu cũ sai",
              },
            }));
          }
        });
    }
  }

  return (
    <>
      {/* notify */}
      <Notify
        onRequestNotify={requestMoreNotify}
        anchorEl={anchorNotify}
        notifys={notify.value}
        disableLoadMore={disableLoadMore}
        onClose={() => {
          setAnchorNotify(null);
        }}
        onEventKey={({ eventKey }) => {
          setAnchorNotify(null);
        }}
      />
      {/* menu */}
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
      {/* menu on mobile */}
      <div className="2md:hidden">
        <Box sx={{ position: "fixed", right: "1rem", bottom: "1rem" }}>
          <StyledSpeedDial
            sx={{
              "& > .MuiSpeedDial-fab": {
                backgroundColor: "#2cb67d",
                "&:hover": {
                  backgroundColor: "#28a06e",
                },
              },
            }}
            ariaLabel="SpeedDial playground example"
            icon={<WidgetsIcon />}
            direction={"up"}
            open={dial}
            onOpen={handleDial}
            onClose={handleDial}
          >
            {actions.map((action) => (
              <SpeedDialAction
                sx={{
                  backgroundColor: "#010101",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#72757e",
                  },
                  width: "50px",
                  height: "50px",
                }}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </div>
      {/* dialog remove node */}
      <DialogMui
        open={dialogLogout}
        title={"Xác nhận đăng xuất"}
        message={"Bạn có chắc muốn đăng xuất khỏi tài khoản?"}
        handleClose={() => {
          setDialogLogout(false);
        }}
        handleAccept={() => {
          hanldeLogout();
          setDialogLogout(false);
        }}
      />
      {/* modal change avatar */}
      <MaterialDefaultModal
        open={modalAvatar}
        handleClose={() => {
          setModalAvatar(false);
        }}
      >
        <h3 className="text-center pb-6 -mt-3">Hãy chọn avatar của bạn đi!</h3>
        <GalleryAvatar size={80} srcImages={avatarListDefault} />
        <Divider sx={{ margin: 2, fontSize: "1rem" }}>Bạn cũng có thể</Divider>
        <UploadFile />
      </MaterialDefaultModal>
      {/* modal change password */}
      <MaterialDefaultModal
        open={modalChangePass}
        handleClose={() => {
          setModalChangePass(false);
        }}
      >
        <Box
          onKeyUp={(event) => {
            if (event.key === "Enter") handleChangePassword();
          }}
          sx={{
            width: "470px",
          }}
        >
          <h4 className="text-center mb-4">Đổi mật khẩu</h4>
          <TextField
            error={password.oldPassword.error ? true : false}
            helperText={password.oldPassword.error}
            onChange={(event) => {
              setPassword({
                ...password,
                oldPassword: {
                  ...password.oldPassword,
                  payload: event.target.value,
                },
              });
            }}
            type={"password"}
            size="small"
            sx={{ marginY: 1 }}
            fullWidth
            id="old-pass"
            label="Mật khẩu cũ"
            variant="filled"
          />
          <TextField
            error={password.newPassword.error ? true : false}
            helperText={password.newPassword.error}
            onChange={(event) => {
              setPassword({
                ...password,
                newPassword: {
                  ...password.newPassword,
                  payload: event.target.value,
                },
              });
            }}
            type={"password"}
            size="small"
            sx={{ marginY: 1 }}
            fullWidth
            id="new-pass"
            label="Mật khẩu mới"
            variant="filled"
          />
          <TextField
            error={password.confirmPassword.error ? true : false}
            helperText={password.confirmPassword.error}
            onChange={(event) => {
              setPassword({
                ...password,
                confirmPassword: {
                  ...password.confirmPassword,
                  payload: event.target.value,
                },
              });
            }}
            type={"password"}
            size="small"
            sx={{ marginY: 1 }}
            fullWidth
            id="confirm-pass"
            label="Xác nhận lại"
            variant="filled"
          />
          <Button
            onClick={handleChangePassword}
            sx={{
              marginTop: 0.5,
              position: "relative",
              left: "100%",
              transform: "translateX(-100%)",
            }}
            variant="contained"
          >
            Đổi mật khẩu
          </Button>
        </Box>
      </MaterialDefaultModal>
      {/* modal info user */}
      <MaterialDefaultModal
        open={toggleModalUser}
        handleClose={() => {
          setToggleModalUser(false);
        }}
      >
        {user && (
          <div>
            <h5 className="text-center -mt-3 pb-4">Thông tin tài khoản</h5>
            <div className="flex justify-start">
              <div className="mr-5 flex flex-col items-center">
                <AvatarRipple
                  size={80}
                  src={
                    user?.avatar?.name
                      ? `${process.env.REACT_APP_SERVER_API_HOST}/static/avatar/${user.avatar.name}.svg`
                      : `${process.env.REACT_APP_SERVER_API_HOST}/static/avatar/${avatarListDefault[1]}.svg`
                  }
                />
                <ButtonRS
                  onClick={() => {
                    setModalAvatar(true);
                  }}
                  className="mt-2.5"
                  size="sm"
                  appearance="primary"
                >
                  Đổi ảnh
                </ButtonRS>
              </div>
              <div className="miru--info">
                <Steps vertical small>
                  <Steps.Item
                    status={"finish"}
                    title="ID tài khoản"
                    description={user?._id || "Chưa có id"}
                  />
                  <Steps.Item
                    status={"finish"}
                    title="Tên tài khoản"
                    description={user?.name || "Chưa có tên"}
                  />
                  <Steps.Item
                    status={"finish"}
                    title="Email"
                    description={user?.email || "Chưa có email"}
                  />
                </Steps>
              </div>
            </div>
          </div>
        )}
      </MaterialDefaultModal>
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
        <div className="lg:max-w-7xl mx-auto px-4 mt-4">
          <div className="flex justify-between mb-10">
            <Logo disableNavigate={true} />
            <div className="grid grid-cols-2 gap-x-6 items-baseline">
              <IconButton
                onClick={(event) => {
                  setAnchorNotify(event.currentTarget);
                }}
              >
                <Badge
                  badgeContent={notify.length}
                  sx={{
                    ".MuiBadge-badge": (theme) => ({
                      backgroundColor: theme.palette.primary.dark,
                    }),
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <AvatarRipple
                onClick={(event) => {
                  setAnchorMenu(event.currentTarget);
                }}
                size={35}
                src={
                  user?.avatar?.name
                    ? `${process.env.REACT_APP_SERVER_API_HOST}/static/avatar/${user.avatar.name}.svg`
                    : `${process.env.REACT_APP_SERVER_API_HOST}/static/avatar/${avatarListDefault[1]}.svg`
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="2md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-3 2md:block hidden mr-4">
              <div className="bg-[#1A1D27] py-2.5 rounded-lg">
                <div
                  onClick={() => {
                    navigate("/dashboard/general");
                  }}
                  className="cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative"
                >
                  <ViewAgendaIcon fill="white" />
                  <p className="text-inherit p-3.5 ">Tổng quan</p>
                </div>
                {nodeList.map(({ _id, name }, index) => {
                  return (
                    <div
                      key={_id}
                      onClick={() => {
                        navigate(`${parentPath}/node/${_id}`);
                      }}
                      className={`cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative whitespace-nowrap	`}
                    >
                      <MemoryIcon />
                      <p className="text-inherit text-center p-3.5">{name}</p>
                    </div>
                  );
                })}
                <div
                  onClick={() => {
                    setToggle(true);
                  }}
                  className="cursor-pointer hover:text-slate-300 flex items-center justify-start pl-8 relative"
                >
                  <AddCircleIcon />
                  <p className="text-inherit p-3.5 ">Thêm Node</p>
                </div>
              </div>
            </div>
            <div className="2md:col-span-8 lg:col-span-9 xl:col-span-9 2xl:col-span-9 col-span-12">
              <Routes>
                <Route
                  path={`general`}
                  element={<General nodeList={nodeList} />}
                />
                {nodeList.map(({ _id }) => {
                  return (
                    <Route
                      key={_id}
                      path={`node/${_id}`}
                      element={
                        <Node
                          node-id={_id}
                          modifyStatus={(status) => {
                            setStatusNode(status);
                          }}
                        />
                      }
                    />
                  );
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
