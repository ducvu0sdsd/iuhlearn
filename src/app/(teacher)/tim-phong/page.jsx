'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import Information from '@/components/student/thong-tin/information'
import Schedule from '@/components/student/thong-tin/schedule'
import TimPhongGiaoVien from '@/components/student/tim-phong/TimPhongGiaoVien'
import TimPhongSinhVien from '@/components/student/tim-phong/TimPhongSinhVien'
import { globalContext } from '@/context/globalContext'
import React, { useContext } from 'react'

const TimPhong = () => {
    const { globalData } = useContext(globalContext)
    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-screen px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/student.png'} text={'Tìm Phòng'} />
                {globalData.student && (
                    <TimPhongSinhVien />
                )}
                {globalData.teacher && (
                    <TimPhongGiaoVien />
                )}
            </div>
        </section>
    )
}

export default TimPhong