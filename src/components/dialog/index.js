import { memo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DialogMui({ open = false, title = 'Xác nhận hành động', message = '{ Lời nhắn }', handleClose = () => {}, handleAccept = () => {} }) {

  return (
    !open 
    ? null
    : (
      <Dialog
        open={ open }
        onClose={ handleClose }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { `${ title }?` }
        </DialogTitle>
        <DialogContent>
          <DialogContentText align='center' fontSize={'14px'} id="alert-dialog-description">
            { message }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose }>Huỷ</Button>
          <Button onClick={ handleAccept } autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
  
}

export default memo(DialogMui);
