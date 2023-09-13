function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginform = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginform.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginform.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginform.addEventListener("submit", e => {
        e.preventDefault();
        let username = document.getElementsByName("username")[0].value
        let password = document.getElementsByName("password")[0].value

        // Create an object to send as JSON
        let data = {
            username: username,
            password: password
        }

        // Perform AJAX/Fetch login
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/");
        // set the request header for JSON data
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);

                // Parse the response JSON
                const response = JSON.parse(xhr.responseText);

                if (xhr.status === 200 && response.success === 'success') {
                    // Redirect the user to the home page
                    window.location.href = '/home'; // Change this URL to your desired redirection URL
                } if (xhr.status === 200 && response.error === 'login-invalid') {
                    // Redirect the user to the home page
                    window.location.href = '/'; // Change this URL to your desired redirection URL
                    //error message not logged in.

                }
            }
        };

        xhr.send(JSON.stringify(data));

    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 3) {
                setInputError(inputElement, "Username must be at least 3 characters in length");
            } else if (e.target.id === "signupUsername" && e.target.value.length > 16) {
                setInputError(inputElement, "Max username length is 16 characters");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});

        // perform ajax/fetch register
        