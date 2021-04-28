import React, {useRef, useState, Component} from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
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
      emailOrPhone: '',
      location: '',
      method: 'login',
      isCustomerSelected: true,
      isSelected: false,
      isBarberSelected: false,
      isShowPassword: false,
      isEmail: false,
   //   phone_number: '9988776656',
      password: 'test123',
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

    if (value == null || isEmpty(true,userType) ) {
      console.log('sssssssssssssssss00');
      navigation.navigate('AuthLogin');
    } else {
      if (value.UserTypeID == 1) {
        console.log('usertype1',value.UserTypeID);
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

  callLoginApi = async () => {
    await this.setState({loading: true});
    const url = apiConstant.AUTHENTICATE;

    console.log('phoneeeeeeeee',JSON.stringify(this.state.phone_number));
    const requestBody = {
      Phone: this.state.phone_number,
      Password: this.state.password,
    };

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
    };

    console.log('Login url==> ' + JSON.stringify(url));
    console.log('Login requestBody ==> ' + JSON.stringify(requestBody));
    console.log('Login headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data ==> ' + JSON.stringify(data));
            if (data.status === 200) {
              await this.setState({loading: false});

              //store data
              await storeJSONData('user', data.data);
              await storeJSONData('value', this.state.value);
              const user_data = await getJSONData('user');
              const userType = await getJSONData('value');
              // console.log('userType', JSON.stringify(userType));

              //navigate screen
              this.props.navigation.navigate('OtpVerification', {
                phone_number: this.state.emailOrPhone,
              });
            }
          })
          .catch(error => {
            this.setState({loading: false});
            console.log('Login error : ', error);
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
    if (this.state.phone_number.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        'Please enter phone number',
      );
    } else {
      await this.setState({loading: true});
      await this.callLoginApi();
      //this.uploadDocuments();
    }
  };

  onPressText = async text => {
    await this.setState({phone_number: text});
    // this.VerifyNumber();
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
              //isSelected={this.state.isSelected}
              radio_props={radio_props}
              initial={0}
              labelStyle={{marginRight: 10}}
              formHorizontal={true}
              animation={true}
              buttonSize={12}
              buttonOuterSize={22}
              // labelHorizontal={false}
              onPress={value => {
                this.setState({value: value});
              }}
            />
          </View>

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard topMargin={scaleHeight * 20} cornerRadius={10}>
              <View
                style={{
                  marginBottom: scaleHeight * 60,
                  marginTop: scaleHeight * 20,
                  marginHorizontal: scaleHeight * 20,
                }}>
                <TextInput
                  label="Enter Your Phone Number"
                  keyboardType={'phone-pad'}
                  value={this.state.phone_number}
                  mode="outlined"
                  theme={{
                    colors: {
                      primary: this.props.theme.BUTTON_BACKGROUND_COLOR,
                      underlineColor: 'transparent',
                    },
                  }}
                  onChangeText={text => this.setState({phone_number: text})}
                />
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
