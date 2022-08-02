import { Form, Button, Panel } from 'rsuite';
// import { Link } from "react-router-dom";

function Register() {
  return (
    <>
      <Panel header={<h3 className='text-center text-3xl'>Đăng ký</h3>} bordered>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Tên đăng ký</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
            <Form.Control name="password" type="password" autoComplete="off" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Nhập lại mật khẩu</Form.ControlLabel>
            <Form.Control name="password" type="password" autoComplete="off" />
          </Form.Group>
          <Form.Group>
            <Button block appearance="primary" size="md">Đăng ký</Button>
          </Form.Group>
        </Form>
      </Panel>
    </>
  )
}

export default Register;