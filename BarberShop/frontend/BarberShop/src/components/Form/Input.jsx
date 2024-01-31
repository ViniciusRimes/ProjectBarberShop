import styles from './Input.module.css'

const Input = ({type, text, name, placeholder, handleOnChange, required, className}) => {
  return (
    <div className={styles.inputContainer}>
        <label htmlFor={name}>{text}</label>
        <input 
        type= {type} 
        name={name} 
        placeholder={placeholder} 
        onChange={handleOnChange}
        required = {required}
        className={className ? className : ''}
        ></input>
    </div>
  )
}

export default Input