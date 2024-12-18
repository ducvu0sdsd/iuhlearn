"use client"

import { TypeHTTP, api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { globalContext, notifyType } from "../context/globalContext";
import { ports } from "@/utils/routes";
import { roles } from "@/utils/others";

export default function Home() {

  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const { globalHandler, globalData } = useContext(globalContext)
  const router = useRouter()
  const [role, setRole] = useState(roles.student)


  const handleSignIn = () => {
    setLoading(true)
    globalHandler.notify(notifyType.LOADING, "Authenticating Account")
    api({ sendToken: false, body: { username, password }, type: TypeHTTP.POST, path: (role === roles.admin || role === roles.employ) ? '/auth/sign-in-with-manager' : role === roles.student ? '/auth/sign-in-with-student' : '/auth/sign-in-with-teacher' })
      .then(res => {
        globalThis.localStorage.setItem('accessToken', res.tokens.accessToken)
        globalThis.localStorage.setItem('refreshToken', res.tokens.refreshToken)
        globalHandler.notify(notifyType.SUCCESS, "Authenticated")
        setLoading(false)
        globalHandler.setManagement()
        globalHandler.setStudent()
        if (role === roles.admin) {
          router.push("/quan-ly-sinh-vien")
          globalThis.localStorage.setItem('role', 'admin')
          globalHandler.setManagement(res.management)
        } else if (role === roles.student) {
          globalHandler.setStudent(res.student)
          globalThis.localStorage.setItem('role', 'user')
          router.push("/thong-tin-chung")
        } else if (role === roles.teacher) {
          globalHandler.setTeacher(res.teacher)
          globalThis.localStorage.setItem('role', 'teacher')
          router.push("/thong-tin")
        } else if (role === roles.employ) {
          router.push("/quan-ly-hoc-phan")
          globalThis.localStorage.setItem('role', 'employ')
          globalHandler.setManagement(res.management)
        }
      })
      .catch(res => {
        setLoading(false)
        console.log(res)
        globalHandler.notify(notifyType.FAIL, res.message)
      })
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex rounded-lg overflow-hidden gap-3 border-[#e1e1e1] border-[1px] relative">
        <img src="/signin.png" width={'300px'} />
        <div className="flex flex-col w-[350px] justify-center items-center gap-3 px-[30px]">
          <h1 className="text-[22px]">Đăng Nhập</h1>
          <span className="text-center text-[13px]">
            {role === roles.student ?
              'Chào mừng trở lại với IUH Learn, hãy đăng nhập vì tương lai của bạn'
              :
              role === roles.teacher ?
                'Chào mừng trở lại với IUH Learn, giáo viên đăng nhập để quản lý lịch trình'
                :
                'Với vai trò quản trị viên, hãy quản lý thông tin tối ưu nhất'
            }
          </span>
          <div className="flex flex-col gap-2">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Mã số sinh viên" className="focus:outline-0 h-[35px] w-[300px] border-[1px] rounded-md px-[10px] text-[13px] border-[#ddd]" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="focus:outline-0 h-[35px] w-[300px] border-[1px] rounded-md px-[10px] text-[13px] border-[#ddd]" />
            <button onClick={() => handleSignIn()} className="h-[35px] w-[300px] text-[white] bg-[#30b0f0] mt-[5px] border-[1px] rounded-md px-[10px] text-[11px] border-[#999]">
              {loading ?
                <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                :
                <span>Đăng Nhập</span>
              }
            </button>
          </div>
        </div>
        <div className="absolute right-2 top-0 h-[50px] text-[14px] flex items-center gap-2">
          <span className="text-[13px] font-medium">Vai trò: </span>
          <select onChange={e => setRole(e.target.value)} className="text-[13px] border-[1px] focus:outline-0 border-[#ececec] shadow-lg rounded-md px-2 py-1">
            <option value={roles.student}>Học Sinh</option>
            <option value={roles.teacher}>Giáo Viên</option>
            <option value={roles.admin}>Quản Trị Viên</option>
            <option value={roles.employ}>Giáo Vụ</option>
          </select>
        </div>
      </div>
    </div>
  );
}
