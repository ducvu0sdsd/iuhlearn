'use client'
import Header from '@/components/header'
import ListHocKy from '@/components/admin/hoc-ky-management/listHocKy'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'
import ListHeDaoTao from '@/components/admin/he-dao-tao-management/listHeDaoTao'

const HeDaoTaoManagement = () => {
    const [dsHeDaoTao, setDsHeDaoTao] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hedaotao/get-all' })
            .then(dsHeDaoTao => {
                setDsHeDaoTao(dsHeDaoTao)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Hệ Đào Tạo'} />
                <ListHeDaoTao dsHeDaoTao={dsHeDaoTao} />
                <button onClick={() => adminHandler.showCreateHeDaoTaoForm()} className='absolute px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Hệ Đào Tạo</button>
            </div>
        </section>
    )
}

export default HeDaoTaoManagement