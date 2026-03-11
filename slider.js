let photos=[];
let selected=[];
let slides=[];
let slidePhotos=[];
let index=0;
let slideInterval;
const deleteBtn=document.getElementById("deleteBtn");
const slideShow=document.getElementById("slideShowBtn");
const saveSlideShow=document.getElementById("saveSlideShow");
// const reloadSlideShow=document.getElementById("reloadSlideShow");
const loadJson=document.getElementById("reloadJson");
let DELAY;
const imageInput=document.getElementById("optBtn");

let draggedCard=null;
const dropBox=document.getElementById("dropBox");
dropBox.addEventListener("dragover",(e)=>{
    e.preventDefault();
});
dropBox.addEventListener("drop",(e)=>{
    e.preventDefault();
    if(draggedCard){
        draggedCard.remove();
        draggedCard=null;
    }
}); 



const reorder=document.getElementById("reorder");

reorder.addEventListener("dragover",(e)=>{
    e.preventDefault();
});
reorder.addEventListener("drop",(e)=>{
    e.preventDefault();
    const id=e.dataTransfer.getData("photoId");
    console.log(id);
    // e.dataTransfer.setData("photoId",photo.id);
    const photo=photos.find(p => id==p.id);  //remember for comparison we've used '==' operator rather than '===' operator.
   

    if(!photo){
        console.log(`empty photo`);return;
    }
 console.log(id);
    const card=document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    img.src=photo.src;
    applyDragToCardOfReorder(card);
    card.appendChild(img);
    reorder.appendChild(card);
});

function applyDragToCardOfReorder(card){
    card.draggable=true;
    card.addEventListener("dragstart",(e)=>{
        draggedCard=card;
    });

    card.addEventListener("dragover", (e) => {
    e.preventDefault(); 
    });

    card.addEventListener("drop", (e) => {

        e.preventDefault();

        if (!draggedCard || draggedCard === card) return;

        const container = card.parentNode;

        const rect = card.getBoundingClientRect();
        const offset = e.clientY - rect.top;

        if (offset > rect.height / 2) {
            // insert after
            container.insertBefore(draggedCard, card.nextSibling);
        } else {
            // insert before
            container.insertBefore(draggedCard, card);
        }

    });

}

saveSlideShow.addEventListener("click", function () {
    console.log(`slides.length:${slides.length}`);
    // console.log(slides);
    let combinedImages = [
        // ...new Set([...slides, ...photos])
        ...new Set([ ...photos])
    ];
    addSlides();
    addSlidePhotos();
    let slideImages=[ ...new Set([...slidePhotos])];

    console.log(`slides are`);
    console.log(slides);
    if (combinedImages.length === 0) {
        alert("No images to save!");
       // return;
    }
    // console.log(`combinedImages:${combinedImages}`);
    // console.log(combinedImages);
    console.log(photos);
    console.log(slides);
    const data = {
        images:combinedImages,
        slideImages:slideImages,
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
        slides=[];

        // Restore selected images
        addJsonData(data);
        document.getElementById("delay").value=Number(data.delay);
       

        // Recreate gallery
        // photos.forEach(src => createImageBox(src));
        alert("Slideshow data loaded successfully!");
    };

    reader.readAsText(file);
    loadJson.value="";
});

function addJsonData(data){
    photos=[];
    photos=data.images;
    console.log(`now photos:`);
    console.log(photos);
    console.log(`now slides`);
    console.log(slides);
    slides=data.slideImages;
    renderGallery();
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
    console.log(`image input evernt listener`);
    console.log(files);
    let loaded=0;
    files.forEach(file=>{
        const reader=new FileReader();
        reader.onload = function(e){
            const base64=e.target.result;
            const id=Date.now() + Math.random();// unique id
            photos.push({src:base64,id:id,isSelected:false});

            loaded++;
            if(loaded===files.length){
                renderGallery();
            }
        };

        reader.readAsDataURL(file);
    });
    imageInput.value="";
    console.log(`photos added`);
});


function renderGallery(){
let gallery=document.querySelector(".gallery");  //will select first galley item.
// const card=document.querySelectorAll(".gallery .card");
//         selected.length=0;
//         card.forEach(card=>{
//             if(card.children[0].checked){
//                 console.log(`select pushed`);
//                 selected.push(card.children[1]);//image gets push.
//             }
//         });
console.log(`enter into renderGallery`);
gallery.innerHTML="";
let reorder=document.getElementById("reorder");
reorder.innerHTML="";
    photos.forEach(photo=>{
            let img=document.createElement("img");
            const card=document.createElement("div");
            card.classList.add("card");

            // store id in DOM
            card.dataset.id = photo.id;
            
            img.src=photo.src;
            let checkBox=document.createElement("input");
            checkBox.type="checkbox";

            checkBox.addEventListener("change", function () {

                    const card = checkBox.closest(".card");
                    const id = Number(card.dataset.id);

                    const photo = photos.find(p => p.id === id);

                    photo.isSelected = checkBox.checked;
            });
            checkBox.checked=photo.isSelected;

            // checkBox.checked=selected.some(select => select.src === photo);
            checkBox.classList.add("select");
            
            addDragTo(card,photo);
            card.append(checkBox);
            card.append(img);
            gallery.append(card);
        });

            slides.forEach(src=>{
                const card=document.createElement("div");
                card.classList.add("card");
                const img = document.createElement("img");
                img.src=src;
                applyDragToCardOfReorder(card);
                card.appendChild(img);
                reorder.appendChild(card);
            });



}

function addDragTo(card,photo){
    card.draggable=true;
    card.addEventListener("dragstart",(e)=>{
        e.dataTransfer.setData("photoId",photo.id);
        console.log(`drag started`);
    });
}
function addPhotos(){
    photos=photos.filter(p=> !p.isSelected);
    const card = document.querySelectorAll(".gallery .card");

    // card.forEach(card=>{
    //     photos.push(card);
    // });
     console.log(`now photos`);
    console.log(photos);
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
        selected=[];
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
        // card.forEach(card=>{
        //     if(card.children[0].checked){
        //         slides.push(card.children[1]);//image gets push.
        //     }
        // });

        
        // slides = photos.filter(photo => photo.isSelected);
        addSlides();

        const previewImg=document.getElementById("previewImage");
        previewImg.src="";
        DELAY=document.getElementById("delay").value;
        DELAY=Number(DELAY)*1000;
        console.log(`${DELAY}`);
        //  index=0;
        slideInterval=setInterval(startSlideShow,DELAY);
});

function addSlides(){
    slides.length=0;
    const cards=document.querySelectorAll("#reorder .card");
        cards.forEach(card=>{
            slides.push(card.children[0]);
        });
}

function addSlidePhotos(){
    slidePhotos=[];
    slides.forEach(slide=>{
        slidePhotos.push(slide.src);
    })
}
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
