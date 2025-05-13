import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextField } from '../shared/TextField'
import { THEME } from '../Default'

interface ISearchTextProps {
    placeholder: string
    searchText: string
    setSearchText: (text: string) => void
}

export const SerachBar = ({placeholder, searchText, setSearchText} : ISearchTextProps) => {
  return (
      <View style={styles.content}>
        <TextField
          onChangeText={setSearchText}
          value={searchText}
          placeholder={placeholder}
        />
      </View>
  )
}


const styles = StyleSheet.create({
    content: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: THEME.color.main
    }
})