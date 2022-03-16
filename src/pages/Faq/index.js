import './styles.css'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Accordion from 'react-bootstrap/Accordion';

export default function Index() {

  const [loader, showLoader, hideLoader] = useLoader();
  const [successToast, errorToast] = useToast();
  const axiosPrivate = useAxiosPrivate();


  return (

    <InnerDashboardLayout>
      <DashboardHeader name="Frequently Asked Questions" link="/create-ticket" routeName="Create New Ticket" />
      <div className="main-dashboard-table-data">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Accordion Item #1</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Accordion Item #2</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {loader}
    </InnerDashboardLayout>

  )
}
