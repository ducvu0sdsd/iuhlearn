import { globalContext } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import { generateWeeks, getDateForDay, isDateGreater } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const XemLichPhong = ({ currentPhong, setCurrentPhong }) => {

    const { globalData } = useContext(globalContext)
    const [maHocKy, setMaHocKy] = useState('')
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsTiet, setDsTiet] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [currentWeek, setCurrentWeek] = useState(
        {
            start: '',
            end: ''
        }
    )
    const [weeks, setWeeks] = useState([])
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

    useEffect(() => {
        if (maHocKy !== '' && currentPhong && currentWeek.start !== '' && currentIndex !== -1) {
            api({ type: TypeHTTP.POST, sendToken: true, body: { maHocKy }, path: '/hocphan/get-by-hoc-ky' })
                .then(res => {
                    const arr = []
                    res.forEach(item => {
                        if (item.monHoc.soTietLyThuyet === 30) {
                            if (currentIndex < 10) {
                                if (item.tietLyThuyet[0].phong.maPhong === currentPhong._id) {
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
                                if (item.tietLyThuyet[0].phong.maPhong === currentPhong._id) {
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
                                    if (item1.phong.maPhong === currentPhong._id) {
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
                    setDsTiet(arr)
                })
        }
    }, [maHocKy, currentPhong, currentWeek, currentIndex])


    const handlePrev = () => {
        setCurrentWeek(weeks[currentIndex - 1])
        setCurrentIndex(prev => prev - 1)
    }

    const handleNext = () => {
        setCurrentWeek(weeks[currentIndex + 1])
        setCurrentIndex(prev => prev + 1)
    }

    return (
        <div className='min-w-[100%] h-[95%] flex flex-col relative items-start justify-center gap-2'>
            <div className='flex items-center gap-2'>
                <div onClick={() => setCurrentPhong()} className='flex items-center pl-2 cursor-pointer'>
                    <i className='text-[25px] bx bx-chevron-left'></i>
                    <span className='text-[14px]'>Trở về</span>
                </div>
                {currentPhong && (
                    <>
                        <div className='text-[14px]'>
                            (Phòng {currentPhong.tenPhong} - {currentPhong.loai === 'LT' ? 'Lý Thuyết' : 'Thực Hành'})
                        </div>
                    </>
                )}
            </div>
            <div className='flex items-start flex-col justify-start w-full h-[95%]'>
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
                {maHocKy !== '' && (
                    <div className='w-[1000px] h-screen overflow-auto'>
                        <div className='w-[1200px] justify-items-stretch grid grid-cols-8 items-stretch rounded-md overflow-hidden mt-5 ' >
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
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 2 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 3 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 4 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 5 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 6 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 7 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 1 && valuesArraySang.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] font-semibold border-[#bbb] flex flex-col items-center justify-center'>
                                Chiều
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 2 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 3 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 4 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 5 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 6 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 7 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 1 && valuesArrayChieu.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] font-semibold border-[#bbb] flex flex-col items-center justify-center'>
                                Tối
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 2 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 3 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 4 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 5 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 6 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 7 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                            <div className='border-[1px] gap-2 p-2 text-start border-[#bbb] flex flex-col items-center justify-start'>
                                {dsTiet.map((item, index) => {
                                    if (item.thoigian.ngay === 1 && valuesArrayToi.includes(item.thoigian.tiet)) {
                                        return <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                                            <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                                            <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                                            <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                                            <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                                            <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                                        </div>
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default XemLichPhong