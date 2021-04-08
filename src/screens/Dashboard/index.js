import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import CustomButton from "../../components/CustomButton";
import {showGloblePopup} from '../../actions/showGloblePopup';
import CustomBGParent from '../../components/CustomBGParent';
import CustomTextView from '../../components/CustomTextView';
import EmptyView from '../../components/EmptyView';
import HomeList from "../../components/HomeList";
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

class Dashboard extends Component {
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
      //image: apiConstant.NO_IMAGE_URL,
    };

    // this.getdeviceId();
    //this.GetLoginData();
  }

/*  GetLoginData = async () => {
    const user_data = await getJSONData('user');
    if (user_data != null) {
      if (user_data.type == 'Doctor') {
        await this.setState({is_doctor: true});
      }
      await this.setState({
        id: user_data.id,
        type: user_data.type,
        name: 'Hi ' + user_data.name,
        image: user_data.image,
      });
    } else {
      await this.setState({name: 'Hi Guest!'});
    }
    await this.getCategory();
  };

  async componentDidMount() {
    await AuthService.init();
    PushNotificationService.init(this.props.navigation);
    await this.GetLoginData();
    var user_log = {comment: 'See a Category List'};
    await AppUserLog(user_log);
  }

  getCategory = () => {
    //this.setState({loading: true});
    let url =
      apiConstant.CATEGORIES +
      '/?id=' +
      this.state.id +
      '&type=' +
      this.state.type;

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: apiConstant.BEARER,
    };

    console.log('url ==> ' + JSON.stringify(url));
    console.log('headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataGet(url, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log('data category => ', JSON.stringify(data));
            if (data.error === 0) {
              this.setState({loading: false});
              this.setState({category: data.data});
            } else {
              this.setState({loading: false});
              store.dispatch(
                showGloblePopup(true, Globals.ErrorKey.ERROR, data.message),
              );
            }
          })
          .catch((error) => {
            this.setState({loading: false});
            store.dispatch(
              showGloblePopup(
                true,
                Globals.ErrorKey.ERROR,
                Globals._KEYS._SOMETHING_WENT_WRONG,
              ),
            );
          });
      } else {
        this.setState({loading: false});
        store.dispatch(
          showGloblePopup(
            true,
            Globals.ErrorKey.NETWORK_ERROR,
            Globals._KEYS._PLEASE_CHECK_NETWORK_CONNECTION,
          ),
        );
      }
    });
  }; 
  */



  renderItem = ({item}) => {
    return (
        <HomeList
        onItemPress={() => this.onClickItem(item)}
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

  CreateService = () => {
    console.log('ffffffffffff');
    this.props.navigation.navigate('CreateService');
  }

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
    const {category} = this.state;
    const {theme} = this.props;
    console.log('theme dashboard ', theme);
  
    return (
      <CustomBGParent
        backGroundColor={'white'}
       // loading={this.state.loading}
        topPadding={false}>
        <NavigationEvents />
        <View style={{backgroundColor: 'white'}}>
        <View
            style={{
              height: scaleHeight * 35,
              position: "absolute",
              right: scaleWidth * 10,
              marginTop: scaleHeight * 5,
              alignItems: "center",
              justifyContent: Platform.OS === "android" ? "flex-end" : "center",
            }}
          >
            
            <CustomButton
              buttonStyle={[
                styles.buttonsShadow,
                { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR },
              ]}
              onPress={() => this.CreateService()}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
                paddingHorizontal: scaleWidth * 10,
              }}
              buttonText={"Create Request"}
              cornerRadius={20}
              buttonHeight={SCALE_25}
              // buttonWidth={scaleSize(100)}
            />
          </View>

         <View
            style={{
              marginHorizontal: SCALE_15,
              marginBottom: scaleHeight * 50,
            }}>
           
              <FlatList
                style={{
                //  marginBottom: scaleHeight * 400,
                  paddingVertical: SCALE_50,
                }}
                data={category}
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
        </View>
      </CustomBGParent>
    );
  }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
  });


export default connect(mapStateToProps)(Dashboard);
