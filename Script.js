/* script.js
   Validación de formulario en tiempo real, control del modal y animación de confeti.
*/

/* ---- Helpers ---- */
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

/* Actualizar año en el footer */
qs('#year').textContent = new Date().getFullYear();

/* Elementos del formulario */
const form = qs('#contactForm');
const nameInput = qs('#name');
const emailInput = qs('#email');
const messageInput = qs('#message');
const errorsList = qs('#formErrors');
const successModal = qs('#successModal');
const confettiZone = qs('#confettiZone');
const closeModalBtn = qs('#closeModal');
const subscribeBtns = qsa('.confetti, #subscribeBtn');

/* Validaciones simples */
function validateNotEmpty(value){
  return value && value.trim().length > 0;
}
function validateEmailFormat(email){
  // RegEx sencillo para validar formato. No reemplaza validación en servidor.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Mostrar errores en lista */
function renderErrors(errors){
  errorsList.innerHTML = '';
  if(errors.length === 0) return;
  errors.forEach(err => {
    const li = document.createElement('li');
    li.textContent = err;
    errorsList.appendChild(li);
  });
}

/* Validación en tiempo real: mostrar mensajes mientras el usuario escribe */
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    const errors = [];
    if(!validateNotEmpty(nameInput.value)) errors.push('El nombre es obligatorio.');
    if(!validateNotEmpty(emailInput.value)) errors.push('El correo es obligatorio.');
    else if(!validateEmailFormat(emailInput.value)) errors.push('Formato de correo inválido.');
    if(!validateNotEmpty(messageInput.value)) errors.push('El mensaje es obligatorio.');
    renderErrors(errors);
  });
});

/* Al enviar el formulario */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const errors = [];
  if(!validateNotEmpty(nameInput.value)) errors.push('El nombre es obligatorio.');
  if(!validateNotEmpty(emailInput.value)) errors.push('El correo es obligatorio.');
  else if(!validateEmailFormat(emailInput.value)) errors.push('Formato de correo inválido.');
  if(!validateNotEmpty(messageInput.value)) errors.push('El mensaje es obligatorio.');

  renderErrors(errors);
  if(errors.length === 0){
    // Simular envío correcto: mostrar modal y confeti
    openSuccessModal();
    // limpiar campos
    form.reset();
  }
});

/* Modal control */
function openSuccessModal(){
  successModal.setAttribute('aria-hidden','false');
  // Generar 12 piezas de confeti
  launchConfetti(12);
}
function closeSuccessModal(){
  successModal.setAttribute('aria-hidden','true');
  confettiZone.innerHTML = '';
}
closeModalBtn.addEventListener('click', closeSuccessModal);

/* Botones de suscripción: crear la animación de confeti también (sin modal) */
subscribeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // small feedback visual
    btn.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:350});
    launchConfetti(10);
  });
});

/* Función para crear piezas de confeti y animarlas */
function launchConfetti(count = 12){
  const colors = ['#e53935','#8e24aa','#3949ab','#fdd835','#00bfa5','#ff7043'];
  for(let i=0;i<count;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    // estilo inline para controlar tamaño, color y posición inicial
    const size = Math.floor(Math.random()*10)+8; // 8-17 px
    piece.style.width = size + 'px';
    piece.style.height = (size*0.6) + 'px';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.position = 'absolute';
    piece.style.left = Math.floor(Math.random()*100) + '%';
    piece.style.top = '-10vh';
    piece.style.opacity = '1';
    // rotación y animación única
    const delay = Math.random()*0.4;
    const duration = 2.2 + Math.random()*1.2;
    piece.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';
    piece.style.borderRadius = '2px';
    piece.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
    // pequeña oscilación via keyframes dinámicos (usamos translateX con animation)
    confettiZone.appendChild(piece);
    // limpiar después de terminar la animación
    setTimeout(()=>{ if(piece.parentNode) piece.parentNode.removeChild(piece); }, (delay+duration)*1000 + 500);
  }
}

/* Accesibilidad: cerrar modal con ESC */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeSuccessModal();
});

/* Nota: la validación en cliente mejora UX, pero NO reemplaza la validación en servidor. */
