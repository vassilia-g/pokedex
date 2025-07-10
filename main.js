// fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error("error", error));

// fetch('./data.json')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error("error", error));

// let promError = false; 

//     let myProm = new Promise((resolve, reject) => {
//         setTimeout (() => {
//             if(promError) {
//                 reject("it didn't work");
//             } else {
//                  resolve("it did work");
//             }
//         }, 2000);
//     });

//     myProm
//         .then(response => console.log(response))
//         .catch(error => console.error("error", error));

//     console.log(myProm);

// let myProm = fetch('https://jsonplaceholder.typicode.com/posts');

const BASE_URL = "https://remotestorage-2f515-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunc() {
    console.log("test");
    loadData();
    console.log("1");
    // postData("/name", "rum");
    // putData("/name", "COLA");
}

async function loadData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    return responseToJson;
}

// async function postData(path="", data={}) {
//     let response = await fetch(BASE_URL + path + ".json", {
//         method: "POST",
//         header: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     let responseToJson = await response.json();
//     console.log(responseToJson);
//     return responseToJson = await response.json();
// }

// async function deleteData(path="") {
//         let response = await fetch(BASE_URL + path + ".json", {
//         method: "DELETE",
//     });

//     let responseToJson = await response.json();
//     console.log(responseToJson);
//     return responseToJson = await response.json();
// }

// async function putData(path="",  data={}) {
//         let response = await fetch(BASE_URL + path + ".json", {
//         method: "PUT",
//         header: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     let responseToJson = await response.json();
//     console.log(responseToJson);
//     return responseToJson = await response.json();
// }