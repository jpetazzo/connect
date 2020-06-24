import React, { useEffect, useState } from 'react'
// import intersection from 'lodash/intersection'
import { Columns, Tag } from 'react-bulma-components'
import { Heading, Icon } from '../../../../components/atoms'
import { FilterDropdown } from '../../../../components/molecules'
import { ProfileCard } from '../../../../components/organisms'
import { useLoading } from '../../../../hooks/WithLoading'
import { getMentors } from '../../../../services/api/api'
import { RedProfile } from '../../../../types/RedProfile'
import { getRedProfile } from '../../../../services/auth/auth'
import { useList } from '../../../../hooks/useList'
import classNames from 'classnames'
import {
  profileSaveStart
} from '../../../../redux/user/actions'
import { connect } from 'react-redux'
import { RootState } from '../../../../redux/types'

import { categoriesIdToLabelMap, categories } from '../../../../config/config'
import './AvailableMentorListing.scss'

const filterCategories = categories.map(category => ({ value: category.id, label: category.label }))

// type MentorCatCount = RedProfile & { categoryMatchCount: number, languageMatchCount: number };

// const addMatchCount = (
//   mentors: RedProfile[],
//   categories: string[],
//   languages: string[]
// ): MentorCatCount[] =>
//   mentors.map(mentor =>
//     Object.assign(mentor, {
//       categoryMatchCount: intersection(categories, mentor.categories).length,
//       languageMatchCount: intersection(languages, mentor.languages).length
//     })
//   )

interface FilterTagProps {
  id: string
  label: string
  onClickHandler: (item: string) => void
}

const FilterTag = ({ id, label, onClickHandler }: FilterTagProps) => (
  <Tag
    size="medium"
    rounded
    textWeight="bold"
  >
    {label}
    <Icon icon="cancel" onClick={() => {
      onClickHandler(id)
    }} className="active-filters__remove" />
  </Tag>
)

const mapStateToProps = (state: RootState) => ({
  profile: state.user.profile
})

const mapDispatchToProps = (dispatch: any) => ({
  profileSaveStart: (profile: Partial<RedProfile>) => dispatch(profileSaveStart(profile))
})

