import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {

    // injecting usersService
    constructor(private readonly usersService:UsersService,){

    }
    public login(email:string, id:number, password:string){
        // check whether the user is logged in or not
        // once user is logged in, return a token

    }
}
