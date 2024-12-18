import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useState } from 'react'

const CreateUserForm = ({ visible }) => {

    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [tenKhoa, setTenKhoa] = useState('')

    const handleCreateKhoa = () => {
        if (tenKhoa === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Khoa Không Hợp Lệ')
            return
        }
        const body = { tenKhoa }
        globalHandler.notify(notifyType.LOADING, "Đang Tạo Khoa Đào Tạo")
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/khoa/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Khoa Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Khoa Đào Tạo</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={tenKhoa} onChange={e => setTenKhoa(e.target.value)} placeholder='Tên Khoa' className='w-full text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateKhoa()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>
    )
}

export default CreateUserForm