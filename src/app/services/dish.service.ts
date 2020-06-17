import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable,of } from 'rxjs';
import { delay } from 'rxjs/operators';
  
@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  /*
  getDishes(): Promise<Dish[]> {
    return new Promise(resolve =>{
      //stimulate the server latency with 2 second delay
      setTimeout(() => resolve(DISHES),2000);
    });
  }

  getDish(id: string): Promise<Dish> {
    return new Promise(resolve => {
      //stimulate the server latency with 2 second delay
      setTimeout(() => resolve(DISHES.filter((dish) => ( dish.id === id ) )[0]), 2000);
    });
  }

  getFeaturedDish(): Promise<Dish>{
    return new Promise( resolve => {
      //stimulate the server latency with 2 second delay
      setTimeout(() => resolve(DISHES.filter( (dish) => (dish.featured) )[0]),2000);
    });
  }*/

  //now its by using observables

  getDishes(): Observable<Dish[]> {
    return of(DISHES).pipe(delay(2000));
  }

  getDish(id: string): Observable<Dish> {
    return of(DISHES.filter((dish) => ( dish.id === id ) )[0]).pipe(delay(2000));
  }

  getFeaturedDish(): Observable<Dish>{
    return of(DISHES.filter( (dish) => (dish.featured) )[0]).pipe(delay(2000));
  }  

  getDishIds(): Observable<string [] | any>{
    return of(DISHES.map(dish => dish.id));
  }

}

//earlier it was simply like 
//return Promise.resolve(DISHES);
