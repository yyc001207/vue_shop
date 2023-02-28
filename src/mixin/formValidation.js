export const addFormRulesMixin = {
    data() {
        // 邮箱验证规则
        const checkEmail = (rules, value, callback) => {
            // 邮箱验证正则
            const regEmail = /^([A-z0-9_-])+@([A-z0-9_-])+(\.[A-z0-9_-])+/
            if (regEmail.test(value)) return callback()
            callback(new Error('请输入合法邮箱'))
        }
        // 手机号验证规则
        const checkMobile = (rules, value, callback) => {
            const regMobile = /^1[3-9]\d{9}$/
            if (regMobile.test(value)) return callback()
            callback(new Error('请输入合法手机号'))
        }
        return {
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3至10个字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在6至15个字符', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
                roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在2至10个字符', trigger: 'blur' },
                ],
                cat_name: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在2至6个字符', trigger: 'blur' },
                ]
            },
        }
    },
}