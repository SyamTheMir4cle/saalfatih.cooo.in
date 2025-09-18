// src/components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section id="Hero">
      <div className="hero-text-wrapper hero-reveal-element">
        <p>Hi There!, I'm Syamil Adnan Alfatih</p>
        <h1>
          Web Developer with
          <span className="sub-headline">Passion on Graphic Design</span>
        </h1>
      </div>
      <div id="main-img" className="hero-reveal-element">
        {/* Pastikan gambar ada di folder public */}
        <img src="/HeroImgInteractive.svg" alt="Hero Image" />
      </div>
    </section>
  );
};

export default Hero;