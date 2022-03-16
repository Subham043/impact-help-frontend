import React, {useState} from 'react'
import Loader from '../../components/Loader'

export default function Index() {

    const [loading, setLoading] = useState(false)
    return [
        loading ? <Loader /> : null,
        () => setLoading(true),
        () => setLoading(false),
    ]
}
