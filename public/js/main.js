moment().format()


let header = document.querySelector("header")
let overlay = document.querySelector(".overlay")
let botton = document.querySelector("#replybutton")
let commentInput = document.querySelector("#commentText")
let newCommentBtn = document.querySelector("#ajaxAddReply")
let bodyData = document.querySelector(".titleLead")
let commentsBody = document.querySelector("#commentBlock")
let close = document.querySelector(".close-overlay")
let inner = document.querySelector(".inner-container")
// let commentbutton = document.querySelector("#commentjs")
// let overlay = document.querySelector(".overlay")
// let inner = document.querySelector(".inner-container")
// let header = document.querySelector("header")
close.addEventListener("click", function () {
    inner.style.filter = "blur(0)"
    overlay.classList.remove("new-class")
    header.style.display = "block"
})




newCommentBtn.addEventListener("click", function () {
    event.preventDefault()
    event.stopPropagation()
    postComment()
})

// window.onload = 


// setInterval(getComments,1000)

getComments()

function user() {
    let commentbutton = document.querySelector("#commentjs")
    let box = document.querySelector("#comments")
    let visible = false;
    commentbutton.addEventListener("click", function (event) {
        if (!visible) {
            box.classList.remove("commentse")
            box.classList.add("animated")
            box.classList.add("slideInLeft")
            visible = true
        }
    })
}

function noUser() {
    let commentbutton = document.querySelector("#commentjs")
    let overlay = document.querySelector(".overlay")
    let inner = document.querySelector(".inner-container")
    let header = document.querySelector("header")
    commentbutton.addEventListener("click", function (event) {
        inner.style.filter = "blur(2px)"
        overlay.classList.add("new-class")
        header.style.display = "none"
    })
}




// let edit = document.querySelector("#edit")
// let updateform = document.querySelector("#editcomment")
// let texty = document.querySelector("#textareaupdate")
// let cancel = document.querySelector("#cancel")


function postComment() {
    let url = `/api/blogs/${bodyData.dataset.key}/comments`
    fetch(url, {
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({
                "content": commentInput.value
            })
        })
        .then(function (res) {
            if (!res.ok) {
                throw Error(res.statusText)
            }
            return res        })
        .then(function (data) {
            console.log("i see you")
            let res = data.json()
            return res
        })
        .then(function (res) {
            console.log("i see you too")
            getComments()
        })
        .catch((error) => {
            console.log(error)
        })


}


function getComments() {
    let url = `/api/blogs/${bodyData.dataset.key}/comments`
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (res) {
            console.log(res)
            commentsBody.innerHTML = ""
            res.comments.forEach(comment => {
                commentsBody.innerHTML += `<div class="comment" id="replace">
                <a class="avatar">
                    <img src="/images/avatar/small/joe.jpg">
                </a>
                <div class="content">
                    <a><strong>
                             ${comment.author.username}</strong></a>
                    <a class="float-right"><strong>
                            ${moment(comment.created).fromNow()}</strong></a>
                    <div class="text">
                         ${comment.content}   
                    </div>
                    <div class="actions">
                        <a class="reply">Reply</a>
                        <form style="display: inline;" action="/blogs/<%= blog._id %>/comments/<%= comment._id %>/delete?_method=DELETE"
                            method="POST">
                            <a class="reply"><button class="reply delbutt" type="submit">Delete</button></a>
                            <a href="" class="reply"><i class="far fa-heart"></i></a>
                        </form>
                    </div>
                </div>
            </div>
        `
            });
        })
}














// <% if(user && comment.author.id.equals(user.id)){ %>



//     <% } %>





// <div class="col-xl-9 col-lg-9 nopaddingleft">
//             <img class="lead" src="https://images.pexels.com/photos/1681392/pexels-photo-1681392.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
//             <div class="slide-icons">
//                     <i class="fas fa-angle-left fa-3x float-left"></i>
//                     <i class="fas fa-angle-right fa-3x float-right"></i>       
//             </div>
//         </div>
//         <div class="col-xl-3 col-lg-3">
//             <div class="sidenote">
//                 <div class="row">
//                     <col-xl-12>
//                         <h1 class="Title">This is the very large title </h1>
//                     </col-xl-12>
//                 </div>
//                 <div class="row">
//                         <col-xl-12>
//                             <p class="lead-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim lobortis scelerisque fermentum dui faucibus.s pharetra et ultrices. </p>
//                             <a href="/show" class="linky float-right"> <i class="fas fa-arrow-right"></i> Read more</a>
//                         </col-xl-12>

//                 </div>
//             </div>
//         </div>
// </div>