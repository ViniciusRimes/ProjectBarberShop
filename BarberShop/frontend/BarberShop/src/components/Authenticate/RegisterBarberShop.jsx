import styles from './RegisterBarberShop.module.css'
import Input from '../Form/Input'
import InputPassword from '../Form/InputPassword'
import { useContext, useState } from 'react'
import { Context } from '../../context/BarberShopContext'
import InputSubmit from '../Form/InputSubmit'
import Messages from '../layout/Messages'
import { Link } from 'react-router-dom'

const RegisterBarberShop = () => {
  const {registerBarberShop} = useContext(Context)
  const [barberShop, setBarberShop] = useState({})

  const handleChange = (e =>{
    setBarberShop({...barberShop, 
      [e.target.name]: e.target.value
    })
  })
  const handleSubmit = (e =>{
    e.preventDefault()
    registerBarberShop(barberShop)
  })

  return (
    <div className={styles.registerPage}>
        <div className={styles.img}></div>
        <h1>Registre-se</h1>
        <p>Seja bem-vindo ao sistema de gestão de barbearias. Registre os dados abaixo:</p>
        <p>Já possui conta? <Link to={'/barbershop/login'}>clique aqui para fazer login</Link> </p>
        <form method='post' action="/barbershop/register" onSubmit={handleSubmit}>
          <Input text={'Barbearia: '} type={'text'} name={'name'} placeholder={'Digite o nome da sua barbearia'} handleOnChange={handleChange} required = {true}/>
          <Input text={'CNPJ: '} type={'text'} name={'cnpj'} placeholder={'Digite o CNPJ (14 dígitos)'} handleOnChange={handleChange} required = {false}/>
          <Input text={'Proprietário: '} type={'text'} name={'proprietary'} placeholder={'Digite o nome do proprietário'} handleOnChange={handleChange} required = {true}/>
          <Input text={'E-mail: '} type={'email'} name={'email'} placeholder={'Digite o e-mail do proprietário'} handleOnChange={handleChange} required = {true}/>
          <InputPassword text={'Senha: '} type={'password'} name={'password'} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} handleOnChange={handleChange} required = {true}/>
          <InputPassword text={'Confirmar senha: '} type={'password'} name={'confirmPassword'} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} handleOnChange={handleChange} required = {true}/>
          <Input text={'Telefone: '} type={'text'} name={'phone'} placeholder={'Número de telefone (incluindo ddd)'} handleOnChange={handleChange} required = {true}/>
          <Input text={'Estado: '} type={'text'} name={'state'} placeholder={'Digite o nome completo ou abreviado'} handleOnChange={handleChange} required = {true}/>
          <Input text={'Cidade: '} type={'text'} name={'city'} placeholder={'Digite o nome completo da cidade'} handleOnChange={handleChange} required = {true}/>
          <Input text={'Código Postal: '} type={'text'} name={'zipcode'} placeholder={'Digite apenas números, não inclua hífen'} handleOnChange={handleChange} required = {true}/>
          <Messages/>
          <InputSubmit value='Registrar'/>
        </form>
    </div>
  )
}

export default RegisterBarberShop