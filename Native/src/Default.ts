import { StyleSheet } from "react-native"

const color = {
    black: '#000',
    red: '#ad0000',
    green: '#007c00',
    blue: '#0000aa',
    grey: '#aaa',
    lightBlue: '#ADD8E6',
    skyBlue: '#87CEEB',
    steelBlue: '#4682B4',
    yellow: '#ff0',
    amberYellow: '#ebb000',
    nightBlue: '#08004d',
    pinks: '#b200f8'

}


export const THEME = {
    color: {
        white: '#fff',
        grey: '#aaa',
        main: '#000066',
        black: color.black,
        wb: color.pinks
    },
    button: {
        apply: color.green,
        delete: color.red,
        cancel: color.amberYellow,
    }
}

export const STYLE = StyleSheet.create({
    textName: {
        maxWidth: '60%',

        fontSize: 20
    },
    textPhone: {
        fontSize: 20,
        color: color.nightBlue,
        fontWeight: '800'
    },
})

export const SETTINGS = {
    host: 'http://192.168.50.2',
    port: '5001',
}
