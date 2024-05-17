import axios from 'axios';
import Noty from 'noty';
import {initAdmin} from './admin';


let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

//Update cart
function updateCart(pizza) {
   axios.post('/update-cart', pizza).then(res =>{
    
        //Cart counter
        cartCounter.innerText = res.data.totalQty

        //Success & Error messages pop up
        new Noty({
            type: "success",
            timeout: 1000,
            progressBar: false,
            closeWith: ['click'],
            text: "Item added to cart!"
          }).show();
    }).catch(err =>{

        //Success & Error messages pop up
        new Noty({
            type: "error",
            timeout: 1000,
            progressBar: false,
            closeWith: ['click'],
            text: "Something went wrong"
          }).show();
    });
}

//Add to cart
addToCart.forEach(function(btn){
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });

});

//Remove alert message after 2 seconds
const alertMsg = document.querySelector('#success-alert');

//If alert message present
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}