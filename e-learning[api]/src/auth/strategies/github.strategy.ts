import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy,StrategyOptions } from "passport-github2";

const option : StrategyOptions ={
    clientID: '127.0.0.1',
    clientSecret: 'secret-client',
    callbackURL: 'api/auth/register/github/cb'
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor() {super()}

    validate() {}
}
