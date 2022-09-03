import { Modal, Loader, Button, Input, InputPicker } from 'rsuite';
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { addNode } from "@/store/nodeSlice";
import { Toast } from '@/instance/toast.js';
import api from '@/api/index.js';

// use by Modal
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import ModalMui from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  backgroundColor: '#292d33',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '6px',
};

const nodeExample = [
  {
    label: 'Node ESP8266 Wifi',
    value: 'esp8266',
  },
  {
    label: 'Node ESP32 Wifi',
    value: 'esp32',
  },
  {
    label: 'Arduino Wifi',
    value: 'arduino-wifi',
  }
] 

function ModalInputNode(props) {

  const dispatch = useDispatch();
  const [nameNode, setNameNode] = useState('');
  const [nodeModal, setNodeModal] = useState('esp8266');

  function handleEnterModel(event) {
    if(event.key === 'Enter') {
      handleCompleteData();
    }
  }

  async function handleCompleteData() {
    if(!nameNode) {
      Toast({ type: 'error', message: 'Bạn phải nhập tên node!' });
      return;
    }
    if(!nodeModal) {
      Toast({ type: 'error', message: 'Bạn phải chọn node modal!' });
      return;
    }
    try {
      const res = await api.post('api/node/create', { nameNode, nodeModal });
      if(res.data.message === "create node successfull!") {
        Toast({ type: 'success', message: 'Đã tạo node thành công!' });
        props.changeToggle();
        dispatch(addNode(res.data.node));
        setNameNode('');
      }
    } catch (error) {
      console.log(error);
      Toast({ type: 'error', message: 'Tạo node không thành công!' });
    }
  }
  
  return (
    <Modal onKeyUp={handleEnterModel} size={'xs'} backdrop={true} open={props.toggle} onClose={props.changeToggle}>
        <Modal.Header>
          <Modal.Title>Tạo Node Control</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input onChange={(name) => { setNameNode(name) }} name="node-name" placeholder="Tên Node MCU" />
          <InputPicker onChange={(nodeModal) => { setNodeModal(nodeModal) }} defaultValue={'esp8266'} disabledItemValues={['esp32', 'arduino-wifi']} className='w-full mt-2.5' placeholder='Chọn model' data={nodeExample} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCompleteData} className='px-5' appearance="primary">
            Xong
          </Button>
          <Button onClick={props.changeToggle} appearance="subtle">
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

function ModalDynamic({ open, size, handleClose, children, title, isControll = true }) {
  const [statusData, setStatusData] = useState(false);

  useEffect(() => {
    setStatusData(true);
  }, [children])

  return (
    <Modal
      size={size}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>
        <Modal.Title>{ title || 'Không có tiêu đề' }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {statusData ? (
          children
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Loader size="md" />
          </div>
        )}
      </Modal.Body>
      {
        isControll && (
          <Modal.Footer>
            <Button onClick={handleClose} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        )
      }
    </Modal>
  )
}

function MaterialDefaultModal({ open = false, handleClose, children }) {
  return (
    <ModalMui
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 200,
      }}
    >
      <Fade in={open}>
        <Box sx={styleModal}>
          { children }
        </Box>
      </Fade>
    </ModalMui>
  );
}

export { ModalInputNode, ModalDynamic, MaterialDefaultModal };
