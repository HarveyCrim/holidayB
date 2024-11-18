import zod from 'zod'

export const userSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

export const loginSchema = zod.object({
    email : zod.string(),
    password: zod.string()
})
