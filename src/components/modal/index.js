import { Modal, Button, Input } from 'rsuite';

function ModalInput(props) {
  return (
      <Modal size={'xs'} backdrop={true} open={props.toggle} onClose={props.changeToggle}>
        <Modal.Header>
          <Modal.Title>Tạo Node Control</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input name="node-name" placeholder="Tên Node MCU" />
        </Modal.Body>
        <Modal.Footer>
          <Button className='px-5' appearance="primary">
            Xong
          </Button>
          <Button onClick={props.changeToggle} appearance="subtle">
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export { ModalInput };
