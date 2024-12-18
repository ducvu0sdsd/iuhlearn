import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useState } from 'react'

const CreatePhongForm = ({ visible }) => {

    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [tenPhong, setTenPhong] = useState('')
    const [toa, setToa] = useState('')
    const [tang, setTang] = useState('')
    const [loai, setLoai] = useState('')
    const [siSo, setSiSo] = useState('')

    const validateInputs = () => {
        if (!loai) {
            globalHandler.notify(notifyType.WARNING, 'Loại Phòng Không Được Để Trống');
            return false;
        }

        if (!/^[A-Z]$/.test(toa)) {
            globalHandler.notify(notifyType.WARNING, 'Tòa Không Hợp Lệ (Chỉ được là 1 chữ in hoa)');
            return false;
        }

        if (!/^\d+$/.test(tang)) {
            globalHandler.notify(notifyType.WARNING, 'Tầng Không Hợp Lệ (Chỉ được là số)');
            return false;
        }

        if (!/^[0-9]+$/.test(siSo)) {
            globalHandler.notify(notifyType.WARNING, 'Sỉ Số Phòng Không Hợp Lệ');
            return false;
        }

        const regex = new RegExp(`^${toa}${tang}\\.\\d{2}$`);
        if (!regex.test(tenPhong)) {
            globalHandler.notify(
                notifyType.WARNING,
                `Tên Phòng Không Hợp Lệ (Định dạng phải là ${toa}${tang}.XX, ví dụ: ${toa}${tang}.01)`
            );
            return false;
        }
        return true;
    };

    const checkRoomExistence = async () => {
        try {
            const response = await api({ sendToken: true, type: TypeHTTP.GET, path: '/phong/get-all' });
            const existingRooms = Array.isArray(response) ? response : [];
            if (existingRooms.some(room => room.tenPhong === tenPhong)) {
                globalHandler.notify(notifyType.WARNING, 'Tên Phòng Đã Tồn Tại');
                return false;
            }
            return true;
        } catch (error) {
            globalHandler.notify(notifyType.ERROR, 'Lỗi Kiểm Tra Phòng Đã Tồn Tại');
            return false;
        }
    };

    const handleCreatePhong = async () => {
        if (!validateInputs()) return;

        const roomExists = await checkRoomExistence();
        if (!roomExists) return;

        const body = { tenPhong, toa, tang, loai, siSo };
        globalHandler.notify(notifyType.LOADING, "Đang Tạo Phòng Đào Tạo");
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/phong/create' })
            .then(res => {
                adminHandler.hiddenWrapper();
                globalHandler.notify(notifyType.SUCCESS, "Tạo Phòng Thành Công");
                globalHandler.reload();
            })
            .catch(() => globalHandler.notify(notifyType.ERROR, "Lỗi Tạo Phòng"));
    };

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Phòng Học</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={tenPhong} onChange={e => setTenPhong(e.target.value)} placeholder='Tên Phòng' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={toa} onChange={e => setToa(e.target.value)} placeholder='Tòa' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={tang} onChange={e => setTang(e.target.value)} placeholder='Tầng' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select onChange={e => setLoai(e.target.value)} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Loại Phòng</option>
                    <option value='LT'>Lý Thuyết</option>
                    <option value='TH'>Thực Hành</option>
                </select>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={siSo} onChange={e => setSiSo(e.target.value)} placeholder='Sỉ Số' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreatePhong()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>
    )
}

export default CreatePhongForm