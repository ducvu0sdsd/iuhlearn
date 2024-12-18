'use client'
import { globalContext, notifyType } from '@/context/globalContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'

const Navbar = () => {
    const { globalHandler, globalData } = useContext(globalContext)
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSignOut = () => {
        globalHandler.notify(notifyType.LOADING, "Go Out")
        globalThis.localStorage.removeItem('accessToken')
        globalThis.localStorage.removeItem('refreshToken')
        globalThis.localStorage.removeItem('role')
        globalHandler.setManagement()
        globalHandler.setStudent()
        globalHandler.setTeacher()
        setTimeout(() => {
            globalHandler.notify(notifyType.NONE, "")
            router.push("/")
        }, 1000);
    }

    return (
        <div className='w-[250px] z-10 bg-[white] border-r-[1px] h-screen border-[#e0e0e0] pt-[10px] flex flex-col gap-3 shadow-xl'>
            <div className=' flex flex-col gap-3 h-screen w-full overflow-y-auto px-[15px]'>
                <div className='flex w-full items-center justify-start gap-4 mb-[15px]'>
                    <img src='/logo.png' width={'45px'} />
                    <span className='text-[12px] w-[200px] font-medium translate-y-[5px]'>INDUSTRIAL UNIVERSITY OF HOCHIMINH CITY</span>
                </div>
                {globalData.student &&
                    (<>
                        <Link href={'/thong-tin-chung'}>
                            <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                <img src='/student.png' width={'32px'} />
                                <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Thông Tin Chung</span>
                            </div>
                        </Link>
                        <Link href={"/doi-mat-khau-sinh-vien"}>
                            <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                <img src='/signup.png' width={'32px'} />
                                <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Đổi mật khẩu</span>
                            </div>
                        </Link>
                    </>)
                }
                {globalData.teacher &&
                    (<>
                        <Link href={'/thong-tin'}>
                            <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                <img src='/student.png' width={'32px'} />
                                <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Thông Tin Giáo Viên</span>
                            </div>
                        </Link>
                        <Link href={"/doi-mat-khau-giao-vien"}>
                            <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                <img src='/signup.png' width={'32px'} />
                                <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Đổi mật khẩu</span>
                            </div>
                        </Link>
                    </>)
                }
                {globalData.management && (
                    (<>
                        {globalData.management.role === 'ADMIN' ? (<>
                            <Link href={'/quan-ly-sinh-vien'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/sinhvien.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Sinh Viên</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-giao-vien'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/teacher.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Giáo Viên</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-khoa'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/khoa.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Khoa</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-chuyen-nganh'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/chuyennganh.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Chuyên Ngành</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-he-dao-tao'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/hedaotao.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Hệ Đào Tạo</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-phong'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/phong.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Phòng</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-lop'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/lop.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Lớp</span>
                                </div>
                            </Link>

                            <Link href={'/quan-ly-mon-hoc'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/monhoc2.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Môn Học</span>
                                </div>
                            </Link>
                            <Link href={'/quan-ly-hoc-ky'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/hocky.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Quản Lý Học Kỳ</span>
                                </div>
                            </Link>
                        </>) : (<>
                            <Link href={'/quan-ly-hoc-phan'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/hocphan.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Học Phần</span>
                                </div>
                            </Link>
                            <Link href={'/them-sinh-vien-vao-hoc-phan'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/hocphan.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Thêm Sinh Viên Học Phần</span>
                                </div>
                            </Link>
                            <Link href={'/yeu-cau-giao-vien'}>
                                <div className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                                    <img src='/hocphan.png' width={'32px'} />
                                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Thông báo</span>
                                </div>
                            </Link>
                        </>)}
                    </>)
                )}
                <div onClick={() => handleSignOut()} className='flex w-full items-center justify-start gap-2 cursor-pointer'>
                    <img src='/signout.png' width={'32px'} />
                    <span className='hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]'>Đăng Xuất</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar