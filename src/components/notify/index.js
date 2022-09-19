import { memo } from "react";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import GppGoodIcon from "@mui/icons-material/GppGood";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";

import { useLazy } from "@/hooks/useLazy";
import { useMiruDate } from "@/hooks/useMiruDate";

import { IconBell } from "@/icons";
import { useEffect } from "react";

const actionsIcon = {
  _add_node_: (
    <AddCircleIcon
      fontSize="large"
      sx={{ color: (theme) => theme.palette.common.white }}
    />
  ),
  _remove_node_: (
    <RemoveCircleIcon
      fontSize="large"
      sx={{ color: (theme) => theme.palette.common.white }}
    />
  ),
  _change_info_node_: (
    <InfoIcon
      fontSize="large"
      sx={{ color: (theme) => theme.palette.common.white }}
    />
  ),
  _change_password_: (
    <GppGoodIcon
      fontSize="large"
      sx={{ color: (theme) => theme.palette.common.white }}
    />
  ),
  _none_: (
    <ErrorIcon
      fontSize="large"
      sx={{ color: (theme) => theme.palette.common.white }}
    />
  ),
};

function Notify({
  anchorEl,
  onClose,
  onEventKey,
  notifys,
  onRequestNotify,
  disableLoadMore,
}) {
  const open = Boolean(anchorEl);
  const [isLazy, setParentScroll, setRequestStatus] = useLazy('.target-inside-viewport');
  const setDate = useMiruDate((dayjs) => (date) => dayjs(date).format("llll"));

  useEffect(() => {
    setRequestStatus(false);
  }, [notifys])

  useEffect(() => {
    if (isLazy) {
      onRequestNotify();
    }
  }, [isLazy]);

  useEffect(() => {
    onRequestNotify();
  }, []);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id={`notify-viewer`}
        open={open}
        onClose={onClose}
        sx={{
          maxWidth: 450,
          minWidth: 450,
          "& > .MuiPaper-root": {
            width: 450,
          },
          "& .MuiBox-root.notify-user-scroll": {
            maxHeight: 500,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableAutoFocus={true}
        disableAutoFocusItem={true}
      >
        <Box
          sx={{
            marginTop: 1.5,
            ":hover": (theme) => ({
              backgroundColor: theme.palette.background.default,
            }),
            paddingX: 2,
          }}
        >
          <Typography variant="h6" color="text.primary">
            Thông báo
          </Typography>
        </Box>

        {notifys.length > 0 ? (
          <Box>
            <Box
              onScroll={(event) => {
                setParentScroll(event.target);
              }}
              sx={{
                margin: 2,
              }}
              className="notify-user-scroll"
            >
              {notifys.map((notify, index) => {
                return (
                  <Box key={notify._id}>
                    {index === 0 ? null : (
                      <Divider variant="fullWidth" component="li" />
                    )}
                    <MenuItem onClick={onEventKey}>
                      <Avatar
                        sx={{
                          width: "45px !important",
                          height: "45px !important",
                          marginLeft: "0px !important",
                          bgcolor: (theme) => theme.palette.primary.main,
                        }}
                        variant="circular"
                      >
                        {notify.typeAction in actionsIcon
                          ? actionsIcon[notify.typeAction]
                          : actionsIcon["_none_"]}
                      </Avatar>

                      <Box sx={{ width: "100%", marginLeft: 1 }}>
                        <Box>
                          <Typography
                            sx={{
                              display: "block",
                              maxWidth: 280,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                            component="span"
                            color="text.primary"
                          >
                            {notify.action}
                          </Typography>
                          <span className="flex justify-between">
                            <Typography
                              sx={{
                                display: "block",
                                maxWidth: 230,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                              component="span"
                              color="text.primary"
                            >
                              {notify.desc
                                ? notify.desc
                                : "Không có mô tả cụ thể"}
                            </Typography>
                            {notify.typeAction === "_remove_node_" ? (
                              <Typography
                                sx={{
                                  display: "block",
                                }}
                                component="span"
                                color="text.primary"
                              >
                                Đã xoá: {notify.options.total}
                              </Typography>
                            ) : null}
                          </span>
                        </Box>
                        <Typography
                          sx={{
                            marginTop: 0.5,
                            fontStyle: "italic",
                            color: (theme) => theme.palette.secondary.light,
                          }}
                          variant="caption"
                          display="block"
                          gutterBottom
                        >
                          Vào lúc: {setDate(notify.createdAt)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Box>
                );
              })}
              {disableLoadMore ? null : (
                <Box
                  className={"target-inside-viewport"}
                  sx={{ display: "flex", padding: "6px 16px" }}
                >
                  <Skeleton
                    sx={{ marginRight: 1 }}
                    variant="circular"
                    width={45}
                    height={45}
                  />
                  <Box sx={{ flex: "1", marginLeft: 1 }}>
                    <Skeleton
                      variant="text"
                      width={180}
                      sx={{ fontSize: "1rem" }}
                    />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton
                        variant="text"
                        width={220}
                        sx={{ fontSize: "1rem" }}
                      />
                      <Skeleton
                        variant="text"
                        width={50}
                        sx={{ fontSize: "1rem" }}
                      />
                    </Box>
                    <Skeleton
                      variant="text"
                      width={200}
                      sx={{ fontSize: "1rem" }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            <Button
              sx={{
                width: "96%",
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              variant="text"
            >
              Xem chi tiết
            </Button>
          </Box>
        ) : (
          <Box>
            <Box
              width={200}
              height={200}
              sx={{
                borderRadius: "50%",
                margin: "0 auto",
                backgroundImage:
                  "linear-gradient(rgb(120 93 201 / 51%) 0%, rgb(55 6 205 / 14%) 50%, rgb(255 255 255 / 0%) 100%)",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}
            >
              <IconBell
                className={
                  "floating-animation relative -bottom-4"
                }
                width={110}
                height={110}
                fill={"#ccc"}
              />
            </Box>
            <Typography
              sx={{ marginTop: "1rem", marginBottom: '0.5rem', marginTop: 3 }}
              textAlign={"center"}
              component={"p"}
              color="text.primary"
              variant="h5"
            >
              Opps!
            </Typography>
            <span className={"block text-center mb-4"}>
              Không có thông báo nào hết chơn.
            </span>
          </Box>
        )}
      </Menu>
    </>
  );
}

export default memo(Notify);
