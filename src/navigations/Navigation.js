import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import AuthStackNavigator from "./AuthStackNavigator";

const AppNavigator = createSwitchNavigator({
   
    AuthLogin: createStackNavigator({
        AuthLogin: {
          screen: AuthStackNavigator,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
  
    initialRouteName: 'AuthLogin'
});

export default createAppContainer(AppNavigator)
