import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { chuyen_doi_tien_VND, convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const XemHocPhanDaDangKy = ({ dsHocPhan }) => {

    const { globalData, globalHandler } = useContext(globalContext)

    const handleDeleteHocPhanDangKy = (hocphan) => {
        globalHandler.notify(notifyType.LOADING, "Đang Hủy Học Phần Đăng Ký")
        api({ sendToken: true, type: TypeHTTP.DELETE, port: ports.dkhpServiceURL, path: `/dkhp/${hocphan._id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Hủy Học Phần Đăng Ký Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <>
            {dsHocPhan.length > 0 &&
                <div className='flex flex-col gap-2'>
                    <h3 className='text-[16px] font-medium'>Học Phần Đã Đăng Ký</h3>
                    <div className='w-full max-h-[500px] min-h-[180px]'>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sticky top-0 left-0 text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        STT
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Mã Học Phần
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Môn Học
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Số Tín Chỉ
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Nhóm Thực Hành
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Học Phí
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Đã Thu Phí
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Trạng Thái Đăng Ký
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">
                                        Ngày Đăng Ký
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-[12px]">

                                    </th>
                                </tr>
                            </thead>
                            <tbody className=' w-full bg-black'>
                                {dsHocPhan.map((hocphan, index) => (
                                    <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {/* {hocphan._id} */}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {hocphan.monHoc.tenMon}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {hocphan.monHoc.soTinChi}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-mediumx text-gray-900 whitespace-nowrap dark:text-white">
                                            {hocphan.nhomThucHanh?.nhom}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {chuyen_doi_tien_VND(hocphan.monHoc.soTinChi * hocphan.lop.heDaoTao.giaTien)}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <button className='h-[20px] w-[20px] rounded-full bg-[red] text-[white]'><i className='bx bx-x'></i></button>
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {hocphan.loaiDangKy}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {/* {convertISODateToString(hocphan.createdAt)} */}
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <span onClick={() => handleDeleteHocPhanDangKy(hocphan)} className='hover:underline cursor-pointer'>Hủy</span>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    )
}

export default XemHocPhanDaDangKy