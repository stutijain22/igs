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
import {scaleWidth, scaleHeight} from '../../styles/scaling';
import CustomBGCard from '../../components/CustomBGCard';
import {GRAY_LIGHT} from '../../styles/colors';
import CustomTextView from '../../components/CustomTextView';
import CustomBGParent from '../../components/CustomBGParent';
import {ScrollView} from 'react-native-gesture-handler';
import {isNetAvailable} from '../../utils/NetAvailable';
import {getJSONData, storeJSONData, clearStore} from '../../utils/AsyncStorage';
import {
  fetchServerDataGet,
  fetchServerDataPost,
} from '../../utils/FetchServerRequest';
import Spinner from 'react-native-loading-spinner-overlay';
import {NavigationEvents} from 'react-navigation';
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
import AgentTechnician from '../../components/AgentTechnician';
import {getDate} from '../../utils/DateTimeUtills';

class AgentTechincianScreen extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      show: false,
      loading: false,
      technician: this.props.navigation.getParam('technician'),
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
        // name: user_data.name,
      });
    }
    await this.getTechinicians();
  };

  async componentDidMount() {
    this.initialState = this.state;

    await this.GetLoginData();
  }

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

  assignTechnician = async () => {
    await this.setState({loading: true});
    const url = apiConstant.ASSIGN_SERVICE_TICKET;

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

  goBack = async () => {
    this.props.navigation.navigate('Dashboard');
  };

  onAssign = async (item) => {
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

  render() {
    const {technician_data} = this.state;

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
              View Technician
            </Text>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: SCALE_15,
            marginBottom: scaleHeight * 50,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AgentTechincianScreen);
