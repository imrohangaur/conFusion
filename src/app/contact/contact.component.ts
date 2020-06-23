import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { visibility,flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})
export class ContactComponent implements OnInit {

 @ViewChild('fform') feedbackFormDirective;
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  errMess : string;
  feedbackcopy : Feedback;
  visibility = 'shown';
  messagesuccess = true;
  formErrors = {
    'firstname': '',
    'lastname' : '',
    'telnum' : '',
    'email' : ''
  };

  validationMessages = {
    'firstname' : {
      'required' : 'First name is required',
      'minlength' : 'First name must be 2 characters long',
      'maxlength' : 'First name cannot be more than 25 characters long'
    },
    'lastname' : {
      'required' : 'Last name is required',
      'minlength' : 'Last name must be 2 characters long',
      'maxlength' : 'Last name cannot be more than 25 characters long'
    },
    'telnum' : {
      'required' : 'Tel number is required',
      'pattern' : 'Tel. number must contain only numbers'
    },
    'email' : {
      'required' : 'Email is required',
      'email' : 'Email not in valid format'
    }
  };

  constructor(private  fb : FormBuilder, private feedbackService : FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data) );

    this.onValueChanged();  // re(set) form validation messages
  }
  

  onValueChanged(data? : any){
    if(!this.feedbackForm) {return;}
    const form  = this.feedbackForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
    
    

    this.feedbackcopy=this.feedback;
    this.visibility='hidden';
    this.messagesuccess=true;

    this.feedbackService.submitFeedback(this.feedbackcopy)
    .subscribe(feedback => {
        this.feedback = feedback; 
        this.feedbackcopy=feedback;
        this.visibility = 'shown';
        this.represent();
      }, errmess => {this.feedback=null; this.feedbackcopy =null; this.visibility = 'shown'; this.errMess = <any>errmess});
    
  }
  
  represent(){
    setTimeout(()=>{    
      this.messagesuccess = true;
  }, 5000);
  this.messagesuccess=false;
  }

}
