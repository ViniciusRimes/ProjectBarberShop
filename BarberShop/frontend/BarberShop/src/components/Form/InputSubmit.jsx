import styles from './InputSubmit.module.css'

const InputSubmit = ({value}) => {
  return (
    <div className={styles.inputSubmitContainer}>
        <input
          type= 'submit'
          value={value}
        />
    </div>
  )
}

export default InputSubmit