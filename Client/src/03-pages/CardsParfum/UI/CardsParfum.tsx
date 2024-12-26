import React, { useEffect, useState } from 'react'
import { handleError } from "../../../07-shared/handleError";
import style from './CardsParfum.module.css'
import { Card } from '../../../04-widgets/ParfumCard/UI/Card';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IParfum } from '../../../../../Interfaces/IProduct'

export const CardsParfum = () => {

    const [parfums, setParfums] = useState<IParfum[]>([])

    const navigate = useNavigate()
    const host = import.meta.env.VITE_BACKEND_HOST
    const port = import.meta.env.VITE_BACKEND_PORT

    useEffect(() => {
        const getParfums = async () => {
            try {
                const response = await axios.get(`${host}:${port}/api/parfum`)
                const data = response.data
                const sortData = data.sort((a: {smallArticle: string}, b: {smallArticle: string}) => a.smallArticle.localeCompare(b.smallArticle))
                setParfums(sortData)
            } catch (error) {
                console.log(handleError(error));
            }
        }
        getParfums()
    }, [])

    const EditHandler = (e:React.MouseEvent<HTMLElement>) => {
        const currentId = e.currentTarget.getAttribute('data-id')
        const initData = parfums.find((art: {_id?: string}) => art._id === currentId)
        navigate('/parfum/edit', {state: {initData}})
    }


    return (
        <div className={style.Cards}>
            {
                
                parfums
                    .filter(parfum => parfum.status === 'В наличии')
                    .map((parfum) => (
                        <Card 
                            key={parfum._id} 
                            parfum={parfum} 
                            onClickEdit={EditHandler}
                        />
                    ))
            }
        </div>
    )
}