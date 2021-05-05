import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Picker,
  FlatList,
  BackHandler,
} from 'react-native';
import {Typography} from '../../styles';
import {BACK} from '../../images';
import EmptyView from '../../components/EmptyView';
import {MENU,LOGO,PENCIL,LOGOUT,SEARCH} from '../../images';
import {scaleWidth, scaleHeight} from '../../styles/scaling';
import CustomBGCard from '../../components/CustomBGCard';
import {GRAY_LIGHT} from '../../styles/colors';
import CustomTextView from '../../components/CustomTextView';
import CustomBGParent from '../../components/CustomBGParent';
import {ScrollView} from 'react-native-gesture-handler';
import {isNetAvailable} from '../../utils/NetAvailable';
import DropDownPicker from 'react-native-dropdown-picker';
import {getJSONData, storeJSONData, clearStore} from '../../utils/AsyncStorage';
import {NavigationEvents,NavigationActions} from 'react-navigation';
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import {
  fetchServerDataGet,
  fetchServerDataPost,
} from '../../utils/FetchServerRequest';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomButton from '../../components/CustomButton';
import apiConstant from '../../constants/apiConstant';
import Globals from '../../constants/Globals';
import {SCALE_15, SCALE_40} from '../../styles/spacing';
import {scaleSize} from '../../styles/mixins';
import {isEmpty} from '../../utils/Utills';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showAlert} from '../../redux/action';
import {
  FONT_SIZE_10,
  FONT_SIZE_13,
  FONT_SIZE_16,
  FONT_SIZE_20,
  FONT_SIZE_30,
} from '../../styles/typography';
import MenuDrawer from 'react-native-side-drawer';
import AgentTechnician from '../../components/AgentTechnician';
import {getDate} from '../../utils/DateTimeUtills';
import styles from './styles';

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


