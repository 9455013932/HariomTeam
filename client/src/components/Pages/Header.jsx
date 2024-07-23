import React, { useEffect, useRef, useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import SideNavBar from './SideNavBar';

function Header() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [showNav, setShowNav] = useState(false);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('not logged in');
    const sideNavRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        updateTime(); // Initial update
        const interval = setInterval(updateTime, 1000); // Update time every second
        return () => clearInterval(interval); // Clean up interval
    }, []);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                if (userData.role) {

                    setRole(userData.role);
                    setUserId(userData.userid);
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                sideNavRef.current &&
                !sideNavRef.current.contains(event.target) &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowNav(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setShowNav(!showNav);
    };

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        setDate(dateString);
        setTime(`${hours}:${minutes}:${seconds}`);
    }

    return (
        <div>
            <header className="flex justify-between items-center px-6 py-10">
                <div ref={menuRef}>
                    <span className="text-white"><RxHamburgerMenu onClick={handleMenuClick} /></span>
                </div>
                <div className="text-center text-white">
                    <span className="font-bold text-lg">{role}</span> <br />
                    <span className="text-lg">User ID: {userId}</span>
                </div>
                <div className="text-right text-white">
                    <span className="text-lg">{date}</span><br />
                    <span className="text-lg">{time}</span>
                </div>
            </header>
            <div ref={sideNavRef}>
                <SideNavBar show={showNav} />
            </div>
        </div>
    );
}

export default Header;
