import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateMonHocForm = ({ visible }) => {
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [maChuyenNganh, setMaChuyenNganh] = useState('')
    const [tenMonHoc, setTenMonHoc] = useState('')
    const [soTinChi, setSoTinChi] = useState('')
    const [soTietLT, setSoTietLT] = useState('')
    const [soTietTH, setSoTietTH] = useState('')

    const handleCreateMonHoc = () => {

        if (tenMonHoc === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Môn Học Không Hợp Lệ')
            return
        }

        if (soTinChi === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tín Chỉ Không Hợp Lệ')
            return
        }

        if (soTietLT === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tiết Lý Thuyết Không Hợp Lệ')
            return
        }

        if (soTietTH === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tiết Thực Hành Không Hợp Lệ')
            return
        }

        if (maChuyenNganh === '') {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Ngành Không Hợp Lệ')
            return
        }

        const body = {
            tenMon: tenMonHoc,
            soTinChi,
            soTietLyThuyet: soTietLT,
            soTietThucHanh: soTietTH,
            maChuyenNganh
        }
        globalHandler.notify(notifyType.LOADING, "Đang Tạo Môn Học")
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/monhoc/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Môn Học Thành Công")
                globalHandler.reload()
            })
    }

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/chuyennganh/get-all' })
            .then(chuyenNganhs => {
                setDsChuyenNganh(chuyenNganhs)
            })
    }, [])

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Môn Học</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={tenMonHoc} onChange={e => setTenMonHoc(e.target.value)} placeholder='Tên Môn Học' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={soTinChi} onChange={e => setSoTinChi(e.target.value)} placeholder='Số Tín Chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={soTietLT} onChange={e => setSoTietLT(e.target.value)} placeholder='Số Tiết Lý Thuyết' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={soTietTH} onChange={e => setSoTietTH(e.target.value)} placeholder='Số Tiết Thực Hành' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setMaChuyenNganh(e.target.value)} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Ngành</option>
                    {dsChuyenNganh.map((chuyenNganh, index) => (
                        <option value={chuyenNganh._id} key={index}>{chuyenNganh.tenChuyenNganh}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateMonHoc()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>

    )
}

export default CreateMonHocForm