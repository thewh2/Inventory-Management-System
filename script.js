function login(){

    window.location.href = "dashboard.html";

}

function logout(){

    window.location.href = "login.html";

}

let deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(function(button){

    button.addEventListener("click", function(){

        alert("Delete functionality will be added later.");

    });

});

let editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach(function(button){

    button.addEventListener("click", function(){

        alert("Edit functionality will be added later.");

    });

});


// Login

function login(event){

    event.preventDefault();

    let email = document.querySelector('input[type="email"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if(email == "admin@example.com" && password == "admin123"){

        window.location.href = "dashboard.html";

    }
    else{

        alert("Invalid Email or Password");

    }

}