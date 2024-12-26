import s from './HomePageBrowser.module.css'

export const HomePageBrowser = () => {
  return (
    <div className={s.HomePageBrowser}>
      <div className={s.MirVitaminOK}>
          Мир ВитаминОК
      </div>
      <img 
        src={new URL('./QRTelegramVitamin.gif', import.meta.url).href} alt="Мир ВитаминОК" 
        width={"20%"}
      />
      <a className={s.Link} href="https://formula_myhealth.t.me">Подписаться</a>
    </div>
  )
}
