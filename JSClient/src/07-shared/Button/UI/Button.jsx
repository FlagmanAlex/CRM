import React from 'react'
import s from './Button.module.css'

export const Button = ({text, onClick, color}) => {
  return (
    <div className={s.Button}
        onClick={onClick}
        style={{backgroundColor: color}}
    >
        {text}
    </div>
  )
}
