import React, { useEffect, useState } from 'react'
import style from './ParfumCards.module.css'
import { Card } from '../../../04-widgets/ParfumCard/UI/Card';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ParfumCards = () => {

    const [parfums, setParfums] = useState([])

    const navigate = useNavigate()
    const host = import.meta.env.VITE_BACKEND_HOST
    const port = import.meta.env.VITE_BACKEND_PORT

    useEffect(() => {
        const getParfums = async () => {
            try {
                const response = await axios.get(`${host}:${port}/api/parfum`)
                const Data = response.data
                const sortData = Data.sort((a, b) => a.smallArticle.localeCompare(b.smallArticle))
                setParfums(sortData)
            } catch (error) {
                console.log(error.message);
            }
        }
        getParfums()
    }, [])

    const EditHandler = (e) => {
        const currentId = e.currentTarget.getAttribute('data-id')
        const initData = parfums.find(art => art._id === currentId)
        navigate('/parfum/edit', {state: {initData}})
    }


    return (
        <div className={style.Cards}>
            {
                
                parfums.map((parfum, index) => {
                    if (parfum.status==='В наличии') {
                        return (
                            <Card 
                                key={index} 
                                parfum={parfum} 
                                onClickEdit={EditHandler}
                            />
                        )
                    }
                })

            }
        </div>
    )
}