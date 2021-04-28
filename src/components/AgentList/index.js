import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, Button} from 'react-native';
import styles from './styles';
import {Typography} from '../../styles';
import {BOOKING_PACK_CIRCLE, NO_IMAGE} from '../../images';
import PropTypes from 'prop-types';
import {scaleWidth, scaleHeight} from '../../styles/scaling';
import {COUNTRY_CODE} from '../../constants/Globals';
import {isEmpty} from '../../utils/Utills';
import CustomButton from '../../components/CustomButton';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview';

class AgentList extends Component {
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
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_16,
                    padding: scaleWidth * 5,
                    color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                    fontWeight: 'normal',
                  }}>
                  {isEmpty(false, this.props.item.TicketNumber)}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    margin: scaleHeight * 5,
                  }}>
                  <Text
                    // numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      justifyContent: 'flex-end',
                      paddingHorizontal: scaleHeight * 10,
                      fontSize: Typography.FONT_SIZE_16,
                      color:
                        this.props.item.status === 'Close'
                          ? this.props.theme.GREEN
                          : this.props.item.status === 'Accept'
                          ? this.props.theme.BUTTON_BACKGROUND_COLOR
                          : this.props.theme.RED,
                      fontWeight: 'bold',
                    }}>
                    {this.props.item.status === 'Close'
                      ? 'CLOSE'
                      : this.props.item.status === 'Accept'
                      ? 'ACCEPT'
                      : 'PENDING'}
                  </Text>
                </View>
              </View>

              <View style={styles.rightText}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      fontSize: Typography.FONT_SIZE_20,
                      color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                      fontWeight: 'bold',
                    }}>
                    {isEmpty(false, this.props.item.ProblemName)}
                  </Text>
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: Typography.FONT_SIZE_16,
                    color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                    fontWeight: 'normal',
                  }}>
                  {isEmpty(false, this.props.item.Description)}
                </Text>
              </View>
              <View
                style={{
                  marginRight: scaleHeight * 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>

                <CustomButton
                  buttonStyle={[
                   // styles.buttonsShadow,
                    {backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                  },
                  ]}
                  onPress={this.props.onTechnicianPress}
                  textStyle={{
                    fontSize: Typography.FONT_SIZE_16,
                    color: this.props.theme.BUTTON_TEXT_COLOR,
                  }}
                  buttonText={'View Technician'}
                  cornerRadius={20}
                  buttonHeight={scaleHeight * 30}
                  buttonWidth={scaleWidth * 120}
                />
              </View>
            </CardView>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

AgentList.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  viewWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onItemPress: PropTypes.func,
  onTechnicianPress: PropTypes.func,
  onReviewPress: PropTypes.func,
  viewHeight: PropTypes.number,
  buttonText: PropTypes.string,
  isButtonVisible: PropTypes.bool,
};

AgentList.defaultProps = {
  item: {},
  viewWidth: '100%',
  buttonText: 'Reviews',
  isButtonVisible: true,
 // onTechnicianPress: (() => {})
};

const mapStateToProps = state => ({
  theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(AgentList);
