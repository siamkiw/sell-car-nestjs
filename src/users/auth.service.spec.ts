import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'



describe('AuthService', () => {

    let service: AuthService
    let mockUsersService: Partial<UsersService>

    beforeEach(async () => {
        // Create a fake copy of the users service 
        const users: User[] = []
        mockUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 9999),
                    email,
                    password
                } as User
                users.push(user)
                return Promise.resolve(user)
            }
        }

        // Create DI container
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    // If anyone ask for UserService give them MockUserSerivce
                    provide: UsersService,
                    useValue: mockUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService)
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted and hash password', async () => {
        const user = await service.signup('test@test.com', 'password')

        expect(user.password).not.toEqual('password')

        const [salt, hash] = user.password.split('.')

        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in used', async () => {
        await service.signup("test@test.com", "password")

        await expect(service.signup("test@test.com", "password"))
            .rejects
            .toBeInstanceOf(BadRequestException);
    })

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin("test@test.com", "password"))
            .rejects
            .toBeInstanceOf(NotFoundException);
    })

    it('throws if an invalid password is provide', async () => {
        await service.signup("test@test.com", "passwordpassword")

        await expect(service.signin("test@test.com", "password"))
            .rejects
            .toBeInstanceOf(BadRequestException);
    })

    it('returns a user if correct password is provide', async () => {
        await service.signup('test@test.com', 'password')
        const user = await service.signin('test@test.com', 'password')
        expect(user).toBeDefined()
    })

})

