import styled from 'styled-components/native'

export const BackgroundView = styled.View`
  background: ${props => props.theme.background};
`
export const AuthBackgroundView = styled.View`
  background: ${props => props.theme.authbackground};
`
export const BlackText = styled.Text`
  color: ${props => props.theme.text};
`
export const BtnView = styled.TouchableOpacity`
  background: ${props => props.theme.btnbackground};
`
export const WhiteText = styled.Text`
  color: ${props => props.theme.whiteText};
`
export const BrownText = styled.Text`
  color: ${props => props.theme.brownText};
`
// export default Container;