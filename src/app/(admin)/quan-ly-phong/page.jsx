'use client'
import ListPhong from '@/components/admin/phong-management/listPhong'
import XemLichPhong from '@/components/admin/phong-management/XemLichPhong'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const PhongManagement = () => {
    const [dsPhong, setDsPhong] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)
    const [currentPhong, setCurrentPhong] = useState()
    const [toas, setToas] = useState([])
    const [toa, setToa] = useState('')
    const [loaiPhong, setLoaiPhong] = useState('')
    const [dsPhongFilter, setDsPhongFilter] = useState([])

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' })
            .then(phongs => {
                setDsPhong(phongs)
                setDsPhongFilter(phongs)
                const arr = []
                phongs.forEach(item => {
                    if (!arr.includes(item.toa)) {
                        arr.push(item.toa)
                    }
                })
                setToas(arr)
            })
    }, [])

    useEffect(() => {
        if (toa === '' && loaiPhong === '') {
            setDsPhongFilter(dsPhong)
        } else {
            let arr = JSON.parse(JSON.stringify(dsPhong))
            if (toa !== '') {
                arr = arr.filter(item => item.toa === toa)
            }
            if (loaiPhong !== '') {
                arr = arr.filter(item => item.loai === loaiPhong)
            }
            setDsPhongFilter(arr)
        }
    }, [toa, loaiPhong])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pr-[200px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Phòng'} />
                <div style={{ marginLeft: `-${currentPhong ? 100 : 0}%`, transition: '0.5s' }} className='w-full flex h-[95%]'>
                    <div className='w-full flex h-[100%]'>
                        <div className='min-w-[100%] flex flex-col gap-2 h-[100%]'>
                            <div className='w-full flex items-center gap-2'>
                                <select value={toa} onChange={e => setToa(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                    <option value=''>Tất Cả Tòa</option>
                                    {toas.map((toa, index) => (
                                        <option value={toa} key={index}>{toa}</option>
                                    ))}
                                </select>
                                <select value={loaiPhong} onChange={e => setLoaiPhong(e.target.value)} className='w-[200px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                    <option value=''>Tất Cả Loại Phòng</option>
                                    <option value='LT'>Lý Thuyết</option>
                                    <option value='HT'>Thực Hành</option>
                                </select>
                            </div>
                            <ListPhong dsPhong={dsPhongFilter} setCurrentPhong={setCurrentPhong} />
                        </div>
                        <XemLichPhong currentPhong={currentPhong} setCurrentPhong={setCurrentPhong} />
                    </div>
                </div>
                <button onClick={() => adminHandler.showCreatePhongForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Phòng Học</button>
            </div>
        </section>
    )
}

export default PhongManagement