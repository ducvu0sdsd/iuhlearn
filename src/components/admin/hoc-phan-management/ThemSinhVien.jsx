import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { checkHaveRoom, checkThoiGianPhong } from '@/utils/apt'
import React, { useContext, useEffect, useState } from 'react'

const ThemSinhVien = ({ currentHocPhan, setCurrentHocPhan, setDsHocPhan, setDsHocPhanFilter }) => {

    const [phongs, setPhongs] = useState([])
    const { globalHandler } = useContext(globalContext)
    const [dsSinhVien, setDsSinhVien] = useState([])
    const [selectedSinhVien, setSelectedSinhVien] = useState([])
    // handle
    const [type, setType] = useState(-1)

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/sinhvien/get-all' })
            .then(sinhviens => {
                setDsSinhVien(sinhviens)
            })
    }, [])

    useEffect(() => {
        if (currentHocPhan && type !== -1) {
            if (type === 0) {
                setSelectedSinhVien(currentHocPhan.tietLyThuyet[0].dsSinhVien)
            }
            if (type === 1) {
                setSelectedSinhVien(currentHocPhan.tietThucHanh[0].dsSinhVien)
            }
            if (type === 2) {
                setSelectedSinhVien(currentHocPhan.tietThucHanh[1].dsSinhVien)
            }
            if (type === 3) {
                setSelectedSinhVien(currentHocPhan.tietThucHanh[2].dsSinhVien)
            }
        }
    }, [currentHocPhan, type])

    const handleUpdate = () => {
        let body = {}
        if (type === 0) {
            body = {
                ...currentHocPhan, tietLyThuyet: [{
                    ...currentHocPhan.tietLyThuyet[0],
                    dsSinhVien: selectedSinhVien
                }]
            }
        } else if (type === 1) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[0],
                dsSinhVien: selectedSinhVien
            }
            body = {
                ...currentHocPhan, tietThucHanh: [thuchanh, ...currentHocPhan.tietThucHanh.filter((item, index) => index !== 0)]
            }
        } else if (type === 2) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[1],
                dsSinhVien: selectedSinhVien
            }
            body = {
                ...currentHocPhan, tietThucHanh: [currentHocPhan.tietThucHanh[0], thuchanh, ...currentHocPhan.tietThucHanh.filter((item, index) => (index !== 0 && index !== 1))]
            }
        } else if (type === 3) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[2],
                dsSinhVien: selectedSinhVien
            }
            body = {
                ...currentHocPhan, tietThucHanh: [currentHocPhan.tietThucHanh[0], currentHocPhan.tietThucHanh[1], thuchanh]
            }
        }

        globalHandler.notify(notifyType.LOADING, 'Đang cập nhật lịch học')
        api({
            type: TypeHTTP.PUT, sendToken: true, body, path: `/hocphan/update/${currentHocPhan._id}`
        })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, 'Cập nhật lịch học thành công')
                if (type === 0) {
                    setCurrentHocPhan({ ...currentHocPhan, tietLyThuyet: res.tietLyThuyet })
                    setDsHocPhan(prev => prev.map(item => {
                        if (item._id === res._id) {
                            return { ...item, tietLyThuyet: res.tietLyThuyet }
                        }
                        return item
                    }))
                    setDsHocPhanFilter(prev => prev.map(item => {
                        if (item._id === res._id) {
                            return { ...item, tietLyThuyet: res.tietLyThuyet }
                        }
                        return item
                    }))
                } else {
                    setCurrentHocPhan({ ...currentHocPhan, tietThucHanh: res.tietThucHanh })
                    setDsHocPhan(prev => prev.map(item => {
                        if (item._id === res._id) {
                            return { ...item, tietThucHanh: res.tietThucHanh }
                        }
                        return item
                    }))
                    setDsHocPhanFilter(prev => prev.map(item => {
                        if (item._id === res._id) {
                            return { ...item, tietThucHanh: res.tietThucHanh }
                        }
                        return item
                    }))
                }
            })
    }

    return (
        <div className='min-w-[100%] h-[100%] flex flex-col relative items-start justify-center gap-2'>
            <div className='flex items-center gap-2'>
                <div onClick={() => setCurrentHocPhan()} className='flex items-center pl-4 cursor-pointer'>
                    <i className='text-[25px] bx bx-chevron-left'></i>
                    <span className='text-[14px]'>Trở về</span>
                </div>
                {currentHocPhan && (
                    <>
                        <div className='text-[14px]'>
                            ({currentHocPhan._id.substring(currentHocPhan._id.length - 6)} - {currentHocPhan.monHoc.tenMon} - {currentHocPhan.lop.tenLop})
                        </div>
                        {[...currentHocPhan.tietLyThuyet, ...currentHocPhan.tietThucHanh].map((item, index) => (
                            <button onClick={() => setType(index)} key={index} style={{ backgroundColor: type === index ? '#5bd7e5' : checkHaveRoom(item) ? '#82e0aa' : '#f2f2f2', color: type === index ? 'white' : !checkHaveRoom(item) ? 'black' : 'white' }} className='text-[13px] transition-all hover:scale-[1.05] text-[white] px-2 py-1 rounded-md'>
                                {index === 0 ? 'Lý thuyết' : 'Thực hành nhóm' + index}
                            </button>
                        ))}
                        <button onClick={() => handleUpdate()} className='text-[13px] transition-all hover:scale-[1.05] bg-[blue] text-[white] px-2 py-1 rounded-md'>
                            Cập nhật
                        </button>
                    </>
                )}
            </div>
            {type !== -1 ? (
                <div className='w-full gap-2 h-[95%] mt-[0.5rem]'>
                    <div className='w-[95%] grid grid-cols-5 gap-2'>
                        {dsSinhVien.map((item, index) => (
                            <div onClick={() => setSelectedSinhVien(selectedSinhVien.includes(item._id) ? selectedSinhVien.filter(item1 => item1 !== item._id) : [...selectedSinhVien, item._id])} style={{ backgroundColor: selectedSinhVien.includes(item._id) ? '#e6e6e6' : 'white' }} key={index} className='flex items-center py-[2px] gap-2 cursor-pointer px-2 rounded-md'>
                                <img src={item.avatar} className='w-[45px] aspect-square rounded-full' />
                                <div className='flex flex-col text-[13px]'>
                                    <span>{item.hoTen}</span>
                                    <span className='text-[12px]'>{item.lop.chuyenNganh?.tenChuyenNganh}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center w-full gap-2 h-[95%] text-[14px]'>
                    Vui lòng chọn tiết cho học phần
                </div>
            )}
        </div>
    )
}

export default ThemSinhVien