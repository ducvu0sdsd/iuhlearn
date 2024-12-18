'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import XemHocPhan from '@/components/student/dang-ky-hoc-phan/xemHocPhan'
import XemThongTinHocPhan from '@/components/student/dang-ky-hoc-phan/xemThongTinHocPhan'
import { dkhpContext } from '@/context/dkhpContext'
import React, { useContext, useState } from 'react'

const DangKyHocPhan = () => {

    const { dkhpData, dkhpHandler } = useContext(dkhpContext)

    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-full px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/signup.png'} text={'Đăng Ký Học Phần'} />
                <div className='w-full h-screen flex'>
                    <div style={{ marginLeft: `-${(dkhpData.step - 1) * 100}%` }} className='w-[100%] h-screen flex gap-5'>
                        <XemHocPhan />
                        <XemThongTinHocPhan />
                        {/* {dkhpData.step === 1 ?
                        <XemHocPhan />
                        : dkhpData.step === 2 &&
                        
                    } */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DangKyHocPhan