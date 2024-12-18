
// kiểm tra xem danh sách tiết của học phần có bị trùng thời gian với nhau hay không
export const kiemTraThoiGian = (dsTiet) => {

    // chỉ có 1 tiết thì kiểm tra làm chi
    if (dsTiet.length === 1) {
        return true
    }

    // có 1 tiết LT với 1 tiết TH
    if (dsTiet.length === 2) {
        if (kiemTraNgay(dsTiet[0], dsTiet[1]) === false) {
            // ngày nó không bằng nhau thì kiểm tra tiết chi nữa
            return true
        }
        return (kiemTraTiet(dsTiet[0].tiet, dsTiet[1].tiet))
    }

    // có 1 tiết LT với 2 tiết TH
    if (dsTiet.length === 3) {
        if (kiemTraNgay(dsTiet[0], dsTiet[1]) === true) {
            if (kiemTraTiet(dsTiet[0].tiet, dsTiet[1].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[0], dsTiet[2]) === true) {
            if (kiemTraTiet(dsTiet[0].tiet, dsTiet[2].tiet) === false) {
                console.log(2)
                return false
            }
        }
        if (kiemTraNgay(dsTiet[1], dsTiet[2]) === true) {
            if (kiemTraTiet(dsTiet[1].tiet, dsTiet[2].tiet) === false) {
                console.log(3)
                return false
            }
        }
    }

    // có 1 tiết LT với 3 tiết TH
    if (dsTiet.length === 4) {
        if (kiemTraNgay(dsTiet[0], dsTiet[1]) === true) {
            if (kiemTraTiet(dsTiet[0].tiet, dsTiet[1].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[0], dsTiet[2]) === true) {
            if (kiemTraTiet(dsTiet[0].tiet, dsTiet[2].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[0], dsTiet[3]) === true) {
            if (kiemTraTiet(dsTiet[0].tiet, dsTiet[3].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[1], dsTiet[2]) === true) {
            if (kiemTraTiet(dsTiet[1].tiet, dsTiet[2].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[1], dsTiet[3]) === true) {
            if (kiemTraTiet(dsTiet[1].tiet, dsTiet[3].tiet) === false) {
                return false
            }
        }
        if (kiemTraNgay(dsTiet[2], dsTiet[3]) === true) {
            if (kiemTraTiet(dsTiet[2].tiet, dsTiet[3].tiet) === false) {
                return false
            }
        }
    }

    return true
}

// kiểm tra 2 tiết xem nó có trùng thời gian với nhau không
export const kiemTraTiet = (tiet1, tiet2) => {
    const t1 = {
        from: Number(tiet1.split('-')[0]),
        to: Number(tiet1.split('-')[1]),
    }
    const t2 = {
        from: Number(tiet2.split('-')[0]),
        to: Number(tiet2.split('-')[1]),
    }
    if (t2.from >= t1.from && t2.from <= t1.to) {
        return false
    }
    if (t2.to >= t1.from && t2.to <= t1.to) {
        return false
    }
    return true
}

// kiểm tra 2 tiết có trùng ngày với nhau hay không
export const kiemTraNgay = (tiet1, tiet2) => {
    return tiet1.ngay === tiet2.ngay
}