const canvas = document.getElementById("hero-3d");
const form = document.getElementById("bookingForm");
const successMsg = document.getElementById("successMsg");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

function initHero3D() {
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 2.6, 7.5);

  const ambient = new THREE.AmbientLight(0xf4e6c0, 0.8);
  const keyLight = new THREE.DirectionalLight(0xe8c485, 1.1);
  keyLight.position.set(3.5, 5, 4.5);
  const fillLight = new THREE.DirectionalLight(0x8294a8, 0.6);
  fillLight.position.set(-4, 2, -2);
  scene.add(ambient, keyLight, fillLight);

  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.25, 5),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.35 })
  );
  base.position.y = -0.45;
  group.add(base);

  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x404040,
    metalness: 0.65,
    roughness: 0.3,
  });

  const towers = [
    [1.2, 2.8, 1.2, -1.4, 1.0],
    [1.0, 2.2, 1.0, 1.2, 1.1],
    [1.15, 3.2, 1.15, -0.1, -1.2],
    [0.9, 1.8, 0.9, 1.75, -1.25],
  ];

  towers.forEach(([w, h, d, x, z]) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), towerMat);
    tower.position.set(x, h / 2 - 0.3, z);
    group.add(tower);
  });

  scene.add(group);

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function animate() {
    if (!isReducedMotion) {
      group.rotation.y += 0.0023;
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouseY * 0.08, 0.02);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, mouseX * 0.03, 0.02);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 0.25, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.6 - mouseY * 0.2, 0.03);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initAnimations() {
  if (typeof gsap === "undefined") return;
  if (gsap.registerPlugin && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.to(".hero-content", {
    y: -22,
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.utils.toArray(".reveal").forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 86%",
      },
    });
  });
}

function initFloorPlanLightbox() {
  document.querySelectorAll(".plan-card").forEach((card) => {
    card.addEventListener("click", () => {
      const imgSrc = card.getAttribute("data-plan");
      if (!imgSrc) return;
      lightboxImage.src = imgSrc;
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function close() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }

  closeLightbox.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) close();
  });
}

function initForm() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name");

    successMsg.textContent = `Thank you, ${name}. Our advisor will call you shortly to confirm your free site visit.`;
    form.reset();
  });
}

initHero3D();
initAnimations();
initFloorPlanLightbox();
initForm();
