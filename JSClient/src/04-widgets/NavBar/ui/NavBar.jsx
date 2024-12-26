import React, { useState } from 'react'
import './NavBar.css'
import line3 from './image/line3.svg'
import cross from './image/cross.svg'

import { NavText } from './NavText/NavText'

const navDataLine = [
  {
    // Navigate: '',
    Text: 'Магазин',
    SubItems: [
      {
        Navigate: '/catalog/vitamins',
        Text: 'Витамины'
      },
      {
        Text: 'Парфюмерия',
        Navigate: '/catalog/Parfums'
      }
    ]
  },
  {
    // Navigate: '',
    Text: 'СПРАВОЧНИК',
    SubItems: [
      {
        Navigate: '/card/item1',
        Text: 'Витамины'
      },
      {
        Navigate: '/card/item2',
        Text: 'Парфюмерия'
      }
    ]
  },
  {
    Navigate: '/newProduct',
    Text: 'Новая карточка'
  },
  {
    Navigate: '/parfum',
    Text: 'Парфюм'
  },
];

export const NavBar = () => {
  const [visible, setVisible] = useState(false);
  
  const cls = ['NavBar'];
  const VisibleLineHandler = () => {
    setVisible(!visible);
  };
  
  if (visible) {
    cls.push('visible');
  }
  
  return (
    <>
      <div className={visible ? 'dark' : ''} onClick={VisibleLineHandler}></div>
      <div className={cls.join(' ')}>
        <img 
          src={visible ? cross : line3} 
          className='line3' 
          onClick={VisibleLineHandler} 
          alt='' 
          width="15px" 
          height="13px"
        />
        {navDataLine.map((data, index) => (
          <NavText 
            key={index} 
            Navigate={data.Navigate} 
            Text={data.Text} 
            SubItems={data.SubItems}
          />
        ))}
      </div>
    </>
  );
};