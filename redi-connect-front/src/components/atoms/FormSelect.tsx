import React from 'react'
import Select from 'react-select'
import _uniqueId from 'lodash/uniqueId'
import { Form } from 'react-bulma-components'

// TODO add typed safe props
function FormSelect (props: any) {
  const {
    name,
    items,
    placeholder,
    label,
    customOnChange,
    values,
    setFieldTouched,
    handleBlur,
    multiselect,
    isSubmitting,
    setFieldValue,
    touched,
    errors,
    disabled
  } = props

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      heihg: '40px',
      padding: '13px',
      color: state.isSelected ? 'black' : '',
      backgroundColor: state.isSelected ? '#dadada' : '',
      '&:hover': {
        color: 'black',
        backgroundColor: '#dadada'
      }
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? '#ea5b29' : '#a0a0a0',
      transform: state.menuIsOpen ? 'rotate(180deg)' : 'none',
      svg: {
        width: '26px',
        height: '26px',
        fill: '#ea5b29'
      }
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#ea5b29' : '#a0a0a0',
      minHeight: '48px',
      boxShadow: 'inset 0 2px 6px rgba(178, 180, 181, 0.3)',
      '&:hover': {
        borderColor: state.isFocused ? '#ea5b29' : '#f6b9a2'
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      color: '#FFB298',
      borderRadius: '4px',
      backgroundColor: '#FFEAE2'
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      fontSize: 'inherit',
      color: '#FF7D55'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontStyle: 'italic',
      color: '#a0a0a0'
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      svg: {
        width: '20px',
        height: '20px'
      }
    })
  }

  const handleOnChangeDefault = (option: any = []) => {
    setFieldValue(
      name,
      multiselect
        ? option ? option.map((item: any) => item.value) : []
        : option.value,
      true
    )
    setFieldTouched(name, true, false)
  }

  const handleOnBlur = (e: any) => {
    e.target.name = name
    handleBlur(e)
  }

  const hasError = !!touched[name] && !!errors[name]
  const handleOnChange = customOnChange || handleOnChangeDefault

  const selectedValues =
    multiselect
      ? values[name].map((selValue: any) => items.filter((availItem: any) => availItem.value === selValue)).flat()
      : items.find((item: any) => item.value === values[name])

  return (
    <Form.Field>
      {label && <Form.Label size="small">
        {label}
      </Form.Label>}
      <Form.Control>
        <Select
          value={selectedValues}
          options={items}
          onChange={handleOnChange}
          placeholder={placeholder}
          onBlur={handleOnBlur}
          isDisabled={isSubmitting || disabled}
          isMulti={multiselect}
          styles={customStyles}
        />
      </Form.Control>
      <Form.Help color="danger" className={hasError ? 'help--show' : ''}>
        {hasError && <>{errors[name]}</>}
      </Form.Help>
    </Form.Field>
  )
}

export default FormSelect
