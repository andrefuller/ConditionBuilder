import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const ErrorTooltip = styled(
  ({ className, ...props }: TooltipProps): React.ReactNode => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ),
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.error.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
  },
}));

export default ErrorTooltip;
