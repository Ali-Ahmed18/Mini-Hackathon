import { onAuthStateChanged, auth, getDoc, doc, db, storage, updateDoc, ref, uploadBytesResumable, getDownloadURL, signOut } from "./firebaseConfig.js"
let onlineUser;
window.addEventListener("load", function () {
    const user = JSON.parse(localStorage.getItem("user"))
    if(!user){
      window.location.replace("./index.html")
      return
    }
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                alert("user not found")
            }
            onlineUser = docSnap.data()

            const profilePic = document.getElementById("profilePic")
            onlineUser.profilePic ? profilePic.src = `${ onlineUser.profilePic}`:"./wallpaper-for-facebook-profile-photo.jpg"
            document.querySelectorAll(".profileName").forEach((elem)=>{
                elem.innerHTML = `${onlineUser.firstName} ${onlineUser.lastName}`
            })
            document.getElementById("Lname").value = onlineUser.lastName
            document.getElementById("Fname").value = onlineUser.firstName
            document.querySelector(".spinnerDiv").style.display = "none"
            document.querySelector(".main").style.display = "block"
        } else {
              window.location.replace("./index.html")
            return
        }
    });

})


const updateProfile = document.getElementById("updateProfile")
updateProfile.addEventListener("click",async () => {
    let fName = document.getElementById("Fname")
    let lName = document.getElementById("Lname")
    let profileImage = document.getElementById("profileImage")
    let updateClose = document.getElementById("updateClose")
    if (!fName, !lName) {
        Swal.fire({
            title: 'Fill Empty Fileds',
            icon: 'warning',
            confirmButtonColor: 'rgb(119, 73, 248)',
            iconColor: 'rgb(119, 73, 248)'
        })
        return
    }
    updateProfile.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>`
      const file = profileImage
    if (file.files[0] !== undefined) {

        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + onlineUser.uid);
        const uploadTask = uploadBytesResumable(storageRef, file.files[0], metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {

                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                   
                    const washingtonRef = doc(db, "users", onlineUser.uid);
                    await updateDoc(washingtonRef, {
                        firstName: fName.value.trim(),
                        lastName: lName.value.trim(),
                        profilePic: downloadURL
                    });
                    file.value = ""
                    updateProfile.innerHTML = "Update"
                    document.querySelectorAll(".profileName").forEach((elem)=>{
                        elem.innerHTML = `${fName.value.trim()} ${lName.value.trim()}`
                    })
                   const profilePic = document.getElementById("profilePic").src = downloadURL

                    updateClose.click()
                });
            }
        );
    } else {
        const washingtonRef = doc(db, "users", onlineUser.uid);
        await updateDoc(washingtonRef, {
            firstName: fName.value.trim(),
            lastName: lName.value.trim(),
        });
        document.querySelectorAll(".profileName").forEach((elem)=>{
            elem.innerHTML = `${fName.value.trim()} ${lName.value.trim()}`
        })
        updateProfile.innerHTML = `Update`
        uptClose.click()
    }
})

const linkBtn = document.getElementById("linkBtn")
linkBtn.addEventListener("click",logOut)
function logOut(){
    localStorage.removeItem("user")
    window.location.replace("./index.html")
}
