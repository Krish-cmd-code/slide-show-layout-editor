let photos=[];
let selected=[];
let slides=[];
let index=0;
let slideInterval;
const deleteBtn=document.getElementById("deleteBtn");
const slideShow=document.getElementById("slideShowBtn");
const saveSlideShow=document.getElementById("saveSlideShow");
// const reloadSlideShow=document.getElementById("reloadSlideShow");
const loadJson=document.getElementById("reloadJson");
let DELAY;
const imageInput=document.getElementById("optBtn");

saveSlideShow.addEventListener("click", function () {
    console.log(`slides.length:${slides.length}`);
    // console.log(slides);
    let combinedImages = [
        // ...new Set([...slides, ...photos])
        ...new Set([ ...photos])
    ];

    if (combinedImages.length === 0) {
        alert("No images to save!");
        return;
    }
    // console.log(`combinedImages:${combinedImages}`);
    // console.log(combinedImages);
    console.log(photos);
    console.log(slides);
    const data = {
        images:combinedImages.map(src => ({
            src:src,
            isSelected: slides.some(slide => slide.src === src)
        })),
        // selectedImages: selectedImages,
        // slideshowImages: slideshowImages,
        // totalUniqueImages: combinedImages.length,
        savedAt: new Date().toLocaleString(),
        delay: document.getElementById("delay").value
    };
        data.images.forEach(image=>{
            console.log(`isSelected:${image.isSelected}`);
        });

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const fname=prompt("name file to save","gallery_data");
    link.download=fname+".json";
    // link.download = "gallery_data.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

});
/*
saveSlideShow.addEventListener("click",function(){


    
    const data=JSON.stringify(photos);
    console.log(`saved`);
    console.log(photos);
    console.log(data);
    localStorage.setItem("data",data);
    
});
*/

loadJson.addEventListener("change", function () {

    const file = loadJson.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = JSON.parse(e.target.result);

        // Clear existing data
        photos = [];
        selected = [];
        // slideshowImages = [];
        // gallery.innerHTML = "";

        // Restore selected images
        addJsonData(data.images);
        document.getElementById("delay").value=Number(data.delay);
       

        // Recreate gallery
        // photos.forEach(src => createImageBox(src));
        alert("Slideshow data loaded successfully!");
    };

    reader.readAsText(file);
});

function addJsonData(images){
    slides.length=0;
    selected.length=0;
    photos.length=0;
    let gallery=document.querySelector(".gallery");
    gallery.innerHTML="";
    images.forEach(image=> {

        photos.push(image.src);

        let img=document.createElement("img");
        const card=document.createElement("div");
        card.classList.add("card");

        img.src=image.src;
        let checkBox=document.createElement("input");
        checkBox.type="checkbox";
        checkBox.classList.add("select");
        
       

        if (image.isSelected) {
            slides.push(image.src);  //treating sliding images as selected images.
            checkBox.checked=true;
        }
        
        card.append(checkBox);
        card.append(img);
        gallery.append(card);
    });
}
/*
reloadSlideShow.addEventListener("click",function(){

    
    photos.length=0;
    photos=JSON.parse(localStorage.getItem("data"));
    console.log(`photos are`);
    console.log(photos);
    renderGallery();
    

});
*/
/*
document.getElementById("optBtn").addEventListener("change",function(e){
    console.log(e);
    
    [...e.target.files].forEach(element => {
            photos.push(URL.createObjectURL(element));   
    });
    renderGallery();
    
});
*/

imageInput.addEventListener("change",function(e){
    const files = Array.from(imageInput.files);
    console.log(files);
    let loaded=0;
    files.forEach(file=>{
        const reader=new FileReader();
        reader.onload = function(e){
            const base64=e.target.result;
            photos.push(base64);

            loaded++;
            if(loaded===files.length){
                renderGallery();
            }
        };

        reader.readAsDataURL(file);
    });
});


function renderGallery(){
let gallery=document.querySelector(".gallery");
const card=document.querySelectorAll(".gallery .card");
        selected.length=0;
        card.forEach(card=>{
            if(card.children[0].checked){
                console.log(`select pushed`);
                selected.push(card.children[1]);//image gets push.
            }
        });

gallery.innerHTML="";
photos.forEach(photo=>{
        let img=document.createElement("img");
        const card=document.createElement("div");
        card.classList.add("card");
        img.src=photo;
        let checkBox=document.createElement("input");
        checkBox.type="checkbox";
        checkBox.checked=selected.some(select => select.src === photo);
        checkBox.classList.add("select");
        
        card.append(checkBox);
        card.append(img);
        gallery.append(card);
    });

}

function addPhotos(){
    photos.length=0;
    const card = document.querySelectorAll(".gallery .card");
    card.forEach(card=>{
        photos.push(card.children[1].src);
    });
}

