import firebase from '@/plugins/Auth/firebase.ts'

export const state = () => ({
  user: {
    userName: '',
    userIcon: '',
    idToken: '',
    acceccToken: ''
  }
})

export const mutations = {
}

export const actions = {
  login () {
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const credential = result.credential
        console.log(credential)
        console.log(result.user)
      })
      .catch(function (error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  }
}

export const getters = {}
