import { MouseEventHandler } from 'react'
import { Image } from "antd";
import s from './Card.module.css'

// import { useNavigate } from 'react-router-dom';

const fullPathImage = import.meta.env.VITE_BACKEND_PATH_IMAGE
const host = import.meta.env.VITE_BACKEND_HOST
const port = import.meta.env.VITE_BACKEND_PORT


//Функция проверки работы программы. Если локально, то локальный путь к картинкам сервера
const imagePath = (image:string) => {
    if (host ==='http://localhost') {
        return host + ':' + port + '/' +  fullPathImage + image
    } else {
        return new URL(`${fullPathImage}${image}`, import.meta.url).href
    }
}

console.log();

interface CardProps {
    parfum: Parfum,
    onClickEdit: MouseEventHandler<HTMLDivElement>
}


export const Card = ({parfum, onClickEdit}: CardProps) => {
    
    return (
    <div className={s.Card}>
        <div className={s.header}>
            <div className={s.LogoFMH}>
                <Image 
                    width={100} 
                    preview={false}
                    src={imagePath('LogoFMH.png')}
                    
                />
            </div>
            <div className={s.LeftColumn}>
                <div>
                        <Image 
                            width={150} 
                            height={150}
                            src={imagePath(parfum.pathOriginImageBottle)}
                        />
                </div>
                <div>
                        <span className={s.HeadLine}>Для поклонников аромата</span><br />
                        <span className={s.OriginFor}>{parfum.originFor}</span>
                </div>
            </div>
            <div className={s.RigthColumn}>
                <Image 
                    width={200} 
                    style={{paddingBottom: '5px'}}
                    preview={false}
                    src={imagePath(parfum.imageLogo)}
                />
                <Image 
                    width={100} 
                    src={imagePath(parfum.pathEssenceImageBottle)}
                />
            <div className={s.parfumFor}>{parfum.parfumesFor}</div>
            <div className={s.Article}>{parfum.smallArticle}</div>
            </div>
        </div>
        <div className={s.footer}>
            <div className={s.description}>
                {parfum.description}
            </div> <br />
                <div>
                    <strong>Верхние ноты:</strong> {parfum.topNotes}
                </div>
                <div>
                    <strong>Ноты сердца:</strong>{parfum.heartNotes}
                </div>
                <div>
                    <strong>Базовые ноты: </strong>{parfum.baseNotes}
                </div><br />
            <div className={s.BolderLarge}>{parfum.smell}</div>
        </div>
        <div className={s.Edit}>
            <Image 
                src={imagePath(`EditIco.svg`)}
                width={'20px'}
                preview={false}
                data-id={parfum._id}
                onClick={onClickEdit}                
            />
        </div>
    </div>

  )
}

