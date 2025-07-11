function generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;
    const excludeSimilar = document.getElementById("excludeSimilar").checked;
    const count = parseInt(document.getElementById("count").value);

    let lowercase = "abcdefghijklmnopqrstuvwxyz";
    let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-={}[]|:;<>,.?/";
    const similar = "l1I0O";

    if (excludeSimilar) {
        lowercase = removeSimilarChars(lowercase, similar);
        uppercase = removeSimilarChars(uppercase, similar);
        numbers = removeSimilarChars(numbers, similar);
    }

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (!includeUppercase && !includeNumbers && !includeSymbols && !excludeSimilar) {
        alert("Selecciona al menos una opción de caracteres.");
        return;
    }

    let result = "";
    for (let i = 0; i < count; i++) {
        let password = "";
        for (let j = 0; j < length; j++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (i === 0) {
            document.getElementById("password").value = password;
            evaluateStrength(password);
        }
        result += "Contraseña " + (i + 1) + ": " + password + "\n";
    }

    document.getElementById("passwordsArea").value = result;
}

function removeSimilarChars(charset, similar) {
    return [...charset].filter(c => !similar.includes(c)).join('');
}

/*function copyPassword() {
    const passwordField = document.getElementById("password");
    passwordField.select();
    document.execCommand("copy");
    alert("¡Contraseña copiada!");
}*/

function copyPassword() {
    const passwordField = document.getElementById("password");
    const password = passwordField.value;
    navigator.clipboard
        .writeText(password)
        .then(() => {
            alert("¡Contraseña copiada!");
        })
        .catch(() => {
            alert("No se pudo copiar la contraseña.");
        });
}

function evaluateStrength(password) {
    const length = password.length;
    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (length >= 12) score++;

    const strengthLevel = document.getElementById("strengthLevel");
    let width = score * 20 + "%";
    let color = "red";
    if (score >= 4) color = "green";
    else if (score === 3) color = "orange";
    else if (score === 2) color = "yellow";

    strengthLevel.style.width = width;
    strengthLevel.style.backgroundColor = color;
}

function downloadAsTxt() {
    const passwords = document.getElementById("passwordsArea").value;
    if (!passwords.trim()) {
        alert("Primero genera las contraseñas.");
        return;
    }
    const blob = new Blob([passwords], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contraseñas.txt";
    link.click();
}

function downloadAsJson() {
    const lines = document.getElementById("passwordsArea").value.trim().split("\n");
    if (lines.length === 0 || lines[0] === "") {
        alert("Primero genera las contraseñas.");
        return;
    }

    const data = lines.map(line => {
        const parts = line.split(": ");
        return parts[1];
    });

    const blob = new Blob([JSON.stringify({ contraseñas: data }, null, 2)], {
        type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contraseñas.json";
    link.click();
}