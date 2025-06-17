// Sistema de comentarios mejorado
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    const commentSection = document.getElementById('comment-section');
    
    // Cargar comentarios existentes
    loadComments();
    
    // Manejar envío de formulario
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const comment = document.getElementById('comment').value.trim();
        
        if (name && comment) {
            const commentData = {
                name: name,
                email: email,
                comment: comment,
                date: new Date().toISOString(),
                id: Date.now()
            };
            
            saveComment(commentData);
            displayComment(commentData);
            commentForm.reset();
            
            // Mostrar mensaje de éxito
            showAlert('Comentario enviado con éxito', 'success');
        } else {
            showAlert('Por favor completa los campos requeridos', 'error');
        }
    });
    
    function saveComment(comment) {
        let comments = JSON.parse(localStorage.getItem('page-comments')) || [];
        comments.unshift(comment); // Agregar al inicio
        localStorage.setItem('page-comments', JSON.stringify(comments));
    }
    
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('page-comments')) || [];
        if (comments.length === 0) {
            commentSection.innerHTML = '<p class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
            return;
        }
        
        commentSection.innerHTML = '';
        comments.forEach(comment => {
            displayComment(comment);
        });
    }
    
    function displayComment(comment) {
        const commentElement = document.createElement('article');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <header>
                <h4>${escapeHTML(comment.name)}</h4>
                <time datetime="${comment.date}">${formatDate(comment.date)}</time>
            </header>
            <p>${escapeHTML(comment.comment)}</p>
            <footer>
                <button class="delete-btn" data-id="${comment.id}" aria-label="Eliminar comentario">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </footer>
        `;
        commentSection.prepend(commentElement);
        
        // Agregar evento al botón de eliminar
        commentElement.querySelector('.delete-btn').addEventListener('click', function() {
            deleteComment(this.getAttribute('data-id'));
        });
    }
    
    function deleteComment(id) {
        let comments = JSON.parse(localStorage.getItem('page-comments')) || [];
        comments = comments.filter(comment => comment.id != id);
        localStorage.setItem('page-comments', JSON.stringify(comments));
        loadComments();
        showAlert('Comentario eliminado', 'info');
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.setAttribute('role', 'alert');
        alert.setAttribute('aria-live', 'assertive');
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }
});