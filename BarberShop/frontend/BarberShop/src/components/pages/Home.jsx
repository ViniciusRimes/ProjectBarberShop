import { useEffect, useState } from 'react'
import { ServiceTable } from '../ServiceTable/ServiceTable'
import styles from './Home.module.css'
import api from '../../helpers/axios'
import CustomSelect from '../Form/CustomSelect'
import InputSubmit from '../Form/InputSubmit'
import useFlashMessages from '../../hooks/useFlashMessages'
import Messages from '../layout/Messages'

export const Home = () => {
  const [dates, setDates] = useState([])
  const [times, setTimes] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [formattedDate, setFormattedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [services, setServices] = useState([])
  const [selectedService, setselectedService] = useState('')
  const [tokenClient] = useState(localStorage.getItem('tokenClient'))
  const {setFlashMessages} = useFlashMessages()
  const [schedulingFailed, setSchedulingFailed] = useState(true)

  useEffect(()=>{
    async function fetchDates(){
      try{
        const response = await api.get('/scheduling/available-dates')
        setDates(response.data)
      }catch(error){
        console.log('Erro ao buscar datas:', error)
      }
    }
    fetchDates()
  }, [])
  useEffect(()=>{
    async function fetchTimes(){
      try{
        if(formattedDate){
          const response = await api.get(`/scheduling/available-times/${formattedDate}`)
          setTimes(response.data)
        }
      }catch(error){
        console.log('Erro ao buscar horários:', error)
      }
    }
    fetchTimes()
  }, [formattedDate])
  useEffect(()=>{
      async function fetchServices(){
        try{
          const response = await api.get('/services/all')
          setServices(response.data)
        }catch(error){
          console.log('Erro ao buscar horários:', error)
        }
      }
      fetchServices()
  }, [])
  const handleDateChange = (e)=>{
    setSelectedDate(e.value)
    const [day, month, year] = e.value.split('-')
    const formattedDate = `${year}-${month}-${day}`
    setFormattedDate(formattedDate)
  } 
  const handleTimeChange = (e)=>{
    setSelectedTime(e.value)
  }
  const handleServiceChange = (e)=>{
    setselectedService(e.value)
  }

  const optionsDates = dates.map((date)=>(
      {value: date.date, label: date.date}
  ))
  const optionsTimes = times.map((time)=>(
    {value: time.time, label: time.time}
  ))
  const optionsServices = services.map((service)=>(
    {value: service.name, label: service.name}
  ))
  const reserveTime = async () =>{
    try{
      const selectedServiceObject = services.find((service)=>service.name === selectedService)
      const data = {
        date: formattedDate,
        time: selectedTime,
        serviceId:selectedServiceObject.id

      }
      await api.patch('/scheduling/reserve-time', data, {
        headers: {
          Authorization: `Bearer ${JSON.parse(tokenClient)}`
        }
      })
      setSchedulingFailed(false)
      setFlashMessages('Horário agendado com sucesso!', 'success', 3000)
    }catch(error){
      setSchedulingFailed(true)
      setFlashMessages(error.response.data.message, 'error', 3000)
    }
  }
  const onSubmit =  async (e) =>{
    e.preventDefault()
    try{
      await reserveTime()
      if(!schedulingFailed){
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      }
    }catch(error){
      console.error(error)
    } 
  }
  return (
    <div className={styles.homePage}>
      <div className={styles.homeDetails}>
        <h2>Confira nossos serviços</h2>
      </div>
      <ServiceTable/>
      <div className={styles.selectedTime}>
        <p style={{color: '#551A8B', fontSize: '1.1em'}}>Deseja agendar um horário?</p>
        <p>Selecione abaixo a data desejada para ver os horários disponíveis</p>
        <form onSubmit={(e)=> onSubmit(e)}>
          <CustomSelect options={optionsDates} handleOnChange={(e)=>handleDateChange(e)} placeholder={'Escolha uma data'}/>
          {selectedDate != '' && times.length > 0 ?
          <div className={`${styles.showTimes}`}>
            <p>Horários disponíveis para a data: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedDate} </span></p>
            <CustomSelect options={optionsTimes} handleOnChange={handleTimeChange} placeholder={'Escolha um horário'}/>
            <p>Horário escolhido: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedTime} </span></p>
          </div>
          : <p>Nenhum horário disponível  para a data: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedDate} </span></p>}
          {selectedDate !== '' && selectedTime !== '' && (
          <>
            <p>Perfeito, escolha o serviço desejado abaixo:</p>
            <CustomSelect options={optionsServices} handleOnChange={handleServiceChange} placeholder={'Escolha o nome do serviço'} />
            <p>Serviço escolhido: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedService} </span></p>
          </>
        )}
        <Messages/>
        {selectedService && (
          <InputSubmit value={'Agendar'}/>
        )}
      </form>
      </div>
    </div>
  )
}
