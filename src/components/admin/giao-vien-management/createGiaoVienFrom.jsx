import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateGiaoVienForm = ({ visible }) => {
    const [dsKhoa, setDsKhoa] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [giaoVien, setGiaoVien] = useState(
        {
            hoTen: '',
            ngaySinh: null,
            soDienThoai: '',
            noiSinh: '',
            gioiTinh: null,
            email: '',
            diaChi: '',
            danToc: '',
            maKhoa: ''
        }
    )

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/khoa/get-all' })
            .then(khoa => {
                setDsKhoa(khoa)
            })
    }, [])

    const handleCreateGiaoVien = () => {

        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(giaoVien.hoTen)) {
            globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ")
            return
        }
        if (!giaoVien.ngaySinh || new Date().getFullYear() - new Date(giaoVien.ngaySinh).getFullYear() - (new Date().getMonth() < new Date(giaoVien.ngaySinh).getMonth() || (new Date().getMonth() === new Date(giaoVien.ngaySinh).getMonth() && new Date().getDate() < new Date(giaoVien.ngaySinh).getDate())) < 22) {
            globalHandler.notify(notifyType.WARNING, 'Năm Sinh Phải Trên 22 Tuổi');
            return;
        }

        if (!/^\d{10}$/.test(giaoVien.soDienThoai)) {
            globalHandler.notify(notifyType.WARNING, 'Số Điện Thoại Không Hợp Lệ')
            return
        }

        if (giaoVien.noiSinh === '') {
            globalHandler.notify(notifyType.WARNING, 'Nơi Sinh Không Hợp Lệ')
            return
        }

        if (giaoVien.email === '') {
            globalHandler.notify(notifyType.WARNING, 'Email Không Hợp Lệ')
            return
        }

        if (giaoVien.danToc === '') {
            globalHandler.notify(notifyType.WARNING, 'Dân Tộc Không Hợp Lệ')
            return
        }
        if (giaoVien.gioiTinh === '') {
            globalHandler.notify(notifyType.WARNING, 'Giới Tính Không Hợp Lệ')
            return
        }
        if (giaoVien.diaChi === '') {
            globalHandler.notify(notifyType.WARNING, 'Địa Chỉ Không Hợp Lệ')
            return
        }
        if (giaoVien.maKhoa === '') {
            globalHandler.notify(notifyType.WARNING, 'Khoa Không Hợp Lệ')
            return
        }

        globalHandler.notify(notifyType.LOADING, "Đang Tạo Giáo Viên")
        api({ sendToken: true, type: TypeHTTP.POST, body: giaoVien, path: '/giaovien/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Giáo Viên Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Giáo Viên</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={giaoVien.hoTen} onChange={e => setGiaoVien({ ...giaoVien, hoTen: e.target.value })} placeholder='Họ tên' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={giaoVien.soDienThoai} onChange={e => setGiaoVien({ ...giaoVien, soDienThoai: e.target.value })} placeholder='Số điện thoại' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setGiaoVien({ ...giaoVien, gioiTinh: e.target.value === 'Nam' ? true : false })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Giới tính</option>
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                </select>
                <input value={giaoVien.diaChi} onChange={e => setGiaoVien({ ...giaoVien, diaChi: e.target.value })} placeholder='Địa chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={giaoVien.ngaySinh} onChange={e => setGiaoVien({ ...giaoVien, ngaySinh: e.target.value })} placeholder='Ngày sinh' type="date" className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={giaoVien.noiSinh} onChange={e => setGiaoVien({ ...giaoVien, noiSinh: e.target.value })} placeholder='Nơi sinh' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={giaoVien.email} onChange={e => setGiaoVien({ ...giaoVien, email: e.target.value })} placeholder='Email' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={giaoVien.danToc} onChange={e => setGiaoVien({ ...giaoVien, danToc: e.target.value })} placeholder='Dân tộc' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setGiaoVien({ ...giaoVien, maKhoa: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Khoa Đào Tạo</option>
                    {dsKhoa.map((khoa, index) => (
                        <option value={khoa._id} key={index}>{khoa.tenKhoa}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateGiaoVien()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>
    )
}

export default CreateGiaoVienForm