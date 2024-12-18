'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import ListSinhVien from '@/components/admin/student-management/listSinhVien'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const StudentManagement = () => {
    const [dsSinhVien, setDsSinhVien] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/sinhvien/get-all' })
            .then(sinhviens => {
                setDsSinhVien(sinhviens)
            })
    }, [])
    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pr-[200px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Sinh Viên'} />
                <ListSinhVien dsSinhVien={dsSinhVien} />
                <button onClick={() => adminHandler.showCreateUserForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Sinh Viên</button>
            </div>
        </section>
    )
}

export default StudentManagement