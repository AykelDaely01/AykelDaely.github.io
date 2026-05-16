document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi ikon Lucide
  lucide.createIcons();

  // 2. Set tahun hak cipta secara otomatis
  document.getElementById('copyright-year').textContent = `© ${new Date().getFullYear()} Nama Lengkap, S.Tr.KKK. All rights reserved.`;

  // 3. Logika Navbar Mobile
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
      mobileMenuIcon.setAttribute('data-lucide', 'menu');
    } else {
      mobileMenuIcon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
  });

  // Menutup menu mobile saat link diklik
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // 4. Update Nav Link Aktif 
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // Memberikan shadow ke navbar saat di-scroll
    if (window.scrollY > 10) {
      navbar.classList.add('shadow-md');
    } else {
      navbar.classList.remove('shadow-md');
    }

    // Mendeteksi section aktif (Beranda, Pengalaman, dll)
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-navy');
      link.classList.add('text-slate-500');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.remove('text-slate-500');
        link.classList.add('text-navy');
      }
    });
  });

  // 5. Fetch API (Memanggil data JSON untuk Sertifikasi & Blog)
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderCertifications(data.certifications);
      renderBlog(data.blog);
      // Re-inisialisasi ikon lucide untuk elemen HTML yang baru digenerate
      lucide.createIcons();
      // Re-observe elemen baru untuk memutar animasinya
      observeElements();
    })
    .catch(error => console.error('Gagal memuat data.json:', error));

  function renderCertifications(certs) {
    const container = document.getElementById('certifications-container');
    if (!container) return;
    
    container.innerHTML = certs.map((cert, index) => `
      <div class="animate-on-scroll delay-${(index % 4) * 100} group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl opacity-0 translate-y-10">
        <div class="relative h-48 overflow-hidden">
          <img src="${cert.image}" alt="${cert.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-navy/20 transition-opacity group-hover:opacity-0"></div>
        </div>
        <div class="p-6 text-left">
          <span class="text-xs font-bold uppercase tracking-widest text-safety-orange">${cert.issuer}</span>
          <h4 class="mt-2 text-lg font-bold text-navy underline-offset-4 group-hover:underline">${cert.title}</h4>
          <div class="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span class="font-mono">${cert.year}</span>
            <i data-lucide="external-link" class="w-4 h-4"></i>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderBlog(posts) {
    const container = document.getElementById('blog-container');
    if (!container) return;

    container.innerHTML = posts.map((post, index) => `
      <article class="animate-on-scroll delay-${(index % 3) * 100} group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl opacity-0 translate-y-10">
        <div class="relative h-56 overflow-hidden">
          <img src="${post.image}" alt="${post.title}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        <div class="p-8">
          <time class="text-xs font-bold text-slate-400">${post.date}</time>
          <h3 class="mt-3 text-xl font-bold text-navy leading-tight group-hover:text-safety-orange">
            ${post.title}
          </h3>
          <p class="mt-4 text-slate-600 line-clamp-3">
            ${post.excerpt}
          </p>
          <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <span class="text-sm font-bold text-navy flex items-center gap-2 group-hover:gap-4 transition-all">
              BACA LANJUT <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 6. Scroll Animations via IntersectionObserver
  function observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Menghapus kelas-kelas inisialisasi yang membuatnya "tersembunyi"
          entry.target.classList.remove('opacity-0', 'translate-y-10', '-translate-x-10', 'translate-x-10', 'scale-90');
          // Menambahkan kelas visibilitas 
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
          
          // Trigger lebar skill bar (HSE Plan, FMEA, dll)
          const skillBars = entry.target.querySelectorAll('.skill-bar');
          skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            if (width) {
              bar.style.width = width;
            }
          });

          // Unobserve agar animasi hanya terjadi sekali
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // Muncul saat elemen terlihat 10%

    // Observasi semua elemen dengan 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Memanggil fungsi animasi untuk pertama kalinya
  observeElements();
});
