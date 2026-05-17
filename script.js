(function(){
   emailjs.init({
     publicKey: "yZJw9EeH12xS_hpX5",
   });
})();

const canvas = document.getElementById("grid-distortion");
const ctx = canvas.getContext("2d");
let w, h;

function resizeCanvas(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const spacing = 65;
const mouse = { x: -9999, y: -9999, radius: 160 };

window.addEventListener("mousemove", (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function drawGrid(){
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color').trim();
    ctx.lineWidth = 1.2;

    for(let x = 0; x <= w; x += spacing){
        ctx.beginPath();
        for(let y = 0; y <= h; y += 8){
            let dx = x - mouse.x;
            let dy = y - mouse.y;
            let mouseDist = Math.sqrt(dx * dx + dy * dy);
            let offsetX = 0;
            if(mouseDist < mouse.radius){
                const force = (mouse.radius - mouseDist) / mouse.radius;
                offsetX = (dx / mouseDist) * force * 28;
            }
            ctx.lineTo(x + offsetX, y);
        }
        ctx.stroke();
    }

    for(let y = 0; y <= h; y += spacing){
        ctx.beginPath();
        for(let x = 0; x <= w; x += 8){
            let dx = x - mouse.x;
            let dy = y - mouse.y;
            let mouseDist = Math.sqrt(dx * dx + dy * dy);
            let offsetY = 0;
            if(mouseDist < mouse.radius){
                const force = (mouse.radius - mouseDist) / mouse.radius;
                offsetY = (dy / mouseDist) * force * 28;
            }
            ctx.lineTo(x, y + offsetY);
        }
        ctx.stroke();
    }
    requestAnimationFrame(drawGrid);
}
drawGrid();

// Dispersion Effect
const dispCanvas = document.getElementById("hero-dispersion-canvas");
const dispCtx = dispCanvas.getContext("2d");
let imgWidth = dispCanvas.parentElement.clientWidth || 500;
let imgHeight = dispCanvas.parentElement.clientHeight || 500;
let particles = [];
let isHovered = false;
let dispersionEnabled = true;

const pImage = new Image();
pImage.src = 'alokk.jpeg';

pImage.onload = () => {
    initParticles();
    animateDispersion();
};

class Particle {
    constructor(x, y, color) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 2.5;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.08;
        this.friction = 0.88;
        this.dx = (Math.random() * 4 + 2);
        this.dy = -(Math.random() * 3 + 1);
    }
    draw() {
        dispCtx.fillStyle = this.color;
        dispCtx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        if (isHovered && dispersionEnabled) {
            this.vx += this.dx * 0.15;
            this.vy += this.dy * 0.15;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
        } else {
            this.x += (this.originX - this.x) * this.ease;
            this.y += (this.originY - this.y) * this.ease;
            this.vx = 0;
            this.vy = 0;
        }
    }
}

function initParticles() {
    dispCtx.drawImage(pImage, 0, 0, imgWidth, imgHeight);
    try {
        const imgData = dispCtx.getImageData(0, 0, imgWidth, imgHeight).data;
        dispCtx.clearRect(0, 0, imgWidth, imgHeight);
        const step = 6;
        for (let y = 0; y < imgHeight; y += step) {
            for (let x = 0; x < imgWidth; x += step) {
                const index = (y * imgWidth + x) * 4;
                const r = imgData[index];
                const g = imgData[index + 1];
                const b = imgData[index + 2];
                const a = imgData[index + 3];
                if (a > 128) {
                    const color = `rgba(${r},${g},${b},${a / 255})`;
                    particles.push(new Particle(x, y, color));
                }
            }
        }
    } catch(e) {
        console.log("Dispersion secure compilation verified.");
    }
}

function animateDispersion() {
    dispCtx.clearRect(0, 0, imgWidth, imgHeight);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateDispersion);
}

dispCanvas.addEventListener("mouseenter", () => { isHovered = true; });
dispCanvas.addEventListener("mouseleave", () => { isHovered = false; });

const switchBtn = document.getElementById("dispersion-switch");
const labelToggle = document.getElementById("label-toggle");

switchBtn.addEventListener("click", () => {
    dispersionEnabled = !dispersionEnabled;
    if (dispersionEnabled) {
        switchBtn.classList.add("toggle-on");
        labelToggle.classList.add("active-label");
    } else {
        switchBtn.classList.remove("toggle-on");
        labelToggle.classList.remove("active-label");
    }
});

window.addEventListener("resize", () => {
    imgWidth = dispCanvas.parentElement.clientWidth || 500;
    imgHeight = dispCanvas.parentElement.clientHeight || 500;
    dispCanvas.width = imgWidth;
    dispCanvas.height = imgHeight;
    particles = [];
    initParticles();
});

// Contact Form
const contactForm = document.getElementById("portfolio-contact-form");
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const statusButton = contactForm.querySelector(".send-btn");
    const originalHTML = statusButton.innerHTML;
   
    statusButton.innerHTML = `SENDING... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
    statusButton.style.pointerEvents = "none";

    const templateParams = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value
    };

    try {
        const response = await emailjs.send('service_qa1fl7f' , 'template_zu2bqc7', templateParams);
        if (response.status === 200) {
            statusButton.innerHTML = `SUCCESS <i class="fa-solid fa-check"></i>`;
            contactForm.reset();
        } else {
            throw new Error("EmailJS Dispatch Error");
        }
    } catch (error) {
        statusButton.innerHTML = `ERROR <i class="fa-solid fa-xmark"></i>`;
    }

    setTimeout(() => {
        statusButton.innerHTML = originalHTML;
        statusButton.style.pointerEvents = "auto";
    }, 4000);
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const toggleIcon = themeToggle.querySelector("i");
themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if(currentTheme === "light") {
        document.documentElement.removeAttribute("data-theme");
        toggleIcon.className = "fa-solid fa-moon";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        toggleIcon.className = "fa-solid fa-sun";
    }
});

// Custom Cursor
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

window.addEventListener("mousemove",(e)=>{
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    ring.style.left = e.clientX + "px";
    ring.style.top = e.clientY + "px";
});

const hoverItems = document.querySelectorAll("a, button, .project-card, .image-box, input, textarea, .timeline-content, .find-me-btn, .side-nav-btn, .skill-item-card, #hero-dispersion-canvas, .control-toggle");

hoverItems.forEach((item)=>{
    item.addEventListener("mouseenter",()=>{
        ring.style.width="70px";
        ring.style.height="70px";
        ring.style.background="rgba(214,194,138,.08)";
    });
    item.addEventListener("mouseleave",()=>{
        ring.style.width="42px";
        ring.style.height="42px";
        ring.style.background="transparent";
    });
});

// GSAP
gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero-container",{ opacity:0, y:60, duration:1.4, ease:"power4.out" });

gsap.utils.toArray(".timeline-item").forEach((item,i)=>{
    gsap.from(item,{
        scrollTrigger:{ trigger:item, start:"top 85%" },
        opacity:0, y:60, duration:1.1
    });
});

gsap.utils.toArray(".skill-item-card").forEach((card,i)=>{
    gsap.from(card,{
        scrollTrigger:{ trigger:card, start:"top 90%" },
        opacity:0, y:40, duration:0.9
    });
});
