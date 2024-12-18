export const convertISODateToString = (str) => {
    str = str.split("T")[0]
    const day = str.split('-')[2]
    const month = str.split('-')[1]
    const year = str.split('-')[0]
    return `${day}-${month}-${year}`
}

export const convertISODateToStringYMD = (str) => {
    str = str?.split("T")[0]
    const day = str?.split('-')[2]
    const month = str?.split('-')[1]
    const year = str?.split('-')[0]
    return `${year}-${month}-${day}`
}

export function chuyen_doi_tien_VND(so_tien) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien);
}

export const roles = {
    student: 'student',
    teacher: 'teacher',
    admin: 'admin',
    employ: 'employ'
}