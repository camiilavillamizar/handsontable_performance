import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  t1 = false; 
    t2 = false; 
    t3 = false; 
    t4 = false; 
    t5 = false; 

    t1Aux = false; 
    t2Aux = false; 

    t1Aux2 = false; 

    interval1: any; 
    interval2: any; 
    interval3: any; 

    sincronizarTablas: EventEmitter<boolean> = new EventEmitter(); 
    crearTablas34y5: EventEmitter<boolean> = new EventEmitter(); 
    crearTabla4: EventEmitter<boolean> = new EventEmitter(); 
    
    constructor() {}

    sett1(bool: boolean){
        this.t1 = bool; 
    }
    sett2(bool: boolean){
        this.t2 = bool; 
    }
    sett3(bool: boolean){
        this.t3 = bool; 
    }
    sett4(bool: boolean){
        this.t4 = bool; 
    }
    sett5(bool: boolean){
        this.t5 = bool; 
    }

    setT1Aux(bool: boolean){
        this.t1Aux = bool; 
    }

    setT2Aux(bool: boolean){
        this.t2Aux = bool; 
    }

    setT1Aux2(bool: boolean){
        this.t1Aux2 = bool; 
    }

    checkAllTrue() {
        this.interval1 = setInterval(() => {
            if(this.t1 == true && this.t2  == true && this.t3  == true && this.t4 == true && this.t5 == true){
                clearInterval(this.interval1)
                this.sincronizarTablas.next(true); 
                this.resetAll()
                return; 
            } 
        }, 100)
    }

    check1and4True() {
        this.interval1 = setInterval(() => {
            if(this.t1 == true && this.t4 == true ){
                clearInterval(this.interval1)
                this.sincronizarTablas.next(true); 
                this.resetAll()
                return; 
            } 
        }, 100)
    }

    check1and2True(){
        this.interval2 = setInterval(() => {
            if(this.t1Aux == true && this.t2Aux == true ){
                clearInterval(this.interval2)
                this.crearTablas34y5.next(true); 
                this.reset1y2()
                return; 
            } 
        }, 100)
    }

    check1True(){
        this.interval3 = setInterval(() => {
            if(this.t1Aux2 == true  ){
                clearInterval(this.interval3)
                this.crearTabla4.next(true); 
                this.reset1y2()
                return; 
            } 
        }, 100)
    }

    reset1(){
        this.t1Aux2 = false; 
        this.crearTabla4.next(false); 
    }
    reset1y2(){
        this.t1Aux = false; 
        this.t2Aux = false; 
        this.crearTablas34y5.next(false); 
    }
    resetAll(){
        this.t1 = false; 
        this.t2 = false; 
        this.t3 = false; 
        this.t4 = false; 
        this.t5 = false;

        this.t1Aux = false; 
        this.t2Aux = false; 

        this.t1Aux2 = false; 
        this.sincronizarTablas.next(false); 
    }
}
