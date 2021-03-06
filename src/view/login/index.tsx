import React, { useState, useRef } from 'react'
import { Formik, FormikHelpers } from 'formik'
import { useDispatch } from 'react-redux'
import { Platform, TextInput } from 'react-native'
import * as SecureStore from 'expo-secure-store'

import { NavPropsLogin } from '../../routes/types'
import UserRTK from '../../store/user'
import ConfigRTK from '../../store/config'
import * as authAPI from '../../API/auth'
import Input from '../components/input'
import headerImage from '../../assets/appImages/loginHeader.png'
import { formValidation, FormData } from './types'
import {
  Container,
  AppNameView,
  AppTitle,
  AppSubTitle,
  ImageHeader,
  LoginButton,
  RowView,
  SecondaryButton,
  SeparatorView,
  KeyboardAvoidingView,
  ScrollView,
} from './styles'

const Login: React.FC<NavPropsLogin> = ({ navigation }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const passwordInputRef = useRef<typeof Input & TextInput>(null)

  const checkLogin = async (values: FormData, actions: FormikHelpers<FormData>) => {
    setIsLoading(true)
    const user = await authAPI.login(values)
    setIsLoading(false)

    if (!user) {
      dispatch(
        ConfigRTK.actions.setAlert({
          visible: true,
          alertTitle: 'Oops!',
          alertMessage: 'Something went wrong, try again',
          okText: 'Ok',
        })
      )
      return
    }

    if ('statusCode' in user) {
      dispatch(
        ConfigRTK.actions.setAlert({
          visible: true,
          alertTitle: 'Oops!',
          alertMessage: user.message,
          okText: 'Ok',
        })
      )
      return
    }

    actions.resetForm()
    if (user.accessToken) {
      await SecureStore.setItemAsync('accessToken', user.accessToken)
    }
    if (user.refreshToken) {
      await SecureStore.setItemAsync('refreshToken', user.refreshToken)
    }

    user.accessToken = undefined
    user.refreshToken = undefined
    dispatch(UserRTK.actions.setUser(user))
    dispatch(ConfigRTK.actions.setAuthenticated(true))
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageHeader source={headerImage} resizeMode="cover" />
        <Container>
          <AppNameView>
            <AppSubTitle>Welcome to</AppSubTitle>
            <AppTitle>Aquamind Care</AppTitle>
          </AppNameView>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={(values, actions) => checkLogin(values, actions)}
            validationSchema={formValidation}
          >
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <>
                <Input
                  label="E-mail"
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  value={values.email}
                  error={touched.email && errors.email ? errors.email : undefined}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  returnKeyType="next"
                />
                <Input
                  label="Password"
                  forwardRef={passwordInputRef}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  value={values.password}
                  error={touched.password && errors.password ? errors.password : undefined}
                  secureTextEntry
                  onSubmitEditing={handleSubmit}
                  returnKeyType="go"
                />
                <LoginButton
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                >
                  Login
                </LoginButton>
              </>
            )}
          </Formik>
          <RowView>
            <SecondaryButton onPress={() => navigation.navigate('CreateAccount')}>
              Create account
            </SecondaryButton>
            <SeparatorView />
            <SecondaryButton onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot Password
            </SecondaryButton>
          </RowView>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login
