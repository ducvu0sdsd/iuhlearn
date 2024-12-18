import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateChuyenNganhForm = ({ data }) => {
    const [dsKhoa, setDsKhoa] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [chuyenNganh, setChuyenNganh] = useState({
        tenChuyenNganh: '',
        maKhoa: ''
    })
    useEffect(() => {
        if (data) {
            setChuyenNganh(data)
        }
    }, [data])
    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/khoa/get-all' })
            .then(khoa => {
                setDsKhoa(khoa)
            })
    }, [])

    const handleUpdateChuyenNganh = () => {
        if (chuyenNganh.tenChuyenNganh === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Chuyên Ngành Không Hợp Lệ')
            return
        }
        if (chuyenNganh.khoa === '' || chuyenNganh.khoa.maKhoa === '') {
            globalHandler.notify(notifyType.WARNING, 'Khoa Không Hợp Lệ')
            return
        }
        globalHandler.notify(notifyType.LOADING, "Cập nhật Chuyên Ngành")
        api({ sendToken: true, type: TypeHTTP.PUT, body: chuyenNganh, path: `/chuyennganh/update/${data._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Cập nhật Chuyên Ngành Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Chuyên Ngành</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={chuyenNganh?.tenChuyenNganh} onChange={e => setChuyenNganh({ ...chuyenNganh, tenChuyenNganh: e.target.value })} placeholder='Tên Chuyên Ngành' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select value={chuyenNganh.maKhoa} onChange={e => setChuyenNganh({ ...chuyenNganh, maKhoa: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Khoa Đào Tạo</option>
                    {dsKhoa.map((khoa, index) => (
                        <option value={khoa._id} key={index}>{khoa.tenKhoa}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateChuyenNganh()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Cập Nhật </button>
            </div>
        </div>

    )
}

export default UpdateChuyenNganhForm