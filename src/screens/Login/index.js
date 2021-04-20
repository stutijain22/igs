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
import { isNetAvailable } from "../../utils/NetAvailable";
import RadioForm from 'react-native-simple-radio-button';
import {Spacing, Typography} from '../../styles';
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import apiConstant from "../../constants/apiConstant";
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import Globals from '../../constants/Globals';
import Input from 'react-native-input-style';
import {capitalize, isEmpty} from '../../utils/Utills';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';
import { storeJSONData,getJSONData } from '../../utils/AsyncStorage';

var radio_props = [
  {label: Globals.HOME, value: 0},
  {label: Globals.AJENT, value: 1},
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
      phone_number: '1234567890',
      password:'test123',
      agent_id: '',
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

  onPressSignIN = async item => {
    Keyboard.dismiss();
    await this.signUpCheckValidity();
  };

  callLoginApi = async () => {
    await this.setState({ loading: true });
    const url = apiConstant.AUTHENTICATE;

    const requestBody = {
      Phone: this.state.phone_number,
        Password: this.state.password,
    }

    const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    }

    console.log('Login url==> ' + JSON.stringify(url));
    console.log('Login requestBody ==> ' + JSON.stringify(requestBody));
    console.log('Login headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
        if (success) {
            fetchServerDataPost(url, requestBody, headers).then(async (response) => {
                let data = await response.json();
                console.log('data ==> ' + JSON.stringify(data));
                if (data.status === 200) {
                    await this.setState({ loading: false });

                    //store data
                    await storeJSONData('user', data.data);
                  //  console.log('user_data', JSON.stringify(data.data));
                    const user_data = await getJSONData('user');

                    //navigate screen
                    alert(data.message);
                    this.props.navigation.navigate('OtpVerification', {
                      phone_number: this.state.emailOrPhone,
                      userType:this.state.value
                    });
                }
            }).catch(error => {
                this.setState({ loading: false });
                console.log("Login error : ", error);
            });
        } else {
            this.setState({ loading: false });
            this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
        }
    });
}

  signUpCheckValidity = async () => {
    if (this.state.phone_number.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        'Please enter phone number',
      );
    } else {
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
            <CustomBGCard
              topMargin={scaleHeight * 20}
              cornerRadius={10}
              bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
              <View
                style={{
                  marginBottom: scaleHeight * 60,
                  marginTop: scaleHeight * 20,
                }}>
                <TextInput
                  label="Enter Your Phone Number"
                  keyboardType={'phone-pad'}
                  value={this.state.phone_number}
                  mode="outlined"
                  theme={{ colors: { primary:this.props.theme.BUTTON_BACKGROUND_COLOR ,underlineColor:'transparent',}}}
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
