import { useEffect, useState } from 'react'
import { ServiceTable } from '../ServiceTable/ServiceTable'
import styles from './Home.module.css'
import api from '../../helpers/axios'
import {format} from 'date-fns'

export const Home = () => {
  const [dates, setDates] = useState([])
  const [times, setTimes] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [formattedDate, setFormattedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const scrollDown = ()=>{
    window.scrollTo({
      top: window.scrollY + window.innerHeight, 
      behavior: 'smooth', 
    })
  }
  useEffect(() => {
    const selectTimes = document.getElementById('timesSelect');
    const selectDates = document.getElementById('datesSelect');

    const handleSelectFocus= () => {
      scrollDown()
    };

    if (selectTimes) {
      selectTimes.addEventListener('focus', handleSelectFocus);
    }
    if(selectDates){
      selectDates.addEventListener('focus', handleSelectFocus);
    }

    return () => {
      if (selectTimes) {
        selectTimes.removeEventListener('focus', handleSelectFocus);
      }
      if(selectDates){
        selectDates.removeEventListener('focus', handleSelectFocus);
      }
    };
  }, []);

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
  const handleDateChange = async (e)=>{
    const date = e.target.value
    setSelectedDate(date)
    const [day, month, year] = date.split('-')
    const formattedDate = `${year}-${month}-${day}`
    setFormattedDate(formattedDate)
  } 
  const handleTimeChange = async (e)=>{
    const time = e.target.value
    setSelectedTime(time)
    console.log(selectedTime)
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
        {<select className={styles.selectDates} name="datesSelect" id="datesSelect" onChange={handleDateChange}>
        <option value={''}>Escolha uma data</option>
          {dates.map((date, key)=>(
            <option key={key} value={date.date}>{date.date}</option>
          ))}
        </select>}
        {selectedDate != '' && times.length > 0 ?
        <div className={`${styles.showTimes}`}>
          <p>Horários disponíveis para a data: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedDate} </span></p>
          <select name="timesSelect" id="timesSelect" className={`${styles.selectTimes} ${styles.custom_dropdown}`} onChange={handleTimeChange}>
            <option value={''}>Escolha um horário</option>
            {times.map((time, key)=>(
              <option key={key} value={time.time}>{time.time}</option>
            ))}
          </select>
          <p>Horário escolhido: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedTime} </span></p>
        </div>
        : <p>Nenhum horário disponível  para a data: <span style={{color: '#551A8B', fontSize: '1.2em'}}> {selectedDate} </span></p>}
      </div>
    </div>
  )
}
