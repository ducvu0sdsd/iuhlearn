import { adminContext } from '@/context/adminContext'
import { dkhpContext } from '@/context/dkhpContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { kiemTraPhong, kiemTraPhongTrung, kiemTraThoiGian } from '@/utils/kiemTraTietNgay'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateHocPhanForm = ({ visible }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const { dkhpData } = useContext(dkhpContext)
    const [dsGiaoVien, setDsGiaoVien] = useState([])
    const [dsMonHoc, setDsMonHoc] = useState([])
    const [dsLop, setDsLop] = useState([])
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsPhong, setDsPhong] = useState([])
    const [hocPhan, setHocPhan] = useState({
        monHoc: { maMon: '' },
        lop: { maLop: '' },
        hocKy: { maHocKy: '' },
        loaiDangKy: ''
    })
    const [tietLyThuyet, setTietLyThuyet] = useState({
        ngay: '',
        tiet: '',
        phong: {
            maPhong: '',
            tenPhong: ''
        },
        giaoVien: {
            maGiaoVien: '',
            tenGiaoVien: ''
        },
        siSoToiDa: '',
    })
    const [tietThucHanhNhom1, setTietThucHanhNhom1] = useState({
        ngay: '',
        tiet: '',
        phong: {
            maPhong: '',
            tenPhong: ''
        },
        giaoVien: {
            maGiaoVien: '',
            tenGiaoVien: ''
        },
        siSoToiDa: '',
    })
    const [tietThucHanhNhom2, setTietThucHanhNhom2] = useState(null)
    const [tietThucHanhNhom3, setTietThucHanhNhom3] = useState(null)
    const [batBuoc, setBatBuoc] = useState(true)
    const [tienQuyet, setTienQuyet] = useState(true)
    const [hocTruoc, setHocTruoc] = useState([])
    const [songHanh, setSongHanh] = useState([])
    const [trangThai, setTrangThai] = useState('')


    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/monhoc/get-all' })
            .then(monhocs => {
                setDsMonHoc(monhocs)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/giaovien/get-all' })
            .then(giaovien => {
                setDsGiaoVien(giaovien)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/lop/get-all' })
            .then(lop => {
                setDsLop(lop)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/hocky/get-all' })
            .then(hocky => {
                setDsHocKy(hocky)
            })
        api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' })
            .then(phongs => {
                setDsPhong(phongs)
            })
    }, [])

    const handleCreateHocPhan = () => {
        if (hocPhan.monHoc.maMon === '') {
            globalHandler.notify(notifyType.WARNING, "Môn Học Không Hợp Lệ")
            return
        }
        if (hocPhan.lop._id === '') {
            globalHandler.notify(notifyType.WARNING, "Lớp Học Không Hợp Lệ")
            return
        }
        if (hocPhan.hocKy.maHocKy === '') {
            globalHandler.notify(notifyType.WARNING, "Học Kỳ Không Hợp Lệ")
            return
        }
        if (hocPhan.loaiDangKy === '') {
            globalHandler.notify(notifyType.WARNING, "Loại Đăng Ký Không Hợp Lệ")
            return
        }
        if (trangThai === '') {
            globalHandler.notify(notifyType.WARNING, "Trạng Thái Không Hợp Lệ")
            return
        }
        if (tietLyThuyet.giaoVien._id === '') {
            globalHandler.notify(notifyType.WARNING, "Giáo Viên Lý Thuyết Không Hợp Lệ")
            return
        }
        // if (tietLyThuyet.ngay === '') {
        //     globalHandler.notify(notifyType.WARNING, "Ngày Học Lý Thuyết Không Hợp Lệ")
        //     return
        // }
        // if (tietLyThuyet.phong._id === '') {
        //     globalHandler.notify(notifyType.WARNING, "Phòng Học Lý Thuyết Không Hợp Lệ")
        //     return
        // }
        // if (tietLyThuyet.phong.loai === 'TH') {
        //     globalHandler.notify(notifyType.WARNING, "Vui lòng chọn phòng học lý thuyết cho tiết lý thuyết")
        //     return
        // }
        if (tietLyThuyet.siSoToiDa === '') {
            globalHandler.notify(notifyType.WARNING, "Sỉ Số Lý Thuyết Không Hợp Lệ")
            return
        }
        // if (tietLyThuyet.tiet === '') {
        //     globalHandler.notify(notifyType.WARNING, "Tiết Học Lý Thuyết Không Hợp Lệ")
        //     return
        // }

        const tietThucHanh = []
        if (tietThucHanhNhom1.giaoVien && tietThucHanhNhom1.siSoToiDa) {
            tietThucHanh.push(tietThucHanhNhom1)
        }
        if (tietThucHanhNhom2) {
            tietThucHanh.push(tietThucHanhNhom2)
        }
        if (tietThucHanhNhom3) {
            tietThucHanh.push(tietThucHanhNhom3)
        }
        if (kiemTraThoiGian([tietLyThuyet, ...tietThucHanh]) === false) {
            globalHandler.notify(notifyType.WARNING, "Tiết học bị trùng thời gian")
        }

        const body = {
            ...hocPhan,
            tietLyThuyet,
            tietThucHanh: tietThucHanh,
            tienQuyet,
            batBuoc,
            hocTruoc,
            songHanh,
            trangThai
        }
        globalHandler.notify(notifyType.LOADING, "Đang Tạo Học Phần")
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/hocphan/create' })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, "Tạo Học Phần Thành Công")
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 500);
            })
    }

    return (
        <div style={visible ? { width: '1200px', padding: '15px', maxHeight: '570px', overflowY: 'auto' } : { width: 0, height: 0, padding: 0 }} className='overflow-y-hidden bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Học Phần</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <select value={hocPhan.monHoc.maMon} onChange={e => setHocPhan({ ...hocPhan, monHoc: { maMon: e.target.value } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Môn Học</option>
                    {dsMonHoc.map((monhoc, index) => (
                        <option value={monhoc._id} key={index}>{monhoc.tenMon}</option>
                    ))}
                </select>
                <select value={hocPhan.lop._id} onChange={e => setHocPhan({ ...hocPhan, lop: { maLop: e.target.value } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Lớp</option>
                    {dsLop.map((lop, index) => (
                        <option value={lop._id} key={index}>{lop.tenLop}</option>
                    ))}
                </select>
                <select value={hocPhan.hocKy._id} onChange={e => setHocPhan({ ...hocPhan, hocKy: { maHocKy: e.target.value } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Học Kỳ</option>
                    {dsHocKy.map((hocKy, index) => (
                        <option value={hocKy._id} key={index}>{hocKy.tenHocKy}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setBatBuoc(Boolean(e.target.value))} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value={true}>Bắt Buộc</option>
                    <option value={false}>Không Bắt Buộc</option>
                </select>
                <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>
                    <input value={tienQuyet ? 'on' : 'off'} type='checkbox' onChange={e => setTienQuyet(e.target.value === 'on' ? true : false)} className='w-[15px] h-[15px]' />
                    <span>Môn Tiên Quyết</span>
                </div>
                <select value={hocPhan.loaiDangKy} onChange={e => setHocPhan({ ...hocPhan, loaiDangKy: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Loại Đăng Ký</option>
                    <option value='Đăng Ký Mới'>Đăng Ký Mới</option>
                    <option value='Đăng Ký Học Lại'>Đăng Ký Học Lại</option>
                    <option value='Đăng Ký Học Cải Thiện'>Đăng Ký Học Cải Thiện</option>
                </select>
            </div>
            <div className='flex justify-evenly mb-1'>
                <select value={trangThai} onChange={e => setTrangThai(e.target.value)} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Trạng Thái</option>
                    <option value='Mở Lớp'>Mở Lớp</option>
                    <option value='Đã Khóa'>Đã Khóa</option>
                    <option value='Lên Kế Hoạch'>Lên Kế Hoạch</option>
                </select>
                <select onChange={e => {
                    if (e.target.value !== '' && !hocTruoc.map(item => item.maMon).includes(e.target.value)) setHocTruoc([...hocTruoc, { maMon: e.target.value, tenMon: dsMonHoc.filter(item => item._id + "" === e.target.value + "")[0]?.tenMon }]);
                    e.target.selectedIndex = 0
                }} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Môn Học Trước</option>
                    {dsMonHoc.map((monhoc, index) => (
                        <option value={monhoc._id} key={index}>{monhoc.tenMon}</option>
                    ))}
                </select>
                <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>
                    <h3>Học Trước: </h3>
                    {hocTruoc.map((item, index) => (
                        <div key={index} className='flex gap-1 bg-[#999] px-2 py-1 w-[110px] overflow-hidden h-[30px] text-[white] rounded-lg'>
                            <span>{item.tenMon}</span>
                            <button onClick={() => setHocTruoc(prev => prev.filter(p => p.maMon !== item.maMon))} className='rounded-full h-[20px] text-[22px] w-[20px] bg-[#999] text-[white] flex items-center justify-center'><i className='bx bx-x'></i></button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-evenly mb-1'>
                <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>

                </div>
                <select onChange={e => {
                    if (e.target.value !== '' && !songHanh.map(item => item.maMon).includes(e.target.value)) setSongHanh([...songHanh, { maMon: e.target.value, tenMon: dsMonHoc.filter(item => item._id + "" === e.target.value + "")[0]?.tenMon }]);
                    e.target.selectedIndex = 0
                }} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Môn Học Song Hành</option>
                    {dsMonHoc.map((monhoc, index) => (
                        <option value={monhoc._id} key={index}>{monhoc.tenMon}</option>
                    ))}
                </select>
                <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>
                    <h3>Song Hành: </h3>
                    {songHanh.map((item, index) => (
                        <div key={index} className='flex gap-1 bg-[#999] px-2 py-1 w-[110px] overflow-hidden h-[30px] text-[white] rounded-lg'>
                            <span>{item.tenMon}</span>
                            <button onClick={() => setSongHanh(prev => prev.filter(p => p.maMon !== item.maMon))} className='rounded-full h-[20px] text-[22px] w-[20px] bg-[#999] text-[white] flex items-center justify-center'><i className='bx bx-x'></i></button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex flex-col mb-1'>
                <h3 className='font-medium text-[14px] mb-2'>Tiết Lý Thuyết</h3>
                <div className='flex justify-evenly mb-1' s>
                    {/* <select value={tietLyThuyet.ngay} onChange={e => setTietLyThuyet({ ...tietLyThuyet, ngay: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value=''>Chọn Ngày Trong Tuần</option>
                        <option value={2}>Thứ Hai</option>
                        <option value={3}>Thứ Ba</option>
                        <option value={4}>Thứ Tư</option>
                        <option value={5}>Thứ Năm</option>
                        <option value={6}>Thứ Sáu</option>
                        <option value={7}>Thứ Bảy</option>
                        <option value={1}>Chủ Nhật</option>
                    </select>
                    <select value={tietLyThuyet.tiet} onChange={e => setTietLyThuyet({ ...tietLyThuyet, tiet: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value=''>Chọn Thời Gian</option>
                        <option value={'1-2'}>{'Tiết 1-2 (6h30 - 8h10)'}</option>
                        <option value={'1-3'}>{'Tiết 1-3 (6h30 - 9h)'}</option>
                        <option value={'2-3'}>{'Tiết 2-3 (7h20 - 9h)'}</option>
                        <option value={'3-4'}>{'Tiết 3-4 (8h10 - 10h)'}</option>
                        <option value={'4-5'}>{'Tiết 4-5 (9h10 - 10h50)'}</option>
                        <option value={'4-6'}>{'Tiết 4-6 (9h10 - 11h40)'}</option>
                        <option value={'5-6'}>{'Tiết 5-6 (10h - 11h40)'}</option>
                        <option value={'7-8'}>{'Tiết 7-8 (12h30 - 14h10)'}</option>
                        <option value={'7-9'}>{'Tiết 7-9 (12h30 - 15h)'}</option>
                        <option value={'8-9'}>{'Tiết 8-9 (13h20 - 15h)'}</option>
                        <option value={'10-11'}>{'Tiết 10-11 (15h10 - 16h50)'}</option>
                        <option value={'10-12'}>{'Tiết 10-12 (15h10 - 17h40)'}</option>
                        <option value={'11-12'}>{'Tiết 11-12 (16h - 17h40)'}</option>
                        <option value={'13-14'}>{'Tiết 13-14 (18h - 19h40)'}</option>
                        <option value={'13-15'}>{'Tiết 13-15 (18h - 20h40)'}</option>
                    </select> */}
                    {/* <select onChange={e => setTietLyThuyet({ ...tietLyThuyet, phong: { maPhong: e.target.value.split("-")[0], tenPhong: e.target.value.split('-')[1], loai: e.target.value.split('-')[2] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value='-'>Chọn Phòng</option>
                        {dsPhong.map((phong, index) => (
                            <option value={`${phong._id}-${phong.tenPhong}-${phong.loai}`} key={index}>{phong.tenPhong}</option>
                        ))}
                    </select> */}
                    <select onChange={e => setTietLyThuyet({ ...tietLyThuyet, giaoVien: { maGiaoVien: e.target.value.split('-')[0], tenGiaoVien: e.target.value.split('-')[1] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value='-'>Giáo Viên</option>
                        {dsGiaoVien.map((giaoVien, index) => (
                            <option value={`${giaoVien._id}-${giaoVien.hoTen}`} key={index}>{giaoVien.hoTen}</option>
                        ))}
                    </select>
                    <input value={tietLyThuyet.siSoToiDa} onChange={e => setTietLyThuyet({ ...tietLyThuyet, siSoToiDa: Number(e.target.value) })} placeholder='Sinh Viên Tối Đa Đăng Ký' className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                    <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start' />
                </div>
            </div>
            <div className='flex flex-col mb-1'>
                <h3 className='font-medium text-[14px] mb-2'>Tiết Thực Hành {tietThucHanhNhom2 && 'Nhóm 1'}</h3>
                <div className='flex justify-evenly mb-1'>
                    {/* <select onChange={e => setTietThucHanhNhom1({ ...tietThucHanhNhom1, ngay: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value={''}>Chọn Ngày Trong Tuần</option>
                        <option value={2}>Thứ Hai</option>
                        <option value={3}>Thứ Ba</option>
                        <option value={4}>Thứ Tư</option>
                        <option value={5}>Thứ Năm</option>
                        <option value={6}>Thứ Sáu</option>
                        <option value={7}>Thứ Bảy</option>
                        <option value={1}>Chủ Nhật</option>
                    </select>
                    <select onChange={e => setTietThucHanhNhom1({ ...tietThucHanhNhom1, tiet: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value={''}>Chọn Thời Gian</option>
                        <option value={'1-2'}>{'Tiết 1-2 (6h30 - 8h10)'}</option>
                        <option value={'1-3'}>{'Tiết 1-3 (6h30 - 9h)'}</option>
                        <option value={'2-3'}>{'Tiết 2-3 (7h20 - 9h)'}</option>
                        <option value={'3-4'}>{'Tiết 3-4 (8h10 - 10h)'}</option>
                        <option value={'4-5'}>{'Tiết 4-5 (9h10 - 10h50)'}</option>
                        <option value={'4-6'}>{'Tiết 4-6 (9h10 - 11h40)'}</option>
                        <option value={'5-6'}>{'Tiết 5-6 (10h - 11h40)'}</option>
                        <option value={'7-8'}>{'Tiết 7-8 (12h30 - 14h10)'}</option>
                        <option value={'7-9'}>{'Tiết 7-9 (12h30 - 15h)'}</option>
                        <option value={'8-9'}>{'Tiết 8-9 (13h20 - 15h)'}</option>
                        <option value={'10-11'}>{'Tiết 10-11 (15h10 - 16h50)'}</option>
                        <option value={'10-12'}>{'Tiết 10-12 (15h10 - 17h40)'}</option>
                        <option value={'11-12'}>{'Tiết 11-12 (16h - 17h40)'}</option>
                        <option value={'13-14'}>{'Tiết 13-14 (18h - 19h40)'}</option>
                        <option value={'13-15'}>{'Tiết 13-15 (18h - 20h40)'}</option>
                    </select> */}
                    {/* <select onChange={e => setTietThucHanhNhom1({ ...tietThucHanhNhom1, phong: { maPhong: e.target.value.split("-")[0], tenPhong: e.target.value.split('-')[1], loai: e.target.value.split('-')[2] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value=''>Chọn Phòng</option>
                        {dsPhong.map((phong, index) => (
                            <option value={`${phong._id}-${phong.tenPhong}-${phong.loai}`} key={index}>{phong.tenPhong}</option>
                        ))}
                    </select> */}
                    <select onChange={e => setTietThucHanhNhom1({ ...tietThucHanhNhom1, giaoVien: { maGiaoVien: e.target.value.split('-')[0], tenGiaoVien: e.target.value.split('-')[1] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                        <option value={null}>Giáo Viên</option>
                        {dsGiaoVien.map((giaoVien, index) => (
                            <option value={`${giaoVien._id}-${giaoVien.hoTen}`} key={index}>{giaoVien.hoTen}</option>
                        ))}
                    </select>
                    <input value={tietThucHanhNhom1.siSoToiDa} onChange={e => setTietThucHanhNhom1({ ...tietThucHanhNhom1, siSoToiDa: Number(e.target.value) })} placeholder='Sinh Viên Tối Đa Đăng Ký' className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                    {!tietThucHanhNhom2 ? <div onClick={() => setTietThucHanhNhom2({
                        ngay: null,
                        tiet: null,
                        phong: {
                            maPhong: '',
                            tenPhong: ''
                        },
                        giaoVien: null,
                        siSoToiDa: null,
                    })} className='hover:underline w-[30%] text-[14px] gap-2 flex items-center justify-start'>
                        + Thêm Nhóm Thực Hành
                    </div> : <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>

                    </div>}
                </div>
            </div>
            {tietThucHanhNhom2 && <>
                <div className='flex flex-col mb-1'>
                    <h3 className='font-medium text-[14px] mb-2'>Tiết Thực Hành Nhóm 2</h3>
                    <div className='flex justify-evenly mb-1'>
                        {/* <select onChange={e => setTietThucHanhNhom2({ ...tietThucHanhNhom2, ngay: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Ngày Trong Tuần</option>
                            <option value={2}>Thứ Hai</option>
                            <option value={3}>Thứ Ba</option>
                            <option value={4}>Thứ Tư</option>
                            <option value={5}>Thứ Năm</option>
                            <option value={6}>Thứ Sáu</option>
                            <option value={7}>Thứ Bảy</option>
                            <option value={1}>Chủ Nhật</option>
                        </select>
                        <select onChange={e => setTietThucHanhNhom2({ ...tietThucHanhNhom2, tiet: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Thời Gian</option>
                            <option value={'1-2'}>{'Tiết 1-2 (6h30 - 8h10)'}</option>
                            <option value={'1-3'}>{'Tiết 1-3 (6h30 - 9h)'}</option>
                            <option value={'2-3'}>{'Tiết 2-3 (7h20 - 9h)'}</option>
                            <option value={'3-4'}>{'Tiết 3-4 (8h10 - 10h)'}</option>
                            <option value={'4-5'}>{'Tiết 4-5 (9h10 - 10h50)'}</option>
                            <option value={'4-6'}>{'Tiết 4-6 (9h10 - 11h40)'}</option>
                            <option value={'5-6'}>{'Tiết 5-6 (10h - 11h40)'}</option>
                            <option value={'7-8'}>{'Tiết 7-8 (12h30 - 14h10)'}</option>
                            <option value={'7-9'}>{'Tiết 7-9 (12h30 - 15h)'}</option>
                            <option value={'8-9'}>{'Tiết 8-9 (13h20 - 15h)'}</option>
                            <option value={'10-11'}>{'Tiết 10-11 (15h10 - 16h50)'}</option>
                            <option value={'10-12'}>{'Tiết 10-12 (15h10 - 17h40)'}</option>
                            <option value={'11-12'}>{'Tiết 11-12 (16h - 17h40)'}</option>
                            <option value={'13-14'}>{'Tiết 13-14 (18h - 19h40)'}</option>
                            <option value={'13-15'}>{'Tiết 13-15 (18h - 20h40)'}</option>
                        </select> */}
                        {/* <select onChange={e => setTietThucHanhNhom2({ ...tietThucHanhNhom2, phong: { maPhong: e.target.value.split("-")[0], tenPhong: e.target.value.split('-')[1], loai: e.target.value.split('-')[2] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Phòng</option>
                            {dsPhong.map((phong, index) => (
                                <option value={`${phong._id}-${phong.tenPhong}-${phong.loai}`} key={index}>{phong.tenPhong}({phong.loai})</option>
                            ))}
                        </select> */}
                        <select onChange={e => setTietThucHanhNhom2({ ...tietThucHanhNhom2, giaoVien: { maGiaoVien: e.target.value.split('-')[0], tenGiaoVien: e.target.value.split('-')[1] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Giáo Viên</option>
                            {dsGiaoVien.map((giaoVien, index) => (
                                <option value={`${giaoVien._id}-${giaoVien.hoTen}`} key={index}>{giaoVien.hoTen}</option>
                            ))}
                        </select>
                        <input value={tietThucHanhNhom2.siSoToiDa} onChange={e => setTietThucHanhNhom2({ ...tietThucHanhNhom2, siSoToiDa: Number(e.target.value) })} placeholder='Sinh Viên Tối Đa Đăng Ký' className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                        {!tietThucHanhNhom3 ? <div onClick={() => setTietThucHanhNhom3({
                            ngay: null,
                            tiet: null,
                            phong: {
                                maPhong: '',
                                tenPhong: ''
                            },
                            giaoVien: null,
                            siSoToiDa: null,
                        })} className='hover:underline w-[30%] text-[14px] gap-2 flex items-center justify-start'>
                            + Thêm Nhóm Thực Hành
                        </div> : <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>

                        </div>}
                    </div>
                </div>
            </>}
            {tietThucHanhNhom3 && <>
                <div className='flex flex-col mb-1'>
                    <h3 className='font-medium text-[14px] mb-2'>Tiết Thực Hành Nhóm 3</h3>
                    <div className='flex justify-evenly mb-1'>
                        {/* <select onChange={e => setTietThucHanhNhom3({ ...tietThucHanhNhom3, ngay: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Ngày Trong Tuần</option>
                            <option value={2}>Thứ Hai</option>
                            <option value={3}>Thứ Ba</option>
                            <option value={4}>Thứ Tư</option>
                            <option value={5}>Thứ Năm</option>
                            <option value={6}>Thứ Sáu</option>
                            <option value={7}>Thứ Bảy</option>
                            <option value={1}>Chủ Nhật</option>
                        </select>
                        <select onChange={e => setTietThucHanhNhom3({ ...tietThucHanhNhom3, tiet: e.target.value })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Thời Gian</option>
                            <option value={'1-2'}>{'Tiết 1-2 (6h30 - 8h10)'}</option>
                            <option value={'1-3'}>{'Tiết 1-3 (6h30 - 9h)'}</option>
                            <option value={'2-3'}>{'Tiết 2-3 (7h20 - 9h)'}</option>
                            <option value={'3-4'}>{'Tiết 3-4 (8h10 - 10h)'}</option>
                            <option value={'4-5'}>{'Tiết 4-5 (9h10 - 10h50)'}</option>
                            <option value={'4-6'}>{'Tiết 4-6 (9h10 - 11h40)'}</option>
                            <option value={'5-6'}>{'Tiết 5-6 (10h - 11h40)'}</option>
                            <option value={'7-8'}>{'Tiết 7-8 (12h30 - 14h10)'}</option>
                            <option value={'7-9'}>{'Tiết 7-9 (12h30 - 15h)'}</option>
                            <option value={'8-9'}>{'Tiết 8-9 (13h20 - 15h)'}</option>
                            <option value={'10-11'}>{'Tiết 10-11 (15h10 - 16h50)'}</option>
                            <option value={'10-12'}>{'Tiết 10-12 (15h10 - 17h40)'}</option>
                            <option value={'11-12'}>{'Tiết 11-12 (16h - 17h40)'}</option>
                            <option value={'13-14'}>{'Tiết 13-14 (18h - 19h40)'}</option>
                            <option value={'13-15'}>{'Tiết 13-15 (18h - 20h40)'}</option>
                        </select> */}
                        {/* <select onChange={e => setTietThucHanhNhom3({ ...tietThucHanhNhom3, phong: { maPhong: e.target.value.split("-")[0], tenPhong: e.target.value.split('-')[1], loai: e.target.value.split('-')[2] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Chọn Phòng</option>
                            {dsPhong.map((phong, index) => (
                                <option value={`${phong._id}-${phong.tenPhong}-${phong.loai}`} key={index}>{phong.tenPhong}</option>
                            ))}
                        </select> */}
                        <select onChange={e => setTietThucHanhNhom3({ ...tietThucHanhNhom3, giaoVien: { maGiaoVien: e.target.value.split('-')[0], tenGiaoVien: e.target.value.split('-')[1] } })} className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                            <option value=''>Giáo Viên</option>
                            {dsGiaoVien.map((giaoVien, index) => (
                                <option value={`${giaoVien._id}-${giaoVien.hoTen}`} key={index}>{giaoVien.hoTen}</option>
                            ))}
                        </select>
                        <input value={tietThucHanhNhom3.siSoToiDa} onChange={e => setTietThucHanhNhom3({ ...tietThucHanhNhom3, siSoToiDa: Number(e.target.value) })} placeholder='Sinh Viên Tối Đa Đăng Ký' className='w-[30%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                        <div className='w-[30%] text-[14px] gap-2 flex items-center justify-start'>

                        </div>
                    </div>
                </div>
            </>}
            <div className='flex justify-end gap-2'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateHocPhan()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>

    )
}

export default CreateHocPhanForm