import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Spinner = () => {
    const [count, setCount] = useState(5)
    const location = useLocation()
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => --prev)
            count === 0 && window.location.reload()
        })
        return () => {
            clearInterval(interval)
        };
    }, [count]);
    return (
        <>
            <div className='flex flex-col items-center justify-center mt-20 gap-5'>
                <p className='text-black'>Please wait...</p>
                <div className="spinner-border text-dark" role="status">

                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )
    
}

export default Spinner