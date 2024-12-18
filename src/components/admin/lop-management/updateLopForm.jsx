import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateLopForm = ({ data }) => {
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [tenLop, setTenLop] = useState('')
    const [maChuyenNganh, setMaChuyenNganh] = useState()
    const [maHeDaoTao, setMaHeDaoTao] = useState()
    const [dsHeDaoTao, setDsHeDaoTao] = useState([])
    const [lop, setLop] = useState({
        tenLop: '',
        maChuyenNganh: '',
        maHeDaoTao: ''

    })
    useEffect(() => {
        setLop(data)
    }, [data])
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

    const handleUpdateLop = () => {
        if (lop.tenLop === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Lớp không hợp lệ')
            return
        }
        if (!lop.chuyenNganh || lop.chuyenNganh.maChuyenNganh === '') {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Ngành Không Hợp Lệ')
            return
        }
        if (!lop.heDaoTao || lop.heDaoTao.maHeDaoTao === '') {
            globalHandler.notify(notifyType.WARNING, 'Hệ Đào Tạo Không Hợp Lệ')
            return
        }
        globalHandler.notify(notifyType.LOADING, "Cập nhật Tạo Lớp Học")
        api({ sendToken: true, type: TypeHTTP.PUT, body: lop, path: `/lop/update/${lop._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Cập nhật Lớp Học Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Cập nhật Lớp Học</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={lop?.tenLop} onChange={e => setLop({ ...lop, tenLop: e.target.value })} placeholder='Tên Lớp' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select value={lop?.maChuyenNganh} onChange={e => setLop({ ...lop, maChuyenNganh: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Ngành</option>
                    {dsChuyenNganh.map((chuyenNganh, index) => (
                        <option value={chuyenNganh._id} key={index}>{chuyenNganh.tenChuyenNganh}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-evenly mb-1'>
                <select value={lop?.maHeDaoTao} onChange={e => setLop({ ...lop, maHeDaoTao: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Hệ Đào Tạo</option>
                    {dsHeDaoTao.map((heDT, index) => (
                        <option key={index} value={heDT._id}>{heDT.tenHeDaoTao}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateLop()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Cập nhật </button>
            </div>
        </div>

    )
}

export default UpdateLopForm