import { useNavigate } from "react-router-dom";
import './NavButton.css'

interface NavButtonProps {
    navigateTo: string
    spravImg: string
    text: string
}

export const NavButton = ({ navigateTo, spravImg, text }: NavButtonProps) => {
    const navigate = useNavigate()
    return (
        <div className='NavButton' onClick={() => navigate(navigateTo)}>
            <img src={spravImg} alt={text} width="70px" height="50px"/>
            <div className='text'>{text}</div>
        </div>
    )
}
