import { Popover, Dropdown, Whisper } from 'rsuite';
import { forwardRef, useRef } from 'react';
import { IconOption, IconPlayListRemove, IconInfo } from '@/icons';

const styleCommon = 'flex items-center justify-around';

const MenuPopoverDefault = forwardRef(({ onSelect, ...rest }, ref) => {
  return (
  <Popover ref={ref} {...rest} full>
    <Dropdown.Menu onSelect={onSelect}>
      <Dropdown.Item className={styleCommon} eventKey={'settings'}>
        Settings 
        <IconOption className='ml-2.5' />
      </Dropdown.Item>
      <Dropdown.Item className={styleCommon} eventKey={'delete'}>
        Delete
        <IconPlayListRemove className='ml-2.5' />
      </Dropdown.Item>
      <Dropdown.Item className={styleCommon} eventKey={'about'}>
        About
        <IconInfo className='ml-2.5' />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Popover>
)});

function MenuPopover({ children, handleSelect, id, target }) {
  const ref = useRef();

  return (
    <Whisper
      placement="bottomEnd"
      controlId={`control-id-with-${id}`}
      trigger="click"
      ref={ref}
      speaker={
        <MenuPopoverDefault onSelect={ (eventKey, event) => {
          handleSelect({ 
            event, 
            eventKey, 
            actions: {
              open() {
                ref.current.open();
              },
              close() {
                ref.current.close();
              } 
            }, 
            target 
          });
        } } />
      }
      >
        <div>
          { children }
        </div>
    </Whisper>
  )
}

export { 
  MenuPopover
}
