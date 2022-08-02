import { Form, ButtonToolbar, Button, Panel } from 'rsuite';
import { useNavigate } from "react-router-dom";

import { IconGithub } from '../../icons';

function Login() {
  let navigate = useNavigate();
  return (
    <div >
      <Panel className='mb-2.5' header={<h3 className='text-center text-3xl'>Đăng nhập</h3>} bordered>
        <Form fluid>
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
              <Button className='w-full' appearance="primary">Đăng nhập</Button>
              <Button className='absolute right-0 bottom-0' appearance="link">Quên mật khẩu?</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </Panel>
      <div className="flex items-center justify-between after:content-[''] after:w-48 after:h-px after:block after:bg-gray-600 before:content-[''] before:w-48 before:h-px before:block before:bg-gray-600">hoặc</div>
      <Panel className='mt-2.5' bordered>
        <Form.Group>
          <Button className='w-full mb-5' appearance="primary" onClick={() => { navigate(`/sign/register`); }} block size="md">
            Tiến hành đăng ký
          </Button>
          <Button className='w-fit flex items-center' appearance="primary" color='green' block size="md">
            Đăng nhập với Github
            <div className="ml-2 wrap w-6 h-6 relative">
              <div className='inset-0 bg-black absolute rounded-full'></div>
              <IconGithub className="fill-white absolute left-0 top-0" width={24} height={24}/>
            </div>
          </Button>
        </Form.Group>
      </Panel>
    </div>
  )
}

export default Login;