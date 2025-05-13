import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { THEME } from '../Default'

interface statusDataProps {
  statusData: 
    {key: string, sum : number}[]
}

export const TotalBar = ({ statusData }: statusDataProps) => {

  
  return (
    <View style={styles.content}>
      {statusData.map((data, index) => (
        <Text key={index} style={styles.text}>{`${data.key}: ${data.sum.toFixed(0)}`}</Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 30,
    backgroundColor: THEME.color.main,
  },
  text: {
    color: THEME.color.white
  }
})