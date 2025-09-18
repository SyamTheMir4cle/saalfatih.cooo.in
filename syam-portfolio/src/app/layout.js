import { Inter } from 'next/font/google';
import './globals.css';

// Konfigurasi font Inter
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Syamil Adnan Alfatih', // Judul website Anda
  description: 'Portfolio of Syamil Adnan Alfatih, a Web Developer with a passion for Graphic Design.', // Deskripsi website
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Terapkan kelas font ke body */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}