import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { isDateGreater, returnNumber } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormYeuCauDoiPhong = ({ data, hidden }) => {

    const [message, setMessage] = useState('')
    const { globalHandler } = useContext(globalContext)
    const [step, setStep] = useState(0)
    const [phongs, setPhongs] = useState([])
    const [phongSelected, setPhongSelected] = useState()
    const [dsThoiGianPhongDaDangKy, setDsThoiGianPhongDaDangKy] = useState([])
    const handleSubmit = () => {
        if (isDateGreater(`${data.request.data.date.year}-${returnNumber(data.request.data.date.month)}-${returnNumber(data.request.data.date.day)}`, new Date().toISOString()) === false) {
            globalHandler.notify(notifyType.WARNING, 'Không thể đổi phòng đã qua thời gian hiện tại')
            return
        }
        if (!phongSelected) {
            globalHandler.notify(notifyType.WARNING, 'Vui lòng chọn phòng cần chuyển')
            return
        }
        const body = {
            ...data, status: 'ACCEPTED', response: {
                message: `Đã chuyển từ phòng ${data.request.data.phong.tenPhong} sang phòng ${phongSelected.tenPhong} vào ngày ${data.request.data.date.day}/${data.request.data.date.month}/${data.request.data.date.year}`,
                data: {
                    ...data.request.data, phong: {
                        ...phongSelected,
                        maPhong: phongSelected._id,
                        loai: data.request.data.phong.loaiPhong
                    },
                    newDate: data.request.data.date
                }
            }
        }
        // api({ type: TypeHTTP.PUT, path: `/change-request/update/${data._id}`, sendToken: true, body })
        //     .then(res => {
        //         setTimeout(() => {
        //             globalThis.window.location.reload()
        //         }, 2000);
        //         hidden()
        //         globalHandler.notify(notifyType.SUCCESS, 'Đã chuyển phòng theo yêu cầu của giáo viên')
        //     })
    }

    const handleReject = () => {
        if (message === '') {
            globalHandler.notify(notifyType.WARNING, 'Vui lòng nhập lý do từ chối yêu cầu')
            return
        }
        const body = {
            ...data, status: 'REJECTED', response: {
                message
            }
        }
        api({ type: TypeHTTP.PUT, path: `/change-request/update/${data._id}`, sendToken: true, body })
            .then(res => {
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 2000);
                hidden()
                globalHandler.notify(notifyType.SUCCESS, 'Đã từ chối yêu cầu từ giáo viên')
            })
    }

    useEffect(() => {
        if (data) {
            api({ type: TypeHTTP.POST, sendToken: true, body: { maHocKy: data.request.data.hocKy._id }, path: '/hocphan/get-by-hoc-ky' })
                .then(res => {
                    const arr = res.map(item => [item.tietLyThuyet[0], ...item.tietThucHanh]).flat().filter(item => item.phong.maPhong !== '')
                    const filter = arr.filter(item => (item.ngay === data.request.data.ngay && item.tiet === data.request.data.tiet))
                    setDsThoiGianPhongDaDangKy(filter)
                })
            api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' })
                .then(phongs => {
                    setPhongs(phongs)
                })
        }
    }, [data])

    return (
        <div style={{ width: data ? '500px' : 0, height: data ? '290px' : 0, transition: '0.5s' }} className='flex flex-col items-center fixed overflow-hidden left-[50%] z-50 top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[white] rounded-lg'>
            {data && (<>
                <div className='w-full h-full flex'>
                    <div style={{ transition: '0.5s', marginLeft: `-${step * 100}%` }} className='w-[100%] flex'>
                        <div className='min-w-[100%] p-4 flex flex-col items-center justify-start gap-1'>
                            <span className='w-full text-[15px] font-semibold'>Yêu Cầu Đổi Phòng</span>
                            <div className='w-full gap-[1rem] flex mt-1'>
                                <div className='w-[50%] flex flex-col text-[14px]'>
                                    <span>Giáo Viên: <span className='font-semibold'>{data.request.data.giaoVien.tenGiaoVien}</span></span>
                                    <span className='text-[13px]'>{data.request.message}</span>
                                </div>
                                <div className='w-[50%] flex flex-col text-[14px]'>
                                    <span className='font-semibold'>Thông tin tiết học</span>
                                    <span className='text-[13px] px-2'>{data.request.data.tenMon}</span>
                                    <span className='text-[13px] px-2'>{data.request.data.ngay === 1 ? 'Chủ nhật' : `Thứ ${data.request.data.ngay}`} ({data.request.data.date.day}-{data.request.data.date.month}-{data.request.data.date.year})</span>
                                    <span className='text-[13px] px-2'>Phòng {data.request.data.phong.tenPhong} - Tiết {data.request.data.tiet}</span>
                                </div>
                            </div>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder='Vui lòng điền lý do khiến bạn từ chối yêu cầu (nếu từ chối)' className='border-[1px] px-2 py-2 text-[13px] border-[#dcdcdc] h-[100px] mt-1 focus:outline-0 w-[100%] rounded-lg' />
                            <div className='w-full flex justify-end items-center gap-1 text-[12px] mt-2'>
                                <button onClick={() => hidden()} className='bg-[#999] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Hủy</button>
                                <button onClick={() => handleReject()} className='bg-[red] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Từ chối</button>
                                <button onClick={() => setStep(1)} className='bg-[#4ec782] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Chuyển phòng</button>
                            </div>
                        </div>
                        <div className='min-w-[100%] p-4 flex flex-col items-center justify-start gap-1'>
                            <span className='w-full text-[15px] font-semibold'>Chọn Phòng Để chuyển</span>
                            <div className='w-full h-[80%] overflow-y-auto grid grid-cols-6 gap-2'>
                                {phongs.map((phong, index) => {
                                    if (!dsThoiGianPhongDaDangKy.map(item => item.phong.maPhong).includes(phong._id) && phong.loai === data.request.data.phong.loaiPhong) {
                                        return <div onClick={() => setPhongSelected(phong)} style={{ backgroundColor: phongSelected?._id === phong._id ? '#83efb1' : '#ebebeb' }} className='transition-all hover:scale-[1.03] cursor-pointer rounded-lg w-full flex flex-col items-center justify-center aspect-square' key={index}>
                                            <span>{phong.tenPhong}</span>
                                            <span>{`(${phong.siSo})`}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='w-full flex justify-end items-center gap-1 text-[12px] mt-1'>
                                <button onClick={() => setStep(0)} className='bg-[#999] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Hủy</button>
                                <button onClick={() => handleSubmit()} className='bg-[#4ec782] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Chuyển phòng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default FormYeuCauDoiPhong