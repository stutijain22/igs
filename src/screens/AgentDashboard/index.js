import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  BackHandler
} from 'react-native';
import {
  fetchServerDataPost,
  fetchServerDataGet,
} from '../../utils/FetchServerRequest';
import {getJSONData,clearStore} from '../../utils/AsyncStorage';
import {showAlert} from '../../redux/action';
import apiConstant from '../../constants/apiConstant';
import {isNetAvailable} from '../../utils/NetAvailable';
import {bindActionCreators} from 'redux';
import {MENU,LOGO,PENCIL,LOGOUT} from '../../images';
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import {NavigationEvents,NavigationActions} from 'react-navigation';
import {BACK} from '../../images';
import {Typography} from '../../styles';
import {scaleSize} from '../../styles/mixins';
import {connect} from 'react-redux';
import MenuDrawer from 'react-native-side-drawer';
import CustomButton from '../../components/CustomButton';
import CustomBGParent from '../../components/CustomBGParent';
import CustomTextView from '../../components/CustomTextView';
import EmptyView from '../../components/EmptyView';
import AgentList from '../../components/AgentList';
import Globals from '../../constants/Globals';
import {scaleHeight, scaleWidth} from '../../styles/scaling';
import {
  SCALE_100,
  SCALE_15,
  SCALE_20,
  SCALE_25,
  SCALE_50,
  SCALE_200,
} from '../../styles/spacing';
import {
  FONT_SIZE_10,
  FONT_SIZE_13,
  FONT_SIZE_16,
  FONT_SIZE_25,
  FONT_SIZE_30,
} from '../../styles/typography';
import {isEmpty} from '../../utils/Utills';
import entries from './entries';
import styles from './styles';

class AgentDashboard extends Component {
  constructor(props) {
    const {navigation} = props;
    super(props);
    this.state = {
      loading: false,
      is_doctor: false,
      category: entries.ENTRIES,
      swipeRefreshing: false,
      pageCount: 1,
      totalPageCount: 0,
      refreshing: false,
      type: '',
      discription: '',
      UserID: 2,
      TicketNumber: null,
      TicketStatusID: null,
      FromDate: null,
      ToDate: null,
      //image: apiConstant.NO_IMAGE_URL,
    };

    // this.getdeviceId();
    //this.GetLoginData();
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
  await this.getCreatedService();
};

async componentDidMount() {
  await this.GetLoginData();
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

_handleBackButtonClick = () => {
 
  this.props.navigation.goBack(null);
    return true;
}

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

  getCreatedService = async () => {
    await this.setState({loading: true});
  const url = apiConstant.GET_ALL_USERS;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.state.Token,
  };

  console.log('urll of get all users ==> ' + JSON.stringify(url));
  console.log('headers get all users==> ' + JSON.stringify(headers));

  isNetAvailable().then(success => {
    if (success) {
      fetchServerDataGet(url, headers)
        .then(async response => {
          let data = await response.json();
          console.log('data get all users==> ' + JSON.stringify(data));
          if (data.status === 200) {
            await this.setState({loading: false});
            await this.setState({get_users: data.data});
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

  onClickItem = (item) => {
    //this.props.navigation.navigate('DetailScreen',{detail: item});
  };

  onTechnician = (item) => {
    this.props.navigation.navigate('AgentTechincianScreen',{technician : item});
  };

  renderItem = ({item}) => {
    return (
      <AgentList
        onItemPress={() => this.onClickItem(item)}
        onTechnicianPress={() => this.onTechnician(item)}
        viewWidth={scaleWidth * 330}
        viewHeight={scaleHeight * 120}
        item={item}
      />
    );
  };

  onRefresh = async () => {
    await this.setState({swipeRefreshing: true});
  };

  LoadMoreRandomData = async () => {
    if (this.state.pageCount < this.state.totalPageCount) {
      await this.setState({pageCount: this.state.pageCount + 1});
    }
  };

  createService = () => {
    this.props.navigation.navigate('CreateService');
  };

  renderFooter = () => {
    try {
      if (this.state.refreshing) {
        return (
          <View
            style={{
              paddingVertical: scaleHeight * 5,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <ActivityIndicator
              size="large"
              color={this.props.theme.BUTTON_BACKGROUND_COLOR}
            />
          </View>
        );
      } else {
        return <View></View>;
      }
    } catch (error) {
      //console.log('error');
    }
  };

  

  render() {
    //console.log('name', this.props.navigation.getParam('name'));
    const {created_service} = this.state;
    const {theme} = this.props;
   // console.log('theme dashboard ', theme);

    return (
      <CustomBGParent
        backGroundColor={'white'}
         loading={this.state.loading}
        topPadding={false}>
        <View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
             // marginVertical: scaleHeight * 40,
            }}>
          <View
              style={{flex: 1, justifyContent: 'flex-start'}}>
              <MenuDrawer
                open={this.state.open}
                drawerContent={this.drawerContent()}
                drawerPercentage={50}
                animationTime={250}
                overlay={true}
                opacity={0.4}
                >
                <TouchableOpacity onPress={this.toggleOpen}>
                  <Image
                    resizeMode={'contain'}
                    style={{
                      marginTop: scaleHeight * 5,
                      marginStart:10,
                      width: scaleWidth * 40,
                      height: scaleHeight * 40,
                      tintColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    }}
                    source={MENU}
                  />
                </TouchableOpacity>
              </MenuDrawer>
            </View>

   </View>
          <View
            style={{
              marginVertical: scaleHeight * 50,
              marginHorizontal: scaleHeight * 10,
            }}>
            <FlatList
              data={created_service}
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

export default connect(mapStateToProps,mapDispatchToProps)(AgentDashboard);
