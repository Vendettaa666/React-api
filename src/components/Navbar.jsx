import { useState, useEffect } from "react";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fungsi untuk scroll ke section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 64; // fallback 64px
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`navbar py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-zinc-900/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="logo">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
           My Music
          </h1>
        </div>

        <ul
          className={`menu hidden md:flex flex-row items-center gap-6 text-white`}
        >
          <li>
            <a
              href="#hero"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="#anggota"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("anggota");
              }}
            >
              Anggota
            </a>
          </li>
          <li>
            <a
              href="#aktivitas"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("aktivitas");
              }}
            >
              Aktivitas
            </a>
          </li>
          <li>
            <a
              href="#galeri-anggota"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("galeri-anggota");
              }}
            >
              Members
            </a>
          </li>
          <li>
            <a
              href="#kontak"
              className="text-base font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("kontak");
              }}
            >
              Join Us
            </a>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white z-50"
          onClick={() => setActive(!active)}
        >
          <i className={`ri-${active ? "close" : "menu"}-line ri-2x`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md transition-all duration-300 ${
          active
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center py-6 gap-4 text-white">
          <li>
            <a
              href="#hero"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
                setActive(false);
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
                setActive(false);
              }}
            >
              About me
            </a>
          </li>
          <li>
            <a
              href="#anggota"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("anggota");
                setActive(false);
              }}
            >
              Anggota
            </a>
          </li>
          <li>
            <a
              href="#aktivitas"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("aktivitas");
                setActive(false);
              }}
            >
              Aktivitas
            </a>
          </li>
          <li>
            <a
              href="#galeri-anggota"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("galeri-anggota");
                setActive(false);
              }}
            >
                Member
            </a>
          </li>
          <li>
            <a
              href="#kontak"
              className="text-lg font-medium hover:text-violet-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("kontak");
                setActive(false);
              }}
            >
              Join Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;