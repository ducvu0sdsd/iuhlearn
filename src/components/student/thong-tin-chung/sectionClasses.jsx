'use client'
import { globalContext } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const SectionClasses = () => {
    const [dsHocKy, setDsHocKy] = useState([])
    const [dsHocPhanDaDangKy, setDsHocPhanDaDangKy] = useState([])
    const { globalData } = useContext(globalContext)

    useEffect(() => {
        api({ port: ports.otherServiceURL, sendToken: true, type: TypeHTTP.GET, path: '/hocky' })
            .then(res => setDsHocKy(res))
    })

    const handleChange = (maHocKy) => {
        api({ type: TypeHTTP.GET, sendToken: true, port: ports.dkhpServiceURL, path: `/dkhp/get-by-mhk-mssv?mssv=${globalData.student?.mssv}&maHocKy=${maHocKy}` })
            .then(hocphans => {
                setDsHocPhanDaDangKy(hocphans)
            })
    }

    return (
        <div className='border-[1px] rounded-lg px-[20px] py-[10px] flex flex-col gap-3 h-full overflow-auto relative'>
            <div className='w-full flex justify-between'>
                <h3 className='font-medium'>Lớp Học Phần</h3>
                <select onChange={e => handleChange(e.target.value)} className='text-[13px] focus:outline-none border-[1px] rounded-md px-[10px] py-[7px]'>
                    <option value={''}>Chọn Học Kỳ</option>
                    {dsHocKy.map((semester, index) => {
                        return <option value={semester.maHocKy} key={index}>{semester.tenHocKy}</option>
                    })}
                </select>
            </div>
            {dsHocPhanDaDangKy.length > 0 ? (
                <table className='w-full overflow-auto'>
                    <thead className='text-[14px] h-[50px] font-medium text-[#373737]'>
                        <tr className='w-full'>
                            <th className='w-[80%] text-start'>Môn Học/Học Phần</th>
                            <th>Số Tín Chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dsHocPhanDaDangKy.map((classItem, index) => {
                            return <tr key={index} className='py-[10px] w-full h-[60px]'>
                                <td className='flex flex-col'>
                                    <span className='text-[14px]'>{classItem.hocPhan.maHocPhan}</span>
                                    <span className='text-[14px]'>{classItem.hocPhan.monHoc.tenMon}</span>
                                </td>
                                <td className='text-center text-[14px]'>{classItem.hocPhan.monHoc.soTinChi}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            ) : (
                <span className='text-[14px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>Vui lòng chọn học kỳ hiển thị !!!</span>
            )}
        </div>
    )
}

export default SectionClasses