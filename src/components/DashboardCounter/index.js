import './styles.css'

const index = ({name,total,color}) => {
    return (
        <div className="main-dashboard-counters-col">
            <div className="main-dashboard-counters-col-details">
                <p className="name">{name}</p>
                <p className="total" style={{color}}>{total}</p>
            </div>
            <div className="main-dashboard-counters-col-bar">
                <div className="main-dashboard-counters-col-bar-inner" style={{backgroundColor:color}}></div>
            </div>
        </div>
    )
}

export default index;
