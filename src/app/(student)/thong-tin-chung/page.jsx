import Information from '@/components/student/thong-tin-chung/information'
import SectionClasses from '@/components/student/thong-tin-chung/sectionClasses'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import React from 'react'
import Schedule from '@/components/student/lich-hoc/schedule'

const GeneralInformation = () => {
    return (
        <section className='h-screen w-full flex'>
            <Navbar />
            <div className='w-full h-screen overflow-y-auto overflow-x-hidden px-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/student.png'} text={'Thông Tin Chung'} />
                <Information />
                <Schedule />
            </div>
        </section>
    )
}

export default GeneralInformation