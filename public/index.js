// Función principal mejorada
async function realizar() {
    const dropdown = document.getElementById('desplegar');
    const selectedValue = dropdown.dataset.selected;
    const index = 2;

    if (!selectedValue || selectedValue === '') {
        showError('¡Selecciona una opción antes de continuar!');
        return;
    }

    try {
        showLoading();
        
        const response = await fetch('/encrypt', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                index: parseInt(index), 
                campo: selectedValue 
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        updateResults(data);
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

// Función de despliegue del dropdown
function desplegar(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('desplegar');
    dropdown.classList.toggle('active');
}

// Cierre del dropdown al hacer click fuera
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('desplegar');
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Selección de opciones
document.getElementById('desplegar').addEventListener('click', (e) => {
    const option = e.target.closest('div[data-value]');
    if (!option) return;

    const dropdown = document.getElementById('desplegar');
    const selectedValue = option.dataset.value;
    const displayText = option.textContent;

    dropdown.querySelector('div:first-child').textContent = displayText; // Corregido
    dropdown.dataset.selected = selectedValue;
    dropdown.classList.remove('active');
});

// Funciones auxiliares
function updateResults(data) {
    const resultContainers = document.querySelectorAll('.response');
    if (resultContainers.length >= 2) {
        resultContainers[0].textContent = data.cifrado || 'No disponible';
        resultContainers[1].textContent = data.header || 'No disponible';
    }
}

function showError(message) {
    alert(message);
}

function handleError(error) {
    console.error('Error:', error);
    showError(`Error: ${error.message}`);
}

function showLoading() {
    document.querySelector('.botonok').disabled = true;
}

function hideLoading() {
    document.querySelector('.botonok').disabled = false;
}