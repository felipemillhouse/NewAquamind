import styled from 'styled-components/native'
import { Dimensions, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import theme from '../../../theme'

const { width } = Dimensions.get('window')
export const ImageBox = styled.View`
  width: ${width / 5}px;
  height: ${width / 5}px;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${theme.colors.disabled};
  padding: ${theme.sizes.padding / 3}px;
  margin: 0 ${theme.sizes.padding}px ${theme.sizes.padding}px 0;
  background-color: ${theme.colors.surface};
`
export const ImageBoxImage = styled(FastImage)`
  width: ${width / 5 - theme.sizes.padding / 1.5}px;
  height: ${width / 5 - theme.sizes.padding / 1.5}px;
`
