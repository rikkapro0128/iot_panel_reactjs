import { Form, ButtonToolbar, Button, Panel } from 'rsuite';
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();
  return (
    <>
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
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary">Đăng nhập</Button>
              <Button appearance="link">Quên mật khẩu?</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </Panel>
      <div className='text-center'>hoặc</div>
      <Panel className='mt-2.5' bordered>
        <Form.Group>
          <Button onClick={() => { navigate(`/sign/register`); }} appearance="subtle" block size="md">
            Tiến hành đăng ký
          </Button>
        </Form.Group>
      </Panel>
    </>
  )
}

export default Login;