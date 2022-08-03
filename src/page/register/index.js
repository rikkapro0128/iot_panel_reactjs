import { Form, Button, Panel, FlexboxGrid } from "rsuite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

import api from "@/api/index.js";
import { IconUndo, IconSign } from "@/icons";

const pathRegisterAccount = "api/user/register";

function Register() {
  let navigate = useNavigate();
  const [form, setForm] = useState({});
  const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"]);

  function resgisterAccount() {
    try {
      const request = api.post(pathRegisterAccount, form);
      toast.promise(
        request,
        {
          loading: "Đang tạo tài khoản!",
          success: (response) => {
            setCookie("accessToken", response.data.accessToken);
            setCookie("refreshToken", response.data.refreshToken);
            navigate(`/`);
            return "Bạn đã tạo tài khoản thành công👻";
          },
          error: "Không thể tạo tài khoản!",
        },
        {
          success: {
            duration: 5000,
            icon: "👌",
          },
          error: {
            duration: 2000,
            icon: "🐧",
          },
          position: "bottom-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <FlexboxGrid.Item className="max-w-md" colspan={12}>
        <Panel
          header={<h3 className="text-center text-3xl">Đăng ký</h3>}
          bordered
        >
          <Form
            fluid
            onChange={(dataAccount) => {
              setForm(dataAccount);
            }}
          >
            <Form.Group>
              <Form.ControlLabel>Tên đăng ký</Form.ControlLabel>
              <Form.Control name="name" type="text" placeholder="vd: jakob" />
              <Form.HelpText tooltip>Tên tài khoản là bắt buộc!</Form.HelpText>
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="text"
                autoComplete="off"
                placeholder="vd: name@gmail.com"
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Nhập lại mật khẩu</Form.ControlLabel>
              <Form.Control
                name="re-password"
                type="password"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Button
                className="flex align-center justify-center leading-normal"
                block
                appearance="primary"
                size="md"
                onClick={resgisterAccount}
              >
                Đăng ký
                <IconSign className="ml-2" />
              </Button>
            </Form.Group>
            <Form.Group>
              <Button
                onClick={() => {
                  navigate(`/sign/login`);
                }}
                className="flex align-center justify-center leading-normal"
                block
                appearance="ghost"
                size="md"
                color="blue"
              >
                <IconUndo />
                Trở lại đăng nhập
              </Button>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </div>
  );
}

export default Register;
