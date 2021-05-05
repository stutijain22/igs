import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  Text,
  TextInput,
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
import Input from 'react-native-input-style';
import {Spacing, Typography} from '../../styles';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import Globals from '../../constants/Globals';
import {capitalize, isEmpty} from '../../utils/Utills';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import RadioForm from 'react-native-simple-radio-button';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';
import {SPLASH_ICON} from '../../images';

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
      password: '',
      method: 'login',
      agent_id: '',
      isCustomerSelected: true,
      isBarberSelected: false,
      isShowPassword: false,
      isEmail: false,
      facebook_id: '',
      google_id: '',
      name: '',
      dob: '',
      focus: false,
      phone_number: '',
      email_id: '',
      confirm_password: '',
      userType: Globals.CUSTOMER,
      fcmToken: '',
      value: 0,
      isFocused: false,
      signInButtonText: Globals.CUSTOMER_SIGN_UP,
    };
  }

  componentDidMount() {
    //this.signUpCheckValidity();
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
      signInButtonText: Globals.CUSTOMER_SIGN_UP,
      isCustomerSelected: true,
      isBarberSelected: false,
      userType: Globals.CUSTOMER,
    });
  };

  /* _onFocus = () => {
    const {navigation} = this.props;
    const userType = navigation.getParam('userType');
    if (userType === Globals.CUSTOMER) {
      this.customerClicked();
    }
    if (userType === Globals.AJENT) {
      this.barberClicked();
    }
  };*/

  barberClicked = async () => {
    await this.setState({
      signInButtonText: Globals.AJENT_SIGN_UP,
      isCustomerSelected: false,
      isBarberSelected: true,
      userType: Globals.AJENT,
    });
  };

  onPressSignUp = () => {
    Keyboard.dismiss();
    this.signUpCheckValidity();
  };

  onFocusChange = () => {
    this.setState({isFocused: false});
  };

  onPressSignIN = () => {
    Keyboard.dismiss();
    this.props.navigation.navigate('Login');
  };

  signUpCheckValidity = () => {
    if (this.state.name.toString().trim().length == 0) {
      this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter name');
    } else if (this.state.dob.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        'Please enter date of birth',
      );
    } else if (this.state.phone_number.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        'Please enter phone number',
      );
    } else {
      this.props.navigation.navigate('OtpVerification');
      //this.uploadDocuments();
    }
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
              value={'Sign Up'}
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
              buttonSize={10}
              buttonOuterSize={20}
              // labelHorizontal={false}
              onPress={value => {
                this.setState({value: value});
              }}
            />
          </View>

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard
              topMargin={scaleHeight * 15}
              cornerRadius={scaleWidth * 15}
              //  bgColor={this.props.theme.CARD_BACKGROUND_COLOR}
            >
              <View style={styles.inputViewCards}>
              {this.state.value == 0 && (
                <View>
              <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                  Agent Id
                </Text>

                <View
                   style = {styles.input}
                   >
                  <TextInput
                    //   underlineColorAndroid = "transparent"
                    placeholder="Agent Id"
                    autoCapitalize="none"
                    keyboardType='numeric'
                    onChangeText={(text) => this.setState({agent_id: text})}
                  />
                </View>
                </View>
                )}

                <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                Name
                </Text>

                <View
                   style = {styles.input}
                   >

                  <TextInput
                    //   underlineColorAndroid = "transparent"
                    placeholder="Name"
                    autoCapitalize="none"
                  onChangeText={text => this.setState({name: text})}
                  />
                
                </View>

                <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                Date Of Birth
                </Text>

                <View
                   style = {styles.input}
                   >
                  <TextInput
                    //   underlineColorAndroid = "transparent"
                    placeholder="Date Of Birth"
                    autoCapitalize="none"
                    onChangeText={text => this.setState({dob: text})}
                  />
                </View>

                <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                Phone Number
                </Text>

                <View
                   style = {styles.input}
                   >
                  <TextInput
                    //   underlineColorAndroid = "transparent"
                    placeholder="Phone Number"
                    autoCapitalize="none"
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({phone_number: text})}
                  />
                </View>

                <Text style={{color: this.props.theme.BUTTON_BACKGROUND_COLOR}}>
                Email(optional)
                </Text>

                <View
                   style = {styles.input}
                   >
                  <TextInput
                    //   underlineColorAndroid = "transparent"
                    placeholder="Email(optional)"
                    autoCapitalize="none"
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({email: text})}
                  />
                </View>

              </View>
              <View>
              </View>
            </CustomBGCard>
          </View>

          <View
            style={{
              marginHorizontal: scaleWidth * 20,
              marginTop: scaleHeight * 30,
            }}>
            <CustomButton
              onPress={() => this.onPressSignUp()}
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
              value={'You have an account?'}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              textStyle={{opacity: 0.5}}
              fontSize={FONT_SIZE_16}
            />
            <TouchableOpacity onPress={() => this.onPressSignIN()}>
              <CustomTextView
                value={' Sign In'}
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
