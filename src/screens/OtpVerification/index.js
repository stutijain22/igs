import React, {Component} from 'react';
import {Dimensions, View, TouchableOpacity} from 'react-native';
import CustomBGParent from '../../components/CustomBGParent';
import CustomTextView from '../../components/CustomTextView';
import styles from './styles';
import CustomButton from '../../components/CustomButton';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {storeData, storeJSONData, getJSONData} from '../../utils/AsyncStorage';
import Globals from '../../constants/Globals';
import {showAlert} from '../../redux/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  FONT_SIZE_14,
  FONT_SIZE_16,
  FONT_SIZE_20,
  FONT_SIZE_25,
} from '../../styles/typography';
import {
  SCALE_15,
  SCALE_20,
  SCALE_30,
  SCALE_40,
  SCALE_50,
} from '../../styles/spacing';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import {fetchServerDataPost} from '../../utils/FetchServerRequest';
import {isNetAvailable} from '../../utils/NetAvailable';
import apiConstant from '../../constants/apiConstant';

const {width} = Dimensions.get('window');

// code for automatic resend otp
// let countDownTimer = 600;

class OtpVerification extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      loading: false,
      headerText: '',
      subHeaderText: '',
      buttonText: '',
      otpSentButtonText: "Didn't receive otp?",
      code: '',
      timer: 30,
      emailOrPhone: '9413156425',
      UserID: 3,
      Phone: '9413156425',
      OTP: '817095',
      IsGenerateToken: false,
      //  userType: this.props.navigation.getParam('userType')
      // fromScreen: navigation.getParam('from'),
      // requestBody: navigation.getParam('requestBody')
    };
  }

  GetLoginData = async () => {
    const user_data = await getJSONData('user');
    if (user_data != null) {
      /* if (user_data.type == 'Agent') {
        await this.setState({is_flag: true});
      }*/
      await this.setState({
        Token: user_data.Token,
        // name: user_data.name,
      });
    }
    //await this.getCreatedService();
  };

  async componentDidMount() {
    this.setState({
      headerText: 'Verify OTP',
      subHeaderText: "You'll shortly receive an OTP on phone number.",
      buttonText: 'Verify',
    });
    this.interval = setInterval(
      () =>
        this.setState(prevState => ({
          timer: prevState.timer - 1,
          otpSentButtonText:
            prevState.timer - 1 === 0
              ? "Didn't receive otp?"
              : 'Please wait for ' + prevState.timer + ' Seconds after',
        })),
      1000,
    );

    // const user_data = await getJSONData('user');
    //await this.Login(user_data);
  }

  /* Login = async (value) => {
    const { navigation } = this.props;
    const userType = await getJSONData('value');
    console.log('userTypeeeeeeeee',JSON.stringify(userType));

    
    console.log('value',value);
    if (value == null) {
        navigation.navigate(Globals.AUTH_LOGIN);
    } else {
        if (value.userType == 0) {
      this.props.navigation.navigate('HomeNavigation');
        }else if(value.userType == 1) {
          this.props.navigation.navigate('AgentNavigation');
        }
        else if(value.userType == 2) {
          this.props.navigation.navigate('AdminNavigation');
        }
        else{
          this.props.navigation.navigate('TechnicianNavigation');
        }
  
    }
  };*/

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  clearState = () => {
    this.setState({
      loading: false,
      code: '',
    });
  };

  onClick = async () => {
    const user_data = await getJSONData('user');

    if (user_data.UserType == 'Home') {
      this.props.navigation.navigate('HomeNavigation');
    } else if (user_data.UserType == 'Agent') {
      this.props.navigation.navigate('AgentNavigation');
    } else if (user_data.UserType == 'Admin') {
      this.props.navigation.navigate('AdminNavigation');
    } else {
      this.props.navigation.navigate('TechnicianNavigation');
    }
    // this.props.navigation.navigate('HomeNavigation');
  };

  callLoginApi = async () => {
    await this.setState({loading: true});
    const url = apiConstant.AUTHENTICATE;

    // console.log('phoneeeeeeeee', JSON.stringify(this.state.phone_number));
    const requestBody = {
      // Phone: this.props.navigation.getParam('phone_number'),
      Phone: this.state.phone_number,
      UserID: this.state.UserID,
      OTP: this.state.OTP,
      IsGenerateToken: this.state.IsGenerateToken,
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
              //  await storeJSONData('value', this.state.value);
              const user_data = await getJSONData('user');
              //const userType = await getJSONData('value');
              await onClick();
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

  resendOtp = () => {
    this.setState({loading: true});
    let url = apiConstant.FORGOT_PASSWORD;
    let headers = {'Content-Type': 'application/json'};
    let requestBody = {
      type: this.state.requestBody.type,
      email: this.state.requestBody.email,
      phone_number: this.state.requestBody.phone_number
        ? this.state.requestBody.phone_number
        : '',
    };

    console.log('requestBody resend OTP => ', JSON.stringify(requestBody));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data => ', JSON.stringify(data));
            if (data.status.code === 200) {
              this.setState({loading: false});
              this.props.showAlert(
                true,
                Globals.ErrorKey.SUCCESS,
                data.status.message,
              );
            } else {
              this.setState({loading: false});
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status.message,
              );
            }
          })
          .catch(error => {
            this.setState({loading: false});
            //console.log("Login error : ", error);
            this.props.appReload(true);
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

  render() {
    return (
      <CustomBGParent loading={this.state.loading}>
        <View style={styles.textViewHeader}>
          <TouchableOpacity onPress={() => this.onClick()}>
            <CustomTextView
              textStyle={{
                marginTop: SCALE_50,
                marginLeft: SCALE_40,
                fontWeight: 'bold',
              }}
              fontTextAlign={'left'}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              fontSize={FONT_SIZE_25}
              value={this.state.headerText}
            />
          </TouchableOpacity>
          <CustomTextView
            textStyle={{
              marginTop: SCALE_15,
              marginLeft: SCALE_40,
              marginRight: SCALE_30,
            }}
            fontTextAlign={'left'}
            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
            fontSize={FONT_SIZE_14}
            value={this.state.subHeaderText}
          />
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <OTPInputView
            style={{width: '80%', height: SCALE_30 * 5}}
            pinCount={4}
            code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => {
              this.setState({code});
            }}
            autoFocusOnLoad
            codeInputFieldStyle={[
              styles.underlineStyleBase,
              {
                backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
              },
            ]}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            // onCodeFilled={this.VerifyOtp}
            placeholderCharacter={'*'}
            placeholderTextColor={this.props.theme.BUTTON_TEXT_COLOR}
          />
        </View>

        <View style={{marginHorizontal: SCALE_40}}>
          <CustomButton
            onPress={() => this.onClick()}
            /*  onPress={() =>
              `${this.state.code}`.length < 4
                ? this.props.showAlert(
                    true,
                    Globals.ErrorKey.ERROR,
                    'Please enter the OTP',
                  )
                : this.onClick()
            }*/
            textStyle={{
              fontSize: FONT_SIZE_20,
              color: this.props.theme.BUTTON_TEXT_COLOR,
            }}
            buttonText={this.state.buttonText}
            cornerRadius={100}
            buttonHeight={50}
            buttonStyle={[
              styles.buttonsShadow,
              {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR},
            ]}
            buttonWidth={'100%'}
          />
        </View>

        {/* <CustomTextView textStyle={{marginTop: SCALE_30}} fontSize={FONT_SIZE_16} fontColor={TEXT_COLOR}
                                value={'Resend confirmation code in ' + this.state.timer + ' sec'}/>*/}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scaleHeight * 40,
          }}>
          <CustomTextView
            value={this.state.otpSentButtonText}
            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
            textStyle={{opacity: 0.5}}
            fontSize={FONT_SIZE_16}
          />
          <TouchableOpacity onPress={() => this.resendOtp()}>
            <CustomTextView
              value={' Resend'}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              textStyle={{fontWeight: 'bold'}}
              fontSize={FONT_SIZE_16}
            />
          </TouchableOpacity>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);
