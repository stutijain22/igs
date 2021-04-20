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
} from 'react-native';
import {
  fetchServerDataPost,
  fetchServerDataGet,
} from '../../utils/FetchServerRequest';
import {getJSONData} from '../../utils/AsyncStorage';
import {showAlert} from '../../redux/action';
import apiConstant from '../../constants/apiConstant';
import {isNetAvailable} from '../../utils/NetAvailable';
import {bindActionCreators} from 'redux';
import {NavigationEvents} from 'react-navigation';
import {BACK} from '../../images';
import {Typography} from '../../styles';
import {scaleSize} from '../../styles/mixins';
import {connect} from 'react-redux';
import CustomButton from '../../components/CustomButton';
import CustomBGParent from '../../components/CustomBGParent';
import CustomTextView from '../../components/CustomTextView';
import EmptyView from '../../components/EmptyView';
import HomeList from '../../components/HomeList';
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
//import entries from './entries';
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

  getCreatedService = () => {
  const url = apiConstant.SEARCH_TICKETS;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.state.Token,
  };

  const requestBody = {
    UserID: this.state.UserID,
      TicketNumber: this.state.TicketNumber,
      TicketStatusID: this.state.TicketStatusID,
      FromDate: this.state.FromDate,
      ToDate: this.state.ToDate,
  }

  console.log('url ==> ' + JSON.stringify(url));
  console.log('headers ==> ' + JSON.stringify(headers));

  isNetAvailable().then((success) => {
    if (success) {
      fetchServerDataPost(url,requestBody ,headers)
        .then(async (response) => {
          let data = await response.json();
          console.log('data service create => ', JSON.stringify(data));
          if (data.status === 200) {
            this.setState({loading: false});
            this.setState({created_service: data.data});
          } else {
            this.setState({loading: false});
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              data.message,
            );
          } 
        })
        .catch((error) => {
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
        Globals._KEYS._PLEASE_CHECK_NETWORK_CONNECTION,
      );
    }
  });
};

  onClickItem = (item) => {
    this.props.navigation.navigate('DetailScreen',{detail: item});
  };

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
        // loading={this.state.loading}
        topPadding={false}>
        <View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: scaleHeight * 25,
            }}>
            <View
              style={{
                position: 'absolute',
                left: 30,
                height: scaleHeight * 25,
                justifyContent:
                  Platform.OS === 'android' ? 'flex-end' : 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: Typography.FONT_SIZE_16,
                  color: this.props.theme.PRIMARY_TEXT_COLOR,
                  fontWeight: 'bold',
                }}>
                Your request
              </Text>
            </View>
            <View
              style={{
                height: scaleHeight * 25,
                position: 'absolute',
                right: scaleWidth * 20,
                alignItems: 'center',
                justifyContent:
                  Platform.OS === 'android' ? 'flex-end' : 'center',
              }}>
              <CustomButton
                buttonStyle={[
                  styles.buttonsShadow,
                  {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR},
                ]}
                onPress={() => this.createService()}
                textStyle={{
                  fontSize: FONT_SIZE_16,
                  color: this.props.theme.BUTTON_TEXT_COLOR,
                }}
                buttonText={'Create Request'}
                cornerRadius={20}
                buttonHeight={SCALE_25}
                buttonWidth={scaleSize(130)}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: SCALE_15,
              marginBottom: scaleHeight * 50,
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
