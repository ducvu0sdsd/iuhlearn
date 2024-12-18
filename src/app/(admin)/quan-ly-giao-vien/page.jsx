'use client'
import ListGiaoVien from '@/components/admin/giao-vien-management/listGiaoVien'
import Schedule from '@/components/admin/giao-vien-management/schedule'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const GiaoVienManagement = () => {
    const [dsGiaoVien, setDsGiaoVien] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)
    const [currentTeacher, setCurrentTeacher] = useState()

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/giaovien/get-all' })
            .then(giaovien => {
                setDsGiaoVien(giaovien)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative flex'>
                <div style={{ transition: '0.5s', marginLeft: currentTeacher ? '-100%' : 0 }} className='w-[100%] h-full flex'>
                    <div className='pl-[20px] pr-[250px] pb-[10px] min-w-[100%] h-full flex flex-col gap-3 overflow-auto'>
                        <Header image={'/calendar.png'} text={'Quản Lý Giáo Viên'} />
                        <ListGiaoVien dsGiaoVien={dsGiaoVien} setCurrentTeacher={setCurrentTeacher} />
                        {!currentTeacher && (
                            <button onClick={() => adminHandler.showCreateGiaoVienForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Giáo Viên</button>
                        )}
                    </div>
                    <div className='pt-[1rem] min-w-[100%] px-[1rem] h-full flex flex-col gap-3 overflow-auto'>
                        <div onClick={() => setCurrentTeacher()} className='flex items-center cursor-pointer'>
                            <i className='text-[25px] bx bx-chevron-left'></i>
                            <span className='text-[14px]'>Trở về</span>
                        </div>
                        <div className='w-[100%] overflow-x-auto flex '>
                            <Schedule teacher={currentTeacher} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GiaoVienManagement