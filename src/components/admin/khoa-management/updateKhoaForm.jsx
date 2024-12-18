import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateKhoaForm = ({ data }) => {

    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [khoa, setKhoa] = useState()

    useEffect(() => {
        if (data) {
            setKhoa(data)
        }
    }, [data])

    const handleUpdateKhoa = () => {

        if (!khoa || khoa.tenKhoa === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Khoa Không Hợp Lệ')
            return
        }

        const body = khoa
        globalHandler.notify(notifyType.LOADING, "Đang Sửa Khoa Đào Tạo")
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/khoa/update/${data._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Sửa Khoa Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Cập Nhật Khoa Đào Tạo</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={khoa?.tenKhoa} onChange={e => setKhoa({ ...khoa, tenKhoa: e.target.value })} placeholder='Tên Khoa' className='w-full text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateKhoa()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Sửa </button>
            </div>
        </div>
    )
}

export default UpdateKhoaForm