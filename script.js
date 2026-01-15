window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const alreadyVisited = localStorage.getItem("visited");

  if (!alreadyVisited) {

    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      localStorage.setItem("visited", "true");
    }, 1500);
  } else {

    loadingScreen.classList.add("hidden");
  }
});

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            successMessage.style.display = "block";
            form.reset();
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);
        } else {
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        }
    } catch (error) {
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
});


  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("mars"), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

  
    const textureLoader = new THREE.TextureLoader();

    const geometry = new THREE.SphereGeometry(10, 64, 64);
    const marsTexture = textureLoader.load("mars.jpg", () => {
        initAnimations();
    });
    const material = new THREE.MeshStandardMaterial({ map: marsTexture, transparent: true });
    const mars = new THREE.Mesh(geometry, material);
    scene.add(mars);


    const atmosphereGeometry = new THREE.SphereGeometry(10.2, 64, 64);
    const atmosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x909090,
        transparent: true,
        opacity: 0.1,
        depthWrite: false
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    atmosphere.position.copy(mars.position);


    function addStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const starVertices = [];
        for (let i = 0; i < 1500; i++) {
            const x = THREE.MathUtils.randFloatSpread(200);
            const y = THREE.MathUtils.randFloatSpread(200);
            const z = THREE.MathUtils.randFloatSpread(200);
            starVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
        return stars;
    }
    const stars = addStars();

    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(20, 20, 50);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

 
    camera.position.set(0, 0, 30);
    camera.lookAt(mars.position);

 
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();


    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        const rotationTween = gsap.to([mars.rotation, atmosphere.rotation, stars.rotation], {
            y: Math.PI * 2,
            duration: 200,
            repeat: -1,
            ease: "none"
        });

        const marsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
                markers: false
            }
        });

        marsTimeline.to(camera.position, { z: 15, ease: "power2.inOut" }, 0);
        marsTimeline.to([mars.rotation, atmosphere.rotation], { x: 1, ease: "power2.inOut" }, 0); 
        
      marsTimeline.to([mars.scale, atmosphere.scale], {
    x: 10, y: 10, z: 10, 
    ease: "power2.in"
}, "<0.2");

        marsTimeline.to([mars.material, atmosphere.material], {
            opacity: 0,
            ease: "power2.in"
        }, "<1");


        ScrollTrigger.create({
            trigger: "#community-section",
            start: "top center",
            onEnter: () => rotationTween.pause(),
            onLeaveBack: () => rotationTween.resume()
        });

        document.querySelectorAll(".page-section").forEach(section => {
             gsap.fromTo(section, { opacity: 0, y: 50 }, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
             });
        });

        gsap.fromTo(".footer", { opacity: 0, y: 20 }, {
            scrollTrigger: {
                trigger: ".footer",
                start: "top 100%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });

        const scrollButton = document.getElementById("scrollDownButton");
        const communitySection = document.getElementById("community-section");
        const contactSection = document.getElementById("contact");
        
        const sections = [communitySection, contactSection];
        let nextSectionIndex = 0;

        if (scrollButton) {
            scrollButton.addEventListener("click", () => {
                if (scrollButton.classList.contains("up")) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    if (sections[nextSectionIndex]) {
                        sections[nextSectionIndex].scrollIntoView({ behavior: "smooth" });
                    }
                }
            });

            ScrollTrigger.create({
                trigger: communitySection,
                start: "top center",
                end: "bottom center",
                onEnter: () => { nextSectionIndex = 1; },
                onLeaveBack: () => { nextSectionIndex = 0; }
            });

            ScrollTrigger.create({
                trigger: contactSection,
                start: "top center",
                onEnter: () => {
                    scrollButton.classList.add("up");
                   
                },
                onLeaveBack: () => {
                    scrollButton.classList.remove("up");
                   
                }
            });
        }
    }

    const languageToggle = document.getElementById("language-toggle");

function setLanguage(lang) {
    document.querySelectorAll("[data-tr]").forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    localStorage.setItem("lang", lang);
}


window.addEventListener("load", () => {
    const savedLang = localStorage.getItem("lang") || "tr";
    languageToggle.checked = savedLang === "en"; 
    setLanguage(savedLang);
});


languageToggle.addEventListener("change", () => {
    const lang = languageToggle.checked ? "en" : "tr";
    setLanguage(lang);
});


