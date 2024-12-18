import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import Information from '@/components/student/thong-tin/information'
import Schedule from '@/components/student/thong-tin/schedule'
import React from 'react'

const ThongTinChung = () => {
    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-screen overflow-y-auto px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/student.png'} text={'Thông Tin Giáo Viên'} />
                <Information />
                <Schedule />
            </div>
        </section>
    )
}

export default ThongTinChung