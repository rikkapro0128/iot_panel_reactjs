import { Modal, Button, Input, InputPicker, } from 'rsuite';
import { useState, useEffect } from 'react';
import { Toast } from '@/instance/toast.js';
import api from '@/api/index.js';

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

function ModalInput(props) {

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
    const res = await api.post('api/node/create', { nameNode, nodeModal });
    if(res.data.message === "create node successfull!") {

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

export { ModalInput };
