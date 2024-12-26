import React, { useEffect, useState } from 'react'
import {TextField} from '../../../07-shared/TextFields'
import style from './FormVitamin.module.css'
import axios from 'axios'

export const FormVitamin = () => {
  
    const [formData, setFormData] = useState({
        id: '',
        article: '',
        brand: '',
        nameRUS: '',
        SEO: '',
        positionNameENG: '',
        dose: '',
        unit: '',
        structureType: '',
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log(formData);

        try {
            const respons = await axios.post('http://localhost:5001/api/unit/create', formData)
            if (respons.status === 201) {
                console.log('Form submitted successfuly');
            } else {
                console.log('Error submitting form');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    

    return (
        <div>
            <form className={style.FormVitamin}>
                <TextField
                    name={'article'}
                    label={"Артикул"}
                    value={formData.article}
                    onChange={handleChange}
                />
                <TextField
                    name={'brand'}
                    label={"Бренд"}
                    value={formData.brand}
                    onChange={handleChange}
                />
                <TextField
                    name={'positionNameRUS'}
                    label={"Наименование RUS"}
                    value={formData.positionNameRUS}
                    onChange={handleChange}
                />
                <TextField
                    name={'positionNameENG'}
                    label={"Наименование ENG"}
                    value={formData.positionNameENG}
                    onChange={handleChange}
                />
                <TextField
                    name={'CEO'}
                    label={"Варианты для поиска"}
                    value={formData.CEO}
                    onChange={handleChange}
                />
                <TextField
                    name={'dose'}
                    label={"Дозировка"}
                    value={formData.dose}
                    onChange={handleChange}
                />
                <TextField
                    name={'unit'}
                    label={"Штук в упаковке"}
                    value={formData.unit}
                    onChange={handleChange}
                />
                <TextField
                    name={'structureType'}
                    label={"Тип структуры"}
                    value={formData.structureType}
                    onChange={handleChange}
                />

                <div className={style.name}>
                    <h3>{`Артикул: ${formData.article}`}</h3>
                    <h4>{`Наименование: ${formData.brand} 
                        ${formData.positionNameRUS} 
                        ${formData.dose} 
                        ${formData.unit ? formData.unit + 'шт.': ''}  
                        ${formData.structureType}`}
                    </h4>
                </div>
                <div 
                    className={style.button}
                    onClick={handleSubmit}
                >
                        Сохранить
                </div>
            </form>
        </div>
  )
}
