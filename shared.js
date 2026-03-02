       // ===== STORAGE FUNCTIONS =====
function saveToStorage() {
    localStorage.setItem('cardel_state', JSON.stringify(state));
}

function loadFromStorage() {
    const saved = localStorage.getItem('cardel_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cardData) Object.assign(state.cardData, parsed.cardData);
    }
}
        // Global State
        const state = {
     cardData: {
        name: '',
        title: '',
        number: '',
        email: '',
        material: 'black-metal'
    },
    activeHotspot: null,
    isZoomed: false,
    orderConfig: {
        quantity: 10,
        basePrice: 590,
        addons: {
            nfc: true,
            qr: false,
            laser: false
        }
    },
    materials: {
                metal: [
                    { id: 'black-metal', name: 'Black Metal Matte', color: '#0a0a0a', thickness: '0.8mm', weight: '28g', finish: 'Brushed Matte', price: 0, desc: 'Premium black stainless steel with sophisticated brushed finish' },
                    { id: 'gold-metal', name: 'Gold Mirror', color: '#d4af37', thickness: '0.8mm', weight: '28g', finish: 'Polished Mirror', price: 150, desc: '24k gold-plated with mirror-like reflectivity' },
                    { id: 'silver-metal', name: 'Silver Brushed', color: '#c0c0c0', thickness: '0.8mm', weight: '28g', finish: 'Brushed Satin', price: 150, desc: 'Sterling silver-plated with elegant texture' },
                    { id: 'rose-gold', name: 'Rose Gold', color: '#b76e79', thickness: '0.8mm', weight: '28g', finish: 'Polished', price: 175, desc: '18k rose gold with warm contemporary appeal' }
                ],
                wood: [
                    { id: 'walnut', name: 'Black Walnut', color: '#3d2817', thickness: '1.0mm', weight: '18g', finish: 'Oiled Natural', price: 100, desc: 'Sustainably sourced American black walnut' },
                    { id: 'maple', name: 'White Maple', color: '#f5f5dc', thickness: '1.0mm', weight: '16g', finish: 'Matte Sealed', price: 100, desc: 'Canadian hard maple with clean bright appearance' },
                    { id: 'ebony', name: 'African Ebony', color: '#1c1c1c', thickness: '1.0mm', weight: '22g', finish: 'High Polish', price: 200, desc: 'Rare African ebony with deep black tone' },
                    { id: 'bamboo', name: 'Carbonized Bamboo', color: '#3d2817', thickness: '0.9mm', weight: '14g', finish: 'Natural Oil', price: 80, desc: 'Eco-friendly bamboo with unique grain' }
                ],
                carbon: [
                    { id: 'carbon-fiber', name: 'Carbon Fiber Weave', color: '#1a1a1a', thickness: '0.6mm', weight: '20g', finish: 'Twill Weave', price: 100, desc: 'Aerospace-grade with signature 2x2 pattern' },
                    { id: 'forged-carbon', name: 'Forged Carbon', color: '#2a2a2a', thickness: '0.7mm', weight: '22g', finish: 'Forged Composite', price: 250, desc: 'Hand-forged with unique marble-like patterns' }
                ],
                limited: [
                    { id: 'meteorite', name: 'Meteorite Inlay', color: '#4a4a4a', thickness: '1.2mm', weight: '32g', finish: 'Etched Pattern', price: 500, desc: 'Authentic Muonionalusta meteorite, 4.5B years old', badge: 'Rare' },
                    { id: 'mother-pearl', name: 'Mother of Pearl', color: '#f0f0f0', thickness: '0.9mm', weight: '25g', finish: 'Natural Iridescent', price: 400, desc: 'Genuine pearl with rainbow-like light refraction', badge: 'Exclusive' }
                ]
            }
        };

        // Initialize
       window.addEventListener('load', () => {
    simulateLoading();
    loadMaterials('metal');
    setup3DTilt();
    updateAllCards();
    setupCardInputs();
    
    // Animate card entrance after loader finishes
    setTimeout(() => {
        document.getElementById('cardEntranceWrapper').classList.add('loaded');
    }, 1000);
});

        function simulateLoading() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        document.getElementById('loader').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('loader').style.display = 'none';
                        }, 800);
                    }, 500);
                }
                document.querySelector('.loader-progress').style.width = progress + '%';
            }, 120);
        }

     // Card Zoom Functionality with GSAP
function toggleCardZoom(event) {
    // Prevent zoom if clicking on input fields
    if (event.target.classList.contains('card-input-field')) {
        return;
    }

    if (!state.isZoomed) {
        zoomIn();
    }
    // Don't close when clicking the card itself - let the document handler do that
}

function zoomIn() {
    state.isZoomed = true;
    
    const cardContainer = document.getElementById('cardContainer3d');
    const overlay = document.getElementById('zoomOverlay');
    const closeHint = document.getElementById('closeHint');
    const heroContent = document.getElementById('heroContent');
    const materialsSection = document.getElementById('materials');
    const navbar = document.getElementById('navbar');
    
    // Get card position for FLIP animation
    const rect = cardContainer.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const translateX = centerX - (rect.left + rect.width / 2);
    const translateY = centerY - (rect.top + rect.height / 2);
    
    // Add zoomed class - CSS handles input visibility
    cardContainer.classList.add('zoomed');
    overlay.classList.add('active');
    closeHint.classList.add('visible');
    
    // Pause floating animation
    cardContainer.style.animation = 'none';
    
    // Kill existing tweens
    gsap.killTweensOf(cardContainer);
    
    // Animate overlay
    gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    
    // Animate card to center
    gsap.fromTo(cardContainer, 
        { x: 0, y: 0, scale: 1 },
        {
            x: translateX,
            y: translateY,
            scale: 1.4,
            duration: 0.6,
            ease: 'power3.out',
            onComplete: () => {
                updateAllCards();
                // Focus first empty field
                setTimeout(() => {
                    const nameInput = document.getElementById('inputName');
                    if (!state.cardData.name) nameInput.focus();
                    else document.getElementById('inputTitle').focus();
                }, 100);
            }
        }
    );
    
    // Fade background
    gsap.to([heroContent, materialsSection, navbar], {
        opacity: 1,
        filter: 'blur(1.5px)',
        duration: 0.4,
        ease: 'power2.out'
    });
}

function closeCardZoom() {
    state.isZoomed = false;
    
    const cardContainer = document.getElementById('cardContainer3d');
    const overlay = document.getElementById('zoomOverlay');
    const closeHint = document.getElementById('closeHint');
    const heroContent = document.getElementById('heroContent');
    const materialsSection = document.getElementById('materials');
    const navbar = document.getElementById('navbar');
    
    // Blur all inputs
    document.querySelectorAll('.card-input-field').forEach(input => input.blur());
    
    // Hide hint
    closeHint.classList.remove('visible');
    
    // Kill tweens
    gsap.killTweensOf(cardContainer);
    
    // Animate card back
    gsap.to(cardContainer, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
            cardContainer.classList.remove('zoomed');
            cardContainer.style.transform = '';
            cardContainer.style.animation = '';
            updateAllCards();
        }
    });
    
    // Hide overlay
    gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => overlay.classList.remove('active')
    });
    
    // Restore background
    gsap.to([heroContent, materialsSection, navbar], {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.out'
    });
}// Close zoom when clicking outside card
document.addEventListener('click', (e) => {
    if (state.isZoomed) {
        const cardContainer = document.getElementById('cardContainer3d');
        const inputs = document.querySelectorAll('.card-input-field');
        
        // Check if click is outside card and not on an input
        if (!cardContainer.contains(e.target) && 
            !e.target.classList.contains('card-input-field')) {
            closeCardZoom();
        }
    }
});



// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isZoomed) {
        closeCardZoom();
    }
});
    function setupCardInputs() {
    const nameInput = document.getElementById('inputName');
    const titleInput = document.getElementById('inputTitle');
    const numberInput = document.getElementById('inputNumber');
    const emailInput = document.getElementById('inputEmail');
    const inputs = [nameInput, titleInput, numberInput, emailInput];

    // Helper to show input with proper color
    function showInput(input, color) {
        input.style.opacity = '1';
        input.style.color = color;
    }

    // Click on card area to activate fields
    document.getElementById('cardInputOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'cardInputOverlay') {
            if (!state.cardData.name) {
                showInput(nameInput, '#c9a962');
                nameInput.focus();
            } else if (!state.cardData.title) {
                showInput(titleInput, '#aaaaaa');
                titleInput.focus();
            } else if (!state.cardData.number) {
                showInput(numberInput, '#ffffff');
                numberInput.focus();
            } else if (!state.cardData.email) {
                showInput(emailInput, '#888888');
                emailInput.focus();
            }
        }
    });

    // Input field interactions
    nameInput.addEventListener('focus', () => showInput(nameInput, '#c9a962'));
    titleInput.addEventListener('focus', () => showInput(titleInput, '#aaaaaa'));
    numberInput.addEventListener('focus', () => showInput(numberInput, '#ffffff'));
    emailInput.addEventListener('focus', () => showInput(emailInput, '#888888'));

    // Sync with state on input
    nameInput.addEventListener('input', (e) => {
        state.cardData.name = e.target.value;
        updateChecklist();
    });

    titleInput.addEventListener('input', (e) => {
        state.cardData.title = e.target.value;
    });

    numberInput.addEventListener('input', (e) => {
        state.cardData.number = e.target.value;
        updateChecklist();
    });

    emailInput.addEventListener('input', (e) => {
        state.cardData.email = e.target.value;
        updateChecklist();
    });

    // Tab navigation
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            showInput(titleInput, '#aaaaaa');
            titleInput.focus();
        }
    });

    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            showInput(numberInput, '#ffffff');
            numberInput.focus();
        }
    });

    numberInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            showInput(emailInput, '#888888');
            emailInput.focus();
        }
    });

    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeCardZoom();
    });
}

      function updateChecklist() {
    const nameSpan = document.getElementById('check-name');
    const numSpan = document.getElementById('check-number');
    const emailSpan = document.getElementById('check-email');
    
    nameSpan.textContent = state.cardData.name || 'Click card to enter full name';
    numSpan.textContent = state.cardData.number || 'Click card to enter phone';
    emailSpan.textContent = state.cardData.email || 'Click card to enter email';
    
    // Update completed states
    const item1 = document.getElementById('check-item-1');
    const item2 = document.getElementById('check-item-2');
    const item3 = document.getElementById('check-item-3');
    
    if (state.cardData.name) item1.classList.add('completed');
    else item1.classList.remove('completed');
    
    if (state.cardData.number) item2.classList.add('completed');
    else item2.classList.remove('completed');
    
    if (state.cardData.email) item3.classList.add('completed');
    else item3.classList.remove('completed');
    
    // Show/hide next button
    const nextBtn = document.getElementById('nextBtn');
    if (state.cardData.name && state.cardData.number && state.cardData.email) {
        nextBtn.classList.add('visible');
    } else {
        nextBtn.classList.remove('visible');
    }
}

        

        // Materials
        function loadMaterials(category) {
            const grid = document.getElementById('materialsGrid');
            grid.innerHTML = '';
            
            state.materials[category].forEach((mat, index) => {
                const card = document.createElement('div');
                card.className = `material-card ${mat.id === state.cardData.material ? 'selected' : ''}`;
                card.setAttribute('data-mat-id', mat.id);
                card.onclick = (e) => selectMaterial(mat.id, e);
                card.style.animationDelay = `${index * 0.08}s`;
                
                let bgStyle = `background: ${mat.color};`;
                if (mat.id === 'carbon-fiber') {
                    bgStyle = 'background: linear-gradient(45deg, #1a1a1a 25%, #2a2a2a 25%, #2a2a2a 50%, #1a1a1a 50%, #1a1a1a 75%, #2a2a2a 75%); background-size: 8px 8px;';
                } else if (mat.id === 'forged-carbon') {
                    bgStyle = 'background: #2a2a2a;';
                } else if (mat.id === 'meteorite') {
                    bgStyle = 'background: #4a4a4a;';
                } else if (mat.id === 'mother-pearl') {
                    bgStyle = 'background: linear-gradient(135deg, #fff, #f0f0f0, #fff);';
                }
                
                card.innerHTML = `
                    <div class="material-preview">
                        ${mat.badge ? `<span class="material-badge">${mat.badge}</span>` : ''}
                        <div class="mini-card" style="${bgStyle}">
                            <div style="position: absolute; top: 8px; left: 10px; width: 18px; height: 14px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 3px;"></div>
                            <div style="position: absolute; bottom: 15px; left: 10px; font-family: var(--font-serif); font-size: 8px; color: ${isDarkMaterial(mat.id) ? '#c9a962' : '#1a1a1a'}; font-style: italic;">CARDEL</div>
                            <div style="position: absolute; bottom: 8px; left: 10px; font-size: 5px; color: ${isDarkMaterial(mat.id) ? '#aaa' : '#666'};">•••• 0000</div>
                        </div>
                    </div>
                    <div class="material-info">
                        <h3>${mat.name}</h3>
                        <p>${mat.thickness} • ${mat.weight}</p>
                      <div class="material-price">${mat.price === 0 ? '' : '+$' + mat.price}</div>
                    </div>
                    <div class="material-dots"><span></span><span></span><span></span></div>
                `;
                grid.appendChild(card);
            });
            
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.textContent.toLowerCase().includes(category)) {
                    tab.classList.add('active');
                }
            });
        }

       function filterMaterials(category) {
    const grid = document.getElementById('materialsGrid');
    
    // Fade out current cards
    const currentCards = grid.querySelectorAll('.material-card');
    
    gsap.to(currentCards, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
            // Load new materials after fade out
            loadMaterials(category);
            
            // Animate new cards in with proper sequencing
            const newCards = grid.querySelectorAll('.material-card');
            
            // Set initial state
            gsap.set(newCards, {
                opacity: 0,
                y: 20
            });
            
            // Animate to final state
            gsap.to(newCards, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: 'power2.out'
            });
        }
    });
    
    // Update tab styling
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(category)) {
            tab.classList.add('active');
        }
    });
}

        function selectMaterial(materialId, ev) {
            state.cardData.material = materialId;
            
            document.querySelectorAll('.material-card').forEach(card => {
                card.classList.remove('selected');
            });
            if (ev && ev.currentTarget) {
                ev.currentTarget.classList.add('selected');
            } else {
                document.querySelector(`.material-card[data-mat-id="${materialId}"]`).classList.add('selected');
            }
            
            updateAllCards();
            updateOrderSummary();
            
            const mat = getCurrentMaterial();
            showToast(`${mat.name} selected`);
        }

      

        // Drawing Functions (Canvas)
       function setup3DTilt() {
    const container = document.getElementById('cardContainer3d');
    const wrapper = document.getElementById('card3dWrapper');
    
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let rafId = null;
    let isHovering = false;
    
    // Smooth animation loop
    function animate() {
        // Smooth interpolation (0.08 = slow, smooth follow)
        currentRotateX += (targetRotateX - currentRotateX) * 0.08;
        currentRotateY += (targetRotateY - currentRotateY) * 0.08;
        
        // Apply transform
        wrapper.style.transform = `perspective(1500px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        
        // Continue animation if still hovering or not settled
        if (isHovering || Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
        }
    }
    
    container.addEventListener('mousemove', (e) => {
        if (state.isZoomed) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Much subtler tilt (5 degrees max instead of 15)
        targetRotateX = (y - centerY) / centerY * -5;
        targetRotateY = (x - centerX) / centerX * 5;
        
        if (!isHovering) {
            isHovering = true;
            if (!rafId) animate();
        }
    });
    
    container.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotateX = 0;
        targetRotateY = 0;
        // Animation continues until it settles back to 0
        if (!rafId) animate();
    });
}

        function updateAllCards() {
            drawCard('heroFrontCanvas', 'front', 600, 378);
            drawCard('heroBackCanvas', 'back', 600, 378);
            
            // Sync input values with state
            document.getElementById('inputName').value = state.cardData.name;
            document.getElementById('inputNumber').value = state.cardData.number;
            document.getElementById('inputEmail').value = state.cardData.email;
        }

        function drawCard(canvasId, side, w, h) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
            
            const mat = getCurrentMaterial();
            const isDark = isDarkMaterial(mat.id);
            const textColor = isDark ? '#c9a962' : '#1a1a1a';
            const subTextColor = isDark ? '#ffffff' : '#1a1a1a';
            const accentColor = '#c9a962';
            
            drawBackground(ctx, w, h, mat);
            
            if (side === 'front') {
                drawFrontSide(ctx, w, h, mat, isDark, textColor, subTextColor, accentColor);
            } else {
                drawBackSide(ctx, w, h, mat, isDark, subTextColor, accentColor);
            }
            
            const borderGrad = ctx.createLinearGradient(0, 0, w, h);
            borderGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
            borderGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
            borderGrad.addColorStop(1, 'rgba(255,255,255,0.15)');
            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, w - 2, h - 2);
        }

        function drawBackground(ctx, w, h, mat) {
            if (mat.id === 'carbon-fiber') {
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, w, h);
                const size = w / 40;
                ctx.globalAlpha = 0.15;
                for (let i = -h; i < w; i += size) {
                    const grad = ctx.createLinearGradient(i, 0, i + size, size);
                    grad.addColorStop(0, '#000');
                    grad.addColorStop(0.5, '#555');
                    grad.addColorStop(1, '#000');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i + size, 0);
                    ctx.lineTo(i - h + size, h);
                    ctx.lineTo(i - h, h);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            } else if (mat.id === 'forged-carbon') {
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, w, h);
                for (let i = 0; i < 120; i++) {
                    ctx.globalAlpha = Math.random() * 0.15;
                    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    const s = Math.random() * 40 + 10;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + s, y + Math.random() * 20 - 10);
                    ctx.lineTo(x + s/2, y + s);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            } else if (['walnut', 'bamboo', 'ebony', 'maple'].includes(mat.id)) {
                ctx.fillStyle = mat.color;
                ctx.fillRect(0, 0, w, h);
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = 0.1;
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                for(let i=0; i < w; i+= 5 + Math.random()*15) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    let cx = i;
                    for(let j=0; j<h; j+=30) {
                        cx += (Math.random() - 0.5) * 10;
                        ctx.lineTo(cx, j);
                    }
                    ctx.stroke();
                }
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            } else if (mat.id === 'meteorite') {
                ctx.fillStyle = '#2c2c2c';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 1;
                const drawLines = (angle) => {
                    ctx.save();
                    ctx.translate(w/2, h/2);
                    ctx.rotate(angle * Math.PI / 180);
                    ctx.translate(-w, -h);
                    for(let i=0; i<w*2; i+=8) {
                        ctx.beginPath();
                        ctx.moveTo(i, 0);
                        ctx.lineTo(i, h*2);
                        ctx.stroke();
                    }
                    ctx.restore();
                };
                drawLines(45);
                drawLines(-45);
                drawLines(0);
            } else if (mat.id === 'mother-pearl') {
                const grad = ctx.createLinearGradient(0, 0, w, h);
                grad.addColorStop(0, '#fff');
                grad.addColorStop(0.5, '#f0f0f0');
                grad.addColorStop(1, '#fff');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
                ctx.globalAlpha = 0.1;
                const sheen = ctx.createLinearGradient(0, 0, w, h);
                sheen.addColorStop(0, 'pink');
                sheen.addColorStop(0.5, 'lightgreen');
                sheen.addColorStop(1, 'lightblue');
                ctx.fillStyle = sheen;
                ctx.fillRect(0, 0, w, h);
                ctx.globalAlpha = 1;
            } else {
                const isMirror = mat.finish.toLowerCase().includes('mirror') || mat.finish.toLowerCase().includes('polished');
                drawMetalFinish(ctx, w, h, mat.color, isMirror, isDarkMaterial(mat.id));
            }
        }

        function drawMetalFinish(ctx, w, h, color, isMirror, isDark) {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            const shift = (c, p) => adjustBrightness(c, p * 0.4); 
            if (isMirror) {
                grad.addColorStop(0, shift(color, -20));
                grad.addColorStop(0.4, color);
                grad.addColorStop(0.5, shift(color, 25));
                grad.addColorStop(0.6, color);
                grad.addColorStop(1, shift(color, -20));
            } else {
                grad.addColorStop(0, shift(color, -15));
                grad.addColorStop(0.3, color);
                grad.addColorStop(0.5, shift(color, 10));
                grad.addColorStop(0.7, color);
                grad.addColorStop(1, shift(color, -15));
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            const noiseFactor = isMirror ? 3 : 6; 
            for (let i = 0; i < data.length; i += 4) {
                const r1 = Math.random();
                const r2 = Math.random();
                const noise = ((r1 + r2) / 2 - 0.5) * noiseFactor;
                data[i] = data[i] + noise;
                data[i+1] = data[i+1] + noise;
                data[i+2] = data[i+2] + noise;
            }
            ctx.putImageData(imageData, 0, 0);
            if (!isMirror) {
                ctx.save();
                ctx.globalCompositeOperation = 'overlay'; 
                ctx.globalAlpha = 0.04;
                ctx.fillStyle = '#fff';
                for (let y = 0; y < h; y += 2) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(0, y, w, 1); 
                    }
                }
                ctx.restore();
            }
            const vign = ctx.createRadialGradient(w/2, h/2, w/2.5, w/2, h/2, w);
            vign.addColorStop(0, 'rgba(0,0,0,0)');
            vign.addColorStop(1, 'rgba(0,0,0,0.15)');
            ctx.fillStyle = vign;
            ctx.fillRect(0, 0, w, h);
        }

// HDR-Quality Card Rendering
function drawCard(canvasId, side, w, h) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { 
        alpha: false,
        desynchronized: true 
    });
    
    // High DPI for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    
    const mat = getCurrentMaterial();
    const isDark = isDarkMaterial(mat.id);
    
    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw with HDR-style lighting
    drawHDRBackground(ctx, w, h, mat, isDark);
    
    if (side === 'front') {
        drawHDRFrontSide(ctx, w, h, mat, isDark);
    } else {
        drawHDRBackSide(ctx, w, h, mat, isDark);
    }
    
    // Premium border with gradient
    drawPremiumBorder(ctx, w, h);
}

function drawHDRBackground(ctx, w, h, mat, isDark) {
    // Base material with depth
    if (mat.id === 'carbon-fiber') {
        drawCarbonFiberHDR(ctx, w, h);
    } else if (mat.id === 'forged-carbon') {
        drawForgedCarbonHDR(ctx, w, h);
    } else if (['walnut', 'bamboo', 'ebony', 'maple'].includes(mat.id)) {
        drawWoodHDR(ctx, w, h, mat);
    } else if (mat.id === 'meteorite') {
        drawMeteoriteHDR(ctx, w, h);
    } else if (mat.id === 'mother-pearl') {
        drawMotherOfPearlHDR(ctx, w, h);
    } else {
        drawMetalHDR(ctx, w, h, mat);
    }
    
    // Add subtle vignette for depth
    drawVignette(ctx, w, h, isDark);
}

function drawMetalHDR(ctx, w, h, mat) {
    const isMirror = mat.finish.toLowerCase().includes('mirror') || 
                     mat.finish.toLowerCase().includes('polished');
    
    // Multi-layer gradient for depth
    const baseGrad = ctx.createLinearGradient(0, 0, w, h);
    const color = mat.color;
    
    if (isMirror) {
        // Mirror-like reflective surface
        baseGrad.addColorStop(0, adjustBrightness(color, -30));
        baseGrad.addColorStop(0.25, adjustBrightness(color, -10));
        baseGrad.addColorStop(0.45, adjustBrightness(color, 20));
        baseGrad.addColorStop(0.5, adjustBrightness(color, 40));
        baseGrad.addColorStop(0.55, adjustBrightness(color, 20));
        baseGrad.addColorStop(0.75, adjustBrightness(color, -10));
        baseGrad.addColorStop(1, adjustBrightness(color, -30));
    } else {
        // Brushed metal with subtle variation
        baseGrad.addColorStop(0, adjustBrightness(color, -20));
        baseGrad.addColorStop(0.3, color);
        baseGrad.addColorStop(0.5, adjustBrightness(color, 15));
        baseGrad.addColorStop(0.7, color);
        baseGrad.addColorStop(1, adjustBrightness(color, -20));
    }
    
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Add anisotropic reflection lines (brushed effect)
    if (!isMirror) {
        ctx.save();
        ctx.globalAlpha = 0.03;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        
        for (let y = 0; y < h; y += 3) {
            const opacity = Math.sin(y / h * Math.PI) * 0.5 + 0.5;
            ctx.globalAlpha = opacity * 0.04;
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            // Slight wave for realistic brushed look
            for (let x = 0; x <= w; x += 20) {
                const wave = Math.sin(x / w * Math.PI * 2) * 2;
                ctx.lineTo(x, y + wave);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    
    // Add subtle noise for material realism
    addFilmGrain(ctx, w, h, 0.015);
}

function drawCarbonFiberHDR(ctx, w, h) {
    // Deep black base
    const baseGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
    baseGrad.addColorStop(0, '#1a1a1a');
    baseGrad.addColorStop(1, '#0d0d0d');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Twill weave pattern with depth
    ctx.save();
    const size = 12;
    const cols = Math.ceil(w / size) + 2;
    const rows = Math.ceil(h / size) + 2;
    
    for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
            const x = col * size;
            const y = row * size;
            const isEven = (row + col) % 2 === 0;
            
            // Create 3D effect for weave
            const grad = ctx.createLinearGradient(x, y, x + size, y + size);
            if (isEven) {
                grad.addColorStop(0, '#2a2a2a');
                grad.addColorStop(0.5, '#1a1a1a');
                grad.addColorStop(1, '#0a0a0a');
            } else {
                grad.addColorStop(0, '#0a0a0a');
                grad.addColorStop(0.5, '#1a1a1a');
                grad.addColorStop(1, '#2a2a2a');
            }
            
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, size - 1, size - 1);
        }
    }
    ctx.restore();
    
    // Glossy overlay
    const gloss = ctx.createLinearGradient(0, 0, w, h);
    gloss.addColorStop(0, 'rgba(255,255,255,0.08)');
    gloss.addColorStop(0.5, 'rgba(255,255,255,0)');
    gloss.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, w, h);
}

function drawForgedCarbonHDR(ctx, w, h) {
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, w, h);
    
    // Random marble-like chunks with depth
    ctx.save();
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = Math.random() * 30 + 5;
        const rotation = Math.random() * Math.PI * 2;
        
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Chunk with shadow and highlight
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        const brightness = Math.random();
        if (brightness > 0.6) {
            grad.addColorStop(0, '#3a3a3a');
            grad.addColorStop(1, '#1a1a1a');
        } else {
            grad.addColorStop(0, '#0a0a0a');
            grad.addColorStop(1, '#000000');
        }
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size/2);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.rotate(-rotation);
        ctx.translate(-x, -y);
    }
    ctx.restore();
    
    // Clear coat reflection
    const clearCoat = ctx.createLinearGradient(0, 0, w, h/2);
    clearCoat.addColorStop(0, 'rgba(255,255,255,0.1)');
    clearCoat.addColorStop(0.5, 'rgba(255,255,255,0)');
    ctx.fillStyle = clearCoat;
    ctx.fillRect(0, 0, w, h);
}

function drawWoodHDR(ctx, w, h, mat) {
    // Base wood color with depth
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    baseGrad.addColorStop(0, adjustBrightness(mat.color, 10));
    baseGrad.addColorStop(0.5, mat.color);
    baseGrad.addColorStop(1, adjustBrightness(mat.color, -15));
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Wood grain with organic variation
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    const grainCount = 40;
    for (let i = 0; i < grainCount; i++) {
        const x = (i / grainCount) * w + (Math.random() - 0.5) * 20;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        let currentX = x;
        for (let y = 0; y < h; y += 10) {
            const wave = Math.sin(y / h * Math.PI * 3 + i) * 5 + 
                        (Math.random() - 0.5) * 3;
            currentX += wave * 0.3;
            ctx.lineTo(currentX, y);
        }
        
        const grainWidth = Math.random() * 2 + 0.5;
        ctx.lineWidth = grainWidth;
        ctx.globalAlpha = 0.1 + Math.random() * 0.1;
        ctx.stroke();
    }
    ctx.restore();
    
    // Wood pores texture
    addFilmGrain(ctx, w, h, 0.02);
}

function drawMeteoriteHDR(ctx, w, h) {
    // Metallic gray base
    const baseGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
    baseGrad.addColorStop(0, '#4a4a4a');
    baseGrad.addColorStop(0.7, '#3a3a3a');
    baseGrad.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Widmanstätten pattern (etched lines)
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    
    const drawPattern = (angle, spacing) => {
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.rotate(angle);
        ctx.translate(-w, -h);
        
        for (let i = 0; i < w * 2; i += spacing) {
            const grad = ctx.createLinearGradient(i, 0, i + 2, 0);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = grad;
            
            ctx.beginPath();
            ctx.moveTo(i, 0);
            // Slight curve for realism
            for (let y = 0; y < h * 2; y += 20) {
                const curve = Math.sin(y / 100) * 3;
                ctx.lineTo(i + curve, y);
            }
            ctx.stroke();
        }
        ctx.restore();
    };
    
    drawPattern(Math.PI / 4, 15);
    drawPattern(-Math.PI / 4, 20);
    drawPattern(0, 25);
    ctx.restore();
    
    // Metallic sheen
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0, 'rgba(255,255,255,0.1)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
    sheen.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);
}

function drawMotherOfPearlHDR(ctx, w, h) {
    // Iridescent base
    const baseGrad = ctx.createLinearGradient(0, 0, w, h);
    baseGrad.addColorStop(0, '#ffffff');
    baseGrad.addColorStop(0.3, '#f8f8f8');
    baseGrad.addColorStop(0.5, '#f0f0f0');
    baseGrad.addColorStop(0.7, '#f8f8f8');
    baseGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Iridescent shimmer
    ctx.save();
    const shimmerColors = [
        'rgba(255,200,200,0.1)',
        'rgba(200,255,200,0.1)',
        'rgba(200,200,255,0.1)',
        'rgba(255,255,200,0.1)'
    ];
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = Math.random() * 100 + 50;
        const color = shimmerColors[Math.floor(Math.random() * shimmerColors.length)];
        
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    
    // Pearl texture
    addFilmGrain(ctx, w, h, 0.01);
}

function drawVignette(ctx, w, h, isDark) {
    const vignette = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w);
    if (isDark) {
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(0.7, 'rgba(0,0,0,0.2)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
    } else {
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(0.7, 'rgba(0,0,0,0.05)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.15)');
    }
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
}

function drawPremiumBorder(ctx, w, h) {
    // Multi-layer border for depth
    const borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
    borderGrad.addColorStop(0.2, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
    borderGrad.addColorStop(0.8, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.3)');
    
    // Outer glow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Inner highlight
    const innerGrad = ctx.createLinearGradient(0, 0, 0, h);
    innerGrad.addColorStop(0, 'rgba(255,255,255,0.2)');
    innerGrad.addColorStop(0.1, 'rgba(255,255,255,0)');
    innerGrad.addColorStop(0.9, 'rgba(255,255,255,0)');
    innerGrad.addColorStop(1, 'rgba(255,255,255,0.1)');
    
    ctx.strokeStyle = innerGrad;
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, w - 8, h - 8);
}

function addFilmGrain(ctx, w, h, intensity) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Add this function to your JavaScript
function getContrastColor(backgroundColor) {
    // Remove # if present
    const hex = backgroundColor.replace('#', '');
    
    // Parse RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate relative luminance (WCAG formula)
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    
    // Return black for light backgrounds, white for dark
    // Threshold 0.179 is the mathematical midpoint for optimal contrast
    return luminance > 0.179 ? '#1a1a1a' : '#ffffff';
}

// Enhanced version that also returns secondary text color
function getTextColorsForMaterial(materialColor) {
    const primary = getContrastColor(materialColor);
    return {
        primary: primary,
        secondary: primary === '#1a1a1a' ? '#555555' : '#aaaaaa',
        accent: '#c9a962' // Keep gold accent consistent
    };
}

function drawHDRFrontSide(ctx, w, h, mat, isDark) {
    const scale = w / 600;
    
    // Use the existing isDark check but make text colors more robust
    const textColor = isDark ? '#c9a962' : '#1a1a1a';
    const subTextColor = isDark ? '#ffffff' : '#1a1a1a';
    const accentColor = '#c9a962';
    
    // For light materials, override to ensure visibility
    const isLightMaterial = ['maple', 'mother-pearl', 'silver-metal'].includes(mat.id);
    const finalTextColor = isLightMaterial ? '#1a1a1a' : textColor;
    const finalSubTextColor = isLightMaterial ? '#555555' : subTextColor;
    
    // Corner accents
    drawCornerAccent(ctx, 30 * scale, 30 * scale, 20 * scale, accentColor, true);
    drawCornerAccent(ctx, w - 30 * scale, h - 30 * scale, 20 * scale, accentColor, false);
    
    // Only draw text when not zoomed (this hides placeholder text when editing)
    if (!state.isZoomed) {
        const contentX = 60 * scale;
        const contentY = h / 2 - 20 * scale;
        
        // Name with shadow for depth
        ctx.save();
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4 * scale;
        ctx.shadowOffsetY = 2 * scale;
        ctx.font = `italic ${42 * scale}px "Cormorant Garamond"`;
        ctx.fillStyle = finalTextColor;
        ctx.textAlign = 'left';
        
        // Use state data or fallback to placeholder
        const displayName = state.cardData.name || 'Your Name';
        ctx.fillText(displayName, contentX, contentY);
        ctx.restore();
        
        // Title
        ctx.font = `300 ${13 * scale}px Inter`;
        ctx.fillStyle = finalSubTextColor;
        ctx.letterSpacing = '0.2em';
        const displayTitle = state.cardData.title || 'Creative Director';
        ctx.fillText(displayTitle, contentX, contentY + 28 * scale);
        
        // Divider
        const divGrad = ctx.createLinearGradient(contentX, 0, contentX + 80 * scale, 0);
        divGrad.addColorStop(0, accentColor);
        divGrad.addColorStop(1, isDark ? 'rgba(201,169,98,0.3)' : 'rgba(201,169,98,0.6)');
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.moveTo(contentX, contentY + 45 * scale);
        ctx.lineTo(contentX + 80 * scale, contentY + 45 * scale);
        ctx.stroke();
        
        // Contact info
        const contactY = h - 70 * scale;
        
        ctx.save();
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 2 * scale;
        ctx.font = `400 ${12 * scale}px Inter`;
        ctx.fillStyle = finalTextColor;
        const displayNumber = state.cardData.number || '+1 (555) 000-0000';
        ctx.fillText(displayNumber, contentX, contactY);
        ctx.restore();
        
        ctx.font = `300 ${11 * scale}px Inter`;
        ctx.fillStyle = finalSubTextColor;
        const displayEmail = state.cardData.email || 'hello@cardel.com';
        ctx.fillText(displayEmail, contentX, contactY + 22 * scale);
        // ─── Improved icons: NFC with text + upside-down waves (opening upwards) ────
const iconColor = isLightMaterial ? '#1a1a1a' : (isDark ? '#c9a962' : '#ffffff');
const iconSize = 36 * scale;   // slightly smaller so text fits nicely

// ── NFC icon + "NFC" text ── top right
{
    const centerX = w - 85 * scale;
    const centerY = 55 * scale;
    
    // NFC symbol
    ctx.save();
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = iconSize * 0.14;
    ctx.lineCap = 'round';
    ctx.strokeRect(centerX - iconSize*0.35, centerY - iconSize*0.35, iconSize*0.7, iconSize*0.7);
    for(let i = 1; i <= 3; i++){
        let r = iconSize*0.32 + i*iconSize*0.10;
        ctx.beginPath();
        ctx.arc(centerX + iconSize*0.08, centerY, r, Math.PI*1.05, Math.PI*1.95, false);
        ctx.stroke();
    }
    ctx.restore();
    
    // "NFC" text below the icon
    ctx.save();
    ctx.font = `500 ${11 * scale}px Inter`;
    ctx.fillStyle = iconColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText("NFC", centerX, centerY + iconSize*0.45);
    ctx.restore();
}

// ── Upside-down Wi-Fi / waves icon (curves opening upwards) ── bottom right
{
    const centerX = w - 85 * scale;
    const centerY = h - 55 * scale;
    
    ctx.save();
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = iconSize * 0.13;
    ctx.lineCap = 'round';
    
    // Draw 4 arcs — but flipped (starting from bottom going up)
    for(let i = 1; i <= 4; i++){
        let r = iconSize * 0.18 * i;
        ctx.globalAlpha = 0.35 + i * 0.16;
        ctx.beginPath();
        ctx.arc(centerX, centerY - iconSize*0.12, r, Math.PI * 1.2, Math.PI * 1.8, false);
        ctx.stroke();
    }
    
    // Center dot
    ctx.globalAlpha = 1;
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY - iconSize*0.12, iconSize*0.09, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
}
        
    }
    
    
    // Geometric decoration
    drawGeometricDecoration(ctx, w, h, isDark);
}

function drawHDRBackSide(ctx, w, h, mat, isDark) {
    const scale = w / 600;
    const accentColor = '#c9a962';
    
    // Elegant circle frame with gradient
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Outer ring with glow
    ctx.save();
    ctx.shadowColor = 'rgba(201,169,98,0.3)';
    ctx.shadowBlur = 15 * scale;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1 * scale;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.restore();
    
    // Inner ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 0.5 * scale;
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Monogram with metallic effect
    drawMetallicText(ctx, 'C', centerX, centerY, 
        `300 ${48 * scale}px "Cormorant Garamond"`, accentColor, true);
    
    // Tagline
    ctx.font = `italic ${12 * scale}px "Cormorant Garamond"`;
    ctx.fillStyle = isDark ? '#aaaaaa' : '#666666';
    ctx.textAlign = 'center';
    ctx.fillText('Bespoke Identity', centerX, centerY + 50 * scale);
    
    // Corner accents
    drawCornerAccent(ctx, w - 30 * scale, 30 * scale, 20 * scale, accentColor, true, true);
    drawCornerAccent(ctx, 30 * scale, h - 30 * scale, 20 * scale, accentColor, false, true);
    
   
    
    // QR code if enabled
    if (state.orderConfig.addons.qr) {
        drawPremiumQR(ctx, 60 * scale, 60 * scale, 50 * scale);
    }
}

function drawCornerAccent(ctx, x, y, size, color, isTop, isInverted = false) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    
    // Add subtle glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    
    ctx.beginPath();
    if (isTop && !isInverted) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y);
        ctx.lineTo(x + size, y);
    } else if (!isTop && !isInverted) {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y);
        ctx.lineTo(x - size, y);
    } else if (isTop && isInverted) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y);
        ctx.lineTo(x - size, y);
    } else {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y);
        ctx.lineTo(x + size, y);
    }
    ctx.stroke();
    ctx.restore();
}

function drawMetallicText(ctx, text, x, y, font, color, centered = true) {
    ctx.save();
    
    // Create metallic gradient for text
    const metrics = ctx.measureText(text);
    const textGrad = ctx.createLinearGradient(x - metrics.width/2, y - 20, x + metrics.width/2, y + 20);
    textGrad.addColorStop(0, adjustBrightness(color, 20));
    textGrad.addColorStop(0.3, color);
    textGrad.addColorStop(0.5, adjustBrightness(color, 30));
    textGrad.addColorStop(0.7, color);
    textGrad.addColorStop(1, adjustBrightness(color, 10));
    
    ctx.font = font;
    ctx.fillStyle = textGrad;
    ctx.textAlign = centered ? 'center' : 'left';
    ctx.textBaseline = 'middle';
    
    // Add subtle shadow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawGeometricDecoration(ctx, w, h, isDark) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = isDark ? '#fff' : '#000';
    ctx.lineWidth = 0.5;
    
    // Concentric circles
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(w - 100, h - 100, 30 + (i * 15), 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawPremiumQR(ctx, x, y, size) {
    // QR background with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 5, y - 5, size + 10, size + 10);
    ctx.restore();
    
    // QR pattern
    ctx.fillStyle = '#1a1a1a';
    const moduleSize = size / 7;
    
    // Simplified QR with position patterns
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            // Corner patterns
            const isCorner = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4);
            // Center pattern
            const isCenter = (i >= 2 && i <= 4 && j >= 2 && j <= 4);
            // Random data
            const isData = Math.random() > 0.5;
            
            if (isCorner || isCenter || isData) {
                ctx.fillRect(x + i * moduleSize, y + j * moduleSize, 
                    moduleSize - 1, moduleSize - 1);
            }
        }
    }
    
    // Label
    ctx.font = '300 8px Inter';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO CONNECT', x + size/2, y + size + 15);
}       function isDarkMaterial(id) {
            const darkMaterials = ['black-metal', 'carbon-fiber', 'forged-carbon', 'walnut', 'ebony', 'bamboo', 'meteorite'];
            return darkMaterials.includes(id);
        }

        function adjustBrightness(color, percent) {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, Math.max(0, (num >> 16) + amt));
            const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
            const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
            return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
        }

        function getCurrentMaterial() {
            for (const cat of Object.keys(state.materials)) {
                const mat = state.materials[cat].find(m => m.id === state.cardData.material);
                if (mat) return mat;
            }
            return state.materials.metal[0];
        }

        function showToast(message) {
            const t = document.getElementById('toast');
            t.textContent = message;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }
// Intersection Observer for scroll animations and card cloning
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reveal section
                if (entry.target.classList.contains('reveal-section')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                // Clone hero card to this section if it has a card container
                const cardContainer = entry.target.querySelector('.steps-card-container, .partners-card-container');
                if (cardContainer && !cardContainer.hasChildNodes()) {
                    cloneHeroCard(cardContainer);
                }
                
                // Reveal items with stagger
                const items = entry.target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        if (item.style.transform.includes('scaleX')) {
                            item.style.transform = 'scaleX(1)';
                        }
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.reveal-section').forEach(section => {
        observer.observe(section);
    });
});

// Track which sections have been revealed
const revealedSections = new Set();

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !revealedSections.has(entry.target.id)) {
                revealedSections.add(entry.target.id);
                
                // Reveal section
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Render cards for this section
                if (entry.target.id === 'steps-section') {
                    renderStepsCard();
                } else if (entry.target.id === 'partners-section') {
                    renderPartnersCard();
                }
                
                // Reveal items with stagger
                const items = entry.target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        if (item.style.transform.includes('scaleX')) {
                            item.style.transform = 'scaleX(1)';
                        }
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.reveal-section').forEach(section => {
        observer.observe(section);
    });
});

// Render card for steps section
function renderStepsCard() {
    const canvas = document.getElementById('stepsCardCanvas');
    if (!canvas || typeof drawCard !== 'function') return;
    
    // Set canvas size with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = 380 * dpr;
    canvas.height = 240 * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Draw the card using existing function logic
    drawPreviewCard(ctx, 380, 240, 'front');
}

// Render card for partners section
function renderPartnersCard() {
    const canvas = document.getElementById('partnersCardCanvas');
    if (!canvas || typeof drawCard !== 'function') return;
    
    // Set canvas size with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 360 * dpr;
    canvas.height = 225 * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Draw the card using existing function logic
    drawPreviewCard(ctx, 360, 225, 'front');
}

// Draw preview card using existing state and materials
function drawPreviewCard(ctx, w, h, side) {
    const mat = getCurrentMaterial();
    const isDark = isDarkMaterial(mat.id);
    const textColor = isDark ? '#c9a962' : '#1a1a1a';
    const subTextColor = isDark ? '#ffffff' : '#1a1a1a';
    const accentColor = '#c9a962';
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    // Draw background using existing function
    drawBackground(ctx, w, h, mat);
    
    // Draw card content
    if (side === 'front') {
        drawPreviewFrontSide(ctx, w, h, mat, isDark, textColor, subTextColor, accentColor);
    }
    
    // Draw border
    const borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
    borderGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.15)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
}

// Draw front side for preview
function drawPreviewFrontSide(ctx, w, h, mat, isDark, textColor, subTextColor, accentColor) {
    const scale = w / 600;
    
    // Corner accents
    drawCornerAccent(ctx, 20 * scale, 20 * scale, 15 * scale, accentColor, true);
    drawCornerAccent(ctx, w - 20 * scale, h - 20 * scale, 15 * scale, accentColor, false);
    
    const contentX = 40 * scale;
    const contentY = h / 2 - 10 * scale;
    
    // Name
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 3 * scale;
    ctx.font = `italic ${28 * scale}px "Cormorant Garamond"`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    const displayName = state.cardData.name || 'Your Name';
    ctx.fillText(displayName, contentX, contentY);
    ctx.restore();
    
    // Title
    ctx.font = `300 ${10 * scale}px Inter`;
    ctx.fillStyle = subTextColor;
    ctx.letterSpacing = '0.2em';
    const displayTitle = state.cardData.title || 'Creative Director';
    ctx.fillText(displayTitle, contentX, contentY + 20 * scale);
    
    // Divider
    const divGrad = ctx.createLinearGradient(contentX, 0, contentX + 60 * scale, 0);
    divGrad.addColorStop(0, accentColor);
    divGrad.addColorStop(1, isDark ? 'rgba(201,169,98,0.3)' : 'rgba(201,169,98,0.6)');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(contentX, contentY + 35 * scale);
    ctx.lineTo(contentX + 60 * scale, contentY + 35 * scale);
    ctx.stroke();
    
    // Contact info
    const contactY = h - 50 * scale;
    
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 2 * scale;
    ctx.font = `400 ${10 * scale}px Inter`;
    ctx.fillStyle = textColor;
    const displayNumber = state.cardData.number || '+1 (555) 000-0000';
    ctx.fillText(displayNumber, contentX, contactY);
    ctx.restore();
    
    ctx.font = `300 ${9 * scale}px Inter`;
    ctx.fillStyle = subTextColor;
    const displayEmail = state.cardData.email || 'hello@cardel.com';
    ctx.fillText(displayEmail, contentX, contactY + 18 * scale);
    
    // NFC Icon
    const iconColor = isDark ? '#c9a962' : '#1a1a1a';
    const iconSize = 24 * scale;
    const nfcX = w - 50 * scale;
    const nfcY = 25 * scale;
    
    ctx.save();
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = iconSize * 0.14;
    ctx.lineCap = 'round';
    ctx.strokeRect(nfcX - iconSize*0.35, nfcY - iconSize*0.35, iconSize*0.7, iconSize*0.7);
    for(let i = 1; i <= 3; i++){
        let r = iconSize*0.32 + i*iconSize*0.10;
        ctx.beginPath();
        ctx.arc(nfcX + iconSize*0.08, nfcY, r, Math.PI*1.05, Math.PI*1.95, false);
        ctx.stroke();
    }
    ctx.font = `500 ${8 * scale}px Inter`;
    ctx.fillStyle = iconColor;
    ctx.textAlign = 'center';
    ctx.fillText("NFC", nfcX, nfcY + iconSize*0.6);
    ctx.restore();
    
    // WiFi Icon
    const wifiX = w - 50 * scale;
    const wifiY = h - 30 * scale;
    
    ctx.save();
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = iconSize * 0.13;
    ctx.lineCap = 'round';
    
    for(let i = 1; i <= 4; i++){
        let r = iconSize * 0.18 * i;
        ctx.globalAlpha = 0.35 + i * 0.16;
        ctx.beginPath();
        ctx.arc(wifiX, wifiY - iconSize*0.12, r, Math.PI * 1.2, Math.PI * 1.8, false);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    ctx.fillStyle = iconColor;
    ctx.beginPath();
    ctx.arc(wifiX, wifiY - iconSize*0.12, iconSize*0.09, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
}

// Update preview cards when state changes
const originalUpdateAllCards = updateAllCards;
updateAllCards = function() {
    originalUpdateAllCards();
    
    // Re-render preview cards if sections are visible
    if (revealedSections.has('steps-section')) {
        renderStepsCard();
    }
    if (revealedSections.has('partners-section')) {
        renderPartnersCard();
    }
};
    


        (function() {
            const wrap = document.getElementById('cardFloatWrap');
            if (!wrap) return;

            const card = wrap.querySelector('.about-card-image');
            if (!card) return;

            let wrapRect = wrap.getBoundingClientRect();
            const MAX_ROTATE = 3.5;      // max rotation in degrees
            const MAX_TRANSLATE = 6;      // max pixel shift

            window.addEventListener('resize', () => {
                wrapRect = wrap.getBoundingClientRect();
            });

            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const normX = (x / rect.width) * 2 - 1;
                const normY = (y / rect.height) * 2 - 1;

                const rotateY = normX * MAX_ROTATE;
                const rotateX = normY * -MAX_ROTATE;
                const moveX = normX * MAX_TRANSLATE;
                const moveY = normY * MAX_TRANSLATE;

                card.style.transform = `
                    perspective(800px)
                    translateX(${moveX}px)
                    translateY(${moveY}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
            });

            wrap.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });

            wrap.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.transform = 'perspective(800px) translateX(0) translateY(0) rotateX(0) rotateY(0)';
            });
        })();
    
    
