import React from 'react'
import s from './HomePageBrowser.module.css'

export const HomePageBrowser:React.FC = () => {
  return (
    <div className={s.HomePageBrowser}>
      <div className={s.MirVitaminOK}>
          Мир ВитаминОК в разработке...
      </div>
      <img 
        src={new URL('./QRTelegramVitamin.gif', import.meta.url).href} alt="Мир ВитаминОК" 
        width={"20%"}
      />
      <a className={s.Link} href="https://formula_myhealth.t.me">Подписаться</a>
    </div>
  )
}
