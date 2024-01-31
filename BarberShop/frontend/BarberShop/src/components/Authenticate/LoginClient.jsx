import styles from './LoginClient.module.css'

import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { Context } from '../../context/BarberShopContext'
import Input from '../Form/Input'
import InputSubmit from '../Form/InputSubmit'
import InputPassword from '../Form/InputPassword'
import Messages from '../layout/Messages'

export const LoginClient = () => {
  const [client, setClient] = useState({})
    const {loginClient} = useContext(Context)
    const handleChange = (e) =>{
        setClient({...client, 
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        loginClient(client)
    }
 
    return (
    <div className={styles.loginPage}>
        <form action="/barbershop/login" method='post' onSubmit={handleSubmit}>
            <Input type={'text'} text={'Telefone:'} name={'phone'} placeholder={'Digite o seu número de telefone'} handleOnChange={handleChange} required={true}/>
            <InputPassword text={'Senha: '} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} name={'password'} handleOnChange={handleChange} required={true}/>
            <p>Não possui conta? <Link to={'/client/register'}>Clique aqui para se registrar!</Link></p>
            <Messages/>
            <InputSubmit value={'Login'}/>
        </form>
    </div>
  )
}
