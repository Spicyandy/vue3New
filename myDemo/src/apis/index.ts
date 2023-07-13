// 导入axios实例
import httpRequest from '@/request/index'
 
// 列表
export function getList(param:any) {
    return httpRequest({
		url: '/article/list',
		method: 'get',
		params: param,
	})
}
export function deleteList(str:string) {
    return httpRequest({
		url: '/article/'+str,
		method: 'DELETE',
	})
}
export function article(id:string|number ) {
    return httpRequest({
		url: '/article/'+id,
		method: 'get',
	})
}
