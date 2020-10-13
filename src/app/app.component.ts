import {Component, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState, FormFieldTypes } from '@aws-amplify/ui-components';
import { Auth, API } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  tasks: Array<{ id: string, name: string, any }> = [];

  signUpFormFields: Partial<FormFieldTypes>;

  isLoading = false;

  constructor(private ref: ChangeDetectorRef) {
    this.signUpFormFields = [
      { type: 'username' },
      { type: 'password' },
      { type: 'email' }
    ];
  }

  async ngOnInit(): Promise<void> {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    });
    await this.getTasks();
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    return onAuthUIStateChange;
  }

  async addTask(element): Promise<void> {
    const data = {
      body: {
        name: element.value
      }
    };
    element.value = '';
    this.isLoading = true;
    await API.post('api', '/tasks', data);
    await this.getTasks();
    this.isLoading = false;
  }

  async getCredentials(): Promise<void> {
    console.log(await Auth.currentSession());
    console.log(await Auth.currentCredentials());
  }

  async getTasks(): Promise<void> {
    this.isLoading = true;
    const apiData = await API.get('api', '/tasks', {});
    this.tasks = apiData.data.Items;
    this.isLoading = false;
    this.ref.detectChanges();
  }

  async deleteTask(taskId): Promise<void> {
    this.isLoading = true;
    await API.del('api', `/tasks/${taskId}`, {});
    await this.getTasks();
    this.isLoading = false;
  }

}
