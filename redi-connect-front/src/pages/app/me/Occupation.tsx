import React from 'react'
import { Content } from 'react-bulma-components'
import FormSelect from '../../../components/atoms/FormSelect'
import FormInput from '../../../components/atoms/FormInput'
import Editable from '../../../components/molecules/Editable'
import { RedProfile } from '../../../types/RedProfile'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/types'

import {
  educationLevels,
  menteeOccupationCategories
} from '../../../config/config'

import {
  profileSaveStart
} from '../../../redux/user/actions'
import * as Yup from 'yup'

import { FormikValues, useFormik } from 'formik'

// do we really need all these type???
export type UserType =
  | 'mentor'
  | 'mentee'
  | 'public-sign-up-mentor-pending-review'
  | 'public-sign-up-mentee-pending-review'
  | 'public-sign-up-mentor-rejected'
  | 'public-sign-up-mentee-rejected';

export interface OccupationFormValues {
  userType: UserType
  mentor_occupation: string
  mentor_workPlace: string
  mentee_highestEducationLevel: string
  mentee_occupationCategoryId: string
  mentee_occupationJob_placeOfEmployment: string
  mentee_occupationJob_position: string
  mentee_occupationStudent_studyPlace: string
  mentee_occupationStudent_studyName: string
  mentee_occupationLookingForJob_what: string
  mentee_occupationOther_description: string
}

const validationSchema = Yup.object({
  mentor_occupation: Yup.string().when('userType', {
    is: 'mentor',
    then: Yup.string()
      .required()
      .max(255)
      .label('Occupation')
  }),
  mentor_workPlace: Yup.string()
    .max(255)
    .label('Work place'),
  mentee_highestEducationLevel: Yup.string()
    .oneOf(educationLevels.map(level => level.id))
    .label('Highest Education Level'),
  mentee_occupationCategoryId: Yup.string().when('userType', {
    is: 'mentee',
    then: Yup.string()
      .required()
      .oneOf(menteeOccupationCategories.map(v => v.id))
      .label('Current occupation')
  }),
  mentee_occupationJob_placeOfEmployment: Yup.string()
    .max(255)
    .label('Where are you employed'),
  mentee_occupationJob_position: Yup.string()
    .max(255)
    .label('At what university do you study'),
  mentee_occupationStudent_studyPlace: Yup.string()
    .max(255)
    .label('Where do you study'),
  mentee_occupationStudent_studyName: Yup.string()
    .max(255)
    .label('What do you study'),
  mentee_occupationLookingForJob_what: Yup.string()
    .max(255)
    .label('What kind of job'),
  mentee_occupationOther_description: Yup.string()
    .max(255)
    .label('What are you currently doing')
})

// props: FormikProps<AboutFormValues>
const Occupation = ({ profile, profileSaveStart }: any) => {
  const submitForm = async (
    values: FormikValues
  ) => {
    const education = values as Partial<RedProfile>
    profileSaveStart({ ...education, id: profile.id })
  }

  const initialValues: OccupationFormValues = {
    userType: profile.userType,
    mentor_occupation: profile.mentor_occupation,
    mentor_workPlace: profile.mentor_workPlace,
    mentee_highestEducationLevel: profile.mentee_highestEducationLevel,
    mentee_occupationCategoryId: profile.mentee_occupationCategoryId,
    mentee_occupationJob_placeOfEmployment: profile.mentee_occupationJob_placeOfEmployment,
    mentee_occupationJob_position: profile.mentee_occupationJob_position,
    mentee_occupationStudent_studyPlace: profile.mentee_occupationStudent_studyPlace,
    mentee_occupationStudent_studyName: profile.mentee_occupationStudent_studyName,
    mentee_occupationLookingForJob_what: profile.mentee_occupationLookingForJob_what,
    mentee_occupationOther_description: profile.mentee_occupationOther_description
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: submitForm
  })

  const {
    mentee_occupationCategoryId,
    userType
  } = formik.values

  const readOccupation = () => {
    return <Content>
      {userType === 'mentor' && (
        <>
          <p>{profile.mentor_occupation}</p>
          <p>{profile.mentor_workPlace}</p>
        </>
      )}
      {userType === 'mentee' && (
        <>
          <p>{menteeOccupationCategories.filter(level => level.id === profile.mentee_occupationCategoryId).map(course => course.label)}</p>
          {mentee_occupationCategoryId === 'job' && (
            <>
              <p>{profile.mentee_occupationJob_placeOfEmployment}</p>
              <p>{profile.mentee_occupationJob_position}</p>
            </>
          )}
          {mentee_occupationCategoryId === 'student' && (
            <>
              <p>{profile.mentee_occupationStudent_studyPlace}</p>
              <p>{profile.mentee_occupationStudent_studyName}</p>
            </>
          )}
          {mentee_occupationCategoryId === 'lookingForJob' && (
            <>
              <p>{profile.mentee_occupationLookingForJob_what}</p>
            </>
          )}
          {mentee_occupationCategoryId === 'other' && (
            <>
              <p>{profile.mentee_occupationOther_description}</p>
            </>
          )}
          <p>{educationLevels.filter(level => level.id === profile.mentee_highestEducationLevel).map(course => course.label)}</p>
        </>
      )}

    </Content>
  }

  return (
    <Editable
      title="Occupation"
      onSave={() => formik.handleSubmit()}
      savePossible={!(formik.dirty && formik.isValid)}
      read={readOccupation()}
    >
      {userType === 'mentor' && (
        <>
          <FormInput
            name="mentor_occupation"
            label="What is your job title?"
            placeholder="Your job"
            {...formik}
          />
          <FormInput
            name="mentor_workPlace"
            label="Which company are you working for?"
            placeholder="Company"
            {...formik}
          />
        </>
      )}

      {userType === 'mentee' && (
        <>
          <FormSelect
            label="What is your highest Education Level?"
            name="mentee_highestEducationLevel"
            items={educationLevels}
            {...formik}
          />
          <FormSelect
            label="What is your current occupation?"
            name="mentee_occupationCategoryId"
            items={menteeOccupationCategories}
            {...formik}
          />
          {mentee_occupationCategoryId === 'job' && (
            <>
              <FormInput
                name="mentee_occupationJob_placeOfEmployment"
                label="Where are you employed?"
                placeholder="Company"
                {...formik}
              />
              <FormInput
                name="mentee_occupationJob_position"
                label="What is your position?"
                placeholder="Job position"
                {...formik}
              />
            </>
          )}
          {mentee_occupationCategoryId === 'student' && (
            <>
              <FormInput
                name="mentee_occupationStudent_studyPlace"
                label="At what university do you study?"
                placeholder="University"
                {...formik}
              />
              <FormInput
                name="mentee_occupationStudent_studyName"
                label="What do you study?"
                placeholder="Study"
                {...formik}
              />
            </>
          )}
          {mentee_occupationCategoryId === 'lookingForJob' &&
            <FormInput
              name="mentee_occupationLookingForJob_what"
              label="What kind of job?"
              placeholder="Dreamjob..."
              {...formik}
            />
          }
          {mentee_occupationCategoryId === 'other' && (
            <>
              <FormInput
                name="mentee_occupationOther_description"
                label="What are you currently doing?"
                placeholder="Whats up?"
                {...formik}
              />
            </>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Occupation)