import React, { Component } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import Navigator from './src/navigations/Navigation'
import NavigationService from './src/navigations/NavigationService'
import { connect } from 'react-redux';
import AlertPopUp from './src/components/AlertPopUp'

class App extends Component {
  constructor() {
    super();
    LogBox.ignoreLogs(['Class RCTCxxModule']);

  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
         {this.props.alertVisibility && (
            <AlertPopUp/>
          )} 
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