import s from './Button.module.css'

interface ButtonProps {
  text: string
  onClick: () => void
  color: string
}

export const Button = ({text, onClick, color}: ButtonProps) => {
  return (
    <div className={s.Button}
        onClick={onClick}
        style={{backgroundColor: color}}
    >
        {text}
    </div>
  )
}
