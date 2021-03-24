import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";


export default createStackNavigator({
   // Welcome,
    Login,
   // SignUp,
   // OtpVerification,
   // ForgotPassword,
   // ResetPassword
},
    {
        headerShown: false,
        headerMode: 'none'
    });
