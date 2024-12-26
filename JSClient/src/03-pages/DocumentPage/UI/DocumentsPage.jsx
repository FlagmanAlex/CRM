import React, { useEffect, useRef, useState } from 'react'
import styles from './DocumentsPage.module.css'
import { BarcodeScaner } from './BarcodeScaner'


export const DocumentsPage = () => {

  const [productData, setProductData] = useState({
    barcode: '',
    name: '',
    price: '',
    quantity: ''
  })

  const [isScanning, setIsScanning] = useState(false)

  const barcodeInputRef = useRef(null)

  useEffect(() => {
    barcodeInputRef.current.focus()
  }, [])


  const handleChange = (e) => {
    const {name, value} = e.target
    setProductData({ ...productData, [name]: value})
  }

  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('Barcode scanned:', productData.barcode);
      barcodeInputRef.current.focus()
    }
  }

  const handleScanButton = () => {
    setIsScanning(true)
  }

  const handleDetected = (barcode) => {
    setProductData({ ...productData, barcode})
    setIsScanning(false)
    barcodeInputRef.current.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', productData);
      alert('Товар добавлен в базу данных');
      setProductData({ barcode: '', name: '', price: '', quantity: '' });
      barcodeInputRef.current.focus(); // Возвращаем фокус на поле ввода штрихкода после отправки данных
    } catch (error) {
      alert('Ошибка при добавлении товара');
    }
  };

  return (
    <div>
      {isScanning && <BarcodeScaner onDetected={handleDetected} />}
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Добавить товар</h2>
        <div className={styles.formGroup}>
          <label htmlFor="barcode">Штрихкод</label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            value={productData.barcode}
            onChange={handleChange}
            onKeyDown={handleBarcodeInput}
            ref={barcodeInputRef} // Привязываем ref к полю ввода штрихкода
            required
          />
          <button type="button" onClick={handleScanButton} className={styles.scanButton}>Сканировать</button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Цена</label>
          <input
            type="text"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Количество</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Добавить</button>
      </form>
    </div>
  );
}
