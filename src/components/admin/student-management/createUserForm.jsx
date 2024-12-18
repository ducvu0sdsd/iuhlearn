import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateUserForm = ({ visible }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [dsLop, setDsLop] = useState([])
    const [sinhVien, setSinhVien] = useState({
        hoTen: '',
        ngaySinh: null,
        noiSinh: '',
        gioiTinh: null,
        email: '',
        diaChi: '',
        danToc: '',
        soDienThoai: '',
        maLop: ''
    })

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/lop/get-all' })
            .then(lop => {
                setDsLop(lop)
            })
    }, [])

    const handleCreateSinhVien = () => {

        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(sinhVien.hoTen)) {
            globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ")
            return
        }

        if (!/^\d{10}$/.test(sinhVien.soDienThoai)) {
            globalHandler.notify(notifyType.WARNING, 'Số Điện Thoại Không Hợp Lệ')
            return
        }

        if (sinhVien.gioiTinh === '') {
            globalHandler.notify(notifyType.WARNING, 'Giới Tính Không Hợp Lệ')
            return
        }

        if (sinhVien.diaChi === '') {
            globalHandler.notify(notifyType.WARNING, 'Địa Chỉ Không Hợp Lệ')
            return
        }

        if (!sinhVien.ngaySinh || new Date().getFullYear() - new Date(sinhVien.ngaySinh).getFullYear() - (new Date().getMonth() < new Date(sinhVien.ngaySinh).getMonth() || (new Date().getMonth() === new Date(sinhVien.ngaySinh).getMonth() && new Date().getDate() < new Date(sinhVien.ngaySinh).getDate())) < 18) {
            globalHandler.notify(notifyType.WARNING, 'Năm Sinh Phải Trên 18 Tuổi');
            return;
        }

        if (sinhVien.noiSinh === '') {
            globalHandler.notify(notifyType.WARNING, 'Nơi Sinh Không Hợp Lệ')
            return
        }

        if (sinhVien.email === '') {
            globalHandler.notify(notifyType.WARNING, 'Email Không Hợp Lệ')
            return
        }

        if (sinhVien.danToc === '') {
            globalHandler.notify(notifyType.WARNING, 'Dân Tộc Không Hợp Lệ')
            return
        }

        if (sinhVien.maLop === '') {
            globalHandler.notify(notifyType.WARNING, 'Lớp Không Hợp Lệ')
            return
        }

        globalHandler.notify(notifyType.LOADING, "Đang Tạo Sinh Viên")
        api({ sendToken: true, type: TypeHTTP.POST, body: sinhVien, path: '/sinhvien/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Sinh Viên Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Sinh Viên</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={sinhVien.hoTen} onChange={e => setSinhVien({ ...sinhVien, hoTen: e.target.value })} placeholder='Họ tên' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={sinhVien.soDienThoai} onChange={e => setSinhVien({ ...sinhVien, soDienThoai: e.target.value })} placeholder='Số điện thoại' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setSinhVien({ ...sinhVien, gioiTinh: e.target.value === "" ? "" : e.target.value === 'Nam' ? true : false })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Giới tính</option>
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                </select>
                <input value={sinhVien.diaChi} onChange={e => setSinhVien({ ...sinhVien, diaChi: e.target.value })} placeholder='Địa chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={sinhVien.ngaySinh} onChange={e => setSinhVien({ ...sinhVien, ngaySinh: e.target.value })} placeholder='Ngày sinh' type="date" className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={sinhVien.noiSinh} onChange={e => setSinhVien({ ...sinhVien, noiSinh: e.target.value })} placeholder='Nơi sinh' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={sinhVien.email} onChange={e => setSinhVien({ ...sinhVien, email: e.target.value })} placeholder='Email' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={sinhVien.danToc} onChange={e => setSinhVien({ ...sinhVien, danToc: e.target.value })} placeholder='Dân tộc' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setSinhVien({ ...sinhVien, maLop: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Lớp</option>
                    {dsLop.map((lop, index) => (
                        <option value={lop._id} key={index}>{lop.tenLop}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateSinhVien()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>
    )
}

export default CreateUserForm