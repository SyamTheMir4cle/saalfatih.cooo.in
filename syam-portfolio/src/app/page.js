// src/app/page.js
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import Inspire from '@/components/Inspire';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import Preloader from '@/components/Preloader';

export default function Home() {
  return (
    // Kita akan menggunakan <main> sebagai pengganti .container untuk praktik terbaik
    <main className="container">
      {/* Komponen-komponen ini masih statis. 
        Kita akan menambahkan animasi dan interaktivitas di langkah berikutnya.
      */}
      <Hero />
      <Contact />
    </main>
  );
}