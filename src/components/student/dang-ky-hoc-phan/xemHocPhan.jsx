'use client'
import { dkhpContext } from '@/context/dkhpContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'
import XemHocPhanDaDangKy from './xemHocPhanDaDangKy'

const XemHocPhan = () => {
    const [dsHocKy, setDsHocKy] = useState([])
    const { globalData, globalHandler } = useContext(globalContext)
    const { dkhpData, dkhpHandler } = useContext(dkhpContext)
    const [maHocKy, setMaHocKy] = useState('')
    const [dsHocPhanDaDangKy, setDsHocPhanDaDangKy] = useState([])
    const [dsMonDaHoc, setDsMonDaHoc] = useState([])
    const [dsHocPhanTheoTenMon, setDsHocPhanTheoTenMon] = useState([])

    useEffect(() => {
        if (maHocKy !== '') {
            api({
                type: TypeHTTP.POST, sendToken: true, path: `/hocphan/get-by-hoc-ky-and-chuyen-nganh`, body: {
                    maHocKy,
                    maChuyenNganh: globalData.student?.lop.chuyenNganh._id
                }
            })
                .then(hocphans => {
                    dkhpHandler.setDsHocPhan(hocphans)
                    const arr = []
                    hocphans.forEach(item => {
                        if (!arr.map(item1 => item1.monHoc._id).includes(item.monHoc._id)) {
                            arr.push(item)
                        }
                    })
                    setDsHocPhanTheoTenMon(arr)
                })
        } else {
            dkhpHandler.setDsHocPhan([])
            setDsHocPhanTheoTenMon([])
        }
    }, [maHocKy])


    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(res => setDsHocKy(res))
        api({ type: TypeHTTP.GET, sendToken: true, port: ports.studyServiceURL, path: `/study/get-thong-tin-hoc-tap-by-mssv/${globalData.student?.mssv}` })
            .then(res => {
                setDsMonDaHoc(res ? res.hocPhanDaHoc : [])
            })
    }, [globalData.student])

    const handleGoToDetail = (hocphan) => {
        dkhpHandler.setDsHocPhanFilter(dkhpData.dsHocPhan.filter(item => item.monHoc._id === hocphan.monHoc._id))
        dkhpHandler.setStep(2)
    }

    return (
        <div className='min-w-[100%] h-screen flex flex-col gap-5 overflow-auto'>
            <div className='flex w-full gap-20'>
                <div className='flex justify-center items-center'>
                    <span className='w-[200px] text-[15px] font-medium'>Học Kỳ Đăng Ký</span>
                    <select onChange={(e) => setMaHocKy(e.target.value)} className='w-full text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value=''>Chọn Học Kỳ</option>
                        {dsHocKy.map((hocky, index) => (
                            <option key={index} value={hocky._id}>{hocky.tenHocKy}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <h3 className='text-[16px] font-medium'>Học Phần Phần Đang Chờ Đăng Ký</h3>
                <div className='w-[100%] max-h-[500px] min-h-[180px] overflow-x-auto'>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 left-0 text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-3 py-3">
                                    Môn Học
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Số Tín Chỉ
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Bắt Buộc
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Tiên Quyết
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Học Trước
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Song Hành
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Các Thao Tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className=' w-full bg-black'>
                            {dsHocPhanTheoTenMon.map((hocphan, index) => (
                                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {hocphan.monHoc.tenMon}
                                    </td>
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {hocphan.monHoc.soTinChi}
                                    </td>
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {hocphan.batBuoc ? <span className='text-[green]'>Bắt Buộc</span> : <span>Không Bắt Buộc</span>}
                                    </td>
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {hocphan.tienQuyet && <span>Tiên Quyết</span>}
                                    </td>
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span > {hocphan.hocTruoc.map((item, index) => item.tenMon)}</span>
                                    </td>
                                    <td scope="row" className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <span > {hocphan.songHanh.map((item, index) => item.tenMon)}</span>
                                    </td>
                                    <td className="px-3 py-4 flex items-center gap-1">
                                        {dsHocKy.filter(item => item._id + "" === maHocKy + "")[0]?.choPhepDangKy === true ?
                                            <button onClick={() => handleGoToDetail(hocphan)} className='px-4 py-1 rounded-md text-[13px] bg-[blue] text-white'>Đăng Ký</button>
                                            :
                                            <></>
                                        }
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            {/* {maHocKy && <XemHocPhanDaDangKy dsHocPhan={dsHocPhanDaDangKy} />} */}
        </div>
    )
}

export default XemHocPhan