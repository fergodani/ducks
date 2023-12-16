// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, setDoc, getDocs, doc, getDoc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAioGtJQh8iuk05MmsqWQ88Szj3hnCW0sY",
    authDomain: "patos-24b85.firebaseapp.com",
    projectId: "patos-24b85",
    storageBucket: "patos-24b85.appspot.com",
    messagingSenderId: "683857961436",
    appId: "1:683857961436:web:9f4d128abcb22f25882f19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

document.addEventListener('DOMContentLoaded', async function () {
    const patitos = []
    const querySnapshot = await getDocs(collection(db, "ducks"));
    querySnapshot.forEach((doc) => {
        patitos.push(doc.data())
    });
    patitos.sort((a, b) => a.id - b.id)
    const main = document.querySelector("main")
    for (let i = 0; i < patitos.length; i++) {
        if (patitos[i].caught)
            main.insertAdjacentHTML("beforeend", "<div ><p>" + (i + 1) + "</p><button class='circle' id='p" + i + "'><img src='duck.png'></button></div>")
        else
            main.insertAdjacentHTML("beforeend", "<div ><p>" + (i + 1) + "</p><button class='circle' id='p" + i + "'><img src='duckBN.png'></button></div>")

        document.querySelector("#p" + i).addEventListener('click', function () {
            switchPatito(i)
        })
    }
    
    const restantes = patitos.filter(duck => !duck.caught)
    document.getElementById("restante").innerText = "Te quedan " + restantes.length
    document.getElementById("llevas").innerText = "Llevas " + (patitos.length - restantes.length)
});

async function switchPatito(index) {
    console.log("Switching " + index)
    const docRef = doc(db, "ducks", index + "");
    const docSnap = await getDoc(docRef);
    const duck = docSnap.data()
    console.log(duck)
    const boton = document.getElementById("p" + index)
    const imagen = boton.querySelector("img")
    if (duck.caught) {
        imagen.src = "duckBN.png"
        await updateDoc(docRef, { caught: false })
    } else {
        imagen.src = "duck.png"
        await updateDoc(docRef, { caught: true })
    }
}

// *** SNOW ***
var Snow = {
    el: "#snow",
    density: 40000, // higher = fewer bits
    maxHSpeed: 2, // How much do you want them to move horizontally
    minFallSpeed: 1,
    canvas: null,
    ctx: null,
    particles: [],
    colors: [],
    mp: 1,
    quit: false,
    init() {
        this.canvas = document.querySelector(this.el);
        this.ctx = this.canvas.getContext("2d");
        this.reset();
        requestAnimationFrame(this.render.bind(this));
        window.addEventListener("resize", this.reset.bind(this));
    },
    reset() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.particles = [];
        this.mp = Math.ceil(this.w * this.h / this.density);
        for (var i = 0; i < this.mp; i++) {
            var size = Math.random() * 4 + 5;
            this.particles.push({
                x: Math.random() * this.w, //x-coordinate
                y: Math.random() * this.h, //y-coordinate
                w: size,
                h: size,
                vy: this.minFallSpeed + Math.random(), //density
                vx: (Math.random() * this.maxHSpeed) - this.maxHSpeed / 2,
                fill: "#ffffff",
                s: (Math.random() * 0.2) - 0.1
            });
        }
    },

    render() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.particles.forEach((p, i) => {
            p.y += p.vy;
            p.x += p.vx;
            this.ctx.fillStyle = p.fill;
            this.ctx.fillRect(p.x, p.y, p.w, p.h);
            if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
                p.x = Math.random() * this.w;
                p.y = -10;
            }
        });
        if (this.quit) {
            return;
        }
        requestAnimationFrame(this.render.bind(this));
    },
    destroy() {
        this.quit = true;
    }

};

var confetti = Snow.init();

