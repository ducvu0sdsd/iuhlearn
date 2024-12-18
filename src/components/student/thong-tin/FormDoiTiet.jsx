import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { isDateGreater, returnNumber } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormDoiTiet = ({ data, hidden }) => {

    const [message, setMessage] = useState('')
    const { globalHandler } = useContext(globalContext)

    const handleSubmit = () => {
        if (isDateGreater(`${data.date.year}-${returnNumber(data.date.month)}-${returnNumber(data.date.day)}`, new Date().toISOString()) === false) {
            globalHandler.notify(notifyType.WARNING, 'Không thể yêu cầu đổi tiết đã qua thời gian hiện tại')
            return
        }
        const body = {
            type: 'DOITIET',
            request: {
                message,
                data: {
                    tiet_id: data.thoigian._id,
                    tenLop: data.tenLop,
                    tenMon: data.tenMon,
                    dsSinhVien: data.thoigian.dsSinhVien,
                    giaoVien: data.thoigian.giaoVien,
                    ngay: data.thoigian.ngay,
                    phong: { ...data.thoigian.phong, loaiPhong: data.loai },
                    siSoToiDa: data.thoigian.siSoToiDa,
                    tiet: data.thoigian.tiet,
                    date: data.date,
                    hocKy: data.hocKy
                }
            },
            response: {
                message: ''
            }
        }
        api({ type: TypeHTTP.POST, body, sendToken: true, path: '/change-request/create' })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, 'Đã gửi yêu cầu đổi tiết đến quản trị viên')
                setMessage('')
                hidden()
            })
    }

    return (
        <div style={{ width: data ? '400px' : 0, height: data ? '300px' : 0, transition: '0.5s' }} className='flex flex-col items-center fixed overflow-hidden left-[50%] z-50 top-[50%] translate-x-[-50%] translate-y-[-50%] bg-[white] rounded-lg'>
            {data && (<>
                <div className='w-full p-2 flex flex-col items-center justify-start gap-1'>
                    <span className='w-full text-[15px] font-semibold'>Yêu Cầu Đổi Tiết</span>
                    <span className='w-full text-[12px]'>Hãy gửi yêu cầu của bạn để quản trị viên có thể xem và xét duyệt.</span>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder='Thông điệp của bạn' className='border-[1px] px-2 py-2 text-[14px] border-[#dcdcdc] h-[200px] focus:outline-0 w-[100%] rounded-lg' />
                    <div className='w-full flex justify-end items-center gap-1 text-[13px] mt-1'>
                        <button onClick={() => hidden()} className='bg-[red] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Hủy</button>
                        <button onClick={() => handleSubmit()} className='bg-[#82e0aa] text-[white] px-2 py-[2px] rounded-md transition-all hover:scale-[1.05]'>Yêu Cầu</button>
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default FormDoiTiet