import { Component, OnDestroy, OnInit } from '@angular/core';
import { REMINDER_MAX_COUNTER } from '../../reminder.model';
import { ReminderService } from '../../services/reminder.service';
import { Subscription } from 'rxjs';

const ReminderStatus = {
  default: '',
  warning: 'status-warning',
  danger: 'status-danger',
};

@Component({
  selector: 'c8y-reminder-indicator',
  templateUrl: './reminder-indicator.component.html',
  styleUrls: ['./reminder-indicator.component.less'],
})
export class ReminderIndicatorComponent implements OnInit, OnDestroy {
  open = false;
  counter = 0;
  status = ReminderStatus.default;
  maxCounter = REMINDER_MAX_COUNTER;

  private subscription = new Subscription();

  constructor(private reminderService: ReminderService) { }

  ngOnInit(): void {
    // open status
    this.subscription.add(
      this.reminderService.open$.subscribe((open) => {
        this.open = open;
      })
    );

    // reminder counter
    this.subscription.add(
      this.reminderService.reminderCounter$.subscribe((counter) => this.setCounterStatus(counter))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleDrawer(): void {
    this.reminderService.toggleDrawer();
  }

  private setCounterStatus(counter: number) {
    this.counter = counter;

    if (counter >= this.maxCounter) this.status = ReminderStatus.danger;
    else if (counter >= 1) this.status = ReminderStatus.warning;
    else this.status = ReminderStatus.default;
  }
}