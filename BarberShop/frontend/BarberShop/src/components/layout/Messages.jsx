import styles from './Messages.module.css'
import { useState, useEffect } from 'react'
import bus from '../../helpers/bus'

const Messages = () => {
    const [visibility, setVisibility] = useState(false)
    const [type, setType] = useState("")
    const [message, setMessage] = useState("")

    useEffect(()=>{
        bus.addListener('flash', ({message, type, time}) =>{
            setVisibility(true)
            setMessage(message)
            setType(type)

            setTimeout(() => {
                setVisibility(false)
            }, time);
        })
    }, [])

    return (
        visibility &&
        <div className={`${styles.message} ${styles[type]}`}>
            {message}
        </div>
  )
}

export default Messages