import React, { Component } from 'react';
import { ScrollView, TextInput, View, Image, TouchableOpacity, Keyboard, Platform } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import { GRAY_DARK, TEXT_COLOR } from "../../styles/colors";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import { FONT_SIZE_16, FONT_SIZE_20, FONT_SIZE_25 } from "../../styles/typography";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_40, SCALE_60 } from "../../styles/spacing";
import { Spacing, Typography } from '../../styles'
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import Globals from "../../constants/Globals";
import { capitalize, isEmpty } from "../../utils/Utills"
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            first_name: "",
            last_name: "",
            verify_medium: '',
            emailOrPhoneNumber: "",
            location: "",
            password: "",
            method: 'signup',
            isCustomerSelected: true,
            isBarberSelected: false,
            isShowPassword: false,
            userType: Globals.PATIENT,
            fcmToken: '',
            signInButtonText: Globals.CUSTOMER_SIGN_UP
        };

    }

    componentDidMount() {
     //   this.requestUserPermission();
    }

   

    render() {
        return (
            <CustomBGParent loading={this.state.loading} backGroundColor={this.props.theme.BACKGROUND_COLOR}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                />
                <ScrollView style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}
                    keyboardShouldPersistTaps='handled'>
                    <View style={styles.textViewHeader}>
                        <CustomTextView textStyle={{ marginTop: scaleHeight * 20, marginLeft: scaleWidth * 20, fontWeight: 'bold' }}
                            fontTextAlign={'left'} fontColor={this.props.theme.PRIMARY_TEXT_COLOR} fontSize={FONT_SIZE_25} value={"Sign Up"} />
                    </View>

                    <View style={styles.buttonSection}>
                        <CustomButton
                            isSelected={this.state.isCustomerSelected}
                            onPress={this.customerClicked}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={capitalize(Globals.PATIENT)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 150}
                            buttonHeight={scaleHeight * 35}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]} />
                        <View style={{ width: scaleWidth * 10 }} />
                        <CustomButton
                            isSelected={this.state.isBarberSelected}
                            onPress={this.barberClicked}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={capitalize(Globals.DOCTOR)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 150}
                            buttonHeight={scaleHeight * 35}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]} />
                    </View>

                    <View style={[styles.cardShadow, styles.margins]}>
                        <CustomBGCard
                            topMargin={scaleHeight * 15}
                            cornerRadius={scaleWidth * 15}
                            bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                            <View style={styles.inputViewCards}>
                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ first_name: text })}
                                    value={this.state.first_name}
                                    placeholder={"First Name"} />

                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ last_name: text })}
                                    value={this.state.last_name}
                                    placeholder={"Last Name"} />

                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ emailOrPhoneNumber: text })}
                                    value={this.state.emailOrPhoneNumber}
                                    placeholder={"Your Email or Phone Number"} />

                                <View style={styles.textInputPassword}>
                                    <TextInput style={{ height: scaleHeight * 50, width: '85%' }}
                                        onChangeText={text => this.setState({ password: text })}
                                        value={this.state.password}
                                        placeholder={"Password"} secureTextEntry={!this.state.isShowPassword} />
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: scaleHeight * 35,
                                            width: scaleWidth * 35
                                        }}
                                        >
                                        <Image
                                            style={{
                                                height: scaleHeight * 15,
                                                width: scaleWidth * 15
                                            }}
                                         />
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </CustomBGCard>
                    </View>

                    <View style={{ marginHorizontal: scaleWidth * 20, marginTop: scaleHeight * 15 }}>
                        <CustomButton
                            onPress={() => this.onPressSignup()}
                            textStyle={{ fontSize: FONT_SIZE_20, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.state.signInButtonText}
                            cornerRadius={100}
                            buttonHeight={scaleHeight * 50}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                            buttonWidth={'100%'} />
                    </View>

                    <TouchableOpacity
                        onPress={this.goToLogin}
                        activeOpacity={0.8}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center', alignItems: 'center', marginTop: scaleHeight * 20
                            }}>
                            <CustomTextView value={"If you have an account?"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR} textStyle={{ opacity: 0.5 }} fontSize={FONT_SIZE_16} />
                            <CustomTextView
                                value={" Sign In"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                textStyle={{ fontWeight: 'bold' }}
                                fontSize={FONT_SIZE_16} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </CustomBGParent>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
    showAlert: bindActionCreators(showAlert, dispatch),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp)