let photos=[];
let selected=[];
let slides=[];
let index=0;
let slideInterval;
const deleteBtn=document.getElementById("deleteBtn");
const slideShow=document.getElementById("slideShowBtn");
const saveSlideShow=document.getElementById("saveSlideShow");
const reloadSlideShow=document.getElementById("reloadSlideShow");


saveSlideShow.addEventListener("click",function(){


    
    const data=JSON.stringify(photos);
    console.log(`saved`);
    console.log(photos);
    console.log(data);
    localStorage.setItem("data",data);
    
});

reloadSlideShow.addEventListener("click",function(){
    /*
    const data = JSON.parse(localStorage.getItem("data")) || [];
    photos.length=0;
    data.forEach(src=>{
        photos.push(src);
    });
    renderGallery();
    */
    
    photos.length=0;
    photos=JSON.parse(localStorage.getItem("data"));
    console.log(`photos are`);
    console.log(photos);
    renderGallery();
    

});

document.getElementById("optBtn").addEventListener("change",function(e){
    console.log(e);
    
    [...e.target.files].forEach(element => {
            photos.push(URL.createObjectURL(element));   
    });
    renderGallery();
    
});


function renderGallery(){
let gallery=document.querySelector(".gallery");
gallery.innerHTML="";
photos.forEach(photo=>{
        let img=document.createElement("img");
        const card=document.createElement("div");
        card.classList.add("card");

        img.src=photo;
        let checkBox=document.createElement("input");
        checkBox.type="checkbox";
        checkBox.classList.add("select");
        
        card.appendChild(checkBox);
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

        slideInterval=setInterval(startSlideShow,2000);
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
    const buttons=document.querySelectorAll("button");
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
        const btn = document.querySelectorAll("button");
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
