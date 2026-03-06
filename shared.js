<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CARDEL - Complete Your Order</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&family=Inter:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Same navbar -->
    <nav class="navbar" id="navbar">
        <div class="nav-inner">
            <div class="nav-left"></div>
            <div class="nav-center">
                <div class="nav-logo">CARDEL</div>
            </div>
            <div class="nav-right">
                <a href="index.html" class="nav-begin">← Back</a>
            </div>
        </div>
        <div class="nav-divider"><hr></div>
        <div class="nav-links-wrapper">
            <ul class="nav-links">
                <li><a href="index.html">Design</a></li>
                <li><a href="index.html#materials">Materials</a></li>
                <li><a href="#">Atelier</a></li>
                <li><a href="order.html" class="active">Order</a></li>
                <li><a href="#">Help</a></li>
            </ul>
        </div>
    </nav>

    <!-- Order Section Only -->
    <section id="order" class="visible" style="padding-top: 140px; min-height: 100vh; opacity: 1;">
        <div class="order-container">
            <!-- Left Side - Configuration -->
            <div class="order-left">
                <div class="order-header">
                    <span class="order-number">3</span>
                    <h2 class="order-title">Configuration & Order</h2>
                    <p class="order-subtitle">Finalize your card specifications and complete your order securely.</p>
                </div>

                <!-- Selected Design Summary -->
                <div class="section-box" id="designSummary" style="margin-bottom: 2rem; background: #f9f9f9;">
                    <div class="section-label">Your Design</div>
                    <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1rem;">
                        <div id="summaryMaterialPreview" style="width: 80px; height: 50px; border-radius: 8px; background: #0a0a0a;"></div>
                        <div>
                            <div id="summaryName" style="font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #1a1a1a;">Your Name</div>
                            <div id="summaryMaterial" style="font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #6b6b6b; margin-top: 0.25rem;">Black Metal Matte</div>
                        </div>
                    </div>
                    <a href="index.html" style="display: inline-block; margin-top: 1rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #c9a962; text-decoration: underline;">Edit Design →</a>
                </div>

                <!-- Card Type / Quantity -->
                <div class="section-box">
                    <div class="section-label">Card Type</div>
                    <div class="section-sublabel">Select quantity:</div>

                    <div class="quantity-options">
                        <div class="quantity-option selected" onclick="selectQuantity(10, 590, this)">
                            <div class="quantity-radio"></div>
                            <div class="quantity-label">10 Cards</div>
                            <div class="quantity-price">$590</div>
                        </div>
                        <div class="quantity-option" onclick="selectQuantity(25, 1225, this)">
                            <div class="popular-badge">Popular</div>
                            <div class="quantity-radio"></div>
                            <div class="quantity-label">25 Cards</div>
                            <div class="quantity-price">$1,225</div>
                        </div>
                        <div class="quantity-option" onclick="selectQuantity(50, 2250, this)">
                            <div class="quantity-radio"></div>
                            <div class="quantity-label">50 Cards</div>
                            <div class="quantity-price">$2,250</div>
                        </div>
                    </div>
                </div>

                <!-- Add-ons -->
                <div class="section-box">
                    <div class="section-label">Add-Ons</div>
                    <div class="section-sublabel">Enhance your card:</div>

                    <div class="addon-item">
                        <div class="addon-info">
                            <div class="addon-radio included"></div>
                            <div class="addon-text">
                                <h4>NFC Chip</h4>
                                <p>Tap to share contact info</p>
                            </div>
                        </div>
                        <div class="addon-price included">Included</div>
                    </div>

                    <div class="addon-item">
                        <div class="addon-info">
                            <div class="toggle-switch" id="qrToggle" onclick="toggleAddon('qr')"></div>
                            <div class="addon-text">
                                <h4>QR Code</h4>
                                <p>Digital link</p>
                            </div>
                        </div>
                        <div class="addon-price" id="qrPrice">+$45</div>
                    </div>

                    <div class="addon-item">
                        <div class="addon-info">
                            <div class="toggle-switch" id="laserToggle" onclick="toggleAddon('laser')"></div>
                            <div class="addon-text">
                                <h4>Laser Engraving</h4>
                                <p>Custom text or logo</p>
                            </div>
                        </div>
                        <div class="addon-price" id="laserPrice">+$80</div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Preview & Summary -->
           <div class="order-preview-section">
                
                <div class="final-card-container" style="perspective: 1000px;">
                    <div class="final-card" id="finalCard" style="transform-style: preserve-3d; transition: transform 0.2s; cursor: pointer;" onclick="flipCard()" title="Click to flip">
                        
                        <div id="flipInner" style="position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1); transform-style: preserve-3d;">
                            
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden;">
                                <canvas id="finalFrontCanvas" style="width: 100%; height: 100%; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);"></canvas>
                            </div>
                            
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg);">
                                <canvas id="finalBackCanvas" style="width: 100%; height: 100%; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);"></canvas>
                            </div>

                        </div>

                    </div>
                    <div style="text-align: center; margin-top: 1rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #888;">
                        ⟳ Click card to flip
                    </div>
                </div>

                <div class="order-summary-box">
                    <div class="summary-title">Order Summary</div>
                    <div class="summary-line">
                        <span class="summary-label" id="summaryQty">10x Black Metal Cards</span>
                        <span class="summary-value" id="summaryBasePrice">$590</span>
                    </div>
                    <div class="summary-line" id="qrSummaryLine" style="display: none;">
                        <span class="summary-label">QR Code</span>
                        <span class="summary-value">+$45</span>
                    </div>
                    <div class="summary-line" id="laserSummaryLine" style="display: none;">
                        <span class="summary-label">Laser Engraving</span>
                        <span class="summary-value">+$80</span>
                    </div>
                    <div class="summary-line total">
                        <span class="summary-label">Total</span>
                        <span class="summary-value" id="summaryTotal">$590</span>
                    </div>
                    <div class="tax-note">All taxes included</div>
                    <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
                    <div class="security-badges">
                        <div class="security-badge"><span>🔒</span><span>Secure Checkout</span></div>
                        <div class="security-badge"><span style="font-size: 1.2rem;">💳</span><span>Encrypted Payment</span></div>
                        <div class="security-badge"><span>✓</span><span>30 Day Guarantee</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="toast" id="toast"></div>

    <script src="shared.js"></script>
  <script>
        let isFlipped = false;

        // Order page specific initialization
        window.addEventListener('load', () => {
            if (typeof loadFromStorage === 'function') loadFromStorage();
            
            updateDesignSummary();
            updateOrderSummary();
            renderBothSides();

            // Intercept the toggleAddon function from shared.js to update the canvases live!
            const originalToggleAddon = window.toggleAddon;
            if (typeof originalToggleAddon === 'function') {
                window.toggleAddon = function(addon) {
                    originalToggleAddon(addon); // Run the original math
                    renderBothSides(); // Redraw the canvases
                    
                    // If they just turned ON the QR code or Laser, automatically flip the card to show them!
                    if ((addon === 'qr' || addon === 'laser') && state.orderConfig.addons[addon] && !isFlipped) {
                        flipCard();
                    }
                };
            }
        });

        function updateDesignSummary() {
            const mat = getCurrentMaterial();
            document.getElementById('summaryName').textContent = state.cardData.name || 'Your Name';
            document.getElementById('summaryMaterial').textContent = mat.name;
            
            let bgStyle = mat.color;
            if (mat.id === 'carbon-fiber') bgStyle = '#1a1a1a';
            if (mat.id === 'forged-carbon') bgStyle = '#2a2a2a';
            if (mat.id === 'meteorite') bgStyle = '#4a4a4a';
            if (mat.id === 'mother-pearl') bgStyle = 'linear-gradient(135deg, #fff, #f0f0f0, #fff)';
            document.getElementById('summaryMaterialPreview').style.background = bgStyle;
        }

        function renderBothSides() {
            if (typeof drawCard !== 'function') return;

            // Draw Front
            drawCard('finalFrontCanvas', 'front', 600, 378);
            
            // Draw Back (QR Code is automatically handled inside shared.js drawHDRBackSide)
            drawCard('finalBackCanvas', 'back', 600, 378);

            // Explicitly draw the Laser Engraving on the back if enabled
            if (state.orderConfig.addons.laser) {
                drawLaserEngraving('finalBackCanvas');
            }
        }

        function drawLaserEngraving(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            
            // We don't scale by DPR here because drawCard already scaled the context,
            // we just need the mathematical width mapping
            const scale = 600 / 600; 
            const w = 600;
            const h = 378;
            
            ctx.save();
            const isDark = isDarkMaterial(state.cardData.material);
            
            // Laser etch styling (looks slightly burned/etched into the material)
            ctx.fillStyle = isDark ? '#c9a962' : '#222222';
            ctx.shadowColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.4)';
            ctx.shadowBlur = 1;
            ctx.shadowOffsetY = 1;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
           
            // Generate a fake serial number based on their name length for realism
            const serialNum = (state.cardData.name.length * 1024).toString().padStart(4, '0');
            ctx.fillText(`EDITION NO. ${serialNum}`, w / 2, h - 35 * scale);
            
            ctx.restore();
        }

        function flipCard() {
            isFlipped = !isFlipped;
            const inner = document.getElementById('flipInner');
            if (inner) {
                inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
        }

        // 3D Hover Tilt Effect (Applied to the outer wrapper so it doesn't break the flip!)
        const finalCardWrapper = document.getElementById('finalCard');
        if (finalCardWrapper) {
            finalCardWrapper.addEventListener('mousemove', (e) => {
                const rect = finalCardWrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                finalCardWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            finalCardWrapper.addEventListener('mouseleave', () => {
                finalCardWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }

        function proceedToCheckout() {
            saveToStorage(); 
            showToast('Redirecting to secure checkout...');
        }
    </script>
</body>
</html>
