
import {useState } from 'react'
import styles from './InputPassword.module.css'
import { BiShow } from "react-icons/bi"

const PasswordInput = ({text, name, placeholder, handleOnChange, required}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordInputContainer}>
      <label htmlFor={name}>{text}</label>
      <div className={styles.inputFieldContainer}>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          onChange={handleOnChange}
          required={required}
          className={styles.passwordInputField}
        />
        <button
          type="button"
          className={styles.togglePasswordButton}
          onClick={togglePasswordVisibility}
        >
          <BiShow/>
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
