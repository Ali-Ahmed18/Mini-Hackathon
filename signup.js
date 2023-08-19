import { app,auth,createUserWithEmailAndPassword,db ,doc , setDoc,} from "./firebaseConfig.js"

/////////for check user login or not///////////////////
// window.addEventListener('load',function(){
   
//   const user = JSON.parse(localStorage.getItem("user"))
//     if(user){
//         window.location.replace("./dashbord.html")
//         return
//     }
//    document.body.style.display = "block"
     
 
// })
////////////////////////////////////////////////////////

const createAccountBtn = document.getElementById("createAccountBtn")
createAccountBtn.addEventListener("click",signup)

async function signup() {
  var firstName = document.getElementById("fName");
  var lastName = document.getElementById("lName");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var resetpassword = document.getElementById("resetpassword");


  createAccountBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>`
  createAccountBtn.style.pointerEvents = "none"
  if (!firstName.value || !lastName.value || !email.value || !password.value ) {
    Swal.fire({
      title: 'Fill All The Fields',
      icon: 'warning',
      confirmButtonColor: '#ffc107',
      iconColor: '#ffc107'
    })
   
    createAccountBtn.innerHTML= "Create Account"
    createAccountBtn.style.pointerEvents = "auto"
    return;
  }
  if(resetpassword.value !== password.value){
    Swal.fire({
        title: 'Password and Repeat Password Not Match',
        icon: 'warning',
        confirmButtonColor: 'rgb(119, 73, 248)',
        iconColor: 'rgb(119, 73, 248)'
      })
      createAccountBtn.innerHTML= "Create Account"
      createAccountBtn.style.pointerEvents = "auto"
      return
}
  if(firstName.value.length < 3 ){
    Swal.fire({
        title: 'First Name at Least be 3 Character or Greater',
        icon: 'warning',
        confirmButtonColor: 'rgb(119, 73, 248)',
        iconColor: 'rgb(119, 73, 248)'
      })
      createAccountBtn.innerHTML= "Create Account"
      createAccountBtn.style.pointerEvents = "auto"
        return
  }
  if((firstName.value.trim()+lastName.value.trim()).length > 20){
    Swal.fire({
        title: 'Name Must Less than 20 Character',
        icon: 'warning',
        confirmButtonColor: 'rgb(119, 73, 248)',
        iconColor: 'rgb(119, 73, 248)'
      })
      createAccountBtn.innerHTML= "Create Account"
      createAccountBtn.style.pointerEvents = "auto"
        return
  }
 
createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
  .then(async(userCredential) => {
     const uid = userCredential.user.uid
    let obj = {
      firstName : firstName.value.trim(),
      lastName : lastName.value.trim(),
      email : email.value.trim(),
      uid,
      profilePic: ""
    };
    const cityRef =  doc(db, 'users', uid);
    await setDoc(cityRef, obj);
    createAccountBtn.innerHTML= "Create Account"
    createAccountBtn.style.pointerEvents = "auto"
    window.location.replace("./login.html")
  })
  .catch((error) => {
    console.log(error.message);
    createAccountBtn.innerHTML= "Create Account"
    createAccountBtn.style.pointerEvents = "auto"
    if(error.message == "Firebase: Error (auth/invalid-email)."){
      Swal.fire({
        title: 'Invalid-Email',
        icon: 'warning',
        confirmButtonColor: 'red',
        iconColor: 'red'
      })
    }else if(error.message == "Firebase: Error (auth/email-already-in-use)."){
      Swal.fire({
        title: 'Email Already In Use',
        icon: 'warning',
        confirmButtonColor: 'red',
        iconColor: 'red'
      })
    }else if(error.message == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
      Swal.fire({
        title: 'Password should be at least 6 characters',
        icon: 'warning',
        confirmButtonColor: 'rgb(119, 73, 248)',
        iconColor: 'rgb(119, 73, 248)',
      })
    }
  });
}