import { useState } from 'react'
import line3 from './image/line3.svg'
import cross from './image/cross.svg'

import { NavText } from './NavText'

interface INavText {
  navigate: string
  text: string
  subItems: {navigate: string, text: string}[]
}

interface NavBarProps {
  data: INavText[]
}

export const NavBar = ({ data }: NavBarProps) => {
  const [open, setOpen] = useState(false);
  
  const VisibleLineHandler = () => {
    setOpen(!open);
  };
  
  return (
    <>
      <div 
        aria-label='Панель навигации'
        className='fixed flex p-1
          items-center z-30 justify-between 
          w-full h-12 bg-stone-600'
      >
        <img 
          aria-label='Кнопка меню'
          src={line3} 
          className='fixed p-3 z-40 cursor-pointer hover:bg-stone-500' 
          onClick={VisibleLineHandler} 
          alt='' 
        />
      </div>
      <div 
        aria-label='Выпадающая панель меню'
        className={`absolute flex top-0 flex-col justify-around
        bg-stone-600  z-20 duration-300
        ${open ? "translate-y-10" : "translate-y-[-100px]"}`}
        // className={`fixed flex flex-col
        // bg-stone-600
        // duration-300 z-[1000]`}
      >
        {data.map((item, index) => (
          <NavText 
            key={index} 
            navigate={item.navigate || ''} 
            text={item.text} 
            subItems={item.subItems || []}
          />
        ))}
      </div>
      <div 
        aria-label='Затемнение'
        className={open ? `fixed top-0 bg-stone-900 
          z-10 w-screen h-screen opacity-50 duration-500` : ''} 
          onClick={VisibleLineHandler}>
      </div>
    </>
  );
};