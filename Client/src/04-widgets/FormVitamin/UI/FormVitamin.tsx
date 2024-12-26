import React, { useState } from 'react'
import {TextField} from '../../../07-shared/TextFields'
import s from './FormVitamin.module.css'
import { Button } from '../../../07-shared/Button'

export const FormVitamin = () => {
  
    const [formData, setFormData] = useState({
        id: '',
        article: '',
        brand: '',
        nameRUS: '',
        nameENG: '',
        SEO: '',
        dose: '',
        unit: '',
        structureType: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }
    
    const updateHandler = () => {}
    const saveHandler = () => {}
    const deleteHandler = () => {}
    const cancelHandler = () => {}
    

    return (
        <div>
            <form className={s.FormVitamin}>
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
                    name={'nameRUS'}
                    label={"Наименование RUS"}
                    value={formData.nameRUS}
                    onChange={handleChange}
                />
                <TextField
                    name={'nameENG'}
                    label={"Наименование ENG"}
                    value={formData.nameENG}
                    onChange={handleChange}
                />
                <TextField
                    name={'SEO'}
                    label={"Варианты для поиска"}
                    value={formData.SEO}
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

                <div className={s.name}>
                    <h3>{`Артикул: ${formData.article}`}</h3>
                    <h4>{`Наименование: ${formData.brand} 
                        ${formData.nameRUS} 
                        ${formData.dose} 
                        ${formData.unit ? formData.unit + 'шт.': ''}  
                        ${formData.structureType}`}
                    </h4>
                </div>
                <div className={s.ButtonBlock}>
                    {formData ? (
                    <>
                        <Button
                            text={"Обновить"}
                            color={'yellow'}
                            onClick={updateHandler}
                        />
                        <Button
                            text={"Удалить"}
                            onClick={deleteHandler}
                            color={'red'}
                        />
                    </>
                    ) : (
                        <Button
                            text={"Сохранить"}
                            onClick={saveHandler}
                            color={'#0f0'}
                        />
                    )}
                    <Button
                        text={"Отмена"}
                        onClick={cancelHandler}
                        color={'white'}
                    />
                </div>
            </form>
        </div>
  )
}
