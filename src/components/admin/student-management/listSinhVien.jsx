import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import React, { useContext } from 'react'

const ListSinhVien = ({ dsSinhVien }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)
    const handleDeleteSinhVien = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Sinh Viên")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/sinhvien/delete/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Sinh Viên Thành Công")
                globalHandler.reload()
            })
    }
    return (
        <div className='w-[96%] h-[90%] overflow-y-auto mt-2'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            MSSV
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Họ và tên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ngày sinh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Số Điện Thoại
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nơi sinh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giới tính
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Địa chỉ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Dân tộc
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lớp
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' w-full bg-black'>
                    {dsSinhVien.map((sinhvien, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.mssv}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.hoTen}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{convertISODateToString(sinhvien.ngaySinh)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.soDienThoai}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.noiSinh}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.gioiTinh === true ? "Nam" : "Nữ"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.diaChi}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.danToc}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sinhvien.lop.tenLop}</td>
                            <td className="px-6 py-4 flex items-center gap-1">
                                <button onClick={() => handleDeleteSinhVien(sinhvien._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListSinhVien