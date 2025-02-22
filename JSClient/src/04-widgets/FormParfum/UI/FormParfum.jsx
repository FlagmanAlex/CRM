import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './FormParfum.module.css'
import { TextField } from '../../../07-shared/TextFields'
import { Button } from '../../../07-shared/Button/UI/Button'
import { Image } from 'antd'
import axios from 'axios'
import { UploadFile } from '../../../07-shared/UploadFile/UI/UploadFile'

export const FormParfum = () => {
    
    const location = useLocation()
    const navigate = useNavigate()
    const navigateHomePage = '/'
    
    const fullPathImage = import.meta.env.VITE_BACKEND_PATH_IMAGE
    const host = import.meta.env.VITE_BACKEND_HOST
    const port = import.meta.env.VITE_BACKEND_PORT
    
    
    //Функция проверки работы программы. Если окально, то локальный путь к картинкам сервера
    const imagePath = (image) => {
        if (host ==='http://localhost') {
            return host + ':' + port + '/' +  fullPathImage + image
        } else {
            return new URL(`${fullPathImage}${image}`, import.meta.url).href
        }
    }
    



    const { initData } = location.state || {}
   

    // const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({
        id: '',
        fullArticle: '',
        originFor: '',
        imageLogo: 'EssenceLogo.png',
        imageBottle: '',
        pathOriginImageBottle: '',
        pathEssenceImageBottle: '',
        parfumesFor: '',
        smallArticle: '',
        description: '',
        topNotes: '',
        heartNotes: '',
        baseNotes: '',
        smell: '',
        status: 'В наличии'
    })

    useEffect(() => {
        if (initData) {
            setFormData({
                ...formData,
                id: initData._id || '',
                fullArticle: initData.fullArticle || '',
                originFor: initData.originFor || '',
                imageLogo: initData.imageLogo || '',
                imageBottle: initData.imageBottle || '',
                pathOriginImageBottle: initData.pathOriginImageBottle || '',
                pathEssenceImageBottle: initData.pathEssenceImageBottle || '',
                parfumesFor: initData.parfumesFor || '',
                smallArticle: initData.smallArticle || '',
                description: initData.description || '',
                topNotes: initData.topNotes || '',
                heartNotes: initData.heartNotes || '',
                baseNotes: initData.baseNotes || '',
                smell: initData.smell || '',
                status: initData.status || ''
            })
        }
    }, [initData])

    const onChangeFileOrigin = async (event) => {
        const selectedFile = event.target.files[0]

        if (selectedFile) {
            const fileData = new FormData()
            fileData.append('image', selectedFile)
            try {
                await axios.post(`${host}:${port}/api/file/upload`, fileData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data',
                    }
                })
                    .then(response => {
                        setFormData({ ...formData, pathOriginImageBottle: response.data.imageUrl })
                        console.log(formData.pathOriginImageBottle)
                    })
                    .catch(error => console.error('Error uploading file:', error.message))
                    
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    const onChangeFileEssence = async (event) => {
        const selectedFile = event.target.files[0]

        if (selectedFile) {
            const fileData = new FormData()
            fileData.append('image', selectedFile)
            try {
                await axios.post(`${host}:${port}/api/file/upload`, fileData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data',
                    }
                })
                    .then(response => {
                        setFormData({ ...formData, pathEssenceImageBottle: response.data.imageUrl })
                        console.log(formData.pathEssenceImageBottle)
                    })
                    .catch(error => console.error('Error uploading file:', error.message))
                    
            } catch (error) {
                console.log(error.message);
            }
        }
    }


    const onChange = (e) => {
        const { name, value } = e.target
        const updatedFormData = { ...formData, [name]: value }
        setFormData(updatedFormData)
        // axios.post('https://localhost:5001/api/save', updatedFormData)
        //     .then(response => console.log('Data saved:', response.data))
        //     .catch(error => console.error('Error saving data:', error))
    }

    const saveHandler = () => {
        axios.post(`${host}:${port}/api/parfum/create`, formData)
            .then(response => {
                console.log('Data saved:', response.data)
                navigate(navigateHomePage)
            })
            .catch(error => console.error('Error saving data:', error))
    }

    const cancelHandler = () => {
        const previousPath = localStorage.getItem('previousPath')
        if (previousPath) navigate(previousPath)
        else navigate(navigateHomePage)
    }

    const deleteHandler = () => {
        axios.delete(`${host}:${port}/api/parfum/${formData.id}`)
            .then(response => {
                console.log('Data deleted:', response.data)
                navigate(navigateHomePage)
            })
            .catch(error => console.error('Error delete data:', error))
    }

    const updateHandler = () => {
        axios.put(`${host}:${port}/api/parfum/${formData.id}`, formData)
            .then(response => {
                console.log('Data updated:', response.data)
                navigate(navigateHomePage)
            })
            .catch(error => console.error('Error updating data:', error))
    }

    const deleteImageLeft = async (e) => {
        const currentPath = e.currentTarget.getAttribute('data-path')
        axios.delete(`${host}:${port}/api/file/${currentPath}`)
            .then(response => {
                console.log('File Delete:', response.data);
                setFormData({...formData, pathOriginImageBottle: null})
            })
            .catch(error => console.log(error.message))
            console.log(formData);
    }
    const deleteImageRight = async (e) => {
        const currentPath = e.currentTarget.getAttribute('data-path')
        axios.delete(`${host}:${port}/api/file/${currentPath}`)
            .then(response => {
                console.log('File Delete:', response.data);
                setFormData({...formData, pathEssenceImageBottle: null})
            })
            .catch(error => console.log(error.message))
            console.log(formData);
    }
    return (
        <div className={s.NewParfum}>
            <TextField
                name={'fullArticle'}
                label={'Код продукции'}
                value={formData.fullArticle}
                onChange={onChange}
            />
            <TextField
                name={'originFor'}
                label={'Оригинальное наименование'}
                value={formData.originFor}
                onChange={onChange}
            />
            <div className={s.Image}>
                {(!formData.pathOriginImageBottle || formData.pathOriginImageBottle === '') ? (
                <UploadFile
                    onChange={onChangeFileOrigin}
                    text={'Фото оригинального флакона'}
                    previewURL={formData.pathOriginImageBottle}
                />) : (
                    <div className={s.ImagePrew}>
                        <Image 
                            height={100}
                            width={100}
                            src={imagePath(formData.pathOriginImageBottle)}
                        />
                        <div 
                            className={s.DelImage}
                            onClick={deleteImageLeft}
                            data-path={formData.pathOriginImageBottle}
                        ></div>
                    </div>
                )}
                {(!formData.pathEssenceImageBottle || formData.pathEssenceImageBottle === '') ? (
                <UploadFile
                    onChange={onChangeFileEssence}
                    text={'Фото флакона Essence'}
                    previewURL={formData.pathEssenceImageBottle}
                />) : (
                    <div className={s.ImagePrew}>
                        <Image 
                            height={100}
                            width={100}
                            src={imagePath(formData.pathEssenceImageBottle)}
                        />
                        <div 
                            className={s.DelImage}
                            onClick={deleteImageRight}
                            data-path={formData.pathEssenceImageBottle}
                        ></div>
                    </div>
                )}
            </div>
            <TextField
                name={'parfumesFor'}
                label={'Для кого духи'}
                value={formData.parfumesFor}
                onChange={onChange}
            />
            <TextField
                name={'smallArticle'}
                label={'Артикул'}
                value={formData.smallArticle}
                onChange={onChange}
            />
            <TextField
                name={'description'}
                label={'Краткое описание'}
                value={formData.description}
                onChange={onChange}
            />
            <TextField
                name={'topNotes'}
                label={'Высокие ноты'}
                value={formData.topNotes}
                onChange={onChange}
            />
            <TextField
                name={'heartNotes'}
                label={'Ноты сердца'}
                value={formData.heartNotes}
                onChange={onChange}
            />
            <TextField
                name={'baseNotes'}
                label={'Базовые ноты'}
                value={formData.baseNotes}
                onChange={onChange}
            />
            <TextField
                name={'smell'}
                label={'Аромат'}
                value={formData.smell}
                onChange={onChange}
            />
            <TextField
                name={'status'}
                label={'Статус (В наличии/ Под заказ)'}
                value={formData.status}
                onChange={onChange}
            />
            <div className={s.ButtonBlock}>
                {initData ? (
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
        </div>
    )
}
