import { useState } from 'react'
import { Home } from '../pages/Home'
import styles from './CustomSelect.module.css'
import Select from 'react-select'

const customStyles = {
    option: (provided, state) =>({
        ...provided,
        backgroundColor: state.isFocused ? '#551A8B' : 'transparent',
        margin: '0.5em 0em',
        padding: '0.2em',
        fontSize: '1em',
        width: '100%',
        borderRadius: '0.1em',
        color: state.isSelected ? '#fff' : '#fff',
        textAlign: 'center',
    })
}
const CustomSelect = ({options, handleOnChange, placeholder}) => {
    return (
    <Select
        styles={customStyles}
        options={options}
        onChange={handleOnChange}
        menuPlacement='bottom'
        placeholder= {placeholder}
    />
  )
}
export default CustomSelect