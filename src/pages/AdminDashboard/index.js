import './styles.css'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useTable, useSortBy, useRowSelect } from 'react-table'
import InnerDashboardLayout from '../../layouts/InnerDashboardLayout'
import DashboardCounter from '../../components/DashboardCounter'
import DashboardHeader from '../../components/DashboardHeader'
import TableStatus from '../../components/TableStatus'
import TablePriority from '../../components/TablePriority'
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";
import Pagination from 'react-bootstrap/Pagination'
import useLoader from '../../hooks/useLoader'
import useToast from '../../hooks/useToast'
import useErrorStatus from '../../hooks/useErrorStatus'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FaRegEye } from "react-icons/fa";

export default function Index() {

  const [loader, showLoader, hideLoader] = useLoader();
  const [successToast, errorToast] = useToast();
  const axiosPrivate = useAxiosPrivate();
  const errorStatus = useErrorStatus();

  const [tableData, setTableData] = useState([])
  const [tablePaginationData, setTablePaginationData] = useState({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  })
  const [statusData, setStatusData] = useState([])


  const data = useMemo(
    () => tableData,
    [tableData]
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Ticket No',
        accessor: 'ticket no', // accessor is the "key" in the data
      },
      {
        Header: 'Title',
        accessor: 'title', // accessor is the "key" in the data
        sortType: 'alphanumeric'
      },
      {
        Header: 'Email',
        accessor: 'email', // accessor is the "key" in the data
        sortType: 'alphanumeric'
      },
      {
        Header: 'Issue',
        accessor: 'type', // accessor is the "key" in the data
        sortType: 'alphanumeric'
      },
      {
        Header: 'Status',
        accessor: 'status',
        sortType: 'alphanumeric'
      },
      {
        Header: 'Priority',
        accessor: 'priority',
        sortType: 'alphanumeric'
      },
      {
        Header: 'Action',
        accessor: 'id',
      },
    ],
    []
  )

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    let isMounted = true;

    isMounted && getTicketData();
    return () => isMounted = false;
  }, [])

  const getTicketData = useCallback(async (pg = 0) => {
    showLoader()
    try {
      const response = await axiosPrivate.get(`/ticket/admin/view?page=${pg}`);
      // console.log(response.data.data.tickets)
      hideLoader()
      setTableData(response.data.data.tickets)
      setTablePaginationData({
        currentPage: response.data.data.currentPage,
        totalItems: response.data.data.totalItems,
        totalPages: response.data.data.totalPages
      })
    } catch (error) {
      hideLoader()
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        errorStatus()
      }
      console.log(error)
    }
  }, [])

  const deleteDialog = (ticketId) => {
    confirmAlert({
      title: `Delete Ticket ${ticketId}`,
      message: 'Are you sure to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteTicketData(ticketId)
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const deleteTicketData = useCallback(async (id) => {
    showLoader()
    try {
      const response = await axiosPrivate.delete(`/ticket/admin/delete/${id}`);
      // console.log(response.data.message)
      hideLoader()
      getTicketData(tablePaginationData.currentPage)
      getStatusData()
      successToast(response.data.message)
    } catch (error) {
      hideLoader()
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        errorStatus()
      }
      if (error?.response?.data?.message) {
        errorToast(error?.response?.data?.message)
      }
      if (error?.response?.data?.errors?.id) {
        errorToast(error?.response?.data?.errors?.id?.msg)
      }
      console.log(error)
    }
  }, [])

  const deleteSelectedDialog = () => {
    confirmAlert({
      title: `Delete The Selected Ticket ?`,
      message: 'Are you sure to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteSelectedTicketData()
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const deleteSelectedTicketData = async () => {
    const selectedIds = await selectedFlatRows?.map(item => item?.original?.id)

    showLoader()
    try {
      const response = await axiosPrivate.post(`/ticket/admin/delete-multiple`, { ids: selectedIds });
      // console.log(response.data.message)
      hideLoader()
      getTicketData(tablePaginationData.currentPage)
      getStatusData()
      successToast(response.data.message)
    } catch (error) {
      hideLoader()
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        errorStatus()
      }
      if (error?.response?.data?.message) {
        errorToast(error?.response?.data?.message)
      }
      if (error?.response?.data?.errors?.ids) {
        errorToast(error?.response?.data?.errors?.ids?.msg)
      }
      console.log(error)
    }
  }

  useEffect(() => {
    let isMounted = true;

    isMounted && getStatusData();
    return () => isMounted = false;
  }, [])

  const getStatusData = useCallback(async () => {
    showLoader()
    try {
      const response = await axiosPrivate.get(`/ticket/admin/get-status-counter`);
      // console.log(response.data)
      hideLoader()
      setStatusData(response.data.data)
    } catch (error) {
      hideLoader()
      if (error?.response?.status === 403 || error?.response?.status === 401) {
        errorStatus()
      }
      console.log(error)
    }
  }, [])




  return (

    <InnerDashboardLayout>
      <DashboardHeader name="Dashboard" />
      {statusData?.length > 0 && (
        <div className="main-dashboard-counters">
          <div className="main-dashboard-counters-row">
            {statusData.map((item, index) => {
              return (
                <DashboardCounter name={item.name} total={item.value} color={item.color} key={index} />
              )
            })}
          </div>
        </div>)}
      <div className="main-dashboard-table-data">
        {selectedFlatRows?.length > 0 && (<div className="my-3">
          <button className="btn btn-danger" onClick={deleteSelectedDialog} >Delete</button>
        </div>)}
        <table {...getTableProps()} className="table table-bordered table-striped table-hover" >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  if (index === 0) {
                    return (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}

                      >
                        {column.render('Header')}
                      </th>
                    )
                  }
                  return (<th
                    {...column.getHeaderProps(column.getSortByToggleProps())}

                  >
                    {column.render('Header')}
                    <span>
                      {column.isSortedDesc
                        ? <IoMdArrowDropdown style={{ fontSize: '22px', marginLeft: '5px' }} />
                        : <IoMdArrowDropup style={{ fontSize: '22px', marginLeft: '5px' }} />}
                    </span>
                  </th>)
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, i) => {
                    if ((cell?.column?.Header) === 'Ticket No') {
                      return (
                        <td
                          {...cell.getCellProps()}

                        >
                          {cell?.row?.values?.id}
                        </td>
                      )
                    }
                    if ((cell?.column?.Header) === 'Issue') {
                      if(cell?.row?.values?.type === 1){
                        return (
                          <td
                            {...cell.getCellProps()}
  
                          >
                            Billing Issue
                          </td>
                        )
                      }else if(cell?.row?.values?.type === 2){
                        return (
                          <td
                            {...cell.getCellProps()}
  
                          >
                            Course Access Issue
                          </td>
                        )
                      }else if(cell?.row?.values?.type === 3){
                        return (
                          <td
                            {...cell.getCellProps()}
  
                          >
                            Website Issue
                          </td>
                        )
                      }
                     
                    }
                    if ((cell?.column?.Header) === 'Status') {
                      return (
                        <td
                          {...cell.getCellProps()}

                        >
                          <TableStatus status={cell?.row?.values?.status} />
                        </td>
                      )
                    }
                    if ((cell?.column?.Header) === 'Priority') {
                      return (
                        <td
                          {...cell.getCellProps()}

                        >
                          <TablePriority status={cell?.row?.values?.priority} />
                        </td>
                      )
                    }
                    if ((cell?.column?.Header) === 'Action') {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{ verticalAlign: 'middle' }}
                        >
                          <Link to={`/admin/view-ticket/${cell?.row?.values?.id}`} className="viewBtn"><FaRegEye /></Link>
                          <Link to={`/admin/edit-ticket/${cell?.row?.values?.id}`} className="editBtn"><AiOutlineEdit /></Link>
                          <button className="deleteBtn" onClick={() => deleteDialog(cell?.row?.values?.id)}><AiFillDelete /></button>
                        </td>
                      )
                    }
                    return (
                      <td
                        {...cell.getCellProps()}

                      >
                        {/* {cell.render('Header')} */}
                        {/* {console.log(cell?.column?.Header==='Status')} */}
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ textAlign: 'center' }}>
          <Pagination style={{ justifyContent: 'center' }}>
            <Pagination.First onClick={() => { getTicketData(tablePaginationData.currentPage - 1) }} disabled={tablePaginationData.totalPages === 0 || tablePaginationData.currentPage === 0} />
            <Pagination.Item active>{tablePaginationData.currentPage + 1}</Pagination.Item>
            <Pagination.Last onClick={() => { getTicketData(tablePaginationData.currentPage + 1) }} disabled={tablePaginationData.totalPages === 0 || tablePaginationData.currentPage === tablePaginationData.totalPages - 1} />
          </Pagination>
        </div>
      </div>
      {loader}
    </InnerDashboardLayout>

  )
}
