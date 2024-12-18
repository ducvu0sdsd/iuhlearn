"use client"
import { globalContext } from '@/context/globalContext'
import { convertISODateToString } from '@/utils/others'
import React, { useContext, useEffect, useState } from 'react'

const Information = () => {

    const { globalData } = useContext(globalContext)
    const [teacher, setTeacher] = useState()

    useEffect(() => setTeacher(globalData.teacher), [globalData.teacher])

    return (
        <div className='border-[1px] rounded-lg px-[20px] py-[10px]'>
            <h3 className='font-medium'>Thông Tin Giáo Viên</h3>
            <div className='flex items-center justify-start w-full my-[1.5rem]'>
                <div className='relative'>
                    <img src={teacher?.avatar ? teacher?.avatar : '/user.png'} className='w-[130px] rounded-full' />
                    <i className='cursor-pointer bx bx-pencil text-[#999] text-[20px] absolute top-0 right-[-10px]'></i>
                </div>
                <div className='flex flex-col gap-2 ml-[4rem]'>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Họ tên:</label>
                        <span className='text-[14px]'>{teacher?.hoTen}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Số điện thoại:</label>
                        <span className='text-[14px]'>{teacher?.soDienThoai}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Giới tính:</label>
                        <span className='text-[14px]'>{teacher?.gioiTinh ? "Nam" : "Nữ"}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Ngày sinh:</label>
                        <span className='text-[14px]'>{teacher?.ngaySinh && convertISODateToString(teacher?.ngaySinh)}</span>
                    </div>
                </div>

                <div className='flex flex-col gap-2 ml-[5rem]'>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Khoa:</label>
                        <span className='text-[14px]'>{teacher?.khoa?.tenKhoa}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Dân tộc:</label>
                        <span className='text-[14px]'>{teacher?.danToc}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Địa chỉ:</label>
                        <span className='text-[14px]'>{teacher?.diaChi}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Nơi sinh:</label>
                        <span className='text-[14px]'>{teacher?.noiSinh}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Information