import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { calculateDate } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormYeuCauHuyTiet = ({ data, hidden }) => {

    const [message, setMessage] = useState('')
    const { globalHandler } = useContext(globalContext)
    const [step, setStep] = useState(0)
    const [phongs, setPhongs] = useState([])
    const [tietSelected, setTietSelected] = useState()
    const [dsThoiGianPhongDaDangKy, setDsThoiGianPhongDaDangKy] = useState([])
    const scheduleOptions = [
        { value: '1-2', label: 'Tiết 1-2 (6h30 - 8h10)' },
        { value: '1-3', label: 'Tiết 1-3 (6h30 - 9h)' },
        { value: '2-3', label: 'Tiết 2-3 (7h20 - 9h)' },
        { value: '3-4', label: 'Tiết 3-4 (8h10 - 10h)' },
        { value: '4-5', label: 'Tiết 4-5 (9h10 - 10h50)' },
        { value: '4-6', label: 'Tiết 4-6 (9h10 - 11h40)' },
        { value: '5-6', label: 'Tiết 5-6 (10h - 11h40)' },
        { value: '7-8', label: 'Tiết 7-8 (12h30 - 14h10)' },
        { value: '7-9', label: 'Tiết 7-9 (12h30 - 15h)' },
        { value: '8-9', label: 'Tiết 8-9 (13h20 - 15h)' },
        { value: '10-11', label: 'Tiết 10-11 (15h10 - 16h50)' },
        { value: '10-12', label: 'Tiết 10-12 (15h10 - 17h40)' },
        { value: '11-12', label: 'Tiết 11-12 (16h - 17h40)' },
        { value: '13-14', label: 'Tiết 13-14 (18h - 19h40)' },
        { value: '13-15', label: 'Tiết 13-15 (18h - 20h40)' }
    ];
    const handleSubmit = () => {
        const body = {
            ...data, status: 'ACCEPTED', response: {
                message: `Đã hủy tiết học vào ${data.request.data.ngay === 1 ? 'Chủ nhật' : 'Thứ ' + data.request.data.ngay} tiết ${data.request.data.tiet}`,
                data: {
                    ...data.request.data,
                    newDate: data.request.data.date
                }
            }
        }
        api({ type: TypeHTTP.PUT, path: `/change-request/update/${data._id}`, sendToken: true, body })
            .then(res => {
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 2000);
                hidden()
                globalHandler.notify(notifyType.SUCCESS, 'Đã hủy tiết theo yêu cầu của giáo viên')
            })
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
                    const filter = arr.filter(item => (item.phong.maPhong === data.request.data.phong.maPhong))
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
                            <span className='w-full text-[15px] font-semibold'>Yêu Cầu Hủy Tiết</span>
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
                                <button onClick={() => handleSubmit()} className='bg-[#4ec782] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Chấp nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default FormYeuCauHuyTiet