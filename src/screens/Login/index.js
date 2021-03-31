import React, {Component} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import CustomBGParent from '../../components/CustomBGParent';
import CustomTextView from '../../components/CustomTextView';
import {GRAY_DARK, TEXT_COLOR} from '../../styles/colors';
import styles from './styles';
import CustomButton from '../../components/CustomButton';
import CustomBGCard from '../../components/CustomBGCard';
import {
  FONT_SIZE_16,
  FONT_SIZE_20,
  FONT_SIZE_25,
} from '../../styles/typography';
import {
  SCALE_10,
  SCALE_15,
  SCALE_20,
  SCALE_40,
  SCALE_60,
} from '../../styles/spacing';
import RadioForm from 'react-native-simple-radio-button';
import {Spacing, Typography} from '../../styles';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import Globals from '../../constants/Globals';
import {capitalize, isEmpty} from '../../utils/Utills';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';

var radio_props = [
  {label: Globals.HOME, value: 0, valueIndex: 0},
  {label: Globals.AJENT, value: 1, valueIndex: 0},
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emailOrPhone: '',
      location: '',
      password: '',
      method: 'login',
      isCustomerSelected: true,
      isSelected: false,
      isBarberSelected: false,
      isShowPassword: false,
      isEmail: false,
      facebook_id: '',
      google_id: '',
      first_name: '',
      last_name: '',
      agent_id:'',
      userType: Globals.CUSTOMER,
      fcmToken: '',
      signInButtonText: Globals.CUSTOMER_SIGN_IN,
      value: 0,
    };
  }

  componentDidMount() {
    //        this.requestUserPermission();
  }

  clearStore = () => {
    this.setState({
      emailOrPhone: '',
      facebook_id: '',
      google_id: '',
      first_name: '',
      last_name: '',
    });
  };

  customerClicked = async () => {
    await this.setState({
      signInButtonText: Globals.HOME_SIGN_IN,
      isSelected: true,
      isBarberSelected: false,
      userType: Globals.CUSTOMER,
    });
  };

  _onFocus = () => {
    const {navigation} = this.props;
    const userType = navigation.getParam('userType');
    if (userType === Globals.CUSTOMER) {
      this.customerClicked();
    }
    if (userType === Globals.AJENT) {
      this.barberClicked();
    }
  };

  barberClicked = async () => {
    await this.setState({
      signInButtonText: Globals.AJENT_SIGN_IN,
      isCustomerSelected: false,
      isBarberSelected: true,
      userType: Globals.AJENT,
    });
  };

  onPressSignUp = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('SignUp');
  };

  onPressSignIN = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <CustomBGParent
        loading={this.state.loading}
        backGroundColor={this.props.theme.BACKGROUND_COLOR}>
        <NavigationEvents onWillFocus={this._onFocus} />
        <ScrollView
          style={[
            styles.container,
            {backgroundColor: this.props.theme.BACKGROUND_COLOR},
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.textViewHeader}>
            <CustomTextView
              textStyle={{
                marginTop: scaleHeight * 50,
                marginLeft: scaleWidth * 20,
                fontWeight: 'bold',
              }}
              fontTextAlign={'left'}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              fontSize={Typography.FONT_SIZE_25}
              value={'Sign In'}
            />
          </View>

          <View style={styles.buttonSection}>
            <RadioForm
              isSelected={this.state.isSelected}
              radio_props={radio_props}
              initial={0}
              labelStyle={{marginRight: 10}}
              formHorizontal={true}
              animation={true}
              // labelHorizontal={false}
              onPress={value => {
                this.setState({value: value});
              }}
            />
          </View>

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard
              topMargin={scaleHeight * 20}
              cornerRadius={10}
              bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
              <View
                style={{
                  marginHorizontal: scaleWidth * 15,
                  marginBottom: scaleHeight * 60,
                  marginTop: scaleHeight * 20,
                }}>
               

                <TextInput
                  style={{
                    fontSize: FONT_SIZE_16,
                    height: scaleHeight * 50,
                    borderColor: GRAY_DARK,
                    borderBottomWidth: 1,
                    marginTop: scaleHeight * 20,
                  }}
                  onChangeText={text => this.setState({emailOrPhone: text})}
                  value={this.state.emailOrPhone}
                  placeholder={'Enter Your Phone'}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: scaleHeight * 20,
                    borderBottomWidth: 1,
                    borderColor: GRAY_DARK,
                  }}>
                  <TextInput
                    style={{
                      fontSize: FONT_SIZE_16,
                      height: scaleHeight * 50,
                      width: '85%',
                    }}
                    onChangeText={text => this.setState({password: text})}
                    value={this.state.password}
                    placeholder={'Password'}
                    secureTextEntry={!this.state.isShowPassword}
                  />
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: scaleHeight * 35,
                      width: scaleWidth * 35,
                    }}
                    onPress={this.showPassword}>
                    <Image
                      style={{
                        height: scaleHeight * 15,
                        width: scaleWidth * 15,
                      }}
                      //   source={this.state.isShowPassword ? EYE_ON : EYE_OFF}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </CustomBGCard>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: scaleHeight * 10,
              marginHorizontal: scaleWidth * 20,
            }}>
            <TouchableOpacity onPress={this.onPressForgotPassword}>
              <CustomTextView
                value={'Forgot Password?'}
                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                fontSize={FONT_SIZE_16}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: scaleWidth * 20,
              marginTop: scaleHeight * 30,
            }}>
            <CustomButton
              onPress={() => this.onPressSignIN()}
              textStyle={{
                fontSize: FONT_SIZE_20,
                color: this.props.theme.BUTTON_TEXT_COLOR,
              }}
              buttonText={this.state.value ==0 ? Globals.HOME_SIGN_IN : Globals.AJENT_SIGN_IN }
              cornerRadius={100}
              buttonHeight={scaleHeight * 50}
              buttonStyle={[
                styles.buttonsShadow,
                {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR},
              ]}
              buttonWidth={Spacing.SCALE_320}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: scaleHeight * 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: scaleHeight * 40,
            }}>
            <CustomTextView
              value={"Don't have an account?"}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              textStyle={{opacity: 0.5}}
              fontSize={FONT_SIZE_16}
            />
            <TouchableOpacity onPress={() => this.onPressSignUp()}>
              <CustomTextView
                value={' Sign Up'}
                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                textStyle={{fontWeight: 'bold'}}
                fontSize={FONT_SIZE_16}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomBGParent>
    );
  }
}
const mapStateToProps = state => ({
  theme: state.themeReducer.theme,
});

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
