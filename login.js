import{ auth, signInWithEmailAndPassword,} from "./firebaseConfig.js"

// window.addEventListener('load',function(){
   
  
//   const user = JSON.parse(localStorage.getItem("user"))
//     if(user){
//         window.location.replace("./dashbord.html")
//         return
//     }
//   document.body.style.display = "block"
    
// })


let password = document.getElementById("password")
let email = document.getElementById("email")
/////////////////////function for password show and hide//////////////////////////
password.addEventListener('input',function(){
    let show = document.getElementById("psShow")
    if(this.value.length == 0){
        show.style.display = "none"
    }else{
        show.style.display = "inline-block"
    }
    
})
let show = document.getElementById("psShow")
show.addEventListener('click',function(){

    if(password.type == "password" ){
        show.innerHTML = "<i class='fa-solid fa-eye'></i>"
        password.type = "text"
    }else{
        show.innerHTML = "<i class='fa-solid fa-eye-slash'></i>"
        password.type = "password"
    }
})
//////////////////////////////function for login////////////////////////////////////////////////////
const signIn = document.getElementById("signIn")
signIn.addEventListener("click",login)
function login(){
    let password = document.getElementById("password")
    let email = document.getElementById("email")
    signIn.style.pointerEvents = "none"
    signIn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>`
    
    if(!email.value || !password.value){
        signIn.innerHTML = "Login"
        signIn.style.pointerEvents = "auto"
        Swal.fire({
            title: 'Fill All The Fields',
            icon: 'warning',
            confirmButtonColor: 'rgb(119, 73, 248)',
            iconColor: 'rgb(119, 73, 248)'
          })
        return
    }
    

signInWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
  .then((userCredential) =>{
    signIn.innerHTML = "Login"
        signIn.style.pointerEvents = "auto"
    localStorage.setItem("user",JSON.stringify(userCredential))
    window.location.replace("./dashboard.html")
  })
  .catch((error) => {
    const errorMessage = error.message
    console.log(error.message);
    if(errorMessage == "Firebase: Error (auth/user-not-found)."){
        Swal.fire({
            title: 'User Not Exist',
            icon: 'warning',
            confirmButtonColor: 'rgb(119, 73, 248)',
            iconColor: 'rgb(119, 73, 248)'
          })
          signIn.innerHTML = "Login"
          signIn.style.pointerEvents = "auto"
    }else if(errorMessage == "Firebase: Error (auth/invalid-email)."){
        Swal.fire({
            title: 'Invalid-Email',
            icon: 'warning',
            confirmButtonColor: 'rgb(119, 73, 248)',
            iconColor: 'rgb(119, 73, 248)'
          })
          signIn.innerHTML = "Login"
          signIn.style.pointerEvents = "auto"
    }else if(errorMessage == "Firebase: Error (auth/wrong-password)."){
         Swal.fire({
                text: 'Password Doesn\'t Match',
                icon: 'warning',
                iconColor: 'rgb(119, 73, 248)',
                confirmButtonColor: 'rgb(119, 73, 248)',
              })
              signIn.innerHTML = "Login"
              signIn.style.pointerEvents = "auto"
    }
  });
 

        
}