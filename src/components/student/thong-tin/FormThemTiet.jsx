import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useEffect, useState } from 'react'

const FormThemTiet = ({ data, hidden }) => {

    const [message, setMessage] = useState('')
    const [currentTiet, setCurrentTiet] = useState()
    const { globalHandler } = useContext(globalContext)
    const [step, setStep] = useState(0)

    const handleNextStep = () => {
        if (!currentTiet) {
            globalHandler.notify(notifyType.WARNING, 'Vui lòng chọn tiết')
            return
        }
        setStep(1)
    }

    const handleSubmit = () => {
        if (!currentTiet) {
            globalHandler.notify(notifyType.WARNING, 'Vui lòng chọn tiết')
            return
        }
        if (message === '') {
            globalHandler.notify(notifyType.WARNING, 'Vui lòng nhập lời nhắn của bạn')
            return
        }
        const body = {
            type: 'THEMTIET',
            request: {
                message,
                data: {
                    tiet_id: currentTiet.thoigian._id,
                    tenLop: currentTiet.tenLop,
                    tenMon: currentTiet.tenMon,
                    giaoVien: currentTiet.thoigian.giaoVien,
                    siSoToiDa: currentTiet.thoigian.siSoToiDa,
                    date: currentTiet.date,
                    hocKy: currentTiet.hocKy,
                    loaiPhong: currentTiet.loai
                }
            },
            response: {
                message: ''
            }
        }
        api({ type: TypeHTTP.POST, body, sendToken: true, path: '/change-request/create' })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, 'Đã gửi yêu cầu đổi phòng đến quản trị viên')
                setMessage('')
                hidden()
            })
    }

    return (
        <div style={{ width: data ? '400px' : 0, height: data ? '300px' : 0, transition: '0.5s' }} className='flex flex-col items-center fixed overflow-hidden left-[50%] z-50 top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[white] rounded-lg'>
            {data && (<>
                <div className='w-full h-full flex'>
                    <div style={{ marginLeft: `-${step * 100}%`, transition: '0.5s' }} className='w-[100%] flex h-full'>
                        <div className='min-w-[100%] h-full p-2 relative flex flex-col items-center justify-start gap-1'>
                            <span className='w-full text-[15px] font-semibold'>Yêu Cầu Thêm Tiết</span>
                            <span className='w-full text-[12px]'>Hãy chọn tiết cần thêm cho quản trị viên.</span>
                            <div className='px-2 py-2 text-[14px] border-[#dcdcdc] max-h-[200px] focus:outline-0 grid grid-cols-2 w-[100%] gap-2 rounded-lg overflow-y-auto'>
                                {data.map((item, index) => (
                                    <div onClick={() => setCurrentTiet(item)} style={{ backgroundColor: currentTiet?.thoigian?._id === item.thoigian._id ? '#2ecc71' : '#ebebeb' }} className='flex flex-col cursor-pointer transition-all hover:scale-[1.02] bg-[#ebebeb] px-4 h-[70px] justify-center rounded-lg w-[100%] text-[13px]' key={index}>
                                        <span className='font-semibold'>{item.tenMon}</span>
                                        <span>{item.tenLop}</span>
                                        <span>{item.loai === 'LT' ? 'Lý Thuyết' : 'Thực Hành'}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='w-full flex absolute bottom-3 right-3 justify-end items-center gap-1 text-[13px] mt-1'>
                                <button onClick={() => hidden()} className='bg-[red] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Hủy</button>
                                <button onClick={() => handleNextStep()} className='bg-[#82e0aa] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Tiếp tục</button>
                            </div>
                        </div>
                        <div className='min-w-[100%] h-full relative p-2 flex flex-col items-center justify-start gap-1'>
                            <span className='w-full text-[15px] font-semibold'>Yêu Cầu Thêm Tiết</span>
                            <span className='w-full text-[12px]'>Hãy gửi thông điệp của bạn để quản trị viên có thể xem và xét duyệt.</span>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder='Thông điệp của bạn' className='border-[1px] px-2 py-2 text-[14px] border-[#dcdcdc] h-[200px] focus:outline-0 w-[100%] rounded-lg' />
                            <div className='w-full flex absolute bottom-3 right-3 justify-end items-center gap-1 text-[13px] mt-1'>
                                <button onClick={() => setStep(0)} className='bg-[red] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Hủy</button>
                                <button onClick={() => handleSubmit()} className='bg-[#82e0aa] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Tiếp tục</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default FormThemTiet