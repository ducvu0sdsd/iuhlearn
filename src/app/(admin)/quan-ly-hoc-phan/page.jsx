'use client'
import Header from '@/components/header'
import ListHocPhan from '@/components/admin/hoc-phan-management/listHocPhan'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'
import { dkhpContext } from '@/context/dkhpContext'
import ThemPhong from '@/components/admin/hoc-phan-management/ThemPhong'

const HocPhanManagement = () => {
    const [dsHocPhan, setDsHocPhan] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)
    const { dkhpHandler } = useContext(dkhpContext)
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const [maHocKy, setMaHocKy] = useState('')
    const [maChuyenNganh, setMaChuyenNganh] = useState('')
    const [maHeDaoTao, setMaHeDaoTao] = useState('')
    const [dsHeDaoTao, setDsHeDaoTao] = useState([])
    const [dsHocPhanFilter, setDsHocPhanFilter] = useState([])
    const [currentHocPhan, setCurrentHocPhan] = useState()

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocphan/get-all' })
            .then(hocphans => {
                setDsHocPhan(hocphans)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(hocky => {
                setDsHocKy(hocky)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/chuyennganh/get-all' })
            .then(chuyenNganhs => {
                setDsChuyenNganh(chuyenNganhs)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hedaotao/get-all' })
            .then(dsHeDaoTao => {
                setDsHeDaoTao(dsHeDaoTao)
            })
    }, [])

    useEffect(() => {
        let hocphans = JSON.parse(JSON.stringify(dsHocPhan))
        if (maChuyenNganh !== '') {
            hocphans = hocphans.filter(item => item.lop.chuyenNganh._id === maChuyenNganh)
        }
        if (maHeDaoTao !== '') {
            hocphans = hocphans.filter(item => item.lop.heDaoTao._id === maHeDaoTao)
        }
        if (maHocKy !== '') {
            hocphans = hocphans.filter(item => item.hocKy._id === maHocKy)
        }
        setDsHocPhanFilter(hocphans)
    }, [maChuyenNganh, maHeDaoTao, maHocKy])


    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pr-[200px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={currentHocPhan ? 'Thêm Phòng Học' : 'Danh Sách Học Phần'} />
                <div style={{ marginLeft: `-${currentHocPhan ? 100 : 0}%`, transition: '0.5s' }} className='w-full flex h-[95%]'>
                    <div className='w-full flex h-[100%]'>
                        <div className='min-w-[100%] flex flex-col gap-2 h-[100%]'>
                            <div className='w-full flex items-center gap-2'>
                                <select value={maHocKy} onChange={e => setMaHocKy(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                    <option value=''>Học Kỳ</option>
                                    {dsHocKy.map((hocKy, index) => (
                                        <option value={hocKy._id} key={index}>{hocKy.tenHocKy}</option>
                                    ))}
                                </select>
                                <select value={maChuyenNganh} onChange={e => setMaChuyenNganh(e.target.value)} className='w-[200px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                    <option value=''>Chuyên Ngành</option>
                                    {dsChuyenNganh.map((chuyenNganh, index) => (
                                        <option value={chuyenNganh._id} key={index}>{chuyenNganh.tenChuyenNganh}</option>
                                    ))}
                                </select>
                                <select value={maHeDaoTao} onChange={e => setMaHeDaoTao(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                    <option value=''>Hệ Đào Tạo</option>
                                    {dsHeDaoTao.map((heDT, index) => (
                                        <option key={index} value={heDT._id}>{heDT.tenHeDaoTao}</option>
                                    ))}
                                </select>
                            </div>
                            <ListHocPhan setCurrentHocPhan={setCurrentHocPhan} dsHocPhan={dsHocPhanFilter} />
                        </div>
                    </div>
                    <ThemPhong setCurrentHocPhan={setCurrentHocPhan} setDsHocPhan={setDsHocPhan} setDsHocPhanFilter={setDsHocPhanFilter} currentHocPhan={currentHocPhan} />
                </div>
                <button onClick={() => adminHandler.showCreateHocPhanForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Học Phần</button>
            </div>
        </section>
    )
}

export default HocPhanManagement