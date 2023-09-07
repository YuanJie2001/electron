import service from '../api/request.ts'

export function addDeviceAPI(data: any) {
    console.log(data)
    return service({
        url: '/v1/manager/addDevice',
        method: 'post',
        data: data
    })
}


export function addDevicesAPI(devices:any) {
    return service({
        url: '/v1/manager/addDevices',
        method: 'post',
        data: {
            groupName: devices.groupName,
            minAddress: parseInt(devices.address),
            maxnAddress: parseInt(devices.maxAddress),
            port: devices.port,
            baudrate: parseInt(devices.baudrate),
            bytesize: parseInt(devices.bytesize),
            parity: devices.parity,
            stopbits: parseInt(devices.stopbits),
            circle: parseInt(devices.circle),
            threshold: parseInt(devices.threshold),
        }
    })
}
export function getGroupNames() {
    return service({
        url: '/v1/manager/groups',
        method: 'get',
    })
}

export function addTaskAPI(groupName:any,address:any) {
    return service({
        url: '/v1/task/addNode',
        method: 'post',
        data: {
            groupName: groupName,
            address: address
        }
    })
}

export function cancelTaskAPI(groupName:any,address:any) {
    return service({
        url: '/v1/task/removeNode',
        method: 'post',
        data: {
            groupName: groupName,
            address: address
        }
    })
}
export function updateGroup(groupName:any,pollingInterval:any) {
    return service({
        url: '/v1/manager/updatePollingInterval',
        method: 'post',
        data: {
            groupName: groupName,
            pollingInterval: parseInt(pollingInterval)
        }
    })
}
export function getDeviceInfoList(groupName:any) {
    return service({
        url: '/v1/manager/devices',
        method: 'get',
        params: {
            groupName: groupName
        }

    })
}
export function getOnlineDevice() {
    return service({
        url: '/v1/task/getOnlineDevice',
        method: 'get',

    })
}


export function getGroupPollingIntervalAPI( groupName:any) {
    return service({
        url: '/v1/manager/pollingInterval',
        method: 'get',
        params: {
            groupName: groupName
        }
    })
}

export function updateDeviceAPI(device:any) {
    return service({
        url: '/v1/manager/updateDevice',
        method: 'post',
        data: device
    })
}

export function addGroup(groupName:string,pollingInterval:number) {
    return service({
        url: '/v1/manager/addGroup',
        method: 'post',
        data: {
            groupName,
            pollingInterval
        }
    })
}
export function deleteDeviceAPI(groupName:string,address:number) {
    return service({
        url: '/v1/manager/dropDevice',
        method: 'post',
        data: {
            groupName: groupName,
            address: address
        }
    })
}


export function deleteGroupDeviceAPI(groupName:any) {
    return service({
        url: '/v1/manager/dropGroup',
        method: 'post',
        data: {
            groupName: groupName
        }
    })
}

export function getSerialPortListAPI() {
    return service({
        url: '/v1/manager/serialPortList',
        method: 'get',
    })
}


export function exportData(){
    return service({
        url: '/device/export',
        method: 'get',
    })
}

export function startSingleDeviceAPI(device:any) {
    return service({
        url: '/v1/task/startSingleDevice',
        method: 'post',
        data: device
    })
}

export function stopSingleDeviceAPI(device:any) {
    return service({
        url: '/v1/task/stopSingleDevice',
        method: 'post',
        data: device
    })
}

export function dischargeData(groupName: any, address: any) {
    // console.log(groupName,address)
    return service({
        url: '/v1/task/discharge',
        method: 'get',
        params: {
            groupName: groupName,
            address:address
        }
    })
}