import { Component, OnInit, ViewChild } from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  //@ViewChild('cform') commentFormDirective;
  dish : Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment : Comment;
  cformErrors = {
    'comment': '',
    'author' : ''
  };

  validationMessages = {
    'comment' : {
      'required' : 'Comment is required'
    },
    'author' : {
      'required' : 'Auther name is required',
      'minlength' : 'Auther name must be 2 characters long',
      'maxlength' : 'Auther name cannot be more than 25 characters long'
    }
  };


  constructor(private dishService: DishService,
     private location: Location,
     private route: ActivatedRoute,
     private fb: FormBuilder) {

       this.createForm();

      }

  ngOnInit(): void {
    //let id = this.route.snapshot.params['id'];
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.pipe(switchMap(( params: Params) => this.dishService.getDish(params['id'])))
      .subscribe((dish) => {this.dish = dish;  this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index +1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: [5, Validators.required],
      comment: ['', Validators.required],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data) );

    this.onValueChanged();  // re(set) form validation messages
  }

  onValueChanged(data? : any){
    if(!this.commentForm) {return;}
    const form  = this.commentForm;
    for (const field in this.cformErrors){
      if(this.cformErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.cformErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.cformErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    var d = new Date();
    var n = d.toISOString();

    this.comment.date=n;


    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
    });
   // this.commentFormDirective.resetForm();

   this.dish.comments.push(this.comment);


  }

}
