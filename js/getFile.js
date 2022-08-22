// let button = document.getElementById("submit-btn");
// let data = undefined;
// let fileInput = document.getElementById("csv-file");
// let display = document.getElementById("result-text");

// button.addEventListener("click", (event) => {
//     if (fileInput.value != "") {
//         Papa.parse(fileInput.files[0], {
//             header: true,
//             complete: function (result) {
//                 data = result.data;
//                 console.log(data[0])
//             }
//         });
//     } else {
//         document.getElementById("warning-text").style.display = "block";
//     }
// });