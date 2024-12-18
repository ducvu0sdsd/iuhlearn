import { globalContext } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useEffect, useState } from 'react'

const TimPhongSinhVien = () => {
    const [phongs, setPhongs] = useState([])
    const [dsGiaoVien, setDsGiaoVien] = useState([])
    const [toas, setToas] = useState([])
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsHocPhan, setDsHocPhan] = useState([])
    const [dsTiet, setDsTiet] = useState([])
    const [student, setStudent] = useState()
    const { globalData } = useContext(globalContext)
    const [dsTietFilter, setDsTietFilter] = useState([])

    //selected
    const [toa, setToa] = useState('')
    const [loaiPhong, setLoaiPhong] = useState('')
    const [magiaoVien, setMaGiaoVien] = useState('')
    const [maHocKy, setMaHocKy] = useState('')

    useEffect(() => setStudent(globalData.student), [globalData.student])

    useEffect(() => {
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
        api({ sendToken: true, type: TypeHTTP.GET, path: '/giaovien/get-all' })
            .then(giaovien => {
                setDsGiaoVien(giaovien)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(hocky => {
                setDsHocKy(hocky)
                setMaHocKy(hocky[hocky.length - 1]._id)
            })
    }, [])

    useEffect(() => {
        if (maHocKy !== '' && student) {
            api({ type: TypeHTTP.POST, sendToken: true, body: { maHocKy }, path: '/hocphan/get-by-hoc-ky' })
                .then(res => {
                    const filter = res.filter(item => {
                        return [...item.tietLyThuyet[0].dsSinhVien, ...item.tietThucHanh.map(item => item.dsSinhVien).flat()].includes(student._id)
                    })
                    setDsHocPhan(filter)
                    const arr = []
                    filter.forEach(item => {
                        arr.push({
                            tenMon: item.monHoc.tenMon,
                            tenLop: item.lop.tenLop,
                            loai: 'LT',
                            thoigian: item.tietLyThuyet[0]
                        })
                        item.tietThucHanh.forEach((item1) => {
                            if (item1.dsSinhVien.includes(student._id)) {
                                arr.push({
                                    tenMon: item.monHoc.tenMon,
                                    tenLop: item.lop.tenLop,
                                    loai: 'TH',
                                    thoigian: item1
                                })
                            }
                        })
                    })
                    setDsTiet(arr)
                    setDsTietFilter(arr)
                })
        }
    }, [maHocKy, student])

    useEffect(() => {
        if (toa === '' && loaiPhong === '' && magiaoVien === '') {
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
            if (magiaoVien !== '') {
                arr = arr.filter(item => item.thoigian.giaoVien.maGiaoVien === magiaoVien)
            }
            setDsTietFilter(arr)
        }
    }, [toa, loaiPhong, magiaoVien, maHocKy])

    return (
        <div className='flex flex-col w-full h-[88%]'>
            <div className='w-full flex items-center gap-2'>
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
                <select value={magiaoVien} onChange={e => setMaGiaoVien(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chọn Giáo Viên</option>
                    {dsGiaoVien.map((gv, index) => (
                        <option value={gv._id} key={index}>{gv.hoTen}</option>
                    ))}
                </select>
                <select value={maHocKy} onChange={e => setMaHocKy(e.target.value)} className='w-[150px] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    {dsHocKy.map((hk, index) => (
                        <option value={hk._id} key={index}>{hk.tenHocKy}</option>
                    ))}
                </select>
            </div>
            <div className='w-full grid grid-cols-5 gap-2 mt-[1rem] max-h-[100%] overflow-y-auto'>
                {dsTietFilter.map((item, index) => (
                    <div style={{ backgroundColor: item.loai === 'LT' ? '#f7f7f7' : '#a3e4d7' }} key={index} className='bg-[#f7f7f7] p-2 rounded-lg gap-1 flex flex-col items-center justify-center'>
                        <span className='font-medium text-[14px] text-start w-full'>{item.tenMon}</span>
                        <span className='text-[13px] text-start w-full'>{item.tenLop}</span>
                        <span className='text-[13px] text-start w-full'>Tiết {item.thoigian.tiet}</span>
                        <span className='text-[13px] text-start w-full'>Phòng {item.thoigian.phong.tenPhong}</span>
                        <span className='text-[13px] text-start w-full'>GV: {item.thoigian.giaoVien.tenGiaoVien}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TimPhongSinhVien