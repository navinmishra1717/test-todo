import { RouteObject } from "react-router-dom"
import HomePage from "../views/HomePage"

const mainroutes: RouteObject = {
        path: '/',
        element: <HomePage />,
        children: [{
            path: '/',
            element: <HomePage />
        }]
}

export default mainroutes