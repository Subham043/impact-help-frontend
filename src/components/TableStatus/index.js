import React from 'react'
import './styles.css'

export default function Index({ status }) {
    if (status === 1) {
        return (
            <div className="tableStatus" style={{ background:'rgb(229, 40, 95)'}}>Pending</div>
        )
    }
    if (status === 2) {
        return (
            <div className="tableStatus" style={{ background:'rgb(89, 89, 247)'}}>In Progress</div>
        )
    }
    if (status === 3) {
        return (
            <div className="tableStatus" style={{ background:'rgb(208 89 247)'}}>Pending From Client</div>
        )
    }
    return (
        <div className="tableStatus" style={{ background:'rgb(14, 224, 78)'}}>Completed</div>
    )
}