const revealSections = document.querySelectorAll('.reveal-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            entry.target.classList.add('active');

            const items = entry.target.querySelectorAll('.reveal-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('active');
                }, index * 150); // stagger animation
            });

        }
    });
}, { threshold: 0.15 });

revealSections.forEach(section => {
    observer.observe(section);
});



function continueToMaterials() {
    saveToStorage();
    window.location.href = 'materials.html';
}

function loadFromStorage() {
    const saved = localStorage.getItem('cardel_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state.cardData, parsed.cardData);
        Object.assign(state.orderConfig, parsed.orderConfig);
    }
}

// Material helpers
function getCurrentMaterial() {
    for (const cat of Object.keys(state.materials)) {
        const mat = state.materials[cat].find(m => m.id === state.cardData.material);
        if (mat) return mat;
    }
    return state.materials.metal[0];
}

function isDarkMaterial(id) {
    const darkMaterials = ['black-metal', 'carbon-fiber', 'forged-carbon', 'walnut', 'ebony', 'bamboo', 'meteorite'];
    return darkMaterials.includes(id);
}

// Order functions
function selectQuantity(qty, price, element) {
    state.orderConfig.quantity = qty;
    state.orderConfig.basePrice = price;
    document.querySelectorAll('.quantity-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    updateOrderSummary();
    saveToStorage();
}

function toggleAddon(addon) {
    state.orderConfig.addons[addon] = !state.orderConfig.addons[addon];
    const toggle = document.getElementById(addon + 'Toggle');
    const priceLine = document.getElementById(addon + 'SummaryLine');
    
    if (state.orderConfig.addons[addon]) {
        toggle.classList.add('active');
        if (priceLine) priceLine.style.display = 'flex';
    } else {
        toggle.classList.remove('active');
        if (priceLine) priceLine.style.display = 'none';
    }
    updateOrderSummary();
    saveToStorage();
}

function updateOrderSummary() {
    const mat = getCurrentMaterial();
    const qty = state.orderConfig.quantity;
    let total = state.orderConfig.basePrice;
    
    document.getElementById('summaryQty').textContent = `${qty}x ${mat.name} Cards`;
    document.getElementById('summaryBasePrice').textContent = `$${state.orderConfig.basePrice}`;
    
    if (state.orderConfig.addons.qr) total += 45;
    if (state.orderConfig.addons.laser) total += 80;
    
    document.getElementById('summaryTotal').textContent = `$${total.toLocaleString()}`;
}



function showToast(message) {
    const t = document.getElementById('toast');
    t.textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
// ================================================
// THREE.JS Global Scrolling Card Controller (V4 - Magnetic & Sticky)
// ================================================

const ThreeCardController = {
    isInitialized: false,

    init() {
        if (this.isInitialized) return;

        this.canvas = document.getElementById('threeOverlay');
        if (!this.canvas || typeof THREE === 'undefined') return;

        // 1. Scene & Camera Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.updateCameraZ(); 

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // 2. Textures
        this.frontTexture = new THREE.CanvasTexture(document.getElementById('heroFrontCanvas'));
        this.backTexture = new THREE.CanvasTexture(document.getElementById('heroBackCanvas'));
        this.frontTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        this.backTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        // 3. Custom Rounded Rectangle Geometry
        this.cardGroup = new THREE.Group();
        const cardW = 600;
        const cardH = 378;
        const cardDepth = 4;
        const radius = 24; 

        const shape = new THREE.Shape();
        shape.moveTo(radius, 0);
        shape.lineTo(cardW - radius, 0);
        shape.quadraticCurveTo(cardW, 0, cardW, radius);
        shape.lineTo(cardW, cardH - radius);
        shape.quadraticCurveTo(cardW, cardH, cardW - radius, cardH);
        shape.lineTo(radius, cardH);
        shape.quadraticCurveTo(0, cardH, 0, cardH - radius);
        shape.lineTo(0, radius);
        shape.quadraticCurveTo(0, 0, radius, 0);

        const faceGeo = new THREE.ShapeGeometry(shape);
        faceGeo.center(); 
        faceGeo.computeBoundingBox(); 

        const box = faceGeo.boundingBox;
        const pos = faceGeo.attributes.position;
        const uvs = [];
        for (let i = 0; i < pos.count; i++) {
            const u = (pos.getX(i) - box.min.x) / (box.max.x - box.min.x);
            const v = (pos.getY(i) - box.min.y) / (box.max.y - box.min.y);
            uvs.push(u, v);
        }
        faceGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const frontMesh = new THREE.Mesh(
            faceGeo, 
            new THREE.MeshBasicMaterial({ map: this.frontTexture, transparent: true })
        );
        frontMesh.position.z = (cardDepth / 2) + 0.2; 

        const backGeo = faceGeo.clone();
        const backUvs = [];
        for (let i = 0; i < pos.count; i++) {
            const u = (pos.getX(i) - box.min.x) / (box.max.x - box.min.x);
            const v = (pos.getY(i) - box.min.y) / (box.max.y - box.min.y);
            backUvs.push(1.0 - u, v); 
        }
        backGeo.setAttribute('uv', new THREE.Float32BufferAttribute(backUvs, 2));

        const backMesh = new THREE.Mesh(
            backGeo, 
            new THREE.MeshBasicMaterial({ map: this.backTexture, transparent: true })
        );
        backMesh.rotation.y = Math.PI; 
        backMesh.position.z = -(cardDepth / 2) - 0.2; 

        const extrudeSettings = { depth: cardDepth, bevelEnabled: false };
        const edgeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        edgeGeo.center();
        
        const edgeMesh = new THREE.Mesh(
            edgeGeo, 
            new THREE.MeshBasicMaterial({ color: 0x111111 }) 
        );

        this.cardGroup.add(frontMesh);
        this.cardGroup.add(backMesh);
        this.cardGroup.add(edgeMesh);
        this.scene.add(this.cardGroup);

        const ogUpdate = window.updateAllCards || function(){};
        window.updateAllCards = () => {
            ogUpdate();
            this.frontTexture.needsUpdate = true;
            this.backTexture.needsUpdate = true;
        };

        // 5. Track DOM Anchors
        this.anchors = [
            document.getElementById('cardEntranceWrapper'), 
            document.getElementById('stepsCardCanvas'),     
            document.querySelector('.about-card-image'),    
            document.getElementById('partnersCardCanvas')   
        ];

        this.anchors.forEach((anchor, i) => {
            if (i > 0 && anchor) {
                anchor.style.cursor = 'pointer';
                anchor.addEventListener('click', () => {
                    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
                });
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.updateCameraZ();
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.setupScrollTrigger();
        });

        this.setupScrollTrigger();
        this.frameCount = 0;
        this.renderLoop();
        this.isInitialized = true;
    },

    updateCameraZ() {
        this.camera.position.z = window.innerHeight / (2 * Math.tan((45 * Math.PI) / 360));
    },

    setupScrollTrigger() {
        if (!this.anchors[0] || !this.anchors[3]) return;

        ScrollTrigger.getAll().forEach(st => {
            if (st.vars.id && st.vars.id.includes('threeCard')) st.kill();
        });

        this.proxy = { progress: 0 };

        // Main Animation Track
        gsap.timeline({
            scrollTrigger: {
                id: 'threeCardTrack',
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5 
            }
        }).to(this.proxy, { progress: 3, ease: "none" });

        // Magnetic Scroll Snapping (Gently centers the section when scrolling stops)
       /* const snapSections = [
            { id: '#hero', ratio: 0 },         // Snaps to top
            { id: '#steps-section', ratio: 0.5 }, // Snaps to center
            { id: '.about-lux-section', ratio: 0.5 },
            { id: '#partners-section', ratio: 0.5 }
        ];

        snapSections.forEach((sec, i) => {
            const el = document.querySelector(sec.id);
            if(el) {
                ScrollTrigger.create({
                    id: `threeCardSnap${i}`,
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    snap: {
                        snapTo: sec.ratio, 
                        duration: { min: 0.3, max: 0.6 },
                        delay: 0.15, // Wait briefly after scrolling stops
                        ease: "power2.inOut"
                    }
                });
            }
        });*/
    },

    renderLoop() {
        requestAnimationFrame(() => this.renderLoop());

        if (!this.anchors[0]) return;

        if (this.frameCount < 120) {
            this.frontTexture.needsUpdate = true;
            this.backTexture.needsUpdate = true;
            this.frameCount++;
        }

        const scrollY = window.scrollY;
        const domCard = this.anchors[0];

        if (scrollY < 50 || (typeof state !== 'undefined' && state.isZoomed)) {
            domCard.style.opacity = '1';
            domCard.style.pointerEvents = 'auto';
            this.cardGroup.visible = false;
        } else {
            domCard.style.opacity = '0';
            domCard.style.pointerEvents = 'none';
            this.cardGroup.visible = true;
        }

        if (this.cardGroup.visible) {
            let progress = this.proxy ? this.proxy.progress : 0;
            
            let currentIndex = Math.floor(progress);
            if (currentIndex >= 3) currentIndex = 2; 
            
            let nextIndex = Math.min(currentIndex + 1, 3);
            let rawSegment = progress - currentIndex; 

            // THE DEADZONE MAGIC: 
            // Creates a 12% buffer where the card locks perfectly into the anchor
            let segmentProgress = (rawSegment - 0.12) / 0.76;
            segmentProgress = Math.max(0, Math.min(1, segmentProgress));
            
            // Smoothly ease in and out of the deadzone so it doesn't jerk
            segmentProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

            const a1 = this.anchors[currentIndex];
            const a2 = this.anchors[nextIndex];

            if (a1 && a2) {
                const rect1 = a1.getBoundingClientRect();
                const rect2 = a2.getBoundingClientRect();

                const x1 = rect1.left + rect1.width / 2 - window.innerWidth / 2;
                const y1 = -(rect1.top + rect1.height / 2) + window.innerHeight / 2;
                const scale1 = rect1.width / 600;

                const x2 = rect2.left + rect2.width / 2 - window.innerWidth / 2;
                const y2 = -(rect2.top + rect2.height / 2) + window.innerHeight / 2;
                const scale2 = rect2.width / 600;

                const targetX = THREE.MathUtils.lerp(x1, x2, segmentProgress);
                const targetY = THREE.MathUtils.lerp(y1, y2, segmentProgress);
                const targetScale = THREE.MathUtils.lerp(scale1, scale2, segmentProgress);

                this.cardGroup.position.set(targetX, targetY, 0);
                this.cardGroup.scale.set(targetScale, targetScale, targetScale);

                const baseRotation = currentIndex * (Math.PI * 2);
                const transitionRotation = segmentProgress * (Math.PI * 2);
                
                // Tilt logic is zeroed out when resting inside the anchor
                const isResting = segmentProgress === 0 || segmentProgress === 1;
                const tilt = isResting ? 0 : (targetX / window.innerWidth) * 0.15;

                this.cardGroup.rotation.y = baseRotation + transitionRotation;
                this.cardGroup.rotation.z = tilt;
                this.cardGroup.rotation.x = -tilt;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        ThreeCardController.init();
    }, 200);
});
