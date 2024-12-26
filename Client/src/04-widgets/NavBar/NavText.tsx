import { useState } from 'react';
import { Link } from 'react-router-dom';

interface INavText {
  navigate: string
  text: string
  subItems: {navigate: string, text: string}[]
}

export const NavText = ({ navigate, text, subItems } : INavText) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <div 
    // className='nav-text'
      className="flex z-10 relative flex-row"
      onMouseEnter={() => {console.log(isSubMenuOpen); setIsSubMenuOpen(true)}} // Открывать подпункты при наведении
      onMouseLeave={() => {console.log(isSubMenuOpen); setIsSubMenuOpen(false)}} // Закрывать при выходе мыши
      >
      <Link 
        // className='main-item'
        // onClick={() => {console.log(isSubMenuOpen); setIsSubMenuOpen((prev) => !prev)}}
        className=" flex-grow z-10 p-2 transition-all text-white 
          text-sm hover:bg-stone-500"
        to={navigate} 
      >
        {text?.toLocaleUpperCase()}
      </Link>
      {subItems && subItems.length > 0 && (
        <div 
          // className={`sub-menu ${isSubMenuOpen ? 'open' : ''}`}
          className={`absolute top-0 left-full flex-col
             bg-stone-600 z-10  transition-all
            ${isSubMenuOpen ? 'visible flex' : 'hidden'}`}
        >
          {subItems.map((subItem, index) => (
            <Link 
              key={index} 
              to={subItem.navigate} 
              // className="sub-item"
              className="p-2 cursor-pointer text-stone-100
              hover:bg-stone-500 transition-all"
            >
              {subItem.text?.toLocaleUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
