class EasyHttp {
    get(url, token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
    //  myHeaders.append("Authorization", token);
         return new Promise((resolve, reject) => {
        fetch(url, {
          headers: myHeaders
        })
        .then(res =>  res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
    getPlain(url, token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
    //  myHeaders.append("Authorization", token);
         return new Promise((resolve, reject) => {
        fetch(url, {
          headers: myHeaders
        })
        .then(res =>  res.text())//res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
    post(url, data, token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  //   myHeaders.append("Authorization", token);
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err));
      });
    }
    put(url, data, token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log('Token ', token);
      myHeaders.append("Authorization", token);
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err));
      });
    }
    delete(url, token) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "DELETE",
          headers: myHeaders,
        })
          .then(res => res.json())
          .then(() => resolve("Resource deleted"))
          .catch(err => reject(err));
      });
    }
  }