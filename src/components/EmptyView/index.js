import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { LOADING, WARNING } from "../../images";
import { scaleSize } from "../../styles/mixins";
import { FONT_SIZE_22 } from "../../styles/typography";
import CustomTextView from "../CustomTextView";

class EmptyView extends Component {
    constructor(props) {
        super(props);
    this.state = {
        loading: true,
      };
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
               <ActivityIndicator 
               size="large" 
               color="#000000" 
              />  

                <CustomTextView
                    textStyle={{ marginTop: scaleSize(20) }}
                    fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                    value={this.props.EmptyText}
                    fontSize={FONT_SIZE_22} />

            </View>
        );
    }
}

EmptyView.propTypes = {
    EmptyText: PropTypes.string,
};

EmptyView.defaultProps = {
    EmptyText: '',
};

const mapStateToProps = (state) => ({
    theme: state.themeReducer.theme,
})

export default connect(
    mapStateToProps,
)(EmptyView)
