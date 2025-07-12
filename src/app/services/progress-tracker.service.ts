import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ProgressTrackerService {
  progress = 0;

  setLoading(value: number) {
    this.progress = value;
    console.log('Progress value: ', this.progress);
  }
}