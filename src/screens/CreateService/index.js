import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Picker,
  BackHandler,
} from 'react-native';
import styles from './styles';
import {Typography} from '../../styles';
import {BACK} from '../../images';
import {scaleWidth, scaleHeight} from '../../styles/scaling';
import CustomBGCard from '../../components/CustomBGCard';
import {GRAY_LIGHT} from '../../styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomBGParent from '../../components/CustomBGParent';
import {ScrollView} from 'react-native-gesture-handler';
import {isNetAvailable} from '../../utils/NetAvailable';
import {getJSONData, storeJSONData, clearStore} from '../../utils/AsyncStorage';
import {
  fetchServerDataPost,
  fetchServerDataGet,
} from '../../utils/FetchServerRequest';
import Spinner from 'react-native-loading-spinner-overlay';
import {NavigationEvents} from 'react-navigation';
import CustomButton from '../../components/CustomButton';
import apiConstant from '../../constants/apiConstant';
import Globals from '../../constants/Globals';
import {FONT_SIZE_16} from '../../styles/typography';
import {SCALE_25, SCALE_40} from '../../styles/spacing';
import {scaleSize} from '../../styles/mixins';
import {isEmpty} from '../../utils/Utills';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';
import MultiSelect from '../../components/MultiSelectDropDown';
import {getDate} from '../../utils/DateTimeUtills';

