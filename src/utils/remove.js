import { Message, MessageBox } from 'element-ui'
import store from '@/store'
const remove = (fn, id, fn2) => {
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
                    if (fn2) {
                        fn2()
                    }
                })
                .catch(() => {
                    Message.error('删除失败')
                })
        })
        .catch(() => {
            Message.info('取消删除')
        })
}
export default remove