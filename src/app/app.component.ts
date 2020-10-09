import { Component, ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { Auth, API } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  tasks: Array<{ id: string, name: string, any }> = [];

  constructor(private ref: ChangeDetectorRef) {}

  async ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    });
    await this.getTasks();
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }

  async addTask(element) {
    const data = {
      body: {
        name: element.value
      }
    };
    element.value = '';
    await API.post('api', '/tasks', data);
    await this.getTasks();
  }

  async getCredentials() {
    console.log(await Auth.currentSession());
    console.log(await Auth.currentCredentials());
  }

  async getTasks() {
    const apiData = await API.get('api', '/tasks', {});
    this.tasks = apiData.data.Items;
    this.ref.detectChanges();
  }

  async deleteTask(taskId) {
    await API.del('api', `/tasks/${taskId}`, {});
    await this.getTasks();
  }

}
