'use client'
import Header from '@/components/header'
import ListUser from '@/components/admin/khoa-management/listUser'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const KhoaManagement = () => {
    const [dsKhoa, setDsKhoa] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/khoa/get-all' })
            .then(khoa => {
                setDsKhoa(khoa)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Khoa'} />
                <ListUser dsKhoa={dsKhoa} />
                <button onClick={() => adminHandler.showCreateKhoaForm()} className='absolute px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Khoa Đào Tạo</button>
            </div>
        </section>
    )
}

export default KhoaManagement