'use client'
import { globalContext } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatDate } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormThongBaoGiaoVien = () => {
    const { globalHandler, globalData } = useContext(globalContext)
    const [changeRequests, setChangeRequests] = useState([])
    const [display, setDisplay] = useState(false)
    const listStatus = ['ACCEPTED', 'REJECTED']

    useEffect(() => {
        if (globalData.teacher) {
            api({ sendToken: true, type: TypeHTTP.GET, path: '/change-request/get-all' })
                .then(res => {
                    setChangeRequests(res.filter(item => (listStatus.includes(item.status) && item.request.data.giaoVien.maGiaoVien === globalData.teacher._id)))
                })
        }
    }, [globalData.teacher])

    return (
        <div className='fixed bottom-4 right-4'>
            {globalData.teacher && (
                <>
                    {!display && (
                        <div onClick={() => setDisplay(true)} className='p-2 bg-[#eee] rounded-full cursor-pointer relative transition-all hover:scale-[1.05]'>
                            <i className='bx bx-bell text-[24px] translate-y-[2px] text-[#7a7a7a]'></i>
                            <span className='text-[white] bg-[red] top-[6px] font-semibold right-1 absolute text-[10px] h-[15px] w-[15px] flex items-center justify-center rounded-full'>
                                {changeRequests.length}
                            </span>
                        </div>
                    )}
                    <div style={{ width: display ? '300px' : 0, height: display ? '400px' : 0, transition: '0.5s' }} className='bg-[white] relative shadow-lg border-[1px] flex flex-col rounded-lg overflow-hidden border-[#ebebeb]'>
                        <i onClick={() => setDisplay(false)} className='cursor-pointer text-[22px] text-[#999] absolute top-1 right-1 bx bx-x' ></i>
                        <div className='w-full h-[370px] mt-[25px] no flex flex-col gap-2 items-center overflow-y-auto overflow-x-hidden'>
                            {changeRequests.map((item, index) => (
                                <div key={index} className='text-[13px] w-[90%] px-2 py-2 gap-1 rounded-lg bg-[#f3f3f3] flex flex-col'>
                                    <span className='font-semibold'>{
                                        item.status === 'ACCEPTED' ? item.type === 'DOIPHONG' ? 'Quản trị viên đã chấp nhận đổi phòng' : item.type === 'DOITIET' ? 'Quản trị viên đã chấp nhận đổi tiết' : item.type === 'THEMTIET' ? 'Quản trị viên đã chấp nhận thêm tiết học' : 'Quản trị viên đã chấp nhận hủy tiết học'
                                            :
                                            item.type === 'DOIPHONG' ? 'Quản trị viên đã từ chối đổi phòng' : item.type === 'DOITIET' ? 'Quản trị viên đã từ chối đổi tiết' : item.type === 'THEMTIET' ? 'Quản trị viên đã từ chối thêm tiết học' : 'Quản trị viên đã từ chối hủy tiết học'
                                    }</span>
                                    <span className='text-[12px]'>{item.response.message}</span>
                                    <span className='w-full text-end text-[11px]'>{formatDate(item.updatedAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default FormThongBaoGiaoVien