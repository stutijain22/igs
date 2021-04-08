import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import OtpVerification from "../screens/OtpVerification";
import Dashboard from "../screens/Dashboard";
import CreateService from "../screens/CreateService";

export default createStackNavigator({
   // Welcome,
    Login,
    SignUp,
    OtpVerification,
    Dashboard,
    CreateService
   // ForgotPassword,
   // ResetPassword
},
    {
        headerShown: false,
        headerMode: 'none'
    });
