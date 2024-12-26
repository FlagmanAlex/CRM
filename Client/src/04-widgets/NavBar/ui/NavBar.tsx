import { useState } from 'react'
import line3 from './image/line3.svg'
import cross from './image/cross.svg'

import { NavText } from './NavText/NavText'

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
        aria-label='Затемнение'
        className={open ? `fixed top-0 bg-stone-900 
          z-[900] w-screen h-screen opacity-50 duration-500` : ''} 
        onClick={VisibleLineHandler}>
      </div>
      <div 
        aria-label='Панель навигации'
        className={`fixed flex top-0 flex-col justify-around
        bg-stone-600  z-[1000] duration-300
        ${open ? "translate-x-[0px]" : "translate-x-[-140px]"}`}
        // className={`fixed flex flex-col
        // bg-stone-600
        // duration-300 z-[1000]`}
      >
        <img 
          src={open ? cross : line3} 
          className='absolute left-full ml-3 z-50 cursor-pointer' 
          onClick={VisibleLineHandler} 
          alt='' 
        />
        {data.map((item, index) => (
          <NavText 
            key={index} 
            navigate={item.navigate || ''} 
            text={item.text} 
            subItems={item.subItems || []}
          />
        ))}
      </div>
    </>
  );
};