
// ==============================|| ROUTING RENDER ||============================== //

import { useRoutes } from "react-router-dom";
import mainroutes from "./mainRoutes";

export default function ThemeRoutes() {
    return useRoutes([ mainroutes])
        }
