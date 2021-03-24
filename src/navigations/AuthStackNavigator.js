import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";


export default createStackNavigator({
   // Welcome,
    Login,
    SignUp,
   // OtpVerification,
   // ForgotPassword,
   // ResetPassword
},
    {
        headerShown: false,
        headerMode: 'none'
    });