const List = [
  {
    label: 'USA',
    value: 'usa',
  //  icon: () => <Icon name="flag" size={18} color="#900" />,
    //hidden: true,
  },
  {
    label: 'UK',
    value: 'uk',
  //  icon: () => <Icon name="flag" size={18} color="#900" />,
  },
  {
    label: 'France',
    value: 'france',
    //icon: () => <Icon name="flag" size={18} color="#900" />,
  },
]
class CreateService extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      show: false,
      date: new Date(),
      loading: false,
      // userType: Globals.PATIENT,
      feedbacktext: '',
      TicketNumber: '',
      CreatedByUserID: '1',
      AssignedToUserID: null,
      service_problem: [],
      create_service: [],
    //  country: 'uk',
      selectedItems: 0,
    };
  }

  GetLoginData = async () => {
    const user_data = await getJSONData('user');
    if (user_data != null) {
      /*  if (user_data.type == 'Agent') {
        await this.setState({is_flag: true});
      }*/
      await this.setState({
        Token: user_data.Token,
        UserID: user_data.UserID,
        // name: user_data.name,
      });
    }
    await this.getAllService();
  };

  async componentDidMount() {
    await this.GetLoginData();
  }

  getAllService = async () => {
    await this.setState({loading: true});
    let url = apiConstant.GET_ALL_SERVICE_PROBLEMS;

    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.state.Token,
    };


    console.log('url ==> ' + JSON.stringify(url));
    console.log('headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataGet(url, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data problem => ', JSON.stringify(data));
            if (data.status === 200) {
              this.setState({loading: false});
              let problem = [];
              data.data.forEach((elem) => {
                problem.push({
                  label: elem.ProblemName,
                  value: elem.ServiceProblemID,
                });
              });
              this.setState({service_problem: problem});


            } else {
              this.setState({loading: false});
              this.props.showAlert(
                true,
                Globals.ErrorKey.NETWORK_ERROR,
                'Please check network connection.',
              );
            }
          })
          .catch(error => {
            this.setState({loading: false});
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              Globals._KEYS._SOMETHING_WENT_WRONG,
            );
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

  createService = async () => {
    await this.setState({loading: true});
    const url = apiConstant.CREATE_SERVICE_TICKET;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.state.Token,
    };

    const requestBody = {
      UserID: this.state.UserID,
      TicketNumber: this.state.TicketNumber,
      ServiceProblemID: this.state.selectedItems,
      Description: this.state.feedbacktext,
      CreatedByUserID: this.state.UserID,
      AssignedToUserID: this.state.AssignedToUserID,
    };

    console.log('create url ==> ' + JSON.stringify(url));
    console.log('create headers ==> ' + JSON.stringify(headers));
    console.log('create requestbody ==> ' + JSON.stringify(requestBody));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data ==> ' + JSON.stringify(data));
            if (data.status === 200) {
              console.log('data ==> ' + JSON.stringify(data));
              await this.setState({loading: false});
              await this.setState({create_service: data.data});
              this.props.navigation.navigate('Dashboard');
              //alert(data.message);
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

  clearStore = () => {
    this.setState({
      // rating: '',
      inputtext: '',
    });
  };

  _onBlurr = () => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButtonClick,
    );
  };

  _onFocus = () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this._handleBackButtonClick,
    );
  };

  _handleBackButtonClick = () => {
    this.goBack();
    return true;
  };

  service_create = async () => {
   await this.signUpCheckValidity();
  };

  onSubmitClick = async () => {
    // await this.getBarberCurrentLocation();
    console.log('onSubmitClick' + JSON.stringify(this.state.selectedItems));
  };

  signUpCheckValidity = async () => {
    if (this.state.feedbacktext.toString().trim().length == 0) {
      this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter text');
    } else {
      //  alert('Progress Mode');
      await this.createService();
      // this.feedback();
    }
  };

  goBack = async () => {
    this.props.navigation.navigate('Dashboard');
  };

  onChange = (event, selectedDate) => {
    if (!isEmpty(true, selectedDate)) {
      this.setState({show: false, dob: selectedDate});
    } else {
      this.setState({show: false});
    }
  };

  onSelectedItemsChange = async (item) => {
    console.log('selectedItems' + JSON.stringify(item));
    this.setState({selectedItems:item.value});
  //  await this.getAllService();
  };

  render() {
    const {selectedItems} = this.state;
    const {service_problem} = this.state;
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents
          onWillFocus={this._onFocus}
          onWillBlur={this._onBlurr}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scaleHeight * 25,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: scaleWidth * 60,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center',
            }}
            onPress={() => this.goBack()}>
            <Image
              style={{
                width: scaleWidth * 10,
                height: scaleHeight * 20,
                tintColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
              }}
              source={BACK}
            />
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              left: 50,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_16,
                color: this.props.theme.PRIMARY_TEXT_COLOR,
                fontWeight: 'bold',
              }}>
              Create request
            </Text>
          </View>
        </View>

        <ScrollView>
          {/*<Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_30, color: this.props.theme.PRIMARY_TEXT_COLOR }}>Edit Profile</Text>*/}

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard
              cornerRadius={10}
              bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
              <View style={{padding: scaleWidth * 10}}>
                <View
                  style={{
                    //flex: 1,
                   // paddingVertical: scaleWidth * 10,
                   // paddingHorizontal: scaleWidth * 10,
                    // backgroundColor: this.props.theme.WHITE,
                  }}>
                  <DropDownPicker
                     items={service_problem}
                   // items={List}
                    defaultValue={'Select Problem'}
                    containerStyle={{
                      height: 40,
                      marginVertical: scaleHeight * 10,
                    }}
                    // selectText="Pick Items"
                    style={{
                      backgroundColor: '#fafafa',
                     // marginHorizontal: scaleWidth * 20,
                      borderRadius: scaleHeight * 10,
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{
                      backgroundColor: '#fafafa',
                    //  marginHorizontal: scaleWidth * 20,
                     // marginHorizontal: scaleWidth * 10,
                     // marginEnd: scaleWidth * 50
                    }}
              //     onSelectedItemsChange={}
                    onChangeItem={item =>
                      this.onSelectedItemsChange(item)
                    }
                  />
                </View>

                <TextInput
                  style={{
                    marginTop: 20,
                    borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    borderWidth: 1,
                    zIndex: 5,
                  }}
                  onChangeText={text => this.setState({feedbacktext: text})}
                  value={this.state.review}
                  numberOfLines={5}
                  multiline={true}
                  textAlignVertical="top"
                  value={this.state.feedbacktext}
                  placeholder={'Input Feedback Text'}
                />

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: scaleHeight * 20,
                  }}>
                  <CustomButton
                    buttonStyle={[
                      styles.buttonsShadow,
                      {
                        backgroundColor: this.props.theme
                          .BUTTON_BACKGROUND_COLOR,
                      },
                    ]}
                    onPress={() => this.service_create()}
                    textStyle={{
                      fontSize: FONT_SIZE_16,
                      // marginHorizontal:scaleWidth * 5,
                      color: this.props.theme.BUTTON_TEXT_COLOR,
                    }}
                    buttonText={'Create Ticket'}
                    cornerRadius={20}
                    buttonHeight={SCALE_25}
                    buttonWidth={scaleSize(120)}
                  />
                </View>
              </View>
            </CustomBGCard>
          </View>

          <View style={{height: scaleHeight * 10}}></View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateService);
