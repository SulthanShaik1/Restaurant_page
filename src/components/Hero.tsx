// src/components/Hero.tsx
// import "./Hero.css";
// import heroImg from "../assets/hero.jpeg"; 

// export default function Hero() {
//   return (
//     <div className="hero-wrapper">
//       <img
//         className="hero-image"
//         src=""
//         alt="Delicious food hero"
//         loading="lazy"
//       />
//       <div className="hero-overlay">
//         <h1 className="hero-title">Bringing your favourite food closer</h1>
//         <p className="hero-sub">Discover local restaurants & flavours</p>
//       </div>
//     </div>
//   );
// }


// src/components/Hero.tsx
import "./Hero.css";
import heroImg from "../assets/Hero.jpeg"; // adjust path if needed

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <img className="hero-image" src={heroImg} alt="Delicious food hero" loading="lazy" />
      <div className="hero-overlay">
        <h1 className="hero-title">Bringing your favourite food closer</h1>
        <p className="hero-sub">Discover local restaurants & flavours</p>
      </div>
    </div>
  );
}
