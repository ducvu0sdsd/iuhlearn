'use client'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { globalContext, notifyType } from '@/context/globalContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useState } from 'react'

const DoiMatKhauSinhVien = () => {

    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmNewPass, setConfirmNewPass] = useState('')
    const { globalHandler, globalData } = useContext(globalContext)

    const handleConfirm = () => {
        if (oldPass.length < 6) {
            globalHandler.notify(notifyType.WARNING, 'Mật khẩu cũ phải trên 6 ký tự')
            return
        }
        if (newPass.length < 6) {
            globalHandler.notify(notifyType.WARNING, 'Mật khẩu mới phải trên 6 ký tự')
            return
        }
        if (newPass !== confirmNewPass) {
            globalHandler.notify(notifyType.WARNING, 'Mật khẩu mới phải trùng khớp với mật khẩu xác nhận')
            return
        }
        api({
            type: TypeHTTP.POST, sendToken: true, path: '/auth/update-password-with-student', body: {
                id: globalData.student._id,
                oldPass,
                newPass
            }
        })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, 'Đổi mật khẩu thành công')
                setTimeout(() => {
                    globalThis.window.location.reload()
                }, 1000);
            })
    }

    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-full px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/signup.png'} text={'Đổi mật khẩu'} />
                <div className='w-full h-screen flex flex-col items-center justify-center gap-2'>
                    <div className='flex items-center justify-start gap-4 mb-[15px]'>
                        <img src='/logo.png' width={'45px'} />
                        <span className='text-[12px] w-[200px] font-medium translate-y-[5px]'>INDUSTRIAL UNIVERSITY OF HOCHIMINH CITY</span>
                    </div>
                    <input type='password' value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder='Mật khẩu cũ' className='w-[300px] text-[14px] h-[40px] rounded-md border-[1px] border-[#cdcdcd] focus:outline-none px-2' />
                    <input type='password' value={newPass} onChange={e => setNewPass(e.target.value)} placeholder='Mật khẩu mới' className='w-[300px] text-[14px] h-[40px] rounded-md border-[1px] border-[#cdcdcd] focus:outline-none px-2' />
                    <input type='password' value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} placeholder='Xác nhận mật khẩu mới' className='w-[300px] text-[14px] h-[40px] rounded-md border-[1px] border-[#cdcdcd] focus:outline-none px-2' />
                    <button onClick={() => handleConfirm()} className='w-[300px] text-[14px] h-[40px] rounded-md focus:outline-none transition-all hover:scale-[1.02] bg-[#30cc71] text-[white]'>Xác nhận</button>
                </div>
            </div>
        </section>
    )
}

export default DoiMatKhauSinhVien