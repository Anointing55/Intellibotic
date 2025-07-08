// frontend/src/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        dark: "#1e293b",
        light: "#f8fafc"
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-in": "scaleIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 }
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}
