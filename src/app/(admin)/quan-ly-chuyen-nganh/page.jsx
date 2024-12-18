'use client'
import ListUser from '@/components/admin/chuyen-nganh-management/listUser'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const ChuyenNganhManagement = () => {
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/chuyennganh/get-all' })
            .then(chuyenNganhs => {
                setDsChuyenNganh(chuyenNganhs)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Chuyên Ngành'} />
                <ListUser dsChuyenNganh={dsChuyenNganh} />
                <button onClick={() => adminHandler.showCreateChuyenNganhForm()} className='absolute px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+Thêm Chuyên Ngành</button>
            </div>
        </section>
    )
}

export default ChuyenNganhManagement