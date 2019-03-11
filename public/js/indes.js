let sliderImages
let fadeSideNotes

let arrowLeft = document.querySelector("#left")
let arrowRight = document.querySelector("#right")
let slideIndex = 0

 function slideInit(){
     slideIndex = 0
     sliderImages = document.querySelectorAll(".imageHolder")
     fadeSideNotes = document.querySelectorAll(".captionText")
     sliderImages[slideIndex].style.opacity = 1
     fadeSideNotes[slideIndex].style.display = "block"
 }

 slideInit()


function plusSlides(n){
    moveSlide(slideIndex + n)
}




function moveSlide(n){
    let current, next, nextNote, prevNote;
    let moveSlideAnimClass = {
        forCurrent : "",
        forNext : ""
    }
    if(n > slideIndex){
        if(n >= sliderImages.length){
            n = 0
        }
        moveSlideAnimClass.forCurrent = "moveCurrentLeft"
        moveSlideAnimClass.forNext = "moveNextLeft"
        
    }else if(n < slideIndex){ 
        if(n < 0 ){
            n = sliderImages.length - 1;
        }
        moveSlideAnimClass.forCurrent = "moveCurrentRight"
        moveSlideAnimClass.forNext = "moveNextRight"
    }
    if(n !== slideIndex){
        nextNote = fadeSideNotes[n]
        prevNote = fadeSideNotes[slideIndex]
        next = sliderImages[n]
        current = sliderImages[slideIndex]
        sliderImages.forEach(image => {
            image.className = "imageHolder" 
        })
        fadeSideNotes.forEach(note => {
            note.style.display = "none" 
        })
        current.classList.add(moveSlideAnimClass.forCurrent)
        next.classList.add(moveSlideAnimClass.forNext)
        prevNote.style.display = "none"
        nextNote.classList.add("animated")
        nextNote.classList.add("fadeIn")
        nextNote.style.display = "block"
    }
    slideIndex = n
 
}

 function setTimer(){
      setInterval(() => {
        plusSlides(1)
     }, 4000)
 }
 

 setTimer();




























































// function reset() {
//     sliderImages.forEach(imago => {
//         imago.style.display = 'none'
//     })
//     fadeSideNotes.forEach(note => {
//         note.style.display = "none"
//     })
// }

// function slide(){
//     reset()
//     sliderImages[0].style.display = "block"
//     fadeSideNotes[0].style.display = "block"

// }

// // show previous
//  function slideLeft () {
//     reset()
//     sliderImages[current - 1].style.display = "block"
//     fadeSideNotes[current - 1].style.display = "block"
//     current--   
// }

// arrowLeft.addEventListener("click", () => {
//     if(current === 0){
//         current = sliderImages.length
//     }
//     slideLeft()
// })


// function slideRight () {
//     reset()
//     sliderImages[current + 1].style.display = "block"
//     fadeSideNotes[current + 1].style.display = "block"
//     current++   
// }

// arrowRight.addEventListener("click", () => {
//     if(current === sliderImages.length - 1){
//         current = -1
//     }
//     slideRight()
// })

// slide()