import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateHeDaoTaoForm = ({ data }) => {

    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [heDaoTao, setHeDaoTao] = useState({
        tenHeDaoTao: '',
        giaTien: ''
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setHeDaoTao(data)
        }
    }, [data])

    const handleUpdateHeDaoTao = () => {
        if (heDaoTao.tenHeDaoTao === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Hệ Đào Tạo Không Hợp Lệ')
            return
        }

        if (!/[0-9]{6,}/.test(heDaoTao.giaTien + "") || Number(heDaoTao.giaTien + "") < 0) {
            globalHandler.notify(notifyType.WARNING, 'Giá Tiền Không Hợp Lệ')
            return
        }

        globalHandler.notify(notifyType.LOADING, "Đang Cập nhật Hệ Đào Tạo")
        api({ sendToken: true, type: TypeHTTP.PUT, body: heDaoTao, path: `/hedaotao/update/${heDaoTao._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Cập nhật Hệ Đào Tạo Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Cập nhật Hệ Đào Tạo</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={heDaoTao.tenHeDaoTao} onChange={e => setHeDaoTao({ ...heDaoTao, tenHeDaoTao: e.target.value })} placeholder='Hệ đào tạo' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={heDaoTao.giaTien} onChange={e => setHeDaoTao({ ...heDaoTao, giaTien: e.target.value })} placeholder='Đơn Giá Của Tín Chỉ (VND)' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát</button>
                <button onClick={() => handleUpdateHeDaoTao()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Cập nhật</button>
            </div>
        </div>
    )
}

export default UpdateHeDaoTaoForm