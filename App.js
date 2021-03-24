import React, { Component } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navigator from './src/navigations/Navigation'
import NavigationService from './src/navigations/NavigationService'
import { connect } from 'react-redux';

class App extends Component {
  constructor() {
    super();
    LogBox.ignoreLogs(['Class RCTCxxModule']);
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    
  }

  componentWillUnmount() {
    //this.setBackground;
    //this.setNotificationOpen;
    //this.unsubscribe;
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
        <View style={styles.navigatorView}>
          <Navigator
            ref={navigatorRef => {
              NavigationService.init(navigatorRef);
            }}
          />
          
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  navigatorView: {
    flex: 1,
    width: '100%',
  },
})

const mapStateToProps = state => ({
  theme: state.themeReducer.theme,
  alertVisibility: state.alertReducer.alertVisibility,
})

export default connect(
  mapStateToProps,
)(App)