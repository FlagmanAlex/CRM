import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { THEME } from '../Default'
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from '../shared/Button';

type IconName = React.ComponentProps<typeof MaterialIcons>["name"]


interface BottomBarProps {
  bottomData: Array<{ icons?: IconName, action: () => void }>
}

export const BottomBar = ({ bottomData }: BottomBarProps) => {
  return (
    <View style={style.container}>
      {
        bottomData
          .map(({ icons='help', action }, index) => (
            <View key={index}>
              <Button onPress={action} bgColor={THEME.color.main}
              >
                <MaterialIcons name={icons} size={40} color={THEME.color.white}/>
              </Button>
              { 
                index !== bottomData.length - 1 && 
                <Text style={{ fontSize: 24, color: THEME.color.white }}>|</Text>
              }
            </View>
          ))
      }
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: THEME.color.main,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  content: {
    // height: 20
    // width: '100%',
  },
  button: {
    // flex: 1,
    // width: '100%',
    // height: '100%',
    // justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: THEME.color.white,
  },
})