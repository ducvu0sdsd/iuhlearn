import { dkhpContext } from '@/context/dkhpContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'
import XemHocPhanDaDangKy from './xemHocPhanDaDangKy'

const XemThongTinHocPhan = () => {

    const dsLoaiDangKy = {
        1: 'Đăng Ký Mới',
        2: 'Đăng Ký Học Lại',
        3: 'Đăng Ký Học Cải Thiện'
    }
    const [dsHocPhan, setDsHocPhan] = useState([])
    const { dkhpData, dkhpHandler } = useContext(dkhpContext)
    const { globalData, globalHandler } = useContext(globalContext)
    const [loaiDangKy, setLoaiDangKy] = useState(dsLoaiDangKy[1]);

    return (
        <div className='min-w-[100%] h-screen flex flex-col overflow-y-auto gap-4 pr-[240px]'>
            <div className='flex w-full gap-2'>
                <div className='flex flex-col w-[70%]'>
                    <div className='flex items-center gap-[3rem]'>
                        <h3 className='text-[18px] mb-2 font-semibold'>Lớp học phần chờ đăng ký</h3>
                        <div className='flex items-center gap-5 mt-[-3px]'>
                            <div className='flex justify-center gap-1 items-center'>
                                <input
                                    type='radio'
                                    onChange={() => setLoaiDangKy(dsLoaiDangKy[1])}
                                    checked={loaiDangKy === dsLoaiDangKy[1]}
                                    className='h-[15px] w-[15px]'
                                />
                                <span className='text-[14px] font-medium'>Học Mới</span>
                            </div>
                            <div className='flex justify-center gap-1 items-center'>
                                <input
                                    type='radio'
                                    onChange={() => setLoaiDangKy(dsLoaiDangKy[2])}
                                    checked={loaiDangKy === dsLoaiDangKy[2]}
                                    className='h-[15px] w-[15px]'
                                />
                                <span className='text-[14px] font-medium'>Học Lại</span>
                            </div>
                            <div className='flex justify-center gap-1 items-center'>
                                <input
                                    type='radio'
                                    onChange={() => setLoaiDangKy(dsLoaiDangKy[3])}
                                    checked={loaiDangKy === dsLoaiDangKy[3]}
                                    className='h-[15px] w-[15px]'
                                />
                                <span className='text-[14px] font-medium'>Học Cải Thiện</span>
                            </div>
                        </div>
                    </div>
                    <div className='overflow-y-auto max-h-[380px] mt-2'>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        STT
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Thông tin học phần
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center">
                                        Số lượng đăng ký
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=' w-full bg-black'>
                                {dkhpData.dsHocPhanFilter.map((hocphan, index) => (
                                    <tr onClick={() => {
                                        if (hocphan.trangThai === 'Mở Lớp') {
                                            setCurrenHocPhan(hocphan)
                                        } else {
                                            globalHandler.notify(notifyType.FAIL, "Học Phần Này Không Được Phép Đăng Ký")
                                        }
                                    }} key={index} className="hover:bg-[#f3f3f3] transition-all cursor-pointer odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="w-[50px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index + 1}
                                        </td>
                                        <td scope="row" className="px-6 py-4 flex flex-col gap-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <span className='text-[14px] font-semibold'>{hocphan.monHoc.tenMon} - {hocphan.lop.tenLop}</span>
                                            <span className='text-[13px]'>Trạng Thái: {hocphan.trangThai}</span>
                                        </td>
                                        <td scope="row" className="px-6 text-[14px] py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {hocphan.tietLyThuyet[0].siSoHienTai}/{hocphan.tietLyThuyet[0].siSoToiDa}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <div className='transition-all relative overflow-hidden' style={currentHocPhan ? { width: '1000px', padding: '0 8px' } : { width: 0 }}>
                    <button onClick={() => setCurrenHocPhan(undefined)} className='text-[22px] flex items-center justify-center absolute right-5 rounded-full bg-[#e7e7e7] text-[#999] h-[25px] w-[25px] top-1'><i className='bx bx-x'></i></button>
                    <h3 className='text-[16px] mb-4 font-semibold'> Chi Tiết Lớp Học Phần {`(${currentHocPhan?.lop?.tenLop})`}</h3>
                    <div className='overflow-y-auto max-h-[380px] mt-2'>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Trạng Thái: Mở Lớp
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center">
                                        Sỉ Số Tối Đa
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=' w-full bg-black'>
                                <tr style={hocPhanDangKy.nhomLyThuyet?._id === currentHocPhan?.tietLyThuyet[0]?._id ? { backgroundColor: '#f1f1f1' } : {}} onClick={() => { currentHocPhan?.tietLyThuyet[0]?.siSo >= currentHocPhan?.tietLyThuyet[0]?.siSoToiDa ? globalHandler.notify(notifyType.WARNING, "Học Phần Đã Đủ Số Lượng Đăng Ký") : setHocPhanDangKy({ ...hocPhanDangKy, nhomLyThuyet: currentHocPhan?.tietLyThuyet[0] }) }} className="hover:bg-[#f3f3f3] transition-all cursor-pointer odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 flex flex-col gap-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span>Lý Thuyết - Thứ {currentHocPhan?.tietLyThuyet[0]?.ngay} {`(Tiết ${currentHocPhan?.tietLyThuyet[0]?.tiet})`} {`(Phòng ${currentHocPhan?.tietLyThuyet[0]?.phong.tenPhong})`}</span>
                                        <span>Giáo Viên: {currentHocPhan?.tietLyThuyet[0]?.giaoVien?.tenGiaoVien}</span>
                                    </td>
                                    <td scope="row" className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {currentHocPhan?.tietLyThuyet[0]?.siSo}/{currentHocPhan?.tietLyThuyet[0]?.siSoToiDa}
                                    </td>
                                </tr>

                                {currentHocPhan?.tietThucHanh.map((tiet, index) => (
                                    <tr style={hocPhanDangKy.nhomThucHanh?._id === tiet?._id ? { backgroundColor: '#f1f1f1' } : {}} onClick={() => { tiet?.siSo >= tiet?.siSoToiDa ? globalHandler.notify(notifyType.WARNING, "Học Phần Đã Đủ Số Lượng Đăng Ký") : setHocPhanDangKy({ ...hocPhanDangKy, nhomThucHanh: { ...tiet, nhom: index + 1 } }) }} key={index} className="hover:bg-[#f3f3f3] transition-all cursor-pointer odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-4 flex flex-col gap-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <span>Thực Hành - Thứ {tiet?.ngay} {`(Tiết ${tiet?.tiet})`} {`(Phòng ${tiet?.phong.tenPhong})`}</span>
                                            <span>Giáo Viên: {tiet?.giaoVien?.tenGiaoVien}</span>
                                        </td>
                                        <td scope="row" className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {tiet?.siSo}/{tiet?.siSoToiDa}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full flex justify-end mt-3'>
                        <button onClick={() => handleSubmitDangKy()} className='px-6 py-2 rounded-md text-[15px] bg-[blue] font-semibold text-white'>Đăng Ký</button>
                    </div>
                </div> */}
            </div>
            <XemHocPhanDaDangKy dsHocPhan={dkhpData.dsHocPhanDaDangKy} />
        </div>
    )
}

export default XemThongTinHocPhan