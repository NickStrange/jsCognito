var Security = window.Security || {};
 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
 
//var token = null;
 
Security.signup = function() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  let registeredUser = "";
 
  const emailAttribute = {
    Name: "email",
    Value: email
  };
  const attrList = [];
  attrList.push(emailAttribute);
  userPool.signUp(username, password, attrList, null, (err, result) => {
    if (err) {
      console.log(err);
      alert(err);
    } else {
      registeredUser = result.user;
      window.location = "./confirm.html#" + username;
    }
  });
};
 
// ask for new code
Security.resetPassword = function() {
  // enable code div
  const username = document.getElementById("username").value;
  if (username === "") {
    alert("Please enter a username");
  } else {
    console.log("reset password");
    document.getElementById("enter-new-credentials").style.display = "block";
    document.getElementById("enter-old-credentials").style.display = "none";
 
    // setup cognitoUser first
 
    console.log("starting reset");
    cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool
    });
    console.log(username);
 
    // call forgotPassword on cognitoUser - ask for new code
    cognitoUser.forgotPassword({
      onSuccess: function(result) {
        alert(`Confirmation has been sent to your email`);
        console.log(result);
      },
      onFailure: function(err) {
        console.log(err);
        alert(err.code + " " + err.message);
      }
    });
  }
};
 
// confirmPassword can be separately built out as follows...
Security.confirmPassword = function() {
  const username = document.getElementById("username").value;
  const newPassword = document.getElementById("new-password").value;
  const reenterPassword = document.getElementById("reenter-password").value;
  const verificationCode = document.getElementById("access-code").value;
 
  if (newPassword !== reenterPassword) {
    alert("New password does not match rentered password");
  } else {
    console.log(username, newPassword, verificationCode);
    cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool
    });
 
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onFailure(err) {
          alert(err.code + " " + err.message);
          console.log(err.code + " " + err.message);
          reject(err);
        },
        onSuccess() {
          resolve();
          window.location = "/";
        }
      });
    });
  }
};
 
// confirm new user
Security.confirm = function() {
  const username = location.hash.substring(1);
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: userPool
  });
  const code = document.getElementById("code").value;
  cognitoUser.confirmRegistration(code, true, (err, results) => {
    if (err) {
      alert(err);
    } else {
      window.location = "/";
    }
  });
};
 
// request resend for new user
Security.resend = function() {
  var username = location.hash.substring(1);
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: userPool
  });
  cognitoUser.resendConfirmationCode(function(err) {
    if (err) {
      alert("Resend", err);
    }
  });
};
 
// check to see if logged in
Security.checkLogin = function(redirectOnRec, redirectOnUnrec) {
  var cognitoUser = userPool.getCurrentUser();
  console.log("User", cognitoUser);
  if (cognitoUser !== null) {
    if (redirectOnRec) {
      console.log("verified");
      window.location = "/app.html";
    }
  } else {
    if (redirectOnUnrec) {
      window.location = "/";
    }
  }
};
 
Security.login = function() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const authenticationData = {
    Username: username,
    Password: password
  };
 
  console.log("Logging in", username, password);
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  const userData = {
    Username: username,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      console.log("session ", result);
      window.location = "/app.html";
    },
    onFailure: function(err) {
      console.log("on failure ERROR", err);
      alert(
        "Login Error " + err.code + " " + err.message + " Please try again"
      );
    },
    newPasswordRequired: (userAttributes, requiredAttributes) => {
      console.log("signIn new password");
      const userData = {
        Username: username,
        Pool: poolData
      };
      cognitoUser.completeNewPasswordChallenge(
        password,
        {},
        {
          onSuccess: user => {
            console.log("success", user);
          }
        }
      );
    }
  });
};
 
Security.logout = function() {
  const cognitoUser = userPool.getCurrentUser();
  cognitoUser.signOut();
  window.location = "/";
};
 
Security.reset = function() {
  const cognitoUser = userPool.getCurrentUser();
  window.location = "/reset.html";
};
 
getAuthenticatedUser = function() {
  return userPool.getCurrentUser();
};