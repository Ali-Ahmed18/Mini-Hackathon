import {query,getDocs,collection,db,orderBy,getDoc,doc} from "./firebaseConfig.js"

const postCard = (time,firstName,lastName,text,title,profilePic)=>{
    let date = new Date(time.seconds*1000).toLocaleString()
    return `<div  class="mt-3 bg-white p-3 rounded">
    <div class="d-flex justify-content-between">
      <div class="authorsDetails d-flex align-items-center">
        <div class="post-header-container d-flex">
          <div style="width: 100px;height: 100px; overflow: hidden;" class="rounded">
            <img src="${profilePic?profilePic:"./wallpaper-for-facebook-profile-photo.jpg"}" alt="" class="img-fluid">
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
  </div> 
</div>`
}


window.addEventListener("load",async function(){
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      window.location.replace("./dashboard.html")
      return
    }
    let postBox = this.document.getElementById("postBox")
    const q = query(collection(db, "posts"), orderBy("time"));
       const querySnapshot = await getDocs(q);
       querySnapshot.forEach(async(docs) => {
        const {time,text,title,uId} = docs.data()
        const docRef = doc(db, "users", uId);
        const docSnap = await getDoc(docRef);
        const {profilePic,firstName,lastName,} = docSnap.data()
             const card = postCard(time,firstName,lastName,text,title,profilePic)
              postBox.innerHTML = card + postBox.innerHTML
       });
       document.querySelector(".spinnerDiv").style.display = "none"
       document.querySelector(".main").style.display = "block"

  })
