import axios from "axios";
import { createContext } from "react";

export const UserContext = createContext()
let baseUrl = "http://localhost:3001/"


export const UserProvider = (props) => {

  function login(credentials) {

    return axios.post(baseUrl + "api/user/signin", credentials)
      .then(response => {
        localStorage.setItem('rpassToken', response.data.token)
        return new Promise(resolve => resolve(response));
      }
      );
  }

  function verify() {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + "api/user/verify", null, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function getUser(userId) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + `api/user/getting-user/${userId}`, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function createAccount(newUser) {
    return axios.post(baseUrl + "api/user/create-account", newUser).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function twoFactorStatus() {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + "api/user/twofactorstatus", {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function deleteTwoFactor(masterPass) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + "api/user/removetwofactor", masterPass, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function addTwoFactor(masterPass) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + "api/user/addtwofactor", masterPass, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function testTwoFactor(token) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + "api/user/testtwofactor", token, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function getAdminStatus() {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + "api/user/is-an-admin", {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function getAllUsers() {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + "api/user/get-all-users", {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function AdminCreateAccount(user) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + "api/user/create-account-admin", user, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function getAllLogs() {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + "api/user/get-logs", {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function searchUsers(query) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.get(baseUrl + `api/user/get-users/${query}`, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function editUser(userDetails) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.put(baseUrl + `api/user/edit-user/${userDetails.userId}`, userDetails, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  function unsubscribeUser(userDetails) {
    let myHeaders = {
      Authorization: `Bearer ${localStorage.getItem('rpassToken')}`
    };
    return axios.post(baseUrl + `api/user/unsubscribe`, userDetails, {
      headers: myHeaders
    }).then(response => {
      return new Promise(resolve => resolve(response.data));
    })
  }

  return (
    <UserContext.Provider
      value={{
        login,
        verify,
        twoFactorStatus,
        deleteTwoFactor,
        addTwoFactor,
        testTwoFactor,
        createAccount,
        getAdminStatus,
        getAllUsers,
        AdminCreateAccount,
        getAllLogs,
        searchUsers,
        getUser,
        editUser,
        unsubscribeUser
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}