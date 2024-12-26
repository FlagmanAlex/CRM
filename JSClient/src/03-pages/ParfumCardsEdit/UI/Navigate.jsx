import React from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Navigate.module.css'
import { Button } from '../../../07-shared/Button/UI/Button'

export const Navigate = () => {

    const navigate = useNavigate()

    const clickHandler = () => {
        navigate('/NewParfum')
    }

    return (
    <div className={s.Navigate}>
        <Button 
            text='Создать'
            onClick={clickHandler}
        />
    </div>
  )
}
