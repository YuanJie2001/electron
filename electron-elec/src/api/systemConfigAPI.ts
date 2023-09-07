import service from "@/api/request.ts";

export function updateSystemConf(systemConfig: object){
  return service({
    url: "/v1/system/updateSystemConfig",
    method: "post",
    data: systemConfig
  });
}

export function getSystemConfig(){
    return service({
        url: "/v1/system/getSystemConfig",
        method: "get"
    });
}