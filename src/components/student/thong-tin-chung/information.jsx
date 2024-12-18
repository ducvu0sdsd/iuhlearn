"use client"
import { globalContext } from '@/context/globalContext'
import { convertISODateToString } from '@/utils/others'
import React, { useContext, useEffect, useState } from 'react'

const Information = () => {

    const { globalData } = useContext(globalContext)
    const [student, setStudent] = useState()

    useEffect(() => setStudent(globalData.student), [globalData.student])
    console.log(student)

    return (
        <div className='border-[1px] rounded-lg px-[20px] py-[10px]'>
            <h3 className='font-medium'>Thông Tin Sinh Viên</h3>
            <div className='flex items-center justify-start w-full my-[1.5rem]'>
                <div className='relative'>
                    <img src={student?.avatar ? student?.avatar : '/user.png'} className='w-[130px] rounded-full' />
                    <i className='cursor-pointer bx bx-pencil text-[#999] text-[20px] absolute top-0 right-[-10px]'></i>
                </div>
                <div className='flex flex-col gap-2 ml-[4rem]'>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">MSSV:</label>
                        <span className='text-[14px]'>{student?.mssv}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Họ tên:</label>
                        <span className='text-[14px]'>{student?.hoTen}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Giới tính:</label>
                        <span className='text-[14px]'>{student?.gioiTinh ? "Nam" : "Nữ"}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Ngày sinh:</label>
                        <span className='text-[14px]'>{student?.ngaySinh && convertISODateToString(student?.ngaySinh)}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[100px] font-semibold text-[14px]">Nơi sinh:</label>
                        <span className='text-[14px]'>{student?.noiSinh}</span>
                    </div>
                </div>

                <div className='flex flex-col gap-2 ml-[5rem]'>
                    <div className='flex'>
                        <label className="w-[140px] font-semibold text-[14px]">Lớp học:</label>
                        <span className='text-[14px]'>{student?.lop?.tenLop}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[140px] font-semibold text-[14px]">Khóa học:</label>
                        <span className='text-[14px]'>{`${new Date().getFullYear()} - ${new Date().getFullYear() + 4}`}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[140px] font-semibold text-[14px]">Loại hình đào tạo:</label>
                        <span className='text-[14px]'>Đại Học</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[140px] font-semibold text-[14px]">Bậc đào tạo:</label>
                        <span className='text-[14px]'>{student?.lop.heDaoTao.tenHeDaoTao}</span>
                    </div>
                    <div className='flex'>
                        <label className="w-[140px] font-semibold text-[14px]">Ngành:</label>
                        <span className='text-[14px]'>{student?.lop.chuyenNganh.tenChuyenNganh}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Information