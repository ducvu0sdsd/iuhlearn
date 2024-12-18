'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import ListMonHoc from '@/components/admin/mon-hoc-management/listMonHoc'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const MonHocManagement = () => {
    const [dsMonHoc, setDsMonHoc] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/monhoc/get-all' })
            .then(monhocs => {
                console.log(monhocs)
                setDsMonHoc(monhocs)
            })
    }, [])
    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Môn Học'} />
                <ListMonHoc dsMonHoc={dsMonHoc} />
                <button onClick={() => adminHandler.showCreateMonHocForm()} className='absolute px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Môn Học</button>
            </div>
        </section>
    )
}

export default MonHocManagement