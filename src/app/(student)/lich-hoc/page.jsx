import Schedule from '@/components/student/lich-hoc/schedule'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import React from 'react'

const AcademicCalendar = () => {
    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-screen px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Lịch Học Tập'} />
                <Schedule />
            </div>
        </section>
    )
}

export default AcademicCalendar