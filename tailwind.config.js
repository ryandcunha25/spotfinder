/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif",
      },
      colors:{
        primary: "#FD3D57",
        grey : "#D3D3D3"
      },
      backgroundImage: {
        'test-img': "url('../public/images/jordan_homescreen.webp')",
      }
    },
  },
  plugins: [],
};


// 