deleteBtn.addEventListener("click",function(){
    /*
        const gallery=document.querySelector(".gallery");
        console.log(gallery);
        gallery.forEach(card =>{
            let chkbox=card.querySelector(".select");
            if(chkbox.checked){
                console.log(`checked`);
            }
            })
    */
        const card=document.querySelectorAll(".gallery .card");
        card.forEach(card=>{
            if(card.children[0].checked){
                console.log(`checked`);
                selected.push(card);
            }
        });
        selected.forEach(card=>{
            card.remove();
        });
        console.log(`after deletion selected is:${selected}`);
        selected.length=0;
        console.log(selected.length);
        addPhotos();
});

slideShow.addEventListener("click",function(){
        if(slideInterval){
            console.log(`clearing the interval`);
            clearInterval(slideInterval);
            slideShow.textContent="startSlideShow";
            slideInterval=null;
            return;
        }   
        slideShow.textContent="StopSlideShow";
        const card=document.querySelectorAll(".gallery .card");
        slides.length=0;
        card.forEach(card=>{
            if(card.children[0].checked){
                slides.push(card.children[1]);//image gets push.
            }
        });

        const previewImg=document.getElementById("previewImage");
        previewImg.src="";
        DELAY=document.getElementById("delay").value;
        DELAY=Number(DELAY)*1000;
        console.log(`${DELAY}`);
        //  index=0;
        slideInterval=setInterval(startSlideShow,DELAY);
});

function startSlideShow(){
   // const slideShow=document.getElementById("slideShow");
    console.log(`index ${index}`);
    const previewImg=document.getElementById("previewImage");
    console.log(slides);
    if(slides.length==0)
    console.log(`empty slides`);
    else{
        //  previewImg.setAttribute("src",slides[index].src);
        index=(index)%slides.length;
        previewImg.src=slides[index].src;
        index=(index+1)%slides.length;
         
    }
   
   // slideShow.innerHTML=previewImg;
}
const customize=document.getElementById("customize");
const stopCustomize=document.getElementById("stopCustomize");

let isClickCustomize=false;
customize.addEventListener("click",(e)=>{
    const buttons=document.querySelectorAll(".dragon");
    buttons.forEach((button)=>{
        /*
        const rect = button.getBoundingClientRect();
        const x=window.scrollX;
        const y=window.scrollY;
        console.log(`${rect.left}`);
        console.log(`${rect.top}`);
        document.body.appendChild(button);
        button.style.position="absolute";
        console.log(`${rect.left}`);

        button.style.left=x+rect.left+"px";
        button.style.top=y+rect.top+"px";
        console.log(`jola`);
  
        button.disabled=true;
        */
       const rect = button.getBoundingClientRect();

    const left = rect.left + window.scrollX;
    const top  = rect.top  + window.scrollY;

    // 2️ Lock size (prevents resize jump)
    button.style.width = rect.width + "px";
    button.style.height = rect.height + "px";

    // 3️ Make absolute BEFORE moving in DOM
    button.style.position = "absolute";
    button.style.left = left + "px";
    button.style.top = top + "px";
    button.style.margin = "0";

    // 4️ Now move to body
    document.body.appendChild(button);

    // 5️ Disable
    button.disabled = true;

    showOtherElements();
    });
    if(!isClickCustomize){
        isClickCustomize=true;
        // const btn = document.querySelectorAll("button");
        const btn = document.querySelectorAll(".dragon");
        const body = document.querySelector("body");
        const stopCustomize=document.getElementById("stopCustomize");
        stopCustomize.disabled=false;

        btn.forEach((button)=>{
         button.draggable=true;
             button.addEventListener("dragstart",(e)=>{
              console.log(`dragging started`);
             });

             button.addEventListener("dragend",(e)=>{
             console.log (`dragend `);
             button.style.left = e.pageX+"px";
             button.style.top = e.pageY+"px";
          });
        });

        body.draggable=true;
        body.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });
        body.addEventListener("drop",(e)=>{

        })
    }else{

    }
});

stopCustomize.addEventListener("click",(e)=>{
    console.log(`stopcustomize clicked`);
    const button=document.querySelectorAll("button");
    button.forEach((button)=>{
        button.disabled=false;
    })
        stopCustomize.disabled=true;
        isClickCustomize=false;
})


function showOtherElements(){
    const gallery = document.querySelector(".gallery");
    const slideShow=document.getElementById("slideShow");
    if(gallery){
        gallery.style.border="2px solid black";
        gallery.style.position="absolute";
        gallery.style.top="50px";
        gallery.style.left="50px";
        gallery.style.width="auto";
        gallery.style.height="130px";
    }
    
    if(slideShow){
        slideShow.style.position="absolute";
        slideShow.style.top="190px";
        slideShow.style.left="50px";
        slideShow.style.height="200px";
        slideShow.style.width="200px";
        slideShow.style.border="8px solid black";
    }
    
}
