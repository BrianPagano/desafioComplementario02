const passport = require ('passport')
const local = require ('passport-local')
const GithubStrategy = require ('passport-github2')
const Users = require('../DAO/models/user.model')
const { createHash, useValidPassword } = require('../utils/cryp-password.util')
const { ghClientId, ghClientSecret } = require('./app.config')

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register',
         new LocalStrategy(
       {passReqToCallback: true, usernameField: 'email'},
       async (req, username, password, done) => {
        try {
        const {first_name, last_name, age, email} = req.body
        const user = await Users.findOne ({email: username})
        if(user) {
            console.log ('User Exists')
            return done (null, false)
        }
        const newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password: createHash (password),
        }
        const newUser = await Users.create(newUserInfo)
        return done (null, newUser)
        } catch (error) {
            return done (error)
        }
      })
    )

    passport.use('login',  new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await Users.findOne({ email: username })
        if (!user) {
            console.log ('usuario o contraseña incorrecta')
            return done (null, false)
        }
        if (!useValidPassword (user, password)) {
            console.log ('usuario o contraseña incorrecta')
            return done (null, error)
        }
        return done (null, user)
        }catch (error) {
            return done (error)
        }
    }))

    passport.use ('github', new GithubStrategy ({
        clientID: ghClientId,
        clientSecret: ghClientSecret,
        callbackURL: "http://localhost:8080/api/auth/githubcallback"
    }, async (accessToken, refreshToken, profile, done) =>  {
        try {
            const {id, login, name, email} = profile._json
            const user = await Users.findOne ({email: email})
            if(!user) {
                const newUserInfo = {
                    first_name: name,
                    email: email,
                    githubId: id,
                    githubUsername: login,
                }
                const newUser = await Users.create(newUserInfo)
                return done (null, newUser)
            } return done (null, user)
           
        } catch (error) {
            console.log (error)
        }
     })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Users.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    } )
    
}


module.exports = initializePassport