import {StyleSheet} from 'react-native';
import colors from '../assets/colors';
import {hp, isiPAD, normalize, wp} from './responsiveScreen';

export const fontSize = normalize(16);
export const smallFont = normalize(12);
export const mediumFont = normalize(14);
export const mediumLargeFont = normalize(18);
export const mediumLarge1Font = normalize(20);
export const mediumLarge2Font = normalize(22);
export const largeFont = normalize(24);
// export const marginVer = wp(3) : wp(3.5);
// export const bottomPad = wp(4) : wp(7);
export const iconSize = wp(4.5);
export const tabIcon = wp(6);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  abs: {
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
  flexA: {
    flex: 1,
    alignItems: 'center',
  },
  flexJC: {
    flex: 1,
    justifyContent: 'center',
  },
  flexibleW: {
    width: 0,
    flexGrow: 2,
  },
  flexibleH: {
    height: 0,
    flexGrow: 2,
  },
  start: {
    alignSelf: 'flex-start',
  },
  end: {
    alignSelf: 'flex-end',
  },
  center: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  rowJC: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowAC: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowJB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowJEC: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rowC: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowAE: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowJE: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  colJC: {
    justifyContent: 'center',
  },
  colAC: {
    alignItems: 'center',
  },
  colJB: {
    justifyContent: 'space-between',
  },
  colC: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  colAE: {
    alignItems: 'flex-end',
  },
  colJE: {
    justifyContent: 'flex-end',
  },
  marginT2: {
    marginTop: hp(2),
  },
  paddingH4: {
    paddingHorizontal: wp(4),
  },
  marginH2: {
    marginHorizontal: wp(2),
  },
  rowACMB1:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  iconView: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: hp(6),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  overlay: {
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#FAFAFA99',
  },
  cricleWithBorder: {
    borderWidth: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#BBBEBF35',
    borderStyle: 'solid',
    flexDirection: 'row',
    height: wp(67),
    width: wp(67),
    borderRadius: wp(33),
    marginTop: wp(-17),
  },
  sepretor: {
    borderWidth: 0.5,
    marginVertical: wp(6),
    borderColor: '#B8BCCA',
    width: wp(90),
    alignSelf: 'center',
  },
  inputContainer: {
    borderWidth: 2,
    marginVertical: wp(1),
    height: isiPAD ? wp(8) : wp(13.5),
    // paddingVertical: isiPAD ? wp(2.5) wp(3.5),
    borderRadius: isiPAD ? wp(1) : wp(1.5),
    borderColor: colors.grey,
    backgroundColor: colors.white,
    color: colors.black2,
  },
  backContainer: {
    paddingVertical: wp(5),
    paddingRight: wp(5),
    paddingLeft: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowContainer: {
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  allCenter: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
