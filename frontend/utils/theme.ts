import pink from '@material-ui/core/colors/pink';
import { createMuiTheme } from '@material-ui/core/styles';
import {cyan} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: cyan,
        secondary: pink,
        background: {
            default: "#393939",
            paper: "#272d37"
        },
    },
});

export default theme;