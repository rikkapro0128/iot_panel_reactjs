import { memo } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { maxWidth } from "@mui/system";

function Notify({ anchorEl, onClose, onEventKey, notifys }) {
  const open = Boolean(anchorEl);

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
          "& .MuiBox-root.main-scroll": {
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
          <Box
            sx={{
              margin: 2,
            }}
            className="main-scroll"
          >
            {notifys.map((notify, index) => {
              return (
                <Box key={notify._id}>
                  {index === 0 ? null : (
                    <Divider variant="fullWidth" component="li" />
                  )}
                  <MenuItem onClick={onEventKey}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                    <ListItemText
                      sx={{
                        marginLeft: 2,
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      primary={notify.action}
                      secondary={
                        <span className="flex justify-between">
                          <Typography
                            sx={{
                              display: "block",
                            }}
                            component="span"
                            color="text.primary"
                          >
                            {notify.desc
                              ? notify.desc
                              : "Không có mô tả cụ thể"}
                          </Typography>
                          {notify.actionName === "_remove_node_" ? (
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
                      }
                    />
                  </MenuItem>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography textAlign={"center"} variant="p" color="text.primary">
            Không có thông báo nào cả😊
          </Typography>
        )}
      </Menu>
    </>
  );
}

export default memo(Notify);
