import React, { useState } from 'react'
import classnames from 'classnames'
import { Columns, Heading, Content } from 'react-bulma-components'
import { getRedProfile } from '../../services/auth/auth'
import { RedMatch } from '../../types/RedMatch'
import { Icon } from '../atoms'
import { Avatar } from '../organisms'
import { useHistory } from 'react-router-dom'

import './ApplicationCard.scss'

interface Props {
  application: RedMatch & { createdAt?: string }
}

const STATUS_LABELS: any = {
  applied: 'Pending'
}

const ApplicationCard = ({ application }: Props) => {
  const history = useHistory()
  const profile = getRedProfile()
  const [showDetails, setShowDetails] = useState(false)
  const applicationDate = new Date(application.createdAt || '')
  const applicationUser = profile.userType === 'mentee' ? application.mentor : application.mentee
  const padDate = (date: number) => `${date < 10 && '0'}${date}`

  return (<>
    <div className="application-card">
      <Columns vCentered>
        <Columns.Column
          size={4}
          className="application-card__avatar"
        >
          <Avatar profile={applicationUser} />
          {applicationUser && <span>{applicationUser.firstName} {applicationUser.lastName}</span>}
        </Columns.Column>

        <Columns.Column size={2} responsive={{ mobile: { textAlignment: { value: 'centered' } } }}>
          <span className="application-card__link" onClick={() => history.push(`/app/applications/profile/${applicationUser && applicationUser.id}`)}>Visit Profile</span>
        </Columns.Column>

        <Columns.Column size={3} textAlignment="centered">
          From {`${padDate(applicationDate.getDay())}.${padDate(applicationDate.getMonth())}.${applicationDate.getFullYear()}`}
        </Columns.Column>

        <Columns.Column size={2}
          responsive={{ mobile: { textAlignment: { value: 'centered' } } }}
          textAlignment="right">
          {STATUS_LABELS[application.status]}
        </Columns.Column>

        <Columns.Column size={1} textAlignment="centered">
          <Icon
            icon="chevron"
            size="small"
            className={classnames('application-card-dropdown',
              { 'application-card-dropdown--show': showDetails }
            )}
            onClick={() => setShowDetails(!showDetails)}
          />
        </Columns.Column>
      </Columns>
    </div>

    <div className={classnames('application-card-details',
      { 'application-card-details--show': showDetails })
    }>
      <Heading
        size={6}
        weight="normal"
        renderAs="h3"
        subtitle
        textTransform="uppercase"
      >
        Motivation
      </Heading>
      <Content className="oneandhalf-bs">
        {application.applicationText}
      </Content>

      {application.expectationText && <>
        <Heading
          size={6}
          weight="normal"
          renderAs="h3"
          subtitle
          textTransform="uppercase"
        >
          Expectation
        </Heading>
        <Content>
          {application.expectationText}
        </Content>
      </>
      }
    </div>
  </>
  )
}

export default ApplicationCard
