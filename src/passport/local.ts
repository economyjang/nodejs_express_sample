import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {validateUserPassword} from "../auth/auth.service";

export default () => {
    passport.use(new LocalStrategy({usernameField: 'emailId', passwordField: 'password'}, validateUserPassword));
}