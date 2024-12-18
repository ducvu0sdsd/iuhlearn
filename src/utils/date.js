
export const generateWeeks = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const weeks = [];
    let currentStart = new Date(start);

    while (currentStart <= end) {
        const currentEnd = new Date(currentStart);
        currentEnd.setDate(currentStart.getDate() + 6);

        if (currentEnd > end) {
            break; // Bỏ tuần dư nếu ngày kết thúc nằm ngoài khoảng thời gian
        }

        weeks.push({
            start: currentStart.toISOString().split('T')[0],
            end: currentEnd.toISOString().split('T')[0],
        });

        // Tăng tuần lên
        currentStart.setDate(currentStart.getDate() + 7);
    }

    return weeks;
};

export const isDateGreater = (date1, date2) => {
    const d1 = new Date(date1); // Chuyển đổi ngày 1 sang đối tượng Date
    const d2 = new Date(date2); // Chuyển đổi ngày 2 sang đối tượng Date

    return d1 > d2; // So sánh ngày 1 lớn hơn ngày 2
};
export const isDateGreaterEqual = (date1, date2) => {
    const d1 = new Date(date1); // Chuyển đổi ngày 1 sang đối tượng Date
    const d2 = new Date(date2); // Chuyển đổi ngày 2 sang đối tượng Date

    return d1 >= d2; // So sánh ngày 1 lớn hơn ngày 2
};

export const getDateForDay = (start, dayOffset) => {
    const date = new Date(start);
    date.setDate(new Date(start).getDate() + dayOffset);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

export function convertDateToDayMonthYearObject(dateString) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    let currentDate = new Date(dateString);

    // Lấy ngày và tháng
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    // Trả về chuỗi ngày và tháng
    return { day, month, year };
}

export const getDateForDayMonthYear = (start, dayOffset) => {
    const date = new Date(start);
    date.setDate(new Date(start).getDate() + dayOffset);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const getDateForDayMonthYear1 = (start, dayOffset) => {
    const date = new Date(start);
    date.setDate(new Date(start).getDate() + dayOffset);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).split('/')[2] + '-' + date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).split('/')[1] + '-' + date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).split('/')[0];
};

export const calculateDate = (startDate, dayOffset) => {
    console.log(startDate)
    const date = new Date(startDate); // Khởi tạo ngày từ startDate
    date.setDate(date.getDate() + dayOffset); // Thêm số ngày bù
    return {
        day: date.getDate(), // Lấy ngày
        month: date.getMonth() + 1, // Lấy tháng (tháng bắt đầu từ 0)
        year: date.getFullYear() // Lấy năm
    };
};


export function formatDate(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export const returnNumber = (num) => {
    if (num < 10)
        return '0' + num
    return num
}