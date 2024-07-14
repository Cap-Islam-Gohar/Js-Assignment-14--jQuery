// Import all of Bootstrap's CSS
// import "~bootstrap/dist/css/bootstrap.css";
import '~bootstrap/dist/css/bootstrap.min.css';
// Import our custom CSS
import '../css/styles.css';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import $ from "jquery";

$(() => {



    /**
     * side nav animation
     */
    let asideNav = $("#nav-aside");
    let headerContent = $("#header-content");

    $("#open-nav-btn").on("click", () => {
        asideNav.animate({
            left: "0",
        }, 500);
        if(headerContent.outerWidth() >= 768){
            headerContent.animate({paddingLeft: "250px"}, 500);
        }
    });


    $("#close-nav-btn").on("click", () => {
        asideNav.animate({left: "-250px",}, 500);
        if(headerContent.outerWidth() >= 768){
            headerContent.animate({paddingLeft: "0"}, 500);
        }
    });



    /**
     * accordion
     */
    let accordionEls = $("#accordion li");
    accordionEls.find("div").slideUp();
    accordionEls.find("h2").on("click", (e) => {
        let target = $(e.target);
        target.next().slideDown();
        target.parent().siblings().find("div").slideUp();
    }) 


    /**
     * timer
     *========================
     * for examing porpose ..
     * every user has own party time stored in his local storage 
     * party time stored in local storage will stored by adding 1 day and 1 second to currnt datetime
     * so our timer wont be stop forever .. and we get timer for every browser 
     * and we get also some abilaty for let user testing our timer. 
     * added function to assign new time
     * added function to reset timer to its default value now + 1 day + 1 minute
     * 
     */
    const timer = {
        end: null,
        counterStart: null,
        run(){

            this.end = localStorage.getItem("Party");
            let now = Math.floor(new Date().getTime() / 1000);
            let diff = this.end - now;
            
            if( diff < 0 ){
                localStorage.setItem("Party",  Math.floor(this.addTime((60 * 24) + 0.5) / 1000));
                this.run();
            }         
            
            // still in future
            this.startCounter(); 
            
        },
        reset(time){
            localStorage.setItem("Party", time ?? Math.floor(this.addTime((60 * 24) + 0.5) / 1000));
            // this.end = time ?? Math.floor(this.addTime((60 * 24) + 0.5) / 1000);
            this.run();
        },
        startCounter() {

            let content = $("#timer-content");
            let counterEls = content.children();
            content.hide();

            this.counterStart = setInterval(() => {

                let now = Math.floor(new Date().getTime() / 1000);

                let diff = this.end - now;

                if(diff < 0){
                    $("#timer-finished").html(`<span>Party was started at <br> ${new Date(this.end * 1000 ).toLocaleString()}</span>`);
                    content.hide();
                    clearInterval(this.counterStart); 
                }else{

                    content.show();
                
                    const timeDetails = [
                        Math.floor(diff / 86400),
                        Math.floor((diff % (86400)) / 3600),
                        Math.floor((diff % (3600)) / 60),
                        Math.floor(diff % 60),
                    ];
                    
                    counterEls.eq(0).html(`${timeDetails[0]} <br> Days`);
                    counterEls.eq(1).html(`${timeDetails[1]} <br> Hours`);
                    counterEls.eq(2).html(`${timeDetails[2]} <br> Minutes`);
                    counterEls.eq(3).html(`${timeDetails[3]} <br> Seconds`);
                }


            }, 1000);
        },
        addTime (Minutes){
            return new Date().getTime()  + (Minutes * 60000 )
        }
    };

    // reset timer to its default value ..
    // every 3 days forever 
    timer.run();
    $("button#reset").on("click", () => {
        timer.reset();
    });

    //assign new time event
    $("button#assign").on("click", () => {
        let date = (new Date($('[type="datetime-local"]').val())).getTime();
        if( date > (new Date().getTime())){
            timer.reset(date / 1000);
        }else{
            alert("Please select date in the future");
        }
    });

    //open timer control
    $("div#timer-setting").on("click", (e) => {
        let target = $(e.currentTarget).parent();
        if(target.offset().left < 0){
            target.animate({left: 0}, 500);
        }else{
            target.animate({left: `-50%`}, 500);
        }
    });

    //texteara remined change when bigger than 100 charcter
    $("textarea").on("keyup", (e) => {
        let countChar = $(e.target).val().length;
        console.log(countChar)
        if(countChar <= 100){
            $("#error").html(`<span class="primary-text fs-3">${countChar}</span> Characyer Reamining</span>`);
        }else{
            $("#error").html("<span class='primary-text fs-3'>your available character finished</span>");
        }
    });    

    

});


