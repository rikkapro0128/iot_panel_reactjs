import { Popover, Dropdown, Whisper } from 'rsuite';
import { forwardRef, useRef, memo } from 'react';

const styleCommon = 'flex items-center justify-between';

const MenuPopoverDefault = forwardRef(({ onSelect, dataDropDown, ...rest }, ref) => {
  return (
  <Popover ref={ref} {...rest} full>
    <Dropdown.Menu onSelect={onSelect}>
      { 
        dataDropDown.map(dropdownItem => {
          return (
            <Dropdown.Item key={dropdownItem.eventKey} className={styleCommon} eventKey={dropdownItem.eventKey}>
              <p className='mr-2'>{ dropdownItem.name }</p>
              { dropdownItem?.Icon && <dropdownItem.Icon/> }
            </Dropdown.Item>
          )
        })
      }
    </Dropdown.Menu>
  </Popover>
)});

function MenuPopover({ children, handleSelect, id, target, dataDropDown, placement }) {
  const ref = useRef();
  return (
    <Whisper
      placement={placement || 'auto'}
      controlId={`control-id-with-${id}`}
      trigger="click"
      ref={ref}
      speaker={
        <MenuPopoverDefault dataDropDown={dataDropDown} onSelect={ (eventKey, event) => {
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

export default memo(MenuPopover);
