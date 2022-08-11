import { Form, ButtonToolbar, Button, Panel, FlexboxGrid } from 'rsuite';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Toast } from '@/instance/toast.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';

import { IconGithub, IconGoogle, IconFacebook, IconSign, IconCheck } from '@/icons';
import api from "@/api/index.js";

const pathLoginAccount = "api/user/login";
const cookies = new Cookies();

function Login() {
  let navigate = useNavigate();
  const [form, setForm] = useState({});

  function loginAccount() {
    const request = api.post(pathLoginAccount, form);
    Toast({
      type: 'promise', 
      promise: request,
      payloadMessage: {
        loading: "Đang đăng nhập!",
        success: (response) => {
          try {
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const payloadAccessToken = jwt_decode(accessToken);
            const payloadRefreshToken = jwt_decode(refreshToken);
            cookies.set("accessToken", accessToken, { path: '/', expires: new Date(payloadAccessToken.exp * 1000) });
            cookies.set("refreshToken", refreshToken, { path: '/', expires: new Date(payloadRefreshToken.exp * 1000) });
            navigate(`/`);
            return "Bạn đã đăng nhập thành công👻";
            
          } catch (error) {
            console.log(error);
          }
        },
        error: "Không thể đăng nhập!",
      }
    });
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <FlexboxGrid.Item className='max-w-md' colspan={12}>
      <div >
      <Panel className='mb-2.5' header={<h3 className='text-center text-3xl'>Đăng nhập</h3>} bordered>
        <Form fluid onChange={ (dataForm) => { setForm(dataForm) } }>
          <Form.Group>
            <Form.ControlLabel>Tên đăng nhập</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
            <Form.Control name="password" type="password" autoComplete="off" />
          </Form.Group>
          <Form.Group className='relative pb-10'>
            <ButtonToolbar>
              <Button onClick={loginAccount} className='w-full flex align-center justify-center leading-normal' appearance="primary">Đăng nhập
                <IconSign className='ml-2'/>
              </Button>
              <Button className='absolute right-0 bottom-0' appearance="link">Liệu bạn có, quên mật khẩu?</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </Panel>
      <div className="flex items-center justify-between after:content-[''] after:w-48 after:h-px after:block after:bg-gray-600 before:content-[''] before:w-48 before:h-px before:block before:bg-gray-600">hoặc</div>
      <Panel className='mt-2.5' bordered>
        <Form.Group>
          <Button className='w-full mb-2.5 flex align-center justify-center leading-normal' appearance="primary" onClick={() => { navigate(`/sign/register`); }} block size="md">
            Tiến hành đăng ký
            <IconCheck />
          </Button>
          <div className="flex mb-2.5 items-center justify-between after:content-[''] after:w-36 after:h-px after:block after:bg-gray-600 before:content-[''] before:w-36 before:h-px before:block before:bg-gray-600 whitespace-nowrap">đăng nhập với</div>
          <div className="w-min flex m-auto">
            <div className="wrap w-8 h-8 relative cursor-pointer	">
              <div className='inset-0 bg-black absolute rounded-full'></div>
              <IconGithub className="fill-white absolute left-0 top-0" width={32} height={32}/>
            </div>
            <div className="ml-2.5 wrap w-8 h-8 cursor-pointer	">
              <IconGoogle className="fill-white" width={32} height={32}/>
            </div>
            <div className="ml-2.5 wrap w-8 h-8 cursor-pointer	">
              <IconFacebook className="fill-white" width={32} height={32}/>
            </div>
          </div>
        </Form.Group>
      </Panel>
    </div>
      </FlexboxGrid.Item>
    </div>
  )
}

export default Login;