import {auth, onAuthStateChanged, signOut, doc, db, getDoc, collection, addDoc, setDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, query, orderBy,storage,ref, uploadBytesResumable, getDownloadURL} from "./firebaseConfig.js"
let activeUser;
const postBox = document.getElementById("postBox")

const postCard = (time,firstName,lastName,text,title,uId,profilePic,activeUserId,authorId)=>{
    let date = new Date(time.seconds*1000).toLocaleString()
    return `<div id="${uId}" class="mt-3 bg-white p-3 rounded">
    <div class="d-flex justify-content-between">
      <div class="authorsDetails d-flex align-items-center">
        <div class="post-header-container d-flex">
          <div style="width: 100px;height: 100px; overflow: hidden;" class="rounded">
            <img src="${profilePic ? profilePic : "./wallpaper-for-facebook-profile-photo.jpg"}" alt="" class="img-fluid">
          </div>
          <div class="userName-id ms-2">
            <h5 style="width: 70%;" class="fw-bold postTitle">${title}</h5>
            <div class="d-flex align-items-center" style="font-size: 14px!important;color: #424242;">
              <div class="mb-1 text-capitalize username">${firstName} ${lastName}</div>
              <div class="mb-0 ms-2">${date}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
    <div class="postDetails">
      <p class="mt-3 blogText" style="color: #707070;word-wrap: break-word;">${text}</p>
    </div>
    ${activeUserId == authorId ? `<div class="btns mt-3 d-flex gap-3">
    <span data-bs-toggle="modal" data-bs-target="#delModal" style="color: rgb(119, 73, 248);cursor:pointer;" onclick="del(this)">Delete</span>
    <span data-bs-toggle="modal" data-bs-target="#editModal" style="color: rgb(119, 73, 248);cursor:pointer;" onclick="edt(this)">Edit</span>
  </div>`: ""}
    
  </div> 
</div>`
}

function del(elem){
        const post = elem.parentNode.parentNode
        const delBtn = document.getElementById("delBtn")
        delBtn.addEventListener("click",async ()=>{
            delBtn.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>`
            await deleteDoc(doc(db, "posts", post.id));
            post.remove()
            delBtn.innerHTML = `Delete`
            document.getElementById("delClose").click()
        })
        
}
window.del = del



async function edt(elem){
    const uptTitle = document.getElementById("uptTitle")
    const uptDescription = document.getElementById("uptDescription")
    const uptClose = document.getElementById("uptClose")
    const post = elem.parentNode.parentNode
    post.querySelector(".postTitle")
    post.querySelector(".blogText")
    uptTitle.value = post.querySelector(".postTitle").innerHTML  
    uptDescription.value = post.querySelector(".blogText").innerHTML
    if(!uptTitle.value || !uptDescription.value){
      Swal.fire({
        title: 'Fill all the Fields',
        icon: 'warning',
        confirmButtonColor:'rgb(119, 73, 248)',
        iconColor: 'rgb(119, 73, 248)'
      })
      uptBtn.innerHTML = "Update"
      uptBtn.style.pointerEvents = "auto"
          return
    }
   const uptBtn = document.getElementById("updateBtn")
   uptBtn.addEventListener("click",async ()=>{
    uptBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>`
    const washingtonRef = doc(db, "posts", post.id);
    await updateDoc(washingtonRef, {
      title: uptTitle.value,
      text: uptDescription.value,
    });
    post.querySelector(".postTitle").innerHTML = uptTitle.value
    post.querySelector(".blogText").innerHTML = uptDescription.value
    uptBtn.innerHTML = "Update"
    uptClose.click()
    uptBtn.style.pointerEvents = "auto"
   })

}
window.edt = edt


window.addEventListener("load",function(){
    const user = JSON.parse(localStorage.getItem("user"))
    if(!user){
      window.location.replace("./index.html")
      return
    }
  onAuthStateChanged(auth, async(user) => {
    if (user) {
      const uid = user.uid;
      const docRef = doc(db, "users", uid);
      
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
         activeUser = docSnap.data()

          document.getElementById("name").innerHTML = `${activeUser.firstName} ${activeUser.lastName}`
        
         const q = query(collection(db, "posts"), orderBy("time"));
         
         const querySnapshot = await getDocs(q);
         querySnapshot.forEach(async(docs) => {
          const {text,title,time,uId} = docs.data()
          const docRef = doc(db, "users", uId);
          const docSnap = await getDoc(docRef);
          const {profilePic,firstName,lastName} = docSnap.data()
               const card = postCard(time,firstName,lastName,text,title,docs.id,profilePic,activeUser.uid,uId)
                postBox.innerHTML = card + postBox.innerHTML
         });
         document.querySelector(".spinnerDiv").style.display = "none"
         document.querySelector(".main").style.display = "block"
          
  
        } else {
          alert("No such document!");
        }
        } else {
          window.location.replace("./index.html")
          return
        }
      });
   
  })

const post = document.getElementById("post")
post.addEventListener("click",async ()=>{
  
    try{
        post.innerHTML = `<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
        <span role="status">Loading...</span>`
        post.style.pointerEvents = "none"
        post.style.opacity = "0.5"
        let placeholder = document.getElementById("placeholder")
        let blogText = document.getElementById("text")
        if(!placeholder.value || !blogText.value){
            Swal.fire({
                title: 'Fill All The Fields',
                icon: 'warning',
                confirmButtonColor: 'rgb(119, 73, 248)',
                iconColor: 'rgb(119, 73, 248)'
              })
              post.innerHTML = `Publish Blog`
              post.style.pointerEvents = "auto"
              post.style.opacity = "1"
            return
        }
      
    
        const obj ={
            time : serverTimestamp(),
            firstName : activeUser.firstName,
            lastName : activeUser.lastName,
            title : placeholder.value,
            text : blogText.value,
            uId: activeUser.uid
          }

            const docRef = await addDoc(collection(db, "posts"),obj);
            const getDocRef = doc(db, "posts", docRef.id);
            const docSnap = await getDoc(getDocRef);
            const {time,firstName,lastName,text,title,uId} = docSnap.data();
            const card = postCard(time,firstName,lastName,text,title,docSnap.id,activeUser.profilePic,activeUser.uid,uId)
            postBox.innerHTML = card + postBox.innerHTML
            post.innerHTML = `Publish Blog`
              post.style.pointerEvents = "auto"
              post.style.opacity = "1"
              placeholder.value = ""
              blogText.value = ""
    }catch(e){
            alert(e.message)
    }
    
})

const linkBtn = document.getElementById("linkBtn")
linkBtn.addEventListener("click",logOut)
function logOut(){
    localStorage.removeItem("user")
    window.location.replace("./index.html")
}
