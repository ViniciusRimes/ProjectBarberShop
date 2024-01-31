import styles from './RegisterClient.module.css'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Input from '../Form/Input'
import InputPassword from '../Form/InputPassword'
import InputSubmit from '../Form/InputSubmit'
import Messages from '../layout/Messages'
import { Context } from '../../context/BarberShopContext'
import RoundedImage from '../layout/RoundedImage'

export const RegisterClient = () => {
  const [client, setClient] = useState({})
  const [preview, setPreview] = useState('')
  const {registerClient} = useContext(Context)

  const handleChange = (e) =>{
    setClient({...client, 
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = (e) =>{
    e.preventDefault()
    registerClient(client)
  }
  const OnFileChange = (e) =>{
    setPreview(e.target.files[0])
    setClient({...client,
      [e.target.name]: e.target.files[0]
    })
  }

  return (
    <div className={styles.registerPage}>
        <h1>Registre-se</h1>
        <p>Registre-se abaixo para poder acessar todas as funcionalidades da barbearia, incluindo agendamentos de horários</p>
        <p>Já possui conta? <Link to={'/client/login'}>clique aqui para fazer login</Link> </p>
        <form action="/client/register" method='post' onSubmit={handleSubmit}>
          <div className={styles.preview}>
            {preview && <RoundedImage src={URL.createObjectURL(preview)}/>}
          </div>
          <Input type={'file'} handleOnChange={OnFileChange} name={'img'} text={'Foto de perfil:'} className={styles.inputFile}/>
          <Input text={'Nome: '} type={'text'} name={'name'} placeholder={'Seu nome completo'} handleOnChange={handleChange} required = {true}/>
          <Input text={'Telefone: '} type={'text'} name={'phone'} placeholder={'Número de telefone (incluindo ddd)'} handleOnChange={handleChange} required = {true}/>
          <InputPassword text={'Senha: '} required={true} name={'password'} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} handleOnChange={handleChange}/>
          <InputPassword text={'Senha: '} required={true} name={'confirmPassword'} placeholder={'Mínimo 8 caracteres e uma letra maíuscula'} handleOnChange={handleChange}/>
          <Messages/>
          <InputSubmit value={'Registrar'}/>
        </form>
    </div>
  )
}
