import React from 'react'
import './styles.css'

export default function Index({ status }) {
    if (status === 1) {
        return (
            <div className="tableStatus" style={{ background:'green'}}>Low</div>
        )
    }
    if (status === 2) {
        return (
            <div className="tableStatus" style={{ background:'#22d3e5'}}>Medium</div>
        )
    }
    return (
        <div className="tableStatus" style={{ background:'red'}}>High</div>
    )
}
