import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'User Admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Apoorva',
        email: 'apoorva@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Shriya',
        email: 'shriya@example.com',
        password: bcrypt.hashSync('123456', 10)
    }
]

export default users