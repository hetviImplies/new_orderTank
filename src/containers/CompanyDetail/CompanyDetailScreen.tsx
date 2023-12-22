import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CompanyDetail from '../../components/CompanyDetail'

const CompanyDetailScreen = ({navigation}:any) => {
  return (
      <CompanyDetail from={'Profile'} navigation={navigation}/>
  )
}

export default CompanyDetailScreen

const styles = StyleSheet.create({})