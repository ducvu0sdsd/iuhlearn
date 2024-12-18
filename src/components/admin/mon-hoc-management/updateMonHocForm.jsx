import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateMonHocForm = ({ data }) => {
    const [dsChuyenNganh, setDsChuyenNganh] = useState([])
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)

    const [monHoc, setMonHoc] = useState({
        tenMonHoc: '',
        soTinChi: '',
        soTietLyThuyet: '',
        soTietThucHanh: '',
        maChuyenNganh: ''
    })
    useEffect(() => {
        if (data) {
            setMonHoc(data)
        }
    }, [data])
    const handleUpdateMonHoc = () => {
        if (monHoc.tenMonHoc === '') {
            globalHandler.notify(notifyType.WARNING, 'Tên Môn Học Không Hợp Lệ')
            return
        }

        if (monHoc.soTinChi === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tín Chỉ Không Hợp Lệ')
            return
        }

        if (monHoc.soTietLT === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tiết Lý Thuyết Không Hợp Lệ')
            return
        }

        if (monHoc.soTietTH === '') {
            globalHandler.notify(notifyType.WARNING, 'Số Tiết Thực Hành Không Hợp Lệ')
            return
        }

        if (monHoc.chuyenNganh === "" || monHoc.chuyenNganh.maChuyenNganh === '') {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Ngành Không Hợp Lệ')
            return
        }
        globalHandler.notify(notifyType.LOADING, "Cập nhật Tạo Môn Học")
        api({ sendToken: true, type: TypeHTTP.PUT, body: monHoc, path: `/monhoc/update/${monHoc._id}` })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Cập nhật Môn Học Thành Công")
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
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Cập nhật Môn Học</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={monHoc?.tenMon} onChange={e => setMonHoc({ ...monHoc, tenMon: e.target.value })} placeholder='Tên Môn Học' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={monHoc?.soTinChi} onChange={e => setMonHoc({ ...monHoc, soTinChi: e.target.value })} placeholder='Số Tín Chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={monHoc?.soTietLyThuyet} onChange={e => setMonHoc({ ...monHoc, soTietLyThuyet: e.target.value })} placeholder='Số Tiết Lý Thuyết' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={monHoc?.soTietThucHanh} onChange={e => setMonHoc({ ...monHoc, soTietThucHanh: e.target.value })} placeholder='Số Tiết Thực Hành' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select value={monHoc?.maChuyenNganh} onChange={e => setMonHoc({ ...monHoc, maChuyenNganh: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Ngành</option>
                    {dsChuyenNganh.map((chuyenNganh, index) => (
                        <option value={chuyenNganh._id} key={index}>{chuyenNganh.tenChuyenNganh}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateMonHoc()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Cập nhật </button>
            </div>
        </div>

    )
}

export default UpdateMonHocForm