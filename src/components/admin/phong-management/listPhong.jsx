import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const ListPhong = ({ dsPhong, setCurrentPhong }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)

    const handleDeletePhong = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Phòng")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/phong/delete/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Phòng Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-[96%] h-[90%] overflow-y-auto mt-2'>
            <table className="w-[1000px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky w-[1000px] top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-[20%]">
                            Tên Phòng
                        </th>
                        <th scope="col" className="px-6 py-3 w-[10%]">
                            Tòa
                        </th>
                        <th scope="col" className="px-6 py-3 w-[10%]">
                            Tầng
                        </th>
                        <th scope="col" className="px-6 py-3 w-[20%]">
                            Loại Phòng
                        </th>
                        <th scope="col" className="px-6 py-3 w-[20%]">
                            Sỉ Số
                        </th>
                        <th scope="col" className="px-6 py-3 w-[40%]">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' w-full bg-black'>
                    {dsPhong.map((phong, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {phong.tenPhong}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {phong.toa}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {phong.tang}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {phong.loai === 'LT' ? 'Lý Thuyết' : 'Thực hành'}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {phong.siSo}
                            </td>
                            <td className="px-4 py-4 flex items-center gap-1">
                                <button onClick={() => setCurrentPhong(phong)} className='px-4 py-1 rounded-md text-[14px] bg-[#1abc9c] text-white w-[100px]'>Xem Lịch</button>
                                <button onClick={() => adminHandler.showUpdatePhong(phong)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white'>Sửa</button>
                                <button onClick={() => handleDeletePhong(phong._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListPhong