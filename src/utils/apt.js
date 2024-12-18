
const parentTime = {
    '4-6': ['4-6', '4-5', '5-6'],
    '7-9': ['7-9', '7-8', '8-9'],
    '10-12': ['10-12', '10-11', '11-12'],
    '13-15': ['13-15', '13-14', '14-15'],
    '1-2': ['1-2'],
    '1-3': ['1-3', '1-2', '2-3'],
    '2-3': ['2-3'],
    '4-5': ['4-5'],
    '5-6': ['5-6'],
    '7-8': ['7-8'],
    '8-9': ['8-9'],
    '10-11': ['10-11'],
    '11-12': ['11-12'],
    '13-14': ['13-14'],
    '14-15': ['14-15']
}

export const checkHaveRoom = (room) => {
    return room.phong.maPhong !== ''
}

export const checkThoiGianPhong = (dsThoiGianDaDangKy, phong, ngay, tiet) => {
    if (phong && ngay !== -1) {
        const filter = dsThoiGianDaDangKy.filter(item => {
            console.log(parentTime[item.tiet])
            return item.phong.maPhong === phong._id && item.ngay === ngay && parentTime[item.tiet].includes(tiet)
        })
        if (filter.length > 0) {
            return false
        } else {
            return true
        }
    }
}