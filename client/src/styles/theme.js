// UI Imports
import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';

export default createTheme({
  palette: {
    primary: blue,
    secondary: yellow,
  },
  typography: {
    useNextVariants: true,
  },
});
