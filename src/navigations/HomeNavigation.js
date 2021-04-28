import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import OtpVerification from "../screens/OtpVerification";
import Dashboard from "../screens/Dashboard";
import CreateService from "../screens/CreateService";
import DetailScreen from "../screens/DetailScreen";

export default createStackNavigator({
    Dashboard,
    CreateService,
    DetailScreen
},
    {
        headerShown: false,
        headerMode: 'none'
    });
