import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { setUserAction } from '../redux/slice'
import { useDispatch } from 'react-redux'

export default function WrapperComponent({ children }) {

    const dispatch = useDispatch()

    useEffect(() => {
        if (Cookies.get('user')) {
            dispatch(setUserAction(JSON.parse(Cookies.get('user'))))
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}
