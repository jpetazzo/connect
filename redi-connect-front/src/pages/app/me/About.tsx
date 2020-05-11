import React from 'react'
import { Content } from 'react-bulma-components'
import FormTextArea from '../../../components/atoms/FormTextArea'
import FormInput from '../../../components/atoms/FormInput'
import Editable from '../../../components/molecules/Editable'
import { RedProfile } from '../../../types/RedProfile'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/types'

// import {
//   menteeCountCapacityOptions
// } from '../../../config/config'

import {
  profileSaveStart
} from '../../../redux/user/actions'
import * as Yup from 'yup'

import { FormikValues, useFormik } from 'formik'

// do we really need all these type???
export type UserType =
  | 'mentor'
  | 'mentee';

export interface AboutFormValues {
  userType: UserType
  personalDescription: string
  expectations: string
  menteeCountCapacity: number
}

const validationSchema = Yup.object({
  personalDescription: Yup.string()
    .required()
    .min(100)
    .max(600)
    .label('Personal description'),
  menteeCountCapacity: Yup.number().when('userType', {
    is: 'mentor',
    then: Yup.number()
      .required('Please specify the number of mentees you can take on')
      .min(1)
      .max(2)
  })
})
// props: FormikProps<AboutFormValues>
const About = ({ profile, profileSaveStart }: any) => {
  const submitForm = async (
    values: FormikValues
  ) => {
    const profileAbout = values as Partial<RedProfile>
    profileSaveStart({ ...profileAbout, id: profile.id })
  }

  const initialValues: AboutFormValues = {
    userType: profile.userType,
    personalDescription: profile.personalDescription,
    expectations: profile.expectations,
    menteeCountCapacity: profile.menteeCountCapacity
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: submitForm
  })

  const readAbout = () => {
    return <Content>
      <p>{profile.personalDescription}</p>
      <p>{profile.expectations}</p>
      <p>{profile.menteeCountCapacity}</p>
    </Content>
  }

  return (
    <Editable
      title="About me"
      onSave={ () => formik.handleSubmit()}
      savePossible={!(formik.dirty && formik.isValid)}
      read={readAbout()}
    >
      <FormTextArea
        label="Tell us a few words about yourself (this will be displayed on your profile)* (100-600 characters)"
        name="personalDescription"
        rows={4}
        placeholder="About you"
        {...formik}
      />

      <FormTextArea
        label={
          profile.userType === 'mentee'
            ? 'What do you expect from your mentor?'
            : 'Feel free to share expectations towards your mentees (shown on your profile)'
        }
        name="expectations"
        rows={4}
        placeholder="Expectations"
        {...formik}
      />

      {formik.values.userType === 'mentor' && (
        <>
          {/* <FormSelect
            label="How many mentees would you be willing to mentor this semester?"
            name="menteeCountCapacity"
            items={menteeCountCapacityOptions}
            {...formik}
          /> */}
          <FormInput
            name="menteeCountCapacity"
            label="How many mentees would you be willing to mentor this semester?"
            placeholder="1,2 or 3?"
            {...formik}
          />
        </>
      )}
    </Editable>
  )
}

const mapStateToProps = (state: RootState) => ({
  profile: state.user.profile
})

const mapDispatchToProps = (dispatch: any) => ({
  profileSaveStart: (profile: Partial<RedProfile>) => dispatch(profileSaveStart(profile))
})

export default connect(mapStateToProps, mapDispatchToProps)(About)