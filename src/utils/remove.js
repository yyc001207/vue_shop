import { Message, MessageBox } from 'element-ui'
import store from '@/store'
const remove = (fn, id) => {
    return new Promise((resolve, reject) => {
        MessageBox.confirm('此数据将永久被删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                store
                    .dispatch(fn, id)
                    .then(() => {
                        Message.info('删除成功')
                        resolve()
                    })
                    .catch(() => {
                        Message.error('删除失败')
                    })
            })
            .catch(() => {
                Message.info('取消删除')
            })
    })
}
export default remove