"use client"
import { adminContext } from '@/context/adminContext'
import { globalContext } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYearObject, generateWeeks, getDateForDay, getDateForDayMonthYear, isDateGreater, isDateGreaterEqual } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const Schedule = ({ teacher }) => {
    const { globalData } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)
    const [phongs, setPhongs] = useState([])
    const [toas, setToas] = useState([])
    const [maHocKy, setMaHocKy] = useState('')
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsHocPhan, setDsHocPhan] = useState([])
    const [dsTiet, setDsTiet] = useState([])
    const [dsTietFilter, setDsTietFilter] = useState([])
    const [selected, setSelected] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [changeRequests, setChangeRequests] = useState([])
    const [changeRequestsFilter, setChangeRequestsFilter] = useState([])
    const [changeRequestsNestedFilter, setChangeRequestsNestedFilter] = useState([])
    const [currentWeek, setCurrentWeek] = useState(
        {
            start: '',
            end: ''
        }
    )
    const [weeks, setWeeks] = useState([])

    //selected
    const [toa, setToa] = useState('')
    const [loaiPhong, setLoaiPhong] = useState('')

    const valuesArraySang = [
        '1-2',
        '1-3',
        '2-3',
        '3-4',
        '4-5',
        '4-6',
        '5-6'
    ];
    const valuesArrayChieu = [
        '7-8',
        '7-9',
        '8-9',
        '10-11',
        '10-12'
    ];
    const valuesArrayToi = [
        '11-12',
        '13-14',
        '13-15'
    ];

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(hocky => {
                setDsHocKy(hocky)
                const current = hocky.filter(item => isDateGreater(new Date().toISOString(), item.fromDate) && isDateGreater(item.toDate, new Date().toISOString()))[0]
                setMaHocKy(current._id)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/change-request/get-all' })
            .then(res => {
                setChangeRequests(res.filter(item => item.status === 'ACCEPTED'))
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' })
            .then(phongs => {
                setPhongs(phongs)
                const arr = []
                phongs.forEach(item => {
                    if (!arr.includes(item.toa)) {
                        arr.push(item.toa)
                    }
                })
                setToas(arr)
            })
    }, [])

    useEffect(() => {
        if (maHocKy !== '') {
            const hocKy = dsHocKy.filter(item => item._id === maHocKy)[0]
            const weeks = generateWeeks(hocKy.fromDate, hocKy.toDate)
            const currentWeek = weeks.filter(item => isDateGreater(new Date().toISOString(), item.start) && isDateGreater(item.end, new Date().toISOString()))[0]
            const index = weeks.findIndex(item => item.start === currentWeek.start && item.end === currentWeek.end)
            setCurrentIndex(index)
            setCurrentWeek(currentWeek)
            setWeeks(weeks)
        }
    }, [maHocKy])

    const handleDoiPhong = (tiet, date) => {
        adminHandler.showDoiPhong({ ...tiet, date: convertDateToDayMonthYearObject(date), hocKy: dsHocKy.filter(item => item._id === maHocKy)[0] })
    }

    const handleDoiTiet = (tiet, date) => {
        adminHandler.showDoiTiet({ ...tiet, date: convertDateToDayMonthYearObject(date), hocKy: dsHocKy.filter(item => item._id === maHocKy)[0] })
    }

    const handleThemTiet = () => {
        adminHandler.showThemTiet(dsTietFilter.map((item) => {
            return { ...item, hocKy: dsHocKy.filter(item => item._id === maHocKy)[0], date: convertDateToDayMonthYearObject(currentWeek.start) }
        }))
    }

    useEffect(() => {
        if (maHocKy !== '' && teacher && currentWeek.start !== '' && currentIndex !== -1) {
            api({ type: TypeHTTP.POST, sendToken: true, body: { maHocKy }, path: '/hocphan/get-by-hoc-ky' })
                .then(res => {
                    let arr = []
                    res.forEach(item => {
                        if (item.monHoc.soTietLyThuyet === 30) {
                            if (currentIndex < 10) {
                                if (item.tietLyThuyet[0].giaoVien.maGiaoVien === teacher._id) {
                                    arr.push({
                                        tenMon: item.monHoc.tenMon,
                                        tenLop: item.lop.tenLop,
                                        loai: 'LT',
                                        thoigian: item.tietLyThuyet[0]
                                    })
                                }
                            }
                        } else if (item.monHoc.soTietLyThuyet === 45) {
                            if (currentIndex < 15) {
                                if (item.tietLyThuyet[0].giaoVien.maGiaoVien === teacher._id) {
                                    arr.push({
                                        tenMon: item.monHoc.tenMon,
                                        tenLop: item.lop.tenLop,
                                        loai: 'LT',
                                        thoigian: item.tietLyThuyet[0]
                                    })
                                }
                            }
                        }
                        if (item.monHoc.soTietThucHanh === 30) {
                            if (currentIndex > 4 && currentIndex < 15) {
                                item.tietThucHanh.forEach((item1) => {
                                    if (item1.giaoVien.maGiaoVien === teacher._id) {
                                        arr.push({
                                            tenMon: item.monHoc.tenMon,
                                            tenLop: item.lop.tenLop,
                                            loai: 'TH',
                                            thoigian: item1
                                        })
                                    }
                                })
                            }
                        }
                    })
                    setChangeRequestsFilter(changeRequests.filter(item => arr.filter(item1 => item.response.data.tiet_id === item1.thoigian._id)[0] !== undefined).filter(item => item.type !== 'HUYTIET').map(item => item.response.data))
                    setDsTiet(arr)
                })
        }
    }, [maHocKy, teacher, currentWeek, currentIndex, changeRequests])

    const handlePrev = () => {
        setCurrentWeek(weeks[currentIndex - 1])
        setCurrentIndex(prev => prev - 1)
    }

    const handleNext = () => {
        setCurrentWeek(weeks[currentIndex + 1])
        setCurrentIndex(prev => prev + 1)
    }

    useEffect(() => {
        if (toa === '' && loaiPhong === '') {
            setChangeRequestsNestedFilter(changeRequestsFilter)
            setDsTietFilter(dsTiet)
        } else {
            let arr = JSON.parse(JSON.stringify(dsTiet))
            arr = arr.map(item => {
                const filter = phongs.filter(phong => phong._id === item.thoigian.phong.maPhong)[0]
                return { ...item, phong: filter }
            })
            if (toa !== '') {
                arr = arr.filter(item => item.phong.toa === toa)
            }
            if (loaiPhong !== '') {
                arr = arr.filter(item => item.phong.loai === loaiPhong)
            }
            setDsTietFilter(arr)

            let arr1 = JSON.parse(JSON.stringify(changeRequestsFilter))
            arr1 = arr1.map(item => {
                const filter = phongs.filter(phong => phong._id === item.phong.maPhong)[0]
                return { ...item, phong: filter }
            })
            if (toa !== '') {
                arr1 = arr1.filter(item => item.phong.toa === toa)
            }
            if (loaiPhong !== '') {
                arr1 = arr1.filter(item => item.phong.loai === loaiPhong)
            }
            setChangeRequestsNestedFilter(arr1)
        }
    }, [toa, loaiPhong, dsTiet, changeRequestsFilter])

    return (
        <div className='flex flex-col overflow-auto'>
            <div className='w-full flex items-center gap-4'>
                <select value={maHocKy} onChange={e => setMaHocKy(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    {dsHocKy.map((hocKy, index) => (
                        <option value={hocKy._id} key={index}>{hocKy.tenHocKy}</option>
                    ))}
                </select>
                <div className='flex items-center gap-2'>
                    <span className='text-[14px]'>Từ ngày</span>
                    <input value={currentWeek.start} disabled type='date' className='w-[120px] text-[14px] focus:outline-0 px-[10px] h-[30px] border-[#c1c1c1] border-[1px] rounded-md' />
                    <span className='text-[14px]'>đến ngày</span>
                    <input value={currentWeek.end} type='date' disabled className='w-[120px] text-[14px] focus:outline-0 px-[10px] h-[30px] border-[#c1c1c1] border-[1px] rounded-md' />
                </div>
                <div className='flex items-center gap-1 text-[13px]'>
                    {currentIndex !== 0 && (
                        <button onClick={() => handlePrev()} className='bg-[#999] w-[60px] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Trước</button>
                    )}
                    {currentIndex !== weeks.length - 1 && (
                        <button onClick={() => handleNext()} className='bg-[#999] w-[60px] text-[white] px-2 py-[4px] rounded-md transition-all hover:scale-[1.05]'>Sau</button>
                    )}
                </div>
            </div>
            <div className='w-full flex items-center gap-2 mt-2'>
                <select value={toa} onChange={e => setToa(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chọn Tòa</option>
                    {toas.map((toa, index) => (
                        <option value={toa} key={index}>{toa}</option>
                    ))}
                </select>
                <select value={loaiPhong} onChange={e => setLoaiPhong(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chọn Loại Phòng</option>
                    <option value={'LT'}>Lý Thuyết</option>
                    <option value={'TH'}>Thực Hành</option>
                </select>
            </div>
            {maHocKy !== '' && (
                <div className='w-[1000px]'>
                    <div className='w-[1200px] justify-items-stretch grid grid-cols-8 items-stretch rounded-md mt-5 ' >
                        <div className='border-[1px] font-semibold border-[#bbb] h-[70px] flex items-center justify-center'>
                            Ca Học
                        </div>
                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day, index) => (
                            <div
                                key={day}
                                className="text-[14px] border-[1px] border-[#bbb] h-[70px] flex flex-col items-center justify-center"
                            >
                                <span>{day}</span>
                                <span>{getDateForDay(currentWeek.start, index)}</span>
                            </div>
                        ))}
                        <div className='border-[1px] font-semibold border-[#bbb] flex flex-col items-center justify-center'>
                            Sáng
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 2 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 1 + index ? 0 : 1 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 1 + index ? 0 : 1 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 0).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 3 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 2 + index ? 0 : 2 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 2 + index ? 0 : 2 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 1).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 4 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 3 + index ? 0 : 3 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 3 + index ? 0 : 3 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 2).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 5 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 4 + index ? 0 : 4 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 4 + index ? 0 : 4 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 3).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 6 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 5 + index ? 0 : 5 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 5 + index ? 0 : 5 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 4).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 7 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 6 + index ? 0 : 6 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 6 + index ? 0 : 6 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 5).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 1 && valuesArraySang.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 7 + index ? 0 : 7 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 7 + index ? 0 : 7 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 6).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArraySang.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] font-semibold border-[#bbb] flex flex-col items-center justify-center'>
                            Chiều
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 2 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 8 + index ? 0 : 8 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 8 + index ? 0 : 8 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 0).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 3 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 9 + index ? 0 : 9 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 9 + index ? 0 : 9 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>

                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 1).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 4 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 10 + index ? 0 : 10 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 10 + index ? 0 : 10 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 2).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 5 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 11 + index ? 0 : 11 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 11 + index ? 0 : 11 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 3).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 6 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 12 + index ? 0 : 12 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 12 + index ? 0 : 12 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 4).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 7 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 13 + index ? 0 : 13 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 13 + index ? 0 : 13 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 5).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 1 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 14 + index ? 0 : 14 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 14 + index ? 0 : 14 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 6).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayChieu.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] font-semibold border-[#bbb] flex flex-col items-center justify-center'>
                            Tối
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 2 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 15 + index ? 0 : 15 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 15 + index ? 0 : 15 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 0).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 3 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 16 + index ? 0 : 16 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 16 + index ? 0 : 16 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 1).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 4 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 17 + index ? 0 : 17 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 17 + index ? 0 : 17 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 2).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 5 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 18 + index ? 0 : 18 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 18 + index ? 0 : 18 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 3).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 6 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 19 + index ? 0 : 19 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 19 + index ? 0 : 19 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 4).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 7 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 20 + index ? 0 : 20 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 20 + index ? 0 : 20 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 5).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                        <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                            {dsTietFilter.map((item, index) => {
                                if (item.thoigian.ngay === 1 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                    const filter = changeRequests.filter(item1 => item1.response.data.tiet_id === item.thoigian._id && isDateGreaterEqual(`${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`, currentWeek.start) && isDateGreaterEqual(currentWeek.end, `${item1.response.data.date.year}-${item1.response.data.date.month}-${item1.response.data.date.day}`))[0]
                                    if (filter) {
                                        if (getDateForDayMonthYear(currentWeek.start, item.thoigian.ngay - 2).toString() !== `${filter.response.data.date.day}/${filter.response.data.date.month}/${filter.response.data.date.year}`) {
                                            return <div onClick={() => setSelected(selected === 21 + index ? 0 : 21 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                                <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                                <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                                <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                                <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                                <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                            </div>
                                        }
                                    } else {
                                        return <div onClick={() => setSelected(selected === 21 + index ? 0 : 21 + index)} style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                }
                            })}
                            {changeRequestsNestedFilter.map((item, index) => {
                                if (getDateForDayMonthYear(currentWeek.start, 6).toString() === `${item.newDate.day}/${item.newDate.month}/${item.newDate.year}` && valuesArrayToi.includes(item.tiet)) {
                                    return <div style={{ backgroundColor: item.phong.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='relative bg-[#f7f7f7] p-2 transition-all hover:scale-[1.05] rounded-lg gap-1 flex flex-col cursor-pointer items-center justify-center'>
                                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                        <span className='text-[13px] text-start w-full'>Tiết {item.tiet}</span>
                                        <span className='text-[13px] text-start w-full'>Phòng {item.phong.tenPhong}</span>
                                        <span className='text-[13px] text-start w-full'>GV: {item.giaoVien.tenGiaoVien}</span>
                                        <i className='text-[#2ecc71] text-[20px] absolute top-1 right-1 bx bx-transfer' ></i>
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Schedule