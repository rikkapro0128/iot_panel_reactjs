import { Popover, Dropdown, Whisper } from 'rsuite';
import { useState, forwardRef, useRef, memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
              { dropdownItem.Icon }
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

function MuiMenu({ id, anchorEl, onClose, onClick, payload, onEventKey }) {

  const open = Boolean(anchorEl);

  return (
    <Menu
      anchorEl={anchorEl}
      id={`${id}-menu`}
      open={open}
      onClose={onClose}
      onClick={onClick}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {
        payload.map(data => {
          return (
            <MenuItem sx={{ display: 'flex', justifyContent: 'space-between' }} key={data.eventKey} onClick={ () => { onEventKey({ eventKey: data.eventKey }) } }>
              <Typography variant="caption" display="block">
                { data.name } 
              </Typography>
              <Box sx={{ marginLeft: '0.5rem' }}>
                { data.Icon }
              </Box>
            </MenuItem>
          )
        })
      }
    </Menu>
  )
}

export {
  MuiMenu,
}

export default memo(MenuPopover);
