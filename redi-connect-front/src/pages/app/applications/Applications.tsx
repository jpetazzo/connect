import React, { useEffect } from 'react'
import { Element } from 'react-bulma-components'
import Heading from '../../../components/atoms/Heading'
import LoggedIn from '../../../components/templates/LoggedIn'
import { RootState } from '../../../redux/types'
import { getApplicants } from '../../../redux/matches/selectors'
import { connect } from 'react-redux'
import { matchesFetchStart } from '../../../redux/matches/actions'
import { FullScreenCircle } from '../../../hooks/WithLoading'
import { RedMatch } from '../../../types/RedMatch'
import { ApplicationCard } from './ApplicationCard'

interface Props {
  loading: boolean
  applicants: RedMatch[]
  matchesFetchStart: Function
}

// TODO: add type to Props
function Applications ({ loading, applicants, matchesFetchStart }: Props) {
  useEffect(() => {
    matchesFetchStart()
  }, [matchesFetchStart])

  return (
    <LoggedIn>
      <FullScreenCircle loading={loading} />
      {applicants.length === 0 && <>
        <Element>
            Currently you have no applicants.
        </Element>
        <Element>
            We will send you email when students apply for the mentorship.
        </Element>
      </>}
      {applicants.length > 0 && <>
        <Heading size="small">Application list</Heading>
        { applicants.map((application: RedMatch) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </>}
    </LoggedIn>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  matchesFetchStart: () => dispatch(matchesFetchStart())
})

const mapStateToProps = (state: RootState) => ({
  loading: state.matches.loading,
  applicants: getApplicants(state.matches)
})

export default connect(mapStateToProps, mapDispatchToProps)(Applications)
