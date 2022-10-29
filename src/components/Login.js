import React, { useEffect, useRef, useState } from 'react'
import styles from './../styles/login.module.css'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "./../redux/slice"
import { Navigate } from 'react-router-dom';
import decoder from 'jwt-decode'
import background from './../images/background.webp'



 const validateEmail = (email) => {
    return yup.string().email().isValidSync(email)
 };
 
 let phoneRegExp = /^(\+98|0)?9\d{9}$/
 const validatePhone = (phone) => {
    return yup.number().integer().positive().test(
       (phone) => {
         return phoneRegExp.test(phone) ? true : false;
       }
     ).isValidSync(phone);
 };


const formValidationSchema = yup.object().shape({
    email_or_phone: yup.string()
    .required('این فیلد اجباری است.')
    .test('email_or_phone', 'فرمت وارد شده درست نیست.', (value) => {
       return validateEmail(value) || validatePhone(parseInt(value ?? '0'));
    }),
    password: yup.string().min(8, 'رمز عبور باید بیش از 8 کاراکتر داشته باشد.').required('این فیلد اجباری است'),
})


function Login() {

    const handleCallbackResponse = (response) => {
        console.log(response.credential)
        console.log(decoder(response.credential))
        //document.getElementById("signInDiv").hidden = true
        dispatch(setUserAction(decoder(response.credential)))
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "852411391669-jqjtdd5ec7hom9uim0pcba97kr1ru75l.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"), {
            theme: "outline",
            size: "medium",
        }
        )
        //google.accounts.id.prompt()

    }, [])

    const selector = useSelector(state => state.slice)
    const [eye, setEye] = useState(false)
    const dispatch = useDispatch()
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(formValidationSchema)
    })

    if (selector.user.email) {
        return <Navigate to={'/'} />
    }



    const submitFunc = async (data) => {
        try {
            const p = await fetch(`/api/account/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const res = await p.json()
            if (res.token) {
                dispatch(setUserAction(res))
            }
            console.log(res)
        }
        catch (err) {
            console.log(err)
        }
    }



    return (
        <div className={styles.container}>
            <img src={background} alt='background' className={styles.background} />
            <div className={styles.loginBox}>
                <span className={styles.header}>ورود به حساب کاربری</span>
                <form onSubmit={handleSubmit(submitFunc)} noValidate>
                    <div className={styles.fieldSection}>
                        <label htmlFor=''>ایمیل یا شماره همراه</label>
                        <input type='text' className={styles.input} {...register('email_or_phone')} />
                        <p className={styles.errorMessage}>{errors.email_or_phone?.message}</p>
                    </div>
                    <div className={styles.fieldSection}>
                        <label htmlFor=''>کلمه عبور</label>
                        <div className={styles.passwordInputContainer}>
                            <input type={eye ? 'text' : 'password'} className={styles.input} {...register('password')} />

                            {eye ?
                                <div onClick={() => setEye(!eye)} className={styles.eyeContainer}><div className={styles.eyeIcon}><i className="bi bi-eye-fill"></i></div></div>
                                :
                                <div onClick={() => setEye(!eye)} className={styles.eyeContainer}><div className={styles.eyeIcon}><i className="bi bi-eye-slash-fill"></i></div></div>
                            }

                        </div>

                    </div>
                    <p className={styles.errorMessage}>{errors.password?.message}</p>

                    <span className={styles.forgetLink}>فراموشی رمز عبور</span>

                    <div className={styles.buttonsContainer}>
                        <div className={styles.googleSignInContainer}>
                            <div id="signInDiv" className={styles.googleSignInButton}></div>
                            <div className={styles.googleSignInCover}>ورود با گوگل</div>
                        </div>
                        <input type='submit' className={styles.signIn} value='ورود' />
                    </div>

                    <span className={styles.signUp}>شما عضو نیستید. ثبت نام کنید.</span>


                </form>
            </div>
        </div>

    )
}

export default Login