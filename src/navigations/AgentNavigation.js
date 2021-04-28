import { createStackNavigator } from "react-navigation-stack";
import AgentDashboard from "../screens/AgentDashboard";
import AgentTechincianScreen from "../screens/AgentTechincianScreen";

export default createStackNavigator({
    AgentDashboard,
    AgentTechincianScreen
},
    {
        headerShown: false,
        headerMode: 'none'
    });
