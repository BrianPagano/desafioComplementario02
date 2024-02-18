function submitForm() {
    // Recopila los datos del formulario en un objeto
    const formData = {
        first_name: document.getElementById('nombre').value,
        last_name: document.getElementById('apellido').value,
        age: document.getElementById('edad').value,
        email: document.getElementById('email').value.toUpperCase(),
        password: document.getElementById('password').value,
    }

    // Realiza una solicitud POST utilizando fetch y envía los datos en formato JSON
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al registrar usuario');
        }
        return response.json();
    })
    .then(formData => {
        // Si todo está bien, redirigir a la página de inicio de sesión
        window.location.href = '/login';
    })
    .catch(error => {
        // Capturar y manejar el error
        console.error('Error:', error);
        // Mostrar un mensaje de alerta al usuario
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error, el correo ya se encuentra registrado",
          });
    });
}

