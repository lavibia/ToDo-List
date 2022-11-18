import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js'
import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js'
import {getFirestore, collection, addDoc, getDocs, doc, onSnapshot,deleteDoc, updateDoc, deleteField, getDoc } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js'


const firebaseConfig = {
apiKey: "AIzaSyAFMBMMxwXfY2D-nLe2RhcYdNGm5eLGEC8",
authDomain: "todolistdsw.firebaseapp.com",
projectId: "todolistdsw",
storageBucket: "todolistdsw.appspot.com",
messagingSenderId: "498607480005",
appId: "1:498607480005:web:b1886253c76b1d66a3a4ac",
measurementId: "G-0J24QME382"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const todoItems = collection(db, 'todo-items')

//Call functions
document.getElementById("addItem").onclick = function(){addItem()};




//get items from database
function getItems(){

    const todo = onSnapshot(todoItems, (querySnapshot)=>{
    let items = [];
    querySnapshot.forEach((doc)=> {
        items.push({
                id: doc.id,
                ...doc.data()
            })
        console.log(`${doc.id} => ${doc.data().text}`);
    });
    generateItems(items);


});
}

function generateItems(items){
    if(items.length==0){
        document.getElementById("congrads").style.display='block';
        document.getElementById("progres").style.display = 'none';
    }
    else{
        document.getElementById("congrads").style.display='none';
        document.getElementById("progres").style.display = 'block';

        
    }

    let todoList = []
    items.forEach((item)=>{
        var li = document.createElement("li");
        li.classList.add("item");
        var t = document.createTextNode(item.text);
        li.appendChild(t);
        //adauga buton X pentru item
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7"); //Unicode Char 'MULTIPLICATION SIGN'
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);



        //functionalitate sarcina terminata
        if(item.status == "completed")
            li.classList.add('completed');
        else
            li.classList.remove('completed');

        span.parentElement.onclick = function(){
            li.classList.toggle('completed');
            checkItem(item.id);
            console.log(`${item.id} => ${item.text}`);
        };

        //functionalitate delete
        span.onclick = function(){
            var div = this.parentElement;
            div.style.display = "none";
            delItem(item.id);
        }
        todoList.push(li);

});
document.querySelector("ul").replaceChildren(...todoList);
progres();
}



//add item in to do list
function addItem() {
    let text = document.getElementById("Input").value;
    //nu se accepta todo-item nul
    if (text === '') {
        alert("Scrieti o sarcina!");
    } else {
        try{
            const newItem = addDoc(todoItems, {
            text: text,
            status: "active"
        });
        } catch (e) {
            console.error("Eroare la adaugare: ", e);
        }
    }
    //goleste caseta text
    document.getElementById("Input").value= "";
    
}




function checkItem(id){
    const ref = doc(db, 'todo-items',id);
    const docSnap = getDoc(ref);
    docSnap.then(docSnap => {
        if(docSnap.exists()){
            console.log(`${docSnap.data().status}`);
            if(docSnap.data().status=="active"){
                const upd = updateDoc(ref,{
                status:"completed"
                });
            }
            else{
                const updt = updateDoc(ref,{
                status:"active"
                });
                //console.log("detect Else ");
            }
        }else{
            console.log("Nu exista in db ");
        }
    });
    progres();
}


//     //adauga buton X pentru item
function delItem(id){
    const ref = doc(db, "todo-items",id);
        const docSnap = getDoc(ref);
            docSnap.then(docSnap => {
            if(docSnap.exists()){
                try{

                const del = deleteDoc(ref);

        } catch (e) {
            console.error("Eroare la stergere: ", e);
        }
            }else{
                console.log("Nu exista in db");
            }
        });
    }

function progres(){
    var nritems =0;
    var nrdone= 0;

    nritems=document.getElementsByClassName("item").length
    //console.log(" `${nritems}`);
    nrdone=document.getElementsByClassName("completed").length
   // console.log(" `${nrdone}`);
    document.getElementById("right").textContent="Terminate: "+nrdone;
    document.getElementById("left").textContent="Rămase: "+ (nritems - nrdone);
}

getItems();
