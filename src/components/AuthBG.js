import PropTypes from 'prop-types';
import React from 'react';
import {
    Image,
    ImageBackground,
    Keyboard,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { BACKGROUND_SCREEN, SIGN_IN } from '../images';
import { SCALE_12 } from '../styles/spacing';
import { ifIphoneX } from '../utils/iPhoneXHelper';
import OfflineNotice from '../utils/OfflineNotice';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class AuthBG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusbar: Platform.OS === 'ios' ? false : true,
      isKeyboadVisible: false,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = () => {
    this.setState({
      isKeyboadVisible: true,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      isKeyboadVisible: false,
    });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            styles.container,
            {backgroundColor: this.props.theme.BACKGROUND_COLOR},
          ]}>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground source={BACKGROUND_SCREEN} style={styles.image}>
            <View
              style={[
                styles.content,
                {paddingTop: this.props.topPadding ? STATUSBAR_HEIGHT : 0},
              ]}>
              <OfflineNotice />
              {this.props.children}
            </View>
            <Spinner
              overlayColor={'rgba(34, 60, 83, 0.6)'}
              visible={this.props.loading}
              textContent={this.props.loadingText}
              textStyle={{
                color: '#FFF',
                textAlign: 'center',
                fontSize: SCALE_12,
              }}
            />

            {!this.state.isKeyboadVisible && (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Image
                  style={[
                    this.props.imageStyle,
                    {
                      width: this.props.imageWidth,
                      height: this.props.imageHeight,
                    },
                  ]}
                  resizeMode={this.props.resizeMode}
                  source={this.props.bottomImage}
                />
              </View>
            )}
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AuthBG.propTypes = {
  backGroundColor: PropTypes.string,
  loading: PropTypes.bool,
  topPadding: PropTypes.bool,
  bottomImage: PropTypes.number,
  imageHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageStyle: PropTypes.object,
  resizeMode: PropTypes.string,
  loadingText: PropTypes.string,
};

AuthBG.defaultProps = {
  backGroundColor: '',
  loading: false,
  topPadding: true,
  bottomImage: SIGN_IN,
  imageHeight: 100,
  imageWidth: 100,
  imageStyle: {
    position: 'absolute',
    bottom: 0,
  },
  resizeMode: 'cover',
  loadingText: 'Loading...',
};

const mapStateToProps = (state) => ({
  theme: state.currentTheme,
});
export default connect(mapStateToProps)(AuthBG);

export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? (ifIphoneX() ? 50 : 20) : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
  },
  image: {
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
});
