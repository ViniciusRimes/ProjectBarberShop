import styles from './LoginBarberShop.module.css'

import { useContext, useState } from 'react'
import {Link} from 'react-router-dom'

import Input from '../Form/Input'
import InputPassword from '../Form/InputPassword'
import InputSubmit from '../Form/InputSubmit'
import Messages from '../layout/Messages'
import {Context} from '../../context/BarberShopContext'

export const LoginBarberShop = () => {
    const [barbershop, setBarberShop] = useState({})
    const {loginBarberShop} = useContext(Context)
    const handleChange = (e) =>{
        setBarberShop({...barbershop, 
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault()
        loginBarberShop(barbershop)

    }
    return (
    <div className={styles.loginPage}>
        <form action="/barbershop/login" method='post' onSubmit={handleSubmit}>
            <Input type={'email'} text={'E-mail:'} name={'email'} placeholder={'Digite o e-mail da sua conta'} handleOnChange={handleChange} required={true}/>
            <InputPassword text={'Senha: '} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} name={'password'} handleOnChange={handleChange} required={true}/>
            <p>Não possui conta? <Link to={'/barbershop/register'}>Clique aqui para se registrar!</Link></p>
            <Messages/>
            <InputSubmit value={'Login'}/>
        </form>
    </div>
  )
}
