import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateHocKyForm = ({ data }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [hocKy, setHocKy] = useState('')

    useEffect(() => {
        if (data) {
            setHocKy(data)
        }
    }, [data])

    const handleUpdateHocKy = () => {

        if (hocKy.tenHocKy === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Học Kỳ Không Hợp Lệ')
            return
        }
        if (hocKy.fromDate === '') {
            globalHandler.notify(notifyType.WARNING, 'Ngày bắt đầu Không Hợp Lệ')
            return
        }
        if (hocKy.toDate === '') {
            globalHandler.notify(notifyType.WARNING, 'Ngày kết thúc Không Hợp Lệ')
            return
        }
        globalHandler.notify(notifyType.LOADING, "Cập nhật Tạo Học Kỳ")
        api({ sendToken: true, type: TypeHTTP.PUT, body: hocKy, path: `/hocky/update/${hocKy._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Cập nhật Học Kỳ Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            {hocKy && (<>
                <div className='flex gap-2 items-center w-full mb-2'>
                    {/* <img src={image} width={'35px'} /> */}
                    <span className='text-[19px] font-medium'>Cập nhật Học Kỳ</span>
                </div>
                <div className='flex justify-evenly mb-1'>
                    <input value={hocKy.tenHocKy} onChange={e => setHocKy({ ...hocKy, tenHocKy: e.target.value })} placeholder='Tên Học Kỳ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                    <select value={hocKy.choPhepDangKy} onChange={e => setHocKy({ ...hocKy, choPhepDangKy: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value={true}>Cho Phép</option>
                        <option value={false}>Không Cho Phép</option>
                    </select>
                </div>
                <div className='flex justify-evenly mb-1'>
                    <div className='flex flex-col gap-1 w-[45%]'>
                        <span className='text-[13px]'>Ngày bắt đầu</span>
                        <input value={hocKy.fromDate.split('T')[0]} onChange={e => setHocKy({ ...hocKy, fromDate: e.target.value })} type='date' className='w-[100%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                    </div>
                    <div className='flex flex-col gap-1 w-[45%]'>
                        <span className='text-[13px]'>Ngày kết thúc</span>
                        <input value={hocKy.toDate.split('T')[0]} onChange={e => setHocKy({ ...hocKy, toDate: e.target.value })} type='date' className='w-[100%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                    </div>
                </div>
                <div className='flex justify-end gap-2 mb-1'>
                    <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                    <button onClick={() => handleUpdateHocKy()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Cập nhật </button>
                </div>
            </>)}
        </div>

    )
}

export default UpdateHocKyForm