import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateLopForm = ({ visible }) => {
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [tenLop, setTenLop] = useState('')
    const [maChuyenNganh, setMaChuyenNganh] = useState()
    const [maHeDaoTao, setMaHeDaoTao] = useState()
    const [dsHeDaoTao, setDsHeDaoTao] = useState([])

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/chuyennganh/get-all' })
            .then(chuyenNganhs => {
                setDsChuyenNganh(chuyenNganhs)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hedaotao/get-all' })
            .then(dsHeDaoTao => {
                setDsHeDaoTao(dsHeDaoTao)
            })
    }, [])

    const handleCreateLop = () => {

        if (tenLop === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Lớp không hợp lệ')
            return
        }
        if (!maChuyenNganh || maChuyenNganh === '') {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Ngành Không Hợp Lệ')
            return
        }
        if (!maHeDaoTao || maHeDaoTao === '') {
            globalHandler.notify(notifyType.WARNING, 'Hệ Đào Tạo Không Hợp Lệ')
            return
        }

        const body = {
            tenLop,
            siSo: 0,
            maHeDaoTao,
            maChuyenNganh
        }
        globalHandler.notify(notifyType.LOADING, "Đang Tạo Lớp Học")
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/lop/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Lớp Học Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Lớp Học</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={tenLop} onChange={e => setTenLop(e.target.value)} placeholder='Tên Lớp' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select onChange={e => setMaChuyenNganh(e.target.value)} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Ngành</option>
                    {dsChuyenNganh.map((chuyenNganh, index) => (
                        <option value={chuyenNganh._id} key={index}>{chuyenNganh.tenChuyenNganh}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setMaHeDaoTao(e.target.value)} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Hệ Đào Tạo</option>
                    {dsHeDaoTao.map((heDT, index) => (
                        <option key={index} value={heDT._id}>{heDT.tenHeDaoTao}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateLop()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>

    )
}

export default CreateLopForm