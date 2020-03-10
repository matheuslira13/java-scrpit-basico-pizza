let carrinho = [];
let modalQt=1;
let modalKey=0;

const c = (el)=>document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

pizzaJson.map(function(item,index){
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
/**append prencher as informações e cria uma nova */
    pizzaItem.setAttribute('data-key',index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML= `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML= item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML= item.description;

    pizzaItem.querySelector('a').addEventListener('click',function(e){
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey=key;
        modalQt=1;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML= `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');

        

        document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex == 2){
               size.classList.add('selected');
            };
            
         size.querySelector('span').innerHTML =pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaBig img').src = pizzaJson[key].img;

        c('.pizzaInfo--qt').innerHTML= modalQt;
        document.querySelector('.pizzaWindowArea').style.opacity= '0';
        document.querySelector('.pizzaWindowArea').style.display='flex';
        setTimeout(function(){
            document.querySelector('.pizzaWindowArea').style.opacity=1;
        },200);
       
        
    });

    /** preventDefault e bem como diz deixar a acao padro no caso do a quando vc clica normalmente vai para outra pagina
     * mas foi concelado essa acção
     */
c('.pizza-area').append(pizzaItem);

});


    //model eventos

    function closeModel(){
        document.querySelector('.pizzaWindowArea').style.opacity= '0';
        setTimeout(function(){
            c('.pizzaWindowArea').style.display ='none';
        },500)

    }

    cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(iten){
        iten.addEventListener('click',closeModel); 
    });       



    c('.pizzaInfo--qtmenos').addEventListener('click',function(){
        if(modalQt > 1){
            modalQt--;
        }
        c('.pizzaInfo--qt').innerHTML= modalQt;
    });

    c('.pizzaInfo--qtmais').addEventListener('click',function(){
        modalQt++;
        c('.pizzaInfo--qt').innerHTML= modalQt;
    });

    document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
     
        size.addEventListener('click',function(e){
            c('.pizzaInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
        });
    });


    //add ao carinho

    c('.pizzaInfo--addButton').addEventListener('click',function(){
        let tamanhoPizza=parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

        let identificador = pizzaJson[modalKey].id+"@"+tamanhoPizza;

       let chave = carrinho.findIndex(function(item){
            return item.identificador == identificador;
       }); 

       if ( chave >-1){
           carrinho[chave].qt = carrinho[chave].qt+modalQt;
       }else{

        carrinho.push({
            identificador,
                id:pizzaJson[modalKey].id,
                tamanhoPizza,
                qt:modalQt
            });}
            atualizarCarrinho();
            closeModel();
    });

    //mostra o carinho


    // abri mobiel
    c('.menu-openner').addEventListener('click',function(){
        if(carrinho.length >0){
        c('aside').style.left='0';
        }
    });
    c('.menu-closer').addEventListener('click',function(){
        c('aside').style.left='100vw';
    });
    function atualizarCarrinho(){
        c('.menu-openner span').innerHTML= carrinho.length;

        if(carrinho.length >0){
            c('aside').classList.add('show');
            c('.cart').innerHTML='';

            let subtotal;
            let desconto;
            let total;

            for(let i in carrinho){

                let pizzaItem = pizzaJson.find(function(item){
                    return item.id == carrinho[i].id;
                });
                subtotal  = carrinho[i].qt * pizzaItem.price;
                subtotal =subtotal;
               let cartItem= c('.models .cart--item').cloneNode(true);

                let pizzaSizeName;

                switch(carrinho[i].tamanhoPizza){
                    case 0:
                        pizzaSizeName='P';
                        break;
                    case 1:
                        pizzaSizeName='M';
                        break;
                    case 2:
                        pizzaSizeName='G';
                         break;

                }


               let pizzaName=`${pizzaItem.name} (${pizzaSizeName})`;
               cartItem.querySelector('img').src=pizzaItem.img;
               cartItem.querySelector('.cart--item-nome').innerHTML= pizzaName;
               cartItem.querySelector('.cart--item--qt').innerHTML=carrinho[i].qt;
               cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',function(){
                   if(carrinho[i].qt >1){
                       carrinho[i].qt--;
                      
                   }else{
                    carrinho.splice(i,1);
                   }
                    atualizarCarrinho();

               });
               cartItem.querySelector('.cart--item-qtmais').addEventListener('click',function(){
                   carrinho[i].qt ++;
                   atualizarCarrinho();
               });

               c('.cart').append(cartItem);
            }
            desconto= subtotal*0.1;
            total = subtotal-desconto;
//last child e uma forma de voce conseguir pegar o ultimo atributo caso tenha mais de um(no caso teria 2 span e nos so queremos o ultimo)
            c('.subtotal span:last-child').innerHTML=`R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML=`R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML=`R$ ${total.toFixed(2)}`;
        }else {
            c('aside').classList.remove('show');
            c('aside').style.left='100vw';
        }
    }