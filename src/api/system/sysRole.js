import request from '@/utils/request'

const api_name = '/admin/system/sysRole'
export default {
    // 角色列表-分页查询
    getPageList(current, size, searchObj) {
        return request({
            url: `${api_name}/${current}/${size}`,
            method: 'get',
            // 如果是普通对象参数，写法为 params:参数名称
            // 如果使用json格式传递，写法为 data:参数名称
            params: searchObj
        })
    },
    // 根据id删除
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete',
        })
    },
    // 添加
    saveRole(role) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: role
        })
    },
    // 根基id查询
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },
    // 修改
    updateById(role) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: role
        })
    },
    // 批量删除
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },
    getRoles(adminId) {
        return request({
            url: `${api_name}/toAssign/${adminId}`,
            method: 'get'
        })
    },

    assignRoles(assginRoleVo) {
        return request({
            url: `${api_name}/doAssign`,
            method: 'post',
            data: assginRoleVo
        })
    }
}