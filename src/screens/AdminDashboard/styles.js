import { StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from '../../styles/scaling';

export default StyleSheet.create({
  count: {
    width: scaleHeight * 20,
    height: scaleHeight * 20,
    borderRadius: scaleHeight * 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextIcon: {
    width: scaleHeight * 30,
    height: scaleHeight * 30,
    borderRadius: scaleHeight * 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#1DA0EA",
    padding: 10
  }, 
  cardShadow: {
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  margins: {
    marginVertical: scaleHeight * 20,
    marginHorizontal: scaleWidth * 5,
    elevation: 4,
    borderRadius: 10,
  },
});
