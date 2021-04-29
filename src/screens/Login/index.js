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
import {YearPicker, MonthPicker, DayPicker} from 'react-dropdown-date';
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
import {Spacing, Typography} from '../../styles';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import Globals from '../../constants/Globals';
import {capitalize, isEmpty} from '../../utils/Utills';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';

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
      isBarberSelected: false,
      isShowPassword: false,
      isEmail: false,
      facebook_id: '',
      google_id: '',
      first_name: '',
      last_name: '',
      userType: Globals.PATIENT,
      fcmToken: '',
      signInButtonText: Globals.PATIENT_SIGN_IN,
      year: null,
      month: null,
      day: null,
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
            <CustomButton
              isSelected={this.state.isCustomerSelected}
              onPress={this.customerClicked}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
              }}
              buttonText={capitalize(Globals.PATIENT)}
              cornerRadius={100}
              buttonWidth={scaleWidth * 150}
              buttonHeight={scaleHeight * 35}
              buttonStyle={[
                styles.buttonsShadow,
                {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR},
              ]}
            />
            <View style={{width: scaleWidth * 10}} />
            <CustomButton
              isSelected={this.state.isBarberSelected}
              onPress={this.barberClicked}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
              }}
              buttonText={capitalize(Globals.DOCTOR)}
              cornerRadius={100}
              buttonWidth={scaleWidth * 150}
              buttonHeight={scaleHeight * 35}
              buttonStyle={[
                styles.buttonsShadow,
                {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR},
              ]}
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
                  placeholder={'Your Email or Phone'}
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
              marginHorizontal: scaleWidth * 20,
              marginTop: scaleHeight * 30,
            }}>
            <YearPicker
              defaultValue={'select year'}
              start={2010} // default is 1900
              end={2020} // default is current year
              reverse // default is ASCENDING
              required={true} // default is false
              disabled={true} // default is false
              value={this.state.year} // mandatory
             
              id={'year'}
              name={'year'}
             
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
            <TouchableOpacity onPress={this.onPressSignUp}>
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
