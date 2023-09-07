import service from '../api/request.ts'

export function getDeviceOneData(deviceDataForm: any) {
    // console.log(deviceDataForm)
    return service({
        url: '/v1/history/mapData',
        method: 'get',
        params: deviceDataForm
    })
}
export function getDeviceData(deviceDataForm: any) {
    // console.log(deviceDataForm)
    return service({
        url: '/v1/history/mapDatas',
        method: 'get',
        params: deviceDataForm
    })
}
export function getIntervalDeviceData(deviceDataForm: any) {
    // console.log(deviceDataForm,"区间条数")
    return service({
        url: '/v1/history/count',
        method: 'get',
        params: deviceDataForm
    })
}

export function getDeviceInfoData() {
    return service({
        url: '/v1/history/getData',
        method: 'get',
    })

}

export function getDeviceNamesOptions() {
    return service({
        url: '/v1/getDeviceName',
        method: 'get',
    })
}


export function exportData(groupName:string,timestamp:string[],address:string,path:string) {
    return service({
        url: '/v1/history/export',
        method: 'post',
        data: {
            groupName: groupName,
            address: address,
            timestamp: timestamp,
            savePath: path
        }
    })
}


export function exportDataBulk(deviceDataForm: any,path:string) {
    return service({
        url: '/v1/history/exports',
        method: 'post',
        data: {
            groupName: deviceDataForm.groupName,
            address: deviceDataForm.address,
            minTimestamp: deviceDataForm.minTimestamp,
            maxTimestamp: deviceDataForm.maxTimestamp,
            savePath: path
        }
    })
}

export function deleteDataById(groupName:string,address:string,timestamp:string) {
    return service({
        url: '/v1/history/dropMapData',
        method: 'post',
        data: {
            timestamp: timestamp,
            groupName: groupName,
            address: address
        }
    })
}

export function deleteDataBulk(date:string[],groupName:string,address:string) {
    return service({
        url: '/v1/history/dropMapDatas',
        method: 'post',
        data: {
            minTimestamp: date[0],
            maxTimestamp: date[1],
            groupName: groupName,
            address: address
        }
    })
}
