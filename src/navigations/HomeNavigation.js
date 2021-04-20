import React from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator } from 'react-navigation'

import Dashboard from "../screens/Dashboard";
import CreateService from "../screens/CreateService";
import DetailScreen from "../screens/DetailScreen";

const { width, height } = Dimensions.get('window');
//Use iPhone as base size wich is 375 * 812

const baseWidth = 414;
const baseHeight = 972;

let scaleWidth = width / baseWidth;
let scaleHeight = height / baseHeight;

const HomeNavigation = createSwitchNavigator({
   Dashboard,
   CreateService,
   DetailScreen
}, {
    initialRouteName: 'Dashboard'
})


export default createStackNavigator({ headerMode: "none" });
