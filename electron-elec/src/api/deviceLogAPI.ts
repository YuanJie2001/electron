import service from "@/api/request.ts";


export function getCurrentPageData(currentPage: number, pageSize: number){
    let data = [
        {
            date: '2016-05-03',
            name: 'Tom',
            address: '0Xcc',
        },
        {
            date: '2016-05-02',
            name: 'Tom',
            address: '0Xcc',
        },
        {
            date: '2016-05-04',
            name: 'Tom',
            address: '0Xcc',
        },
        {
            date: '2016-05-01',
            name: 'Tom',
            address: '0Xcc',
        },
    ]
    return data
}