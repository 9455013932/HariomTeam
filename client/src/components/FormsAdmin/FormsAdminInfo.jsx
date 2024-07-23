import React, { useState, useEffect } from 'react';
import { MdOutlinePlaylistAddCheck } from 'react-icons/md';
import { FaUserPlus } from 'react-icons/fa';

const FormsAdminInfo = () => {
    const [FAInfo, setFAInfo] = useState({ totalIncomingForms: 0, totalOutgoingForms: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v1/formsAdmin/formsAdminInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch IncomingForms details');
                }

                const data = await response.json();
   
                if (!data) {
                    throw new Error('Empty or invalid IncomingForms details data');
                }

                setFAInfo(data);
            } catch (error) {
                console.error('Error fetching IncomingForms data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="gap-4 lg:flex">
            <div className='gap-4 sm:flex my-2'>
                <div className='h-24 lg:w-[20vw] w-full bg-sky-600 flex my-1 box1 hover:bg-sky-700 hover:transition-transform hover:transform-gpu'>
                    <div className='h-full w-36 bg-sky-800 flex items-center justify-center'>
                        <MdOutlinePlaylistAddCheck className='text-6xl text-white' />
                    </div>
                    <div className='h-24 w-full flex items-start justify-center text-white flex-col px-3'>
                        <p>TOTAL INCOMING</p>
                        <span className='text-2xl'>{FAInfo.totalIncomingForms}</span>
                    </div>
                </div>

                <div className='h-24 lg:w-[20vw] w-full bg-red-500 flex my-1 box hover:bg-red-600 hover:transition-transform hover:transform-gpu'>
                    <div className='h-full w-36 bg-red-700 flex items-center justify-center'>
                        <MdOutlinePlaylistAddCheck className='text-6xl text-white' />
                    </div>
                    <div className='h-24 w-full flex items-start justify-center text-white flex-col px-3'>
                        <p>TOTAL OUTGOING</p>
                        <span className='text-2xl'>{FAInfo.totalOutgoingForms}</span>
                    </div>
                </div>
            </div>

            <div className='gap-4 sm:flex my-2'>
                <div className='h-24 lg:w-[20vw] w-full bg-yellow-600 flex my-1 box hover:bg-yellow-500 hover:transition-transform hover:transform-gpu'>
                    <div className='h-full w-36 bg-yellow-700 flex items-center justify-center'>
                        <FaUserPlus className='text-5xl text-white' />
                    </div>
                    <div className='h-24 w-full flex items-start justify-center text-white flex-col px-3'>
                        <p>REF. OUTGOING</p>
                        <span className='text-2xl'>-</span>
                    </div>
                </div>

                <div className='h-24 lg:w-[20vw] w-full bg-green-500 flex my-1 box hover:bg-green-600 hover:transition-transform hover:transform-gpu'>
                    <div className='h-full w-36 bg-green-700 flex items-center justify-center'>
                        <MdOutlinePlaylistAddCheck className='text-6xl text-white' />
                    </div>
                    <div className='h-24 w-full flex items-start justify-center text-white flex-col px-3'>
                        <p>REF. INCOMING</p>
                        <span className='text-2xl'>-</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormsAdminInfo;
