import { Modal, Button } from 'rsuite';

function CustomModal({ toggle, changeToggle, hasButtonCancle, hasButtonOk = true, message, title = 'Thông báo' }) {
  return (
    <Modal backdrop={true} role="alertdialog" open={toggle} onClose={changeToggle} size="xs">
      <Modal.Header>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
      <Modal.Body className='text-center' >
        { message }
      </Modal.Body>
      <Modal.Footer>
        {hasButtonOk && <Button onClick={changeToggle} appearance="primary">
          Ok
        </Button>}
        {hasButtonCancle && <Button onClick={changeToggle} appearance="subtle">
          Cancel
        </Button>}
      </Modal.Footer>
    </Modal>
  )
}

export { CustomModal };
