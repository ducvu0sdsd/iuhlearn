import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext } from 'react'

const ListHocPhan = ({ dsHocPhan, setCurrentHocPhan, sv = false }) => {
    const { globalHandler } = useContext(globalContext)

    const handleDeleteHocPhan = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Học Phần")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/hocphan/delete/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Học Phần Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-[96%] h-[90%] overflow-y-auto mt-2'>
            <table className="w-[1000px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky w-[100%] top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className='w-[100%]'>
                        <th scope="col" className="px-6 py-3 ">
                            Mã Học Phần
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Môn Học
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Lớp Học
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Tiết Lý Thuyết
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Tiết Thực Hành
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Học Kỳ
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' w-full bg-black'>
                    {dsHocPhan.map((hocphan, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                {hocphan?.maHocPhan}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                {hocphan?.monHoc.tenMon}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                {hocphan?.lop.tenLop}
                            </td>
                            {/* <td scope="row" style={{ color: hocphan?.batBuoc ? "green" : 'black' }} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.batBuoc ? "Bắt Buộc" : "Không Bắt Buộc"}
                            </td>
                            <td scope="row" style={{ color: hocphan?.tienQuyet ? "green" : 'black' }} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.tienQuyet ? "Tiên Quyết" : "Không Tiên Quyết"}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.hocTruoc.map((item, index) => (
                                    <span>{`${index > 0 ? ', ' : ''}${item.tenMon}`}</span>
                                ))}
                            </td>
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.songHanh.map((item, index) => (
                                    <span>{`${index > 0 ? ', ' : ''}${item.tenMon}`}</span>
                                ))}
                            </td> */}
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                {hocphan?.tietLyThuyet.map((item) => `${item.ngay ? `${item.ngay === 1 ? 'Chủ Nhật' : 'Thứ ' + item.ngay} - Tiết (${item.tiet}) - Phòng (${item.phong.tenPhong}) - ${item.giaoVien.tenGiaoVien}` : `Chưa lên lịch - ${item.giaoVien.tenGiaoVien}`}`)}
                            </td>
                            <td scope="row" className=" px-6 py-4 font-medium flex flex-col text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.tietThucHanh.map((item, index) => (
                                    <span key={index}>{`${hocphan?.tietThucHanh.length > 1 ? `Nhóm (${index + 1}) - ` : ''}${item.ngay ? `${item.ngay === 1 ? 'Chủ Nhật' : 'Thứ ' + item.ngay} - Tiết (${item.tiet}) - Phòng (${item.phong.tenPhong}) - ${item.giaoVien.tenGiaoVien}` : `Chưa lên lịch - ${item.giaoVien.tenGiaoVien}`}`}</span>
                                ))}
                            </td>
                            <td scope="row" className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {hocphan?.hocKy.tenHocKy}
                            </td>
                            <td className="px-6 py-4 flex  items-center gap-1">
                                <button onClick={() => setCurrentHocPhan(hocphan)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white w-[140px]'>{sv ? 'Thêm Sinh Viên' : 'Cập nhật phòng'}</button>
                                <button onClick={() => handleDeleteHocPhan(hocphan?._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListHocPhan