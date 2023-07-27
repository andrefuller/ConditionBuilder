import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { AboutDialogProps } from '../types';

const AboutDialog = ({ open, onClose }: AboutDialogProps): React.ReactNode => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>About: Condition Builder</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This tool allows you to load an array of data and layer in <i>and</i>/
          <i>or</i>&nbsp;conditions to filter the data.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
