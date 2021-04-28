import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import AuthStackNavigator from "./AuthStackNavigator";
import AgentNavigation from "./AgentNavigation";
import HomeNavigation from "./HomeNavigation";
import AdminNavigation from "./AdminNaviagtion";
import TechnicianNavigation from "./TechnicianNavigation";

const AppNavigator = createSwitchNavigator({
   
    AuthLogin: createStackNavigator({
        AuthLogin: {
          screen: AuthStackNavigator,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),

     AgentNavigation: createStackNavigator({
        AgentNavigation: {
          screen: AgentNavigation,
          navigationOptions: {
            headerShown: false,
          },

        },
      }),
      HomeNavigation: createStackNavigator({
        HomeNavigation: {
          screen: HomeNavigation,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
      TechnicianNavigation: createStackNavigator({
        TechnicianNavigation: {
          screen: TechnicianNavigation,
          navigationOptions: {
            headerShown: false,
          },
        },
      }), 
      AdminNavigation: createStackNavigator({
        AdminNavigation: {
          screen: AdminNavigation,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
  
    initialRouteName: 'AuthLogin'
});

export default createAppContainer(AppNavigator)
