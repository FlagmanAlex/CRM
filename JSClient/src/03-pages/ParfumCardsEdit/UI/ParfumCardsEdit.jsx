import React from 'react'
import {parfums} from '../../../04-widgets/ParfumCard/data'
import style from './ParfumCardsEdit.module.css'
import { Card } from '../../../04-widgets/ParfumCard/UI/Card';
import { Navigate } from './Navigate';
import { useNavigate } from 'react-router-dom';

export const ParfumCardEdit = () => {

    const navigate = useNavigate()

    const changeHandler = (e) => {
        const currentArticle = e.currentTarget.getAttribute('data-id')
        const initData = parfums.find(art => art.fullArticle === currentArticle)
        navigate('/parfum/edit', {state: {initData}})
    }

    return (
        <div className={style.Cards}>
            <Navigate />
            {
                parfums.map((parfum, index) => {
                    if (parfum.status==='В наличии') {
                        return (
                            <Card 
                                key={index} 
                                parfum={parfum} 
                                onClickEdit={changeHandler}
                            />
                        )
                    }
                })

            }
        </div>
    )
}