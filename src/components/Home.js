import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './../styles/home.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setUserAction } from '../redux/slice'
import Cookies from 'js-cookie'


export default function Home() {

  const selector = useSelector(state => state.slice)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setUserAction({}))
    Cookies.remove('user')
  }

  return (
    <div className={styles.container}>
      {selector.user.email ?
        (
          <div className={styles.logoutButton} onClick={handleLogout}>
            log out
          </div>
        ) :
        (
          <NavLink to='/login' className={styles.navLink}><span>login page</span></NavLink>
        )
      }
    </div>
  )
}

