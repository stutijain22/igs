import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Typography} from '../../styles';
import {BOOKING_PACK_CIRCLE, NO_IMAGE} from '../../images';
import PropTypes from 'prop-types';
import {scaleWidth, scaleHeight} from '../../styles/scaling';
import {COUNTRY_CODE} from '../../constants/Globals';
import CustomButton from '../../components/CustomButton';
import {isEmpty} from '../../utils/Utills';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview';

class AgentTechnician extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onItemPress}>
        <View
          style={{
            width: 100,
            height: this.props.viewHeight,
            marginHorizontal: scaleWidth * 10,
            marginBottom: scaleHeight * 18,
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
            }}>
            <CardView
              cardElevation={7}
              cardMaxElevation={7}
              marginTop={scaleHeight * 10}
              height={this.props.viewHeight}
              width={this.props.viewWidth}
              borderRadius={scaleWidth * 10}
              cornerRadius={10}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginStart: scaleWidth * 10,
                }}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_16,
                    padding: scaleWidth * 5,
                    color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                    fontWeight: 'normal',
                  }}>
                  {isEmpty(false, this.props.item.AgentUserID)}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    margin: scaleHeight * 5,
                  }}>
                  <CustomButton
                    buttonStyle={[
                      // styles.buttonsShadow,
                      {
                        backgroundColor: this.props.theme
                          .BUTTON_BACKGROUND_COLOR,
                      },
                    ]}
                    style={{
                      textAlign: 'left',
                      justifyContent: 'flex-end',
                      paddingHorizontal: scaleHeight * 10,
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.GREEN,
                      fontWeight: 'bold',
                    }}
                    onPress={this.props.onAssignPress}
                    textStyle={{
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.BUTTON_TEXT_COLOR,
                    }}
                    buttonText={'Assign'}
                    cornerRadius={20}
                    buttonHeight={scaleHeight * 30}
                    buttonWidth={scaleWidth * 120}
                  />
                </View>
              </View>

              <View style={styles.rightText}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: Typography.FONT_SIZE_16,
                      padding: scaleWidth * 5,
                      color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                      fontWeight: 'normal',
                    }}>
                    {isEmpty(false, this.props.item.FirstName) +
                      isEmpty(false, this.props.item.LastName)}
                  </Text>
                </View>

                <Text
                  // numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_16,
                    color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                    fontWeight: 'normal',
                    paddingHorizontal: 5,
                  }}>
                  {isEmpty(false, this.props.item.Address)}
                </Text>
              </View>
              {/* 
              <View style={{margin: scaleWidth * 10, flexDirection:'row',
            justifyContent:'space-between'}}>
              
              <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_14,
                    color: this.props.theme.GRAY,
                    fontWeight: 'normal',
                  }}>
                  Service Request Time
                </Text>

              <Text
                  numberOfLines={2}
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_14,
                    color: this.props.theme.GRAY,
                    fontWeight: 'normal',
                  }}>
                  {isEmpty(false, this.props.item.time)}
                </Text>
              </View>
              */}
            </CardView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

AgentTechnician.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  viewWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onItemPress: PropTypes.func,
  onAssignPress: PropTypes.func,
  onEditPress: PropTypes.func,
  onReviewPress: PropTypes.func,
  viewHeight: PropTypes.number,
  buttonText: PropTypes.string,
  isButtonVisible: PropTypes.bool,
};

AgentTechnician.defaultProps = {
  item: {},
  viewWidth: '100%',
  buttonText: 'Reviews',
  isButtonVisible: true,
};

const mapStateToProps = state => ({
  theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(AgentTechnician);
