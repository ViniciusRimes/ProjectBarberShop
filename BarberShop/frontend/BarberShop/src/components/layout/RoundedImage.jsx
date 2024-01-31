import styles from './RoundedImage.module.css'

export const RoundedImage = ({src, alt, width }) => {
  return (
    <>
        <img className={`${styles.roundedImage} ${styles[width]}`} src={src} alt={alt} />
    </>
  )
}
export default RoundedImage