// Three.js 3D Models Setup
let scene1, scene2, renderer1, renderer2;
let robot, dnaHelix;
let mouseX = 0, mouseY = 0;

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initMatrixRain();
    init3DModels();
    initScrollEffects();
    initFormHandling();
    createFloatingIcons();
    initSkillBars();
    initActiveNavigation();
});

// Active Navigation System
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section, .hero');
    
    navLinks.forEach(link => link.classList.remove('active'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.id;
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Track mouse position for 3D models
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Initialize 3D Models
function init3DModels() {
    initAbout3D();
}

function initAbout3D() {
    const container = document.getElementById('about3d');
    if (!container) return;

    scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer2 = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer2.setSize(container.offsetWidth, container.offsetHeight);
    renderer2.setClearColor(0x000000, 0);
    container.appendChild(renderer2.domElement);

    const robotGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, transparent: true, opacity: 0.9 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    robotGroup.add(head);
    
    // Eyes with cyan glow
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00d4ff, 
        emissive: 0x00d4ff, 
        emissiveIntensity: 1 
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 2.2, 0.75);
    robotGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 2.2, 0.75);
    robotGroup.add(rightEye);
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    robotGroup.add(body);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1.5, 0, 0);
    robotGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1.5, 0, 0);
    robotGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.6, 2.5, 0.6);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.6, -2.5, 0);
    robotGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.6, -2.5, 0);
    robotGroup.add(rightLeg);
    
    // Wireframe sphere around robot
    const wireframeGeometry = new THREE.IcosahedronGeometry(3, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    robotGroup.add(wireframe);
    
    scene2.add(robotGroup);
    robot = robotGroup;

    // Lighting
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(3, 3, 3);
    scene2.add(light2);

    const ambientLight2 = new THREE.AmbientLight(0x00d4ff, 0.4);
    scene2.add(ambientLight2);

    const pointLight = new THREE.PointLight(0x7b2ff7, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene2.add(pointLight);

    camera2.position.z = 8;
    camera2.position.y = 0;

    function animateAbout() {
        requestAnimationFrame(animateAbout);
        
        if (robot) {
            // Robot follows mouse
            robot.rotation.x = mouseY * 0.3;
            robot.rotation.y = mouseX * 0.5;
            robot.position.y = Math.sin(Date.now() * 0.001) * 0.3;
            
            // Rotate wireframe
            wireframe.rotation.x += 0.005;
            wireframe.rotation.y += 0.01;
        }
        
        // Move point light with mouse
        pointLight.position.x = mouseX * 3;
        pointLight.position.y = mouseY * 3;
        
        renderer2.render(scene2, camera2);
    }
    animateAbout();
}

// Scroll Effects
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('nav');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(0, 212, 255, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 26, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .project-card, .experience-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Form Handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const button = form.querySelector('.cta-button');
        const originalText = button.textContent;
        
        button.classList.add('btn-loading');
        button.textContent = '';
        
        setTimeout(() => {
            button.classList.remove('btn-loading');
            button.textContent = 'MESSAGE SENT!';
            button.style.background = 'linear-gradient(135deg, #00d4ff, #7b2ff7)';
            button.style.color = '#ffffff';
            
            form.reset();
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'transparent';
                button.style.color = '#00d4ff';
            }, 3000);
            
        }, 2000);
    });
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
            this.style.borderColor = '#00d4ff';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            this.style.borderColor = '#00d4ff';
        });
    });
}

// Create Floating Icons
function createFloatingIcons() {
    const icons = ['ðŸ¤–', 'ðŸ§ ', 'âš¡', 'ðŸ”¬', 'ðŸ’»', 'ðŸš€', 'ðŸŒ', 'ðŸ“Š'];
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section) => {
        for (let i = 0; i < 3; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon';
            icon.textContent = icons[Math.floor(Math.random() * icons.length)];
            icon.style.left = Math.random() * 100 + '%';
            icon.style.top = Math.random() * 100 + '%';
            icon.style.animationDelay = Math.random() * 6 + 's';
            icon.style.animationDuration = (Math.random() * 4 + 4) + 's';
            section.appendChild(icon);
        }
    });
}

// Animate Skill Bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.style.width;
                progress.style.width = '0%';
                
                setTimeout(() => {
                    progress.style.width = width;
                }, 200);
                
                skillObserver.unobserve(progress);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Window Resize Handler
window.addEventListener('resize', () => {
    if (renderer2) {
        const container2 = document.getElementById('about3d');
        if (container2) {
            const camera2 = scene2.children.find(child => child instanceof THREE.PerspectiveCamera);
            if (camera2) {
                camera2.aspect = container2.offsetWidth / container2.offsetHeight;
                camera2.updateProjectionMatrix();
            }
            renderer2.setSize(container2.offsetWidth, container2.offsetHeight);
        }
    }
    
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
});

// Console Messages
console.log('%cðŸš€ Data Science Portfolio Online', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%câš¡ All systems operational', 'color: #00d4ff; font-size: 12px;');
console.log('%cðŸ¤– Ready for interaction...', 'color: #7b2ff7; font-size: 12px;');
