import React from 'react'
import { useNavigate } from "react-router-dom";
import './NavButton.css'


export const NavButton = (props) => {
    const navigate = useNavigate()
    return (
        <div className='NavButton' onClick={() => navigate(props.Navigate)}>
            <img src={props.SpravImg} alt={props.Text} width="70px" height="50px"/>
            <div className='text'>{props.Text}</div>
        </div>
    )
}
