import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../theme/muiTheme";

export default function ThemeProviderContext({ children }) {
    return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
