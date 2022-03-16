import './styles.css'
import {Link} from 'react-router-dom'

export default function Index({name, link, routeName}) {
    return (
        <div className="main-dashboard-header">
            <p>{name}</p>
            {link && routeName ? <Link className="header-link-btn" to={link}>{routeName}</Link>: null}
        </div>
    )
}