class AssignTechnician extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      show: false,
      loading: false,
      technician: this.props.navigation.getParam('technician'),
      searchText: '',
      country:'uk',
      // userType: Globals.PATIENT,
      //selectedItems: [],
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
        UserID: user_data.UserID,
        // name: user_data.name,
      });
    }
    await this.getTechinicians();
  };

  async componentDidMount() {
    this.initialState = this.state;

    await this.GetLoginData();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  clearStore = () => {
    this.setState({
      // rating: '',
      inputtext: '',
    });
  };


  resetStack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "AuthLogin",
      key: null,
      index: 0,
      action: NavigationActions.navigate({ routeName: "AuthLogin" }),
    });
    this.props.navigation.dispatch(navigateAction);
  };

  logout = () => {

    this.setState({ showLogoutPopUp: true });
  };
  onCancelClick = () => {
    this.setState({
      showLogoutPopUp: false,
      showImagePopUp: false,
      showRemovePhotoPopUp: false,
    });
  };

  confirmLogoutClick = async () => {
    await clearStore("user");
    await this.setState({ showLogoutPopUp: false });
    await this.toggleOpen();
    this.props.navigation.navigate('AuthLogin');
   // await this.resetStack();
  };

  _handleBackButtonClick = () => {
    this.props.navigation.goBack(null);

    return true;
  };

  checkPhone = phone => {
    if (!isNaN(phone)) {
      const reg = /^[0]?[789]\d{9}$/;
      if (this.isPhoneValid(reg, phone)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  isPhoneValid = (reg, phone) => {
    if (reg.test(phone) === false) {
      return false;
    } else {
      return true;
    }
  };

  onSubmitClick = async () => {
    // await this.getBarberCurrentLocation();
    console.log('onSubmitClick' + JSON.stringify(this.state.selectedItems));
  };

  toggleOpen = () => {
    this.setState({open: !this.state.open});
  };

  drawerContent = () => {
    return (
      
      <TouchableOpacity onPress={this.toggleOpen} style={styles.animatedBox}>
         <View
              style={{
                width: '100%',
              height: scaleHeight * 114,
              marginTop: scaleHeight * 22,
              //marginBottom: scaleHeight * 22,
              alignItems: 'center',
              justifyContent: 'center',
             //   marginTop: 20,
                flexDirection: 'row',
                borderRadius: scaleHeight * 25,
              }}>
                <Image
                style={{ height: scaleHeight * 100,
                  width: scaleHeight * 100,
                 // marginLeft:20,
                 justifyContent:'center',
                alignItems:'center'
              }}
                  source={LOGO}
                  resizeMode={'contain'}
                />
            </View>
            <TouchableOpacity onPress={() => this.editprofile()}>

            <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                       // marginTop: 20,
                        paddingBottom: 12,
                        //borderBottomWidth: 1,
                      //  borderColor: GRAY_DARK,
                      }}
                    > 
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: Typography.FONT_SIZE_18,
                          color: this.props.theme.BACKGROUND_COLOR,
                        }}
                      >
                        Edit Profile
                      </Text>

                      <Image
                        style={{
                          height: scaleHeight * 16,
                          width: scaleWidth * 16,
                          marginLeft: scaleWidth * 30,
                          tintColor: this.props.theme.BUTTON_TEXT_COLOR,
                        }}
                        source={PENCIL}
                      />

                    </View>
                  
                </View>
                </TouchableOpacity>

                <View style={{width:'100%',
              height: scaleHeight * 1,
              backgroundColor: this.props.theme.WHITE
              }}>

                </View>

                <TouchableOpacity onPress={() => this.logout()}>

             <View style={{ marginTop: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingBottom: 12,
                        //borderBottomWidth: 1,
                      //  borderColor: GRAY_DARK,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: Typography.FONT_SIZE_18,
                          color: this.props.theme.BACKGROUND_COLOR,
                        }}
                      >
                        Logout
                      </Text>

                      <Image
                        style={{
                          height: scaleHeight * 18,
                          width: scaleWidth * 18,
                           marginLeft: scaleWidth * 60,
                          tintColor: this.props.theme.BUTTON_TEXT_COLOR,
                        }}
                        source={LOGOUT}
                      />

                    </View>
                </View>
                </TouchableOpacity>
                <View style={{width:'100%',
              height: scaleHeight * 1,
              backgroundColor: this.props.theme.WHITE
              }}>

                </View>
      </TouchableOpacity>
    );
  };

  assignTechnician = async () => {
    await this.setState({
      loading: true,
      technician: this.props.navigation.getParam('technician'),
    });
    const url = apiConstant.ASSIGN_SERVICE_TICKET;
    console.log('technician', JSON.stringify(this.state.technician));

    const requestBody = {
      ServiceTicketID: this.state.technician.ServiceTicketID,
      CreatedByUserID: '1',
      AssignedToUserID: 4,
    };

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + this.state.Token,
    };

    console.log('Assign url==> ' + JSON.stringify(url));
    console.log('Assign requestBody ==> ' + JSON.stringify(requestBody));
    console.log('Assign headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data ==> ' + JSON.stringify(data));
            if (data.status === 200) {
              await this.setState({loading: false});

              //store data
              await storeJSONData('assigntechnician', data.data);
              const user_data = await getJSONData('assigntechnician');

              //navigate screen
              alert(data.message);
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

  getTechinicians = async () => {
    await this.setState({loading: true});
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.GET_ALL_TECHNICIANS;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.state.Token,
    };

    console.log('urll of technician ==> ' + JSON.stringify(url));
    console.log('headers technician==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataGet(url, headers)
          .then(async response => {
            let data = await response.json();
            console.log('data technician==> ' + JSON.stringify(data));
            if (data.status === 200) {
              await this.setState({loading: false});
              await this.setState({technician_data: data.data});
              //await this.props.navigation.navigate('DoctorProfile');
            } else {
              await this.setState({loading: false});
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status_msg,
              );
            }
          })
          .catch(error => {
            this.setState({loading: false});
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              'Something Went Wrong',
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

  renderItem = ({item}) => {
    return (
      <AgentTechnician
        onItemPress={() => this.onClickItem(item)}
        onAssignPress={() => this.onAssign(item)}
        viewWidth={scaleWidth * 330}
        viewHeight={scaleHeight * 120}
        item={item}
      />
    );
  };

  onAssign = async item => {
    await this.assignTechnician();
    this.props.navigation.navigate('AgentTechincianScreen');
  };

  onChange = (event, selectedDate) => {
    if (!isEmpty(true, selectedDate)) {
      this.setState({show: false, dob: selectedDate});
    } else {
      this.setState({show: false});
    }
  };

  LoadMoreRandomData = async () => {
    if (this.state.pageCount < this.state.totalPageCount) {
      await this.setState({pageCount: this.state.pageCount + 1});
    }
  };

  searchFilterFunction = async text => {
    if (text.toString().trim().length >= 3) {
      this.setState({loading: false, searchText: text});
      console.log('ddddddddddd', JSON.stringify(this.state.searchText));
      await this.getCreatedService();
      //  await this.sendBarberLocation();
    } else {
      this.setState({searchText: text});
    }
  };

  render() {
    const {technician_data} = this.state;
    const {theme} = this.props;

    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents
          onWillFocus={this._onFocus}
          onWillBlur={this._onBlurr}
        />
        <View
            style={{
             width: '100%',
            //  flexDirection: 'row',
              //alignItems: 'center',
              // marginVertical: scaleHeight * 40,
            }}>
            <View style={{flex: 1, justifyContent: 'flex-start'}}>
              <MenuDrawer
                open={this.state.open}
                drawerContent={this.drawerContent()}
                drawerPercentage={50}
                animationTime={250}
                overlay={true}
                opacity={0.4}>
                <TouchableOpacity onPress={this.toggleOpen}>
                  <Image
                    resizeMode={'contain'}
                    style={{
                      marginTop: scaleHeight * 15,
                      marginStart: 10,
                      width: scaleWidth * 40,
                      height: scaleHeight * 40,
                      tintColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    }}
                    source={MENU}
                  />
                </TouchableOpacity>
              </MenuDrawer>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
               marginEnd: scaleWidth * 10,
               marginStart: scaleWidth * 45,
                marginVertical: scaleHeight * 10,
                height: scaleHeight * 45,
                backgroundColor: theme.BUTTON_BACKGROUND_COLOR,
                borderRadius: scaleWidth * 25,
              }}>
              <Image
                source={SEARCH}
                style={{
                  marginHorizontal: scaleWidth * 10,
                  height: scaleHeight * 16,
                  width: scaleWidth * 16,
                }}
                resizeMode={'contain'}
              />

              <TextInput
                style={{
                  paddingLeft: scaleWidth * 10,
                  fontSize: scaleWidth * 12,
                  height: scaleHeight * 45,
                }}
                onChangeText={text => this.searchFilterFunction(text)}
                value={this.state.searchText}
                placeholder={'Search here ...'}
              />

            </View>

            <View style={{marginHorizontal: scaleWidth * 20}}>
          <DropDownPicker
            items={List}
            //onPress={(open) => console.log('was the picker open?', open)}
            open={this.state.dropDownOpen}
            defaultValue={this.state.country}
            containerStyle={{height: 40,
            marginVertical: scaleHeight * 10
            }}
            style={{backgroundColor: theme.WHITE,
            borderRadius: scaleHeight *10,
          }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{backgroundColor: theme.WHITE,
          }}
            onChangeItem={item =>
              this.setState({
                country: item.value,
                dropDownOpen: true
              })
            }
          />
</View>
 

          </View>
              <View
          style={{
            marginVertical: scaleHeight * 20,
              marginHorizontal: scaleHeight * 10,
              marginBottom: scaleHeight *250
          }}>
          <FlatList
            data={technician_data}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReached={() => this.LoadMoreRandomData()}
            onEndReachedThreshold={0.1}
            initialNumToRender={3}
            ListEmptyComponent={<EmptyView EmptyText={'Please wait..'} />}
            contentContainerStyle={{flexGrow: 1}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <ConfirmationPopUp
          isModelVisible={this.state.showLogoutPopUp}
          positiveButtonText={Globals.YES}
          negativeButtonText={Globals.NO}
          onPositivePress={() => this.confirmLogoutClick()}
          onNegativePress={() => this.onCancelClick()}
          alertMessage={Globals.LOGOUT_MESSAGE}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(AssignTechnician);
