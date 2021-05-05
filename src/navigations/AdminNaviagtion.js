import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import OtpVerification from "../screens/OtpVerification";
import AdminDashboard from "../screens/AdminDashboard";
import CreateService from "../screens/CreateService";
import DetailScreen from "../screens/DetailScreen";

export default createStackNavigator({
    AdminDashboard,
    CreateService,
    DetailScreen
},
    {
        headerShown: false,
        headerMode: 'none'
    });
