'use client'
import Header from '@/components/header'
import ListHocKy from '@/components/admin/hoc-ky-management/listHocKy'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const HocKyManagement = () => {
    const [dsHocKy, setDsHocKy] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(hocky => {
                setDsHocKy(hocky)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Học Kỳ'} />
                <ListHocKy dsHocKy={dsHocKy} />
                <button onClick={() => adminHandler.showCreateHocKyForm()} className='absolute px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Khoa Đào Tạo</button>
            </div>
        </section>
    )
}

export default HocKyManagement