export const AvailableMentorListing = connect(mapStateToProps, mapDispatchToProps)(({ profile, profileSaveStart }: any) => {
  const { Loading, isLoading, setLoading } = useLoading()
  const [showFavorites, setShowFavorites] = useState<boolean>(false)
  const [mentors, setMentors] = useState<RedProfile[]>([])
  const currentUserCategories = getRedProfile().categories
  const currentUserFavorites = getRedProfile().favouritedRedProfileIds

  const [activeCategories, { toggle: toggleCategories, clear: clearCategories }] = useList(currentUserCategories)
  const [activeLanguages, { toggle: toggleLanguages, clear: clearLanguages }] = useList<any>([])
  const [favorites, { toggle: toggleFavorites }] = useList<any>(currentUserFavorites)

  const { id } = profile
  // const mentorsFiltered = _mentors.filter(
  //   m => m.currentFreeMenteeSpots > 0 && m.userActivated
  // )

  // const mentorsWhoHaveSpotsButAreNotActivatedCount = _mentors.filter(
  //   m => m.userActivated === false && m.currentFreeMenteeSpots > 0
  // ).length

  // const mentors = addMatchCount(mentorsFiltered, activeCategories, activeLanguages)

  // const mentorsWithSharedCategories = mentors
  //   .filter(m => m.categoryMatchCount > 0)
  //   .sort((a, b) => b.categoryMatchCount - a.categoryMatchCount)

  // const mentorsWithoutSharedCategories = mentors.filter(
  //   m => m.categoryMatchCount === 0 && m.languageMatchCount === 0
  // )

  // const filterCategories = Array.from(
  //   new Set(
  //     mentors
  //       .map(mentor => mentor.categories || [])
  //       .flat()
  //       .sort()
  //   )
  // ).map(categorie => ({
  //   value: categorie,
  //   label: categoriesIdToLabelMap[categorie]
  // }))

  const filterLanguages = Array.from(
    new Set(
      mentors
        .map(mentor => mentor.languages || [])
        .flat()
        .sort()
    )
  ).map(language => ({
    value: language,
    label: language
  }))

  useEffect(() => {
    setLoading(true)
    getMentors({ categories: activeCategories, languages: activeLanguages }).then(mentors => {
      setMentors(mentors)
      setLoading(false)
    })
  }, [activeCategories, activeLanguages])

  useEffect(() => {
    setLoading(true)
    profileSaveStart({ favouritedRedProfileIds: favorites, id })
    setLoading(false)
  }, [favorites])

  useEffect(() => {
    setLoading(true)
    getMentors({ categories: currentUserCategories }).then(mentors => {
      setMentors(mentors)
      setLoading(false)
    })
  }, [setLoading])

  return (
    <>
      <Loading />
      <Heading subtitle size="small" className="oneandhalf-bs">Available mentors ({mentors.length})</Heading>
      <div className="filters">
        <FilterDropdown
          items={filterCategories}
          className="filters__dropdown"
          label="Topics"
          selected={activeCategories}
          onChange={toggleCategories}
        />
        <FilterDropdown
          items={filterLanguages}
          className="filters__dropdown"
          label="Languages"
          selected={activeLanguages}
          onChange={toggleLanguages}
        />
        <div
          className="filter-favourites"
          onClick={() => setShowFavorites(!showFavorites)}>
          <Icon icon={showFavorites ? 'heartFilled' : 'heart'} className="filter-favourites__icon" space="right"/>
              Only Favorites
        </div>
      </div>

      {(activeCategories.length !== 0 || activeLanguages.length !== 0) && <div className="active-filters">
        <Tag.Group>
          {activeCategories.map(catId =>
            <FilterTag
              key={catId}
              id={catId}
              label={categoriesIdToLabelMap[catId]}
              onClickHandler={toggleCategories}/>
          )}
          {activeLanguages.map(langId =>
            <FilterTag key={langId} id={langId} label={langId} onClickHandler={toggleLanguages}/>
          )}
          <span
            className="active-filters__clear-all"
            onClick={() => {
              clearCategories()
              clearLanguages()
            }}
          >
            Delete all filters <Icon icon="cancel" size="small" space="left"/>
          </span>
        </Tag.Group>
      </div>}

      {/* {mentors.length === 0 &&
        mentorsWhoHaveSpotsButAreNotActivatedCount > 0 && (
        <h4>
            We have {mentorsWhoHaveSpotsButAreNotActivatedCount} available
            mentors. Unfortunately, they have not activated their profiles yet.
            Please check in again later.
        </h4>
      )} */}
      {/* {!isLoading &&
        mentorsWhoHaveSpotsButAreNotActivatedCount === 0 &&
        mentors.length === 0 && (
        <h4>
            Unfortunately there are no available mentors right now. We are
            constantly recruiting new mentors, so please check back in later.
        </h4>
      )} */}

      <Columns>
        {mentors.map((mentor: RedProfile) => {
          const isFavorite = favorites.includes(mentor.id)

          if (!isFavorite && showFavorites) return

          return <Columns.Column size={4} key={mentor.id}>
            <ProfileCard
              profile={mentor}
              toggleFavorite={toggleFavorites}
              isFavorite={isFavorite}
            />
          </Columns.Column>
        })}

        {mentors.length === 0 && <Columns.Column size={4}>
          <>No mentors found</>
        </Columns.Column>}
      </Columns>

      {/* {mentorsWithoutSharedCategories.length > 0 && (
        <>
          <Heading subtitle size="small" className="oneandhalf-bs">All available mentors</Heading>

          <Columns>
            {mentorsWithoutSharedCategories.map((mentor: RedProfile) => (
              <Columns.Column size={4} key={mentor.id}>
                <ProfileCard
                  profile={mentor}
                />
              </Columns.Column>
            ))}
          </Columns>
        </>
      )} */}
    </>
  )
})
