import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { checkHaveRoom, checkThoiGianPhong } from '@/utils/apt'
import React, { useContext, useEffect, useState } from 'react'

const ThemPhong = ({ currentHocPhan, setCurrentHocPhan, setDsHocPhan, setDsHocPhanFilter }) => {

    const [phongs, setPhongs] = useState([])
    const { globalHandler } = useContext(globalContext)
    const [dsThoiGianPhongDaDangKy, setDsThoiGianPhongDaDangKy] = useState([])
    const [dsThoiGianPhongDaDangKyFilter, setDsThoiGianPhongDaDangKyFilter] = useState([])
    const scheduleOptions = [
        { value: '1-2', label: 'Tiết 1-2 (6h30 - 8h10)' },
        { value: '1-3', label: 'Tiết 1-3 (6h30 - 9h)' },
        { value: '2-3', label: 'Tiết 2-3 (7h20 - 9h)' },
        { value: '3-4', label: 'Tiết 3-4 (8h10 - 10h)' },
        { value: '4-5', label: 'Tiết 4-5 (9h10 - 10h50)' },
        { value: '4-6', label: 'Tiết 4-6 (9h10 - 11h40)' },
        { value: '5-6', label: 'Tiết 5-6 (10h - 11h40)' },
        { value: '7-8', label: 'Tiết 7-8 (12h30 - 14h10)' },
        { value: '7-9', label: 'Tiết 7-9 (12h30 - 15h)' },
        { value: '8-9', label: 'Tiết 8-9 (13h20 - 15h)' },
        { value: '10-11', label: 'Tiết 10-11 (15h10 - 16h50)' },
        { value: '10-12', label: 'Tiết 10-12 (15h10 - 17h40)' },
        { value: '11-12', label: 'Tiết 11-12 (16h - 17h40)' },
        { value: '13-14', label: 'Tiết 13-14 (18h - 19h40)' },
        { value: '14-15', label: 'Tiết 13-14 (18h - 19h40)' },
        { value: '13-15', label: 'Tiết 13-15 (18h - 20h40)' }
    ];

    // handle
    const [type, setType] = useState(-1)
    const [currentPhong, setCurrentPhong] = useState()
    const [currentDate, setCurrentDate] = useState(-1)
    const [currentTime, setCurrentTime] = useState('')

    const resetData = () => {
        setType(-1)
        setCurrentPhong()
        setCurrentDate(-1)
        setCurrentTime('')
    }

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' })
            .then(phongs => {
                setPhongs(phongs)
            })
    }, [])

    useEffect(() => {
        if (type === 0) {
            if (!checkHaveRoom(currentHocPhan.tietLyThuyet[0])) {
                setCurrentDate(-1)
                setCurrentTime('')
            }
        }
        if (type === 1) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[0])) {
                setCurrentDate(-1)
                setCurrentTime('')
            }
        }
        if (type === 2) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[1])) {
                setCurrentDate(-1)
                setCurrentTime('')
            }
        }
        if (type === 3) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[2])) {
                setCurrentDate(-1)
                setCurrentTime('')
            }
        }
    }, [currentPhong])

    useEffect(() => {
        if (type === 0) {
            if (!checkHaveRoom(currentHocPhan.tietLyThuyet[0])) {
                setCurrentPhong()
                setDsThoiGianPhongDaDangKyFilter(dsThoiGianPhongDaDangKy)
            } else {
                setDsThoiGianPhongDaDangKyFilter(
                    dsThoiGianPhongDaDangKy.filter(item1 => {
                        const isInFilter = dsThoiGianPhongDaDangKy.some(
                            item => {
                                return item.phong.maPhong === currentHocPhan.tietLyThuyet[0].phong.maPhong &&
                                    item.ngay === currentHocPhan.tietLyThuyet[0].ngay &&
                                    item.tiet === currentHocPhan.tietThucHanh[0]?.tiet &&
                                    item === item1
                            }
                        );
                        return !isInFilter
                    })
                );
            }
        }
        if (type === 1) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[0])) {
                setCurrentPhong()
                setDsThoiGianPhongDaDangKyFilter(dsThoiGianPhongDaDangKy)
            } else {
                setDsThoiGianPhongDaDangKyFilter(
                    dsThoiGianPhongDaDangKy.filter(item1 => {
                        const isInFilter = dsThoiGianPhongDaDangKy.some(
                            item =>
                                item.phong.maPhong === currentHocPhan.tietThucHanh[0].phong.maPhong &&
                                item.ngay === currentHocPhan.tietThucHanh[0].ngay &&
                                item.tiet === currentHocPhan.tietThucHanh[0].tiet &&
                                item === item1
                        );
                        return !isInFilter
                    })
                );
            }
        }
        if (type === 2) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[1])) {
                setCurrentPhong()
                setDsThoiGianPhongDaDangKyFilter(dsThoiGianPhongDaDangKy)
            } else {
                setDsThoiGianPhongDaDangKyFilter(
                    dsThoiGianPhongDaDangKy.filter(item1 => {
                        const isInFilter = dsThoiGianPhongDaDangKy.some(
                            item =>
                                item.phong.maPhong === currentHocPhan.tietThucHanh[1].phong.maPhong &&
                                item.ngay === currentHocPhan.tietThucHanh[1].ngay &&
                                item.tiet === currentHocPhan.tietThucHanh[1].tiet &&
                                item === item1
                        );
                        return !isInFilter
                    })
                );
            }
        }
        if (type === 3) {
            if (!checkHaveRoom(currentHocPhan.tietThucHanh[2])) {
                setCurrentPhong()
                setDsThoiGianPhongDaDangKyFilter(dsThoiGianPhongDaDangKy)
            } else {
                setDsThoiGianPhongDaDangKyFilter(
                    dsThoiGianPhongDaDangKy.filter(item1 => {
                        const isInFilter = dsThoiGianPhongDaDangKy.some(
                            item =>
                                item.phong.maPhong === currentHocPhan.tietThucHanh[2].phong.maPhong &&
                                item.ngay === currentHocPhan.tietThucHanh[2].ngay &&
                                item.tiet === currentHocPhan.tietThucHanh[2].tiet &&
                                // parentTime[item.tiet].includes(currentHocPhan.tietLyThuyet[0].tiet) &&
                                item === item1
                        );
                        return !isInFilter
                    })
                );
            }
        }
    }, [type])

    useEffect(() => {
        if (currentHocPhan) {
            resetData()
            api({ type: TypeHTTP.POST, sendToken: true, body: { maHocKy: currentHocPhan.hocKy.maHocKy }, path: '/hocphan/get-by-hoc-ky' })
                .then(res => {
                    const arr = res.map(item => [item.tietLyThuyet[0], ...item.tietThucHanh]).flat().filter(item => item.phong.maPhong !== '')
                    setDsThoiGianPhongDaDangKy(arr)
                    setDsThoiGianPhongDaDangKyFilter(arr)
                })
        }
    }, [currentHocPhan])

    useEffect(() => {
        if (type === 0) {
            if (checkHaveRoom(currentHocPhan.tietLyThuyet[0])) {
                setCurrentDate(currentHocPhan.tietLyThuyet[0].ngay)
                setCurrentTime(currentHocPhan.tietLyThuyet[0].ngay + '/' + currentHocPhan.tietLyThuyet[0].tiet)
                setCurrentPhong({ _id: currentHocPhan.tietLyThuyet[0].phong.maPhong, tenPhong: currentHocPhan.tietLyThuyet[0].phong.tenPhong })
            }
        }
        if (type === 1) {
            if (checkHaveRoom(currentHocPhan.tietThucHanh[0])) {
                setCurrentDate(currentHocPhan.tietThucHanh[0].ngay)
                setCurrentTime(currentHocPhan.tietThucHanh[0].ngay + '/' + currentHocPhan.tietThucHanh[0].tiet)
                setCurrentPhong({ _id: currentHocPhan.tietThucHanh[0].phong.maPhong, tenPhong: currentHocPhan.tietThucHanh[0].phong.tenPhong })
            }
        }
        if (type === 2) {
            if (checkHaveRoom(currentHocPhan.tietThucHanh[1])) {
                setCurrentDate(currentHocPhan.tietThucHanh[1].ngay)
                setCurrentTime(currentHocPhan.tietThucHanh[1].ngay + '/' + currentHocPhan.tietThucHanh[1].tiet)
                setCurrentPhong({ _id: currentHocPhan.tietThucHanh[1].phong.maPhong, tenPhong: currentHocPhan.tietThucHanh[1].phong.tenPhong })
            }
        }
        if (type === 3) {
            if (checkHaveRoom(currentHocPhan.tietThucHanh[2])) {
                setCurrentDate(currentHocPhan.tietThucHanh[2].ngay)
                setCurrentTime(currentHocPhan.tietThucHanh[2].ngay + '/' + currentHocPhan.tietThucHanh[2].tiet)
                setCurrentPhong({ _id: currentHocPhan.tietThucHanh[2].phong.maPhong, tenPhong: currentHocPhan.tietThucHanh[2].phong.tenPhong })
            }
        }
    }, [type])

    const handleUpdateLearnCalendar = () => {
        let body = {}
        if (type === 0) {
            body = {
                ...currentHocPhan, tietLyThuyet: [{
                    ...currentHocPhan.tietLyThuyet[0],
                    ngay: currentDate,
                    tiet: currentTime.split('/')[1],
                    phong: {
                        maPhong: currentPhong._id,
                        tenPhong: currentPhong.tenPhong
                    }
                }]
            }
        } else if (type === 1) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[0],
                ngay: currentDate,
                tiet: currentTime.split('/')[1],
                phong: {
                    maPhong: currentPhong._id,
                    tenPhong: currentPhong.tenPhong
                }
            }
            body = {
                ...currentHocPhan, tietThucHanh: [thuchanh, ...currentHocPhan.tietThucHanh.filter((item, index) => index !== 0)]
            }
        } else if (type === 2) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[1],
                ngay: currentDate,
                tiet: currentTime.split('/')[1],
                phong: {
                    maPhong: currentPhong._id,
                    tenPhong: currentPhong.tenPhong
                }
            }
            body = {
                ...currentHocPhan, tietThucHanh: [currentHocPhan.tietThucHanh[0], thuchanh, ...currentHocPhan.tietThucHanh.filter((item, index) => (index !== 0 && index !== 1))]
            }
        } else if (type === 3) {
            const thuchanh = {
                ...currentHocPhan.tietThucHanh[2],
                ngay: currentDate,
                tiet: currentTime.split('/')[1],
                phong: {
                    maPhong: currentPhong._id,
                    tenPhong: currentPhong.tenPhong
                }
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
                    </>
                )}
            </div>
            {type !== -1 ? (
                <div className='flex items-start justify-center w-full gap-2 h-[95%]'>
                    {currentHocPhan && (
                        <>
                            <div style={{ width: `${currentPhong ? '70' : '90'}%`, transition: '0.5s' }} className='flex no overflow-y-auto max-h-[98%] flex-wrap items-start gap-2 justify-center'>
                                {phongs.map((phong, index) => {
                                    if (type === 0) {
                                        if (phong.loai === 'LT') {
                                            return <div key={index} onClick={() => setCurrentPhong(phong)} style={{ backgroundColor: phong._id === currentPhong?._id ? '#82e0aa' : '#f2f2f2', fontWeight: phong._id === currentPhong?._id ? 500 : 400, color: phong._id === currentPhong?._id ? 'white' : 'black' }} className='w-[90px] aspect-square transition-all hover:scale-[1.05] flex flex-col items-center shadow-md cursor-pointer justify-center bg-[#f2f2f2] rounded-md'>
                                                <span>{phong.tenPhong}</span>
                                                <span>{`(${phong.siSo})`}</span>
                                            </div>
                                        }
                                    } else {
                                        if (phong.loai === 'TH') {
                                            return <div key={index} onClick={() => setCurrentPhong(phong)} style={{ backgroundColor: phong._id === currentPhong?._id ? '#82e0aa' : '#f2f2f2', fontWeight: phong._id === currentPhong?._id ? 500 : 400, color: phong._id === currentPhong?._id ? 'white' : 'black' }} className='w-[90px] aspect-square transition-all hover:scale-[1.05] flex items-center shadow-md flex-col cursor-pointer justify-center bg-[#f2f2f2] rounded-md'>
                                                <span>{phong.tenPhong}</span>
                                                <span>{`(${phong.siSo})`}</span>
                                            </div>
                                        }
                                    }
                                })}
                            </div>
                            <div style={{ width: `${currentPhong ? '23' : '0'}%`, transition: '0.5s', borderLeft: currentPhong ? '1px solid #e5e5e5' : 'none', paddingLeft: currentPhong ? '8px' : 0 }} className='h-[100%] relative flex flex-col overflow-hidden'>
                                <i onClick={() => setCurrentPhong()} className='bx bx-x absolute cursor-pointer text-[22px] text-[#999] top-0 right-5' ></i>
                                <span className='text-[15px] font-semibold'>Chọn thời gian</span>
                                <div className='no w-[90%] max-h-[83%] overflow-y-auto mt-1'>
                                    <div className='flex flex-col gap-[2px]'>
                                        <div onClick={() => setCurrentDate(currentDate === 2 ? 0 : 2)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Hai</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 2 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 3 ? 0 : 3)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Ba</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 3 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 4 ? 0 : 4)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Tư</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 4 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 5 ? 0 : 5)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Năm</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 5 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 6 ? 0 : 6)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Sáu</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 6 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 7 ? 0 : 7)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Thứ Bảy</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 7 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                        <div onClick={() => setCurrentDate(currentDate === 1 ? 0 : 1)} className='bg-[#efefef] text-[13px] px-2 cursor-pointer py-1 rounded-sm flex items-center justify-between gap-1'>
                                            <span>Chủ Nhật</span>
                                            <i className='text-[17px] bx bx-chevron-down' ></i>
                                        </div>
                                        <div style={{ height: currentDate === 1 ? `${scheduleOptions.filter(item => checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)).length * 30}px` : 0, transition: '0.5s' }} className='w-full flex flex-col overflow-hidden gap-1'>
                                            {scheduleOptions.map((item, index) => {
                                                if (checkThoiGianPhong(dsThoiGianPhongDaDangKyFilter, currentPhong, currentDate, item.value)) {
                                                    return <div onClick={() => setCurrentTime(currentTime === currentDate + '/' + item.value ? '' : currentDate + '/' + item.value)} style={{ backgroundColor: currentTime === currentDate + '/' + item.value ? '#f5f5f5' : 'white' }} className='text-[12px] px-4 cursor-pointer w-[100%] py-[4px] hover:bg-[#f5f5f5] transition-all rounded-sm' key={index}>
                                                        {item.label}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {(currentPhong && currentDate !== -1 && currentTime !== '') && (
                                    <button onClick={() => handleUpdateLearnCalendar()} className='text-[13px] w-[100px] mt-2 transition-all hover:scale-[1.05] text-[white] bg-[blue] px-2 py-1 rounded-md'>
                                        Cập nhật
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className='flex items-center justify-center w-full gap-2 h-[95%] text-[14px]'>
                    Vui lòng chọn tiết cho học phần
                </div>
            )}
        </div>
    )
}

export default ThemPhong