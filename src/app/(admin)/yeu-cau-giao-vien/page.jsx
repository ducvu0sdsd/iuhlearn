'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { api, TypeHTTP } from '@/utils/api'
import { useContext, useEffect, useState } from 'react'

const YeuCauGiaoVien = () => {
    const { adminHandler } = useContext(adminContext)
    const [requests, setRequests] = useState([])
    const [type, setType] = useState('0')

    useEffect(() => {
        api({ type: TypeHTTP.GET, path: '/change-request/get-all', sendToken: true })
            .then(res => {
                setRequests(res)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Các Yêu Cầu Từ Giáo Viên'} />
                <div style={{ transition: '0.5s' }} className='w-full flex h-[95%]'>
                    <div className='w-[100%] flex h-[100%]'>
                        <div className='min-w-[100%] flex flex-col gap-2 h-[100%] pr-[1rem]'>
                            <select value={type} onChange={e => setType(e.target.value)} className='w-[200px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                                <option value='0'>Yêu cầu đang chờ</option>
                                <option value='1'>Yêu cầu đã chấp nhận</option>
                                <option value='2'>Yêu cầu bị từ chối</option>
                            </select>
                            <div className="grid grid-cols-4 w-[100%] gap-2 mt-2">
                                <div
                                    className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
                                    style={{
                                        backgroundImage: "url(/EndlessRiver.jpg)",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <div className="flex items-end gap-2">
                                        <i className="text-[40px] bx bx-calendar-check"></i>
                                        <span className="text-[25px] font-semibold">
                                            {requests.length}
                                        </span>
                                    </div>
                                    <span className="font-medium text-[15px]">
                                        Tất cả yêu cầu
                                    </span>
                                </div>
                                <div
                                    className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
                                    style={{
                                        backgroundImage: "url(/Flare.jpg)",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <div className="flex items-end gap-2">
                                        <i className="text-[40px] bx bx-calendar-check"></i>
                                        <span className="text-[25px] font-semibold">
                                            {requests.filter(item => item.status === 'ACCEPTED').length}
                                        </span>
                                    </div>
                                    <span className="font-medium text-[15px]">
                                        Yêu cầu đã chấp nhận
                                    </span>
                                </div>
                                <div
                                    className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
                                    style={{
                                        backgroundImage: "url(/Quepal.jpg)",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <div className="flex items-end gap-2">
                                        <i className="text-[30px] translate-y-[-5px] fa-regular fa-hourglass"></i>
                                        <span className="text-[25px] font-semibold">
                                            {requests.filter(item => item.status === 'QUEUE').length}
                                        </span>
                                    </div>
                                    <span className="font-medium text-[15px]">
                                        Yêu cầu đang chờ
                                    </span>
                                </div>
                                <div
                                    className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
                                    style={{
                                        backgroundImage: "url(/SinCityRed.jpg)",
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <div className="flex items-end gap-2">
                                        <i className="text-[40px] bx bx-error"></i>
                                        <span className="text-[25px] font-semibold">
                                            {requests.filter(item => item.status === 'REJECTED').length}
                                        </span>
                                    </div>
                                    <span className="font-medium text-[15px]">
                                        Yêu cầu bị từ chối
                                    </span>
                                </div>
                            </div>
                            <div className='w-[100%] flex h-[75%] gap-[2rem]'>
                                <div className='flex flex-col h-[86%] w-[100%] items-center gap-2 overflow-y-auto'>
                                    {requests.filter(item => item.status === (type === '0' ? 'QUEUE' : type === '1' ? 'ACCEPTED' : 'REJECTED')).map((item, index) => (
                                        <div onClick={() => {
                                            if (item.status === 'QUEUE') {
                                                if (item.type === 'DOIPHONG') {
                                                    adminHandler.showYeuCauDoiPhong(item)
                                                } else if (item.type === 'DOITIET') {
                                                    adminHandler.showYeuCauDoiTiet(item)
                                                } else if (item.type === 'HUYTIET') {
                                                    adminHandler.showYeuCauHuyTiet(item)
                                                } else {
                                                    adminHandler.showYeuCauThemTiet(item)
                                                }
                                            }
                                        }} className='w-[98%] bg-[#f0f0f0] transition-all hover:scale-[1.02] px-4 cursor-pointer py-2 gap-1 rounded-md text-[14px] flex flex-col relative' key={index}>
                                            <span>Giáo Viên: <span className='font-semibold'>{item.request.data.giaoVien.tenGiaoVien}</span></span>
                                            <span className='text-[13px]'>{item.request.message}</span>
                                            <div className='absolute right-1 top-1 flex flex-col'>
                                                <span className='text-[12px] px-2 py-1 rounded-lg text-[white] bg-[#999]'>{item.type === 'DOIPHONG' ? 'Đổi phòng' : item.type === 'DOITIET' ? 'Đổi tiết' : item.type === 'THEMTIET' ? 'Thêm tiết' : 'Hủy tiết'}</span>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                        <div className='min-w-[100%] bg-[blue] flex flex-col gap-2 h-[100%]'></div>
                    </div>
                    {/* <ThemSinhVien setCurrentHocPhan={setCurrentHocPhan} setDsHocPhan={setDsHocPhan} setDsHocPhanFilter={setDsHocPhanFilter} currentHocPhan={currentHocPhan} /> */}
                </div>
            </div>
        </section>
    )
}

export default YeuCauGiaoVien