import React, {useRef, useState, Component} from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  TextInput,
  Text,
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
import {isNetAvailable} from '../../utils/NetAvailable';
import RadioForm from 'react-native-simple-radio-button';
import {Spacing, Typography} from '../../styles';
import {fetchServerDataPost} from '../../utils/FetchServerRequest';
import apiConstant from '../../constants/apiConstant';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import Globals from '../../constants/Globals';
import Input from 'react-native-input-style';
import {capitalize, isEmpty} from '../../utils/Utills';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';
import {storeJSONData, getJSONData} from '../../utils/AsyncStorage';
import {LOGO, SPLASH_ICON} from '../../images';

var radio_props = [
  {label: Globals.HOME, value: 0},
  {label: Globals.AJENT, value: 1},
  {label: Globals.ADMIN, value: 2},
  {label: Globals.TECHNICIAN, value: 3},
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emailOrPhone: '9413156425',
      location: '',
      method: 'login',
      isCustomerSelected: true,
      isSelected: false,
      isBarberSelected: false,
      isShowPassword: false,
      isEmail: false,
      phone_number: '',
      UserID: 3,
      OTP: '817095',
      IsGenerateToken: false,
      agent_id: '',
      fcmToken: '',
      signInButtonText: Globals.CUSTOMER_SIGN_IN,
      value: 0,
    };
  }

  async componentDidMount() {
    const user_data = await getJSONData('user');
    await this.applicationInit(user_data);

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
  };

  barberClicked = async () => {
    await this.setState({
      signInButtonText: Globals.AJENT_SIGN_IN,
      isCustomerSelected: false,
      isBarberSelected: true,
      userType: Globals.AJENT,
    });
  };

  applicationInit = async value => {
    const {navigation} = this.props;
    const userType = await getJSONData('value');
    console.log('value', value);
    console.log('usertype', userType);

    if (value == null || isEmpty(true, userType)) {
      console.log('sssssssssssssssss00');
      navigation.navigate('AuthLogin');
    } else {
      if (value.UserTypeID == 1) {
        console.log('usertype1', value.UserTypeID);
        this.props.navigation.navigate('HomeNavigation');
      } else if (value.UserTypeID == 2) {
        console.log('usertype2', value.UserTypeID);

        this.props.navigation.navigate('AgentNavigation');
      } else if (value.UserTypeID == 3) {
        console.log('usertype4', value.UserTypeID);
        this.props.navigation.navigate('TechnicianNavigation');
      } else {
        console.log('usertype5', value.UserTypeID);
        this.props.navigation.navigate('AdminNavigation');
      }
    }
  };

  onPressSignUp = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('SignUp');
  };

  onPressSignIN = async item => {
    Keyboard.dismiss();
    await this.signUpCheckValidity();
  };

  Login = async () => {
    this.setState({loading: true});
    let url = apiConstant.SEND_OTP;
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
    };

    let requestBody = {
      //  type: this.state.requestBody.type,
      phone_number: this.state.emailOrPhone,
    };

    console.log('url verify otp', JSON.stringify(url));
    console.log('header verify otp', JSON.stringify(headers));
    console.log('requestBody verify otp => ', JSON.stringify(requestBody));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async response => {
            console.log('response => ', JSON.stringify(response));

            let data = await response.json();
            console.log('data => ', JSON.stringify(data));
            if (data.status === 200) {
              await this.setState({loading: false});

              this.props.navigation.navigate('OtpVerification', {
                phone_number: this.state.emailOrPhone,
              });
            } else {
              await this.setState({loading: false});
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status.message,
              );
            }
          })
          .catch(error => {
            this.setState({loading: false});
            console.log('Login error : ', error);
            // this.props.appReload(true);
          });
      } else {
        this.setState({loading: false});
        this.props.showAlert(
          true,
          Globals.ErrorKey.NETWORK_ERROR,
          'Please check network connection.',
        );
      }
    });
  };

  signUpCheckValidity = async () => {
    if (this.state.emailOrPhone.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        'Please enter phone number',
      );
    } else {
      await this.setState({loading: true});
      await this.Login();
      //this.uploadDocuments();
    }
  };

  onPressText = async text => {
    await this.setState({phone_number: text});
    // this.VerifyNumber();
  };

  handleEmail = text => {
    this.setState({phone_number: text});
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
          <Image
            style={{
              width: '70%',
              height: scaleHeight * 50,
              marginTop: scaleHeight * 50,
              marginStart: scaleWidth * 60,
            }}
            source={SPLASH_ICON}
            resizeMode={'cover'}
          />
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
              //isSelected={this.state.isSelected}
              radio_props={radio_props}
              initial={0}
              labelStyle={{marginRight: 10}}
              formHorizontal={true}
              animation={true}
              buttonSize={10}
              buttonOuterSize={20}
              // labelHorizontal={false}
              onPress={value => {
                this.setState({value: value});
              }}
            />
          </View>

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard topMargin={scaleHeight * 20} cornerRadius={10}>
              <View style={{marginHorizontal: scaleHeight * 10}}>
                <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                  Phone Number
                </Text>

                <View
                  style={{
                    marginVertical: scaleHeight * 10,
                    height: scaleHeight * 50,
                    borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    borderWidth: 1,
                  }}>
                  <TextInput
                    // style = {styles.input}
                    //   underlineColorAndroid = "transparent"
                    placeholder="Phone Number"
                    keyboardType={'number-pad'}
                    //   placeholderTextColor = { this.props.theme.BUTTON_BACKGROUND_COLOR}
                    autoCapitalize="none"
                    onChangeText={this.handleEmail}
                    value={this.state.emailOrPhone}
                    onChangeText={text => this.setState({emailOrPhone: text})}
                  />
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
              buttonText={'Send OTP'}
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
