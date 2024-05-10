import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { User } from 'src/app/model/user.interface';
import { UserService } from 'src/app/services/user-services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit  {
 
  userId: number | null = null;
  private sub: Subscription | undefined;
  user: User | null = null;

  constructor(
    private activateRoute: ActivatedRoute,
    private userService: UserService
  ){}
  ngOnInit(): void {
    this.sub = this.activateRoute.params.subscribe(parmas => {
      this.userId = parseInt(parmas['id']);
      this.userService.findOne(this.userId).pipe(
        map((user: User) => this.user = user)
      ).subscribe()
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
