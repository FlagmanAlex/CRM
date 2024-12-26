// TextField.jsx
import React, { useState } from 'react';
import styles from './TextField.module.css';

interface ITextFieldProps {
  name: string,
  label: string,
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

export const TextField = ({name, label, value, onChange }: ITextFieldProps) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  return (
    <div className={styles.textField}>
      <label className={`${styles.label} ${focused || value ? styles.focusedLabel : ''}`}>
        {label}
      </label>
      <input
        type="text"
        autoComplete='off'
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.input} ${focused || value ? styles.focused : ''}`}
      />
    </div>
  );
};

export default TextField;
